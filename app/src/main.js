import './style.css';
import yaml from 'js-yaml';

const D = await (await fetch('/data.json')).json();
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const app = $('#app');
const T = Object.fromEntries(D.tactics.map(t => [t.topic, t]));
const E = Object.fromEntries(D.elements.map(e => [e.id, e]));
// 左から右へ「先に決めるもの → 後で決めるもの」になる順
const COLS = ['el.product', 'el.maintenance', 'el.security', 'el.experience', 'el.business', 'el.brand', 'el.marketing'].filter(id => E[id]);

// ---------- 保存 ----------
const KEY = 'bp.project.v1';
const blank = () => ({ name: '', goal: '', profile: { audience: '', platform: '', money: '', country: '' }, choices: {} });
let P = (() => { try { return { ...blank(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return blank(); } })();
const save = () => localStorage.setItem(KEY, JSON.stringify(P));

// ---------- おすすめと状態 ----------
function aiPick(t) {
  if (t.kind !== 'choose') return null;
  for (const w of t.pick_when || []) if (Object.entries(w.if).every(([k, v]) => P.profile[k] === v)) return { id: w.pick, reason: w.reason_ja, rule: true };
  return t.ai_pick ? { id: t.ai_pick, reason: t.ai_reason_ja } : null;
}
function status(t) {
  const c = P.choices[t.topic];
  if (c?.status === 'decided') return 'done';
  return aiPick(t) ? 'ai' : 'open';
}
const STATUS = { open: '未決', ai: 'AIおすすめあり', done: '決定済み' };
const depsDone = t => t.depends_on.every(d => status(T[d]) === 'done');
function nextSteps() {
  const open = D.tactics.filter(t => status(t) !== 'done');
  const order = t => COLS.indexOf(t.element) * 10 + t.depends_on.length;
  return open.filter(depsDone).sort((a, b) => order(a) - order(b)).slice(0, 3);
}
const itemName = id => D.items[id]?.name || id;
const cost = it => it?.cost ? String(it.cost) : '—';

// ---------- 書き出し（project-map.template.yaml と同じ形） ----------
function projectMap() {
  return {
    domain: 'project_map', name: P.name, goal: P.goal, profile: P.profile,
    elements: D.elements.map(e => e.id),
    choices: D.tactics.map(t => {
      const c = P.choices[t.topic] || {}; const ai = aiPick(t);
      const pick = t.kind === 'choose' ? (c.pick || '') : '';
      return {
        element: t.element, topic: t.topic, status: c.status === 'decided' ? 'decided' : 'open',
        options: t.options, ai_pick: ai?.id || '', reason: c.reason || ai?.reason || '',
        rejected: t.kind === 'choose' ? t.options.filter(o => o !== (pick || ai?.id)).map(o => ({ option: o, why: D.items[o]?.avoid_when || '' })) : [],
        decided_by: c.status === 'decided' ? (c.by || 'human') : '',
        pick, ...(t.kind === 'checklist' ? { checked: c.checked || [] } : {}), last_checked: t.last_checked,
      };
    }),
  };
}
function toMd() {
  const m = projectMap(); const L = [`# ${m.name || '無題のプロジェクト'}`, '', `ゴール：${m.goal || '—'}`, ''];
  for (const c of m.choices) {
    const t = T[c.topic];
    L.push(`## ${t.label_ja}（${c.topic}）— ${c.status === 'decided' ? '決定済み' : '未決'}`);
    if (t.kind === 'choose') {
      L.push(`- 選んだもの：${c.pick ? itemName(c.pick) : '—'}`, `- AIおすすめ：${c.ai_pick ? itemName(c.ai_pick) : '—'}`, `- 理由：${c.reason || '—'}`);
      for (const r of c.rejected) L.push(`- 選ばなかった：${itemName(r.option)} — ${r.why || '—'}`);
    } else for (const o of t.options) L.push(`- [${(c.checked || []).includes(o) ? 'x' : ' '}] ${D.items[o]?.check || itemName(o)}`);
    L.push(`- 情報の確認日：${c.last_checked}`, '');
  }
  return L.join('\n');
}
function download(name, text, type) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click();
  toast(`${name} を保存しました`);
}
let tt; function toast(m) { let el = $('.toast') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'toast' })); el.textContent = m; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('on'), 1800); }

// ---------- 画面1：始める ----------
const Q = [
  ['audience', '誰のためのもの？', '一番使ってほしい人を1つ。', [['self', '自分や知り合い', '小さく試したい'], ['public', '一般のお客さん', '知らない人にも使ってほしい'], ['business', '会社やお店', '仕事で使う人向け']]],
  ['platform', 'どこで使う？', 'あとで増やせます。', [['web', 'ウェブサイト', 'ブラウザで開く'], ['app', 'スマホアプリ', 'App Store などから入れる'], ['both', '両方', 'まずウェブから']]],
  ['money', 'お金はどうする？', '誰が誰に払うか。', [['free', '無料', 'お金は受け取らない'], ['paid', '有料', 'お客さんが自分に払う'], ['marketplace', 'ユーザー同士で売り買い', 'チケット販売など、場所を貸す']]],
  ['country', 'どの国の人向け？', '支払い・法律・言葉が変わります。', [['us', 'アメリカ', ''], ['jp', '日本', ''], ['global', '複数の国', '最初から海外も']]],
];
function viewStart() {
  app.innerHTML = `<section class="start">
    <div class="eyebrow">ステップ 1 / 3</div>
    <h1>何を作りますか？</h1>
    <p class="lead">名前と、ひとことで目的を。いくつか答えると、決めることの地図と、AIのおすすめが出ます。専門用語はいりません。</p>
    <div class="field"><label class="q" for="nm">名前</label><p class="hint">仮でかまいません。</p><input type="text" id="nm" value="${esc(P.name)}" placeholder="例：週末ダンスのチケット"></div>
    <div class="field"><label class="q" for="gl">ひとことで目的</label><p class="hint">「誰の、どんな困りごとを、どう楽にするか」を1文で。</p><input type="text" id="gl" value="${esc(P.goal)}" placeholder="例：主催者が手数料を気にせずチケットを売れるようにする"></div>
    ${Q.map(([k, q, h, opts]) => `<div class="field"><div class="q" style="font-weight:600;margin-bottom:4px">${q}</div><p class="hint">${h}</p>
      <div class="seg" role="group" aria-label="${q}">${opts.map(([v, l, s]) => `<button type="button" data-k="${k}" data-v="${v}" aria-pressed="${P.profile[k] === v}">${l}${s ? `<small>${s}</small>` : ''}</button>`).join('')}</div></div>`).join('')}
    <div class="field row"><button class="btn" id="go">地図を見る</button><span class="muted" style="font-size:13px">答えはこのブラウザの中だけに保存されます。</span></div>
  </section>`;
  app.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
    P.profile[b.dataset.k] = b.dataset.v; save();
    b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
  });
  const sync = () => { P.name = $('#nm').value.trim(); P.goal = $('#gl').value.trim(); save(); };
  $('#nm').oninput = $('#gl').oninput = sync;
  $('#go').onclick = () => { sync(); location.hash = '#/map'; };
}

// ---------- 画面2：地図 ----------
function viewMap() {
  const done = D.tactics.filter(t => status(t) === 'done').length;
  const next = nextSteps();
  app.innerHTML = `<div class="maphead"><div>
      <div class="eyebrow">ステップ 2 / 3</div>
      <h1>${esc(P.name || '無題のプロジェクト')}</h1>
      <p class="lead" style="margin:0">${esc(P.goal || '目的はまだ書かれていません。')} <a href="#/">答えを直す</a></p></div>
    <div class="row"><span class="progress">${done} / ${D.tactics.length} 決定済み</span>
      <button class="btn ghost" id="exy" title="AIが読める形（project-map.yaml）">YAMLで書き出す</button>
      <button class="btn ghost" id="exm" title="人が読む形">Markdownで書き出す</button></div></div>
  <div class="layout">
    <aside class="side top3">
      <div class="panel"><h2>まずここから</h2>${next.length ? `<ol>${next.map(t => `<li><span><a href="#/t/${t.topic}">${esc(t.label_ja)}</a><small>${esc(t.question_ja)}</small></span></li>`).join('')}</ol>` : '<p class="muted" style="margin:0">全部決まりました。書き出してAIに渡しましょう。</p>'}</div>
      <div class="panel legend two"><h2 style="color:var(--fg)">地図の読み方</h2>
        <div><span class="dot open"></span><span><b>未決</b>　まだ何も決まっていない</span></div>
        <div><span class="dot ai"></span><span><b>AIおすすめあり</b>　答えとデータから出した候補。まだ決定ではない</span></div>
        <div><span class="dot done"></span><span><b>決定済み</b>　あなたが決めた</span></div>
        <div><span class="ln"></span><span><b>線</b>　左が先に決めること、右がそのあとで決めること。飾りの線はありません</span></div>
        <div><span class="tag tg">07</span><span><b>番号</b>　作る工程12段階のどこに関わるか（マウスを乗せると名前）</span></div>
        <div><span class="tag tg">列</span><span><b>列</b>　7つの要素＝変わりにくい原則。その下が決めること</span></div>
      </div>
      <div class="panel legend"><h2 style="color:var(--fg)">AIに渡すとき</h2><span>「YAMLで書き出す」のファイルをそのまま渡します。全データは <a href="/data.json">/data.json</a>、説明は <a href="/llms.txt">/llms.txt</a>。</span></div>
    </aside>
    <div class="board" id="board"><svg id="lines" aria-hidden="true"></svg><div class="cols">
      ${COLS.map(id => { const e = E[id]; return `<div class="col"><h3>${esc(e.name_ja)}</h3><p class="pr">${esc(e.principle_ja)}</p>
        <div class="tags">${e.categories.map(c => `<span class="tag" title="${esc(D.categories[c] || '')}">${c}</span>`).join('')}</div>
        ${D.tactics.filter(t => t.element === id).map(t => { const s = status(t); const c = P.choices[t.topic]; const ai = aiPick(t);
          const sub = s === 'done' ? (t.kind === 'choose' ? itemName(c.pick) : '確認ずみ') : (ai ? 'おすすめ：' + itemName(ai.id) : (t.kind === 'checklist' ? `確認 ${t.options.length} 件` : '—'));
          return `<a class="node" href="#/t/${t.topic}" data-topic="${t.topic}" aria-label="${esc(t.label_ja)}：${STATUS[s]}"><span class="dot ${s}"></span><b>${esc(t.label_ja)}</b><small>${esc(sub)}</small>${t.depends_on.length ? `<span class="deps">先に：${t.depends_on.map(d => esc(T[d].label_ja)).join('、')}</span>` : ''}</a>`; }).join('')}
      </div>`; }).join('')}
    </div></div>
</div>`;
  $('#exy').onclick = () => download('project-map.yaml', yaml.dump(projectMap(), { lineWidth: 120 }), 'text/yaml');
  $('#exm').onclick = () => download('project-map.md', toMd(), 'text/markdown');
  drawLines();
  const board = $('#board');
  board.querySelectorAll('.node').forEach(n => {
    n.onmouseenter = n.onfocus = () => hl(n.dataset.topic);
    n.onmouseleave = n.onblur = () => hl(null);
  });
}
function drawLines() {
  const board = $('#board'), svg = $('#lines'); if (!board) return;
  const B = board.getBoundingClientRect(); const box = t => board.querySelector(`[data-topic="${t}"]`).getBoundingClientRect();
  let out = '';
  for (const t of D.tactics) for (const d of t.depends_on) {
    const a = box(d), b = box(t.topic);
    let x1, x2, y1 = a.top + a.height / 2 - B.top, y2 = b.top + b.height / 2 - B.top, path;
    if (Math.abs(a.left - b.left) < 4) { // 同じ列：左の余白を通る
      x1 = a.left - B.left; const xm = x1 - 12;
      path = `M${x1} ${y1}H${xm}V${y2}H${x1}`; x2 = x1;
    } else {
      const fwd = b.left > a.left;
      x1 = (fwd ? a.right : a.left) - B.left; x2 = (fwd ? b.left : b.right) - B.left;
      const xm = fwd ? x2 - 14 : x2 + 14;
      path = `M${x1} ${y1}H${xm}V${y2}H${x2}`;
    }
    out += `<path data-from="${d}" data-to="${t.topic}" d="${path}"/><circle class="end" data-from="${d}" data-to="${t.topic}" cx="${x2}" cy="${y2}" r="2.5"/>`;
  }
  svg.innerHTML = out;
}
function hl(topic) {
  const board = $('#board'); if (!board) return;
  const rel = new Set([topic]);
  board.querySelectorAll('path').forEach(p => {
    const on = topic && (p.dataset.from === topic || p.dataset.to === topic);
    if (on) { rel.add(p.dataset.from); rel.add(p.dataset.to); }
    p.classList.toggle('hl', !!on); p.classList.toggle('dim', !!topic && !on);
  });
  board.querySelectorAll('.node').forEach(n => n.classList.toggle('hl', !!topic && rel.has(n.dataset.topic) && n.dataset.topic !== topic));
}
addEventListener('resize', () => requestAnimationFrame(drawLines));

// ---------- 画面3：決める ----------
function viewTopic(topic) {
  const t = T[topic]; if (!t) { location.hash = '#/map'; return; }
  const e = E[t.element]; const ai = aiPick(t); const c = P.choices[topic] || {};
  const s = status(t); const choose = t.kind === 'choose';
  let sel = choose ? (c.pick || ai?.id || '') : new Set(c.checked || []);
  const blocked = t.depends_on.filter(d => status(T[d]) !== 'done');
  const verified = it => it?.verified ? `<span class="badge ok">確認済み${it.checked ? ' ' + esc(it.checked) : ''}</span>` : `<span class="badge">未確認（使う前に公式で確認）</span>`;
  const optHtml = id => { const it = D.items[id] || { name: id }; const isAi = ai?.id === id;
    return `<div class="opt" role="${choose ? 'radio' : 'checkbox'}" tabindex="0" data-id="${id}" aria-checked="false">
      <span class="box ${choose ? 'radio' : ''}"></span><div>
      <h4>${esc(it.name)} ${isAi ? '<span class="badge ai">AIおすすめ</span>' : ''} ${verified(it)}</h4>
      <dl>${it.what ? `<dt>${choose ? 'なにか' : '原則'}</dt><dd>${esc(it.what)}</dd>` : ''}
        ${it.best_for ? `<dt>向いている</dt><dd>${esc(it.best_for)}</dd>` : ''}
        ${it.avoid_when ? `<dt>${choose ? '向かない' : '避ける形'}</dt><dd>${esc(it.avoid_when)}</dd>` : ''}
        ${it.why ? `<dt>なぜ</dt><dd>${esc(it.why)}</dd>` : ''}
        ${!choose && it.check ? `<dt>確認</dt><dd>${esc(it.check)}</dd>` : ''}
        ${choose ? `<dt>費用</dt><dd>${esc(cost(it))}</dd>` : ''}
        ${it.url ? `<dt>出典</dt><dd><a href="${esc(it.url)}" target="_blank" rel="noopener">公式ページ</a></dd>` : ''}
      </dl><div class="id">AI用ID：${id}</div></div></div>`; };
  app.innerHTML = `<div class="eyebrow">ステップ 3 / 3 ・ ${esc(e.name_ja)}</div>
    <div class="detail"><section>
      <h1>${esc(t.label_ja)}</h1><p class="lead">${esc(t.question_ja)}</p>
      ${ai ? `<div class="pick"><div class="k">AIのおすすめ</div><h2 style="margin:4px 0">${esc(itemName(ai.id))}</h2><div class="muted">${esc(ai.reason)}${ai.rule ? '（あなたの答えから）' : ''}</div></div>` : ''}
      <h2>${choose ? '選択肢（1つ選ぶ）' : '確認すること（全部チェック）'}</h2>
      <div class="opts" role="${choose ? 'radiogroup' : 'group'}">${t.options.map(optHtml).join('')}</div>
      ${choose ? `<div class="rej"><h2>選ばなかったものと理由</h2><ul id="rej"></ul></div>` : ''}
    </section>
    <aside class="side"><div class="panel">
      <div class="status"><span class="dot ${s}"></span>${STATUS[s]}</div>
      ${blocked.length ? `<p class="muted" style="font-size:13px;margin:0 0 12px">先に決めると楽：${blocked.map(d => `<a href="#/t/${d}">${esc(T[d].label_ja)}</a>`).join('、')}</p>` : ''}
      <div style="display:grid;gap:8px">
        ${choose && ai ? `<button class="btn" id="acc">おすすめで決める</button>` : ''}
        <button class="btn ${choose && ai ? 'ghost' : ''}" id="dec">${choose ? '選んだものに決める' : '確認したので決定'}</button>
        ${s === 'done' ? `<button class="btn ghost" id="undo">未決に戻す</button>` : ''}
        <a class="btn ghost" href="#/map">地図に戻る</a>
      </div>
      <p class="muted" style="font-size:12px;margin:16px 0 0">情報の確認日：${esc(t.last_checked)}<br>${t.check_cadence === 'deep_when_used' ? '使うと決めたら、料金と規約を公式ページで確認します。' : '新しい選択肢が出ていないか毎日見ます。'}</p>
    </div></aside></div>`;
  const opts = [...app.querySelectorAll('.opt')];
  const paint = () => {
    opts.forEach(o => o.setAttribute('aria-checked', choose ? o.dataset.id === sel : sel.has(o.dataset.id)));
    if (choose) $('#rej').innerHTML = t.options.filter(o => o !== sel).map(o => `<li><b>${esc(itemName(o))}</b> — ${esc(D.items[o]?.avoid_when || (D.items[o]?.best_for ? '向いているのは：' + D.items[o].best_for + '。今回の答えとは合わない' : '理由はまだ書かれていません'))}</li>`).join('');
    else $('#dec').disabled = sel.size !== t.options.length;
  };
  opts.forEach(o => { const f = () => { if (choose) sel = o.dataset.id; else sel.has(o.dataset.id) ? sel.delete(o.dataset.id) : sel.add(o.dataset.id); paint(); };
    o.onclick = f; o.onkeydown = ev => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); f(); } }; });
  paint();
  const decide = (by) => {
    if (choose) P.choices[topic] = { status: 'decided', pick: sel, by, reason: sel === ai?.id ? ai.reason : '自分で選んだ' };
    else P.choices[topic] = { status: 'decided', checked: [...sel], by: 'human' };
    save(); toast(`${t.label_ja}：決定しました`); location.hash = '#/map';
  };
  if ($('#acc')) $('#acc').onclick = () => { sel = ai.id; decide('ai'); };
  $('#dec').onclick = () => decide('human');
  if ($('#undo')) $('#undo').onclick = () => { delete P.choices[topic]; save(); viewTopic(topic); };
}

// ---------- ルーター ----------
function route() {
  const h = location.hash.slice(1) || '/'; const [, r, arg] = h.split('/');
  const name = r === 'map' ? 'map' : r === 't' ? 'topic' : 'start';
  document.querySelectorAll('.steps [data-r]').forEach(a => a.classList.toggle('on', a.dataset.r === name));
  scrollTo(0, 0);
  name === 'map' ? viewMap() : name === 'topic' ? viewTopic(arg) : viewStart();
}
addEventListener('hashchange', route);
$('#theme').onclick = () => { const d = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = d; localStorage.setItem('bp.theme', d); };
route();

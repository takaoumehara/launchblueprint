import './style.css';
import yaml from 'js-yaml';

const D = await (await fetch('/data.json')).json();
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const app = $('#app');
const T = Object.fromEntries(D.tactics.map(t => [t.topic, t]));
const E = Object.fromEntries(D.elements.map(e => [e.id, e]));
const LANES = D.lanes;

// ---------- 保存 ----------
const KEY = 'bp.project.v1';
const blank = () => ({ name: '', goal: '', profile: { audience: '', platform: '', money: '', country: '' }, choices: {} });
let P = (() => { try { return { ...blank(), ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return blank(); } })();
const save = () => localStorage.setItem(KEY, JSON.stringify(P));

// ---------- ことば：専門用語 → ふつうの日本語（専門用語） ----------
const TERMS = [...D.glossary].sort((a, b) => b.term.length - a.term.length);
function gloss(text, used) {
  let s = esc(text); const slots = [];
  for (const g of TERMS) {
    const ascii = /^[\x00-\x7f]+$/.test(g.term);
    const re = new RegExp((ascii ? '(?<![A-Za-z])' : '') + g.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + (ascii ? '(?![A-Za-z])' : ''), 'g');
    s = s.replace(re, () => { used?.add(g.term); slots.push(g); return `\u0000${slots.length - 1}\u0000`; });
  }
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => { const g = slots[i]; return `<abbr title="${esc(g.one_line)}">${esc(g.plain)}（${esc(g.term)}）</abbr>`; });
}

// ---------- おすすめと状態 ----------
function aiPick(t) {
  if (t.kind !== 'choose') return null;
  for (const w of t.pick_when || []) if (Object.entries(w.if).every(([k, v]) => P.profile[k] === v)) return { id: w.pick, reason: w.reason_ja, rule: true };
  return t.ai_pick ? { id: t.ai_pick, reason: t.ai_reason_ja } : null;
}
const status = t => P.choices[t.topic]?.status === 'decided' ? 'done' : aiPick(t) ? 'ai' : 'open';
const STATUS = { open: '未決', ai: '仮', done: '決定' };
const STATUS_LONG = { open: '未決', ai: '仮（AIのおすすめあり）', done: '決定' };
const depsDone = t => t.depends_on.every(d => status(T[d]) === 'done');
const depth = (t, seen = new Set()) => seen.has(t.topic) ? 0 : (seen.add(t.topic), t.depends_on.length ? 1 + Math.max(...t.depends_on.map(d => depth(T[d], seen))) : 0);
function nextSteps() {
  return D.tactics.filter(t => status(t) !== 'done' && depsDone(t)).sort((a, b) => depth(a) - depth(b) || LANES.findIndex(l => l.id === a.lane) - LANES.findIndex(l => l.id === b.lane)).slice(0, 3);
}
const itemName = id => D.items[id]?.name || id;
const shortName = id => itemName(id).replace(/\s*([（(]|\s\/\s).*$/, '');
const links = () => D.tactics.flatMap(t => t.depends_on.map(d => [d, t.topic]));

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
        pick, ...(t.kind === 'checklist' ? { checked: c.checked || [] } : {}), depends_on: t.depends_on, last_checked: t.last_checked,
      };
    }),
  };
}
function toMd() {
  const m = projectMap(); const L = [`# ${m.name || '無題のプロジェクト'}`, '', `ゴール：${m.goal || '—'}`, ''];
  for (const c of m.choices) {
    const t = T[c.topic];
    L.push(`## ${t.label_ja}（${c.topic}）— ${c.status === 'decided' ? '決定' : '未決'}`);
    if (t.depends_on.length) L.push(`- 先に決めること：${t.depends_on.map(d => T[d].label_ja).join('、')}`);
    if (t.kind === 'choose') {
      L.push(`- 選んだもの：${c.pick ? itemName(c.pick) : '—'}`, `- AIおすすめ：${c.ai_pick ? itemName(c.ai_pick) : '—'}`, `- 理由：${c.reason || '—'}`);
      for (const r of c.rejected) L.push(`- 選ばなかった：${itemName(r.option)} — ${r.why || '—'}`);
    } else for (const o of t.options) L.push(`- [${(c.checked || []).includes(o) ? 'x' : ' '}] ${D.items[o]?.check || D.items[o]?.what || itemName(o)}`);
    L.push(`- 情報の確認日：${c.last_checked}`, '');
  }
  return L.join('\n');
}
function download(name, text, type) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click();
  toast(`${name} を保存しました`);
}
let tt; function toast(m) { const el = $('.toast') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'toast mono' })); el.textContent = m; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('on'), 1800); }
const exportYaml = () => download('project-map.yaml', yaml.dump(projectMap(), { lineWidth: 120 }), 'text/yaml');
const exportMd = () => download('project-map.md', toMd(), 'text/markdown');

// ---------- 画面1：始める ----------
const Q = [
  ['audience', '誰のためのもの？', '一番使ってほしい人を1つ。', [['self', '自分や知り合い', '小さく試したい'], ['public', '一般のお客さん', '知らない人にも使ってほしい'], ['business', '会社やお店', '仕事で使う人向け']]],
  ['platform', 'どこで使う？', 'あとで増やせます。', [['web', 'ウェブサイト', 'ブラウザで開く'], ['app', 'スマホアプリ', 'App Store などから入れる'], ['both', '両方', 'まずウェブから']]],
  ['money', 'お金はどうする？', '誰が誰に払うか。', [['free', '無料', 'お金は受け取らない'], ['paid', '有料', 'お客さんが自分に払う'], ['marketplace', 'ユーザー同士で売り買い', 'チケット販売など、場所を貸す']]],
  ['country', 'どの国の人向け？', '支払い・法律・言葉が変わります。', [['us', 'アメリカ', '英語・ドル'], ['jp', '日本', '日本語・円'], ['global', '複数の国', '最初から海外も']]],
];
function viewStart() {
  const n = (i) => String(i).padStart(2, '0');
  app.innerHTML = `<section class="page">
    <div class="mono m2">01 — START ・ 始める</div>
    <h1>何を作りますか？</h1>
    <p class="lead">名前と、ひとことで目的を。4つ答えると、決めることが全部ひと目で並び、AIのおすすめが付きます。専門用語はいりません。</p>
    <div class="q"><div class="k"><div class="mono m3">${n(1)}</div><label class="t" for="nm">名前</label><div class="h">仮でかまいません。</div></div><div><input type="text" id="nm" value="${esc(P.name)}" placeholder="例：週末ダンスのチケット"></div></div>
    <div class="q"><div class="k"><div class="mono m3">${n(2)}</div><label class="t" for="gl">ひとことで目的</label><div class="h">誰の、どんな困りごとを、どう楽にするか。</div></div><div><input type="text" id="gl" value="${esc(P.goal)}" placeholder="例：主催者が手数料を気にせずチケットを売れるようにする"></div></div>
    ${Q.map(([k, q, h, opts], i) => `<div class="q"><div class="k"><div class="mono m3">${n(i + 3)}</div><div class="t">${q}</div><div class="h">${h}</div></div>
      <div class="seg" role="group" aria-label="${q}">${opts.map(([v, l, s]) => `<button type="button" data-k="${k}" data-v="${v}" aria-pressed="${P.profile[k] === v}"><span>${l}</span><small>${s}</small><span class="dot"></span></button>`).join('')}</div></div>`).join('')}
    <div class="q"><div class="k"></div><div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap"><button class="btn" id="go">地図を見る　→</button><span class="mono m3">答えはこのブラウザの中だけに保存</span></div></div>
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
let traceOnly = false;
function layout(W, H) {
  const x0 = 120, x1 = Math.max(x0 + 600, W - 300), y0 = 210, y1 = H - 250;
  const lx = i => x0 + (x1 - x0) * i / (LANES.length - 1);
  const by = Object.fromEntries(LANES.map(l => [l.id, D.tactics.filter(t => t.lane === l.id).sort((a, b) => depth(a) - depth(b))]));
  const max = Math.max(...Object.values(by).map(a => a.length));
  const step = Math.min(56, (y1 - y0) / Math.max(1, max - 1));
  const pos = {};
  const place = () => LANES.forEach((l, i) => by[l.id].forEach((t, j) => pos[t.topic] = { x: lx(i), y: y0 + j * step }));
  place();
  // 線が交差しにくいよう、つながり先の平均の高さで並べ直す（2回）
  for (let k = 0; k < 2; k++) {
    for (const l of LANES) {
      const bary = t => { const ns = [...t.depends_on, ...D.tactics.filter(u => u.depends_on.includes(t.topic)).map(u => u.topic)].filter(n => T[n].lane !== l.id);
        return ns.length ? ns.reduce((s, n) => s + pos[n].y, 0) / ns.length : pos[t.topic].y; };
      by[l.id].sort((a, b) => bary(a) - bary(b));
    }
    place();
  }
  return { pos, lx, y0, step };
}
function rnd(seed) { let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function strands(pos) {
  let out = '';
  for (const [a, b] of links()) {
    const tr = status(T[a]) === 'done' && status(T[b]) === 'done';
    const n = tr ? 14 : 7, r = rnd(a + b);
    let p = pos[a], q = pos[b];
    if (p.x > q.x) [p, q] = [q, p];
    for (let k = 0; k < n; k++) {
      const f = k - (n - 1) / 2, j = (r() - .5);
      let d;
      if (Math.abs(p.x - q.x) < 2) { // 同じ列：左にふくらむ弧
        const bx = p.x - 26 - Math.abs(f) * 1.8 - j * 4; const ya = Math.min(p.y, q.y), yb = Math.max(p.y, q.y);
        d = `M${p.x - 4} ${ya + f * .25}C${bx} ${ya + f * .5},${bx} ${yb + f * .5},${p.x - 4} ${yb + f * .25}`;
      } else {
        const dx = (q.x - p.x) * (.42 + j * .12), cs = f * 2.6 + j * 3;
        d = `M${p.x + 4} ${p.y + f * .3}C${p.x + dx} ${p.y + cs},${q.x - dx} ${q.y + cs},${q.x - 4} ${q.y + f * .3}`;
      }
      out += `<path class="${tr ? 'tr' : ''}" data-a="${a}" data-b="${b}" d="${d}"/>`;
    }
  }
  return out;
}
function viewMap() {
  const narrow = innerWidth <= 900;
  const done = D.tactics.filter(t => status(t) === 'done').length;
  const next = nextSteps();
  const W = Math.max(innerWidth, 1100), H = Math.max(innerHeight - 48, 860);
  const { pos, lx, y0 } = layout(W, H);
  const nodeSub = t => { const s = status(t); const c = P.choices[t.topic]; const ai = aiPick(t);
    if (s === 'done') return '決定' + (t.kind === 'choose' ? ' · ' + shortName(c.pick) : ' · 確認ずみ');
    if (s === 'ai') return '仮 · ' + shortName(ai.id);
    return '未決 · 確認 ' + t.options.length + ' 件'; };
  const quietNext = `<div class="mono m3">まずここから</div>${next.length ? `<ol>${next.map((t, i) => `<li><a href="#/t/${t.topic}"><span class="n">${i + 1}</span><span>${esc(t.label_ja)}<span class="m2"> — ${esc(t.question_ja)}</span></span></a></li>`).join('')}</ol>` : '<div>全部決まりました。書き出してAIに渡しましょう。</div>'}`;
  const legend = `<div class="mono m3">読み方</div><div class="lg">
    <span class="dot"></span><span>未決 — まだ何も決まっていない</span>
    <span class="dot ai"></span><span>仮 — AIのおすすめがある（まだ決定ではない）</span>
    <span class="dot done"></span><span>決定 — あなたが決めた</span>
    <span class="ln"></span><span>線 — 先に決めること → あとで決めること（全部本物のつながり）</span>
    <span class="ln acc"></span><span>オレンジ — 決めた道すじ</span></div>`;
  app.innerHTML = `<section class="canvas" style="height:${H}px;--gap:${Math.round(lx(1) - lx(0) - 28)}px">
    <div class="corner tl mono"><div>BLUEPRINT — MAP</div><div class="m2">CREATIVITY IS EVERYWHERE, LLC</div></div>
    <div class="corner tr mono"><div class="m1">${esc(P.name || 'UNTITLED')} · ${D.generated}</div><div class="m2">${D.tactics.length} NODES · ${links().length} LINKS · TRACE ${done}</div>
      <div style="margin-top:10px"><button id="exy">EXPORT YAML</button><span class="m3"> · </span><button id="exm">MARKDOWN</button><span class="m3"> · </span><a href="#/" style="text-decoration:none" class="m1">EDIT ANSWERS</a></div></div>
    <svg id="strands" class="${traceOnly ? 'traceonly' : ''}" aria-hidden="true">${strands(pos)}</svg>
    ${LANES.map((l, i) => `<div class="lane" style="left:${lx(i) - 3.5}px;top:${y0 - 72}px"><div class="mono m3">${String(i + 1).padStart(2, '0')}</div><div class="mono">${esc(l.label)}</div><div class="ja">${esc(l.ja)}</div></div>`).join('')}
    ${D.tactics.map(t => { const s = status(t); const p = pos[t.topic];
      return `<a class="node ${s}" href="#/t/${t.topic}" data-topic="${t.topic}" style="left:${p.x}px;top:${p.y}px" aria-label="${esc(t.label_ja)}：${STATUS_LONG[s]}"><span class="dot ${s}"></span><span><b>${esc(t.label_ja)}</b><small>${esc(nodeSub(t))}</small></span></a>`; }).join('')}
    <div class="quiet" style="left:28px;bottom:84px">${quietNext}</div>
    <div class="quiet" style="left:${Math.min(380, W * .3)}px;bottom:84px;max-width:340px">${legend}</div>
    <div class="corner bl mono m2"><div><a href="/data.json">/DATA.JSON</a> · <a href="/llms.txt">/LLMS.TXT</a></div><div class="m3">HOVER A DOT · CLICK FOR DETAIL · T TRACE</div></div>
    <div class="corner br"><div class="mono m2">TRACE — 決めたステップの数</div><div class="num">${String(done).padStart(2, '0')}</div></div>
  </section>
  <section class="list"><div class="page">
    <div class="mono m2">02 — MAP ・ ${D.tactics.length} NODES · TRACE ${done}</div>
    <h1>${esc(P.name || '無題のプロジェクト')}</h1><p class="lead">${esc(P.goal || '目的はまだ書かれていません。')}</p>
    <div class="quiet" style="position:static;max-width:none;margin-bottom:24px">${quietNext}</div>
    ${LANES.map((l, i) => `<div class="lsec"><div class="mono"><span class="m3">${String(i + 1).padStart(2, '0')}</span> ${esc(l.label)} <span class="m2">· ${esc(l.ja)}</span></div>
      ${D.tactics.filter(t => t.lane === l.id).map(t => { const s = status(t); return `<a class="lrow ${s}" href="#/t/${t.topic}"><span class="dot ${s}"></span><span><b>${esc(t.label_ja)}</b><small>${t.depends_on.length ? '先に：' + t.depends_on.map(d => esc(T[d].label_ja)).join('、') : '最初に決められる'}</small></span><span class="mono m2">${STATUS[s]}</span></a>`; }).join('')}</div>`).join('')}
    <div class="quiet" style="position:static;max-width:none;margin-top:24px">${legend}</div>
    <div style="display:flex;gap:8px;margin-top:24px"><button class="btn line" id="exy2">YAMLで書き出す</button><button class="btn line" id="exm2">Markdown</button></div>
  </div></section>`;
  for (const id of ['exy', 'exy2']) $('#' + id).onclick = exportYaml;
  for (const id of ['exm', 'exm2']) $('#' + id).onclick = exportMd;
  const svg = $('#strands');
  app.querySelectorAll('.node').forEach(n => {
    const on = () => { const t = n.dataset.topic; svg.classList.add('focus');
      const rel = new Set([t]);
      svg.querySelectorAll('path').forEach(p => { const hit = p.dataset.a === t || p.dataset.b === t; p.classList.toggle('on', hit); if (hit) { rel.add(p.dataset.a); rel.add(p.dataset.b); } });
      app.querySelectorAll('.node').forEach(m => m.classList.toggle('on', rel.has(m.dataset.topic) && m !== n)); };
    const off = () => { svg.classList.remove('focus'); app.querySelectorAll('.node.on').forEach(m => m.classList.remove('on')); };
    n.onmouseenter = n.onfocus = on; n.onmouseleave = n.onblur = off;
  });
}
addEventListener('keydown', e => { if (e.key.toLowerCase() === 't' && !/input|textarea/i.test(e.target.tagName) && $('#strands')) { traceOnly = !traceOnly; $('#strands').classList.toggle('traceonly', traceOnly); } });
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (location.hash.startsWith('#/map')) viewMap(); }, 120); });

// ---------- スタック比較（R-030） ----------
function compareHtml(c, used) {
  const nm = s => D.items[s.id]?.name || s.name || s.id;
  const v = s => s.verified ? `<span class="tagv ok">確認済み ${esc(s.checked)}</span>` : `<span class="tagv">未確認</span>`;
  return `<div class="cmp"><div class="mono m3">スタック比較 — 無料枠・組み合わせ・切り替えの境目</div>
    <div class="cmp-h">1 同じ・似た機能のサービスと無料枠</div>
    <table><thead><tr><th>サービス</th><th>無料でできること</th><th>安い有料プラン</th><th>出典</th></tr></thead><tbody>
    ${c.services.map(s => `<tr><td><b>${esc(nm(s))}</b></td><td>${gloss(s.free_tier, used)}</td><td>${gloss(s.paid_entry, used)}</td><td>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">公式 ↗</a><br>` : ''}${v(s)}</td></tr>`).join('')}</tbody></table>
    <div class="cmp-h">2 1社でそろえる か 無料枠を組み合わせる か</div>
    <dl class="cmp-dl"><dt>1社</dt><dd>${gloss(c.combine.single, used)}</dd><dt>組み合わせ</dt><dd>${gloss(c.combine.combined, used)}</dd><dt>増える手間・危険</dt><dd>${gloss(c.combine.risks, used)}</dd></dl>
    <div class="cmp-h">3 お金を払った方が楽になる境目</div>
    <ol class="cmp-sw">${c.switch_points.map(w => `<li><b>${gloss(w.when, used)}</b><span>→ ${gloss(w.upgrade_to, used)}</span><small>${gloss(w.why, used)}</small></li>`).join('')}</ol>
    <div class="cmp-h">4 おすすめ</div>
    <div class="pick" style="margin:0"><div class="nm">${esc(itemName(c.recommendation.pick))}</div><div class="m1">${gloss(c.recommendation.reason, used)}</div></div>
    <ul class="cmp-rej">${c.recommendation.rejected.map(r => `<li><b>${esc(D.items[r.option]?.name || c.services.find(s => s.id === r.option)?.name || r.option)}</b><span>${gloss(r.why, used)}</span></li>`).join('')}</ul>
  </div>`;
}

// ---------- 画面3：決める ----------
function viewTopic(topic) {
  const t = T[topic]; if (!t) { location.hash = '#/map'; return; }
  const e = E[t.element]; const lane = LANES.find(l => l.id === t.lane); const ai = aiPick(t); const c = P.choices[topic] || {};
  const s = status(t); const choose = t.kind === 'choose'; const used = new Set();
  let sel = choose ? (c.pick || ai?.id || '') : new Set(c.checked || []);
  const blocked = t.depends_on.filter(d => status(T[d]) !== 'done');
  const later = D.tactics.filter(u => u.depends_on.includes(topic));
  const verified = it => it?.verified === true || it?.verified === 'True' ? `<span class="tagv ok">確認済み${it.checked ? ' ' + esc(it.checked) : ''}</span>` : `<span class="tagv">未確認 — 使う前に公式で確認</span>`;
  const optHtml = id => { const it = D.items[id] || { name: id }; const isAi = ai?.id === id;
    return `<div class="opt" role="${choose ? 'radio' : 'checkbox'}" tabindex="0" data-id="${id}" aria-checked="false">
      <span class="mark ${choose ? 'r' : ''}"></span><div>
      <div class="nm2"><span>${esc(it.name)}</span>${isAi ? '<span class="tagv ai">AIのおすすめ</span>' : ''}${verified(it)}</div>
      <dl>${it.what ? `<dt>${choose ? 'なにか' : '内容'}</dt><dd>${gloss(it.what, used)}</dd>` : ''}
        ${it.best_for ? `<dt>向いている</dt><dd>${gloss(it.best_for, used)}</dd>` : ''}
        ${it.avoid_when ? `<dt>${choose ? '向かない' : '避ける形'}</dt><dd>${gloss(it.avoid_when, used)}</dd>` : ''}
        ${it.why ? `<dt>なぜ</dt><dd>${gloss(it.why, used)}</dd>` : ''}
        ${!choose && it.check ? `<dt>確認</dt><dd>${gloss(it.check, used)}</dd>` : ''}
        ${choose ? `<dt>費用</dt><dd>${it.cost ? gloss(String(it.cost), used) : 'まだ調べていません'}</dd>` : ''}
        ${it.url ? `<dt>出典</dt><dd><a href="${esc(it.url)}" target="_blank" rel="noopener">公式ページ ↗</a></dd>` : ''}
        <dt>AI用ID</dt><dd class="mono m3" style="text-transform:none">${id}</dd>
      </dl></div></div>`; };
  const opts = t.options.map(optHtml).join('');
  app.innerHTML = `<section class="page"><div class="mono m2">03 — ${esc(lane.label)} ・ ${esc(e.name_ja)}</div>
    <div class="detail"><div>
      <h1>${esc(t.label_ja)}</h1><p class="lead">${esc(t.question_ja)}</p>
      ${ai ? `<div class="pick"><div class="mono" style="color:var(--acc)">AIのおすすめ${ai.rule ? ' · あなたの答えから' : ''}</div><div class="nm">${esc(itemName(ai.id))}</div><div class="m1">${gloss(ai.reason, used)}</div></div>` : ''}
      <div class="mono m3" style="margin-bottom:8px">${choose ? '選択肢 — 1つ選ぶ' : '確認すること — 全部チェック'}</div>
      <div class="opts" role="${choose ? 'radiogroup' : 'group'}">${opts}</div>
      ${choose ? `<div class="rej"><div class="mono m3" style="margin-bottom:8px">選ばなかったものと理由</div><ul id="rej"></ul></div>` : ''}
      ${D.comparisons[topic] ? compareHtml(D.comparisons[topic], used) : ''}
    </div>
    <aside class="side">
      <div><div class="mono m3">状態</div><div style="display:flex;gap:10px;align-items:center;margin-top:6px"><span class="dot ${s}"></span>${STATUS_LONG[s]}</div></div>
      <div class="acts">
        ${choose && ai ? `<button class="btn acc" id="acc">おすすめで決める</button>` : ''}
        <button class="btn ${choose && ai ? 'line' : ''}" id="dec">${choose ? '選んだものに決める' : '確認したので決定'}</button>
        ${s === 'done' ? `<button class="btn line" id="undo">未決に戻す</button>` : ''}
        <a class="btn line" href="#/map">← 地図に戻る</a>
      </div>
      <div class="gl"><div class="mono m3">つながり</div>
        <div>先に決めること：${t.depends_on.length ? t.depends_on.map(d => `<a href="#/t/${d}">${esc(T[d].label_ja)}</a>${status(T[d]) === 'done' ? '' : '（未決）'}`).join('、') : 'なし（最初に決められる）'}</div>
        <div>これで決まること：${later.length ? later.map(u => `<a href="#/t/${u.topic}">${esc(u.label_ja)}</a>`).join('、') : 'なし'}</div>
        ${blocked.length ? `<div class="m2">先に「${esc(T[blocked[0]].label_ja)}」を決めると楽です。</div>` : ''}</div>
      <div class="gl" id="words"></div>
      <div class="mono m3" style="text-transform:none;letter-spacing:.02em">情報の確認日 ${esc(t.last_checked)}<br>${t.check_cadence === 'deep_when_used' ? '使うと決めたら、料金と規約を公式ページで確認します。' : '新しい選択肢が出ていないか毎日見ます。'}</div>
    </aside></div></section>`;
  const optEls = [...app.querySelectorAll('.opt')];
  const paint = () => {
    optEls.forEach(o => o.setAttribute('aria-checked', choose ? o.dataset.id === sel : sel.has(o.dataset.id)));
    if (choose) $('#rej').innerHTML = t.options.filter(o => o !== sel).map(o => `<li><b>${esc(itemName(o))}</b><span>${gloss(D.items[o]?.avoid_when || '', used)}</span></li>`).join('');
    else $('#dec').disabled = sel.size !== t.options.length;
    $('#words').innerHTML = used.size ? `<div class="mono m3">ことば</div>${D.glossary.filter(g => used.has(g.term)).map(g => `<div><b>${esc(g.plain)}</b>（${esc(g.term)}）— ${esc(g.one_line)}</div>`).join('')}` : '';
  };
  optEls.forEach(o => { const f = () => { if (choose) sel = o.dataset.id; else sel.has(o.dataset.id) ? sel.delete(o.dataset.id) : sel.add(o.dataset.id); paint(); };
    o.onclick = ev => { if (ev.target.closest('a')) return; f(); }; o.onkeydown = ev => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); f(); } }; });
  paint();
  const decide = by => {
    if (choose) P.choices[topic] = { status: 'decided', pick: sel, by, reason: sel === ai?.id ? ai.reason : '自分で選んだ' };
    else P.choices[topic] = { status: 'decided', checked: [...sel], by: 'human' };
    save(); toast(`${t.label_ja} — 決定`); location.hash = '#/map';
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

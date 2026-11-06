// Blueprint browser workspace. All agent-supplied text goes through textContent (h()), never innerHTML.
const MSG = {
  ja: { title: 'Blueprint ワークスペース', skip: '決定待ちへ移動', project: 'プロジェクト', lang: 'EN', theme: '明暗', export: '書き出す', import: '取り込む', newp: '新しいプロジェクト', name: '名前', goal: '目的（ひとこと）', create: '作成', open: '開く', none: 'まだプロジェクトがありません。', local: 'データはこの PC の中だけ。', back: '一覧へ',
    needs: '決めてください', needsNone: '決定待ちはありません。AI が提案するとここに並びます。', approve: '承認', reject: '却下', proposed: '提案中', approved: '承認済み', rejected: '却下', stale: '古い提案', withdrawn: '取り下げ', open_: '未決', decided: '決定', changed: '更新あり', by: n => `提案: ${n}`,
    was: '現在', now: '提案', why: '理由', alts: '他の選択肢', affects: 'この決定で影響を受ける項目', needsFirst: '先に決めること', none_: 'なし', staleNote: '提案のあとで別の決定が入りました。上書きしません。却下するか、AI に出し直してもらってください。', undecidedDep: '未決', decideSelf: '自分で決める', choose: 'これに決める', compare: '比較', switchWhen: '有料に切り替える目安', cost: '費用', avoid: '避ける場面', history: '履歴', changes: '変更', markSeen: '確認した', newSince: n => `前回から ${n} 件`, empty: '地図の項目を選ぶと、理由・代わりの案・影響先が出ます。',
    all: 'すべて', stage: { idea: 'アイデア', launch: 'ローンチ', operate: '運用', scale: '拡大', exit: '出口' }, lane: { brand: 'ブランド', ux: 'UX', ui: 'UI', tech: '技術', biz: '事業・法務', rules: 'ルール' },
    agentProposed: (t, p) => `AI が提案: ${t} → ${p}`, approvedMsg: t => `承認しました: ${t}`, rejectedMsg: t => `却下しました: ${t}`, errStale: '別の決定が先に入っていたため、適用しませんでした。', errChanged: '提案が更新されました。内容を確認してください。', errGeneric: '失敗しました。', mapLabel: '決めることの地図', opts: '選択肢', ev: { created: '作成', proposed: '提案', amended: '提案を更新', approved: '承認', rejected: '却下', stale: '古くなった', withdrawn: '取り下げ', decided: '自分で決定', imported: '取り込み' } },
  en: { title: 'Blueprint workspace', skip: 'Skip to decisions', project: 'Project', lang: 'JA', theme: 'Light/Dark', export: 'Export', import: 'Import', newp: 'New project', name: 'Name', goal: 'Goal (one line)', create: 'Create', open: 'Open', none: 'No projects yet.', local: 'Data stays on this computer.', back: 'All projects',
    needs: 'Needs your decision', needsNone: 'Nothing waiting. AI proposals will appear here.', approve: 'Approve', reject: 'Reject', proposed: 'Proposed', approved: 'Approved', rejected: 'Rejected', stale: 'Stale', withdrawn: 'Withdrawn', open_: 'Open', decided: 'Decided', changed: 'Updated', by: n => `Proposed by ${n}`,
    was: 'Current', now: 'Proposed', why: 'Why', alts: 'Alternatives', affects: 'Affected by this decision', needsFirst: 'Decide first', none_: 'None', staleNote: 'A different decision was made after this was proposed. It will not overwrite it. Reject it, or ask the agent to propose again.', undecidedDep: 'open', decideSelf: 'Decide myself', choose: 'Choose this', compare: 'Comparison', switchWhen: 'When a paid plan is worth it', cost: 'Cost', avoid: 'Avoid when', history: 'History', changes: 'Changes', markSeen: 'Mark as seen', newSince: n => `${n} since you last looked`, empty: 'Select a node to see the rationale, alternatives and what it affects.',
    all: 'All', stage: { idea: 'Idea', launch: 'Launch', operate: 'Operate', scale: 'Scale', exit: 'Exit' }, lane: { brand: 'Brand', ux: 'UX', ui: 'UI', tech: 'Tech', biz: 'Biz / Legal', rules: 'Rules' },
    agentProposed: (t, p) => `Agent proposed: ${t} → ${p}`, approvedMsg: t => `Approved: ${t}`, rejectedMsg: t => `Rejected: ${t}`, errStale: 'A newer decision exists, so this was not applied.', errChanged: 'The proposal changed. Review it again.', errGeneric: 'Something went wrong.', mapLabel: 'Decision map', opts: 'Options', ev: { created: 'created', proposed: 'proposed', amended: 'proposal updated', approved: 'approved', rejected: 'rejected', stale: 'went stale', withdrawn: 'withdrawn', decided: 'decided by you', imported: 'imported' } },
};
const ls = { get: k => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
let LANG = ls.get('bp.lang') || (navigator.language?.startsWith('en') ? 'en' : 'ja');
const t = (k, ...a) => { const v = MSG[LANG][k] ?? MSG.ja[k] ?? k; return typeof v === 'function' ? v(...a) : v; };
document.documentElement.dataset.theme = ls.get('bp.theme') || '';
if (!document.documentElement.dataset.theme) document.documentElement.removeAttribute('data-theme');

function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) { if (v == null || v === false) continue; if (k.startsWith('on')) el.addEventListener(k.slice(2), v); else if (k === 'class') el.className = v; else el.setAttribute(k, v === true ? '' : v); }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c instanceof Node ? c : document.createTextNode(String(c)));
  return el;
}
const $ = s => document.querySelector(s);

let TOKEN = '', T = null, projects = [], P = null, sel = null, stageFilter = null, justChanged = new Set(), seenSeq = 0;
const topicLabel = x => LANG === 'en' ? (x.label_en || x.topic) : (x.label_ja || x.topic);
const topicQ = x => LANG === 'en' ? (x.question_en || '') : (x.question_ja || '');
const optName = (topic, id) => T.topics[topic]?.options.find(o => o.id === id)?.name || id;
const live = msg => { const l = $('#live'); l.textContent = ''; setTimeout(() => l.textContent = msg, 30); };
let toastT; const toast = msg => { const el = $('#toast'); el.textContent = msg; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => el.hidden = true, 5000); };

async function api(path, opts = {}) {
  const r = await fetch(path, { ...opts, headers: { 'content-type': 'application/json', ...(opts.method === 'POST' ? { 'x-bp-token': TOKEN } : {}) }, body: opts.body ? JSON.stringify(opts.body) : undefined });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.message || j.error), { status: r.status, code: j.error });
  return j;
}
const pending = () => (P?.proposals || []).filter(p => p.state === 'proposed' || p.state === 'stale');
const stateOf = topic => pending().some(p => p.topic === topic && p.state === 'proposed') ? 'proposed' : P.choices[topic] ? 'decided' : pending().some(p => p.topic === topic) ? 'stale' : 'open';
const sub = topic => { const s = stateOf(topic); const pr = pending().find(p => p.topic === topic); return s === 'decided' ? optName(topic, P.choices[topic].pick) : s === 'open' ? t('open_') : `${t(s)} · ${optName(topic, pr.pick)}`; };

// ---------- loading ----------
async function loadProject(id, quiet) {
  const prev = P; P = await api('/api/p/' + id);
  if (prev && prev.id === P.id && !quiet) return;
  if (prev && prev.id === P.id) diffAnnounce(prev, P);
}
function diffAnnounce(a, b) {
  const old = new Map(a.proposals.map(p => [p.id, p.version + p.state]));
  for (const p of b.proposals) if (old.get(p.id) !== p.version + p.state && p.state === 'proposed') { justChanged.add(p.topic); live(t('agentProposed', topicLabel(T.topics[p.topic]), optName(p.topic, p.pick))); setTimeout(() => { justChanged.delete(p.topic); }, 2500); }
}
async function poll() {
  if (!P || document.hidden) return;
  try { const r = await api(`/api/p/${P.id}?since=${P.seq}`); if (!r.unchanged) { const prev = P; P = r; diffAnnounce(prev, P); render(); } } catch {}
}
setInterval(poll, 1500); document.addEventListener('visibilitychange', poll);

// ---------- actions (human only) ----------
async function decide(p, decision) {
  try { await api(`/api/p/${P.id}/decide`, { method: 'POST', body: { proposalId: p.id, decision, seenVersion: p.version } }); live(t(decision === 'approve' ? 'approvedMsg' : 'rejectedMsg', topicLabel(T.topics[p.topic]))); }
  catch (e) { toast(e.code === 'stale' ? t('errStale') : e.code === 'changed' ? t('errChanged') : t('errGeneric')); }
  P = await api('/api/p/' + P.id); render(`btn-${p.topic}`);
}
async function choose(topic, pick) { await api(`/api/p/${P.id}/choice`, { method: 'POST', body: { topic, pick } }); P = await api('/api/p/' + P.id); render(); }

// ---------- views ----------
function chrome(content) {
  const root = $('#app'); root.replaceChildren(
    h('header', {}, h('h1', {}, 'Blueprint'), P && h('span', { class: 'muted' }, P.name), h('span', { class: 'sp' }),
      P && h('button', { class: 'btn sm', onclick: () => { P = null; sel = null; start(); } }, t('back')),
      P && h('button', { class: 'btn sm', onclick: exportProject }, t('export')),
      h('button', { class: 'btn sm', 'aria-label': 'Language', onclick: () => { LANG = LANG === 'ja' ? 'en' : 'ja'; ls.set('bp.lang', LANG); render(); } }, t('lang')),
      h('button', { class: 'btn sm', onclick: () => { const d = document.documentElement; const dark = d.dataset.theme === 'dark' || (!d.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches); d.dataset.theme = dark ? 'light' : 'dark'; ls.set('bp.theme', d.dataset.theme); } }, t('theme'))),
    h('main', {}, content));
  document.documentElement.lang = LANG; document.title = t('title'); $('#skip').textContent = t('skip');
}
async function start() {
  projects = await api('/api/projects'); P = null;
  const name = h('input', { type: 'text', id: 'pname', 'aria-label': t('name'), placeholder: t('name'), autocomplete: 'off' });
  const goal = h('input', { type: 'text', id: 'pgoal', 'aria-label': t('goal'), placeholder: t('goal'), autocomplete: 'off' });
  const file = h('input', { type: 'file', accept: 'application/json', id: 'pimport', class: 'sr', onchange: async e => { try { const j = JSON.parse(await e.target.files[0].text()); const p = await api('/api/import', { method: 'POST', body: j }); await open(p.id); } catch { toast(t('errGeneric')); } } });
  chrome(h('section', { class: 'start' }, h('h2', {}, t('title')), h('p', { class: 'muted' }, t('local')),
    h('ul', { class: 'plist' }, projects.length ? projects.map(p => h('li', {}, h('button', { onclick: () => open(p.id) }, h('b', {}, p.name), ' ', h('span', { class: 'muted small' }, p.pending ? `· ${t('proposed')} ${p.pending}` : '')))) : h('li', { class: 'muted' }, t('none'))),
    h('h2', {}, t('newp')), h('div', { class: 'row' }, name, goal, h('button', { class: 'btn primary', onclick: async () => { if (!name.value.trim()) return name.focus(); const p = await api('/api/projects', { method: 'POST', body: { name: name.value, goal: goal.value } }); open(p.id); } }, t('create'))),
    h('p', {}, h('label', { class: 'btn sm', for: 'pimport', tabindex: 0, onkeydown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); } } }, t('import')), file)));
}
async function open(id) { await loadProject(id, false); seenSeq = Number(ls.get('bp.seen.' + id) || 0); history.replaceState(null, '', '#/p/' + id); sel = null; render(); }
function exportProject() { api(`/api/p/${P.id}/export`).then(j => { const a = h('a', { href: URL.createObjectURL(new Blob([JSON.stringify(j, null, 2)], { type: 'application/json' })), download: `${P.id}.blueprint.json` }); a.click(); }); }

const stages = () => T.stages.map(s => s.id);
const visible = tp => !stageFilter || tp.stage === stageFilter;
function render(focusKey) {
  if (!P) return start();
  const active = focusKey || document.activeElement?.dataset?.fk;
  const ts = Object.values(T.topics);
  chrome(h('div', {},
    h('div', { class: 'tabs', role: 'group', 'aria-label': 'Stage' }, [h('button', { class: 'tab', 'aria-pressed': !stageFilter, onclick: () => { stageFilter = null; render(); } }, t('all')), ...T.stages.map(s => h('button', { class: 'tab', 'aria-pressed': stageFilter === s.id, onclick: () => { stageFilter = s.id; render(); } }, t('stage')[s.id]))]),
    h('h2', { id: 'needs' }, t('needs'), pending().length ? ` (${pending().length})` : ''), needsList(),
    h('div', { class: 'work' }, h('div', {}, h('h2', {}, t('mapLabel')), mapView(ts), mobileList(ts)), h('aside', { class: 'detail', 'aria-live': 'off' }, h('h2', {}, sel ? '' : ''), detailView(sel)), ),
    changesView()));
  if (active) $(`[data-fk="${active}"]`)?.focus();
}

function needsList() {
  const ps = pending();
  if (!ps.length) return h('p', { class: 'muted' }, t('needsNone'));
  return h('ul', { class: 'needs' }, ps.map(p => {
    const tp = T.topics[p.topic], isOpen = sel === p.topic && true, id = 'nb-' + p.id;
    const changed = p.version > 1 ? h('span', { class: 'tag chg' }, t('changed')) : null;
    const line = h('div', { class: 'need-line' },
      h('button', { class: 'need-toggle', 'data-fk': 'nt-' + p.id, 'aria-expanded': String(!!isOpen), 'aria-controls': id, onclick: () => { sel = isOpen ? null : p.topic; render('nt-' + p.id); } }, h('span', { class: 'chev', 'aria-hidden': 'true' }), h('span', { class: 't' }, `${topicLabel(tp)} → ${optName(p.topic, p.pick)}`), changed, p.state === 'stale' && h('span', { class: 'tag dim' }, t('stale'))),
      p.state === 'proposed' && h('button', { class: 'btn sm primary', 'data-fk': `btn-${p.topic}`, 'aria-label': `${t('approve')}: ${topicLabel(tp)}`, onclick: () => decide(p, 'approve') }, t('approve')),
      h('button', { class: 'btn sm', 'aria-label': `${t('reject')}: ${topicLabel(tp)}`, 'data-fk': `rj-${p.id}`, onclick: () => decide(p, 'reject') }, t('reject')));
    return h('li', { class: 'need' + (p.state === 'stale' ? ' stale' : '') }, line, isOpen && h('div', { class: 'need-body', id }, proposalBody(p)));
  }));
}
function proposalBody(p) {
  const cur = P.choices[p.topic];
  return h('div', {}, h('dl', { class: 'diff' }, cur && h('dt', {}, t('was')), cur && h('dd', {}, h('del', {}, optName(p.topic, cur.pick))), h('dt', {}, t('now')), h('dd', {}, h('b', {}, optName(p.topic, p.pick))), h('dt', {}, t('why')), h('dd', {}, p.reason || '—')),
    p.state === 'stale' && h('p', { class: 'small' }, t('staleNote')), h('p', { class: 'muted small' }, t('by', p.author)));
}

function layout(ts) {
  const lanes = T.lanes.map(l => l.id), order = stages();
  const depth = (tp, seen = new Set()) => seen.has(tp.topic) ? 0 : (seen.add(tp.topic), tp.depends_on.length ? 1 + Math.max(...tp.depends_on.map(d => depth(T.topics[d], seen))) : 0);
  const W = Math.max(960, 1000), colW = W / lanes.length, pos = {};
  lanes.forEach((l, ci) => ts.filter(x => x.lane === l && visible(x)).sort((a, b) => order.indexOf(a.stage) - order.indexOf(b.stage) || depth(a) - depth(b)).forEach((x, i) => pos[x.topic] = { x: ci * colW + 8, y: 36 + i * 44, w: colW - 16 }));
  return { pos, W, H: Math.max(...Object.values(pos).map(p => p.y), 0) + 56, colW, lanes };
}
function mapView(ts) {
  const { pos, W, H, colW, lanes } = layout(ts), svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg'); svg.setAttribute('class', 'edges'); svg.setAttribute('width', W); svg.setAttribute('height', H); svg.setAttribute('aria-hidden', 'true');
  for (const x of ts) for (const d of x.depends_on) { const a = pos[d], b = pos[x.topic]; if (!a || !b) continue;
    const sameCol = Math.abs(a.x - b.x) < 2, right = a.x < b.x;
    const x1 = sameCol ? a.x : right ? a.x + a.w : a.x, x2 = sameCol ? b.x : right ? b.x : b.x + b.w, y1 = a.y + 18, y2 = b.y + 18, bend = sameCol ? -26 : (x2 - x1) / 2;
    const path = document.createElementNS(svgNS, 'path'); path.setAttribute('d', sameCol ? `M${x1} ${y1}C${x1 - 28} ${y1},${x2 - 28} ${y2},${x2} ${y2}` : `M${x1} ${y1}C${x1 + bend} ${y1},${x2 - bend} ${y2},${x2} ${y2}`);
    if (sel && (x.topic === sel || d === sel)) path.setAttribute('class', 'on'); svg.append(path); }
  return h('div', { class: 'mapwrap' }, h('div', { class: 'lanes', style: `width:${W}px;height:${H}px`, role: 'group', 'aria-label': t('mapLabel') },
    ...lanes.map((l, i) => h('div', { class: 'lane-h', style: `left:${i * colW + 10}px` }, t('lane')[l])), svg,
    ts.filter(x => pos[x.topic]).map(x => { const p = pos[x.topic], s = stateOf(x.topic);
      return h('button', { class: `node ${s}${justChanged.has(x.topic) ? ' just' : ''}`, 'data-fk': 'n-' + x.topic, style: `left:${p.x}px;top:${p.y}px;width:${p.w}px`, 'aria-pressed': String(sel === x.topic), title: `${topicLabel(x)} — ${sub(x.topic)}`, onclick: () => { sel = sel === x.topic ? null : x.topic; render('n-' + x.topic); } },
        h('span', { class: 'mk ' + s, 'aria-hidden': 'true' }), h('span', { class: 'l' }, topicLabel(x)), h('span', { class: 'sr' }, ', ' + (s === 'decided' || s === 'open' ? t(s === 'open' ? 'open_' : s) : t(s)))); })));
}
function mobileList(ts) {
  const order = stages();
  return h('div', { class: 'mlist' }, T.lanes.map(l => { const items = ts.filter(x => x.lane === l.id && visible(x)).sort((a, b) => order.indexOf(a.stage) - order.indexOf(b.stage)); if (!items.length) return null;
    return h('section', {}, h('div', { class: 'lane-title' }, t('lane')[l.id]), items.map(x => { const s = stateOf(x.topic);
      return h('div', {}, h('button', { class: `row-node${justChanged.has(x.topic) ? ' just' : ''}`, 'data-fk': 'm-' + x.topic, 'aria-pressed': String(sel === x.topic), 'aria-expanded': String(sel === x.topic), onclick: () => { sel = sel === x.topic ? null : x.topic; render('m-' + x.topic); } },
        h('span', { class: 'mk ' + s, 'aria-hidden': 'true' }), h('span', { class: 'l' }, topicLabel(x), h('span', { class: 's' }, sub(x.topic)))),
        sel === x.topic && h('div', { class: 'inline-detail' }, detailView(x.topic))); })); }));
}

function detailView(topic) {
  if (!topic) return h('p', { class: 'muted' }, t('empty'));
  const x = T.topics[topic], s = stateOf(topic), cur = P.choices[topic];
  const chip = tp => h('button', { class: 'chip', onclick: () => { sel = tp; render('n-' + tp); } }, topicLabel(T.topics[tp]), ' · ', stateOf(tp) === 'open' ? t('undecidedDep') : t(stateOf(tp) === 'decided' ? 'decided' : stateOf(tp)));
  const affects = Object.values(T.topics).filter(y => y.depends_on.includes(topic)).map(y => y.topic);
  const props = P.proposals.filter(p => p.topic === topic);
  const live_ = props.filter(p => p.state === 'proposed' || p.state === 'stale'), done_ = props.filter(p => p.state === 'rejected' || p.state === 'approved' || p.state === 'withdrawn');
  const alts = live_[0]?.alternatives?.length ? live_[0].alternatives : x.options.filter(o => o.id !== (live_[0]?.pick || cur?.pick)).slice(0, 4).map(o => ({ option: o.id, why: o.avoid_when ? `${t('avoid')}: ${o.avoid_when}` : '' }));
  return h('div', { class: 'card' }, h('h3', {}, topicLabel(x)), h('p', { class: 'muted small' }, `${t('lane')[x.lane]} · ${t('stage')[x.stage]} · ${s === 'decided' || s === 'open' ? t(s === 'open' ? 'open_' : s) : t(s)}`), topicQ(x) && h('p', {}, topicQ(x)),
    cur && h('p', {}, h('b', {}, optName(topic, cur.pick)), cur.reason ? ` — ${cur.reason}` : ''),
    live_.map(p => h('div', {}, h('h4', {}, `${t(p.state)}${p.version > 1 ? ' · ' + t('changed') : ''}`), proposalBody(p),
      p.state === 'proposed' && h('div', { class: 'row' }, h('button', { class: 'btn sm primary', 'data-fk': `btn-${p.topic}`, onclick: () => decide(p, 'approve') }, t('approve')), h('button', { class: 'btn sm', onclick: () => decide(p, 'reject') }, t('reject'))))),
    alts.length ? [h('h4', {}, t('alts')), h('ul', {}, alts.map(a => h('li', {}, h('b', {}, optName(topic, a.option)), a.why ? ` — ${a.why}` : '')))] : null,
    h('h4', {}, t('affects')), affects.length ? h('div', { class: 'chips' }, affects.map(chip)) : h('p', { class: 'muted small' }, t('none_')),
    x.depends_on.length ? [h('h4', {}, t('needsFirst')), h('div', { class: 'chips' }, x.depends_on.map(chip))] : null,
    x.comparison && compareBlock(x),
    h('details', {}, h('summary', {}, t('decideSelf')), x.options.map(o => h('div', { class: 'opt' }, h('b', {}, o.name), ' ', cur?.pick === o.id && h('span', { class: 'tag' }, t('decided')), o.what && h('div', { class: 'small muted' }, o.what.slice(0, 200)), h('button', { class: 'btn sm', style: 'margin-top:6px', 'aria-label': `${t('choose')}: ${o.name}`, onclick: () => choose(topic, o.id) }, t('choose'))))),
    done_.length ? [h('h4', {}, t('history')), h('ul', {}, done_.map(p => h('li', {}, `${t(p.state)}: ${optName(topic, p.pick)}`)))] : null);
}
function compareBlock(x) {
  return h('div', {}, h('h4', {}, t('compare')), h('table', { class: 'cmp' }, h('thead', {}, h('tr', {}, h('th', {}, t('opts')), h('th', {}, t('cost')), h('th', {}, t('avoid')))),
    h('tbody', {}, x.options.map(o => h('tr', {}, h('td', {}, o.name, o.id === x.comparison.pick ? ' ★' : ''), h('td', {}, typeof o.cost === 'string' ? o.cost.slice(0, 60) : '—'), h('td', {}, (o.avoid_when || '').slice(0, 90)))))),
    x.comparison.switch_points?.length ? h('p', { class: 'small muted' }, `${t('switchWhen')}: ` + x.comparison.switch_points.map(w => `${w.when} → ${w.upgrade_to}`).join(' / ')) : null);
}
function changesView() {
  const ev = P.history.filter(e => e.type !== 'created').slice(-8).reverse(); const fresh = P.history.filter(e => e.seq > seenSeq && e.type !== 'created').length;
  return h('section', {}, h('h2', {}, t('changes'), fresh ? ` · ${t('newSince', fresh)}` : ''),
    ev.length ? h('ul', { class: 'feed' }, ev.map(e => h('li', { class: e.seq > seenSeq ? 'new' : '' }, `${t('ev')[e.type] || e.type}${e.topic ? ': ' + topicLabel(T.topics[e.topic] || { topic: e.topic }) : ''}${e.pick ? ' → ' + optName(e.topic, e.pick) : ''}`))) : h('p', { class: 'muted' }, t('none_')),
    fresh ? h('p', {}, h('button', { class: 'btn sm', onclick: () => { seenSeq = P.seq; ls.set('bp.seen.' + P.id, seenSeq); render(); } }, t('markSeen'))) : null);
}

// ---------- boot ----------
(async () => {
  const s = await api('/api/session'); TOKEN = s.token; T = await api('/api/topics');
  const m = location.hash.match(/^#\/p\/([a-z0-9-]+)/);
  if (m) { try { await open(m[1]); return; } catch {} }
  start();
})();

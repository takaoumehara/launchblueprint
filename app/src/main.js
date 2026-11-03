import './style.css';
import yaml from 'js-yaml';
import { M } from './messages.js';

const D = await (await fetch('/data.json')).json();
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const app = $('#app');
const T = Object.fromEntries(D.tactics.map(t => [t.topic, t]));
const E = Object.fromEntries(D.elements.map(e => [e.id, e]));
const LANES = D.lanes;
const STAGES = D.stages;
const CATALOG = D.catalog;
// Real-AI recommendation is off unless the build sets VITE_BP_AI_PICK=on and the host runs api/ai-pick.js with a server-side key.
const AI_ON = import.meta.env.VITE_BP_AI_PICK === 'on';

// ---------- 言語（JA / EN）。画面の文言はすべて messages.js のキー経由 ----------
let LANG = (() => { try { return localStorage.getItem('bp.lang') === 'en' ? 'en' : 'ja'; } catch { return 'ja'; } })();
const tr = (k, ...a) => { const v = M[LANG][k] ?? M.ja[k] ?? k; return typeof v === 'function' ? v(...a) : v; };
const lbl = t => LANG === 'en' && t.label_en ? t.label_en : t.label_ja;
const qst = t => LANG === 'en' && t.question_en ? t.question_en : t.question_ja;
const laneName = l => LANG === 'en' ? (l.en || l.label) : l.ja;
const stageName = s => LANG === 'en' ? s.label[0] + s.label.slice(1).toLowerCase() : s.ja;
const stageWhat = s => LANG === 'en' ? (s.what_en || '') : s.what_ja;
const elName = e => LANG === 'en' ? (e.name || e.name_ja) : e.name_ja;
function applyLang() {
  document.documentElement.lang = LANG;
  $('#lang').textContent = LANG === 'ja' ? 'JA / EN' : 'EN / JA';
  $('#lang').setAttribute('aria-label', tr('lang.switch'));
  $('#theme').setAttribute('aria-label', tr('theme.switch'));
  for (const a of document.querySelectorAll('.steps [data-r]')) a.textContent = tr('nav.' + a.dataset.r);
  $('.steps').setAttribute('aria-label', tr('nav.label'));
  document.title = tr('title');
}

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
    s = s.replace(re, (m, off, str) => {
      used?.add(g.term);
      const pl = esc(g.plain), after = str.slice(off + m.length), before = str.slice(0, off);
      // すでに言いかえが隣にある（「販売代行（Merchant of Record）」や「Merchant of Record（販売代行」）なら重ねない
      const near = after.startsWith('（' + pl) || after.startsWith('(' + pl) || /^[（(]/.test(after) && after.slice(1, 40).includes(pl) || before.endsWith(pl + '（') || before.endsWith(pl + '(') || before.endsWith(pl);
      slots.push({ ...g, bare: near }); return `\u0000${slots.length - 1}\u0000`; });
  }
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => { const g = slots[i]; if (g.bare) return `<abbr title="${esc(g.one_line)}">${esc(g.term)}</abbr>`; return `<abbr title="${esc(g.one_line)}">${esc(g.plain)}（${esc(g.term)}）</abbr>`; });
}

// ---------- おすすめと状態 ----------
// rulePick: 始める画面の答え（pick_when）か既定（ai_pick）から決まる「おすすめ」。本物の AI ではない。
function rulePick(t) {
  if (t.kind !== 'choose') return null;
  for (const w of t.pick_when || []) if (Object.entries(w.if).every(([k, v]) => P.profile[k] === v)) return { id: w.pick, reason: w.reason_ja, rule: true, source: 'rule' };
  return t.ai_pick ? { id: t.ai_pick, reason: t.ai_reason_ja, source: 'rule' } : null;
}
const status = t => P.choices[t.topic]?.status === 'decided' ? 'done' : rulePick(t) ? 'ai' : 'open';
const STATUS = () => ({ open: tr('st.open'), ai: tr('st.ai'), done: tr('st.done') });
const STATUS_LONG = () => ({ open: tr('st.open'), ai: tr('st.ai.long'), done: tr('st.done.long') });
const depsDone = t => t.depends_on.every(d => status(T[d]) === 'done');
const depth = (t, seen = new Set()) => seen.has(t.topic) ? 0 : (seen.add(t.topic), t.depends_on.length ? 1 + Math.max(...t.depends_on.map(d => depth(T[d], seen))) : 0);
const laneIdx = t => LANES.findIndex(l => l.id === t.lane);
function nextSteps() {
  return D.tactics.filter(t => status(t) !== 'done' && depsDone(t)).sort((a, b) => depth(a) - depth(b) || laneIdx(a) - laneIdx(b)).slice(0, 3);
}
const itemName = id => D.items[id]?.name || id;
const shortName = id => itemName(id).replace(/\s*([（(]|\s\/\s).*$/, '');
const links = () => D.tactics.flatMap(t => t.depends_on.map(d => [d, t.topic]));
const stageProgress = () => STAGES.map(s => { const ts = D.tactics.filter(t => t.stage === s.id);
  return { ...s, total: ts.length, done: ts.filter(t => status(t) === 'done').length, ai: ts.filter(t => status(t) === 'ai').length, topics: ts }; });
let stageFilter = null;
// 段の帯：巨大な細い数字（決めた数）と、決めること1件＝四角1つ（未決=枠、仮=白、決定=オレンジ）
function stageRail(cls = '') {
  return `<section class="stages ${cls}" aria-label="${tr('rail.label')}">${stageProgress().map((p, i) => `<button type="button" class="stg ${stageFilter === p.id ? 'on' : ''} ${p.done === p.total ? 'full' : ''}" data-stage="${p.id}" aria-pressed="${stageFilter === p.id}" title="${esc(stageWhat(p))}">
    <span class="mono m2">${String(i + 1).padStart(2, '0')} ${esc(p.label)}</span><span class="ja">${esc(stageName(p))}</span>
    <span class="num2"><b>${String(p.done).padStart(2, '0')}</b><small>/ ${String(p.total).padStart(2, '0')}</small></span>
    <span class="sqs">${p.topics.map(t => `<i class="sq ${status(t)}" title="${esc(lbl(t))}"></i>`).join('')}</span>
    <span class="what">${esc(stageWhat(p))}</span></button>`).join('')}</section>`;
}
function bindRail() { app.querySelectorAll('.stg').forEach(b => b.onclick = () => { stageFilter = stageFilter === b.dataset.stage ? null : b.dataset.stage; viewMap(); }); }

// ---------- 書き出し（project-map.template.yaml と同じ形） ----------
function projectMap() {
  return {
    domain: 'project_map', name: P.name, goal: P.goal, profile: P.profile,
    elements: D.elements.map(e => e.id),
    choices: D.tactics.map(t => {
      const c = P.choices[t.topic] || {}; const ai = rulePick(t);
      const pick = t.kind === 'choose' ? (c.pick || '') : '';
      return {
        element: t.element, topic: t.topic, stage: t.stage, status: c.status === 'decided' ? 'decided' : 'open',
        options: t.options, ai_pick: ai?.id || '', reason: c.reason || ai?.reason || '',
        rejected: t.kind === 'choose' ? t.options.filter(o => o !== (pick || ai?.id)).map(o => ({ option: o, why: c.rejected?.find(r => r.option === o)?.why || D.items[o]?.avoid_when || '' })) : [],
        decided_by: c.status === 'decided' ? (c.by || 'human') : '',
        pick, ...(t.kind === 'checklist' ? { checked: c.checked || [] } : {}), depends_on: t.depends_on, last_checked: t.last_checked,
      };
    }),
  };
}
function toMd() {
  const m = projectMap(); const L = [`# ${m.name || tr('untitled')}`, '', `${tr('md.goal')}${m.goal || '—'}`, '', `## ${tr('md.progress')}`, ...stageProgress().map(p => `- ${stageName(p)}（${p.label}）：${p.done} / ${p.total}`), ''];
  for (const c of m.choices) {
    const t = T[c.topic];
    L.push(`## ${lbl(t)}（${c.topic}）— ${c.status === 'decided' ? tr('st.done') : tr('st.open')} · ${tr('md.stage')}${t.stage}`);
    if (t.depends_on.length) L.push(`- ${tr('md.before')}${t.depends_on.map(d => lbl(T[d])).join('、')}`);
    if (t.kind === 'choose') {
      L.push(`- ${tr('md.pick')}${c.pick ? itemName(c.pick) : '—'}`, `- ${tr('md.suggested')}${c.ai_pick ? itemName(c.ai_pick) : '—'}`, `- ${tr('md.reason')}${c.reason || '—'}`);
      for (const r of c.rejected) L.push(`- ${tr('md.rejected')}${itemName(r.option)} — ${r.why || '—'}`);
    } else for (const o of t.options) L.push(`- [${(c.checked || []).includes(o) ? 'x' : ' '}] ${D.items[o]?.check || D.items[o]?.what || itemName(o)}`);
    L.push(`- ${tr('md.checked')}${c.last_checked}`, '');
  }
  return L.join('\n');
}
function download(name, text, type) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click();
  toast(tr('saved', name));
}
let tt; function toast(m) { const el = $('.toast') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'toast mono', role: 'status' })); el.textContent = m; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('on'), 1800); }
const exportYaml = () => download('project-map.yaml', yaml.dump(projectMap(), { lineWidth: 120 }), 'text/yaml');
const exportMd = () => download('project-map.md', toMd(), 'text/markdown');

// ---------- 画面1：始める ----------
const Q = () => [
  ['audience', tr('q.audience'), tr('q.audience.h'), [['self', tr('q.audience.self'), tr('q.audience.self.h')], ['public', tr('q.audience.public'), tr('q.audience.public.h')], ['business', tr('q.audience.business'), tr('q.audience.business.h')]]],
  ['platform', tr('q.platform'), tr('q.platform.h'), [['web', tr('q.platform.web'), tr('q.platform.web.h')], ['app', tr('q.platform.app'), tr('q.platform.app.h')], ['both', tr('q.platform.both'), tr('q.platform.both.h')]]],
  ['money', tr('q.money'), tr('q.money.h'), [['free', tr('q.money.free'), tr('q.money.free.h')], ['paid', tr('q.money.paid'), tr('q.money.paid.h')], ['marketplace', tr('q.money.marketplace'), tr('q.money.marketplace.h')]]],
  ['country', tr('q.country'), tr('q.country.h'), [['us', tr('q.country.us'), tr('q.country.us.h')], ['jp', tr('q.country.jp'), tr('q.country.jp.h')], ['global', tr('q.country.global'), tr('q.country.global.h')]]],
];
function viewStart() {
  const n = (i) => String(i).padStart(2, '0');
  app.innerHTML = `<section class="page">
    <div class="mono m2">${tr('start.kicker')}</div>
    <h1>${tr('start.h1')}</h1>
    <p class="lead">${tr('start.lead')}</p>
    <div class="q"><div class="k"><div class="qn ${P.name ? 'on' : ''}">${n(1)}</div><label class="t" for="nm">${tr('start.name')}</label><div class="h">${tr('start.name.h')}</div></div><div><input type="text" id="nm" value="${esc(P.name)}" placeholder="${tr('start.name.ph')}" autocomplete="off"></div></div>
    <div class="q"><div class="k"><div class="qn ${P.goal ? 'on' : ''}">${n(2)}</div><label class="t" for="gl">${tr('start.goal')}</label><div class="h">${tr('start.goal.h')}</div></div><div><input type="text" id="gl" value="${esc(P.goal)}" placeholder="${tr('start.goal.ph')}" autocomplete="off"></div></div>
    ${Q().map(([k, q, h, opts], i) => `<div class="q"><div class="k"><div class="qn ${P.profile[k] ? 'on' : ''}">${n(i + 3)}</div><div class="t" id="q-${k}">${q}</div><div class="h">${h}</div></div>
      <div class="seg" role="group" aria-labelledby="q-${k}">${opts.map(([v, l, s]) => `<button type="button" data-k="${k}" data-v="${v}" aria-pressed="${P.profile[k] === v}"><span>${l}</span><small>${s}</small><span class="dot"></span></button>`).join('')}</div></div>`).join('')}
    <div class="q"><div class="k"></div><div class="acts-row"><button class="btn" id="go">${tr('start.go')}</button><span class="mono m3">${tr('start.local')}</span><button type="button" class="btn line" id="reset">${tr('start.reset')}</button></div></div>
  </section>`;
  app.querySelectorAll('.seg button').forEach(b => b.onclick = () => {
    P.profile[b.dataset.k] = b.dataset.v; save();
    b.parentElement.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    b.closest('.q').querySelector('.qn')?.classList.add('on');
  });
  const sync = () => { P.name = $('#nm').value.trim(); P.goal = $('#gl').value.trim(); save();
    $('#nm').closest('.q').querySelector('.qn').classList.toggle('on', !!P.name); $('#gl').closest('.q').querySelector('.qn').classList.toggle('on', !!P.goal); };
  $('#nm').oninput = $('#gl').oninput = sync;
  $('#go').onclick = () => { sync(); location.hash = '#/map'; };
  $('#reset').onclick = () => { if (!confirm(tr('start.reset.confirm'))) return; P = blank(); localStorage.removeItem(KEY); toast(tr('start.reset.done')); viewStart(); };
}

// ---------- 画面2：地図 ----------
let traceOnly = false;
function layout(W, H) {
  const x0 = 120, x1 = Math.max(x0 + 600, W - 300), y0 = 170, y1 = H - 230;
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
// 線は depends_on だけ。決めた同士は太い束（tr）になり、オレンジに光る
function strands(pos) {
  let out = '';
  for (const [a, b] of links()) {
    const tr_ = status(T[a]) === 'done' && status(T[b]) === 'done';
    const n = tr_ ? 14 : 7, r = rnd(a + b);
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
      out += `<path class="${tr_ ? 'tr' : ''}" data-a="${a}" data-b="${b}" d="${d}"/>`;
    }
  }
  return out;
}
// スマホ：段ごとの一覧の左に、同じ depends_on の線を縦に引く（本物のつながりだけ）
function listStrands(list) {
  const svg = list.querySelector('svg.glines'); if (!svg) return;
  const rows = Object.fromEntries([...list.querySelectorAll('.lrow[data-topic]')].map(r => [r.dataset.topic, r]));
  const top = list.getBoundingClientRect().top;
  const yOf = r => r.getBoundingClientRect().top - top + 16;
  const H = list.scrollHeight; svg.setAttribute('viewBox', `0 0 36 ${H}`); svg.style.height = H + 'px';
  let out = '';
  for (const [a, b] of links()) {
    if (!rows[a] || !rows[b]) continue;
    const tr_ = status(T[a]) === 'done' && status(T[b]) === 'done';
    const n = tr_ ? 7 : 3, r = rnd(a + b);
    const ya = yOf(rows[a]), yb = yOf(rows[b]);
    const span = Math.min(1, Math.abs(yb - ya) / 900);
    for (let k = 0; k < n; k++) {
      const f = k - (n - 1) / 2, j = r() - .5;
      const bx = 26 - 20 * span - Math.abs(f) * 1.5 - j * 3;
      out += `<path class="${tr_ ? 'tr' : ''}" data-a="${a}" data-b="${b}" d="M29 ${ya + f * .4}C${bx} ${ya + f * .6},${bx} ${yb + f * .6},29 ${yb + f * .4}"/>`;
    }
  }
  svg.innerHTML = out;
}
function viewMap() {
  const done = D.tactics.filter(t => status(t) === 'done').length;
  const next = nextSteps();
  const W = Math.max(innerWidth, 1100), H = Math.max(innerHeight - 48 - 150, 760);
  const { pos, lx, y0, step } = layout(W, H);
  const nodeSub = t => { const s = status(t); const c = P.choices[t.topic]; const ai = rulePick(t);
    if (s === 'done') return tr('st.done') + (t.kind === 'choose' ? ' · ' + shortName(c.pick) : ' · ' + tr('node.checked'));
    if (s === 'ai') return tr('st.ai') + ' · ' + shortName(ai.id);
    return tr('st.open') + ' · ' + tr('node.items', t.options.length); };
  const quietNext = `<div class="mono m3">${tr('map.start.here')}</div>${next.length ? `<ol>${next.map((t, i) => `<li><a href="#/t/${t.topic}"><span class="n">${i + 1}</span><span>${esc(lbl(t))}<span class="m2"> — ${esc(qst(t))}</span></span></a></li>`).join('')}</ol>` : `<div>${tr('map.all.done')}</div>`}`;
  const legend = `<div class="mono m3">${tr('legend')}</div><div class="lg">
    <span class="dot"></span><span>${tr('legend.open')}</span>
    <span class="dot ai"></span><span>${tr('legend.ai')}</span>
    <span class="dot done"></span><span>${tr('legend.done')}</span>
    <span class="ln"></span><span>${tr('legend.line')}</span>
    <span class="ln acc"></span><span>${tr('legend.trace')}</span>
    <span class="sq done"></span><span>${tr('legend.sq')}</span></div>`;
  const inStage = t => !stageFilter || t.stage === stageFilter;
  const byStage = STAGES.map(s => ({ s, ts: D.tactics.filter(t => t.stage === s.id && inStage(t)).sort((a, b) => depth(a) - depth(b) || laneIdx(a) - laneIdx(b)) })).filter(g => g.ts.length);
  app.innerHTML = `${stageRail('desk')}<section class="canvas ${stageFilter ? 'filtered' : ''} ${step < 36 ? 'tight' : ''}" style="height:${H}px;--gap:${Math.round(lx(1) - lx(0) - 28)}px">
    <div class="corner tl mono"><div>BLUEPRINT — MAP</div><div class="m2">CREATIVITY IS EVERYWHERE, LLC</div></div>
    <div class="corner tr mono"><div class="m1">${esc(P.name || tr('untitled.caps'))} · ${D.generated}</div><div class="m2">${D.tactics.length} NODES · ${links().length} LINKS · TRACE ${done}</div>
      <div style="margin-top:10px"><button id="exy">EXPORT YAML</button><span class="m3"> · </span><button id="exm">MARKDOWN</button><span class="m3"> · </span><a href="#/" style="text-decoration:none" class="m1">${tr('map.edit.answers')}</a></div></div>
    <svg id="strands" class="${traceOnly ? 'traceonly' : ''}" aria-hidden="true">${strands(pos)}</svg>
    ${LANES.map((l, i) => `<div class="lane" style="left:${lx(i) - 3.5}px;top:${y0 - 72}px"><div class="mono m3">${String(i + 1).padStart(2, '0')}</div><div class="mono">${esc(l.label)}</div><div class="ja">${esc(laneName(l))}</div></div>`).join('')}
    ${D.tactics.map(t => { const s = status(t); const p = pos[t.topic];
      return `<a class="node ${s} ${inStage(t) ? 'instage' : ''}" href="#/t/${t.topic}" data-topic="${t.topic}" style="left:${p.x}px;top:${p.y}px" aria-label="${esc(lbl(t))}：${STATUS_LONG()[s]}"><span class="dot ${s}"></span><span><b>${esc(lbl(t))}</b><small>${esc(nodeSub(t))}</small></span></a>`; }).join('')}
    <div class="quiet" style="left:28px;bottom:84px">${quietNext}</div>
    <div class="quiet" style="left:${Math.min(380, W * .3)}px;bottom:84px;max-width:340px">${legend}</div>
    <div class="corner bl mono m2"><div><a href="#/catalog">CATALOG ${Object.keys(CATALOG).length} AREAS</a> · <a href="/data.json">/DATA.JSON</a> · <a href="/llms.txt">/LLMS.TXT</a></div><div class="m3">${tr('map.hint')}${stageFilter ? ' · STAGE ' + stageFilter.toUpperCase() : ''}</div></div>
    <div class="corner br"><div class="mono m2">${tr('map.trace')}</div><div class="num">${String(done).padStart(2, '0')}</div></div>
  </section>
  <section class="list">${stageRail()}<div class="page">
    <div class="mono m2">02 — MAP ・ ${D.tactics.length} NODES · TRACE ${done}</div>
    <h1>${esc(P.name || tr('untitled'))}</h1><p class="lead">${esc(P.goal || tr('map.no.goal'))}</p>
    <div class="quiet" style="position:static;max-width:none;margin-bottom:24px">${quietNext}</div>
    <div class="lwrap"><svg class="glines" aria-hidden="true"></svg>
    ${byStage.map(({ s, ts }) => `<div class="lsec"><div class="mono"><span class="m3">${String(STAGES.indexOf(s) + 1).padStart(2, '0')}</span> ${esc(s.label)} <span class="m2">· ${esc(stageName(s))}</span></div>
      ${ts.map(t => { const st = status(t); return `<a class="lrow ${st}" href="#/t/${t.topic}" data-topic="${t.topic}"><span class="dot ${st}"></span><span><b>${esc(lbl(t))}</b><small>${esc(LANES[laneIdx(t)].label)} · ${t.depends_on.length ? tr('list.after') + t.depends_on.map(d => lbl(T[d])).join('、') : tr('list.first')}</small></span><span class="mono m2">${STATUS()[st]}</span></a>`; }).join('')}</div>`).join('')}
    </div>
    <div class="quiet" style="position:static;max-width:none;margin-top:24px">${legend}</div>
    <div style="display:flex;gap:8px;margin-top:24px;flex-wrap:wrap"><button class="btn line" id="exy2">${tr('export.yaml')}</button><button class="btn line" id="exm2">Markdown</button><a class="btn line" href="#/catalog">${tr('nav.catalog.short')}</a></div>
  </div></section>`;
  bindRail();
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
  const lw = $('.lwrap'); if (lw) { listStrands(lw); if (document.fonts?.ready) document.fonts.ready.then(() => $('.lwrap') === lw && listStrands(lw)); }
}
addEventListener('keydown', e => { if (e.key.toLowerCase() === 't' && !/input|textarea/i.test(e.target.tagName) && $('#strands')) { traceOnly = !traceOnly; $('#strands').classList.toggle('traceonly', traceOnly); } });
let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (location.hash.startsWith('#/map')) viewMap(); }, 120); });

// ---------- スタック比較（R-030） ----------
function compareHtml(c, used) {
  const nm = s => D.items[s.id]?.name || s.name || s.id;
  const v = s => s.verified ? `<span class="tagv ok">${tr('verified')} ${esc(s.checked)}</span>` : `<span class="tagv">${tr('unverified')}</span>`;
  return `<div class="cmp"><div class="mono m3">${tr('cmp.kicker')}</div>
    <div class="cmp-h">${tr('cmp.1')}</div>
    <table><thead><tr><th>${tr('cmp.service')}</th><th>${tr('cmp.free')}</th><th>${tr('cmp.paid')}</th><th>${tr('cmp.source')}</th></tr></thead><tbody>
    ${c.services.map(s => `<tr><td><b>${esc(nm(s))}</b></td><td>${gloss(s.free_tier, used)}</td><td>${gloss(s.paid_entry, used)}</td><td>${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${tr('official')} ↗</a><br>` : ''}${v(s)}</td></tr>`).join('')}</tbody></table>
    <div class="cmp-h">${tr('cmp.2')}</div>
    <dl class="cmp-dl"><dt>${tr('cmp.single')}</dt><dd>${gloss(c.combine.single, used)}</dd><dt>${tr('cmp.combined')}</dt><dd>${gloss(c.combine.combined, used)}</dd><dt>${tr('cmp.risks')}</dt><dd>${gloss(c.combine.risks, used)}</dd></dl>
    <div class="cmp-h">${tr('cmp.3')}</div>
    <ol class="cmp-sw">${c.switch_points.map(w => `<li><b>${gloss(w.when, used)}</b><span>→ ${gloss(w.upgrade_to, used)}</span><small>${gloss(w.why, used)}</small></li>`).join('')}</ol>
    <div class="cmp-h">${tr('cmp.4')}</div>
    <div class="pick" style="margin:0"><div class="nm">${esc(itemName(c.recommendation.pick))}</div><div class="m1">${gloss(c.recommendation.reason, used)}</div></div>
    <ul class="cmp-rej">${c.recommendation.rejected.map(r => `<li><b>${esc(D.items[r.option]?.name || c.services.find(s => s.id === r.option)?.name || r.option)}</b><span>${gloss(r.why, used)}</span></li>`).join('')}</ul>
  </div>`;
}

// ---------- 本物の AI のおすすめ（旗が on の時だけ。鍵はサーバー側） ----------
const aiCache = new Map();
async function fetchAiPick(t) {
  const key = t.topic + '|' + Object.values(P.profile).join(',');
  if (aiCache.has(key)) return aiCache.get(key);
  const body = { topic: t.topic, question: t.question_ja, profile: P.profile, options: t.options.map(id => { const it = D.items[id] || {}; return { id, name: it.name || id, what: it.what, best_for: it.best_for, avoid_when: it.avoid_when, cost: it.cost, verified: it.verified === true }; }) };
  const r = await fetch('/api/ai-pick', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('ai-pick ' + r.status);
  const out = await r.json(); aiCache.set(key, out); return out;
}

// ---------- 画面3：決める ----------
function viewTopic(topic) {
  const t = T[topic]; if (!t) { location.hash = '#/map'; return; }
  const e = E[t.element]; const lane = LANES.find(l => l.id === t.lane); let ai = rulePick(t); const c = P.choices[topic] || {};
  const s = status(t); const choose = t.kind === 'choose'; const used = new Set();
  let sel = choose ? (c.pick || ai?.id || '') : new Set(c.checked || []);
  const blocked = t.depends_on.filter(d => status(T[d]) !== 'done');
  const later = D.tactics.filter(u => u.depends_on.includes(topic));
  const verified = it => it?.verified === true || it?.verified === 'True' ? `<span class="tagv ok">${tr('verified')}${it.checked ? ' ' + esc(it.checked) : ''}</span>` : `<span class="tagv">${tr('unverified.long')}</span>`;
  const optHtml = id => { const it = D.items[id] || { name: id }; const isAi = ai?.id === id;
    return `<div class="opt" role="${choose ? 'radio' : 'checkbox'}" tabindex="0" data-id="${id}" aria-checked="false">
      <span class="mark ${choose ? 'r' : ''}"></span><div>
      <div class="nm2"><span>${esc(it.name)}</span>${isAi ? `<span class="tagv ai" data-aitag>${tr('pick.tag.rule')}</span>` : ''}${verified(it)}</div>
      <dl>${it.what ? `<dt>${choose ? tr('opt.what') : tr('opt.content')}</dt><dd>${gloss(it.what, used)}</dd>` : ''}
        ${it.best_for ? `<dt>${tr('opt.best')}</dt><dd>${gloss(it.best_for, used)}</dd>` : ''}
        ${it.avoid_when ? `<dt>${choose ? tr('opt.avoid') : tr('opt.antipattern')}</dt><dd>${gloss(it.avoid_when, used)}</dd>` : ''}
        ${it.why ? `<dt>${tr('opt.why')}</dt><dd>${gloss(it.why, used)}</dd>` : ''}
        ${!choose && it.check ? `<dt>${tr('opt.check')}</dt><dd>${gloss(it.check, used)}</dd>` : ''}
        ${choose ? `<dt>${tr('opt.cost')}</dt><dd>${it.cost ? gloss(String(it.cost), used) : tr('opt.cost.none')}</dd>` : ''}
        ${it.url ? `<dt>${tr('opt.source')}</dt><dd><a href="${esc(it.url)}" target="_blank" rel="noopener">${tr('official.page')} ↗</a></dd>` : ''}
        <dt>${tr('opt.id')}</dt><dd class="mono m3" style="text-transform:none">${id}${it.domain ? ` · <a href="#/catalog/${it.domain}">${tr('nav.catalog.short')} ${it.domain}</a>` : ''}</dd>
      </dl></div></div>`; };
  const opts = t.options.map(optHtml).join('');
  const stg = STAGES.find(x => x.id === t.stage);
  const pickBox = (a, extra = '') => a ? `<div class="pick" id="pickbox"><div class="mono" style="color:var(--acc)">${a.source === 'ai' ? tr('pick.ai', a.model) : tr('pick.rule')}${a.rule ? ' · ' + tr('pick.from.answers') : ''}</div><div class="nm">${esc(itemName(a.id))}</div><div class="m1">${gloss(a.reason, used)}</div>${extra}</div>` : '';
  app.innerHTML = `<section class="page"><div class="mono m2">03 — ${esc(lane.label)} ・ ${esc(elName(e))} ・ ${tr('topic.stage')} ${esc(stg?.label || '')}${LANG === 'ja' && stg ? ' ' + esc(stg.ja) : ''}</div>
    <div class="detail"><div>
      <div class="bignum ${s}" aria-hidden="true">${String(LANES.indexOf(lane) + 1).padStart(2, '0')}</div><h1>${esc(lbl(t))}</h1><p class="lead">${esc(qst(t))}</p>
      ${LANG === 'en' ? `<p class="mono m3 note-en">${tr('en.note')}</p>` : ''}
      ${pickBox(ai, AI_ON && choose ? `<div class="mono m3" id="aiwait">${tr('pick.ai.loading')}</div>` : '')}
      <div class="mono m3" style="margin-bottom:8px">${choose ? tr('opts.choose') : tr('opts.check')}</div>
      <div class="opts" role="${choose ? 'radiogroup' : 'group'}">${opts}</div>
      ${choose ? `<div class="rej"><div class="mono m3" style="margin-bottom:8px">${tr('rej.h')}</div><ul id="rej"></ul></div>` : ''}
      ${D.comparisons[topic] ? compareHtml(D.comparisons[topic], used) : (choose ? `<p class="m2 nocmp">${tr('cmp.none')}</p>` : '')}
    </div>
    <aside class="side">
      <div><div class="mono m3">${tr('topic.status')}</div><div style="display:flex;gap:10px;align-items:center;margin-top:6px"><span class="dot ${s}"></span>${STATUS_LONG()[s]}</div></div>
      <div class="acts">
        ${choose && ai ? `<button class="btn acc" id="acc">${tr('act.accept')}</button>` : ''}
        <button class="btn ${choose && ai ? 'line' : ''}" id="dec">${choose ? tr('act.decide') : tr('act.checked')}</button>
        ${s === 'done' ? `<button class="btn line" id="undo">${tr('act.undo')}</button>` : ''}
        <a class="btn line" href="#/map">${tr('act.back')}</a>
      </div>
      <div class="gl"><div class="mono m3">${tr('topic.links')}</div>
        <div>${tr('topic.before')}${t.depends_on.length ? t.depends_on.map(d => `<a href="#/t/${d}">${esc(lbl(T[d]))}</a>${status(T[d]) === 'done' ? '' : tr('topic.open.mark')}`).join('、') : tr('topic.first')}</div>
        <div>${tr('topic.after')}${later.length ? later.map(u => `<a href="#/t/${u.topic}">${esc(lbl(u))}</a>`).join('、') : tr('none')}</div>
        ${blocked.length ? `<div class="m2">${tr('topic.blocked', lbl(T[blocked[0]]))}</div>` : ''}</div>
      <div class="gl" id="words"></div>
      <div class="mono m3" style="text-transform:none;letter-spacing:.02em">${tr('topic.checked')} ${esc(t.last_checked)}<br>${t.check_cadence === 'deep_when_used' ? tr('cadence.deep') : tr('cadence.daily')}</div>
    </aside></div></section>`;
  const optEls = [...app.querySelectorAll('.opt')];
  const paint = () => {
    optEls.forEach(o => o.setAttribute('aria-checked', choose ? o.dataset.id === sel : sel.has(o.dataset.id)));
    if (choose) $('#rej').innerHTML = t.options.filter(o => o !== sel).map(o => `<li><b>${esc(itemName(o))}</b><span>${gloss(ai?.rejected?.find(r => r.option === o)?.why || D.items[o]?.avoid_when || '', used)}</span></li>`).join('');
    else $('#dec').disabled = sel.size !== t.options.length;
    $('#words').innerHTML = used.size ? `<div class="mono m3">${tr('words')}</div>${D.glossary.filter(g => used.has(g.term)).map(g => `<div><b>${esc(g.plain)}</b>（${esc(g.term)}）— ${esc(g.one_line)}</div>`).join('')}` : '';
  };
  optEls.forEach(o => { const f = () => { if (choose) sel = o.dataset.id; else sel.has(o.dataset.id) ? sel.delete(o.dataset.id) : sel.add(o.dataset.id); paint(); };
    o.onclick = ev => { if (ev.target.closest('a')) return; f(); }; o.onkeydown = ev => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); f(); } }; });
  paint();
  const decide = by => {
    if (choose) P.choices[topic] = { status: 'decided', pick: sel, by, reason: sel === ai?.id ? ai.reason : tr('reason.self'), ...(ai?.rejected && sel === ai.id ? { rejected: ai.rejected } : {}) };
    else P.choices[topic] = { status: 'decided', checked: [...sel], by: 'human' };
    save(); toast(`${lbl(t)} — ${tr('st.done')}`); location.hash = '#/map';
  };
  if ($('#acc')) $('#acc').onclick = () => { sel = ai.id; decide(ai.source === 'ai' ? 'ai:' + ai.model : 'human'); };
  $('#dec').onclick = () => decide('human');
  if ($('#undo')) $('#undo').onclick = () => { delete P.choices[topic]; save(); viewTopic(topic); };
  if (AI_ON && choose && ai) fetchAiPick(t).then(out => {
    if (!$('#pickbox') || !T[topic]) return;
    ai = { id: out.pick, reason: LANG === 'en' ? out.reason_en : out.reason_ja, source: 'ai', model: out.model, rejected: out.rejected.map(r => ({ option: r.option, why: LANG === 'en' ? r.why_en : r.why_ja })) };
    $('#pickbox').outerHTML = pickBox(ai, out.unverified_prices ? `<div class="mono m3">${tr('pick.ai.unverified')}</div>` : '');
    optEls.forEach(o => { const tag = o.querySelector('[data-aitag]'); if (tag) tag.remove(); if (o.dataset.id === ai.id) o.querySelector('.nm2 span').insertAdjacentHTML('afterend', `<span class="tagv ai" data-aitag>${tr('pick.tag.ai')}</span>`); });
    if (!c.pick) sel = ai.id;
    paint();
  }).catch(() => { const w = $('#aiwait'); if (w) w.textContent = tr('pick.ai.failed'); });
}

// ---------- 画面4：カタログ（全分野） ----------
const usedBy = id => D.tactics.filter(t => t.options.includes(id));
function viewCatalog(domain) {
  const doms = Object.values(CATALOG);
  if (domain && !CATALOG[domain]) { location.hash = '#/catalog'; return; }
  if (!domain) {
    const touched = doms.filter(c => c.ids.some(id => usedBy(id).length)).length;
    app.innerHTML = `<section class="page"><div class="mono m2">04 — CATALOG ・ ${doms.length} AREAS · ${Object.keys(D.items).length} ITEMS</div>
      <h1>${tr('cat.h1')}</h1><p class="lead">${tr('cat.lead', touched)}</p>
      <div class="cat">${doms.map((c, i) => { const n = c.ids.filter(id => usedBy(id).length).length; const topics = [...new Set(c.ids.flatMap(id => usedBy(id).map(t => t.topic)))];
        return `<a class="crow" href="#/catalog/${c.domain}"><span class="mono m3">${String(i + 1).padStart(2, '0')}</span><span><b>${esc(c.domain)}</b><small>${esc(c.title)}</small></span>
          <span class="sqs">${c.ids.slice(0, 40).map(id => `<i class="sq ${usedBy(id).length ? 'done' : ''}"></i>`).join('')}${c.ids.length > 40 ? `<i class="mono m3">+${c.ids.length - 40}</i>` : ''}</span>
          <span class="mono m2">${tr('cat.count', c.ids.length)}${n ? ` · ${tr('cat.onmap', n)}` : ''}${topics.length ? `<br><span class="m3">${topics.map(x => esc(lbl(T[x]))).join('・')}</span>` : ''}</span></a>`; }).join('')}</div></section>`;
    return;
  }
  const c = CATALOG[domain]; const used = new Set();
  app.innerHTML = `<section class="page"><div class="mono m2"><a href="#/catalog" style="text-decoration:none">04 — CATALOG</a> ・ ${esc(domain)}</div>
    <h1>${esc(c.title)}</h1><p class="lead mono m2" style="text-transform:none">${esc(domain)} · ${tr('cat.count', c.ids.length)}${c.updated ? ' · ' + tr('cat.updated') + ' ' + esc(c.updated) : ''} · AI: get_catalog("${esc(domain)}")</p>
    <div class="opts">${c.ids.map(id => { const it = D.items[id]; if (!it) return ''; const ts = usedBy(id);
      return `<div class="opt static"><span class="sq ${ts.length ? 'done' : ''}" style="margin-top:5px"></span><div>
        <div class="nm2"><span>${esc(it.name)}</span>${it.verified === true || it.verified === 'True' ? `<span class="tagv ok">${tr('verified')}${it.checked ? ' ' + esc(it.checked) : ''}</span>` : `<span class="tagv">${tr('unverified')}</span>`}</div>
        <dl>${it.what ? `<dt>${tr('opt.content')}</dt><dd>${gloss(it.what, used)}</dd>` : ''}${it.best_for ? `<dt>${tr('opt.best')}</dt><dd>${gloss(it.best_for, used)}</dd>` : ''}${it.avoid_when ? `<dt>${tr('opt.avoid')}</dt><dd>${gloss(it.avoid_when, used)}</dd>` : ''}
          ${it.why ? `<dt>${tr('opt.why')}</dt><dd>${gloss(it.why, used)}</dd>` : ''}${it.check ? `<dt>${tr('opt.check')}</dt><dd>${gloss(it.check, used)}</dd>` : ''}${it.cost ? `<dt>${tr('opt.cost')}</dt><dd>${gloss(String(it.cost), used)}</dd>` : ''}
          ${it.url ? `<dt>${tr('opt.source')}</dt><dd><a href="${esc(it.url)}" target="_blank" rel="noopener">${tr('official.page')} ↗</a></dd>` : ''}
          <dt>${tr('opt.id')}</dt><dd class="mono m3" style="text-transform:none">${esc(id)}</dd>
          ${ts.length ? `<dt>${tr('cat.map')}</dt><dd>${ts.map(t => `<a href="#/t/${t.topic}">${esc(lbl(t))}</a>`).join('、')}</dd>` : ''}</dl></div></div>`; }).join('')}</div></section>`;
}

// ---------- ルーター ----------
function route() {
  const h = location.hash.slice(1) || '/'; const [, r, arg] = h.split('/');
  const name = r === 'map' ? 'map' : r === 't' ? 'topic' : r === 'catalog' ? 'catalog' : 'start';
  document.querySelectorAll('.steps [data-r]').forEach(a => a.classList.toggle('on', a.dataset.r === name));
  scrollTo(0, 0);
  name === 'map' ? viewMap() : name === 'topic' ? viewTopic(arg) : name === 'catalog' ? viewCatalog(arg) : viewStart();
}
addEventListener('hashchange', route);
$('#theme').onclick = () => { const d = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = d; try { localStorage.setItem('bp.theme', d); } catch {} };
$('#lang').onclick = () => { LANG = LANG === 'ja' ? 'en' : 'ja'; try { localStorage.setItem('bp.lang', LANG); } catch {} applyLang(); route(); };
applyLang();
route();

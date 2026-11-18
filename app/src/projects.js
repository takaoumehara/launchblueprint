// Per-project screens: #/p (list), #/p/<slug> (map: all decisions in six lanes + 12-category strip),
// #/p/<slug>/n/<topic> (map with node detail), #/p/<slug>/c/<NN> (category walker), #/p/<slug>/arch (architecture).
// Re-scoring under another preference profile uses the same core as the MCP server (shared/decide-core.mjs).
import * as core from '../../shared/decide-core.mjs';

const LOCAL = 'bp.projects.v2';
let ctx, IDX;
const cache = new Map();
const readLocal = () => { try { return JSON.parse(localStorage.getItem(LOCAL)) || {}; } catch { return {}; } };
const writeLocal = all => { try { localStorage.setItem(LOCAL, JSON.stringify(all)); } catch {} };

export function initProjects(c) {
  ctx = c;
  IDX = core.makeIndex({ tactics: c.D.tactics, comparisons: c.D.comparisons, facts: c.D.facts, categories: c.D.categories12, lanes: c.D.lanes, stages: c.D.stages });
}
const tr = (...a) => ctx.tr(...a);
const esc = s => ctx.esc(s);
const en = () => ctx.lang() === 'en';
const T = topic => IDX.T[topic];
const optName = id => !id ? '' : IDX.F[id]?.name || ctx.D.items[id]?.name || id;
const short = s => String(s || '').replace(/\s*([（(]|\s\/\s).*$/, '');
const catLabel = c => en() ? c.label_en : c.label_ja;
const catNo = c => c.id === 'xb' ? 'XB' : c.id;
const homeCat = topic => IDX.categories.find(c => c.topics.includes(topic));
const profileOf = id => ctx.D.profiles.find(p => p.id === id) || ctx.D.profiles.find(p => p.default) || ctx.D.profiles[0];
const profLabel = p => en() ? p.label_en : p.label_ja;
const ST = () => Object.fromEntries(core.STATUSES.map(s => [s, tr('p.st.' + s)]));
const mark = s => `<i class="mk mk-${s}" aria-hidden="true"></i>`;

// ---------- loading ----------
// slug "local" = the project this browser has been editing on #/ and #/map (bp.project.v1), as a project map.
function fromLocalEditor() {
  const m = ctx.localMap();
  m.slug = 'local'; m.schema = 'blueprint.project-map/v2'; m.preference_profile = profileOf().id;
  m.choices = m.choices.map(c => c.status === 'decided' ? { ...c, owner_confirmed: true, decided_by: c.decided_by && !String(c.decided_by).startsWith('ai') ? c.decided_by : 'owner' } : c);
  return m;
}
async function loadMap(slug) {
  const local = readLocal()[slug];
  if (local) return { map: core.normalizeMap(local, IDX), where: ctx.D.projects.some(p => p.slug === slug) ? 'local-copy' : 'local' };
  if (slug === 'local') return { map: core.normalizeMap(fromLocalEditor(), IDX), where: 'editor' };
  if (!ctx.D.projects.some(p => p.slug === slug)) return null;
  if (!cache.has(slug)) { const r = await fetch(`/projects/${slug}.json`); if (!r.ok) return null; cache.set(slug, await r.json()); }
  return { map: core.normalizeMap(structuredClone(cache.get(slug)), IDX), where: 'bundled' };
}
function saveLocal(slug, map) { const all = readLocal(); all[slug] = map; writeLocal(all); }
function dropLocal(slug) { const all = readLocal(); delete all[slug]; writeLocal(all); }
const counts = m => Object.fromEntries(core.STATUSES.map(s => [s, m.choices.filter(c => c.status === s).length]));

// ---------- router entry ----------
export async function viewProjects(parts) {
  const [slug, sub, arg] = parts;
  if (!slug) return viewList();
  if (!core.isSlug(slug)) { location.hash = '#/p'; return; }
  const got = await loadMap(slug);
  if (!got) { ctx.app.innerHTML = `<section class="page"><div class="mono m2">${tr('p.kicker')}</div><h1>${tr('p.notfound')}</h1><p class="lead">${esc(slug)}</p><a class="btn line" href="#/p">${tr('p.list')}</a></section>`; return; }
  if (sub === 'arch') return viewArch(slug, got);
  if (sub === 'c') return viewWalker(slug, got, arg || '01');
  return viewMap(slug, got, sub === 'n' ? arg : null);
}

// ---------- list ----------
function viewList() {
  const local = readLocal();
  const rows = [
    ...ctx.D.projects.map(p => ({ slug: p.slug, name: p.name, goal: p.goal, profile: p.preference_profile, counts: p.counts, where: local[p.slug] ? 'local-copy' : 'bundled' })),
    ...Object.entries(local).filter(([s]) => !ctx.D.projects.some(p => p.slug === s)).map(([s, m]) => ({ slug: s, name: m.name || s, goal: m.goal || '', profile: m.preference_profile, counts: counts(core.normalizeMap(m, IDX)), where: 'local' })),
  ];
  if (!rows.some(r => r.slug === 'local')) rows.push({ slug: 'local', name: ctx.localName() || tr('untitled'), goal: tr('p.local.goal'), profile: profileOf().id, counts: null, where: 'editor' });
  ctx.app.innerHTML = `<section class="page"><div class="mono m2">${tr('p.kicker')}</div><h1>${tr('p.h1')}</h1><p class="lead">${tr('p.lead')}</p>
    <div class="cat">${rows.map(r => `<a class="prow" href="#/p/${r.slug}"><span class="mono m3">#/p/${esc(r.slug)}</span><span><b>${esc(r.name)}</b><small>${esc(r.goal)}</small></span>
      <span class="mono m2">${esc(profLabel(profileOf(r.profile)))}<br><span class="m3">${tr('p.where.' + r.where)}</span></span>
      <span class="pcount">${r.counts ? statusLine(r.counts) : ''}</span></a>`).join('')}</div>
    <div class="imp"><div class="mono m3">${tr('p.import')}</div><p class="m2">${tr('p.import.h')}</p>
      <div class="acts-row"><label class="btn line" for="impf">${tr('p.import.file')}</label><input type="file" id="impf" accept=".yaml,.yml,.json" hidden></div></div>
    <p class="mono m3 fmt">${tr('p.format')}</p></section>`;
  ctx.$('#impf').onchange = async e => {
    const f = e.target.files[0]; if (!f) return;
    try {
      const txt = await f.text(); const m = f.name.endsWith('.json') ? JSON.parse(txt) : ctx.yaml.load(txt);
      if (!m || m.domain !== 'project_map') throw new Error('not a project map');
      const slug = core.isSlug(m.slug) ? m.slug : core.slugify(m.name || f.name.replace(/\.\w+$/, '')) || 'imported';
      saveLocal(slug, { ...m, slug }); location.hash = '#/p/' + slug;
    } catch (er) { ctx.toast(tr('p.import.bad')); }
  };
}
function statusLine(c) {
  return core.STATUSES.filter(s => c[s]).map(s => `<span class="sl">${mark(s)}${c[s]} ${esc(ST()[s])}</span>`).join('');
}

// ---------- shared header ----------
function header(slug, got, here) {
  const m = got.map; const p = profileOf(m.preference_profile);
  const tabs = [['map', `#/p/${slug}`, tr('p.tab.map')], ['walk', `#/p/${slug}/c/01`, tr('p.tab.walk')], ['arch', `#/p/${slug}/arch`, tr('p.tab.arch')]];
  return `<div class="phead">
    <div class="mono m2"><a href="#/p" style="text-decoration:none">${tr('p.kicker')}</a> ・ #/p/${esc(slug)} ・ ${tr('p.where.' + got.where)}</div>
    <h1>${esc(m.name || tr('untitled'))}</h1><p class="lead">${esc(m.goal || '')}</p>
    <div class="ptools">
      <nav class="ptabs mono">${tabs.map(([k, h, l]) => `<a href="${h}" class="${k === here ? 'on' : ''}">${l}</a>`).join('')}</nav>
      <div class="pprof" role="group" aria-label="${tr('p.profile')}"><span class="mono m3">${tr('p.profile')}</span>${ctx.D.profiles.map(x => `<button type="button" class="tbtn mono ${x.id === p.id ? 'on' : ''}" data-prof="${x.id}" aria-pressed="${x.id === p.id}" title="${esc(en() ? x.summary_en : x.summary_ja)}">${esc(profLabel(x))}</button>`).join('')}</div>
      <div class="pacts mono"><button type="button" id="pexy">${tr('p.export')}</button>${got.where === 'local-copy' ? ` · <button type="button" id="preset">${tr('p.reset')}</button>` : ''}</div>
    </div>
    <div class="pstat">${statusLine(counts(m))}</div>
    <div id="pbanner"></div></div>`;
}
function bindHeader(slug, got, rerender) {
  ctx.app.querySelectorAll('[data-prof]').forEach(b => b.onclick = () => {
    const p = profileOf(b.dataset.prof); if (p.id === got.map.preference_profile) return;
    const from = got.map.preference_profile;
    const r = core.rescoreMap(got.map, IDX, p, { date: new Date().toISOString().slice(0, 10) });
    r.map.history = [...(r.map.history || []), { date: new Date().toISOString().slice(0, 10), by: 'owner (app)', change: 'preference_profile', from, to: p.id, rescored: r.changes }];
    saveLocal(slug, r.map); got.map = r.map; got.where = got.where === 'bundled' ? 'local-copy' : got.where;
    rerender();
    const drift = r.map.choices.filter(c => c.profile_drift);
    ctx.$('#pbanner').innerHTML = `<div class="banner"><b>${tr('p.rescored', profLabel(p), r.changes.length)}</b>${r.changes.length ? `<ul>${r.changes.map(x => `<li><a href="#/p/${slug}/n/${x.topic}">${esc(ctx.lbl(T(x.topic)))}</a>：${esc(short(optName(x.from)) || '—')} → <b>${esc(short(optName(x.to)))}</b></li>`).join('')}</ul>` : ''}${drift.length ? `<div class="m2">${tr('p.drift', drift.length)}</div>` : ''}</div>`;
  });
  ctx.$('#pexy').onclick = () => ctx.download(`${slug}.project-map.yaml`, ctx.yaml.dump(got.map, { lineWidth: 140, noRefs: true }), 'text/yaml');
  if (ctx.$('#preset')) ctx.$('#preset').onclick = () => { dropLocal(slug); route(); };
}
const route = () => dispatchEvent(new HashChangeEvent('hashchange'));

// ---------- map: all decisions, six lanes × five stages, plus the 12-category strip ----------
function catStrip(slug, m, current) {
  const by = Object.fromEntries(m.choices.map(c => [c.topic, c]));
  return `<nav class="c12" aria-label="${tr('p.walk.label')}">${IDX.categories.map(c => {
    const ts = c.topics.map(t => by[t]).filter(Boolean);
    const seg = core.STATUSES.map(s => [s, ts.filter(x => x.status === s).length]).filter(([, n]) => n);
    return `<a href="#/p/${slug}/c/${c.id}" class="${current === c.id ? 'on' : ''}" title="${esc(catLabel(c))}"><span class="mono">${catNo(c)}${c.gap_note_en ? ' <span class="flag">!</span>' : ''}</span><span class="cl">${esc(short(catLabel(c)))}</span>
      <span class="bar">${ts.length ? seg.map(([s, n]) => `<i class="b-${s}" style="flex:${n}"></i>`).join('') : '<i class="b-none" style="flex:1"></i>'}</span></a>`; }).join('')}</nav>`;
}
function nodeChip(slug, c, sel) {
  const t = T(c.topic); const opt = c.observed_as ? short(c.observed_as) : short(optName(core.chosenOf(c) || c.ai_pick));
  const sub = t.kind === 'checklist' && c.status !== 'gap' ? tr('p.items', t.options.length) : opt || ST()[c.status];
  const flagged = c.status === 'gap' || c.gap_note;
  return `<a class="pn st-${c.status} ${sel === c.topic ? 'sel' : ''}" href="#/p/${slug}/n/${c.topic}" data-topic="${c.topic}" title="${esc(ST()[c.status])}">${mark(c.status)}<span><b>${esc(ctx.lbl(t))}</b><small>${esc(sub)}</small></span>${flagged ? `<span class="flag" title="${esc(c.gap_note || tr('p.st.gap'))}">${tr('p.gap.tag')}</span>` : ''}${c.profile_drift ? `<span class="flag drift" title="${esc(tr('p.drift.one', short(optName(c.profile_drift.would_pick))))}">≠</span>` : ''}</a>`;
}
function viewMap(slug, got, sel) {
  const m = got.map; const by = Object.fromEntries(m.choices.map(c => [c.topic, c]));
  const render = () => {
    const grid = `<div class="lgrid" style="--lanes:${IDX.lanes.length}">
      <div class="lh"></div>${IDX.lanes.map((l, i) => `<div class="lh mono"><span class="m3">${String(i + 1).padStart(2, '0')}</span> ${esc(l.label)}<small>${esc(en() ? l.en : l.ja)}</small></div>`).join('')}
      ${IDX.stages.map((s, si) => `<div class="sh mono"><span class="m3">${String(si + 1).padStart(2, '0')}</span> ${esc(s.label)}<small>${esc(en() ? s.what_en : s.ja)}</small></div>
        ${IDX.lanes.map(l => { const ts = IDX.tactics.filter(t => t.stage === s.id && t.lane === l.id);
          return `<div class="cell"><div class="cap mono m3">${esc(s.label)} · ${esc(l.label)}</div>${ts.map(t => nodeChip(slug, by[t.topic], sel)).join('')}</div>`; }).join('')}`).join('')}
    </div>`;
    const legend = `<div class="plg mono m2">${core.STATUSES.map(s => `<span>${mark(s)} ${esc(ST()[s])}</span>`).join('')}<span><span class="flag">${tr('p.gap.tag')}</span> ${tr('p.legend.gap')}</span><span><span class="flag drift">≠</span> ${tr('p.legend.drift')}</span></div>`;
    ctx.app.innerHTML = `<section class="page wide">${header(slug, got, 'map')}${catStrip(slug, m, null)}
      <div class="pgrid ${sel ? 'withd' : ''}"><div>${grid}${legend}</div>${sel && by[sel] ? `<aside class="pdet" id="pdet" data-topic="${sel}">${detailHtml(slug, got, sel, true)}</aside>` : ''}</div></section>`;
    bindHeader(slug, got, render); bindDetail(slug, got, render);
    if (sel && innerWidth < 900) ctx.$('#pdet')?.scrollIntoView?.({ block: 'start' });
  };
  render();
}

// ---------- node detail ----------
const fmt = n => typeof n === 'number' ? n.toFixed(2) : '—';
function detailHtml(slug, got, topic, closable) {
  const m = got.map; const c = m.choices.find(x => x.topic === topic); const t = T(topic); const cat = homeCat(topic);
  const prof = profileOf(c.profile || m.preference_profile);
  const chosen = core.chosenOf(c) || c.ai_pick;
  const f = IDX.F[chosen];
  const head = {
    observed: tr('p.chosen.observed'), decided: tr('p.chosen.decided', c.decided_by || 'owner', c.confirmed_at || c.date || ''), ai_selected: tr('p.chosen.ai', profLabel(prof)),
    gap: tr('p.chosen.gap'), deferred: tr('p.chosen.deferred'), open: tr('p.chosen.open'),
  }[c.status];
  const reason = en() ? c.reason : (c.reason_ja || c.reason);
  const considered = (c.considered || []).filter(x => x.scores);
  const crit = core.CRITERIA;
  const critName = k => esc((ctx.D.criteria.find(x => x.id === k) || {})[en() ? 'label_en' : 'label_ja'] || k);
  const table = considered.length ? `<div class="mono m3 dh">${tr('p.alts', considered.length, profLabel(prof))}</div>
    <div class="tscroll"><table class="alt"><thead><tr><th>#</th><th>${tr('p.option')}</th><th>${tr('p.total')}</th>${crit.map(k => `<th title="${critName(k)}">${esc(k.replace('_', '-'))}<br><span class="m3">×${prof.weights[k]}</span></th>`).join('')}<th>${tr('p.source')}</th></tr></thead><tbody>
    ${considered.map(x => `<tr class="${x.option === chosen ? 'win' : ''}"><td class="mono">${x.rank}</td><td><b>${esc(short(x.name))}</b>${x.in_catalog === false ? ` <span class="m3">${tr('p.notincat')}</span>` : ''}</td><td class="mono">${fmt(x.total)}</td>
      ${crit.map(k => { const s = x.scores[k]; return `<td class="mono ${s.basis === 'gap' ? 'isgap' : ''}" title="${esc(s.evidence)}">${s.basis === 'gap' ? tr('p.gap.cell') : fmt(s.score)}${s.unverified ? '<sup>?</sup>' : ''}</td>`; }).join('')}
      <td class="mono m2">${x.url ? `<a href="${esc(x.url)}" target="_blank" rel="noopener">${x.verified ? tr('p.verified') : tr('p.unverified')}</a>` : tr('p.unverified')}${x.checked ? ' ' + esc(x.checked) : ''}</td></tr>`).join('')}</tbody></table></div>
    <details class="ev"><summary class="mono m2">${tr('p.evidence.each')}</summary>${considered.map(x => `<div class="evo"><b>${esc(x.name)}</b><dl>${crit.map(k => `<dt>${critName(k)}</dt><dd class="${x.scores[k].basis === 'gap' ? 'm3' : ''}">${fmt(x.scores[k].score)} · ${esc(x.scores[k].basis)} — ${esc(x.scores[k].evidence)}</dd>`).join('')}${(x.bonus || []).map(b => `<dt>+${b.add}</dt><dd>${esc(b.why)}</dd>`).join('')}</dl></div>`).join('')}</details>` : '';
  const checklist = t.kind === 'checklist' ? `<div class="mono m3 dh">${tr('p.checks')}</div><ul class="chk">${t.options.map(o => { const it = ctx.D.items[o] || {}; const done = (c.checked || []).includes(o);
    return `<li>${mark(done ? 'decided' : 'open')}<span><b>${esc(it.name || o)}</b><small>${esc(it.check || it.what || '')}</small></span></li>`; }).join('')}</ul>` : '';
  const hist = (m.history || []).filter(h => h.topic === topic || (h.rescored || []).some?.(r => r.topic === topic));
  const editable = true;
  return `${closable ? `<a class="x mono" href="#/p/${slug}" aria-label="${tr('p.close')}">×</a>` : ''}
    <div class="mono m2">${esc(IDX.lanes.find(l => l.id === t.lane)?.label)} ・ ${esc(t.stage.toUpperCase())}${cat ? ` ・ <a href="#/p/${slug}/c/${cat.id}">${catNo(cat)} ${esc(short(catLabel(cat)))}</a>` : ''}</div>
    <h2 class="dt">${esc(ctx.lbl(t))}</h2><p class="m1 dq">${esc(ctx.qst(t))}</p>
    <div class="dstat">${mark(c.status)} <span>${esc(ST()[c.status])}</span></div>
    <div class="dchosen"><div class="mono m3">${head}</div>
      <div class="nm">${esc(c.observed_as || (t.kind === 'checklist' ? tr('p.items', t.options.length) : optName(chosen)) || '—')}</div>
      ${reason ? `<div class="m1">${esc(reason)}</div>` : ''}${c.agent_reason ? `<div class="m2">${tr('p.agent.reason')}${esc(c.agent_reason)}</div>` : ''}</div>
    <dl class="meta">
      <dt>${tr('p.profile')}</dt><dd>${esc(profLabel(prof))} <span class="m3 mono">${esc(prof.id)}</span></dd>
      ${f ? `<dt>${tr('p.source')}</dt><dd>${f.verified ? tr('p.verified') : `<b class="warn">${tr('p.unverified')}</b>`}${f.checked ? ' · ' + esc(f.checked) : ''}${f.url ? ` · <a href="${esc(f.url)}" target="_blank" rel="noopener">${tr('official.page')} ↗</a>` : ''}</dd>` : ''}
      ${c.date ? `<dt>${tr('p.date')}</dt><dd class="mono">${esc(c.date)}</dd>` : ''}
      <dt>${tr('p.by')}</dt><dd>${esc(c.status === 'observed' ? (c.source || 'repo') : c.decided_by || '—')}</dd>
    </dl>
    ${c.gap_note ? `<div class="gapbox"><span class="flag">${tr('p.gap.tag')}</span> ${esc(c.gap_note)}</div>` : ''}
    ${c.profile_drift ? `<div class="gapbox"><span class="flag drift">≠</span> ${tr('p.drift.one', esc(short(optName(c.profile_drift.would_pick))))}</div>` : ''}
    ${(c.evidence || []).length ? `<div class="mono m3 dh">${tr('p.evidence')}</div><ul class="evl">${c.evidence.map(e => `<li><span class="mono m2">${esc(e.kind)}</span> <code>${esc(e.path || e.url || '')}${e.line ? ':' + e.line : ''}</code> — ${esc(e.note)}</li>`).join('')}</ul>` : ''}
    ${(c.linkages || []).length ? `<div class="mono m3 dh">${tr('p.links')}</div><ul class="evl">${c.linkages.map(l => `<li><span class="mono m2">${esc(l.kind.replace(/_/g, ' '))}</span> ${esc(l.why)}${l.verified === false ? ` <span class="m3">(${tr('p.unverified')})</span>` : ''}</li>`).join('')}</ul>` : ''}
    ${checklist}${table}
    ${(c.rejected || []).length ? `<div class="mono m3 dh">${tr('p.rejected')}</div><ul class="evl">${c.rejected.map(r => `<li><b>${esc(short(optName(r.option)))}</b> — ${esc(r.why)}</li>`).join('')}</ul>` : ''}
    ${(c.gap_notes || []).length ? `<details class="ev"><summary class="mono m2">${tr('p.gapnotes', c.gap_notes.length)}</summary><ul class="evl">${c.gap_notes.map(g => `<li>${esc(g)}</li>`).join('')}</ul></details>` : ''}
    ${hist.length ? `<details class="ev"><summary class="mono m2">${tr('p.history', hist.length)}</summary><ul class="evl">${hist.map(h => `<li class="mono m2" style="text-transform:none">${esc(h.date)} · ${esc(h.by || '')} · ${esc(h.change)}${h.to?.status ? ' → ' + esc(h.to.status) : ''}${h.note ? ' — ' + esc(h.note) : ''}</li>`).join('')}</ul></details>` : ''}
    ${editable ? `<div class="dacts">
      ${t.kind === 'choose' && c.status !== 'decided' && chosen && c.status !== 'observed' ? `<button class="btn acc" data-act="approve">${tr('p.approve', short(optName(chosen)))}</button>` : ''}
      ${t.kind === 'choose' && considered.length > 1 && c.status !== 'observed' ? `<label class="mono m3" for="other-${topic}">${tr('p.other')}</label><select id="other-${topic}" data-act="other"><option value="">—</option>${considered.filter(x => x.option !== chosen && x.in_catalog !== false).map(x => `<option value="${esc(x.option)}">${esc(short(x.name))} (${fmt(x.total)})</option>`).join('')}</select>` : ''}
      ${t.kind === 'checklist' && c.status !== 'decided' ? `<button class="btn line" data-act="approve-all">${tr('p.approve.all')}</button>` : ''}
      ${c.status === 'decided' ? `<button class="btn line" data-act="undo">${tr('p.undo')}</button>` : ''}
      ${c.status !== 'deferred' && c.status !== 'observed' && c.status !== 'decided' ? `<button class="btn line" data-act="defer">${tr('p.defer')}</button>` : ''}
      <p class="m3 small">${tr('p.owner.note')}</p></div>` : ''}`;
}
function bindDetail(slug, got, rerender) {
  const today = new Date().toISOString().slice(0, 10);
  const set = (topic, patch, change) => {
    const c = got.map.choices.find(x => x.topic === topic); const from = { status: c.status, pick: c.pick, ai_pick: c.ai_pick };
    Object.assign(c, patch);
    got.map.history = [...(got.map.history || []), { date: today, by: 'owner (app)', change, topic, from, to: { status: c.status, pick: c.pick, ai_pick: c.ai_pick } }];
    saveLocal(slug, got.map); if (got.where === 'bundled') got.where = 'local-copy'; rerender(); ctx.toast(`${ctx.lbl(T(topic))} — ${ST()[c.status]}`);
  };
  ctx.app.querySelectorAll('[data-act]').forEach(el => {
    const topic = el.closest('.pdet, .wcard')?.dataset.topic || el.closest('[data-topic]')?.dataset.topic;
    const c = got.map.choices.find(x => x.topic === topic); if (!c) return;
    const decide = pick => set(topic, { status: 'decided', pick, owner_confirmed: true, decided_by: 'owner', confirmed_at: today, profile: got.map.preference_profile }, 'owner decided');
    if (el.dataset.act === 'approve') el.onclick = () => decide(core.chosenOf(c) || c.ai_pick);
    if (el.dataset.act === 'other') el.onchange = () => el.value && decide(el.value);
    if (el.dataset.act === 'approve-all') el.onclick = () => set(topic, { status: 'decided', checked: [...T(topic).options], owner_confirmed: true, decided_by: 'owner', confirmed_at: today }, 'owner checked all');
    if (el.dataset.act === 'undo') el.onclick = () => set(topic, { status: c.ai_pick || T(topic).kind === 'checklist' ? 'ai_selected' : 'open', pick: '', owner_confirmed: false, checked: [] }, 'owner undo');
    if (el.dataset.act === 'defer') el.onclick = () => set(topic, { status: 'deferred', reason: c.reason || tr('p.defer.reason') }, 'owner deferred');
  });
}

// ---------- category walker: 01 → 12, then the cross-border pack ----------
function viewWalker(slug, got, id) {
  const cats = IDX.categories; const i = cats.findIndex(c => c.id === id);
  if (i < 0) { location.hash = `#/p/${slug}/c/01`; return; }
  const c = cats[i]; const prev = cats[i - 1], next = cats[i + 1];
  const render = () => {
    const m = got.map; const by = Object.fromEntries(m.choices.map(x => [x.topic, x]));
    ctx.app.innerHTML = `<section class="page wide">${header(slug, got, 'walk')}${catStrip(slug, m, c.id)}
      <div class="walk"><div class="whead"><div class="wnum">${catNo(c)}</div><div><div class="mono m2">${tr('p.walk.step', i + 1, cats.length)}</div><h2 class="dt">${esc(catLabel(c))}</h2>
        <div class="mono m3">${tr('p.walk.count', c.topics.length)}${(c.also || []).length ? ' · ' + tr('p.walk.also') + c.also.map(t => `<a href="#/p/${slug}/n/${t}">${esc(ctx.lbl(T(t)))}</a>`).join('、') : ''}</div></div>
        <div class="wnav">${prev ? `<a class="btn line" href="#/p/${slug}/c/${prev.id}">← ${catNo(prev)}</a>` : ''}${next ? `<a class="btn" href="#/p/${slug}/c/${next.id}">${catNo(next)} →</a>` : `<a class="btn" href="#/p/${slug}/arch">${tr('p.tab.arch')} →</a>`}</div></div>
        ${c.gap_note_en ? `<div class="gapbox"><span class="flag">${tr('p.gap.tag')}</span> ${esc(en() ? c.gap_note_en : c.gap_note_ja)}</div>` : ''}
        ${c.topics.length ? c.topics.map(t => `<article class="wcard pdet" data-topic="${t}">${detailHtml(slug, got, t, false)}</article>`).join('') : `<p class="m2">${tr('p.walk.empty')}</p>`}
      </div></section>`;
    bindHeader(slug, got, render); bindDetail(slug, got, render);
  };
  render();
}

// ---------- architecture ----------
function viewArch(slug, got) {
  const render = () => {
    const a = core.deriveArchitecture(got.map, IDX);
    const roles = a.roles;
    const col = r => a.nodes.filter(n => n.role === r && n.state !== 'deferred');
    const deferred = a.nodes.filter(n => n.state === 'deferred');
    const nodeHtml = n => `<a class="ab ab-${n.state}" data-id="${esc(n.id)}" ${n.topic ? `href="#/p/${slug}/n/${n.topic}"` : ''} title="${esc(tr('p.arch.st.' + n.state))}">
      <span class="mono m3">${esc(n.topic ? ctx.lbl(T(n.topic)) : n.id)}</span><b>${esc(short(n.name) || tr('p.arch.none'))}</b><small class="mono">${esc(tr('p.arch.st.' + n.state))}${n.evidence.length ? ' · ' + tr('p.arch.ev', n.evidence.length) : ''}</small></a>`;
    const impl = a.edges.filter(e => e.state === 'implemented').length;
    ctx.app.innerHTML = `<section class="page wide">${header(slug, got, 'arch')}
      <p class="m1 alead">${tr('p.arch.lead')}</p>
      <div class="plg mono m2"><span><i class="lk lk-implemented"></i> ${tr('p.arch.st.implemented')}</span><span><i class="lk lk-proposed"></i> ${tr('p.arch.st.proposed')}</span><span><i class="abx ab-gap"></i> ${tr('p.arch.st.gap')}</span><span><i class="abx ab-open"></i> ${tr('p.arch.st.open')}</span><span>${tr('p.arch.count', impl, a.edges.length - impl)}</span></div>
      <div class="arch" id="arch"><svg id="alinks" aria-hidden="true"></svg>
        ${roles.map(r => `<div class="acol"><div class="mono lh">${tr('p.role.' + r)}</div>${col(r).map(nodeHtml).join('') || `<div class="m3 small">—</div>`}</div>`).join('')}
      </div>
      ${deferred.length ? `<p class="m2 small">${tr('p.arch.deferred')}${deferred.map(n => `<a href="#/p/${slug}/n/${n.topic}">${esc(ctx.lbl(T(n.topic)))}</a>`).join('、')}</p>` : ''}
      <div class="mono m3 dh">${tr('p.arch.links')}</div>
      <div class="tscroll"><table class="alt links"><thead><tr><th>${tr('p.arch.from')}</th><th>${tr('p.arch.to')}</th><th>${tr('p.arch.what')}</th><th>${tr('p.arch.state')}</th><th>${tr('p.arch.basis')}</th></tr></thead><tbody>
      ${a.edges.map(e => `<tr><td>${esc(nm(a, e.from))}</td><td>${esc(nm(a, e.to))}</td><td>${esc(e.label)}</td><td class="mono"><i class="lk lk-${e.state}"></i> ${esc(tr('p.arch.st.' + e.state))}</td>
        <td class="m2">${e.basis === 'evidence' ? (e.evidence || []).map(x => `<code>${esc(x.path || x.url || '')}</code> ${esc(x.note)}`).join('<br>') : tr('p.arch.pattern')}${e.note ? `<br><span class="m3">${esc(e.note)}</span>` : ''}</td></tr>`).join('')}</tbody></table></div>
    </section>`;
    bindHeader(slug, got, render);
    drawLinks(a);
  };
  render();
}
const nm = (a, id) => { const n = a.nodes.find(x => x.id === id); return n ? (n.topic ? ctx.lbl(T(n.topic)) : n.name) + (n.name && n.topic ? ` (${short(n.name)})` : '') : id; };
function drawLinks(a) {
  const box = ctx.$('#arch'); const svg = ctx.$('#alinks'); if (!box || !svg) return;
  const draw = () => {
    const R = box.getBoundingClientRect(); svg.setAttribute('viewBox', `0 0 ${R.width} ${R.height}`);
    const at = id => { const el = box.querySelector(`.ab[data-id="${CSS.escape(id)}"]`); if (!el) return null; const r = el.getBoundingClientRect(); return { l: r.left - R.left, r: r.right - R.left, y: r.top - R.top + r.height / 2, cx: r.left - R.left + r.width / 2 }; };
    svg.innerHTML = a.edges.map(e => { const p = at(e.from), q = at(e.to); if (!p || !q) return '';
      let d;
      if (Math.abs(p.cx - q.cx) < 4) { const x = p.r + 2, bx = x + 26; d = `M${x} ${p.y}C${bx} ${p.y},${bx} ${q.y},${x} ${q.y}`; }
      else { const [s, t] = p.cx < q.cx ? [{ x: p.r, y: p.y }, { x: q.l, y: q.y }] : [{ x: p.l, y: p.y }, { x: q.r, y: q.y }]; const dx = (t.x - s.x) * .45; d = `M${s.x} ${s.y}C${s.x + dx} ${s.y},${t.x - dx} ${t.y},${t.x} ${t.y}`; }
      return `<path class="lk-${e.state}" data-a="${esc(e.from)}" data-b="${esc(e.to)}" d="${d}"><title>${esc(e.label)}</title></path>`; }).join('');
  };
  draw(); document.fonts?.ready?.then(draw);
  clearTimeout(drawLinks.t); removeEventListener('resize', drawLinks.h || (() => {}));
  drawLinks.h = () => { clearTimeout(drawLinks.t); drawLinks.t = setTimeout(() => ctx.$('#alinks') && draw(), 120); }; addEventListener('resize', drawLinks.h);
  box.querySelectorAll('.ab').forEach(el => {
    el.onmouseenter = el.onfocus = () => { svg.classList.add('focus'); svg.querySelectorAll('path').forEach(p => p.classList.toggle('on', p.dataset.a === el.dataset.id || p.dataset.b === el.dataset.id)); };
    el.onmouseleave = el.onblur = () => svg.classList.remove('focus');
  });
}

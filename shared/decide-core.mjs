// Blueprint decide core — CREATIVITY IS EVERYWHERE, LLC
// Pure functions shared by the MCP server (mcp/) and the web app (app/). No I/O, no network, no secrets.
// Scores options under a preference profile from evidence only (catalog fields, the project's chosen parts,
// evidence an agent passes in). No evidence = a visible gap scored 0.5, never a guess. Prices are never written here.

export const CRITERIA = ['cost', 'speed', 'breadth', 'lock_in', 'scale', 'compliance', 'ecosystem'];
export const STATUSES = ['open', 'observed', 'ai_selected', 'decided', 'gap', 'deferred'];
// statuses whose option counts as a part the project has (for ecosystem / linkage scoring)
const HAS_PART = new Set(['observed', 'ai_selected', 'decided']);
const GAP_SCORE = 0.5;
const INTAKE_BONUS = 0.10;
const DEFAULT_BONUS = 0.02;

const str = v => (v == null ? '' : Array.isArray(v) ? v.join(' / ') : typeof v === 'object' ? Object.values(v).join(' / ') : String(v));
const clip = (s, n = 140) => { s = str(s).replace(/\s+/g, ' ').trim(); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
const r3 = n => Math.round(n * 1000) / 1000;
const DASH = /^\s*(—|-|–|none|null|n\/a)?\s*$/i;

export const slugify = s => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48);
export const isSlug = s => typeof s === 'string' && /^[a-z0-9][a-z0-9-]{0,47}$/.test(s);

// ---------- facts: one flat shape per option, from a raw catalog entry ----------
function pickSource(src) {
  if (Array.isArray(src)) {
    const s = src.filter(x => x && typeof x === 'object');
    if (!s.length) return {};
    const earliest = [...s].sort((a, b) => str(a.checked).localeCompare(str(b.checked)))[0];
    return { url: s[0].url ?? null, checked: earliest.checked ?? null, verified: s.every(x => x.verified === true) };
  }
  return src && typeof src === 'object' ? src : {};
}
export function factsFromRaw(id, raw, domain) {
  const src = pickSource(raw.source);
  const pb = raw.pricing_bands && typeof raw.pricing_bands === 'object' ? raw.pricing_bands : null;
  return {
    id, domain, name: raw.name ?? raw.name_ja ?? id,
    what: str(raw.what ?? raw.principle ?? raw.item ?? ''), best_for: str(raw.best_for ?? (raw.pros ?? '')), avoid_when: str(raw.avoid_when ?? raw.anti_pattern ?? (raw.cons ?? '')),
    check: str(raw.check ?? raw.acceptance ?? ''),
    free: pb ? (pb.free ?? null) : (raw.free_tier ?? null), bands: pb ? { usd5: pb.usd5 ?? null, usd10: pb.usd10 ?? null, usd100: pb.usd100 ?? null } : null,
    cost: raw.cost ?? null, lock_in: raw.lock_in ?? null, limits: str(raw.limits ?? ''), compliance: raw.liability_compliance ?? null,
    pairs: Array.isArray(raw.pairs_well_with) ? raw.pairs_well_with : [],
    verified: (src.verified ?? raw.verified) === true, checked: src.checked ?? raw.checked ?? raw.date ?? null, url: src.url ?? raw.url ?? null,
    entry: !!(raw.name && (raw.best_for || raw.pricing_bands)),
  };
}
// a stack-comparison service that has no catalog entry of its own
function factsFromService(s) {
  return { id: s.id, domain: 'stack_comparisons', name: s.name ?? s.id, what: '', best_for: '', avoid_when: '', check: '', free: s.free_tier ?? null,
    bands: s.paid_entry ? { usd5: s.paid_entry } : null, cost: null, lock_in: null, limits: '', compliance: null, pairs: [],
    verified: s.verified === true, checked: s.checked ?? null, url: s.url ?? null, entry: true };
}
// Walk every catalog doc ({domain: parsedYaml}) the same way the app and MCP do, returning {id: facts}.
export function collectFacts(catalogDocs) {
  const out = {};
  for (const [dom, d] of Object.entries(catalogDocs)) {
    if (!d || typeof d !== 'object') continue;
    const lists = Object.entries(d).filter(([, v]) => Array.isArray(v));
    if (d.auth?.providers) lists.push(['providers', d.auth.providers]);
    for (const [key, l] of lists) for (const it of l) if (it && typeof it === 'object' && it.id) {
      const id = String(it.id).includes('.') ? String(it.id) : `${dom}.${it.id}`;
      out[id] = { ...factsFromRaw(id, it, dom), list: key };
    }
  }
  return out;
}

// ---------- vendor: the official site of the source URL ----------
export function vendorOf(f) {
  if (!f?.url) return null;
  let u; try { u = new URL(f.url); } catch { return null; }
  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'github.com') { const seg = u.pathname.split('/').filter(Boolean)[0]; return seg ? `github.com/${seg.toLowerCase()}` : host; }
  const parts = host.split('.');
  if (/(^|\.)(google|amazon|microsoft)\.com$/.test(host) && parts.length >= 3) return parts.slice(-3).join('.');
  if (parts.length >= 3 && parts.at(-1).length === 2 && parts.at(-2).length <= 3) return parts.slice(-3).join('.');
  return parts.slice(-2).join('.');
}
const vendorWord = v => v ? v.replace(/^github\.com\//, '').split('.')[0] : null;
const GENERIC = new Set(['cloud', 'google', 'the', 'open', 'simple', 'my', 'own']);
function nameTokens(f) {
  const t = new Set();
  const vw = vendorWord(vendorOf(f)); if (vw && vw.length >= 3) t.add(vw);
  const first = str(f?.name).split(/[\s（(/]/)[0].toLowerCase();
  if (first.length >= 3 && /^[a-z0-9.-]+$/.test(first) && !GENERIC.has(first)) t.add(first);
  return [...t];
}

// ---------- index ----------
export function makeIndex({ tactics, comparisons, facts, categories, lanes, stages }) {
  const cmp = Array.isArray(comparisons) ? Object.fromEntries(comparisons.map(c => [c.topic, c])) : (comparisons || {});
  const F = { ...facts };
  for (const c of Object.values(cmp)) for (const s of c.services || []) if (!F[s.id]) F[s.id] = factsFromService(s);
  const T = Object.fromEntries(tactics.map(t => [t.topic, t]));
  const idx = { tactics, T, cmp, F, categories: categories || [], lanes: lanes || [], stages: stages || [], fields: {}, vendorTopics: {} };
  for (const t of tactics) idx.fields[t.topic] = fieldOf(t, idx);
  for (const t of tactics) if (t.kind === 'choose') for (const o of idx.fields[t.topic]) {
    const v = vendorOf(F[o.id]); if (!v) continue;
    (idx.vendorTopics[v] ??= new Set()).add(t.topic);
  }
  return idx;
}
// The realistic field: the tactic's options, the stack comparison's services (R-030), and — where the catalog keeps
// a list of interchangeable providers (auth.providers) — every provider in that list. Other catalog areas mix
// different kinds of entry (an SBOM tool next to a sale marketplace), so they are not swept in automatically.
function fieldOf(t, idx) {
  const seen = new Map();
  const add = (id, from) => { if (!idx.F[id]) return; const e = seen.get(id); if (e) { if (!e.from.includes(from)) e.from.push(from); } else seen.set(id, { id, from: [from] }); };
  for (const o of t.options) add(o, 'tactic');
  if (t.kind !== 'choose') return [...seen.values()];
  for (const s of idx.cmp[t.topic]?.services || []) add(s.id, 'comparison');
  const provDomains = new Set(t.options.map(o => idx.F[o]).filter(f => f?.list === 'providers').map(f => f.domain));
  for (const f of Object.values(idx.F)) if (f.list === 'providers' && provDomains.has(f.domain)) add(f.id, 'catalog_providers');
  return [...seen.values()];
}
export const fieldFor = (topic, idx) => idx.fields[topic] || [];

// ---------- profiles ----------
export function resolveProfiles(docs) {
  const byId = Object.fromEntries(docs.filter(d => d && d.id).map(d => [d.id, d]));
  const resolve = (d, seen = []) => {
    if (seen.includes(d.id)) throw new Error('profile extends cycle: ' + [...seen, d.id].join(' > '));
    const base = d.extends ? byId[d.extends] : null;
    if (d.extends && !base) throw new Error(`profile ${d.id} extends unknown ${d.extends}`);
    const bw = base ? resolve(base, [...seen, d.id]).weights : {};
    const weights = Object.fromEntries(CRITERIA.map(c => [c, Number(d.weights?.[c] ?? bw[c] ?? 0)]));
    return { ...d, scope: d.scope || 'org', weights, tie_break: d.tie_break || (base?.tie_break ?? []) };
  };
  return docs.filter(d => d && d.id).map(d => resolve(d));
}
export function validateProfile(p) {
  const errs = [];
  if (!isSlug(p?.id)) errs.push('id must be [a-z0-9-]');
  for (const c of CRITERIA) { const w = p?.weights?.[c]; if (typeof w !== 'number' || w < 0 || w > 5) errs.push(`weights.${c} must be 0..5`); }
  for (const k of Object.keys(p?.weights || {})) if (!CRITERIA.includes(k)) errs.push(`unknown criterion ${k}`);
  if (!CRITERIA.some(c => p?.weights?.[c] > 0)) errs.push('at least one weight > 0');
  return errs;
}

// ---------- signals: one score per criterion, each with its evidence ----------
const gap = (why) => ({ score: GAP_SCORE, basis: 'gap', evidence: why });
function costSignal(f) {
  const t = str(f.free ?? f.cost);
  const paid = f.bands && [f.bands.usd5, f.bands.usd10].some(x => x && !DASH.test(str(x)));
  const tag = f.verified ? '' : ' [verified:false]';
  if (!t || DASH.test(t)) return paid ? { score: 0.45, basis: 'catalog', evidence: 'no free band; paid band listed' + tag, unverified: !f.verified } : gap('no free or paid band in the catalog');
  if (/公開料金なし|個別見積|no public pric|custom quote|contact sales|要問い合わせ/i.test(t)) return { score: 0.1, basis: 'catalog', evidence: 'no public price: ' + clip(t, 90) + tag, unverified: !f.verified };
  if (/\$\s?0|無料|\bfree\b|\boss\b|0円|固定費なし|月額なし|no monthly/i.test(t)) {
    if (/非商用|non-?commercial/i.test(t)) return { score: 0.6, basis: 'catalog', evidence: 'free plan is non-commercial only: ' + clip(t, 90) + tag, unverified: !f.verified };
    if (/%/.test(t)) return { score: 0.85, basis: 'catalog', evidence: 'no fixed fee, per-transaction: ' + clip(t, 90) + tag, unverified: !f.verified };
    return { score: 1, basis: 'catalog', evidence: 'free start: ' + clip(t, 90) + tag, unverified: !f.verified };
  }
  if (/%/.test(t)) return { score: 0.7, basis: 'catalog', evidence: 'per-transaction: ' + clip(t, 90) + tag, unverified: !f.verified };
  return { score: 0.5, basis: 'catalog', evidence: clip(t, 110) + tag, unverified: !f.verified };
}
function lockSignal(f) {
  const t = str(f.lock_in).trim();
  if (!t) return gap('no lock_in field');
  const m = [[/変更不可|irreversible|cannot be changed/i, 0], [/^最低|^none|^lowest/i, 1], [/^低\s*[〜~-]\s*中|low.?to.?medium/i, 0.75], [/^中\s*[〜~-]\s*高|medium.?to.?high/i, 0.3],
    [/^低|^low/i, 0.9], [/^中|^medium/i, 0.5], [/^高|^high/i, 0.1]].find(([re]) => re.test(t));
  return m ? { score: m[1], basis: 'catalog', evidence: 'lock_in: ' + clip(t, 90) } : gap('lock_in text not graded: ' + clip(t, 60));
}
const SPEED_POS = /最速|すぐ|今日中|即日|手軽|簡単|コードを書かず|no-?code|quick|fast|minutes|数分|UI込み|丸投げ|一式|そろう|そろえ|zero.?config|設定なし|月額なしで始め/gi;
const SPEED_NEG = /自分で持て|自前|self-?host|セルフホスト|運用を自分|手間が増え|作る手間|個別見積|個別相談|提案時|設定が多/gi;
const SCALE_POS = /大量|大規模|enterprise|企業向け|数百万|監査ログ|伸びる|high.?volume|at scale/gi;
const SCALE_NEG = /小規模|small|非商用|一時停止|自動停止|hobby|使い捨て|最小の|知り合い向け/gi;
const hits = (re, s) => [...new Set((str(s).match(re) || []).map(x => x.toLowerCase()))];
function wordSignal(texts, pos, neg, invertNegInAvoid) {
  let p = 0, n = 0; const ev = [];
  for (const [field, s, avoid] of texts) {
    const hp = hits(pos, s), hn = hits(neg, s);
    if (hp.length) { avoid ? n++ : p++; ev.push(`${field} ${avoid ? '−' : '+'}「${hp.join('、')}」`); }
    if (hn.length) { const good = avoid && invertNegInAvoid; good ? p++ : n++; ev.push(`${field} ${good ? '+' : '−'}「${hn.join('、')}」`); }
  }
  if (!p && !n) return null;
  return { score: r3(Math.max(0, Math.min(1, 0.5 + 0.25 * p - 0.25 * n))), basis: 'catalog', evidence: ev.join('; ') };
}
function texts(f, t, idx) {
  const out = [['best_for', f.best_for, false], ['what', f.what, false], ['avoid_when', f.avoid_when, true]];
  if (t) {
    if (t.ai_pick === f.id && t.ai_reason_ja) out.push(['tactic.ai_reason', t.ai_reason_ja, false]);
    for (const w of t.pick_when || []) if (w.pick === f.id) out.push(['tactic.pick_when', w.reason_ja, false]);
    const c = idx.cmp[t.topic];
    if (c?.recommendation?.pick === f.id) out.push(['comparison.reason', c.recommendation.reason, false]);
    for (const r of c?.recommendation?.rejected || []) if (r.option === f.id) out.push(['comparison.rejected', r.why, true]);
  }
  return out;
}
function complianceSignal(f) {
  const t = str(f.compliance).trim();
  if (!t || DASH.test(t)) return gap('no liability_compliance field');
  const keys = [[/SOC ?2/i, 'SOC 2'], [/ISO ?27001/i, 'ISO 27001'], [/GDPR|\bDPA\b|DPF/i, 'GDPR/DPA'], [/HIPAA/i, 'HIPAA'], [/PCI/i, 'PCI'], [/\bMoR\b|販売代行|merchant of record/i, 'MoR'], [/FCA|PSD2/i, 'FCA/PSD2']]
    .filter(([re]) => re.test(t)).map(([, k]) => k);
  return { score: keys.length ? Math.min(1, 0.4 + 0.2 * keys.length) : 0.25, basis: 'catalog', evidence: (keys.length ? keys.join(', ') + ' — ' : 'no certification named — ') + clip(t, 90), unverified: /未確認|unverified/i.test(t) || undefined };
}
function breadthSignal(f, idx) {
  const v = vendorOf(f); if (!v) return gap('no source URL, vendor unknown');
  const ts = [...(idx.vendorTopics[v] || [])];
  const n = ts.length;
  return { score: n >= 4 ? 1 : n === 3 ? 0.75 : n === 2 ? 0.55 : 0.3, basis: 'catalog', evidence: `${v} appears in ${n} map topic(s): ${ts.slice(0, 8).join(', ')}` };
}
// chosen: [{topic, option}] — parts the project already has (observed / ai_selected / decided), other topics only
function ecosystemSignal(f, t, chosen, idx) {
  const links = [];
  if (!chosen.length) return { signal: { score: 0.5, basis: 'neutral', evidence: 'nothing chosen yet' }, links };
  const v = vendorOf(f); const avoidText = [f.avoid_when, ...(idx.cmp[t?.topic]?.recommendation?.rejected || []).filter(r => r.option === f.id).map(r => r.why)].join(' ').toLowerCase();
  let best = 0.3, conflict = null;
  for (const c of chosen) {
    const g = idx.F[c.option]; if (!g || g.id === f.id) continue;
    const name = clip(g.name, 40);
    const gv = vendorOf(g);
    const own = new Set(nameTokens(f));
    const tok = !(v && gv && v === gv) && nameTokens(g).find(k => !own.has(k) && avoidText.includes(k));
    if (tok) { conflict = conflict || c; links.push({ kind: 'conflict', with_topic: c.topic, with_option: c.option, why: `avoid_when names ${name} (already in ${c.topic})` }); continue; }
    if (v && gv && v === gv) {
      best = Math.max(best, 1);
      links.push({ kind: 'same_vendor', with_topic: c.topic, with_option: c.option, why: `same vendor as ${c.topic} (${name}, ${v}): one account, one bill, fewer integrations` });
      const fr = x => { const s = costSignal(x); return s.basis !== 'gap' && s.score >= 0.6; };
      if (fr(f) && fr(g)) links.push({ kind: 'shared_free_tier', with_topic: c.topic, with_option: c.option, verified: false, why: `both start on ${v}'s free plan — check whether free-tier limits are per project or shared across the account` });
    } else if (f.pairs.includes(g.id) || g.pairs.includes(f.id)) {
      best = Math.max(best, 0.8);
      links.push({ kind: 'pairs_well_with', with_topic: c.topic, with_option: c.option, why: `catalog lists it as pairing well with ${name} (${c.topic})` });
    } else if (nameTokens(g).some(k => str(f.best_for).toLowerCase().includes(k))) {
      best = Math.max(best, 0.8);
      links.push({ kind: 'named_in_best_for', with_topic: c.topic, with_option: c.option, why: `best_for names ${name} (${c.topic})` });
    }
  }
  if (conflict) return { signal: { score: 0, basis: 'catalog', evidence: `conflicts with ${conflict.topic} (${conflict.option})` }, links };
  const pos = links.filter(l => l.kind !== 'shared_free_tier');
  return { signal: { score: best, basis: 'project', evidence: pos.length ? pos.map(l => l.why).join('; ') : 'no link to the parts already chosen' }, links };
}
export function signalsFor(optionId, topic, idx, chosen = []) {
  const f = idx.F[optionId]; const t = idx.T[topic];
  if (!f) return { scores: Object.fromEntries(CRITERIA.map(c => [c, gap('not in catalog')])), links: [] };
  const tx = texts(f, t, idx);
  const eco = ecosystemSignal(f, t, chosen.filter(c => c.topic !== topic), idx);
  const scores = {
    cost: costSignal(f), speed: wordSignal(tx, SPEED_POS, SPEED_NEG, false) || gap('no speed wording in best_for / what / avoid_when'),
    breadth: breadthSignal(f, idx), lock_in: lockSignal(f),
    scale: wordSignal([...tx, ['limits', f.limits, false], ['free', str(f.free), false]], SCALE_POS, SCALE_NEG, true) || gap('no scale wording in the catalog entry'),
    compliance: complianceSignal(f), ecosystem: eco.signal,
  };
  return { scores, links: eco.links };
}

// ---------- scoring ----------
function intakeMatch(t, intake) {
  for (const w of t?.pick_when || []) if (Object.entries(w.if || {}).every(([k, v]) => intake?.[k] === v)) return w;
  return null;
}
// evidence: [{option, criterion, score 0..1, note, url?}] from an agent — overrides catalog-derived scores, kept unverified.
export function scoreTopic({ topic, idx, profile, intake = {}, chosen = [], evidence = [], extra_options = [] }) {
  const t = idx.T[topic]; if (!t) throw new Error(`unknown topic ${topic}`);
  const field = [...fieldFor(topic, idx).map(x => ({ ...x }))];
  for (const e of extra_options) if (!field.some(x => x.id === e.id)) field.push({ id: e.id, from: ['agent'], extra: e });
  const W = profile.weights; const wsum = CRITERIA.reduce((s, c) => s + (W[c] || 0), 0) || 1;
  const im = intakeMatch(t, intake);
  const rows = field.map(x => {
    const { scores, links } = x.extra ? { scores: Object.fromEntries(CRITERIA.map(c => [c, gap('agent-proposed option, not in catalog')])), links: [] } : signalsFor(x.id, topic, idx, chosen);
    for (const e of evidence.filter(e => e.option === x.id && CRITERIA.includes(e.criterion))) {
      scores[e.criterion] = { score: Math.max(0, Math.min(1, Number(e.score))), basis: 'agent', evidence: clip(e.note, 200) + (e.url ? ` <${e.url}>` : ''), unverified: true };
    }
    let total = CRITERIA.reduce((s, c) => s + (W[c] || 0) * scores[c].score, 0) / wsum;
    const bonus = [];
    if (im && im.pick === x.id) { total += INTAKE_BONUS; bonus.push({ kind: 'intake', add: INTAKE_BONUS, why: `intake ${Object.entries(im.if).map(([k, v]) => `${k}=${v}`).join(', ')}: ${clip(im.reason_ja, 80)}` }); }
    if (t.ai_pick === x.id) { total += DEFAULT_BONUS; bonus.push({ kind: 'catalog_default', add: DEFAULT_BONUS, why: 'catalog default pick (tie-break)' }); }
    const f = idx.F[x.id];
    return { option: x.id, name: f?.name ?? x.extra?.name ?? x.id, from: x.from, total: r3(total), scores, bonus, links,
      gaps: CRITERIA.filter(c => scores[c].basis === 'gap'), verified: f ? f.verified : false, checked: f?.checked ?? null, url: f?.url ?? x.extra?.url ?? null,
      in_catalog: !!f, avoid_when: f?.avoid_when ? clip(f.avoid_when, 120) : '' };
  });
  const tb = [...(profile.tie_break || []), ...CRITERIA];
  rows.sort((a, b) => b.total - a.total || tb.reduce((d, c) => d || (b.scores[c].score - a.scores[c].score), 0) || a.option.localeCompare(b.option));
  rows.forEach((r, i) => r.rank = i + 1);
  return { topic, profile: profile.id, weights: W, field_size: rows.length, ranked: rows };
}
const LABEL = { cost: ['cost', '費用'], speed: ['speed', '速さ'], breadth: ['breadth', '幅'], lock_in: ['lock-in', '乗り換え'], scale: ['scale', '伸びしろ'], compliance: ['compliance', '認証'], ecosystem: ['fit', '相性'] };
function topContrib(row, W, n = 3) {
  return CRITERIA.filter(c => W[c] > 0 && row.scores[c].basis !== 'gap').sort((a, b) => W[b] * row.scores[b].score - W[a] * row.scores[a].score).slice(0, n);
}
function whyWon(row, ranked, profile) {
  const W = profile.weights; const top = topContrib(row, W);
  const second = ranked[1];
  const en = `Top score under ${profile.id} (${row.total.toFixed(2)}${second ? ` vs ${second.total.toFixed(2)} for ${second.name}` : ''}): ` + top.map(c => `${LABEL[c][0]} ${row.scores[c].score.toFixed(2)}`).join(', ') + (row.bonus.length ? '; ' + row.bonus.map(b => b.kind === 'intake' ? 'matches intake answers' : 'catalog default').join(', ') : '') + '.';
  const ja = `${profile.id} で最高点（${row.total.toFixed(2)}${second ? `、次点 ${second.name} ${second.total.toFixed(2)}` : ''}）：` + top.map(c => `${LABEL[c][1]} ${row.scores[c].score.toFixed(2)}`).join('、') + (row.bonus.some(b => b.kind === 'intake') ? '、始める画面の答えに合う' : '') + '。';
  return { en, ja };
}
function whyRejected(row, pick, profile) {
  const W = profile.weights;
  const worse = CRITERIA.filter(c => W[c] > 0 && pick.scores[c].score - row.scores[c].score > 0.05)
    .sort((a, b) => W[b] * (pick.scores[b].score - row.scores[b].score) - W[a] * (pick.scores[a].score - row.scores[a].score)).slice(0, 2);
  const w = worse.length ? worse.map(c => `${LABEL[c][0]} ${row.scores[c].score.toFixed(2)} vs ${pick.scores[c].score.toFixed(2)}${row.scores[c].basis === 'gap' ? ' (no evidence)' : ''}`).join(', ') : 'lower total';
  return `${row.total.toFixed(2)} vs ${pick.total.toFixed(2)}: weaker on ${w}` + (row.avoid_when ? ` — avoid when: ${clip(row.avoid_when, 80)}` : '');
}

// ---------- decision record ----------
export function decide({ topic, idx, profile, intake = {}, chosen = [], evidence = [], extra_options = [], date }) {
  const t = idx.T[topic]; if (!t) throw new Error(`unknown topic ${topic}`);
  const base = { element: t.element, topic, stage: t.stage, lane: t.lane, kind: t.kind, options: t.options, profile: profile.id, decided_by: 'ai', date: date || new Date().toISOString().slice(0, 10), last_checked: t.last_checked };
  if (t.kind !== 'choose') {
    const items = fieldFor(topic, idx).map(x => { const f = idx.F[x.id]; return { option: x.id, name: f?.name ?? x.id, check: f?.check || f?.what || '', verified: f?.verified ?? false }; });
    return { ...base, status: 'ai_selected', ai_pick: '', pick: '', checked: [], to_check: t.options, considered: items, field_size: items.length,
      reason: 'Checklist adopted as the plan; each item still needs a yes/no answer from the build or the owner.', reason_ja: '確認表を計画として採用。各項目はまだ「はい／いいえ」の確認が要る。',
      rejected: [], linkages: [], source: 'catalog', verified: false, gaps: [], gap_notes: items.filter(i => !i.check).map(i => `${i.option}: no yes/no check text`) };
  }
  const sc = scoreTopic({ topic, idx, profile, intake, chosen, evidence, extra_options });
  const ranked = sc.ranked;
  const gap_notes = [];
  if (ranked.length < 2) gap_notes.push(`only ${ranked.length} option(s) in the field: alternatives missing`);
  const pick = ranked[0];
  const known = pick ? CRITERIA.filter(c => (profile.weights[c] || 0) > 0 && pick.scores[c].basis !== 'gap' && pick.scores[c].basis !== 'neutral').length : 0;
  if (pick && known < 2) gap_notes.push(`${pick.option}: fewer than 2 weighted criteria have evidence`);
  for (const r of ranked) if (r.gaps.length) gap_notes.push(`${r.option}: no evidence for ${r.gaps.join(', ')}`);
  if (pick && !pick.verified) gap_notes.push(`${pick.option}: price/limit source verified:false`);
  const why = pick ? whyWon(pick, ranked, profile) : { en: '', ja: '' };
  const thin = ranked.length < 2 || known < 2;
  return { ...base, status: thin ? 'gap' : 'ai_selected', ...(thin ? { gap_note: gap_notes[0], gap_auto: true } : {}),
    ai_pick: pick?.option ?? '', pick: '', reason: why.en, reason_ja: why.ja,
    considered: ranked.map(r => ({ option: r.option, name: r.name, rank: r.rank, total: r.total, from: r.from, in_catalog: r.in_catalog, verified: r.verified, checked: r.checked, url: r.url,
      scores: Object.fromEntries(CRITERIA.map(c => [c, { score: r3(r.scores[c].score), basis: r.scores[c].basis, evidence: r.scores[c].evidence, ...(r.scores[c].unverified ? { unverified: true } : {}) }])),
      bonus: r.bonus, gaps: r.gaps })),
    field_size: ranked.length,
    rejected: ranked.slice(1).map(r => ({ option: r.option, why: whyRejected(r, pick, profile) })),
    linkages: pick ? pick.links : [],
    source: evidence.length || extra_options.length ? 'catalog+agent' : 'catalog',
    verified: !!pick?.verified, checked: pick?.checked ?? null,
    gaps: pick ? pick.gaps : [], gap_notes };
}

// ---------- any record, any status: the scored field for display ----------
// Keys that are always re-derived from the catalog + the map + the profile, so they are not stored on disk.
export const DERIVED_KEYS = ['considered', 'field_size', 'gaps', 'gap_notes', 'to_check'];
export function compactChoice(c) {
  const o = { ...c };
  for (const k of DERIVED_KEYS) delete o[k];
  for (const k of Object.keys(o)) if (o[k] === undefined) delete o[k];
  return o;
}
export const compactMap = m => ({ ...m, choices: (m.choices || []).map(compactChoice) });
const KEPT = { observed: 'observed in the repository', decided: 'the owner decided it' };
// Score one topic for one record of a map, whatever its status. Never changes status, pick or owner fields:
// the result says which option the record stands on (anchor), the field ranked under `profile`, why the anchor
// stands, a short reason for every other option, linkages of the anchor and the gaps.
export function scoreRecord(c, map, idx, profile, { date } = {}) {
  const t = idx.T[c.topic]; if (!t) throw new Error(`unknown topic ${c.topic}`);
  const chosen = partsOf(map).filter(p => p.topic !== c.topic);
  const rec = decide({ topic: c.topic, idx, profile, intake: map.profile || {}, chosen, evidence: c.overrides || [], extra_options: c.extra_options || [], date });
  if (t.kind !== 'choose') return { ...rec, anchor: '', scored_pick: '', scored_under: profile.id };
  const winner = rec.considered[0];
  const anchorId = (c.status === 'observed' || c.status === 'decided') ? (c.pick || '') : (c.ai_pick || rec.ai_pick);
  const anchor = rec.considered.find(r => r.option === anchorId) || null;
  const full = scoreTopic({ topic: c.topic, idx, profile, intake: map.profile || {}, chosen, evidence: c.overrides || [], extra_options: c.extra_options || [] }).ranked;
  const row = id => full.find(r => r.option === id);
  const kept = KEPT[c.status];
  let reason = rec.reason, reason_ja = rec.reason_ja;
  if (kept && !anchor) { reason = `Kept as ${kept}${c.observed_as ? `: ${c.observed_as}` : ''} — not a catalog option. Scored winner under ${profile.id}: ${winner?.name ?? '—'} (${winner?.total.toFixed(2)}).`; reason_ja = `${c.status === 'observed' ? 'リポジトリで確認した事実' : 'オーナーの決定'}として残す（カタログ外）。${profile.id} での最高点は ${winner?.name ?? '—'}（${winner?.total.toFixed(2)}）。`; }
  else if (kept && anchor && anchor.option !== winner.option) { reason = `Kept because it is ${kept}. Under ${profile.id} it scores ${anchor.total.toFixed(2)}; ${winner.name} scores higher (${winner.total.toFixed(2)}) — worth a review.`; reason_ja = `${c.status === 'observed' ? 'リポジトリで確認した事実' : 'オーナーの決定'}なので残す。${profile.id} では ${anchor.total.toFixed(2)}、${winner.name} が ${winner.total.toFixed(2)} で上（見直し候補）。`; }
  else if (kept && anchor) { reason = `${kept[0].toUpperCase() + kept.slice(1)}, and also the top score under ${profile.id}. ` + rec.reason; reason_ja = `${c.status === 'observed' ? 'リポジトリで確認した事実' : 'オーナーの決定'}で、${profile.id} でも最高点。` + rec.reason_ja; }
  else if (c.status === 'deferred') { reason = `Deferred${c.reason ? ` (${c.reason})` : ''}. If it is picked later, the top score under ${profile.id} is ${winner?.name ?? '—'} (${winner?.total.toFixed(2)}).`; reason_ja = `見送り${c.reason ? `（${c.reason}）` : ''}。あとで選ぶなら ${profile.id} での最高点は ${winner?.name ?? '—'}（${winner?.total.toFixed(2)}）。`; }
  const A = anchor ? row(anchor.option) : null;
  const rejected = rec.considered.filter(r => anchor ? r.option !== anchor.option : kept ? true : r.option !== winner?.option).map(r => {
    const R = row(r.option);
    if (!A && kept) return { option: r.option, why: `catalog alternative (${r.total.toFixed(2)} under ${profile.id}); the repo uses ${c.observed_as || 'something else'}` };
    const base = A || row(winner.option);
    if (Math.abs(R.total - base.total) < 0.005) return { option: r.option, why: `ties at ${base.total.toFixed(2)} under ${profile.id}; not taken because it is ${kept || 'not the recorded pick'}` };
    if (R.total > base.total) return { option: r.option, why: `scores higher (${R.total.toFixed(2)} vs ${base.total.toFixed(2)}) under ${profile.id}; not taken because it is ${kept || 'not the recorded pick'}` };
    return { option: r.option, why: whyRejected(R, base, profile) };
  });
  const links = A ? A.links : (kept ? [] : row(winner.option)?.links || []);
  const drift = kept && anchorId && winner && winner.option !== anchorId ? { profile: profile.id, would_pick: winner.option, note: 'kept: owner decision or observed fact; review' } : null;
  const g = (anchor || winner)?.gaps || [];
  const f = idx.F[anchorId] || null;
  return { ...rec, anchor: anchor?.option || '', scored_pick: winner?.option || '', scored_under: profile.id, reason, reason_ja, rejected, linkages: links,
    gaps: g, verified: f ? f.verified : rec.verified, checked: f ? f.checked : rec.checked, profile_drift: drift };
}
// One record with its full field attached, for display or an API answer. Stored fields win where they mean
// something the score cannot know (status, pick, owner fields, an agent's own reason and rejected list for ai_selected).
export function expandChoice(map, topic, idx, profile, opts = {}) {
  const c = (map.choices || []).find(x => x.topic === topic); if (!c) return null;
  const s = scoreRecord(c, map, idx, profile, opts);
  const own = c.status === 'ai_selected' || (c.status === 'gap' && !c.gap_note);
  const out = { ...c, considered: s.considered, field_size: s.field_size, gaps: s.gaps, gap_notes: s.gap_notes, scored_pick: s.scored_pick, scored_under: s.scored_under,
    reason: own && c.reason ? c.reason : s.reason, reason_ja: own && c.reason_ja ? c.reason_ja : s.reason_ja,
    rejected: own && (c.rejected || []).length ? c.rejected : s.rejected, linkages: (c.linkages || []).length ? c.linkages : s.linkages,
    verified: c.verified ?? s.verified, checked: c.checked && !Array.isArray(c.checked) ? c.checked : s.checked };
  if (c.kind === 'checklist' || idx.T[topic].kind === 'checklist') { out.to_check = idx.T[topic].options; out.checked = Array.isArray(c.checked) ? c.checked : []; }
  if (s.profile_drift && !c.profile_drift) out.profile_drift = s.profile_drift;
  if (c.status === 'ai_selected' && c.ai_pick && s.scored_pick && c.ai_pick !== s.scored_pick) out.rescore_note = `with every other part of the map in place, ${s.scored_pick} now scores highest; re-run decide to update`;
  if (!out.profile) out.profile = profile.id;
  return out;
}
export const expandMap = (map, idx, profile, opts) => ({ ...map, choices: (map.choices || []).map(c => expandChoice(map, c.topic, idx, profile, opts)) });

// ---------- project maps ----------
const depthOf = (topic, idx, seen = new Set()) => { const t = idx.T[topic]; if (!t || seen.has(topic)) return 0; seen.add(topic); return t.depends_on.length ? 1 + Math.max(...t.depends_on.map(d => depthOf(d, idx, seen))) : 0; };
export const chosenOf = c => c.pick || (c.status === 'ai_selected' ? c.ai_pick : '') || '';
export function partsOf(map) {
  return (map.choices || []).filter(c => HAS_PART.has(c.status) && chosenOf(c)).map(c => ({ topic: c.topic, option: chosenOf(c), status: c.status }));
}
// Every tactic appears once, in tactics order; unknown fields kept; missing ones open.
export function normalizeMap(map, idx) {
  const by = Object.fromEntries((map.choices || []).map(c => [c.topic, c]));
  const choices = idx.tactics.map(t => {
    const c = by[t.topic] || {};
    return { element: t.element, topic: t.topic, stage: t.stage, lane: t.lane, kind: t.kind, ...c, status: STATUSES.includes(c.status) ? c.status : 'open',
      options: t.options, ai_pick: c.ai_pick ?? '', pick: c.pick ?? '', reason: c.reason ?? '', rejected: c.rejected ?? [], decided_by: c.decided_by ?? '', last_checked: c.last_checked ?? t.last_checked };
  });
  return { ...map, domain: 'project_map', choices };
}
// Re-score every choose topic under `profile`. ai_selected / open / gap records move with the profile;
// observed and decided records keep their pick and get profile_drift when the new winner differs.
export function rescoreMap(map, idx, profile, { date, only } = {}) {
  const m = normalizeMap(map, idx);
  const fixed = m.choices.filter(c => (c.status === 'observed' || c.status === 'decided') && c.pick).map(c => ({ topic: c.topic, option: c.pick }));
  const order = m.choices.map((c, i) => [c, i]).sort((a, b) => depthOf(a[0].topic, idx) - depthOf(b[0].topic, idx) || a[1] - b[1]).map(x => x[0]);
  const chosen = [...fixed]; const changes = [];
  for (const c of order) {
    if (only && !only.includes(c.topic)) { const o = chosenOf(c); if (o && !fixed.some(f => f.topic === c.topic) && HAS_PART.has(c.status)) chosen.push({ topic: c.topic, option: o }); continue; }
    if (c.status === 'observed' || c.status === 'decided' || c.status === 'deferred') continue;   // verdicts attached below
    const rec = decide({ topic: c.topic, idx, profile, intake: m.profile || {}, chosen, evidence: c.overrides || [], extra_options: c.extra_options || [], date });
    const before = c.ai_pick;
    // an agent's own evidence and gap notes on this record are kept; the scoring is replaced
    // a gap someone flagged by hand (gap_note: "not found in the repo") stays a gap; the scored pick is kept as a suggestion
    const flagged = c.status === 'gap' && c.gap_note && !c.gap_auto;
    const keep = flagged ? { gap_note: c.gap_note } : {};
    for (const k of ['gap_note', 'gap_auto']) delete c[k];
    Object.assign(c, compactChoice(rec), keep, { evidence: c.evidence }, flagged ? { status: 'gap' } : {});
    if (c.evidence === undefined) delete c.evidence;
    if (c.kind === 'choose' && before !== c.ai_pick) changes.push({ topic: c.topic, from: before || null, to: c.ai_pick });
    if (c.kind === 'choose' && c.ai_pick && c.status === 'ai_selected') chosen.push({ topic: c.topic, option: c.ai_pick });
  }
  // observed / decided / deferred keep status and pick; once every AI pick is in place, store the scored field's
  // verdict with them (winner, rejected reasons, drift). considered[] itself is derived when the map is read.
  for (const c of m.choices) if (['observed', 'decided', 'deferred'].includes(c.status) && c.kind === 'choose') {
    const s = scoreRecord(c, m, idx, profile, { date });
    Object.assign(c, { scored_pick: s.scored_pick, scored_under: profile.id, rejected: s.rejected });
    if (s.profile_drift) c.profile_drift = s.profile_drift; else delete c.profile_drift;
  }
  m.preference_profile = profile.id;
  return { map: compactMap(m), changes };
}
export function progressOf(map, idx) {
  const by = Object.fromEntries((map.choices || []).map(c => [c.topic, c]));
  const count = ts => Object.fromEntries(STATUSES.map(s => [s, ts.filter(t => (by[t.topic]?.status || 'open') === s).length]));
  return {
    stages: idx.stages.map(s => { const ts = idx.tactics.filter(t => t.stage === s.id); return { stage: s.id, total: ts.length, ...count(ts) }; }),
    categories: idx.categories.map(c => { const ts = c.topics.map(x => idx.T[x]).filter(Boolean); return { id: c.id, total: ts.length, ...count(ts), gap_note: !!c.gap_note_en }; }),
  };
}

// ---------- architecture: frontend ↔ backend ↔ data ↔ auth ↔ payments ↔ third-party ----------
export const ARCH_ROLES = {
  frontend: ['frontend', 'app_distribution'], backend: ['backend', 'hosting'], data: ['database', 'storage', 'search', 'realtime', 'cms'],
  auth: ['auth'], payments: ['payments'], third_party: ['email', 'ai', 'analytics', 'monitoring', 'uptime', 'protection', 'support', 'ci'],
};
// role names used by maps written before the six-column layout
export const ROLE_ALIAS = { client: 'frontend', server: 'backend', identity_money: 'auth' };
const ROLE_OF = Object.fromEntries(Object.entries(ARCH_ROLES).flatMap(([r, ts]) => ts.map(t => [t, r])));
const PATTERN_EDGES = [
  ['frontend', 'backend', 'API calls'], ['backend', 'database', 'queries'], ['frontend', 'auth', 'sign-in'], ['auth', 'database', 'user records'],
  ['backend', 'payments', 'checkout + webhooks'], ['backend', 'email', 'transactional sends'], ['backend', 'ai', 'model calls'], ['frontend', 'analytics', 'events'],
  ['backend', 'monitoring', 'errors'], ['frontend', 'monitoring', 'errors'], ['backend', 'storage', 'files'], ['backend', 'search', 'index + query'], ['frontend', 'realtime', 'live updates'],
  ['frontend', 'cms', 'content'], ['hosting', 'frontend', 'serves'], ['hosting', 'backend', 'runs'], ['ci', 'hosting', 'deploys'], ['protection', 'frontend', 'bot checks'], ['uptime', 'hosting', 'pings'],
];
const STATE = { observed: 'implemented', decided: 'proposed', ai_selected: 'proposed', open: 'open', gap: 'gap', deferred: 'deferred' };
export function deriveArchitecture(map, idx) {
  const by = Object.fromEntries((map.choices || []).map(c => [c.topic, c]));
  const nodes = [];
  for (const [topic, role] of Object.entries(ROLE_OF)) {
    const c = by[topic]; if (!c || !idx.T[topic]) continue;
    const opt = chosenOf(c) || c.ai_pick || '';
    nodes.push({ id: topic, topic, role, option: opt, name: c.observed_as || (opt ? (idx.F[opt]?.name ?? opt) : ''), status: c.status, state: STATE[c.status] || 'open',
      evidence: c.evidence || [], basis: c.status === 'observed' ? 'evidence' : 'map' });
  }
  for (const x of map.architecture?.components || []) {
    const n = { id: x.id, topic: x.topic ?? null, role: ROLE_ALIAS[x.role] || x.role || 'third_party', option: x.option ?? '', name: x.name ?? x.id, status: x.state === 'implemented' ? 'observed' : 'ai_selected',
      state: x.state === 'implemented' && (x.evidence || []).length ? 'implemented' : 'proposed', evidence: x.evidence || [], basis: (x.evidence || []).length ? 'evidence' : 'map' };
    const i = nodes.findIndex(y => y.id === n.id); i >= 0 ? nodes[i] = { ...nodes[i], ...n } : nodes.push(n);
  }
  const has = id => nodes.some(n => n.id === id && n.state !== 'deferred');
  const st = id => nodes.find(n => n.id === id)?.state;
  const explicit = map.architecture?.links || [];
  const edges = [];
  for (const [a, b, label] of PATTERN_EDGES) {
    if (!has(a) || !has(b)) continue;
    const ex = explicit.find(l => (l.from === a && l.to === b) || (l.from === b && l.to === a));
    if (ex) continue;
    const both = st(a) === 'implemented' && st(b) === 'implemented';
    const fa = idx.F[nodes.find(n => n.id === a).option], fb = idx.F[nodes.find(n => n.id === b).option];
    const sv = fa && fb && vendorOf(fa) && vendorOf(fa) === vendorOf(fb) ? vendorOf(fa) : null;
    edges.push({ from: a, to: b, label, basis: 'pattern', state: 'proposed', note: (both ? 'both ends implemented; link not evidenced yet' : '') + (sv ? `${both ? '; ' : ''}same vendor (${sv})` : '') });
  }
  for (const l of explicit) {
    if (!has(l.from) || !has(l.to)) continue;
    const ok = l.state === 'implemented' && (l.evidence || []).length;
    edges.push({ from: l.from, to: l.to, label: l.label || '', basis: (l.evidence || []).length ? 'evidence' : 'map', state: ok ? 'implemented' : 'proposed', evidence: l.evidence || [], note: l.note || '' });
  }
  return { roles: Object.keys(ARCH_ROLES), nodes, edges };
}

// Validate one record an agent or owner wants to write. Returns error strings.
export function validateRecord(r, idx) {
  const errs = []; const t = idx.T[r.topic];
  if (!t) return [`unknown topic ${r.topic}`];
  if (r.status && !STATUSES.includes(r.status)) errs.push(`${r.topic}: status must be one of ${STATUSES.join(', ')}`);
  const inField = o => fieldFor(r.topic, idx).some(x => x.id === o) || t.options.includes(o);
  if (r.pick && t.kind === 'choose' && !inField(r.pick) && r.status !== 'observed') errs.push(`${r.topic}: pick ${r.pick} is not in the field (${fieldFor(r.topic, idx).map(x => x.id).join(', ')})`);
  if (r.status === 'observed' && !(Array.isArray(r.evidence) && r.evidence.length)) errs.push(`${r.topic}: observed needs evidence [{kind, path|url, note}]`);
  if (r.status === 'decided') {
    if (r.owner_confirmed !== true) errs.push(`${r.topic}: decided needs owner_confirmed: true (a person said yes). Use ai_selected for the agent's own pick.`);
    if (!r.decided_by || r.decided_by === 'ai') errs.push(`${r.topic}: decided needs decided_by naming the owner role (e.g. owner), not ai`);
    if (t.kind === 'choose' && !r.pick) errs.push(`${r.topic}: decided needs pick`);
  }
  if (r.status === 'gap' && !r.gap_note) errs.push(`${r.topic}: gap needs gap_note (what evidence is missing)`);
  if (r.status === 'deferred' && !r.reason && !r.gap_note) errs.push(`${r.topic}: deferred needs a reason`);
  return errs;
}

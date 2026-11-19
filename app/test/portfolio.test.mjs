// Part B: the five shared project maps (rakugaki-jam, moime, local-pro-kit, lpk-frontdesk, brand-journey-map).
// Every tactic present, the 12-category index covered, gaps flagged, nothing decided, no unverified price marked verified.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import yaml from 'js-yaml';
import * as core from '../../shared/decide-core.mjs';
const D = JSON.parse(fs.readFileSync(new URL('../public/data.json', import.meta.url), 'utf8'));
const idx = core.makeIndex({ tactics: D.tactics, comparisons: D.comparisons, facts: D.facts, categories: D.categories12, lanes: D.lanes, stages: D.stages });
const SLUGS = ['rakugaki-jam', 'moime', 'local-pro-kit', 'lpk-frontdesk', 'brand-journey-map'];
const REPOS = { 'rakugaki-jam': 'rakugaki-jam', moime: 'third-moime', 'local-pro-kit': 'growth.creativityiseverywhere.com', 'lpk-frontdesk': 'lpk-frontdesk', 'brand-journey-map': 'brandjourneymap' };
const file = s => new URL(`../../skill/blueprint/project-maps/${s}.yaml`, import.meta.url);
const load = s => yaml.load(fs.readFileSync(file(s), 'utf8'));
const prof = id => D.profiles.find(p => p.id === id);
const PRICE = /(\$|US\$|USD|¥|€|£)\s?\d|\d\s?(円|ドル|USD)|\/\s?(month|mo|year|yr)\b|per (month|year)/i;
const textOf = c => [c.observed_as, c.gap_note, c.reason, c.agent_reason, ...(c.evidence || []).map(e => e.note)].filter(Boolean).join(' \n ');

test('the five maps parse, ship in the app, and hold every tactic once (all 12 categories walkable)', () => {
  for (const s of SLUGS) {
    const m = load(s);
    assert.equal(m.schema, 'blueprint.project-map/v2', s); assert.equal(m.slug, s); assert.equal(m.preference_profile, 'lean-fast-full', s);
    assert.deepEqual(m.review, { link: `#/p/${s}`, url: null, arch: `#/p/${s}/arch` }, s);
    assert.ok(D.projects.some(p => p.slug === s), `${s} in data.json`);
    assert.ok(fs.existsSync(new URL(`../public/projects/${s}.json`, import.meta.url)), `${s}.json shipped`);
    const topics = m.choices.map(c => c.topic);
    assert.equal(new Set(topics).size, topics.length, `${s}: duplicate topic`);
    assert.deepEqual([...topics].sort(), D.tactics.map(t => t.topic).sort(), `${s}: every tactic on disk`);
    for (const c of m.choices) assert.notEqual(c.status, 'open', `${s}/${c.topic}: every node is filled (observed / ai_selected / gap)`);
    const pr = core.progressOf(core.normalizeMap(m, idx), idx);
    assert.deepEqual(pr.categories.map(c => c.id), ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'xb']);
    for (const c of pr.categories) { const n = core.STATUSES.reduce((a, k) => a + c[k], 0); assert.equal(n, c.total, `${s} category ${c.id}`); }
    for (const t of ['brand_basics', 'visual_system', 'pricing_model', 'payments', 'ethics', 'legal_rules']) assert.ok(m.choices.find(c => c.topic === t), `${s}: ${t}`);
  }
});

test('statuses follow the house rules: observed has evidence, gap has a note, nothing is decided', () => {
  for (const s of SLUGS) {
    const m = load(s);
    for (const c of m.choices) {
      assert.ok(['observed', 'ai_selected', 'gap'].includes(c.status), `${s}/${c.topic}: ${c.status} (Part B uses observed / ai_selected / gap only)`);
      assert.notEqual(c.owner_confirmed, true, `${s}/${c.topic}: no owner confirmation exists`);
      if (c.status === 'observed') { assert.ok(c.evidence?.length, `${s}/${c.topic}: evidence`); assert.equal(c.decided_by, '', `${s}/${c.topic}`); }
      if (c.status === 'gap') assert.ok(c.gap_note && c.gap_note.length > 10, `${s}/${c.topic}: gap_note`);
      if (c.status === 'ai_selected') { assert.equal(c.decided_by, 'ai', `${s}/${c.topic}`); assert.equal(c.pick, '', `${s}/${c.topic}: an AI pick never fills pick`); }
      for (const e of c.evidence || []) if (e.path) assert.ok(e.path.split('/')[0] === REPOS[s], `${s}/${c.topic}: evidence path names the product repo only (${e.path})`);
      for (const k of core.DERIVED_KEYS) assert.equal(c[k], undefined, `${s}/${c.topic}: ${k} stored`);
    }
  }
});

test('the gaps named in the evidence are flagged on the map', () => {
  const flagged = (s, t) => { const c = load(s).choices.find(x => x.topic === t); return c.status === 'gap' || !!c.gap_note; };
  const expect = {
    'rakugaki-jam': ['hosting', 'backend', 'auth', 'payments', 'email', 'analytics', 'ai', 'ci'],
    moime: ['auth', 'payments', 'pricing_model', 'ai'],
    'local-pro-kit': ['hosting', 'payments', 'email', 'analytics', 'protection'],
    'lpk-frontdesk': ['hosting', 'database', 'payments', 'email', 'analytics', 'ai'],
    'brand-journey-map': ['auth', 'backend', 'realtime', 'editor_ui', 'pricing_model', 'ai', 'email', 'analytics', 'build_vs_buy', 'rules_ledger'],
  };
  for (const [s, ts] of Object.entries(expect)) for (const t of ts) assert.ok(flagged(s, t), `${s}/${t} must be flagged`);
  assert.match(load('brand-journey-map').choices.find(c => c.topic === 'auth').gap_note, /O-11/);
  assert.match(load('brand-journey-map').choices.find(c => c.topic === 'editor_ui').gap_note, /O-01/);
});

test('no unverified price is marked verified; prices only appear where the record says verified:false', () => {
  let seen = 0;
  for (const s of SLUGS) {
    const m = load(s);
    for (const c of m.choices) if (PRICE.test(textOf(c))) { seen++; assert.equal(c.verified, false, `${s}/${c.topic}: a price in the record text must be verified:false`); }
    if (m.production && PRICE.test(m.production.note)) assert.equal(m.production.verified, false);
    assert.notEqual(m.production?.verified, true, `${s}: production status was not re-verified in this pass`);
  }
  assert.ok(seen >= 1, 'the listed moime prices are on the map (as unverified)');
});

test('not-in-production products say so; BJM PO directions are proposals with their source, not decisions', () => {
  assert.equal(load('lpk-frontdesk').production.state, 'not_in_production');
  assert.equal(load('brand-journey-map').production.state, 'not_in_production');
  for (const s of SLUGS) assert.ok(['live', 'not_in_production', 'unknown'].includes(load(s).production?.state), s);
  const b = load('brand-journey-map');
  assert.equal(b.choices.filter(c => c.status === 'observed').length, 0, 'no app code exists, so nothing is observed');
  const po = { database: 'db.neon', storage: 'st.r2', payments: 'pay.stripe-checkout' };
  for (const [t, o] of Object.entries(po)) {
    const c = b.choices.find(x => x.topic === t);
    assert.equal(c.status, 'ai_selected', t); assert.equal(c.ai_pick, o, t); assert.equal(c.source, 'BJM PO canvases 2026-11-18', t); assert.ok(core.isSourced(c), t);
  }
  for (const t of ['frontend', 'hosting', 'i18n']) assert.match(b.choices.find(c => c.topic === t).source, /^PRD §14/, t);
});

test('architecture: implemented only with evidence, proposed otherwise; every map has both sides drawn', () => {
  for (const s of SLUGS) {
    const a = core.deriveArchitecture(core.normalizeMap(load(s), idx), idx);
    assert.deepEqual(a.roles, ['frontend', 'backend', 'data', 'auth', 'payments', 'third_party']);
    for (const n of a.nodes) if (n.state === 'implemented') assert.ok(n.evidence.length, `${s}: node ${n.id}`);
    for (const e of a.edges) if (e.state === 'implemented') assert.ok(e.evidence?.length, `${s}: ${e.from}→${e.to}`);
    assert.ok(a.edges.some(e => e.state === 'proposed'), `${s}: proposed links`);
    if (s === 'brand-journey-map') assert.equal(a.nodes.filter(n => n.state === 'implemented').length, 0, 'BJM: nothing implemented');
    else assert.ok(a.nodes.some(n => n.state === 'implemented'), `${s}: implemented parts`);
  }
});

test('the all-in preview changes AI picks only: observed facts and sourced proposals stay, flagged with drift', () => {
  for (const s of SLUGS) {
    const m = core.normalizeMap(load(s), idx);
    const { map } = core.rescoreMap(m, idx, prof('all-in'), { date: '2026-11-19' });
    for (const c of map.choices) {
      const was = m.choices.find(x => x.topic === c.topic);
      assert.equal(c.status, was.status, `${s}/${c.topic}: status unchanged`);
      if (was.status === 'observed') assert.equal(c.pick, was.pick, `${s}/${c.topic}`);
      if (core.isSourced(was)) { assert.equal(c.ai_pick, was.ai_pick, `${s}/${c.topic}: sourced proposal kept`); if (c.scored_pick !== c.ai_pick) assert.equal(c.profile_drift?.profile, 'all-in'); }
    }
  }
});

test('public copy: no *.vercel.app address and no GitHub owner prefix', () => {
  const files = [...SLUGS.map(s => file(s)), ...SLUGS.map(s => new URL(`../../mcp/portfolio/${s}.yaml`, import.meta.url)), new URL('../../docs/portfolio.md', import.meta.url), new URL('../../docs/portfolio.ja.md', import.meta.url)];
  for (const f of files) { const t = fs.readFileSync(f, 'utf8'); assert.ok(!/vercel\.app/i.test(t), `${f}: vercel.app`); assert.ok(!/github\.com\//i.test(t), `${f}: github.com/ link`); }
});

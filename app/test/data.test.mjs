// Data invariants the app relies on. Runs against public/data.json (npm run data builds it first).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const D = JSON.parse(fs.readFileSync(new URL('../public/data.json', import.meta.url), 'utf8'));
const T = Object.fromEntries(D.tactics.map(t => [t.topic, t]));

test('five lifecycle stages, every tactic in one of them, every stage has choose and checklist', () => {
  assert.deepEqual(D.stages.map(s => s.id), ['idea', 'launch', 'operate', 'scale', 'exit']);
  for (const s of D.stages) { assert.ok(s.what_ja && s.what_en, s.id); const ts = D.tactics.filter(t => t.stage === s.id);
    assert.ok(ts.some(t => t.kind === 'choose') && ts.some(t => t.kind === 'checklist'), `${s.id} needs choose + checklist`); }
  for (const t of D.tactics) assert.ok(D.stages.some(s => s.id === t.stage), `${t.topic}: stage ${t.stage}`);
});

test('dependencies resolve, form no cycle, and the chosen path can connect', () => {
  const depth = (t, seen = []) => { assert.ok(!seen.includes(t.topic), 'cycle ' + [...seen, t.topic].join(' > '));
    return t.depends_on.length ? 1 + Math.max(...t.depends_on.map(d => { assert.ok(T[d], `${t.topic} depends_on ${d}`); return depth(T[d], [...seen, t.topic]); })) : 0; };
  for (const t of D.tactics) depth(t);
  const links = D.tactics.reduce((n, t) => n + t.depends_on.length, 0);
  assert.ok(links >= D.tactics.length, `only ${links} links for ${D.tactics.length} decisions`);
  // every stage after idea is reachable from an idea-stage root through real dependencies
  for (const t of D.tactics.filter(t => t.stage !== 'idea')) assert.ok(t.depends_on.length, `${t.topic} (${t.stage}) has no dependency, so it can never join the orange path`);
});

test('every tactic has JA and EN labels, options that exist, and a pick among its options', () => {
  for (const t of D.tactics) {
    for (const k of ['label_ja', 'question_ja', 'label_en', 'question_en', 'lane', 'kind']) assert.ok(t[k], `${t.topic}: ${k}`);
    assert.ok(D.lanes.some(l => l.id === t.lane), `${t.topic}: lane ${t.lane}`);
    for (const o of t.options) assert.ok(D.items[o], `${t.topic}: option ${o} not in catalog`);
    if (t.kind === 'choose') { assert.ok(t.options.includes(t.ai_pick), `${t.topic}: ai_pick`); for (const w of t.pick_when || []) assert.ok(t.options.includes(w.pick), `${t.topic}: pick_when`); }
  }
  for (const l of D.lanes) assert.ok(l.en && l.ja, l.id);
});

test('tech choices have a stack comparison with free tiers, single-vs-combined, switch points and rejected reasons', () => {
  for (const t of D.tactics.filter(t => t.kind === 'choose' && t.lane === 'tech')) {
    const c = D.comparisons[t.topic]; assert.ok(c, `${t.topic}: no comparison`);
    assert.ok(c.services.length >= 2 && c.services.every(s => s.free_tier && s.paid_entry), `${t.topic}: services`);
    assert.ok(c.combine?.single && c.combine?.combined && c.combine?.risks && c.switch_points?.length, `${t.topic}: combine/switch`);
    assert.ok(c.recommendation?.pick && c.recommendation.reason && c.recommendation.rejected?.length, `${t.topic}: recommendation`);
    for (const s of c.services) assert.ok(s.verified === false || (s.url && s.checked), `${t.topic}: ${s.id} verified needs url + checked`);
  }
});

test('every priced catalog item carries a source: a checked date, and a URL whenever it is marked verified', () => {
  const priced = Object.values(D.items).filter(it => it.priced);
  assert.ok(priced.length > 100, 'priced items found');
  for (const it of priced) {
    assert.ok(it.checked, `${it.id}: priced but no checked date, so stale_items cannot see it`);
    if (it.verified === true) assert.ok(it.url, `${it.id}: verified without a source URL`);
  }
  // rules and lessons are not vendor facts: no badge, and no "verified" claim
  for (const it of Object.values(D.items).filter(it => !it.priced && !it.url)) assert.notEqual(it.verified, true, `${it.id}: verified:true on a rule`);
});

test('glossary terms are unique and every catalog item has an id, name and domain', () => {
  const seen = new Set(); for (const g of D.glossary) { assert.ok(!seen.has(g.term), 'dup ' + g.term); seen.add(g.term); assert.ok(g.plain && g.one_line, g.term); }
  for (const it of Object.values(D.items)) assert.ok(it.id && it.name && it.domain, it.id);
});

test('categories come from the registry: every catalog area has a category (or is cross-cutting), and ethics and revenue-model exist', () => {
  assert.ok(Array.isArray(D.categories) && D.categories.length, 'categories from elements/categories.yaml');
  const ids = new Set(D.categories.map(c => c.id));
  for (const id of ['ethics', 'revenue-model']) assert.ok(ids.has(id), id);
  for (const c of Object.values(D.catalog)) assert.ok(ids.has(c.category) || D.cross_cutting.includes(c.domain), `${c.domain}: no category`);
  for (const c of D.categories) assert.ok(c.no && c.name && c.name_ja, c.id);
});

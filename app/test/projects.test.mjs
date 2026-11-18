// Project maps in the app: 12-category index, preference profiles, committed maps, client-side re-scoring.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as core from '../../shared/decide-core.mjs';
import { M } from '../src/messages.js';
const D = JSON.parse(fs.readFileSync(new URL('../public/data.json', import.meta.url), 'utf8'));
const idx = core.makeIndex({ tactics: D.tactics, comparisons: D.comparisons, facts: D.facts, categories: D.categories12, lanes: D.lanes, stages: D.stages });

test('12-category index: 01–12 plus the cross-border pack, every decision has exactly one home', () => {
  assert.deepEqual(D.categories12.map(c => c.id), ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', 'xb']);
  const homes = D.categories12.flatMap(c => c.topics);
  assert.equal(new Set(homes).size, homes.length, 'a topic lives in two categories');
  assert.deepEqual([...homes].sort(), D.tactics.map(t => t.topic).sort());
  for (const c of D.categories12) { assert.ok(c.label_en && c.label_ja, c.id); for (const t of c.also || []) assert.ok(idx.T[t], `${c.id} also ${t}`);
    if (!c.topics.length) assert.ok(c.gap_note_en && c.gap_note_ja, `${c.id}: empty category must say what is missing`); }
  // brand, visuals, interactions, animation, monetization and ethics are first-class decisions
  for (const t of ['brand_basics', 'visual_system', 'interactions', 'motion', 'pricing_model', 'ethics']) assert.ok(idx.T[t], t);
  assert.ok(D.categories12.find(c => c.id === '02').topics.includes('motion'));
});

test('preference profiles are valid and the default is lean-fast-full', () => {
  assert.ok(D.profiles.length >= 2);
  for (const p of D.profiles) assert.deepEqual(core.validateProfile(p), [], p.id);
  assert.equal(D.profiles.find(p => p.default)?.id, 'lean-fast-full');
  assert.ok(D.profiles.some(p => p.id === 'all-in'));
  assert.deepEqual(D.criteria.map(c => c.id).sort(), [...core.CRITERIA].sort());
});

test('committed project maps ship as /projects/<slug>.json and keep the status rules', () => {
  assert.ok(D.projects.length >= 1);
  for (const p of D.projects) {
    const m = JSON.parse(fs.readFileSync(new URL(`../public/projects/${p.slug}.json`, import.meta.url), 'utf8'));
    const n = core.normalizeMap(m, idx);
    assert.equal(n.choices.length, D.tactics.length, p.slug);
    for (const c of m.choices) {
      assert.ok(core.STATUSES.includes(c.status), `${p.slug}/${c.topic}: ${c.status}`);
      if (c.status === 'decided') assert.equal(c.owner_confirmed, true, `${p.slug}/${c.topic}`);
      if (c.status === 'observed') assert.ok(c.evidence?.length, `${p.slug}/${c.topic}: evidence`);
      if (c.status === 'ai_selected' && c.kind === 'choose') { assert.ok(c.considered.length >= 2 && c.ai_pick && !c.pick, `${p.slug}/${c.topic}`); assert.equal(c.profile, m.preference_profile); }
    }
    const a = core.deriveArchitecture(n, idx);
    for (const e of a.edges) if (e.state === 'implemented') assert.ok(e.evidence?.length, `${p.slug}: ${e.from}→${e.to} implemented without evidence`);
  }
});

test('switching the profile in the browser re-scores AI picks and keeps owner decisions and observed facts', () => {
  const m = JSON.parse(fs.readFileSync(new URL('../public/projects/blueprint.json', import.meta.url), 'utf8'));
  m.choices.find(c => c.topic === 'cms').status = 'decided'; Object.assign(m.choices.find(c => c.topic === 'cms'), { pick: 'cms.sheets', owner_confirmed: true, decided_by: 'owner' });
  const allIn = D.profiles.find(p => p.id === 'all-in');
  const { map, changes } = core.rescoreMap(m, idx, allIn, { date: '2026-11-18' });
  assert.ok(changes.length > 0, 'some picks move under all-in');
  assert.equal(map.preference_profile, 'all-in');
  assert.equal(map.choices.find(c => c.topic === 'cms').pick, 'cms.sheets');
  assert.equal(map.choices.find(c => c.topic === 'hosting').status, 'observed');
  for (const c of map.choices.filter(c => c.status === 'ai_selected' && c.kind === 'choose')) assert.equal(c.profile, 'all-in', c.topic);
  const back = core.rescoreMap(map, idx, D.profiles.find(p => p.id === 'lean-fast-full'), { date: '2026-11-18' });
  for (const c of back.map.choices.filter(c => c.status === 'ai_selected' && c.kind === 'choose')) assert.equal(c.ai_pick, m.choices.find(x => x.topic === c.topic).ai_pick, `${c.topic}: round trip`);
});

test('every screen string exists in JA and EN', () => {
  assert.deepEqual(Object.keys(M.ja).sort(), Object.keys(M.en).sort());
});

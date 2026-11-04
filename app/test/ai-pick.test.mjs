import { test } from 'node:test';
import assert from 'node:assert/strict';
import { aiPick, buildPrompt, validateAnswer, validateInput } from '../src/ai-pick-core.js';

const options = [
  { id: 'db.supabase', name: 'Supabase', what: 'Postgres', best_for: 'tables', avoid_when: 'offline', cost: '$0: 500MB', verified: true },
  { id: 'db.firestore', name: 'Firestore', what: 'documents', best_for: 'mobile', avoid_when: 'joins', cost: '$0 Spark', verified: false },
];
const body = { topic: 'database', question: 'Where does the data live?', profile: { platform: 'app' }, options };
const fake = (parsed_output, extra = {}) => ({ messages: { parse: async req => { fake.last = req; return { parsed_output, model: 'test-model', stop_reason: 'end_turn', ...extra }; } } });

test('validates input shape', () => {
  assert.deepEqual(validateInput(body), []);
  assert.ok(validateInput({ ...body, topic: '../x' }).includes('topic'));
  assert.ok(validateInput({ ...body, options: [options[0]] }).length);
  assert.ok(validateInput({ ...body, profile: { country: 'J P' } }).includes('profile.country'));
});

test('prompt carries the owner answers and unverified flags', () => {
  const p = buildPrompt(body);
  assert.match(p, /platform=app/); assert.match(p, /db\.firestore[\s\S]*no \(unverified\)/); assert.match(p, /db\.supabase[\s\S]*price_verified: yes/);
});

test('answer must name one of the options', async () => {
  const good = await aiPick(body, { client: fake({ pick: 'db.firestore', reason_ja: 'スマホ向け', reason_en: 'mobile', rejected: [{ option: 'db.supabase', why_ja: 'x', why_en: 'y' }, { option: 'db.nope', why_ja: '', why_en: '' }], unverified_prices: true }), model: 'm' });
  assert.equal(good.status, 200); assert.equal(good.body.pick, 'db.firestore'); assert.equal(good.body.model, 'test-model');
  assert.deepEqual(good.body.rejected.map(r => r.option), ['db.supabase']); assert.equal(good.body.unverified_prices, true);
  assert.equal(fake.last.model, 'm'); assert.equal(fake.last.output_config.format.type, 'json_schema');
  const bad = await aiPick(body, { client: fake({ pick: 'db.other', reason_ja: '', reason_en: '', rejected: [], unverified_prices: false }), model: 'm' });
  assert.equal(bad.status, 502);
  assert.equal(validateAnswer(null, options), null);
  const refused = await aiPick(body, { client: fake(null, { stop_reason: 'refusal' }), model: 'm' });
  assert.equal(refused.status, 502);
  const invalid = await aiPick({ ...body, options: [] }, { client: fake({}), model: 'm' });
  assert.equal(invalid.status, 400);
});

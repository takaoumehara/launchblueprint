// AI pick: prompt building and answer validation, shared by the serverless function (api/ai-pick.js)
// and its tests. No network and no secrets here.
export const AI_PICK_SCHEMA = {
  type: 'object',
  properties: {
    pick: { type: 'string', description: 'id of exactly one of the given options' },
    reason_ja: { type: 'string', description: '日本語で 2 文以内。専門用語には短い言い換えを添える' },
    reason_en: { type: 'string', description: 'at most two sentences in English' },
    rejected: { type: 'array', items: { type: 'object', properties: { option: { type: 'string' }, why_ja: { type: 'string' }, why_en: { type: 'string' } }, required: ['option', 'why_ja', 'why_en'], additionalProperties: false } },
    unverified_prices: { type: 'boolean', description: 'true if any option it relied on has verified:false' },
  },
  required: ['pick', 'reason_ja', 'reason_en', 'rejected', 'unverified_prices'],
  additionalProperties: false,
};

export const SYSTEM = `You recommend one option for a product decision in the Blueprint method (CREATIVITY IS EVERYWHERE, LLC).
Rules: pick exactly one option id from the list; prefer free tiers that allow commercial use; the owner's answers (audience, platform, money, country) decide; never invent prices — if an option's price is marked unverified, say so; give one reason the owner can act on and a one-line reason for each rejected option; no product or personal names other than the option names given; the owner decides, you only suggest.`;

export function validateInput(body) {
  const errs = [];
  if (!body || typeof body !== 'object') return ['body must be an object'];
  if (typeof body.topic !== 'string' || !/^[a-z0-9_]{1,64}$/.test(body.topic)) errs.push('topic');
  if (!Array.isArray(body.options) || body.options.length < 2 || body.options.length > 12) errs.push('options (2-12)');
  else for (const o of body.options) if (!o || typeof o.id !== 'string' || o.id.length > 64 || typeof o.name !== 'string') errs.push('option shape');
  const p = body.profile || {};
  for (const k of ['audience', 'platform', 'money', 'country']) if (p[k] != null && !/^[a-z]{0,16}$/.test(String(p[k]))) errs.push('profile.' + k);
  if (typeof body.question !== 'string' || body.question.length > 400) errs.push('question');
  return errs;
}

export function buildPrompt(body) {
  const clip = (s, n = 300) => String(s ?? '').slice(0, n);
  const lines = body.options.map(o => `- id: ${o.id}\n  name: ${clip(o.name, 80)}\n  what: ${clip(o.what)}\n  best_for: ${clip(o.best_for)}\n  avoid_when: ${clip(o.avoid_when)}\n  cost: ${clip(o.cost, 200)}\n  price_verified: ${o.verified === true ? 'yes' : 'no (unverified)'}`);
  const p = body.profile || {};
  return `Decision: ${body.topic} — ${clip(body.question)}\nOwner's answers: audience=${p.audience || '?'} platform=${p.platform || '?'} money=${p.money || '?'} country=${p.country || '?'}\nOptions:\n${lines.join('\n')}\nAnswer with the JSON object only.`;
}

export function validateAnswer(out, options) {
  if (!out || typeof out !== 'object') return null;
  const ids = new Set(options.map(o => o.id));
  if (!ids.has(out.pick)) return null;
  const rejected = (Array.isArray(out.rejected) ? out.rejected : []).filter(r => ids.has(r.option) && r.option !== out.pick)
    .map(r => ({ option: r.option, why_ja: String(r.why_ja || '').slice(0, 300), why_en: String(r.why_en || '').slice(0, 300) }));
  return { pick: out.pick, reason_ja: String(out.reason_ja || '').slice(0, 400), reason_en: String(out.reason_en || '').slice(0, 400), rejected, unverified_prices: !!out.unverified_prices };
}

// Runs one pick through an injected client (the real Anthropic client or a test double).
export async function aiPick(body, { client, model }) {
  const errs = validateInput(body);
  if (errs.length) return { status: 400, body: { error: 'invalid input: ' + errs.join(', ') } };
  const res = await client.messages.parse({
    model, max_tokens: 1500,
    output_config: { effort: 'low', format: { type: 'json_schema', schema: AI_PICK_SCHEMA } },
    system: SYSTEM,
    messages: [{ role: 'user', content: buildPrompt(body) }],
  });
  if (res.stop_reason === 'refusal') return { status: 502, body: { error: 'model declined' } };
  const ans = validateAnswer(res.parsed_output, body.options);
  if (!ans) return { status: 502, body: { error: 'model answer did not name one of the options' } };
  return { status: 200, body: { ...ans, model: res.model || model, source: 'ai' } };
}

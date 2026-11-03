// Vercel serverless function: POST /api/ai-pick. Off unless BP_AI_PICK=on and ANTHROPIC_API_KEY is set
// in the host's environment (never in the repo). The browser never sees the key.
import Anthropic from '@anthropic-ai/sdk';
import { aiPick } from '../src/ai-pick-core.js';

const MODEL = process.env.BP_AI_MODEL || 'claude-opus-5-5';
let client;

export default async function handler(req, res) {
  if (process.env.BP_AI_PICK !== 'on' || !process.env.ANTHROPIC_API_KEY) return res.status(404).json({ error: 'ai pick is off' });
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  client ??= new Anthropic({ timeout: 60_000, maxRetries: 1 });
  try {
    const out = await aiPick(req.body, { client, model: MODEL });
    res.setHeader('cache-control', 'no-store');
    return res.status(out.status).json(out.body);
  } catch (e) {
    const status = e instanceof Anthropic.RateLimitError ? 429 : e instanceof Anthropic.APIError ? 502 : 500;
    return res.status(status).json({ error: status === 429 ? 'rate limited' : 'ai pick failed' });
  }
}

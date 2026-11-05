// Blueprint hub — per-bot API keys (phase 1). Authorization: Bearer <key>; only the SHA-256 hex is stored (D1 api_keys).
// (c) CREATIVITY IS EVERYWHERE, LLC
import type { D1Like } from "./store.ts";

export type Principal = { bot_name: string; role: "bot" | "reviewer" };

export async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

/** The key from `Authorization: Bearer <key>`, or null. Keys are never read from the query string. */
export function bearer(req: Request): string | null {
  const m = /^Bearer\s+([A-Za-z0-9_\-]{20,200})\s*$/.exec(req.headers.get("authorization") ?? "");
  return m ? m[1] : null;
}

// Per-isolate cache of successful lookups (hash → principal) so a session's later calls skip the D1 round trip.
// Only hits are cached; a revoked key stops working within AUTH_TTL_MS.
export const AUTH_TTL_MS = 60_000;
const authCache = new Map<string, { p: Principal; at: number }>();

export async function authenticate(req: Request, db: D1Like): Promise<Principal | null> {
  const key = bearer(req); if (!key) return null;
  const hash = await sha256Hex(key);
  const hit = authCache.get(hash);
  if (hit && Date.now() - hit.at < AUTH_TTL_MS) return hit.p;
  const row = await db.prepare("SELECT bot_name, role FROM api_keys WHERE key_hash = ? AND revoked = 0").bind(hash).first<Principal>();
  if (!row) { authCache.delete(hash); return null; }
  const p: Principal = { bot_name: row.bot_name, role: row.role === "reviewer" ? "reviewer" : "bot" };
  if (authCache.size > 500) authCache.clear();
  authCache.set(hash, { p, at: Date.now() });
  return p;
}

export const unauthorized = () => Response.json(
  { error: "unauthorized", message: "Send Authorization: Bearer <api key>. Keys are issued per bot by the owner." },
  { status: 401, headers: { "WWW-Authenticate": 'Bearer realm="blueprint-hub"' } });

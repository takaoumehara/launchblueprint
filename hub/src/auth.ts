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

export async function authenticate(req: Request, db: D1Like): Promise<Principal | null> {
  const key = bearer(req); if (!key) return null;
  const row = await db.prepare("SELECT bot_name, role FROM api_keys WHERE key_hash = ? AND revoked = 0").bind(await sha256Hex(key)).first<Principal>();
  return row ? { bot_name: row.bot_name, role: row.role === "reviewer" ? "reviewer" : "bot" } : null;
}

export const unauthorized = () => Response.json(
  { error: "unauthorized", message: "Send Authorization: Bearer <api key>. Keys are issued per bot by the owner." },
  { status: 401, headers: { "WWW-Authenticate": 'Bearer realm="blueprint-hub"' } });

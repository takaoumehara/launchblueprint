// Blueprint hub — Cloudflare Worker entry (phase 1: internal bots, API keys only). (c) CREATIVITY IS EVERYWHERE, LLC
// GET /health → {ok:true} (public). /mcp → Streamable HTTP MCP via createMcpHandler (stateless, no Durable Objects),
// only with Authorization: Bearer <per-bot key>; everything else 404.
import { createMcpHandler } from "agents/mcp/server";
import bundle from "./generated/catalog.json" with { type: "json" };
import { makeCatalog, type Bundle } from "./catalog.ts";
import { authenticate, unauthorized } from "./auth.ts";
import { buildServer } from "./tools.ts";
import type { D1Like } from "./store.ts";

export interface Env { DB: D1Like }
type Ctx = { waitUntil(p: Promise<unknown>): void; passThroughOnException(): void };

// Parsed once per isolate: the YAML was parsed at build time (scripts/build-catalog.mjs).
const catalog = makeCatalog(bundle as unknown as Bundle);

export async function handle(req: Request, env: Env, ctx: Ctx): Promise<Response> {
  const url = new URL(req.url);
  if (url.pathname === "/health") return req.method === "GET" || req.method === "HEAD" ? Response.json({ ok: true }) : new Response(null, { status: 405, headers: { Allow: "GET" } });
  if (url.pathname !== "/mcp") return Response.json({ error: "not_found" }, { status: 404 });
  if (url.searchParams.has("key") || url.searchParams.has("token") || url.searchParams.has("api_key")) return Response.json({ error: "bad_request", message: "Credentials are never accepted in the query string." }, { status: 400 });
  // CORS preflight carries no credentials; the handler answers it without running any tool.
  const principal = req.method === "OPTIONS" ? null : await authenticate(req, env.DB);
  if (!principal && req.method !== "OPTIONS") return unauthorized();
  const handler = createMcpHandler(() => buildServer({ catalog, db: env.DB, principal: principal ?? { bot_name: "-", role: "bot" } }),
    { route: "/mcp", authContext: { props: { bot: principal?.bot_name ?? null, role: principal?.role ?? null } } });
  return handler(req, env, ctx as any);
}

export default { fetch: handle };

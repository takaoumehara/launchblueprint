// Test helper: talk JSON-RPC to the Worker's fetch handler in-process (no network), as a 2025-era MCP client would.
import { handle, type Env } from "../src/index.ts";

export const ctx = { waitUntil() {}, passThroughOnException() {} };
let nextId = 1;
export async function rpc(env: Env, method: string, params: object = {}, key?: string, extraHeaders: Record<string, string> = {}) {
  const res = await handle(new Request("http://localhost/mcp", { method: "POST",
    headers: { host: "localhost", "content-type": "application/json", accept: "application/json, text/event-stream", "mcp-protocol-version": "2025-06-18",
      ...(key ? { authorization: `Bearer ${key}` } : {}), ...extraHeaders },
    body: JSON.stringify({ jsonrpc: "2.0", id: nextId++, method, params }) }), env, ctx);
  const body = await res.text();
  const ct = res.headers.get("content-type") ?? "";
  const msg = ct.includes("text/event-stream") ? body.split("\n").filter(l => l.startsWith("data:")).map(l => JSON.parse(l.slice(5))).find(m => "result" in m || "error" in m) : body ? JSON.parse(body) : null;
  return { status: res.status, headers: res.headers, msg };
}
export async function callTool(env: Env, key: string, name: string, args: object = {}) {
  const r = await rpc(env, "tools/call", { name, arguments: args }, key);
  if (r.msg?.error) throw new Error(`${name}: ${JSON.stringify(r.msg.error)}`);
  const res = r.msg.result;
  return { isError: !!res.isError, text: res.content?.[0]?.text as string };
}
export const init = (env: Env, key: string) => rpc(env, "initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "test", version: "0" } }, key);

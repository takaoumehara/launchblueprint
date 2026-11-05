// Parity: every read tool on the hub returns what the stdio server in mcp/ returns for the same arguments
// (same catalog, same normalisation). Skipped when mcp/ is not built (cd ../mcp && npm ci && npm run build).
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { sha256Hex } from "../src/auth.ts";
import { memoryD1 } from "./_d1.ts";
import { callTool } from "./_mcp.ts";

const MCP = path.resolve(import.meta.dirname, "../../mcp");
const SDK = path.join(MCP, "node_modules/@modelcontextprotocol/sdk/dist/esm/client");
const ready = fs.existsSync(path.join(MCP, "dist/index.js")) && fs.existsSync(path.join(SDK, "index.js"));

const CASES: [string, object][] = [
  ["list_domains", {}], ["get_catalog", { domain: "ethics" }], ["get_catalog", { domain: "revenue_model", format: "items" }], ["get_catalog", { domain: "categories", format: "items" }],
  ["get_catalog", { domain: "tactics", format: "items" }], ["get_item", { id: "db.supabase" }], ["get_item", { id: "rules.R-004" }], ["get_item", { id: "lifecycle.macro.operate" }],
  ["get_reference", { name: "categories" }], ["get_template", { name: "project-map.template.yaml" }], ["get_template", { name: "brand-context.md" }], ["get_skill", {}],
  ["list_topics", {}], ["list_topics", { stage: "launch" }], ["get_comparison", { topic: "hosting" }],
  ["draft_project_map", { profile: { audience: "public", platform: "web", money: "paid", country: "jp" }, decided: { hosting: "host.vercel" } }],
  ["search", { query: "consent", limit: 20 }], ["stale_items", { days: 100000 }], ["lifecycle_stages", { stage: "launch", include_items: true }],
  ["ui_ux_checklist", { phase: "design", lifecycle: "launch" }], ["get_item", { id: "no.such-id" }],
];

test("hub read tools match the stdio server", { skip: !ready && "mcp/ not built" }, async () => {
  const { Client } = await import(path.join(SDK, "index.js"));
  const { StdioClientTransport } = await import(path.join(SDK, "stdio.js"));
  const c = new Client({ name: "parity", version: "0" });
  await c.connect(new StdioClientTransport({ command: "node", args: [path.join(MCP, "dist/index.js")], cwd: MCP }));
  const DB = memoryD1(); const KEY = "bph_parity_key_00000000000000000000000";
  DB.raw.prepare("INSERT INTO api_keys (key_hash, bot_name) VALUES (?, ?)").run(await sha256Hex(KEY), "parity");
  try {
    for (const [name, args] of CASES) {
      const local = await c.callTool({ name, arguments: args });
      const hub = await callTool({ DB }, KEY, name, args);
      assert.equal(hub.isError, !!local.isError, `${name} isError`);
      const norm = (t: string) => { try { const o = JSON.parse(t); if (name === "list_domains") delete o.catalog_commit; return o; } catch { return t; } };
      if (name === "get_skill" || name === "get_reference") assert.equal(hub.text, local.content[0].text, name);
      // the hub's tool descriptions differ (review queue), the outputs must not
      else assert.deepEqual(norm(hub.text), norm(local.content[0].text), `${name} ${JSON.stringify(args)}`);
    }
  } finally { await c.close(); }
});

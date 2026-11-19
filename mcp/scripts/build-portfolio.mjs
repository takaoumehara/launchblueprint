#!/usr/bin/env node
// Build (or refresh) the shared project maps listed in mcp/portfolio/*.yaml through the MCP server itself:
// each input is sent to update_project_map (records + architecture + production, then decide_topics: all), the draft
// it writes is copied to skill/blueprint/project-maps/<slug>.yaml, and the review link it returns is printed.
// Usage (from mcp/): npm run build && node scripts/build-portfolio.mjs [slug ...] [--fresh]
//   --fresh   start from an empty map instead of refreshing the committed one (history restarts)
// CREATIVITY IS EVERYWHERE, LLC
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MCP = path.resolve(HERE, "..");
const IN = path.join(MCP, "portfolio");
const MAPS = path.resolve(MCP, "../skill/blueprint/project-maps");
const args = process.argv.slice(2);
const fresh = args.includes("--fresh");
const only = args.filter(a => !a.startsWith("--"));
const inputs = fs.readdirSync(IN).filter(f => f.endsWith(".yaml")).map(f => f.slice(0, -5)).filter(s => !only.length || only.includes(s)).sort();

const drafts = fs.mkdtempSync(path.join(os.tmpdir(), "bp-portfolio-"));
const parked = fs.mkdtempSync(path.join(os.tmpdir(), "bp-portfolio-old-"));
if (fresh) for (const s of inputs) { const f = path.join(MAPS, s + ".yaml"); if (fs.existsSync(f)) fs.renameSync(f, path.join(parked, s + ".yaml")); }

const transport = new StdioClientTransport({ command: "node", args: [path.join(MCP, "dist/index.js")], env: { ...process.env, BLUEPRINT_PROJECTS: drafts } });
const client = new Client({ name: "build-portfolio", version: "0" });
await client.connect(transport);
const call = async (name, a) => { const r = await client.callTool({ name, arguments: a }); if (r.isError) throw new Error(`${name}: ${r.content?.[0]?.text}`); return JSON.parse(r.content[0].text); };

let failed = false;
try {
  for (const slug of inputs) {
    const inp = yaml.load(fs.readFileSync(path.join(IN, slug + ".yaml"), "utf8"));
    if (inp.slug !== slug) throw new Error(`${slug}.yaml: slug field is ${inp.slug}`);
    const res = await call("update_project_map", {
      slug, name: inp.name, goal: inp.goal, intake: inp.intake, preference_profile: inp.preference_profile ?? "lean-fast-full",
      records: inp.records ?? [], decide_topics: ["all"], architecture: inp.architecture, production: inp.production,
      by: "agent (Part B build)", note: inp.note,
    });
    fs.copyFileSync(path.join(drafts, slug + ".yaml"), path.join(MAPS, slug + ".yaml"));
    const preview = await call("rescore_project_map", { slug, profile: "all-in" });
    console.log(`${slug}: ${res.link} · ${res.arch} · ${JSON.stringify(res.counts)} · all-in would change ${preview.changes.length} pick(s), drift on ${preview.drift.length}`);
  }
} catch (e) {
  failed = true; console.error(String(e.message ?? e));
  if (fresh) for (const f of fs.readdirSync(parked)) if (!fs.existsSync(path.join(MAPS, f))) fs.renameSync(path.join(parked, f), path.join(MAPS, f));
} finally { await client.close(); }
process.exit(failed ? 1 : 0);

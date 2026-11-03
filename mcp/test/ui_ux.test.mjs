// Catalog consistency: ui_ux.yaml rules and phase gates are complete, the reference mirrors them,
// the glossary is well-formed, and the ui_ux_checklist tool exposes gates per lifecycle stage.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs"; import path from "node:path";
import yaml from "js-yaml";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const ROOT = path.resolve(import.meta.dirname, "../../skill/blueprint");
const load = f => yaml.load(fs.readFileSync(path.join(ROOT, f), "utf8"));
const LIFECYCLE = ["idea", "launch", "operate", "scale", "exit"];

test("every ui_ux rule has principle / anti_pattern / why / check and a yes-no check", () => {
  const { rules } = load("catalog/ui_ux.yaml");
  const ids = new Set();
  for (const r of rules) {
    for (const k of ["id", "principle", "anti_pattern", "why", "check", "category", "phase", "date"])
      assert.ok(r[k], `${r.id}: missing ${k}`);
    assert.match(r.check.trim(), /\?$/, `${r.id}: check must be a yes/no question`);
    assert.ok(!ids.has(r.id), `duplicate id ${r.id}`); ids.add(r.id);
    for (const p of [].concat(r.phase)) assert.ok(["requirements", "design", "qa"].includes(p), `${r.id}: phase ${p}`);
  }
  for (const r of rules) for (const s of String(r.see_also ?? "").split(",").map(x => x.trim()).filter(Boolean))
    if (!/[/#]/.test(s)) assert.ok(ids.has(s), `${r.id}: see_also points to unknown rule ${s}`);
});

test("phase gates cover every lifecycle stage and point at existing rules", () => {
  const { rules, phase_gate_checks: gates } = load("catalog/ui_ux.yaml");
  const ids = new Set(rules.map(r => r.id));
  for (const g of gates) {
    for (const k of ["id", "lifecycle", "phase", "check", "why"]) assert.ok(g[k], `${g.id}: missing ${k}`);
    assert.ok(LIFECYCLE.includes(g.lifecycle), `${g.id}: lifecycle ${g.lifecycle}`);
    for (const rid of g.rules ?? []) assert.ok(ids.has(rid), `${g.id}: unknown rule ${rid}`);
  }
  for (const l of LIFECYCLE) assert.ok(gates.some(g => g.lifecycle === l), `no gate for lifecycle ${l}`);
});

test("reference/ui-ux.md lists every rule and gate with avoid / why / check", () => {
  const { rules, phase_gate_checks: gates } = load("catalog/ui_ux.yaml");
  const md = fs.readFileSync(path.join(ROOT, "reference/ui-ux.md"), "utf8");
  for (const r of rules) {
    const line = md.split("\n").find(l => l.startsWith(`- **${r.id}**`));
    assert.ok(line, `reference missing rule ${r.id}`);
    for (const part of ["*Avoid:*", "*Why:*", "*Check:*"]) assert.ok(line.includes(part), `${r.id}: reference line lacks ${part}`);
  }
  for (const g of gates) assert.ok(md.includes(`**${g.id}**`), `reference missing gate ${g.id}`);
});

test("glossary terms are unique and plain", () => {
  const { terms } = load("elements/glossary.yaml");
  const seen = new Set();
  for (const t of terms) {
    assert.deepEqual(Object.keys(t).sort(), ["one_line", "plain", "term"], `${t.term}: keys`);
    assert.ok(!seen.has(t.term), `duplicate term ${t.term}`); seen.add(t.term);
    assert.ok(t.plain.length <= 30, `${t.term}: plain too long`);
  }
  for (const must of ["component map", "capsule", "state switcher", "learn-from-rejection", "generative UI within schema",
    "design token", "skeleton", "live region", "safe area", "Core Web Vitals", "pseudo-locale", "WCAG"])
    assert.ok(seen.has(must), `glossary lacks ${must}`);
});

test("ui_ux_checklist returns gates filtered by lifecycle", async () => {
  const transport = new StdioClientTransport({ command: "node", args: ["dist/index.js"] });
  const c = new Client({ name: "ui_ux", version: "0" });
  await c.connect(transport);
  try {
    const call = async (args) => { const r = await c.callTool({ name: "ui_ux_checklist", arguments: args });
      assert.ok(!r.isError, r.content?.[0]?.text); return JSON.parse(r.content[0].text); };
    const all = await call({});
    assert.ok(all.gates.length >= 5 && all.checklist.every(i => i.check && i.category));
    for (const l of LIFECYCLE) {
      const g = await call({ lifecycle: l });
      assert.ok(g.gates.length > 0 && g.gates.every(x => x.lifecycle === l), `lifecycle ${l}`);
    }
    const req = await call({ phase: "requirements" });
    assert.ok(req.checklist.some(i => i.id === "define-every-screen-state"));
  } finally { await c.close(); }
});

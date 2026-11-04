// Catalog consistency: client_collaboration.yaml lessons and phase gates are complete, generic (no proper names),
// mirrored in reference/client-collaboration.md, and readable through the MCP tools.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs"; import path from "node:path";
import yaml from "js-yaml";
import { connect } from "./_client.mjs";

const ROOT = path.resolve(import.meta.dirname, "../../skill/blueprint");
const doc = yaml.load(fs.readFileSync(path.join(ROOT, "catalog/client_collaboration.yaml"), "utf8"));
const md = fs.readFileSync(path.join(ROOT, "reference/client-collaboration.md"), "utf8");
const LIFECYCLE = ["idea", "launch", "operate", "scale", "exit"];

test("every lesson has principle / anti_pattern / one-line why / yes-no check", () => {
  const ids = new Set();
  for (const l of doc.lessons) {
    for (const k of ["id", "stage", "principle", "anti_pattern", "why", "check"]) assert.ok(l[k], `${l.id}: missing ${k}`);
    assert.match(l.id, /^collab\.[a-z0-9-]+$/, `${l.id}: id`);
    assert.ok(LIFECYCLE.includes(l.stage), `${l.id}: stage ${l.stage}`);
    assert.ok(!l.why.includes("\n") && l.why.length <= 140, `${l.id}: why must be one line`);
    assert.match(l.check.trim(), /\?$/, `${l.id}: check must be a yes/no question`);
    assert.ok(!ids.has(l.id), `duplicate id ${l.id}`); ids.add(l.id);
  }
  for (const l of doc.lessons) for (const s of l.see_also ?? []) if (s.startsWith("collab.")) assert.ok(ids.has(s), `${l.id}: see_also ${s}`);
});

test("phase gates cover every lifecycle stage and bundle existing lessons", () => {
  const ids = new Set(doc.lessons.map(l => l.id));
  for (const g of doc.phase_gate_checks) {
    for (const k of ["id", "lifecycle", "phase", "check", "why"]) assert.ok(g[k], `${g.id}: missing ${k}`);
    assert.ok(LIFECYCLE.includes(g.lifecycle), `${g.id}: lifecycle ${g.lifecycle}`);
    assert.match(g.check, /yes\/no$/, `${g.id}: check ends with yes/no`);
    assert.ok(g.rules?.length, `${g.id}: rules`);
    for (const r of g.rules) assert.ok(ids.has(r), `${g.id}: unknown lesson ${r}`);
  }
  for (const l of LIFECYCLE) assert.ok(doc.phase_gate_checks.some(g => g.lifecycle === l), `no gate for lifecycle ${l}`);
  const gated = new Set(doc.phase_gate_checks.flatMap(g => g.rules));
  for (const l of doc.lessons) assert.ok(gated.has(l.id), `${l.id}: in no gate`);
});

test("reference mirrors every lesson and gate", () => {
  for (const l of doc.lessons) {
    const line = md.split("\n").find(x => x.startsWith(`- **${l.id}**`));
    assert.ok(line, `reference missing ${l.id}`);
    for (const part of ["*Avoid:*", "*Why:*", "*Check:*"]) assert.ok(line.includes(part), `${l.id}: lacks ${part}`);
  }
  for (const g of doc.phase_gate_checks) assert.ok(md.includes(`**${g.id}**`), `reference missing ${g.id}`);
});

test("text stays generic: no proper names mid-sentence", () => {
  // Tools are named by role. Any capitalised word that does not start a sentence must be one of these.
  const ALLOW = new Set(["OK", "Ack", "Discuss", "Yes", "No", "AI", "API", "URL", "MCP", "Blueprint"]);
  const fields = [...doc.lessons.flatMap(l => [l.principle, l.anti_pattern, l.why, l.check]),
    ...doc.phase_gate_checks.flatMap(g => [g.check, g.why])];
  const bad = [];
  for (const f of fields) for (const m of f.matchAll(/(?<![.?!:;'"(—]\s*)(?<=\S\s+)\b[A-Z][A-Za-z]+/g))
    if (!ALLOW.has(m[0])) bad.push(`${m[0]} in "${f.slice(0, 60)}…"`);
  assert.deepEqual(bad, []);
});

test("lessons and gates are readable through MCP", async () => {
  const { c, call } = await connect();
  try {
    const ld = JSON.parse(await call("list_domains"));
    assert.ok(ld.domains.includes("client_collaboration"));
    assert.ok(ld.references.includes("client-collaboration"));
    const it = JSON.parse(await call("get_catalog", { domain: "client_collaboration", format: "items" }));
    assert.ok(it.items.some(i => i.id === "collab.tri-state-response" && i.check && i.why && i.avoid));
    assert.ok(it.items.some(i => i.id === "gate.collab_kickoff" && i.kind === "phase_gate_checks"));
    const one = JSON.parse(await call("get_item", { id: "collab.preview-access-by-audience" }));
    assert.match(JSON.stringify(one), /password/);
  } finally { await c.close(); }
});

// Category registry: elements/categories.yaml is the one source of truth for project categories.
// Every catalog file belongs to exactly one category (or is cross-cutting), every number used elsewhere exists,
// the human doc has a section per category, and no file hardcodes the number of categories.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs"; import path from "node:path";
import yaml from "js-yaml";
import { connect } from "./_client.mjs";

const ROOT = path.resolve("../skill/blueprint");
const load = f => yaml.load(fs.readFileSync(path.join(ROOT, f), "utf8"));
const reg = load("elements/categories.yaml");
const catalogFiles = fs.readdirSync(path.join(ROOT, "catalog")).filter(f => f.endsWith(".yaml")).map(f => f.slice(0, -5)).sort();

test("registry ids and numbers are unique; every catalog file is in exactly one category or cross_cutting", () => {
  const ids = reg.categories.map(c => c.id), nos = reg.categories.map(c => c.no);
  assert.equal(new Set(ids).size, ids.length, "duplicate category id");
  assert.equal(new Set(nos).size, nos.length, "duplicate category no");
  for (const c of reg.categories) {
    assert.match(c.id, /^[a-z][a-z-]*$/, c.id);
    assert.ok(c.name && c.name_ja && c.what && ["idea", "launch", "operate", "scale", "exit"].includes(c.macro), c.id);
    for (const d of c.domains) assert.ok(catalogFiles.includes(d), `${c.id}: domain ${d} has no catalog file`);
  }
  const seen = [...reg.categories.flatMap(c => c.domains), ...reg.cross_cutting];
  for (const f of catalogFiles) assert.equal(seen.filter(d => d === f).length, 1, `catalog/${f}.yaml must appear exactly once in categories.yaml`);
  for (const id of ["ethics", "revenue-model"]) assert.ok(ids.includes(id), id);
});

test("numbers used by lifecycle items and elements exist in the registry; the reference doc has one section per category", () => {
  const nos = new Set(reg.categories.map(c => c.no));
  for (const it of load("catalog/lifecycle.yaml").items) if (it.category != null) assert.ok(nos.has(String(it.category).padStart(2, "0")), `${it.id}: category ${it.category}`);
  for (const e of load("elements/elements.yaml").elements) for (const n of e.categories) assert.ok(nos.has(n), `${e.id}: ${n}`);
  const doc = fs.readFileSync(path.join(ROOT, "reference/categories.md"), "utf8");
  for (const c of reg.categories) assert.match(doc, new RegExp(`^## ${c.no} `, "m"), `reference/categories.md: no section ${c.no}`);
});

test("no hardcoded category or element count in the skill, the tools or the docs", () => {
  const files = ["SKILL.md", ...fs.readdirSync(path.join(ROOT, "reference")).map(f => "reference/" + f), "catalog/schema.md", "elements/README.md", "elements/glossary.yaml"]
    .map(f => path.join(ROOT, f)).concat(["../mcp/src/index.ts", "../app/scripts/build-data.mjs", "../QUICKSTART.md", "../QUICKSTART.ja.md", "../docs/hub/DESIGN.md", "../hub/src/tools.ts"].map(f => path.resolve(f)))
    .filter(f => fs.existsSync(f));
  const bad = /\b12[ -]?categor|12\s?カテゴリ|12cat\b|原則\s?7\s?つ|7つの要素|\b7 principles|\bseven principles|twelve categor/i;
  for (const f of files) fs.readFileSync(f, "utf8").split("\n").forEach((l, i) => assert.ok(!bad.test(l), `${path.relative(ROOT, f)}:${i + 1}: ${l.trim().slice(0, 80)}`));
});

test("the registry is readable through the tools", async () => {
  const { c, call } = await connect();
  try {
    const ld = JSON.parse(await call("list_domains"));
    assert.ok(ld.layers.includes("categories"));
    const it = JSON.parse(await call("get_catalog", { domain: "categories", format: "items" }));
    assert.equal(it.count, reg.categories.length);
    assert.ok(JSON.parse(await call("get_item", { id: "categories.ethics" })).summary);
    for (const d of ["ethics", "revenue_model"]) assert.ok(JSON.parse(await call("get_catalog", { domain: d, format: "items" })).count > 5, d);
    assert.match(await call("get_reference", { name: "categories" }), /## 14 /);
  } finally { await c.close(); }
});

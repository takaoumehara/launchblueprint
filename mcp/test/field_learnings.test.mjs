// Field-learning intake: every item taken in from po-input has the four parts, an occurrence count,
// facts as claims with a source, no preview-host or pull-request links, and stays readable through MCP.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs"; import path from "node:path";
import yaml from "js-yaml";
import { connect } from "./_client.mjs";

const ROOT = path.resolve(import.meta.dirname, "../../skill/blueprint");
const catalog = fs.readdirSync(path.join(ROOT, "catalog")).filter(f => f.endsWith(".yaml"));
const learned = [];
for (const f of catalog) {
  const doc = yaml.load(fs.readFileSync(path.join(ROOT, "catalog", f), "utf8"));
  for (const [key, v] of Object.entries(doc ?? {})) if (Array.isArray(v)) for (const it of v) if (it?.id && it.learned) learned.push({ file: f, key, ...it });
}

test("learned items have principle / avoid / why / yes-no check and an occurrence count", () => {
  assert.ok(learned.length > 100, `only ${learned.length} learned items`);
  for (const it of learned.filter(i => i.key === "lessons" || i.key === "rules" && i.principle)) {
    for (const k of ["principle", "anti_pattern", "why", "check"]) assert.ok(it[k], `${it.id}: missing ${k}`);
    assert.match(String(it.check).trim(), /[?？]$/, `${it.id}: check must be a yes/no question`);
    if (it.context) assert.ok(it.stage || it.context.stage, `${it.id}: stage`);
  }
});

test("every learned item, gates and ledger rules included, has an occurrence count", () => {
  for (const it of learned) assert.ok(Number.isInteger(it.occurrences) && it.occurrences >= 1, `${it.id}: occurrences`);
});

test("facts are claims with a dated source; verified needs a URL; a lesson is verified only if all its claims are", () => {
  for (const it of learned) {
    for (const c of it.claims ?? []) {
      assert.ok(c.id?.startsWith(`${it.id}.c`) && c.claim, `${it.id}: claim id/text`);
      assert.equal(typeof c.source?.verified, "boolean", `${c.id}: verified flag`);
      assert.ok(c.source.checked, `${c.id}: checked date`);
      if (c.source.verified) assert.ok(c.source.url, `${c.id}: verified without URL`);
    }
    if (it.context && "verified" in it && it.verified === true)
      assert.ok(it.claims?.length && it.claims.every(c => c.source.verified), `${it.id}: verified lesson with unverified claims`);
  }
});

test("no preview-host or pull-request links in catalog and reference", () => {
  const files = [...catalog.map(f => path.join(ROOT, "catalog", f)),
    ...fs.readdirSync(path.join(ROOT, "reference")).map(f => path.join(ROOT, "reference", f))];
  for (const f of files) {
    const s = fs.readFileSync(f, "utf8");
    assert.ok(!/https?:\/\/[^\s)'"]*\.vercel\.app/.test(s), `${path.basename(f)}: *.vercel.app link`);
    assert.ok(!/github\.com\/[^\s/]+\/[^\s/]+\/pull\//.test(s), `${path.basename(f)}: pull-request link`);
  }
});

test("reference/brand-media.md mirrors every brand_media lesson", () => {
  const md = fs.readFileSync(path.join(ROOT, "reference/brand-media.md"), "utf8");
  for (const it of learned.filter(i => i.file === "brand_media.yaml")) {
    const line = md.split("\n").find(l => l.startsWith(`- **${it.id}**`));
    assert.ok(line, `reference missing ${it.id}`);
    for (const part of ["*Avoid:*", "*Why:*", "*Check:*"]) assert.ok(line.includes(part), `${it.id}: lacks ${part}`);
  }
});

test("learned items and their unverified claims are visible through MCP", async () => {
  const { c, call } = await connect();
  try {
    const one = JSON.parse(await call("get_item", { id: "bm.genimage-qa-gate" }));
    assert.match(JSON.stringify(one), /occurrences/);
    const st = JSON.parse(await call("stale_items", { days: 90 }));
    assert.ok(st.stale.some(s => /\.c\d+$/.test(String(s.id)) && s.reason === "unverified"), "unverified claims listed by stale_items");
  } finally { await c.close(); }
});

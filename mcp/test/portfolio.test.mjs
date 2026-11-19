// Part B maps through the MCP: update_project_map refreshes a committed map and returns the same review link;
// a profile change keeps observed facts and sourced proposals; nothing becomes decided.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
import yaml from "js-yaml";
import { connect } from "./_client.mjs";

const SLUGS = ["rakugaki-jam", "moime", "local-pro-kit", "lpk-frontdesk", "brand-journey-map"];
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "bp-pf-"));

test("the five maps are listed with their review links and every tactic", async () => {
  const { c, call } = await connect({ BLUEPRINT_PROJECTS: tmp() });
  try {
    const list = JSON.parse(await call("list_project_maps")).maps;
    const topics = JSON.parse(await call("list_topics")).topics.length;
    for (const s of SLUGS) {
      const row = list.find(m => m.slug === s); assert.ok(row, s);
      assert.equal(row.link, `#/p/${s}`); assert.equal(row.arch, `#/p/${s}/arch`); assert.equal(row.counts.decided, 0, s);
      const g = JSON.parse(await call("get_project_map", { slug: s }));
      assert.equal(g.map.choices.length, topics, s);
      assert.ok(g.gaps.length >= 1, `${s}: gaps listed`);
      assert.equal(g.progress.categories.length, 13);
      const rec = JSON.parse(await call("get_project_map", { slug: s, topic: "payments" })).record;
      assert.ok(rec.considered.length >= 2, `${s}: alternatives on node`);
    }
  } finally { await c.close(); }
});

test("update_project_map refreshes a committed map and returns the same link; facts and sourced proposals survive a profile change", async () => {
  const dir = tmp();
  const { c, call } = await connect({ BLUEPRINT_PROJECTS: dir });
  try {
    const before = yaml.load(fs.readFileSync(path.resolve("../skill/blueprint/project-maps/brand-journey-map.yaml"), "utf8"));
    const r = JSON.parse(await call("update_project_map", { slug: "brand-journey-map", decide_topics: ["all"], note: "refresh" }));
    assert.equal(r.link, "#/p/brand-journey-map"); assert.equal(r.arch, "#/p/brand-journey-map/arch"); assert.equal(r.copied_from, "skill/blueprint/project-maps/brand-journey-map.yaml");
    assert.equal(r.counts.decided, 0);
    const after = yaml.load(fs.readFileSync(path.join(dir, "brand-journey-map.yaml"), "utf8"));
    assert.deepEqual(after.production, before.production, "production status kept on refresh");
    for (const t of ["database", "storage", "payments", "frontend", "hosting", "i18n"]) {
      const a = after.choices.find(x => x.topic === t), b = before.choices.find(x => x.topic === t);
      assert.equal(a.ai_pick, b.ai_pick, `${t}: sourced proposal kept on refresh`); assert.equal(a.source, b.source);
    }
    const p = JSON.parse(await call("update_project_map", { slug: "brand-journey-map", preference_profile: "all-in" }));
    assert.equal(p.link, "#/p/brand-journey-map");
    const ai = yaml.load(fs.readFileSync(path.join(dir, "brand-journey-map.yaml"), "utf8"));
    for (const t of ["database", "storage", "payments"]) {
      const x = ai.choices.find(y => y.topic === t);
      assert.equal(x.status, "ai_selected"); assert.equal(x.ai_pick, before.choices.find(y => y.topic === t).ai_pick, `${t} kept under all-in`);
      if (x.scored_pick !== x.ai_pick) assert.equal(x.profile_drift.profile, "all-in", `${t}: drift flagged`);
    }
    for (const t of ["auth", "realtime", "editor_ui"]) assert.equal(ai.choices.find(y => y.topic === t).status, "gap", `${t} stays a flagged gap`);
    const m = JSON.parse(await call("update_project_map", { slug: "moime", decide_topics: ["all"] }));
    assert.equal(m.link, "#/p/moime");
    const mo = yaml.load(fs.readFileSync(path.join(dir, "moime.yaml"), "utf8"));
    assert.equal(mo.choices.find(x => x.topic === "hosting").pick, "host.firebase-hosting");
    assert.equal(mo.choices.find(x => x.topic === "hosting").status, "observed");
  } finally { await c.close(); }
});

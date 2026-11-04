// Coverage: every catalog file is reachable through the tools, every decision option resolves,
// every tech choice has a stack comparison (R-030), every rule/lesson has principle/avoid/why/check.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs"; import path from "node:path";
import yaml from "js-yaml";
import { connect } from "./_client.mjs";

const ROOT = path.resolve("../skill/blueprint");
const files = dir => fs.readdirSync(path.join(ROOT, dir)).filter(f => f.endsWith(".yaml")).map(f => f.slice(0, -5)).sort();

test("every catalog area is reachable and consistent", async () => {
  const { c, call, callRaw } = await connect();
  try {
    const ld = JSON.parse(await call("list_domains"));
    assert.deepEqual(ld.domains, files("catalog"), "list_domains.domains = catalog/*.yaml");
    assert.deepEqual(ld.layers, files("elements"), "list_domains.layers = elements/*.yaml");
    assert.deepEqual(ld.references, fs.readdirSync(path.join(ROOT, "reference")).filter(f => f.endsWith(".md")).map(f => f.slice(0, -3)).sort());
    // raw YAML and items for every domain and layer; anything with ids must produce items
    for (const d of [...ld.domains, ...ld.layers]) {
      const raw = await call("get_catalog", { domain: d });
      assert.ok(raw.length > 0, d);
      const doc = yaml.load(raw);
      const hasIds = JSON.stringify(doc).includes('"id":');
      const it = JSON.parse(await call("get_catalog", { domain: d, format: "items" }));
      if (hasIds) assert.ok(it.count > 0, `${d}: has ids but no items`);
      for (const i of it.items) assert.ok(i.id && i.domain === d, `${d}: item shape`);
      assert.ok(ld.details[d].title, `${d}: title`);
    }
    // every tactic option resolves with get_item; every depends_on exists; every tech choice has a comparison
    const lt = JSON.parse(await call("list_topics"));
    const topics = new Set(lt.topics.map(t => t.topic));
    const missing = [];
    for (const t of lt.topics) {
      for (const dep of t.depends_on) assert.ok(topics.has(dep), `${t.topic} depends_on ${dep}`);
      for (const o of t.options) { const r = await callRaw("get_item", { id: o }); if (r.isError) missing.push(`${t.topic}:${o}`); }
      if (t.kind === "choose") {
        assert.ok(t.ai_pick && t.options.includes(t.ai_pick), `${t.topic}: ai_pick in options`);
        for (const w of t.pick_when) assert.ok(t.options.includes(w.pick), `${t.topic}: pick_when.pick in options`);
        if (t.lane === "tech") assert.ok(t.has_comparison, `${t.topic}: tech choice without stack comparison (R-030)`);
      }
    }
    assert.deepEqual(missing, [], "tactic options not found in catalog");
    // comparisons point at topics that exist, picks are among services, unverified services are flagged
    for (const topic of lt.topics.filter(t => t.has_comparison).map(t => t.topic)) {
      const cmp = JSON.parse(await call("get_comparison", { topic }));
      assert.ok(cmp.services.some(s => s.id === cmp.recommendation.pick), `${topic}: pick is one of the services`);
      assert.ok(cmp.combine?.single && cmp.combine?.combined && cmp.combine?.risks && cmp.switch_points.length > 0, `${topic}: comparison sections`);
      // verified rows must carry url + checked; unverified rows may have checked:null (the "unchecked" convention)
      for (const s of cmp.services) assert.ok(s.verified === false || (s.url && s.checked), `${topic}: ${s.id} verified without url + checked`);
    }
    // every lesson / rule has principle, avoid, why, check
    for (const d of ["business_setup", "data_protection", "ui_ux", "client_collaboration", "brand_media", "foresight"]) {
      const it = JSON.parse(await call("get_catalog", { domain: d, format: "items" }));
      for (const i of it.items.filter(i => i.kind === "lessons" || i.kind === "rules"))
        assert.ok(i.summary && i.avoid && i.why && i.check, `${i.id}: principle/avoid/why/check`);
    }
    // ui_ux checklist ids resolve
    const ck = JSON.parse(await call("ui_ux_checklist", { phase: "requirements" }));
    for (const r of ck.checklist.slice(0, 5)) assert.ok(!(await callRaw("get_item", { id: r.id })).isError, r.id);
  } finally { await c.close(); }
});

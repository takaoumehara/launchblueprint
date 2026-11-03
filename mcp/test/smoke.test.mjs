// Smoke test: start the server over stdio and call every tool once.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
import { connect } from "./_client.mjs";

test("all tools respond", async () => {
  const inbox = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "bp-")), "learnings.jsonl");
  const { c, call, callRaw } = await connect({ BLUEPRINT_INBOX: inbox });
  try {
    const names = (await c.listTools()).tools.map(t => t.name).sort();
    assert.deepEqual(names, ["draft_project_map", "get_catalog", "get_comparison", "get_item", "get_reference", "get_skill", "get_template",
      "lifecycle_stages", "list_domains", "list_topics", "propose_learning", "search", "stale_items", "ui_ux_checklist"]);
    const ld = JSON.parse(await call("list_domains"));
    assert.ok(ld.domains.includes("payments") && ld.layers.includes("tactics") && ld.layers.includes("elements"));
    assert.ok(ld.templates.includes("project.axes.yaml") && ld.templates.includes("brand-context.md") && ld.templates.includes("project-map.template.yaml"));
    assert.ok(ld.details.payments.items > 0 && typeof ld.details.payments.title === "string");
    assert.match(await call("get_catalog", { domain: "payments" }), /domain: payments/);
    // lesson-format entries and the elements layer
    const bs = JSON.parse(await call("get_catalog", { domain: "business_setup", format: "items" }));
    assert.ok(bs.items.some(i => i.id === "biz.domain-resale-rights" && i.check && i.why));
    const tac = JSON.parse(await call("get_catalog", { domain: "tactics", format: "items" }));
    assert.ok(tac.items.some(i => i.id === "tactics.payments" && Array.isArray(i.depends_on) && i.stage === "launch"));
    // lifecycle: macro stages with known_surprises / revisit_triggers
    const ls = JSON.parse(await call("lifecycle_stages"));
    assert.deepEqual(ls.macro_stages.map(m => m.id), ["idea", "launch", "operate", "scale", "exit"]);
    assert.ok(ls.stages.every(s => Array.isArray(s.known_surprises) && Array.isArray(s.revisit_triggers) && s.macro));
    const op = JSON.parse(await call("lifecycle_stages", { stage: "operate", include_items: true }));
    assert.equal(op.macro_stages.length, 1); assert.ok(op.stages.every(s => s.macro === "operate") && op.item_count > 0);
    const fine = JSON.parse(await call("lifecycle_stages", { stage: "pricing" }));
    assert.equal(fine.stages[0].id, "pricing"); assert.equal(fine.macro_stages[0].id, "launch");
    assert.ok((await c.callTool({ name: "lifecycle_stages", arguments: { stage: "nope" } })).isError);
    const lci = JSON.parse(await call("get_catalog", { domain: "lifecycle", format: "items" }));
    assert.ok(lci.items.some(i => i.id === "lifecycle.operate" && i.stage === "operate" && i.known_surprises?.length));
    assert.ok(lci.items.some(i => i.id === "lifecycle.macro.operate" && i.known_surprises?.length));
    // new domains for the coverage gaps
    for (const d of ["validation", "pricing", "legal_terms", "backup_dr", "cost_control", "ops_handoff", "exit_tools"]) assert.ok(ld.domains.includes(d), d);
    assert.ok(JSON.parse(await call("get_catalog", { domain: "cost_control", format: "items" })).items.some(i => i.id === "cc.kill-switch-tested" && i.check));
    assert.ok(ld.references.includes("coverage") && ld.references.includes("feedback-loop"));
    assert.match(await call("get_catalog", { domain: "elements" }), /domain: elements/);
    const sc = JSON.parse(await call("get_catalog", { domain: "stack_comparisons", format: "items" }));
    assert.ok(sc.items.some(i => i.id === "stack_comparisons.payments"));
    // get_item: entry, lesson, rule, lifecycle, dd group
    for (const id of ["db.supabase", "dp.restore-test-monthly", "rules.R-004", "lc.discover.01", "dd.users", "ui_ux.primary-action-color"]) {
      const it = JSON.parse(await call("get_item", { id }));
      assert.equal(it.id, id, id); assert.ok(it.summary, id + " summary"); assert.ok(it.raw, id + " raw");
    }
    assert.ok((await callRaw("get_item", { id: "nope.nothing" })).isError);
    // search
    assert.ok(JSON.parse(await call("search", { query: "stripe" })).count > 0);
    const sr = JSON.parse(await call("search", { query: "restore" }));
    assert.ok(sr.items.some(i => i.id === "dp.restore-test-monthly"));
    assert.ok(JSON.parse(await call("search", { query: "el.security" })).hits.some(h => h.file.startsWith("elements/")));
    assert.ok(JSON.parse(await call("search", { query: "blueprint.project-axes" })).hits.some(h => h.file.startsWith("templates/")));
    // references, templates, skill
    assert.ok((await call("get_reference", { name: ld.references[0] })).length > 0);
    assert.match(await call("get_reference", { name: "dry-run-sample" }), /booking/i);
    assert.match(await call("get_template", { name: "project.axes.yaml" }), /blueprint\.project-axes/);
    assert.match(await call("get_template", { name: "project-map.template" }), /domain: project_map/);
    assert.ok((await callRaw("get_template", { name: "../SKILL.md" })).isError);
    assert.match(await call("get_skill"), /\S/);
    // topics and comparisons
    const lt = JSON.parse(await call("list_topics"));
    assert.ok(lt.count >= 40 && lt.stages.length === 5 && lt.topics.every(t => t.stage && t.lane && t.kind));
    assert.ok(JSON.parse(await call("list_topics", { stage: "exit" })).topics.every(t => t.stage === "exit"));
    const cmp = JSON.parse(await call("get_comparison", { topic: "payments" }));
    assert.ok(cmp.recommendation.pick && cmp.services.length >= 2 && cmp.service_names[cmp.services[0].id]);
    assert.ok((await callRaw("get_comparison", { topic: "no_such_topic" })).isError);
    // project map
    const dm = JSON.parse(await call("draft_project_map", { profile: { platform: "app" } }));
    assert.equal(dm.project_map.choices.find(c => c.topic === "database").ai_pick, "db.firestore");
    assert.ok(dm.next_steps.length > 0 && dm.progress.length === 5 && /domain: project_map/.test(dm.yaml));
    assert.ok((await callRaw("draft_project_map", { profile: {}, decided: { database: "db.nope" } })).isError);
    assert.ok((await callRaw("draft_project_map", { profile: {}, decided: { nope: "x" } })).isError);
    // stale, checklist, inbox, path traversal
    const st = JSON.parse(await call("stale_items", { days: 0 })); assert.ok(st.total_with_source > 0);
    assert.ok(st.stale.some(s => s.domain.startsWith("stack_comparisons.")));
    assert.ok(JSON.parse(await call("ui_ux_checklist")).count > 0);
    assert.ok(JSON.parse(await call("ui_ux_checklist", { phase: "design" })).checklist.every(r => r.id.startsWith("ui_ux.")));
    await call("propose_learning", { text: "smoke test learning", category: "test" });
    await call("propose_learning", { text: "map: add color.danger token", category: "ui_ux", kind: "component_map_update" });
    const lines = fs.readFileSync(inbox, "utf8").trim().split("\n").map(l => JSON.parse(l));
    assert.equal(lines.length, 2);
    assert.equal(lines[0].kind, "rule"); assert.equal(lines[1].kind, "component_map_update");
    const badKind = await c.callTool({ name: "propose_learning", arguments: { text: "xxxxx", category: "t", kind: "nope" } });
    assert.ok(badKind.isError);
    assert.ok(JSON.parse(await call("search", { query: "component-map-only" })).count > 0);
    assert.ok(ld.references.includes("component-map-template") && ld.references.includes("capsule-template"));
    assert.ok((await callRaw("get_catalog", { domain: "../../etc/passwd" })).isError);
  } finally { await c.close(); }
});

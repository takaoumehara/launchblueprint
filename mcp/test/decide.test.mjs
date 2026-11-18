// Preference profiles, decide, project maps and catalog refresh.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
import yaml from "js-yaml";
import { connect } from "./_client.mjs";

const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "bp-dec-"));
const CRIT = ["cost", "speed", "breadth", "lock_in", "scale", "compliance", "ecosystem"];

test("profiles: defaults, org-defined with extends, criteria", async () => {
  const { c, call } = await connect({ BLUEPRINT_PREFERENCES_EXTRA: path.resolve("test/fixtures/preferences") });
  try {
    const lp = JSON.parse(await call("list_profiles"));
    assert.equal(lp.default, "lean-fast-full");
    const ids = lp.profiles.map(p => p.id);
    for (const id of ["lean-fast-full", "all-in", "org-compliance-first"]) assert.ok(ids.includes(id), id);
    for (const p of lp.profiles) { assert.deepEqual(p.errors, [], p.id); assert.deepEqual(Object.keys(p.weights).sort(), [...CRIT].sort()); }
    const org = lp.profiles.find(p => p.id === "org-compliance-first");
    assert.equal(org.scope, "org"); assert.equal(org.weights.lock_in, 4); assert.equal(org.weights.scale, 5, "inherits all-in scale");
    assert.deepEqual(lp.criteria.map(x => x.id).sort(), [...CRIT].sort());
    const d = JSON.parse(await call("decide", { topic: "auth", profile: "org-compliance-first" }));
    assert.equal(d.record.profile, "org-compliance-first");
  } finally { await c.close(); }
});

test("decide lists the realistic field and scores every option before recommending", async () => {
  const { c, call, callRaw } = await connect();
  try {
    const lt = JSON.parse(await call("list_topics"));
    for (const t of lt.topics) {
      const { record: r, scoring_table } = JSON.parse(await call("decide", { topic: t.topic }));
      assert.notEqual(r.status, "decided", `${t.topic}: decide must never decide`);
      assert.equal(r.profile, "lean-fast-full");
      assert.ok(["ai_selected", "gap"].includes(r.status), t.topic);
      if (t.kind !== "choose") { assert.deepEqual(r.to_check, t.options); continue; }
      assert.ok(r.considered.length >= 2 && r.field_size === r.considered.length, `${t.topic}: alternatives`);
      for (const o of t.options) assert.ok(r.considered.some(x => x.option === o), `${t.topic}: tactic option ${o} considered`);
      for (const x of r.considered) {
        for (const k of CRIT) assert.ok(x.scores[k] && typeof x.scores[k].score === "number" && x.scores[k].basis && x.scores[k].evidence, `${t.topic}/${x.option}/${k}`);
        assert.deepEqual(x.gaps, CRIT.filter(k => x.scores[k].basis === "gap"));
      }
      assert.equal(r.ai_pick, r.considered[0].option); assert.equal(r.pick, "", "ai pick never fills the owner's pick");
      assert.ok(r.reason.includes("lean-fast-full") && r.reason_ja, `${t.topic}: why it won`);
      assert.deepEqual(r.rejected.map(x => x.option).sort(), r.considered.slice(1).map(x => x.option).sort(), `${t.topic}: every alternative has a rejection reason`);
      for (const x of r.rejected) assert.ok(x.why.length > 5, `${t.topic}: ${x.option} why`);
      assert.equal(scoring_table.length, r.considered.length);
      if (!r.verified) assert.ok(r.gap_notes.some(n => n.includes("verified:false")), `${t.topic}: unverified pick is flagged`);
    }
    // auth: the realistic field includes every auth provider in the catalog, not only the tactic's options
    const auth = JSON.parse(await call("decide", { topic: "auth" })).record;
    assert.ok(auth.considered.length >= 10 && auth.considered.some(x => x.from.includes("catalog_providers")), "auth providers swept in");
    assert.ok((await callRaw("decide", { topic: "nope" })).isError);
    assert.ok((await callRaw("decide", { topic: "auth", profile: "nope" })).isError);
  } finally { await c.close(); }
});

test("a different profile re-scores and can change the pick; linkages follow chosen parts", async () => {
  const { c, call, callRaw } = await connect();
  try {
    const lt = JSON.parse(await call("list_topics"));
    let differ = 0;
    for (const t of lt.topics.filter(t => t.kind === "choose")) {
      const d = JSON.parse(await call("decide", { topic: t.topic, profile: "lean-fast-full", also_under: ["all-in"] }));
      const a = JSON.parse(await call("decide", { topic: t.topic, profile: "all-in" }));
      assert.equal(d.also_under[0].ai_pick, a.record.ai_pick, t.topic);
      if (a.record.ai_pick !== d.record.ai_pick) differ++;
      if (t.topic === "hosting") assert.notDeepEqual(a.record.considered.map(x => x.total), d.record.considered.map(x => x.total), "totals move with the weights");
    }
    assert.ok(differ >= 3, `profiles should disagree on several topics, got ${differ}`);
    // linkage: same vendor as the chosen database, and an avoid_when conflict
    const s = JSON.parse(await call("decide", { topic: "auth", chosen: { database: "db.supabase" } })).record;
    assert.equal(s.ai_pick, "auth.supabase");
    assert.ok(s.linkages.some(l => l.kind === "same_vendor" && l.with_topic === "database"));
    assert.ok(s.linkages.some(l => l.kind === "shared_free_tier" && l.verified === false));
    const fb = s.considered.find(x => x.option === "auth.firebase");
    assert.equal(fb.scores.ecosystem.score, 0, "avoid_when names the chosen database");
    const f = JSON.parse(await call("decide", { topic: "auth", chosen: { database: "db.firestore" } })).record;
    assert.notEqual(f.ai_pick, "auth.supabase", "pick follows the chosen database");
    // agent evidence overrides a gap, stays unverified; unknown options are rejected
    const e = JSON.parse(await call("decide", { topic: "auth", evidence: [{ option: "auth.clerk", criterion: "speed", score: 1, note: "prebuilt sign-in UI components in the official docs" }] })).record;
    const clerk = e.considered.find(x => x.option === "auth.clerk");
    assert.equal(clerk.scores.speed.basis, "agent"); assert.equal(clerk.scores.speed.unverified, true); assert.equal(e.source, "catalog+agent");
    assert.ok((await callRaw("decide", { topic: "auth", evidence: [{ option: "auth.nope", criterion: "speed", score: 1, note: "xxxx" }] })).isError);
    const x = JSON.parse(await call("decide", { topic: "auth", extra_options: [{ id: "auth.newcomer", name: "Newcomer" }] })).record;
    const nc = x.considered.find(o => o.option === "auth.newcomer");
    assert.ok(nc && !nc.in_catalog && nc.gaps.length === CRIT.length);
  } finally { await c.close(); }
});

test("update_project_map: review link, ai_selected not decided, owner gate, observed evidence, profile re-score", async () => {
  const dir = tmp();
  const { c, call, callRaw } = await connect({ BLUEPRINT_PROJECTS: dir, BLUEPRINT_APP_URL: "https://blueprint.example" });
  try {
    assert.ok((await callRaw("update_project_map", { slug: "new-one" })).isError, "creating needs a name");
    const u = JSON.parse(await call("update_project_map", { slug: "sample-shop", name: "Sample shop", goal: "Sell a few things online", intake: { audience: "public", platform: "web", money: "paid", country: "jp" },
      preference_profile: "lean-fast-full", decide_topics: ["all"] }));
    assert.equal(u.link, "#/p/sample-shop"); assert.equal(u.url, "https://blueprint.example/#/p/sample-shop"); assert.equal(u.arch, "#/p/sample-shop/arch");
    assert.ok(fs.existsSync(path.join(dir, "sample-shop.yaml")));
    assert.equal(u.counts.decided, 0, "the agent never decides");
    assert.equal(u.counts.ai_selected + u.counts.gap, 64);
    // owner gate: decided without owner_confirmed is refused and nothing is written
    const before = fs.readFileSync(path.join(dir, "sample-shop.yaml"), "utf8");
    const bad = await callRaw("update_project_map", { slug: "sample-shop", records: [{ topic: "payments", status: "decided", pick: "pay.stripe-checkout" }] });
    assert.ok(bad.isError && /owner_confirmed/.test(bad.content[0].text));
    assert.equal(fs.readFileSync(path.join(dir, "sample-shop.yaml"), "utf8"), before);
    assert.ok((await callRaw("update_project_map", { slug: "sample-shop", records: [{ topic: "hosting", status: "observed", pick: "host.vercel" }] })).isError, "observed needs evidence");
    assert.ok((await callRaw("update_project_map", { slug: "sample-shop", records: [{ topic: "search", status: "gap" }] })).isError, "gap needs a note");
    const ok = JSON.parse(await call("update_project_map", { slug: "sample-shop", by: "agent", records: [
      { topic: "payments", status: "decided", pick: "pay.stripe-checkout", owner_confirmed: true, decided_by: "owner", reason: "Owner chose card payments for launch." },
      { topic: "hosting", status: "observed", pick: "host.vercel", evidence: [{ kind: "config", path: "vercel.json", note: "build config for the host" }] },
      { topic: "search", status: "gap", gap_note: "No search requirement written yet." }] }));
    assert.equal(ok.counts.decided, 1); assert.equal(ok.counts.observed, 1);
    const g = JSON.parse(await call("get_project_map", { slug: "sample-shop" }));
    assert.equal(g.map.choices.length, 64);
    assert.equal(g.progress.categories.length, 13);
    const pay = g.map.choices.find(x => x.topic === "payments");
    assert.equal(pay.owner_confirmed, true); assert.equal(pay.decided_by, "owner");
    assert.ok(g.gaps.some(x => x.topic === "search" && x.gap_note));
    const host = g.architecture.nodes.find(n => n.id === "hosting"); assert.equal(host.state, "implemented");
    assert.equal(g.architecture.nodes.find(n => n.id === "payments").state, "proposed");
    assert.ok(g.architecture.edges.every(e => e.state === "proposed" || (e.evidence ?? []).length), "implemented links need evidence");
    // profile change: preview, then apply; decided/observed kept
    const pv = JSON.parse(await call("rescore_project_map", { slug: "sample-shop", profile: "all-in" }));
    assert.ok(pv.changes.length > 0, "all-in moves some picks");
    const ap = JSON.parse(await call("update_project_map", { slug: "sample-shop", preference_profile: "all-in" }));
    assert.equal(ap.preference_profile, "all-in"); assert.deepEqual(ap.rescored.map(x => x.topic).sort(), pv.changes.map(x => x.topic).sort());
    const g2 = JSON.parse(await call("get_project_map", { slug: "sample-shop" }));
    assert.equal(g2.map.choices.find(x => x.topic === "payments").pick, "pay.stripe-checkout");
    assert.equal(g2.map.choices.find(x => x.topic === "hosting").status, "observed");
    assert.ok(g2.map.choices.filter(x => x.status === "ai_selected" && x.kind === "choose").every(x => x.profile === "all-in"));
    const doc = yaml.load(fs.readFileSync(path.join(dir, "sample-shop.yaml"), "utf8"));
    assert.equal(doc.schema, "blueprint.project-map/v2"); assert.ok(doc.history.some(h => h.change === "preference_profile"));
    const lm = JSON.parse(await call("list_project_maps"));
    assert.ok(lm.maps.some(m => m.slug === "sample-shop" && m.where === "draft" && m.link === "#/p/sample-shop"));
    assert.ok((await callRaw("update_project_map", { slug: "../x", name: "x" })).isError);
  } finally { await c.close(); }
});

test("catalog refresh: stale plan and proposals never touch the master", async () => {
  const inbox = path.join(tmp(), "catalog-refresh.jsonl");
  const { c, call, callRaw } = await connect({ BLUEPRINT_REFRESH_INBOX: inbox });
  try {
    const st = JSON.parse(await call("stale_items", { days: 0, refresh_plan: true, used_only: true, limit: 20 }));
    assert.ok(st.stale.length > 0 && st.how_to);
    for (const s of st.stale) { assert.ok(s.used_by.length > 0 && s.next, s.id); assert.ok(typeof s.current === "object"); }
    const master = fs.readFileSync(path.resolve("../skill/blueprint/catalog/database.yaml"), "utf8");
    const p = JSON.parse(await call("propose_catalog_refresh", { id: "db.neon", url: "https://neon.com/pricing", checked: "2026-11-18", verified: false,
      changes: [{ field: "pricing_bands.free", new_text: "test text only" }], note: "test" }));
    assert.equal(p.record.kind, "catalog_refresh"); assert.equal(p.record.diff[0].field, "pricing_bands.free");
    assert.ok(p.record.diff[0].old && p.record.diff[0].changed);
    assert.equal(fs.readFileSync(path.resolve("../skill/blueprint/catalog/database.yaml"), "utf8"), master);
    assert.equal(fs.readFileSync(inbox, "utf8").trim().split("\n").length, 1);
    assert.ok((await callRaw("propose_catalog_refresh", { id: "db.neon", checked: "2026-11-18", verified: true, changes: [] })).isError, "verified needs url");
    assert.ok((await callRaw("propose_catalog_refresh", { id: "db.nope", checked: "2026-11-18", verified: false, changes: [] })).isError);
  } finally { await c.close(); }
});

test("committed project maps load and keep every rule", async () => {
  const { c, call } = await connect({ BLUEPRINT_PROJECTS: tmp() });
  try {
    const lm = JSON.parse(await call("list_project_maps"));
    const committed = lm.maps.filter(m => m.where === "committed");
    assert.ok(committed.length >= 1, "at least one fixture map");
    for (const m of committed) {
      const g = JSON.parse(await call("get_project_map", { slug: m.slug }));
      assert.equal(g.map.choices.length, 64, m.slug);
      for (const ch of g.map.choices) {
        if (ch.status === "decided") assert.equal(ch.owner_confirmed, true, `${m.slug}/${ch.topic}`);
        if (ch.status === "observed") assert.ok((ch.evidence ?? []).length, `${m.slug}/${ch.topic}: observed evidence`);
        if (ch.status === "gap") assert.ok(ch.gap_note || (ch.gap_notes ?? []).length, `${m.slug}/${ch.topic}: gap note`);
      }
    }
  } finally { await c.close(); }
});

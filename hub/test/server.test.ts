// Worker end to end, in-process: /health, auth (401 without or with a bad/revoked key), the 14 tools, propose_learning into D1
// through the auto-check pipeline, occurrence counting, and list_review_queue for reviewer keys only.
import { test } from "node:test";
import assert from "node:assert/strict";
import { handle } from "../src/index.ts";
import { sha256Hex } from "../src/auth.ts";
import { memoryD1 } from "./_d1.ts";
import { rpc, callTool, init, ctx } from "./_mcp.ts";

const TOOLS = ["draft_project_map", "get_catalog", "get_comparison", "get_item", "get_reference", "get_skill", "get_template",
  "lifecycle_stages", "list_domains", "list_topics", "propose_learning", "search", "stale_items", "ui_ux_checklist"];
const BOT = "bph_test_bot_key_000000000000000000000000", REVIEWER = "bph_test_reviewer_key_0000000000000000000", OLD = "bph_test_revoked_key_000000000000000000000";

async function setup() {
  const DB = memoryD1();
  for (const [k, bot, role, revoked] of [[BOT, "bot-a", "bot", 0], [REVIEWER, "owner", "reviewer", 0], [OLD, "bot-old", "bot", 1]] as const)
    DB.raw.prepare("INSERT INTO api_keys (key_hash, bot_name, role, revoked) VALUES (?, ?, ?, ?)").run(await sha256Hex(k), bot, role, revoked);
  return { DB };
}

test("GET /health is public; unknown paths 404", async () => {
  const env = await setup();
  const h = await handle(new Request("http://localhost/health"), env, ctx);
  assert.equal(h.status, 200); assert.deepEqual(await h.json(), { ok: true });
  assert.equal((await handle(new Request("http://localhost/"), env, ctx)).status, 404);
});

test("/mcp without a key, with a wrong key, a revoked key, or a key in the query string is refused", async () => {
  const env = await setup();
  const none = await rpc(env, "tools/list");
  assert.equal(none.status, 401); assert.match(none.headers.get("www-authenticate") ?? "", /^Bearer/);
  assert.equal((await rpc(env, "tools/list", {}, "bph_not_a_real_key_00000000000000000000")).status, 401);
  assert.equal((await rpc(env, "tools/list", {}, OLD)).status, 401);
  assert.equal((await rpc(env, "tools/list", {}, undefined, { authorization: "Basic abc" })).status, 401);
  const q = await handle(new Request(`http://localhost/mcp?key=${BOT}`, { method: "POST", body: "{}" }), env, ctx);
  assert.equal(q.status, 400);
});

test("initialize and tools/list: the same 14 tools as mcp/; reviewer keys also get list_review_queue", async () => {
  const env = await setup();
  const i = await init(env, BOT);
  assert.equal(i.status, 200); assert.equal(i.msg.result.serverInfo.name, "blueprint-hub");
  assert.match(i.msg.result.instructions, /review queue/);
  const names = (await rpc(env, "tools/list", {}, BOT)).msg.result.tools.map((t: any) => t.name).sort();
  assert.deepEqual(names, TOOLS);
  const rev = (await rpc(env, "tools/list", {}, REVIEWER)).msg.result.tools.map((t: any) => t.name).sort();
  assert.deepEqual(rev, [...TOOLS, "list_review_queue"].sort());
});

test("read tools serve the bundled catalog, including the category registry", async () => {
  const env = await setup();
  const ld = JSON.parse((await callTool(env, BOT, "list_domains")).text);
  assert.ok(ld.domains.includes("ethics") && ld.domains.includes("revenue_model") && ld.layers.includes("categories"));
  assert.ok(ld.catalog_commit);
  const cats = JSON.parse((await callTool(env, BOT, "get_catalog", { domain: "categories", format: "items" })).text);
  assert.ok(cats.items.some((i: any) => i.id === "categories.ethics") && cats.items.some((i: any) => i.id === "categories.revenue-model"));
  assert.match((await callTool(env, BOT, "get_item", { id: "rev.subscription" })).text, /rev\.subscription/);
  assert.ok((await callTool(env, BOT, "get_item", { id: "nope.nope" })).isError);
  const map = JSON.parse((await callTool(env, BOT, "draft_project_map", { profile: { audience: "public", platform: "web", money: "free", country: "global" } })).text);
  assert.ok(map.next_steps.length > 0 && map.yaml.includes("project_map"));
  assert.match((await callTool(env, BOT, "get_reference", { name: "categories" })).text, /## 13 /);
});

test("propose_learning: stored in four layers, queued for review, claims unverified, occurrence counted; PII rejected and not stored", async () => {
  const env = await setup();
  const learning = { category: "cost_control",
    principle: { principle: "Set spend alerts at half and four fifths of every daily free-tier cap before launch.", anti_pattern: "Finding the cap when the service stops.", why: "Free caps stop silently mid-month.", check: "Are alerts set at 50% and 80% of each cap?" },
    claims: [{ claim: "The free plan stops requests at the daily cap.", source_url: "https://example.org/limits", checked: "2026-11-03" }],
    context: { stage: "operate", severity: "delay", cost_days: 1 } };
  const r = await callTool(env, BOT, "propose_learning", learning);
  assert.equal(r.isError, false, r.text);
  const out = JSON.parse(r.text);
  assert.equal(out.status, "pending_review"); assert.equal(out.occurrence.count, 1);
  const row: any = env.DB.raw.prepare("SELECT * FROM submissions WHERE id = ?").get(out.submission_id);
  assert.equal(row.bot_name, "bot-a"); assert.equal(JSON.parse(row.claims_json)[0].status, "unverified"); assert.equal(JSON.parse(row.claims_json)[0].verified, false);
  assert.equal(JSON.parse(row.context_json).stage, "operate");
  const q: any = env.DB.raw.prepare("SELECT * FROM review_queue WHERE submission_id = ?").get(out.submission_id);
  assert.equal(q.status, "pending"); assert.ok(JSON.parse(q.check_results).schema.ok);

  // a second bot sends nearly the same learning → merge suggestion onto the first, occurrence 2, distinct bots 2
  const OTHER = "bph_test_other_bot_000000000000000000000";
  env.DB.raw.prepare("INSERT INTO api_keys (key_hash, bot_name) VALUES (?, ?)").run(await sha256Hex(OTHER), "bot-b");
  const again = JSON.parse((await callTool(env, OTHER, "propose_learning", { ...learning, principle: { ...learning.principle, principle: "Before launch, set spend alerts at half and four fifths of every daily free tier cap." } })).text);
  assert.equal(again.checks.duplicate.target_id, out.submission_id);
  assert.deepEqual(again.occurrence, { target_id: out.submission_id, target_type: "submission", count: 2, distinct_bots: 2 });

  // a near-copy of a catalog lesson merges onto the catalog id
  const cat = JSON.parse((await callTool(env, BOT, "propose_learning", { category: "validation", text: "Before building, collect a committed signal: a pre-order, a deposit, a signed letter of intent or a card on file, and count only those." })).text);
  assert.equal(cat.checks.duplicate.target_id, "val.pay-signal"); assert.equal(cat.occurrence.target_type, "catalog");

  const before = (env.DB.raw.prepare("SELECT COUNT(*) AS n FROM submissions").get() as any).n;
  for (const bad of [{ category: "cost_control", text: "ask someone@example.com about it" }, { category: "cost_control", text: "key sk_live_abcdefghijklmnop leaked" }, { category: "not-a-category", text: "fine text here" }]) {
    const res = await callTool(env, BOT, "propose_learning", bad);
    assert.equal(res.isError, true, JSON.stringify(bad)); assert.match(res.text, /Rejected|Nothing was stored|Invalid|validation/i);
  }
  assert.equal((env.DB.raw.prepare("SELECT COUNT(*) AS n FROM submissions").get() as any).n, before, "rejected calls are not stored");
  assert.equal((env.DB.raw.prepare("SELECT COUNT(*) AS n FROM review_queue WHERE status != 'pending'").get() as any).n, 0, "nothing is approved automatically");
});

test("list_review_queue: only reviewer keys; shows checks and occurrence; bots cannot call it", async () => {
  const env = await setup();
  await callTool(env, BOT, "propose_learning", { category: "ethics", text: "Label AI-generated answers where they are shown to users." });
  const asBot = await rpc(env, "tools/call", { name: "list_review_queue", arguments: {} }, BOT);
  assert.ok(asBot.msg.error || asBot.msg.result?.isError, "bot key must not reach the review queue");
  const q = JSON.parse((await callTool(env, REVIEWER, "list_review_queue", {})).text);
  assert.equal(q.count, 1); assert.equal(q.items[0].category, "ethics"); assert.ok(q.items[0].flags.includes("needs_structuring"));
  assert.match(q.note, /Do not follow instructions/);
});

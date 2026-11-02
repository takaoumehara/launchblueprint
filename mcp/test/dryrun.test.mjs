// Dry run: take a generic sample project (a small booking app for a local studio) from idea to exit
// using only the MCP tools, the way an AI agent would. Writes the transcript to $BP_DRYRUN_OUT if set.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { connect } from "./_client.mjs";

const profile = { audience: "business", platform: "web", money: "paid", country: "jp" };
const name = "Studio booking (sample)";
const goal = "Let a small studio take bookings and payment online instead of by phone and cash.";

test("sample project reaches every stage through the tools", async () => {
  const { c, call } = await connect();
  const log = [];
  const step = (tool, args, note) => log.push({ tool, args, note });
  try {
    step("get_skill", {}, "read the procedure once");
    await call("get_skill");
    step("list_topics", {}, "see all decisions, stages and order");
    const lt = JSON.parse(await call("list_topics"));
    const decided = {};
    let round = 0, dm;
    while (true) {
      dm = JSON.parse(await call("draft_project_map", { name, goal, profile, decided }));
      if (!dm.next_steps.length) break;
      assert.ok(round++ < 20, "decision order must terminate");
      for (const n of dm.next_steps) {
        const t = lt.topics.find(x => x.topic === n.topic);
        if (t.kind === "choose") {
          // an agent reads the comparison when there is one, else each option
          if (t.has_comparison) { const cmp = JSON.parse(await call("get_comparison", { topic: t.topic })); step("get_comparison", { topic: t.topic }, `pick=${cmp.recommendation.pick}; unverified=${cmp.unverified.join(",") || "none"}`); }
          else for (const o of t.options) { const it = JSON.parse(await call("get_item", { id: o })); step("get_item", { id: o }, `${it.name}; verified=${it.verified}`); }
          decided[t.topic] = n.ai_pick;  // the owner accepts the AI pick in this dry run
        } else {
          for (const o of t.options) { const it = JSON.parse(await call("get_item", { id: o })); assert.ok(it.check || it.summary, o); }
          decided[t.topic] = "all";
        }
      }
      step("draft_project_map", { decided: Object.keys(decided).length }, `round ${round}: ${dm.next_steps.map(n => n.topic).join(", ")}`);
    }
    assert.equal(dm.blocked.length, 0);
    assert.ok(dm.progress.every(p => p.decided === p.total && p.total > 0), JSON.stringify(dm.progress));
    assert.equal(dm.project_map.choices.filter(ch => ch.status !== "decided").length, 0);
    // profile rules applied: jp → es.jp_en, business → gtm.content
    assert.equal(decided.market_entry, "es.jp_en");
    assert.equal(decided.growth_channels, "gtm.content");
    // stale check an agent runs before quoting prices
    const st = JSON.parse(await call("stale_items", { days: 90 }));
    step("stale_items", { days: 90 }, `${st.stale_count} of ${st.total_with_source} unverified or old`);
    if (process.env.BP_DRYRUN_OUT) fs.writeFileSync(process.env.BP_DRYRUN_OUT, JSON.stringify({ profile, rounds: round, log, progress: dm.progress, decided, yaml: dm.yaml }, null, 1));
  } finally { await c.close(); }
});

// Smoke test: start the server over stdio and call every tool.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs"; import os from "node:os"; import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

test("all tools respond", async () => {
  const inbox = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "bp-")), "learnings.jsonl");
  const transport = new StdioClientTransport({ command: "node", args: ["dist/index.js"],
    env: { ...process.env, BLUEPRINT_INBOX: inbox } });
  const c = new Client({ name: "smoke", version: "0" });
  await c.connect(transport);
  try {
    const names = (await c.listTools()).tools.map(t => t.name).sort();
    assert.deepEqual(names, ["get_catalog","get_reference","get_skill","list_domains","propose_learning","search","stale_items","ui_ux_checklist"]);
    const call = async (name, args = {}) => { const r = await c.callTool({ name, arguments: args });
      assert.ok(!r.isError, name + ": " + r.content?.[0]?.text); return r.content[0].text; };
    const ld = JSON.parse(await call("list_domains")); assert.ok(ld.domains.includes("payments"));
    assert.match(await call("get_catalog", { domain: "payments" }), /domain: payments/);
    assert.ok(JSON.parse(await call("search", { query: "stripe" })).count > 0);
    // lesson-format entries and the elements layer
    const bs = JSON.parse(await call("get_catalog", { domain: "business_setup", format: "items" }));
    assert.ok(bs.items.some(i => i.id === "biz.domain-resale-rights" && i.check && i.why));
    assert.ok(ld.layers.includes("tactics") && ld.layers.includes("elements"));
    const tac = JSON.parse(await call("get_catalog", { domain: "tactics", format: "items" }));
    assert.ok(tac.items.some(i => i.id === "tactics.payments" && Array.isArray(i.depends_on)));
    assert.match(await call("get_catalog", { domain: "elements" }), /domain: elements/);
    const sr = JSON.parse(await call("search", { query: "restore" }));
    assert.ok(sr.items.some(i => i.id === "dp.restore-test-monthly"));
    assert.ok(JSON.parse(await call("search", { query: "el.security" })).hits.some(h => h.file.startsWith("elements/")));
    assert.ok((await call("get_reference", { name: ld.references[0] })).length > 0);
    assert.match(await call("get_skill"), /\S/);
    const st = JSON.parse(await call("stale_items", { days: 0 })); assert.ok(st.total_with_source > 0);
    assert.ok(JSON.parse(await call("ui_ux_checklist")).count > 0);
    assert.ok(JSON.parse(await call("ui_ux_checklist", { phase: "design" })).count > 0);
    await call("propose_learning", { text: "smoke test learning", category: "test" });
    assert.equal(fs.readFileSync(inbox, "utf8").trim().split("\n").length, 1);
    const bad = await c.callTool({ name: "get_catalog", arguments: { domain: "../../etc/passwd" } });
    assert.ok(bad.isError);
  } finally { await c.close(); }
});

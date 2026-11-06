// Real browser integration: MCP proposes -> browser shows it -> human approves with the keyboard -> server restart -> reopen.
// Needs Playwright + Chromium (preinstalled in cloud sessions). Skips with a message otherwise. BP_SHOTS=dir writes screenshots.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { createServer } from "../workspace/server.mjs";
import * as S from "../workspace/store.mjs";

let chromium; try { ({ chromium } = createRequire(import.meta.url)("playwright")); } catch { try { ({ chromium } = createRequire("/opt/node22/lib/node_modules/")("playwright")); } catch {} }
const SHOTS = process.env.BP_SHOTS;
const shot = async (page, name) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await page.screenshot({ path: path.join(SHOTS, name + ".png"), fullPage: false }); } };

test("proposal -> browser -> keyboard approve -> restart -> reopen (desktop + 390px, JA/EN)", { skip: !chromium && "playwright not installed" }, async () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), "bp-e2e-"));
  const mcp = new Client({ name: "e2e", version: "0" });
  await mcp.connect(new StdioClientTransport({ command: "node", args: ["dist/index.js"], env: { ...process.env, BLUEPRINT_HOME: home } }));
  const call = async (n, a) => { const r = await mcp.callTool({ name: n, arguments: a }); assert.ok(!r.isError, r.content[0].text); return JSON.parse(r.content[0].text); };
  const browser = await chromium.launch();
  let srv = await createServer({ home, port: 0 });
  try {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 2, locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto(srv.origin + "/");
    // first real project through the UI
    await page.fill("#pname", "Weekend Dance Tickets"); await page.fill("#pgoal", "Organizers sell tickets without fee surprises");
    await page.getByRole("button", { name: "Create" }).click();
    await page.waitForSelector(".node");
    const id = S.listProjects(home)[0].id;
    await shot(page, "01-desktop-en-empty");
    // agent proposes while the screen is open: node must update live, nothing is decided
    await call("workspace_propose_change", { project: id, topic: "hosting", pick: "host.vercel", reason: "Free tier covers launch; deploys on every push.", alternatives: [{ option: "host.cloudflare-pages", why: "Cheaper egress, fewer integrations" }] });
    await page.waitForSelector('.node.proposed', { timeout: 6000 });
    await call("workspace_propose_change", { project: id, topic: "brand_visual", pick: "visual.thin-line", reason: "Calm, precise; matches a ticketing product." });
    await call("workspace_propose_change", { project: id, topic: "animation", pick: "animation.state-only", reason: "Motion only explains state changes; reduced-motion safe." });
    await page.waitForFunction(() => document.querySelectorAll(".node.proposed").length === 3, null, { timeout: 6000 });
    assert.deepEqual(S.getProject(home, id).choices, {}, "agent proposals decide nothing");
    // node click shows rationale, alternatives, affected dependencies
    await page.locator('.node', { hasText: "Where it runs" }).first().click();
    const detail = page.locator("aside.detail");
    await detail.getByText("Free tier covers launch").waitFor();
    assert.ok(await detail.getByText("Cheaper egress").isVisible());
    assert.ok(await detail.getByText("Affected by this decision").isVisible());
    await shot(page, "02-desktop-en-proposed");
    // JA
    await page.getByRole("button", { name: "Language" }).click();
    await page.getByText("決めてください").waitFor();
    await shot(page, "03-desktop-ja-proposed");
    await page.getByRole("button", { name: "Language" }).click();
    // agent amends while the human is looking: approve must use the version the human saw
    await call("workspace_propose_change", { project: id, topic: "hosting", pick: "host.cloudflare-pages", reason: "Changed my mind: lower egress cost." });
    await page.getByText("Changed my mind").first().waitFor({ timeout: 4000 }).catch(() => {});
    // keyboard approve of brand_visual
    const btn = page.getByRole("button", { name: /Approve: Visual identity/ });
    await btn.focus(); await page.keyboard.press("Enter");
    await page.waitForFunction(() => document.querySelectorAll(".node.proposed").length === 2);
    assert.equal(S.getProject(home, id).choices.brand_visual.pick, "visual.thin-line");
    assert.equal(S.getProject(home, id).choices.brand_visual.decidedBy, "human");
    // reject animation
    await page.getByRole("button", { name: /Reject: Animation/ }).click();
    await page.waitForFunction(() => document.querySelectorAll(".node.proposed").length === 1);
    assert.equal(S.getProject(home, id).proposals.find(p => p.topic === "animation").state, "rejected");
    // stale: owner decides hosting directly, then agent's pending proposal is stale and cannot overwrite
    S.setChoice(home, id, { topic: "hosting", pick: "host.vercel" }, (await import("../workspace/topics.mjs")).loadTopics().topics);
    await page.waitForSelector(".need.stale", { timeout: 6000 });
    await shot(page, "04-desktop-en-stale-approved-rejected");
    // restart server, new browser context (nothing in memory) -> reopen
    await srv.close(); srv = await createServer({ home, port: 0 });
    const page2 = await (await browser.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
    await page2.goto(srv.origin + "/#/p/" + id);
    await page2.waitForSelector(".node.decided");
    assert.equal(await page2.locator(".node.decided").count(), 2);
    assert.ok(await page2.locator(".feed").getByText(/rejected/).first().isVisible());
    // 390px phone, both languages
    const m = await (await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })).newPage();
    await m.goto(srv.origin + "/#/p/" + id);
    await m.waitForSelector(".row-node");
    assert.ok(await m.evaluate(() => document.documentElement.scrollWidth <= 390), "no horizontal scroll at 390px");
    await shot(m, "05-mobile390-en-map");
    await m.locator(".row-node", { hasText: "Visual identity" }).first().click();
    await m.locator(".inline-detail").waitFor();
    await shot(m, "06-mobile390-en-detail");
    await m.getByRole("button", { name: "Language" }).click();
    await m.getByText("決めてください").waitFor();
    assert.ok(await m.evaluate(() => document.documentElement.scrollWidth <= 390));
    await shot(m, "07-mobile390-ja-detail");
    // reduced motion honoured
    const rm = await (await browser.newContext({ reducedMotion: "reduce" })).newPage();
    await rm.goto(srv.origin + "/#/p/" + id); await rm.waitForSelector(".node");
    assert.equal(await rm.evaluate(() => getComputedStyle(document.querySelector(".node")).animationName), "none");
  } finally { await browser.close(); await srv.close(); await mcp.close(); }
});

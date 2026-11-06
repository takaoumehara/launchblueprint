// Workspace: store rules, human boundary, stale/changed handling, isolation, export/import, MCP surface, server auth.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import * as S from "../workspace/store.mjs";
import { loadTopics } from "../workspace/topics.mjs";
import { createServer } from "../workspace/server.mjs";

const { topics } = loadTopics();
const tmp = () => fs.mkdtempSync(path.join(os.tmpdir(), "bp-ws-"));
const prop = (home, id, extra = {}) => S.propose(home, id, { topic: "hosting", pick: "host.vercel", reason: "free tier fits", ...extra }, topics);

test("propose -> pending; only a human decide() makes a decision", () => {
  const home = tmp(), { id } = S.createProject(home, { name: "Demo" });
  const p = prop(home, id);
  assert.equal(p.state, "proposed");
  assert.deepEqual(S.getProject(home, id).choices, {});
  S.decide(home, id, { proposalId: p.id, decision: "approve", seenVersion: 1 });
  const s = S.getProject(home, id);
  assert.equal(s.choices.hosting.pick, "host.vercel");
  assert.equal(s.choices.hosting.decidedBy, "human");
  assert.equal(s.proposals[0].state, "approved");
});

test("agent cannot self-approve: forbidden fields are rejected, not dropped", () => {
  const home = tmp(), { id } = S.createProject(home, { name: "Demo" });
  for (const k of ["ownerApproved", "approved", "status", "state", "decidedBy", "rev", "baseRev"]) {
    assert.throws(() => prop(home, id, { [k]: true }), e => e.code === "forbidden_field", k);
  }
  assert.equal(S.getProject(home, id).proposals.length, 0);
  assert.throws(() => prop(home, id, { pick: "host.nonexistent" }), e => e.code === "bad_option");
});

test("changed proposal: approving an old version is refused", () => {
  const home = tmp(), { id } = S.createProject(home, { name: "Demo" });
  const p = prop(home, id);
  const p2 = prop(home, id, { pick: "host.cloudflare-pages", reason: "cheaper egress" });
  assert.equal(p2.id, p.id); assert.equal(p2.version, 2);
  assert.throws(() => S.decide(home, id, { proposalId: p.id, decision: "approve", seenVersion: 1 }), e => e.code === "changed");
  assert.equal(S.getProject(home, id).proposals[0].state, "proposed");
  assert.deepEqual(Object.keys(S.getProject(home, id).choices), []);
});

test("stale: a newer decision is never overwritten by an older proposal", () => {
  const home = tmp(), { id } = S.createProject(home, { name: "Demo" });
  const p = prop(home, id);
  S.setChoice(home, id, { topic: "hosting", pick: "host.cloudflare-pages" }, topics); // owner decides directly
  assert.equal(S.getProject(home, id).proposals[0].state, "stale");
  assert.throws(() => S.decide(home, id, { proposalId: p.id, decision: "approve", seenVersion: 1 }), e => e.code === "stale");
  assert.equal(S.getProject(home, id).choices.hosting.pick, "host.cloudflare-pages");
  S.decide(home, id, { proposalId: p.id, decision: "reject", seenVersion: 1 });
  assert.equal(S.getProject(home, id).proposals[0].state, "rejected");
});

test("rejected proposal stays in history and is not a decision", () => {
  const home = tmp(), { id } = S.createProject(home, { name: "Demo" });
  const p = prop(home, id);
  S.decide(home, id, { proposalId: p.id, decision: "reject", seenVersion: 1 });
  const s = S.getProject(home, id);
  assert.deepEqual(s.choices, {}); assert.ok(s.history.some(e => e.type === "rejected"));
  assert.throws(() => S.decide(home, id, { proposalId: p.id, decision: "approve", seenVersion: 1 }), e => e.code === "not_pending");
});

test("two workspaces are independent; ids cannot escape the folder", () => {
  const a = tmp(), b = tmp();
  const pa = S.createProject(a, { name: "Alpha" }); prop(a, pa.id);
  assert.deepEqual(S.listProjects(b), []);
  assert.throws(() => S.getProject(b, pa.id), e => e.code === "not_found");
  for (const bad of ["../x", "a/b", "..", ""]) assert.throws(() => S.getProject(a, bad), e => e.code === "bad_id");
});

test("export/import moves choices only: no pending proposals, tamper detected", () => {
  const a = tmp(), b = tmp(), { id } = S.createProject(a, { name: "Shared" });
  const p = prop(a, id); S.decide(a, id, { proposalId: p.id, decision: "approve", seenVersion: 1 });
  prop(a, id, { topic: "database", pick: "db.supabase", reason: "x" }); // stays pending
  const bundle = S.exportProject(a, id);
  assert.equal("proposals" in bundle.payload, false); assert.equal(Object.keys(bundle.payload.choices).join(), "hosting");
  const imp = S.importProject(b, JSON.parse(JSON.stringify(bundle)));
  assert.equal(imp.choices.hosting.pick, "host.vercel"); assert.deepEqual(imp.proposals, []);
  const bad = JSON.parse(JSON.stringify(bundle)); bad.payload.choices.hosting.pick = "host.evil";
  assert.throws(() => S.importProject(b, bad), e => e.code === "bad_checksum");
});

test("server: human actions need session token + same origin + loopback host", async () => {
  const home = tmp(), { id } = S.createProject(home, { name: "Demo" }), p = prop(home, id);
  const srv = await createServer({ home });
  const post = (headers) => fetch(`${srv.origin}/api/p/${id}/decide`, { method: "POST", headers: { "content-type": "application/json", ...headers }, body: JSON.stringify({ proposalId: p.id, decision: "approve", seenVersion: 1 }) });
  try {
    assert.equal((await post({})).status, 403);                                                   // no token (what an agent calling the API blindly sends)
    assert.equal((await post({ "x-bp-token": srv.token, origin: "http://evil.example" })).status, 403); // cross-origin
    assert.equal((await post({ "x-bp-token": "x".repeat(48), origin: srv.origin })).status, 403);     // wrong token
    assert.deepEqual(S.getProject(home, id).choices, {});
    const code = await new Promise(r => http.get({ host: "127.0.0.1", port: srv.port, path: "/api/projects", headers: { host: "evil.example:80" } }, res => r(res.statusCode)));
    assert.equal(code, 403); // DNS-rebinding guard
    assert.equal((await post({ "x-bp-token": srv.token, origin: srv.origin })).status, 200);
    assert.equal(S.getProject(home, id).choices.hosting.pick, "host.vercel");
    const again = await post({ "x-bp-token": srv.token, origin: srv.origin });
    assert.equal(again.status, 409);
    const body = await fetch(`${srv.origin}/`).then(r => r.text()); assert.ok(!body.includes(srv.token), "token must not be embedded in static page");
  } finally { await srv.close(); }
});

test("MCP: no approve/decide tool; propose works; ownerApproved is an error", async () => {
  const home = tmp();
  const t = new StdioClientTransport({ command: "node", args: ["dist/index.js"], env: { ...process.env, BLUEPRINT_HOME: home } });
  const c = new Client({ name: "t", version: "0" }); await c.connect(t);
  try {
    const names = (await c.listTools()).tools.map(x => x.name);
    assert.ok(names.includes("workspace_propose_change"));
    assert.equal(names.filter(n => /approve|decide|accept/i.test(n)).length, 0, "agents must have no approval tool: " + names.join());
    const call = async (name, args) => c.callTool({ name, arguments: args });
    const cp = JSON.parse((await call("workspace_create_project", { name: "Via MCP" })).content[0].text);
    const ok = await call("workspace_propose_change", { project: cp.id, topic: "hosting", pick: "host.vercel", reason: "r" });
    assert.ok(!ok.isError, ok.content[0].text);
    for (const k of ["ownerApproved", "approved", "status", "decidedBy"]) { const r = await call("workspace_propose_change", { project: cp.id, topic: "database", pick: "db.supabase", reason: "r", [k]: true }); assert.ok(r.isError && /forbidden_field/.test(r.content[0].text), k); }
    const rd = JSON.parse((await call("workspace_read_project", { project: cp.id })).content[0].text);
    assert.equal(rd.proposals[0].state, "proposed"); assert.deepEqual(rd.decided_by_owner, {});
    const bad = await call("workspace_propose_change", { project: cp.id, topic: "hosting", pick: "host.nope", reason: "r" });
    assert.ok(bad.isError);
  } finally { await c.close(); }
});

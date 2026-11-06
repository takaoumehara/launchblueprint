// Clean-room: copy the repo (no node_modules, no mcp/dist) to a temp dir, run only the documented commands.
// Needs network for `npm ci`. Skip with BP_SKIP_CLEANROOM=1.
import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync, spawnSync } from "node:child_process";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const repo = path.resolve(import.meta.dirname, "../..");
test("fresh checkout -> bootstrap -> MCP over the documented command -> project saved and reopened", { skip: process.env.BP_SKIP_CLEANROOM && "skipped", timeout: 300000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bp-clean-")), home = fs.mkdtempSync(path.join(os.tmpdir(), "bp-home-"));
  const files = execFileSync("git", ["ls-files", "-co", "--exclude-standard"], { cwd: repo, encoding: "utf8" }).split("\n").filter(f => f && fs.existsSync(path.join(repo, f)));
  for (const f of files) { fs.mkdirSync(path.dirname(path.join(dir, f)), { recursive: true }); fs.copyFileSync(path.join(repo, f), path.join(dir, f)); }
  assert.ok(!fs.existsSync(path.join(dir, "mcp/dist")) && !fs.existsSync(path.join(dir, "mcp/node_modules")), "copy must be clean");
  assert.ok(!files.some(f => /(^|\/)\.env(\.(?!example$)[^/]*)?$|\.secrets/.test(f)), "no env/secret files in the tree");
  const cli = path.join(dir, "bin/blueprint.mjs"), env = { ...process.env, BLUEPRINT_HOME: home };
  // MCP launched the way the docs say; first run must bootstrap itself (stdout stays clean protocol).
  const c = new Client({ name: "clean", version: "0" });
  await c.connect(new StdioClientTransport({ command: "node", args: [cli, "mcp"], env }));
  const call = async (name, args) => { const r = await c.callTool({ name, arguments: args }); assert.ok(!r.isError, r.content[0].text); return JSON.parse(r.content[0].text); };
  const p = await call("workspace_create_project", { name: "First Project", goal: "g" });
  await call("workspace_propose_change", { project: p.id, topic: "hosting", pick: "host.vercel", reason: "r" });
  await c.close();
  assert.ok(fs.existsSync(path.join(dir, "mcp/dist/index.js")), "dist built by bootstrap");
  // reopen with the CLI in a new process
  const out = spawnSync("node", [cli, "projects"], { env, encoding: "utf8" });
  assert.match(out.stdout, /first-project/);
  const ex = path.join(home, "x.json"); execFileSync("node", [cli, "export", p.id, ex], { env });
  const home2 = fs.mkdtempSync(path.join(os.tmpdir(), "bp-home2-"));
  assert.match(execFileSync("node", [cli, "import", ex], { env: { ...process.env, BLUEPRINT_HOME: home2 }, encoding: "utf8" }), /imported as first-project-imported/);
  assert.equal(spawnSync("node", [cli, "projects"], { env: { ...process.env, BLUEPRINT_HOME: home2 }, encoding: "utf8" }).stdout.includes("First Project\n"), false);
  // deleting dist must self-heal
  fs.rmSync(path.join(dir, "mcp/dist"), { recursive: true });
  assert.equal(spawnSync("node", [cli, "doctor"], { env, encoding: "utf8" }).stdout.includes("FAIL"), true);
  execFileSync("node", [cli, "bootstrap"], { env, stdio: "ignore" });
  assert.ok(fs.existsSync(path.join(dir, "mcp/dist/index.js")));
});

// Shared helper: start dist/index.js over stdio and return a client plus call helpers.
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

export async function connect(env = {}) {
  const transport = new StdioClientTransport({ command: "node", args: ["dist/index.js"], env: { ...process.env, ...env } });
  const c = new Client({ name: "test", version: "0" });
  await c.connect(transport);
  const callRaw = (name, args = {}) => c.callTool({ name, arguments: args });
  const call = async (name, args = {}) => {
    const r = await callRaw(name, args);
    assert.ok(!r.isError, name + ": " + r.content?.[0]?.text);
    return r.content[0].text;
  };
  return { c, call, callRaw };
}

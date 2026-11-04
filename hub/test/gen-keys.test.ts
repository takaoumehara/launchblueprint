// scripts/gen-keys.mjs: random per-bot keys to a mode-600 JSON, SHA-256 hashes to SQL, prints only the SQL path, never a key.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { memoryD1 } from "./_d1.ts";

const SCRIPT = path.resolve(import.meta.dirname, "../scripts/gen-keys.mjs");

test("gen-keys writes keys (600) and hashes (SQL), prints only the SQL path, refuses to overwrite", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "bph-keys-"));
  const out = path.join(dir, "keys.json"), sql = path.join(dir, "insert.sql");
  const stdout = execFileSync("node", [SCRIPT, "--out", out, "--sql", sql, "bot-a", "owner:reviewer"], { encoding: "utf8" });
  assert.equal(stdout.trim(), sql, "stdout is exactly the SQL path");
  assert.equal(fs.statSync(out).mode & 0o777, 0o600);
  const keys = JSON.parse(fs.readFileSync(out, "utf8")).keys;
  assert.deepEqual(keys.map((k: any) => [k.bot_name, k.role]), [["bot-a", "bot"], ["owner", "reviewer"]]);
  const text = fs.readFileSync(sql, "utf8");
  for (const k of keys) {
    assert.match(k.key, /^bph_[A-Za-z0-9_-]{43}$/);
    assert.ok(!stdout.includes(k.key) && !text.includes(k.key), "key never printed or written to SQL");
    assert.ok(text.includes(crypto.createHash("sha256").update(k.key).digest("hex")));
  }
  assert.notEqual(keys[0].key, keys[1].key);
  // the SQL applies cleanly to the schema
  const db = memoryD1(); db.raw.exec(text);
  assert.equal((db.raw.prepare("SELECT COUNT(*) AS n FROM api_keys WHERE revoked = 0").get() as any).n, 2);
  // never overwrite an existing key file; bad names refused
  assert.notEqual(spawnSync("node", [SCRIPT, "--out", out, "--sql", path.join(dir, "b.sql"), "bot-c"]).status, 0);
  assert.notEqual(spawnSync("node", [SCRIPT, "--out", path.join(dir, "x.json"), "Bad Name"]).status, 0);
  assert.notEqual(spawnSync("node", [SCRIPT, "bot-a"]).status, 0, "--out is required");
  fs.rmSync(dir, { recursive: true });
});

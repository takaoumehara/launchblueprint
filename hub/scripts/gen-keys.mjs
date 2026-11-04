#!/usr/bin/env node
// Generate per-bot API keys for the Blueprint hub. (c) CREATIVITY IS EVERYWHERE, LLC
//   node scripts/gen-keys.mjs --out <keys.json> [--sql <insert.sql>] <bot-name>[:reviewer] ...
// Writes the plaintext keys to --out (JSON, mode 600, refuses to overwrite) and the SHA-256 hashes as SQL inserts.
// Prints ONLY the SQL file path. Keys are never printed. Apply the SQL with:
//   npx wrangler d1 execute blueprint-hub --local --file <insert.sql>      (local)
//   npx wrangler d1 execute blueprint-hub --remote --file <insert.sql>     (done separately, by the owner)
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const opt = name => { const i = args.indexOf(name); if (i < 0) return null; const v = args[i + 1]; args.splice(i, 2); return v ?? null; };
const out = opt("--out"), sqlArg = opt("--sql");
const usage = "usage: node scripts/gen-keys.mjs --out <keys.json> [--sql <insert.sql>] <bot-name>[:reviewer] ...";
if (!out || !args.length) { console.error(usage); process.exit(2); }

const bots = args.map(a => { const [name, role = "bot"] = a.split(":"); return { name, role }; });
for (const b of bots) {
  if (!/^[a-z0-9][a-z0-9_-]{1,47}$/.test(b.name)) { console.error(`bad bot name "${b.name}" (lowercase letters, digits, - and _, 2-48 chars)`); process.exit(2); }
  if (!["bot", "reviewer"].includes(b.role)) { console.error(`bad role "${b.role}" for ${b.name} (bot | reviewer)`); process.exit(2); }
}
if (new Set(bots.map(b => b.name)).size !== bots.length) { console.error("duplicate bot name"); process.exit(2); }

const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
const rows = bots.map(b => {
  const key = "bph_" + crypto.randomBytes(32).toString("base64url");
  return { ...b, key, hash: crypto.createHash("sha256").update(key).digest("hex") };
});
const sqlPath = path.resolve(sqlArg ?? path.join(path.dirname(path.resolve(out)), `api-keys-${now.replace(/[:]/g, "")}.sql`));
const q = s => `'${String(s).replace(/'/g, "''")}'`;
const sql = [`-- Blueprint hub api_keys, generated ${now}. Hashes only (SHA-256 hex); the keys are in a separate file.`,
  ...rows.map(r => `INSERT INTO api_keys (key_hash, bot_name, role, created_at, revoked) VALUES (${q(r.hash)}, ${q(r.name)}, ${q(r.role)}, ${q(now)}, 0);`), ""].join("\n");

// plaintext keys: create new (flag wx), owner read/write only
fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, JSON.stringify({ generated: now, note: "Plaintext API keys. Store in the company vault; never commit.",
  keys: rows.map(r => ({ bot_name: r.name, role: r.role, key: r.key })) }, null, 2) + "\n", { mode: 0o600, flag: "wx" });
fs.chmodSync(out, 0o600);
fs.mkdirSync(path.dirname(sqlPath), { recursive: true });
fs.writeFileSync(sqlPath, sql, { mode: 0o644, flag: "wx" });
console.log(sqlPath);

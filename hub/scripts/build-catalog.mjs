#!/usr/bin/env node
// Build step: bundle skill/blueprint into src/generated/catalog.json so the Worker never parses YAML at request time.
// files: every text file the tools serve, as-is. docs: the parsed YAML of catalog/*.yaml and elements/*.yaml.
// commit: the Git commit the catalog was read at (shown in every list_domains response).
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import yaml from "js-yaml";

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ROOT = process.env.BLUEPRINT_DIR ?? path.resolve(HERE, "../../skill/blueprint");
const OUT = path.resolve(HERE, "../src/generated/catalog.json");

const list = (dir, re) => fs.existsSync(path.join(ROOT, dir)) ? fs.readdirSync(path.join(ROOT, dir)).filter(f => re.test(f)).sort().map(f => `${dir}/${f}`) : [];
const rel = [...list("catalog", /\.(yaml|md)$/), ...list("elements", /\.(yaml|md)$/), ...list("reference", /\.md$/), ...list("templates", /\.(md|yaml)$/), "SKILL.md"];

const files = {}, docs = {};
for (const f of rel) {
  const t = fs.readFileSync(path.join(ROOT, f), "utf8");
  files[f] = t;
  if (f.endsWith(".yaml") && (f.startsWith("catalog/") || f.startsWith("elements/"))) {
    let doc = null; try { doc = yaml.load(t); } catch (e) { console.warn(`skip unparsable ${f}: ${e.message}`); }
    docs[f.slice(0, -5)] = doc;
  }
}
let commit = process.env.BLUEPRINT_COMMIT ?? "unknown";
try { commit = execFileSync("git", ["rev-parse", "--short=12", "HEAD"], { cwd: ROOT, encoding: "utf8" }).trim(); } catch { /* not a git checkout */ }
const bundle = { schema: "blueprint.catalog-bundle/v1", publisher: "CREATIVITY IS EVERYWHERE, LLC", commit, generated: new Date().toISOString(), files, docs };
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(bundle));
console.log(`catalog bundle: ${Object.keys(files).length} files, ${Object.keys(docs).length} parsed, commit ${commit} -> ${path.relative(process.cwd(), OUT)}`);

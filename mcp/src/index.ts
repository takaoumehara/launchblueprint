#!/usr/bin/env node
// Blueprint MCP server — (c) CREATIVITY IS EVERYWHERE, LLC
// Read-only over ../skill/blueprint. Writes only to the inbox: mcp/inbox/learnings.jsonl, mcp/inbox/catalog-refresh.jsonl
// and mcp/inbox/project-maps/<slug>.yaml (agent drafts a person reviews before they move into skill/blueprint/project-maps/).
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as core from "../../shared/decide-core.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.BLUEPRINT_DIR ?? path.resolve(HERE, "../../skill/blueprint");
const INBOX = process.env.BLUEPRINT_INBOX ?? path.resolve(HERE, "../inbox/learnings.jsonl");
const CAT = path.join(ROOT, "catalog");
const REF = path.join(ROOT, "reference");
const ELE = path.join(ROOT, "elements");
const TPL = path.join(ROOT, "templates");
const PREF = path.join(ROOT, "preferences");
const MAPS = path.join(ROOT, "project-maps");                       // reviewed, committed project maps (read-only here)
const DRAFTS = process.env.BLUEPRINT_PROJECTS ?? path.resolve(HERE, "../inbox/project-maps");   // agent-written drafts
const REFRESH = process.env.BLUEPRINT_REFRESH_INBOX ?? path.resolve(HERE, "../inbox/catalog-refresh.jsonl");
const APP_URL = (process.env.BLUEPRINT_APP_URL ?? "").replace(/\/+$/, "");   // optional absolute base for review links

const safe = (s: string) => s.replace(/[^a-zA-Z0-9_\-.]/g, "");
const text = (t: string) => ({ content: [{ type: "text" as const, text: t }] });
const json = (o: unknown) => text(JSON.stringify(o, null, 2));
const err = (t: string) => ({ ...text(t), isError: true });
const listYaml = (dir: string) => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".yaml")).map(f => f.slice(0, -5)).sort() : [];

const domains = () => listYaml(CAT);
const layers = () => listYaml(ELE);
const references = () => fs.readdirSync(REF).filter(f => f.endsWith(".md")).map(f => f.slice(0, -3)).sort();
const templates = () => [...fs.readdirSync(TPL).filter(f => /\.(md|yaml)$/.test(f)), "project-map.template.yaml"].sort();
const fileOf = (d: string) => domains().includes(d) ? path.join(CAT, d + ".yaml") : layers().includes(d) ? path.join(ELE, d + ".yaml") : null;
// Parsed YAML cached by file mtime, so get_item / search do not re-parse 36 files per call.
const cache = new Map<string, { mtime: number; doc: any }>();
const loadFile = (d: string): any => {
  const f = fileOf(d); if (!f) return null;
  let mtime: number; try { mtime = fs.statSync(f).mtimeMs; } catch { return null; }
  const hit = cache.get(f); if (hit && hit.mtime === mtime) return hit.doc;
  let doc: any = null; try { doc = yaml.load(fs.readFileSync(f, "utf8")); } catch { doc = null; }
  cache.set(f, { mtime, doc }); return doc;
};
const loadYaml = (d: string): any => yaml.load(fs.readFileSync(path.join(CAT, d + ".yaml"), "utf8"));
// First comment line of a file, minus the "# Blueprint ... — " prefix: a one-line title for list_domains.
const titleOf = (d: string) => {
  const f = fileOf(d); if (!f) return null;
  const first = fs.readFileSync(f, "utf8").split("\n").find(l => l.startsWith("#"));
  if (first) return first.replace(/^#\s*/, "").replace(/\s*[—–-]\s*CREATIVITY IS EVERYWHERE, LLC.*$/, "").trim();
  const doc = loadFile(d);
  return doc?.title ?? doc?.name_ja ?? (doc?.schema ? `${d} (${doc.schema})` : d);
};

// Normalize every item shape (entries / lessons / rules / providers / axes / tiers / groups / checklist / elements / tactics / comparisons) to one flat list.
function items(d: string): any[] {
  const doc = loadFile(d); if (!doc) return [];
  const out: any[] = [];
  const visit = (node: any, kind: string) => {
    if (!Array.isArray(node)) return;
    for (const it of node) if (it && typeof it === "object" && (it.id || it.topic)) {
      // macro stages share ids with two fine stages (operate, exit); keep them distinct as lifecycle.macro.<id>
      const id = kind === "macro_stages" ? `${d}.macro.${it.id}` : it.id ?? `${d}.${it.topic}`;
      const pb = it.pricing_bands;
      out.push({ domain: d, kind, id: String(id).includes(".") ? id : `${d}.${id}`,
        name: it.name_ja ?? it.label_ja ?? it.name ?? null, name_en: it.label_en ?? it.name_en ?? undefined,
        summary: it.what ?? it.principle_ja ?? it.principle ?? it.question_ja ?? it.item ?? it.rule ?? it.text ?? it.free_tier ?? (Array.isArray(it.must) ? it.must.join("、") : null) ?? (Array.isArray(it.metrics) ? it.metrics.join("、") : null) ?? null,
        best_for: it.best_for ?? null, avoid: it.avoid_when ?? it.anti_pattern ?? null, why: it.why ?? null,
        check: it.check ?? it.acceptance ?? null,
        cost: pb ? (pb.free ?? Object.values(pb)[0] ?? null) : (it.cost ?? null),
        stage: it.stage ?? it.macro ?? undefined, lane: it.lane ?? undefined, kind_of_decision: it.kind ?? undefined,
        known_surprises: it.known_surprises ?? undefined, revisit_triggers: it.revisit_triggers ?? undefined,
        depends_on: it.depends_on ?? undefined, options: it.options ?? undefined, ai_pick: it.ai_pick ?? undefined,
        verified: it.source?.verified ?? it.verified ?? null, checked: it.source?.checked ?? it.checked ?? it.last_checked ?? it.date ?? null,
        url: it.source?.url ?? it.url ?? null });
    }
  };
  for (const [k, v] of Object.entries(doc ?? {})) visit(v, k);
  if (doc?.auth?.providers) visit(doc.auth.providers, "providers");
  return out;
}
const allItems = () => [...domains(), ...layers()].flatMap(items);
const findItem = (id: string) => allItems().find(i => i.id === id) ?? null;
const rawItem = (id: string): any => {
  for (const d of [...domains(), ...layers()]) {
    const doc = loadFile(d); if (!doc) continue;
    const lists: any[][] = Object.values(doc).filter(Array.isArray) as any[][];
    if (doc?.auth?.providers) lists.push(doc.auth.providers);
    for (const l of lists) for (const it of l) if (it && typeof it === "object") {
      const iid = it.id ?? (it.topic ? `${d}.${it.topic}` : null);
      if (iid && (String(iid).includes(".") ? iid : `${d}.${iid}`) === id) return it;
    }
  }
  return null;
};

// ---- tactics (decisions) and project map ----
const tacticsDoc = (): any => loadFile("tactics") ?? { tactics: [], lanes: [], stages: [] };
const comparisons = (): any[] => loadFile("stack_comparisons")?.comparisons ?? [];
type Profile = { audience?: string; platform?: string; money?: string; country?: string };
function aiPick(t: any, profile: Profile) {
  if (t.kind !== "choose") return null;
  for (const w of t.pick_when ?? []) if (Object.entries(w.if ?? {}).every(([k, v]) => (profile as any)[k] === v)) return { id: w.pick, reason: w.reason_ja, from_profile: true };
  return t.ai_pick ? { id: t.ai_pick, reason: t.ai_reason_ja, from_profile: false } : null;
}
function draftMap(opts: { name?: string; goal?: string; profile: Profile; decided?: Record<string, string | string[]> }) {
  const { tactics, stages, lanes } = tacticsDoc();
  const decided = opts.decided ?? {};
  const isDone = (topic: string) => topic in decided;
  const choices = tactics.map((t: any) => {
    const ai = aiPick(t, opts.profile);
    const dec = decided[t.topic];
    const pick = t.kind === "choose" ? (typeof dec === "string" ? dec : "") : "";
    const checked = t.kind === "checklist" ? (Array.isArray(dec) ? dec : dec === "all" ? t.options : []) : undefined;
    const chosen = pick || ai?.id;
    const rej = t.kind === "choose" ? t.options.filter((o: string) => o !== chosen).map((o: string) => ({ option: o, why: findItem(o)?.avoid ?? "" })) : [];
    return { element: t.element, topic: t.topic, stage: t.stage, lane: t.lane, label_ja: t.label_ja, status: isDone(t.topic) ? "decided" : "open",
      options: t.options, ai_pick: ai?.id ?? "", reason: ai?.reason ?? "", rejected: rej,
      decided_by: isDone(t.topic) ? (pick && pick !== ai?.id ? "human" : "ai") : "", pick,
      ...(checked ? { checked } : {}), depends_on: t.depends_on, last_checked: t.last_checked,
      comparison: comparisons().some(c => c.topic === t.topic) ? `get_comparison("${t.topic}")` : null };
  });
  const order = Object.fromEntries((stages ?? []).map((s: any, i: number) => [s.id, i]));
  const next = tactics.filter((t: any) => !isDone(t.topic) && t.depends_on.every((d: string) => isDone(d)))
    .sort((a: any, b: any) => (order[a.stage] ?? 99) - (order[b.stage] ?? 99))
    .map((t: any) => ({ topic: t.topic, stage: t.stage, label_ja: t.label_ja, label_en: t.label_en ?? null, question_ja: t.question_ja, kind: t.kind, ai_pick: aiPick(t, opts.profile)?.id ?? null }));
  const blocked = tactics.filter((t: any) => !isDone(t.topic) && !t.depends_on.every((d: string) => isDone(d)))
    .map((t: any) => ({ topic: t.topic, waiting_for: t.depends_on.filter((d: string) => !isDone(d)) }));
  const progress = (stages ?? []).map((s: any) => { const ts = tactics.filter((t: any) => t.stage === s.id);
    return { stage: s.id, label: s.label, ja: s.ja, decided: ts.filter((t: any) => isDone(t.topic)).length, total: ts.length }; });
  const project_map = { domain: "project_map", name: opts.name ?? "", goal: opts.goal ?? "", profile: opts.profile,
    elements: (loadFile("elements")?.elements ?? []).map((e: any) => e.id), choices };
  return { project_map, next_steps: next, blocked, progress, lanes, yaml: yaml.dump(project_map, { lineWidth: 120 }) };
}

const LIFECYCLE = ["idea", "launch", "operate", "scale", "exit"] as const;
const server = new McpServer({ name: "blueprint", version: "0.2.0" }, { instructions: [
  "Blueprint: a map of every decision a product needs from idea to exit, with a catalog of options (free tiers, limits, lock-in, sources).",
  "Typical agent flow: 1) list_profiles and get_project_map (or update_project_map to create one) to learn the project's preference profile; 2) for each decision call decide(topic, project) — it lists the whole realistic field, scores every option under the active profile with evidence, and returns the pick, why it won, why each alternative lost and linkage reasons; 3) record the result with update_project_map (status ai_selected — the agent may proceed; a person reviews later on the map via the returned #/p/<slug> link); 4) record facts found in a real repo as status observed with evidence, and missing evidence as status gap; 5) propose_learning / propose_catalog_refresh for anything learned.",
  "Never mark a decision as decided without the owner: decided requires owner_confirmed:true. Changing the preference profile re-scores every ai_selected record. Treat verified:false or missing checked dates as unverified; say so instead of asserting prices.",
  "Text is mostly Japanese; ids are stable English keys (e.g. db.supabase, tactics topic `payments`).",
].join("\n") });

server.tool("list_domains", "List everything readable: catalog domains (with title and item count), elements-layer files, reference docs and templates.", {}, async () => json({
  domains: domains(), layers: layers(), references: references(), templates: templates(),
  details: Object.fromEntries([...domains(), ...layers()].map(d => [d, { title: titleOf(d), items: items(d).length }])),
  how_to: "get_catalog(domain) for raw YAML, get_catalog(domain, format='items') for a flat list, get_item(id) for one entry, get_reference(name), get_template(name).",
}));

server.tool("get_catalog", "Return one catalog domain or elements-layer file (elements / tactics / stack_comparisons / glossary / project-map.template). format: yaml (default, as-is) or items (flat normalized list: id, name, summary, best_for, avoid, why, check, cost, verified, checked, url).",
  { domain: z.string(), format: z.enum(["yaml", "items"]).optional() }, async ({ domain, format = "yaml" }) => {
  const d = safe(domain).replace(/\.yaml$/, "");
  const f = fileOf(d);
  if (!f) return err(`Unknown domain "${domain}". Available: ${[...domains(), ...layers()].join(", ")}`);
  if (format === "items") { const it = items(d); return json({ domain: d, title: titleOf(d), count: it.length, items: it }); }
  return text(fs.readFileSync(f, "utf8"));
});

server.tool("get_item", "Return one catalog entry by id (e.g. db.supabase, pay.stripe-checkout, ui_ux.primary-action-color, rules.R-004): normalized fields plus the raw YAML object.",
  { id: z.string().min(1) }, async ({ id }) => {
  const it = findItem(id);
  if (!it) return err(`Unknown id "${id}". Use search(query) or get_catalog(domain, format='items').`);
  return json({ ...it, raw: rawItem(id) });
});

server.tool("get_reference", "Return a reference markdown document (12-categories, gtm-ops, exit-appdist, ui-ux, design-resources, dry-run-sample, walkthrough-non-engineer ...).", { name: z.string() }, async ({ name }) => {
  const n = safe(name).replace(/\.md$/, "");
  if (!references().includes(n)) return err(`Unknown reference "${name}". Available: ${references().join(", ")}`);
  return text(fs.readFileSync(path.join(REF, n + ".md"), "utf8"));
});

server.tool("get_template", "Return a template to copy: project.axes.yaml (project file), brand-context.md, or project-map.template.yaml (the shape draft_project_map produces).", { name: z.string() }, async ({ name }) => {
  const n = safe(name);
  const p = n === "project-map.template.yaml" || n === "project-map.template" ? path.join(ELE, "project-map.template.yaml") : path.join(TPL, n);
  if (!templates().includes(path.basename(p))) return err(`Unknown template "${name}". Available: ${templates().join(", ")}`);
  return text(fs.readFileSync(p, "utf8"));
});

server.tool("get_skill", "Return the Blueprint SKILL.md (the procedure an AI follows: intake questions, research, 12 categories, compare, write the project file, review).", {}, async () =>
  text(fs.readFileSync(path.join(ROOT, "SKILL.md"), "utf8")));

server.tool("list_topics", "List the decisions (tactics): topic, stage (idea/launch/operate/scale/exit), lane, kind (choose one / checklist), options, ai_pick, depends_on, whether a stack comparison exists. Optional stage filter.",
  { stage: z.enum(LIFECYCLE).optional() }, async ({ stage }) => {
  const { tactics, stages, lanes } = tacticsDoc();
  const cmp = new Set(comparisons().map(c => c.topic));
  const list = tactics.filter((t: any) => !stage || t.stage === stage).map((t: any) => ({
    topic: t.topic, stage: t.stage, lane: t.lane, element: t.element, label_ja: t.label_ja, question_ja: t.question_ja, label_en: t.label_en ?? null, question_en: t.question_en ?? null, kind: t.kind,
    options: t.options, ai_pick: t.ai_pick ?? null, ai_reason_ja: t.ai_reason_ja ?? null, pick_when: t.pick_when ?? [],
    depends_on: t.depends_on, has_comparison: cmp.has(t.topic), last_checked: t.last_checked }));
  return json({ count: list.length, stages, lanes, topics: list });
});

server.tool("get_comparison", "Return the stack comparison (rule R-030) for a decision topic: similar services with free tiers, one vendor vs combining several, when a paid plan is worth it, pick + reason + rejected.",
  { topic: z.string().min(1) }, async ({ topic }) => {
  const c = comparisons().find(x => x.topic === topic);
  if (!c) return err(`No comparison for "${topic}". Available: ${comparisons().map(x => x.topic).join(", ")}`);
  const names = Object.fromEntries(c.services.map((s: any) => [s.id, findItem(s.id)?.name ?? s.name ?? s.id]));
  return json({ ...c, service_names: names, unverified: c.services.filter((s: any) => !s.verified).map((s: any) => s.id) });
});

const profileSchema = z.object({
  audience: z.enum(["self", "public", "business"]).optional(),
  platform: z.enum(["web", "app", "both"]).optional(),
  money: z.enum(["free", "paid", "marketplace"]).optional(),
  country: z.enum(["us", "jp", "global"]).optional(),
});
server.tool("draft_project_map", "Build a project map (project-map.template.yaml shape) from the owner's 4 intake answers. Applies pick_when rules to set ai_pick per decision, lists next_steps (decisions whose dependencies are decided), blocked ones, and progress per stage. Pass `decided` {topic: optionId | [checkedIds] | 'all'} to advance; it never decides on its own.",
  { name: z.string().optional(), goal: z.string().optional(), profile: profileSchema,
    decided: z.record(z.union([z.string(), z.array(z.string())])).optional() },
  async ({ name, goal, profile, decided }) => {
    const { tactics } = tacticsDoc();
    const known = new Set(tactics.map((t: any) => t.topic));
    const bad = Object.keys(decided ?? {}).filter(k => !known.has(k));
    if (bad.length) return err(`Unknown topic(s) in decided: ${bad.join(", ")}. Use list_topics.`);
    for (const [k, v] of Object.entries(decided ?? {})) {
      const t = tactics.find((x: any) => x.topic === k);
      if (t.kind === "choose" && (typeof v !== "string" || !t.options.includes(v))) return err(`decided.${k} must be one of: ${t.options.join(", ")}`);
      if (t.kind === "checklist" && !(v === "all" || (Array.isArray(v) && v.every(x => t.options.includes(x))))) return err(`decided.${k} must be 'all' or a subset of: ${t.options.join(", ")}`);
    }
    return json(draftMap({ name, goal, profile, decided }));
  });

server.tool("search", "Case-insensitive search across catalog YAML, elements, reference docs, templates and SKILL.md. Returns matching lines and matching normalized items.",
  { query: z.string().min(1), limit: z.number().int().positive().max(500).optional() },
  async ({ query, limit = 50 }) => {
    const q = query.toLowerCase();
    const files = [...domains().map(d => `catalog/${d}.yaml`), ...layers().map(l => `elements/${l}.yaml`), ...references().map(r => `reference/${r}.md`),
      ...templates().filter(t => t !== "project-map.template.yaml").map(t => `templates/${t}`), "SKILL.md"];
    const hits: { file: string; line: number; text: string }[] = [];
    for (const f of files) {
      fs.readFileSync(path.join(ROOT, f), "utf8").split("\n").forEach((l, i) => {
        if (hits.length < limit && l.toLowerCase().includes(q)) hits.push({ file: f, line: i + 1, text: l.trim() });
      });
    }
    const matched = allItems().filter(i => JSON.stringify(i).toLowerCase().includes(q)).slice(0, limit);
    return json({ query, count: hits.length, hits, item_count: matched.length, items: matched });
  });

function walkEntries(node: any, domain: string, out: any[]) {
  if (Array.isArray(node)) { node.forEach(n => walkEntries(n, domain, out)); return; }
  if (node && typeof node === "object") {
    if (node.source && typeof node.source === "object" && !Array.isArray(node.source) && ("checked" in node.source || "verified" in node.source)) {
      out.push({ domain, id: node.id ?? null, name: node.name ?? null, checked: node.source.checked ?? null,
        verified: node.source.verified ?? null, url: node.source.url ?? null });
    } else if (Array.isArray(node.source) && node.id) {
      // several sources on one entry (cross_border reps): stale if any of them is
      const srcs = node.source.filter((s: any) => s && typeof s === "object");
      if (srcs.length) out.push({ domain, id: node.id, name: node.name ?? null, checked: srcs.map((s: any) => s.checked ?? "").sort()[0] || null,
        verified: srcs.every((s: any) => s.verified === true), url: srcs[0].url ?? null });
    } else if (node.id && ("verified" in node) && (node.fee || node.price || node.cost || node.pricing_bands)) {
      // inline-sourced priced entries (cross_border fee tables) carry url/checked/verified on the entry itself
      out.push({ domain, id: node.id, name: node.name ?? node.what ?? null, checked: node.checked ?? null, verified: node.verified ?? null, url: node.url ?? null });
    }
    for (const v of Object.values(node)) if (v && typeof v === "object") walkEntries(v, domain, out);
  }
}

// Price/limit fields an agent re-reads on the official page during a catalog refresh.
const REFRESH_FIELDS = ["pricing_bands", "limits", "free_tier", "paid_entry", "cost", "fee", "price", "lock_in"];
const usedBy = (id: string) => (tacticsDoc().tactics ?? []).filter((t: any) => t.options.includes(id)).map((t: any) => t.topic)
  .concat(comparisons().filter(c => (c.services ?? []).some((s: any) => s.id === id)).map(c => `comparison:${c.topic}`));
function currentText(id: string): Record<string, unknown> {
  const raw = rawItem(id) ?? comparisons().flatMap(c => c.services ?? []).find((s: any) => s.id === id);
  if (!raw) return {};
  return Object.fromEntries(REFRESH_FIELDS.filter(k => raw[k] != null).map(k => [k, raw[k]]));
}
server.tool("stale_items", "Catalog items (and stack-comparison services) whose checked date is older than `days`, missing, or verified:false. Use before quoting any price or limit. refresh_plan=true adds, per item, the official URL, the current price/limit text to compare and the decisions that use it (sorted: used on the map first) — the input for a catalog refresh run (see propose_catalog_refresh). used_only limits to items that appear in a decision or comparison; domain filters one catalog area.",
  { days: z.number().int().nonnegative(), refresh_plan: z.boolean().optional(), used_only: z.boolean().optional(), domain: z.string().optional(), limit: z.number().int().positive().max(1000).optional() },
  async ({ days, refresh_plan = false, used_only = false, domain, limit }) => {
    const all: any[] = [];
    for (const d of domains()) { try { walkEntries(loadYaml(d), d, all); } catch { /* skip unparsable */ } }
    for (const c of comparisons()) for (const s of c.services ?? []) all.push({ domain: `stack_comparisons.${c.topic}`, id: s.id, name: s.name ?? null, checked: s.checked ?? null, verified: s.verified ?? null, url: s.url ?? null });
    const cutoff = Date.now() - days * 86400000;
    let stale = all.filter(e => {
      if (e.verified === false || !e.checked) return true;
      const t = Date.parse(String(e.checked));
      return isNaN(t) || t < cutoff;
    }).map(e => ({ ...e, reason: !e.checked ? "unchecked" : e.verified === false ? "unverified" : "older_than_days" }));
    if (domain) stale = stale.filter(e => e.domain === safe(domain) || e.domain === `stack_comparisons.${safe(domain)}`);
    if (used_only || refresh_plan) stale = stale.map(e => ({ ...e, used_by: e.id ? [...new Set(usedBy(e.id))] : [] }));
    if (used_only) stale = stale.filter(e => e.used_by.length);
    if (refresh_plan) stale = stale.map(e => ({ ...e, current: e.id ? currentText(e.id) : {},
      next: e.url ? `open ${e.url}, compare with current, then propose_catalog_refresh(id, url, checked, verified, changes)` : "no official URL: find the vendor's official pricing/limits page first; until then it stays verified:false" }))
      .sort((a, b) => b.used_by.length - a.used_by.length || String(a.checked ?? "").localeCompare(String(b.checked ?? "")));
    const out = limit ? stale.slice(0, limit) : stale;
    return json({ days, total_with_source: all.length, stale_count: stale.length, ...(limit ? { returned: out.length } : {}), stale: out,
      ...(refresh_plan ? { how_to: "Recurring refresh: run stale_items(days: 90, refresh_plan: true, used_only: true) on a schedule; for each item read the official URL only (never a blog or memory); call propose_catalog_refresh with the text exactly as the page shows it and verified:true only if you read it there today. A person merges the inbox into the catalog. See skill/blueprint/reference/catalog-refresh.md." } : {}) });
  });

// Lifecycle stages: five macro stages (idea → launch → operate → scale → exit) and the fine stages under them,
// each with known_surprises (what always happens that the plan did not expect) and revisit_triggers (when to re-run Blueprint).
server.tool("lifecycle_stages", "Lifecycle macro stages (idea/launch/operate/scale/exit) and fine stages with known_surprises and revisit_triggers. Optional stage: a macro or fine stage id. include_items=true adds the coverage items of that stage.",
  { stage: z.string().optional(), include_items: z.boolean().optional() }, async ({ stage, include_items = false }) => {
    const lc: any = loadYaml("lifecycle");
    const macros: any[] = lc?.macro_stages ?? []; const fines: any[] = lc?.stages ?? [];
    const sid = stage ? safe(stage) : null;
    let m = macros, f = fines;
    if (sid) {
      const macro = macros.find(x => x.id === sid);
      if (macro) { m = [macro]; f = fines.filter(x => x.macro === sid); }
      else { f = fines.filter(x => x.id === sid); if (!f.length) return err(`Unknown stage "${stage}". Macro: ${macros.map(x => x.id).join(", ")}; fine: ${fines.map(x => x.id).join(", ")}`); m = macros.filter(x => x.id === f[0].macro); }
    }
    const fineIds = new Set(f.map(x => x.id));
    const items = include_items ? (lc?.items ?? []).filter((i: any) => fineIds.has(i.stage)) : undefined;
    return json({ schema: lc?.schema ?? null, updated: lc?.updated ?? null, macro_stages: m, stages: f, ...(items ? { item_count: items.length, items } : {}) });
  });

const PHASES: Record<string, RegExp> = {
  requirements: /copy|announce|hint|onboard|user|flow|feature/i,
  design: /colou?r|border|tint|type|layout|spacing|icon|visual|selected|primary/i,
  qa: /.*/,
};
server.tool("ui_ux_checklist", "UI/UX yes/no checklist. Optional phase: requirements | design | qa (qa = all). Optional lifecycle: idea | launch | operate | scale | exit filters the phase gates; gates are always returned.",
  { phase: z.enum(["requirements", "design", "qa"]).optional(), lifecycle: z.enum(LIFECYCLE).optional() }, async ({ phase, lifecycle }) => {
    const doc = loadYaml("ui_ux");
    const rules: any[] = doc?.rules ?? [];
    const pick = rules.filter(r => !phase || (r.phase ? [].concat(r.phase).includes(phase as never)
      : PHASES[phase].test(`${r.id} ${r.principle}`)));
    const gates: any[] = (doc?.phase_gate_checks ?? []).filter((g: any) => !lifecycle || g.lifecycle === lifecycle);
    return json({ phase: phase ?? "all", count: pick.length,
      checklist: pick.map(r => ({ id: `ui_ux.${r.id}`, rule: r.id, category: r.category ?? null, check: r.check, why: r.why })),
      lifecycle: lifecycle ?? "all", gates: gates.map(g => ({ id: g.id, lifecycle: g.lifecycle ?? null, phase: g.phase, check: g.check, why: g.why, rules: g.rules ?? [] })) });
  });

server.tool("propose_learning", "Propose a new learning. Appends to the inbox only; the master is never edited. kind: rule (default) | component_map_update (a review fix to feed back into the component map).",
  { text: z.string().min(5).max(2000), category: z.string().min(1).max(64),
    kind: z.enum(["rule", "component_map_update"]).optional() }, async ({ text: t, category, kind }) => {
    const rec = { ts: new Date().toISOString(), kind: kind ?? "rule", category, text: t, status: "proposed" };
    fs.mkdirSync(path.dirname(INBOX), { recursive: true });
    fs.appendFileSync(INBOX, JSON.stringify(rec) + "\n");
    return json({ saved: true, inbox: "mcp/inbox/learnings.jsonl", record: rec });
  });

// ---------- preference profiles, decide, project maps ----------
type Dict = Record<string, any>;
const readYamlDir = (dir: string): { file: string; doc: any }[] => !fs.existsSync(dir) ? [] : fs.readdirSync(dir).filter(f => f.endsWith(".yaml")).sort()
  .map(f => { try { return { file: path.join(dir, f), doc: yaml.load(fs.readFileSync(path.join(dir, f), "utf8")) }; } catch { return { file: path.join(dir, f), doc: null }; } });
function profiles(): any[] {
  const extra = process.env.BLUEPRINT_PREFERENCES_EXTRA;
  const raw = [...readYamlDir(PREF), ...(extra ? readYamlDir(extra) : [])].filter(x => x.doc?.schema === "blueprint.preference-profile/v1")
    .map(x => ({ ...x.doc, source_file: path.relative(path.resolve(ROOT, "../.."), x.file) }));
  return core.resolveProfiles(raw);
}
const defaultProfile = () => profiles().find(p => p.default) ?? profiles()[0];
const criteriaDoc = (): any => { try { return yaml.load(fs.readFileSync(path.join(PREF, "criteria.yaml"), "utf8")); } catch { return { criteria: [] }; } };
function index(): any {
  const docs: Dict = {}; for (const d of domains()) docs[d] = loadFile(d);
  const td = tacticsDoc();
  return core.makeIndex({ tactics: td.tactics ?? [], comparisons: comparisons(), facts: core.collectFacts(docs), categories: loadFile("categories")?.categories ?? [], lanes: td.lanes, stages: td.stages });
}
const today = () => new Date().toISOString().slice(0, 10);
const linkOf = (slug: string) => ({ link: `#/p/${slug}`, url: APP_URL ? `${APP_URL}/#/p/${slug}` : null, arch: `#/p/${slug}/arch` });
function findMap(slug: string): { where: "draft" | "committed"; file: string; map: any } | null {
  for (const [where, dir] of [["draft", DRAFTS], ["committed", MAPS]] as const) {
    const f = path.join(dir, slug + ".yaml");
    if (fs.existsSync(f)) { try { return { where, file: f, map: yaml.load(fs.readFileSync(f, "utf8")) }; } catch { return null; } }
  }
  return null;
}
function allMaps() {
  const seen = new Set<string>(); const out: any[] = [];
  for (const [where, dir] of [["draft", DRAFTS], ["committed", MAPS]] as const) for (const { file, doc } of readYamlDir(dir)) {
    const slug = path.basename(file, ".yaml"); if (!doc || seen.has(slug)) continue; seen.add(slug);
    out.push({ slug, where, doc });
  }
  return out;
}
const counts = (m: any) => Object.fromEntries(core.STATUSES.map(s => [s, (m.choices ?? []).filter((c: any) => (c.status ?? "open") === s).length]));
const profileById = (id?: string) => { const ps = profiles(); return id ? ps.find(p => p.id === id) : undefined; };
const unknownProfile = (id: string) => err(`Unknown preference profile "${id}". Available: ${profiles().map(p => p.id).join(", ")}`);

server.tool("list_profiles", "Preference profiles a project can use (default lean-fast-full, all-in, plus org-defined ones from skill/blueprint/preferences/ or BLUEPRINT_PREFERENCES_EXTRA), with their weights over the 7 criteria and how each criterion is scored.",
  {}, async () => json({ default: defaultProfile()?.id ?? null,
    profiles: profiles().map(p => ({ id: p.id, scope: p.scope, default: !!p.default, extends: p.extends ?? null, label_en: p.label_en, label_ja: p.label_ja, summary_en: p.summary_en, summary_ja: p.summary_ja, weights: p.weights, tie_break: p.tie_break, errors: core.validateProfile(p), source_file: p.source_file })),
    criteria: criteriaDoc().criteria }));

const evidenceSchema = z.array(z.object({ option: z.string(), criterion: z.enum(core.CRITERIA as [string, ...string[]]), score: z.number().min(0).max(1), note: z.string().min(3).max(400), url: z.string().url().optional() })).max(100);
const extraSchema = z.array(z.object({ id: z.string().regex(/^[a-z0-9_.-]{2,64}$/), name: z.string().max(80), url: z.string().url().optional(), note: z.string().max(300).optional() })).max(10);
server.tool("decide", "Score the realistic field of options for one decision under a preference profile and return a decision record: every option considered (tactic options, stack-comparison services, catalog providers) with per-criterion scores and the evidence behind each, the pick, why it won, a short reason for each rejected option, linkage reasons (same vendor, shared free tier, catalog pairings, conflicts) and visible gaps. Never decides for the owner: status is ai_selected (or gap when evidence is too thin). Pass project=<slug> to use that map's profile, intake answers and chosen parts; or pass profile / intake / chosen yourself. evidence lets you add scored facts (kept unverified); extra_options adds options the catalog lacks (scored as gaps until evidenced). also_under lists the pick under other profiles.",
  { topic: z.string().min(1), project: z.string().optional(), profile: z.string().optional(),
    intake: z.object({ audience: z.string().optional(), platform: z.string().optional(), money: z.string().optional(), country: z.string().optional() }).optional(),
    chosen: z.record(z.string()).optional(), evidence: evidenceSchema.optional(), extra_options: extraSchema.optional(), also_under: z.array(z.string()).max(10).optional() },
  async ({ topic, project, profile, intake, chosen, evidence = [], extra_options = [], also_under = [] }) => {
    const idx = index();
    if (!idx.T[topic]) return err(`Unknown topic "${topic}". Use list_topics.`);
    let map: any = null;
    if (project) { const f = findMap(safe(project)); if (!f) return err(`No project map "${project}". Use list_project_maps or update_project_map to create one.`); map = core.normalizeMap(f.map, idx); }
    const pid = profile ?? map?.preference_profile ?? defaultProfile()?.id;
    const prof = profileById(pid); if (!prof) return unknownProfile(String(pid));
    const parts = [...(map ? core.partsOf(map) : []), ...Object.entries(chosen ?? {}).map(([t, o]) => ({ topic: t, option: o, status: "given" }))];
    for (const e of evidence) if (!idx.F[e.option] && !extra_options.some(x => x.id === e.option)) return err(`evidence.option ${e.option} is neither in the catalog nor in extra_options`);
    const rec = core.decide({ topic, idx, profile: prof, intake: intake ?? map?.profile ?? {}, chosen: parts, evidence, extra_options, date: today() });
    const others = also_under.map(id => { const p = profileById(id); if (!p) return { profile: id, error: "unknown profile" };
      const r = core.decide({ topic, idx, profile: p, intake: intake ?? map?.profile ?? {}, chosen: parts, evidence, extra_options, date: today() }); return { profile: id, ai_pick: r.ai_pick, status: r.status }; });
    const table = (rec.considered ?? []).filter((r: any) => r.scores).map((r: any) => ({ rank: r.rank, option: r.option, total: r.total, ...Object.fromEntries(core.CRITERIA.map(c => [c, r.scores[c].basis === "gap" ? "gap" : r.scores[c].score])) }));
    return json({ record: rec, scoring_table: table, chosen_context: parts, ...(others.length ? { also_under: others } : {}),
      next: project ? `update_project_map({slug: "${safe(project)}", records: [{topic: "${topic}", status: "${rec.status}"}]}) records this; the owner reviews at #/p/${safe(project)}` : "pass project=<slug> to score against a project's parts, or record it with update_project_map" });
  });

server.tool("list_project_maps", "Project maps: reviewed ones committed under skill/blueprint/project-maps/ and agent drafts in the inbox (mcp/inbox/project-maps/, or BLUEPRINT_PROJECTS). Each with its review link #/p/<slug> and status counts.",
  {}, async () => json({ maps: allMaps().map(({ slug, where, doc }) => ({ slug, where, name: doc.name ?? "", preference_profile: doc.preference_profile ?? null, updated: doc.updated ?? null, counts: counts(doc), ...linkOf(slug) })),
    drafts_dir: path.relative(path.resolve(ROOT, "../.."), DRAFTS) }));

server.tool("get_project_map", "One project map by slug, normalized to every decision (all tactics, six lanes), with progress per stage and per 12-category, the derived architecture (frontend ↔ backend ↔ data ↔ auth ↔ payments ↔ third-party; implemented vs proposed) and the review link. format yaml returns the file as stored.",
  { slug: z.string().min(1), format: z.enum(["json", "yaml"]).optional() }, async ({ slug, format = "json" }) => {
    const f = findMap(safe(slug)); if (!f) return err(`No project map "${slug}". Available: ${allMaps().map(m => m.slug).join(", ") || "none"}`);
    if (format === "yaml") return text(fs.readFileSync(f.file, "utf8"));
    const idx = index(); const m = core.normalizeMap(f.map, idx);
    return json({ where: f.where, ...linkOf(safe(slug)), map: m, counts: counts(m), progress: core.progressOf(m, idx), architecture: core.deriveArchitecture(m, idx),
      gaps: m.choices.filter((c: any) => c.status === "gap" || (c.gap_notes ?? []).length || c.gap_note).map((c: any) => ({ topic: c.topic, status: c.status, gap_note: c.gap_note ?? null, gap_notes: c.gap_notes ?? [] })),
      drift: m.choices.filter((c: any) => c.profile_drift).map((c: any) => ({ topic: c.topic, pick: c.pick, ...c.profile_drift })) });
  });

server.tool("rescore_project_map", "Preview what changes if a project map moves to another preference profile: every ai_selected pick is re-scored; observed and decided picks are kept and flagged with profile_drift if the new profile would choose differently. Read-only; update_project_map(preference_profile) applies it.",
  { slug: z.string().min(1), profile: z.string().min(1) }, async ({ slug, profile }) => {
    const f = findMap(safe(slug)); if (!f) return err(`No project map "${slug}".`);
    const prof = profileById(profile); if (!prof) return unknownProfile(profile);
    const idx = index(); const { map, changes } = core.rescoreMap(f.map, idx, prof, { date: today() });
    return json({ slug: safe(slug), from: f.map.preference_profile ?? null, to: prof.id, changes, drift: map.choices.filter((c: any) => c.profile_drift).map((c: any) => ({ topic: c.topic, pick: c.pick, would_pick: c.profile_drift.would_pick })) });
  });

const recordSchema = z.object({
  topic: z.string().min(1), status: z.enum(core.STATUSES as [string, ...string[]]).optional(),
  pick: z.string().optional(), checked: z.array(z.string()).optional(), reason: z.string().max(1000).optional(),
  rejected: z.array(z.object({ option: z.string(), why: z.string().max(400) })).optional(),
  linkages: z.array(z.object({ kind: z.string(), with_topic: z.string().optional(), with_option: z.string().optional(), why: z.string().max(400) })).optional(),
  evidence: z.array(z.object({ kind: z.enum(["file", "url", "config", "dependency", "note"]), path: z.string().optional(), url: z.string().optional(), line: z.number().int().optional(), note: z.string().max(400) })).max(30).optional(),
  gap_note: z.string().max(600).optional(), decided_by: z.string().max(40).optional(), owner_confirmed: z.boolean().optional(), note: z.string().max(400).optional(),
  verified: z.boolean().optional(), source: z.string().max(80).optional(),
  observed_as: z.string().max(160).optional(),   // what the repo actually uses when it is not a catalog option
});
const componentSchema = z.object({ id: z.string().regex(/^[a-z0-9_-]{1,40}$/), role: z.enum(Object.keys(core.ARCH_ROLES) as [string, ...string[]]), name: z.string().max(80), topic: z.string().optional(), option: z.string().optional(),
  state: z.enum(["implemented", "proposed"]), evidence: recordSchema.shape.evidence });
const linkSchema = z.object({ from: z.string(), to: z.string(), label: z.string().max(80).optional(), state: z.enum(["implemented", "proposed"]), evidence: recordSchema.shape.evidence, note: z.string().max(200).optional() });
server.tool("update_project_map", "Create or update a project map and get a shareable review link (#/p/<slug>). Writes only the draft file mcp/inbox/project-maps/<slug>.yaml (a person reviews it and moves it to skill/blueprint/project-maps/ to publish); committed maps are copied to a draft first. Use it to: set the preference profile (re-scores every ai_selected record); record decide() results (status ai_selected; omit pick and the record is scored for you); record facts seen in a real repo (status observed + evidence); flag missing evidence (status gap + gap_note); defer (deferred + reason); or record a big owner decision (status decided + owner_confirmed:true + decided_by). decide_topics runs decide for open/gap/ai_selected topics ('all' for every one). Every change is appended to history.",
  { slug: z.string().regex(/^[a-z0-9][a-z0-9-]{0,47}$/), name: z.string().max(120).optional(), goal: z.string().max(400).optional(),
    intake: z.object({ audience: z.enum(["self", "public", "business"]).optional(), platform: z.enum(["web", "app", "both"]).optional(), money: z.enum(["free", "paid", "marketplace"]).optional(), country: z.enum(["us", "jp", "global"]).optional() }).optional(),
    preference_profile: z.string().optional(), records: z.array(recordSchema).max(100).optional(), decide_topics: z.array(z.string()).max(100).optional(),
    architecture: z.object({ components: z.array(componentSchema).max(40).optional(), links: z.array(linkSchema).max(80).optional() }).optional(),
    by: z.string().max(40).optional(), note: z.string().max(400).optional() },
  async ({ slug, name, goal, intake, preference_profile, records = [], decide_topics = [], architecture, by = "agent", note }) => {
    const idx = index();
    const found = findMap(slug);
    if (!found && !name) return err(`No project map "${slug}" yet: pass name (and ideally goal, intake, preference_profile) to create it.`);
    let m: any = core.normalizeMap(found?.map ?? { schema: "blueprint.project-map/v2", slug, name, goal: goal ?? "", profile: {}, preference_profile: defaultProfile()?.id, elements: (loadFile("elements")?.elements ?? []).map((e: any) => e.id), choices: [] }, idx);
    m.schema = "blueprint.project-map/v2"; m.slug = slug;
    const history: any[] = Array.isArray(m.history) ? m.history : [];
    const log = (h: Dict) => history.push({ date: today(), by, ...h, ...(note ? { note } : {}) });
    if (!found) log({ change: "created" });
    if (name !== undefined) m.name = name; if (goal !== undefined) m.goal = goal;
    if (intake) { m.profile = { ...(m.profile ?? {}), ...intake }; log({ change: "intake", value: m.profile }); }
    // 1) records: validate everything first, write nothing on any error
    const errors: string[] = [];
    for (const r of records) {
      errors.push(...core.validateRecord(r, idx));
      if (r.checked) { const t = idx.T[r.topic]; for (const x of r.checked) if (t && !t.options.includes(x)) errors.push(`${r.topic}: checked ${x} is not one of ${t.options.join(", ")}`); }
    }
    for (const t of decide_topics) if (t !== "all" && !idx.T[t]) errors.push(`decide_topics: unknown topic ${t}`);
    let prof = profileById(preference_profile ?? m.preference_profile ?? defaultProfile()?.id);
    if (!prof) errors.push(`unknown preference profile ${preference_profile ?? m.preference_profile}. Available: ${profiles().map(p => p.id).join(", ")}`);
    for (const c of architecture?.components ?? []) if (c.state === "implemented" && !(c.evidence ?? []).length) errors.push(`architecture.${c.id}: implemented needs evidence`);
    for (const l of architecture?.links ?? []) if (l.state === "implemented" && !(l.evidence ?? []).length) errors.push(`architecture link ${l.from}→${l.to}: implemented needs evidence`);
    if (errors.length) return err("Nothing written.\n" + errors.join("\n"));
    const at = (topic: string) => m.choices.find((c: any) => c.topic === topic);
    for (const r of records) {
      const c = at(r.topic); const before = { status: c.status, pick: c.pick, ai_pick: c.ai_pick };
      const { owner_confirmed, note: rnote, ...rest } = r;
      if (r.status === "ai_selected" && idx.T[r.topic].kind === "choose" && !r.pick) {
        const rec = core.decide({ topic: r.topic, idx, profile: prof, intake: m.profile ?? {}, chosen: core.partsOf(m), date: today() });
        Object.assign(c, rec, { ...(r.reason ? { agent_reason: r.reason } : {}), ...(r.evidence ? { evidence: r.evidence } : {}), ...(r.gap_note ? { gap_note: r.gap_note } : {}) });
      } else if (r.status === "ai_selected" && r.pick) {
        // an agent's own pick: keep its reason and rejected list, but score the field so alternatives are on record
        const rec = core.decide({ topic: r.topic, idx, profile: prof, intake: m.profile ?? {}, chosen: core.partsOf(m), date: today() });
        Object.assign(c, rec, rest, { ai_pick: r.pick, pick: "", decided_by: "ai", ...(rec.ai_pick !== r.pick ? { scored_pick: rec.ai_pick } : {}) });
      } else {
        Object.assign(c, rest, { date: today() });
        if (r.status === "decided") Object.assign(c, { owner_confirmed: true, confirmed_at: today(), profile: prof.id });
        if (r.status === "observed") Object.assign(c, { decided_by: "", source: r.source ?? "repo" });
        if (r.status === "observed" || r.status === "decided") delete c.profile_drift;
      }
      log({ change: "record", topic: r.topic, from: before, to: { status: c.status, pick: c.pick, ai_pick: c.ai_pick }, ...(rnote ? { note: rnote } : {}) });
    }
    // 2) profile change re-scores every ai_selected / open-with-pick record
    let changes: any[] = [];
    const profileChanged = !!found && !!preference_profile && preference_profile !== m.preference_profile;
    if (profileChanged || !found) {
      if (profileChanged) {
        const only = m.choices.filter((c: any) => c.status === "ai_selected" || c.status === "gap").map((c: any) => c.topic);
        const r = core.rescoreMap(m, idx, prof, { date: today(), only: [...only, ...m.choices.filter((c: any) => c.status === "observed" || c.status === "decided").map((c: any) => c.topic)] });
        m = r.map; changes = r.changes; log({ change: "preference_profile", from: found?.map?.preference_profile ?? null, to: prof.id, rescored: changes });
      }
      m.preference_profile = prof.id;
    }
    // 3) decide_topics
    const targets = decide_topics.includes("all") ? idx.tactics.map((t: any) => t.topic) : decide_topics;
    const decided_now: any[] = [];
    if (targets.length) {
      const r = core.rescoreMap(m, idx, prof, { date: today(), only: targets.filter((t: string) => ["open", "gap", "ai_selected"].includes(at(t)?.status)) });
      m = r.map; for (const t of targets) { const c = m.choices.find((x: any) => x.topic === t); decided_now.push({ topic: t, status: c.status, ai_pick: c.ai_pick || null }); }
      log({ change: "decide", topics: targets.length > 10 ? `${targets.length} topics` : targets, picks_changed: r.changes });
    }
    if (architecture) { m.architecture = { components: architecture.components ?? m.architecture?.components ?? [], links: architecture.links ?? m.architecture?.links ?? [] }; log({ change: "architecture" }); }
    m.updated = today(); m.review = linkOf(slug); m.history = history.slice(-200);
    const ordered = { domain: "project_map", schema: m.schema, slug, name: m.name ?? "", goal: m.goal ?? "", profile: m.profile ?? {}, preference_profile: m.preference_profile, updated: m.updated, review: m.review,
      elements: m.elements, architecture: m.architecture ?? { components: [], links: [] }, choices: m.choices, history: m.history };
    fs.mkdirSync(DRAFTS, { recursive: true });
    const file = path.join(DRAFTS, slug + ".yaml");
    fs.writeFileSync(file, `# Blueprint project map — draft written by update_project_map (MCP). Review, then move to skill/blueprint/project-maps/ to publish.\n# Statuses: open / observed (seen in the repo, with evidence) / ai_selected (agent pick, owner reviews later) / decided (owner said yes) / gap (evidence missing) / deferred.\n` + yaml.dump(ordered, { lineWidth: 140, noRefs: true }));
    return json({ saved: true, path: path.relative(path.resolve(ROOT, "../.."), file), copied_from: found?.where === "committed" ? path.relative(path.resolve(ROOT, "../.."), found.file) : null,
      ...linkOf(slug), preference_profile: m.preference_profile, counts: counts(ordered), rescored: changes, decided_now,
      review: `Open ${APP_URL ? APP_URL + "/" : ""}#/p/${slug} after the map is in the app (committed maps ship with the build; drafts can be imported on the projects screen).` });
  });

server.tool("propose_catalog_refresh", "Propose a price / limit / terms update for one catalog item after reading its official page. Appends to mcp/inbox/catalog-refresh.jsonl with a diff against the current catalog text; the master catalog is never edited here. verified:true is only allowed with the official url and a checked date (YYYY-MM-DD); anything read elsewhere or from memory must be verified:false.",
  { id: z.string().min(1), url: z.string().url().optional(), checked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), verified: z.boolean(),
    changes: z.array(z.object({ field: z.string().regex(/^[a-z_]+(\.[a-z0-9_]+)?$/), new_text: z.string().max(600) })).max(12), note: z.string().max(600).optional() },
  async ({ id, url, checked, verified, changes, note }) => {
    const known = findItem(id) || comparisons().some(c => (c.services ?? []).some((s: any) => s.id === id));
    if (!known) return err(`Unknown id "${id}". Use stale_items(refresh_plan: true) or search.`);
    if (verified && !url) return err("verified:true needs the official url you read it on.");
    if (Date.parse(checked) > Date.now() + 86400000) return err("checked is in the future.");
    const cur = currentText(id) as Dict;
    const get = (f: string) => { const [a, b] = f.split("."); const v = cur[a]; return b ? (v && typeof v === "object" ? (v as Dict)[b] ?? null : null) : v ?? null; };
    const diff = changes.map(c => ({ field: c.field, old: get(c.field), new: c.new_text, changed: JSON.stringify(get(c.field)) !== JSON.stringify(c.new_text) }));
    const rec = { ts: new Date().toISOString(), kind: "catalog_refresh", id, source: { url: url ?? null, checked, verified }, diff, note: note ?? "", status: "proposed" };
    fs.mkdirSync(path.dirname(REFRESH), { recursive: true });
    fs.appendFileSync(REFRESH, JSON.stringify(rec) + "\n");
    return json({ saved: true, inbox: path.relative(path.resolve(ROOT, "../.."), REFRESH), record: rec, unchanged: diff.filter(d => !d.changed).map(d => d.field) });
  });

await server.connect(new StdioServerTransport());

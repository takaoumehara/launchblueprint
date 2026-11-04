#!/usr/bin/env node
// Blueprint MCP server — (c) CREATIVITY IS EVERYWHERE, LLC
// Read-only over ../skill/blueprint; the only write is mcp/inbox/learnings.jsonl.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.BLUEPRINT_DIR ?? path.resolve(HERE, "../../skill/blueprint");
const INBOX = process.env.BLUEPRINT_INBOX ?? path.resolve(HERE, "../inbox/learnings.jsonl");
const CAT = path.join(ROOT, "catalog");
const REF = path.join(ROOT, "reference");
const ELE = path.join(ROOT, "elements");
const TPL = path.join(ROOT, "templates");
const safe = (s) => s.replace(/[^a-zA-Z0-9_\-.]/g, "");
const text = (t) => ({ content: [{ type: "text", text: t }] });
const json = (o) => text(JSON.stringify(o, null, 2));
const err = (t) => ({ ...text(t), isError: true });
const listYaml = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".yaml")).map(f => f.slice(0, -5)).sort() : [];
const domains = () => listYaml(CAT);
const layers = () => listYaml(ELE);
const references = () => fs.readdirSync(REF).filter(f => f.endsWith(".md")).map(f => f.slice(0, -3)).sort();
const templates = () => [...fs.readdirSync(TPL).filter(f => /\.(md|yaml)$/.test(f)), "project-map.template.yaml"].sort();
const fileOf = (d) => domains().includes(d) ? path.join(CAT, d + ".yaml") : layers().includes(d) ? path.join(ELE, d + ".yaml") : null;
// Parsed YAML cached by file mtime, so get_item / search do not re-parse 36 files per call.
const cache = new Map();
const loadFile = (d) => {
    const f = fileOf(d);
    if (!f)
        return null;
    let mtime;
    try {
        mtime = fs.statSync(f).mtimeMs;
    }
    catch {
        return null;
    }
    const hit = cache.get(f);
    if (hit && hit.mtime === mtime)
        return hit.doc;
    let doc = null;
    try {
        doc = yaml.load(fs.readFileSync(f, "utf8"));
    }
    catch {
        doc = null;
    }
    cache.set(f, { mtime, doc });
    return doc;
};
const loadYaml = (d) => yaml.load(fs.readFileSync(path.join(CAT, d + ".yaml"), "utf8"));
// First comment line of a file, minus the "# Blueprint ... — " prefix: a one-line title for list_domains.
const titleOf = (d) => {
    const f = fileOf(d);
    if (!f)
        return null;
    const first = fs.readFileSync(f, "utf8").split("\n").find(l => l.startsWith("#"));
    if (first)
        return first.replace(/^#\s*/, "").replace(/\s*[—–-]\s*CREATIVITY IS EVERYWHERE, LLC.*$/, "").trim();
    const doc = loadFile(d);
    return doc?.title ?? doc?.name_ja ?? (doc?.schema ? `${d} (${doc.schema})` : d);
};
// Normalize every item shape (entries / lessons / rules / providers / axes / tiers / groups / checklist / elements / tactics / comparisons) to one flat list.
function items(d) {
    const doc = loadFile(d);
    if (!doc)
        return [];
    const out = [];
    const visit = (node, kind) => {
        if (!Array.isArray(node))
            return;
        for (const it of node)
            if (it && typeof it === "object" && (it.id || it.topic)) {
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
    for (const [k, v] of Object.entries(doc ?? {}))
        visit(v, k);
    if (doc?.auth?.providers)
        visit(doc.auth.providers, "providers");
    return out;
}
const allItems = () => [...domains(), ...layers()].flatMap(items);
const findItem = (id) => allItems().find(i => i.id === id) ?? null;
const rawItem = (id) => {
    for (const d of [...domains(), ...layers()]) {
        const doc = loadFile(d);
        if (!doc)
            continue;
        const lists = Object.values(doc).filter(Array.isArray);
        if (doc?.auth?.providers)
            lists.push(doc.auth.providers);
        for (const l of lists)
            for (const it of l)
                if (it && typeof it === "object") {
                    const iid = it.id ?? (it.topic ? `${d}.${it.topic}` : null);
                    if (iid && (String(iid).includes(".") ? iid : `${d}.${iid}`) === id)
                        return it;
                }
    }
    return null;
};
// ---- tactics (decisions) and project map ----
const tacticsDoc = () => loadFile("tactics") ?? { tactics: [], lanes: [], stages: [] };
const comparisons = () => loadFile("stack_comparisons")?.comparisons ?? [];
function aiPick(t, profile) {
    if (t.kind !== "choose")
        return null;
    for (const w of t.pick_when ?? [])
        if (Object.entries(w.if ?? {}).every(([k, v]) => profile[k] === v))
            return { id: w.pick, reason: w.reason_ja, from_profile: true };
    return t.ai_pick ? { id: t.ai_pick, reason: t.ai_reason_ja, from_profile: false } : null;
}
function draftMap(opts) {
    const { tactics, stages, lanes } = tacticsDoc();
    const decided = opts.decided ?? {};
    const isDone = (topic) => topic in decided;
    const choices = tactics.map((t) => {
        const ai = aiPick(t, opts.profile);
        const dec = decided[t.topic];
        const pick = t.kind === "choose" ? (typeof dec === "string" ? dec : "") : "";
        const checked = t.kind === "checklist" ? (Array.isArray(dec) ? dec : dec === "all" ? t.options : []) : undefined;
        const chosen = pick || ai?.id;
        const rej = t.kind === "choose" ? t.options.filter((o) => o !== chosen).map((o) => ({ option: o, why: findItem(o)?.avoid ?? "" })) : [];
        return { element: t.element, topic: t.topic, stage: t.stage, lane: t.lane, label_ja: t.label_ja, status: isDone(t.topic) ? "decided" : "open",
            options: t.options, ai_pick: ai?.id ?? "", reason: ai?.reason ?? "", rejected: rej,
            decided_by: isDone(t.topic) ? (pick && pick !== ai?.id ? "human" : "ai") : "", pick,
            ...(checked ? { checked } : {}), depends_on: t.depends_on, last_checked: t.last_checked,
            comparison: comparisons().some(c => c.topic === t.topic) ? `get_comparison("${t.topic}")` : null };
    });
    const order = Object.fromEntries((stages ?? []).map((s, i) => [s.id, i]));
    const next = tactics.filter((t) => !isDone(t.topic) && t.depends_on.every((d) => isDone(d)))
        .sort((a, b) => (order[a.stage] ?? 99) - (order[b.stage] ?? 99))
        .map((t) => ({ topic: t.topic, stage: t.stage, label_ja: t.label_ja, label_en: t.label_en ?? null, question_ja: t.question_ja, kind: t.kind, ai_pick: aiPick(t, opts.profile)?.id ?? null }));
    const blocked = tactics.filter((t) => !isDone(t.topic) && !t.depends_on.every((d) => isDone(d)))
        .map((t) => ({ topic: t.topic, waiting_for: t.depends_on.filter((d) => !isDone(d)) }));
    const progress = (stages ?? []).map((s) => {
        const ts = tactics.filter((t) => t.stage === s.id);
        return { stage: s.id, label: s.label, ja: s.ja, decided: ts.filter((t) => isDone(t.topic)).length, total: ts.length };
    });
    const project_map = { domain: "project_map", name: opts.name ?? "", goal: opts.goal ?? "", profile: opts.profile,
        elements: (loadFile("elements")?.elements ?? []).map((e) => e.id), choices };
    return { project_map, next_steps: next, blocked, progress, lanes, yaml: yaml.dump(project_map, { lineWidth: 120 }) };
}
const LIFECYCLE = ["idea", "launch", "operate", "scale", "exit"];
const server = new McpServer({ name: "blueprint", version: "0.2.0" }, { instructions: [
        "Blueprint: a map of every decision a product needs from idea to exit, with a catalog of options (free tiers, limits, lock-in, sources).",
        "Typical agent flow: 1) list_topics to see the decisions and their order (depends_on); 2) draft_project_map with the owner's profile to get the first project map with AI picks and next_steps; 3) for each next step call get_comparison (tech choices) or get_item for each option, then ask the owner to decide; 4) call draft_project_map again with `decided` to advance; 5) propose_learning for anything learned.",
        "Never mark a decision as decided without the owner. Treat verified:false or missing checked dates as unverified; say so instead of asserting prices.",
        "Text is mostly Japanese; ids are stable English keys (e.g. db.supabase, tactics topic `payments`).",
    ].join("\n") });
server.tool("list_domains", "List everything readable: catalog domains (with title and item count), elements-layer files, reference docs and templates.", {}, async () => json({
    domains: domains(), layers: layers(), references: references(), templates: templates(),
    details: Object.fromEntries([...domains(), ...layers()].map(d => [d, { title: titleOf(d), items: items(d).length }])),
    how_to: "get_catalog(domain) for raw YAML, get_catalog(domain, format='items') for a flat list, get_item(id) for one entry, get_reference(name), get_template(name).",
}));
server.tool("get_catalog", "Return one catalog domain or elements-layer file (elements / tactics / stack_comparisons / glossary / project-map.template). format: yaml (default, as-is) or items (flat normalized list: id, name, summary, best_for, avoid, why, check, cost, verified, checked, url).", { domain: z.string(), format: z.enum(["yaml", "items"]).optional() }, async ({ domain, format = "yaml" }) => {
    const d = safe(domain).replace(/\.yaml$/, "");
    const f = fileOf(d);
    if (!f)
        return err(`Unknown domain "${domain}". Available: ${[...domains(), ...layers()].join(", ")}`);
    if (format === "items") {
        const it = items(d);
        return json({ domain: d, title: titleOf(d), count: it.length, items: it });
    }
    return text(fs.readFileSync(f, "utf8"));
});
server.tool("get_item", "Return one catalog entry by id (e.g. db.supabase, pay.stripe-checkout, ui_ux.primary-action-color, rules.R-004): normalized fields plus the raw YAML object.", { id: z.string().min(1) }, async ({ id }) => {
    const it = findItem(id);
    if (!it)
        return err(`Unknown id "${id}". Use search(query) or get_catalog(domain, format='items').`);
    return json({ ...it, raw: rawItem(id) });
});
server.tool("get_reference", "Return a reference markdown document (12-categories, gtm-ops, exit-appdist, ui-ux, design-resources, dry-run-sample, walkthrough-non-engineer ...).", { name: z.string() }, async ({ name }) => {
    const n = safe(name).replace(/\.md$/, "");
    if (!references().includes(n))
        return err(`Unknown reference "${name}". Available: ${references().join(", ")}`);
    return text(fs.readFileSync(path.join(REF, n + ".md"), "utf8"));
});
server.tool("get_template", "Return a template to copy: project.axes.yaml (project file), brand-context.md, or project-map.template.yaml (the shape draft_project_map produces).", { name: z.string() }, async ({ name }) => {
    const n = safe(name);
    const p = n === "project-map.template.yaml" || n === "project-map.template" ? path.join(ELE, "project-map.template.yaml") : path.join(TPL, n);
    if (!templates().includes(path.basename(p)))
        return err(`Unknown template "${name}". Available: ${templates().join(", ")}`);
    return text(fs.readFileSync(p, "utf8"));
});
server.tool("get_skill", "Return the Blueprint SKILL.md (the procedure an AI follows: intake questions, research, 12 categories, compare, write the project file, review).", {}, async () => text(fs.readFileSync(path.join(ROOT, "SKILL.md"), "utf8")));
server.tool("list_topics", "List the decisions (tactics): topic, stage (idea/launch/operate/scale/exit), lane, kind (choose one / checklist), options, ai_pick, depends_on, whether a stack comparison exists. Optional stage filter.", { stage: z.enum(LIFECYCLE).optional() }, async ({ stage }) => {
    const { tactics, stages, lanes } = tacticsDoc();
    const cmp = new Set(comparisons().map(c => c.topic));
    const list = tactics.filter((t) => !stage || t.stage === stage).map((t) => ({
        topic: t.topic, stage: t.stage, lane: t.lane, element: t.element, label_ja: t.label_ja, question_ja: t.question_ja, label_en: t.label_en ?? null, question_en: t.question_en ?? null, kind: t.kind,
        options: t.options, ai_pick: t.ai_pick ?? null, ai_reason_ja: t.ai_reason_ja ?? null, pick_when: t.pick_when ?? [],
        depends_on: t.depends_on, has_comparison: cmp.has(t.topic), last_checked: t.last_checked
    }));
    return json({ count: list.length, stages, lanes, topics: list });
});
server.tool("get_comparison", "Return the stack comparison (rule R-030) for a decision topic: similar services with free tiers, one vendor vs combining several, when a paid plan is worth it, pick + reason + rejected.", { topic: z.string().min(1) }, async ({ topic }) => {
    const c = comparisons().find(x => x.topic === topic);
    if (!c)
        return err(`No comparison for "${topic}". Available: ${comparisons().map(x => x.topic).join(", ")}`);
    const names = Object.fromEntries(c.services.map((s) => [s.id, findItem(s.id)?.name ?? s.name ?? s.id]));
    return json({ ...c, service_names: names, unverified: c.services.filter((s) => !s.verified).map((s) => s.id) });
});
const profileSchema = z.object({
    audience: z.enum(["self", "public", "business"]).optional(),
    platform: z.enum(["web", "app", "both"]).optional(),
    money: z.enum(["free", "paid", "marketplace"]).optional(),
    country: z.enum(["us", "jp", "global"]).optional(),
});
server.tool("draft_project_map", "Build a project map (project-map.template.yaml shape) from the owner's 4 intake answers. Applies pick_when rules to set ai_pick per decision, lists next_steps (decisions whose dependencies are decided), blocked ones, and progress per stage. Pass `decided` {topic: optionId | [checkedIds] | 'all'} to advance; it never decides on its own.", { name: z.string().optional(), goal: z.string().optional(), profile: profileSchema,
    decided: z.record(z.union([z.string(), z.array(z.string())])).optional() }, async ({ name, goal, profile, decided }) => {
    const { tactics } = tacticsDoc();
    const known = new Set(tactics.map((t) => t.topic));
    const bad = Object.keys(decided ?? {}).filter(k => !known.has(k));
    if (bad.length)
        return err(`Unknown topic(s) in decided: ${bad.join(", ")}. Use list_topics.`);
    for (const [k, v] of Object.entries(decided ?? {})) {
        const t = tactics.find((x) => x.topic === k);
        if (t.kind === "choose" && (typeof v !== "string" || !t.options.includes(v)))
            return err(`decided.${k} must be one of: ${t.options.join(", ")}`);
        if (t.kind === "checklist" && !(v === "all" || (Array.isArray(v) && v.every(x => t.options.includes(x)))))
            return err(`decided.${k} must be 'all' or a subset of: ${t.options.join(", ")}`);
    }
    return json(draftMap({ name, goal, profile, decided }));
});
server.tool("search", "Case-insensitive search across catalog YAML, elements, reference docs, templates and SKILL.md. Returns matching lines and matching normalized items.", { query: z.string().min(1), limit: z.number().int().positive().max(500).optional() }, async ({ query, limit = 50 }) => {
    const q = query.toLowerCase();
    const files = [...domains().map(d => `catalog/${d}.yaml`), ...layers().map(l => `elements/${l}.yaml`), ...references().map(r => `reference/${r}.md`),
        ...templates().filter(t => t !== "project-map.template.yaml").map(t => `templates/${t}`), "SKILL.md"];
    const hits = [];
    for (const f of files) {
        fs.readFileSync(path.join(ROOT, f), "utf8").split("\n").forEach((l, i) => {
            if (hits.length < limit && l.toLowerCase().includes(q))
                hits.push({ file: f, line: i + 1, text: l.trim() });
        });
    }
    const matched = allItems().filter(i => JSON.stringify(i).toLowerCase().includes(q)).slice(0, limit);
    return json({ query, count: hits.length, hits, item_count: matched.length, items: matched });
});
function walkEntries(node, domain, out) {
    if (Array.isArray(node)) {
        node.forEach(n => walkEntries(n, domain, out));
        return;
    }
    if (node && typeof node === "object") {
        if (node.source && typeof node.source === "object" && !Array.isArray(node.source) && ("checked" in node.source || "verified" in node.source)) {
            out.push({ domain, id: node.id ?? null, name: node.name ?? null, checked: node.source.checked ?? null,
                verified: node.source.verified ?? null, url: node.source.url ?? null });
        }
        else if (Array.isArray(node.source) && node.id) {
            // several sources on one entry (cross_border reps): stale if any of them is
            const srcs = node.source.filter((s) => s && typeof s === "object");
            if (srcs.length)
                out.push({ domain, id: node.id, name: node.name ?? null, checked: srcs.map((s) => s.checked ?? "").sort()[0] || null,
                    verified: srcs.every((s) => s.verified === true), url: srcs[0].url ?? null });
        }
        else if (node.id && ("verified" in node) && (node.fee || node.price || node.cost || node.pricing_bands)) {
            // inline-sourced priced entries (cross_border fee tables) carry url/checked/verified on the entry itself
            out.push({ domain, id: node.id, name: node.name ?? node.what ?? null, checked: node.checked ?? null, verified: node.verified ?? null, url: node.url ?? null });
        }
        for (const v of Object.values(node))
            if (v && typeof v === "object")
                walkEntries(v, domain, out);
    }
}
server.tool("stale_items", "Catalog items (and stack-comparison services) whose checked date is older than `days`, missing, or verified:false. Use before quoting any price or limit.", { days: z.number().int().nonnegative() }, async ({ days }) => {
    const all = [];
    for (const d of domains()) {
        try {
            walkEntries(loadYaml(d), d, all);
        }
        catch { /* skip unparsable */ }
    }
    for (const c of comparisons())
        for (const s of c.services ?? [])
            all.push({ domain: `stack_comparisons.${c.topic}`, id: s.id, name: s.name ?? null, checked: s.checked ?? null, verified: s.verified ?? null, url: s.url ?? null });
    const cutoff = Date.now() - days * 86400000;
    const stale = all.filter(e => {
        if (e.verified === false || !e.checked)
            return true;
        const t = Date.parse(String(e.checked));
        return isNaN(t) || t < cutoff;
    }).map(e => ({ ...e, reason: !e.checked ? "unchecked" : e.verified === false ? "unverified" : "older_than_days" }));
    return json({ days, total_with_source: all.length, stale_count: stale.length, stale });
});
// Lifecycle stages: five macro stages (idea → launch → operate → scale → exit) and the fine stages under them,
// each with known_surprises (what always happens that the plan did not expect) and revisit_triggers (when to re-run Blueprint).
server.tool("lifecycle_stages", "Lifecycle macro stages (idea/launch/operate/scale/exit) and fine stages with known_surprises and revisit_triggers. Optional stage: a macro or fine stage id. include_items=true adds the coverage items of that stage.", { stage: z.string().optional(), include_items: z.boolean().optional() }, async ({ stage, include_items = false }) => {
    const lc = loadYaml("lifecycle");
    const macros = lc?.macro_stages ?? [];
    const fines = lc?.stages ?? [];
    const sid = stage ? safe(stage) : null;
    let m = macros, f = fines;
    if (sid) {
        const macro = macros.find(x => x.id === sid);
        if (macro) {
            m = [macro];
            f = fines.filter(x => x.macro === sid);
        }
        else {
            f = fines.filter(x => x.id === sid);
            if (!f.length)
                return err(`Unknown stage "${stage}". Macro: ${macros.map(x => x.id).join(", ")}; fine: ${fines.map(x => x.id).join(", ")}`);
            m = macros.filter(x => x.id === f[0].macro);
        }
    }
    const fineIds = new Set(f.map(x => x.id));
    const items = include_items ? (lc?.items ?? []).filter((i) => fineIds.has(i.stage)) : undefined;
    return json({ schema: lc?.schema ?? null, updated: lc?.updated ?? null, macro_stages: m, stages: f, ...(items ? { item_count: items.length, items } : {}) });
});
const PHASES = {
    requirements: /copy|announce|hint|onboard|user|flow|feature/i,
    design: /colou?r|border|tint|type|layout|spacing|icon|visual|selected|primary/i,
    qa: /.*/,
};
server.tool("ui_ux_checklist", "UI/UX yes/no checklist. Optional phase: requirements | design | qa (qa = all). Optional lifecycle: idea | launch | operate | scale | exit filters the phase gates; gates are always returned.", { phase: z.enum(["requirements", "design", "qa"]).optional(), lifecycle: z.enum(LIFECYCLE).optional() }, async ({ phase, lifecycle }) => {
    const doc = loadYaml("ui_ux");
    const rules = doc?.rules ?? [];
    const pick = rules.filter(r => !phase || (r.phase ? [].concat(r.phase).includes(phase)
        : PHASES[phase].test(`${r.id} ${r.principle}`)));
    const gates = (doc?.phase_gate_checks ?? []).filter((g) => !lifecycle || g.lifecycle === lifecycle);
    return json({ phase: phase ?? "all", count: pick.length,
        checklist: pick.map(r => ({ id: `ui_ux.${r.id}`, rule: r.id, category: r.category ?? null, check: r.check, why: r.why })),
        lifecycle: lifecycle ?? "all", gates: gates.map(g => ({ id: g.id, lifecycle: g.lifecycle ?? null, phase: g.phase, check: g.check, why: g.why, rules: g.rules ?? [] })) });
});
server.tool("propose_learning", "Propose a new learning. Appends to the inbox only; the master is never edited. kind: rule (default) | component_map_update (a review fix to feed back into the component map).", { text: z.string().min(5).max(2000), category: z.string().min(1).max(64),
    kind: z.enum(["rule", "component_map_update"]).optional() }, async ({ text: t, category, kind }) => {
    const rec = { ts: new Date().toISOString(), kind: kind ?? "rule", category, text: t, status: "proposed" };
    fs.mkdirSync(path.dirname(INBOX), { recursive: true });
    fs.appendFileSync(INBOX, JSON.stringify(rec) + "\n");
    return json({ saved: true, inbox: "mcp/inbox/learnings.jsonl", record: rec });
});
await server.connect(new StdioServerTransport());

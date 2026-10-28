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
const safe = (s) => s.replace(/[^a-zA-Z0-9_\-.]/g, "");
const text = (t) => ({ content: [{ type: "text", text: t }] });
const json = (o) => text(JSON.stringify(o, null, 2));
const err = (t) => ({ ...text(t), isError: true });
const domains = () => fs.readdirSync(CAT).filter(f => f.endsWith(".yaml")).map(f => f.slice(0, -5)).sort();
const layers = () => fs.existsSync(ELE) ? fs.readdirSync(ELE).filter(f => f.endsWith(".yaml")).map(f => f.slice(0, -5)).sort() : [];
const fileOf = (d) => domains().includes(d) ? path.join(CAT, d + ".yaml") : layers().includes(d) ? path.join(ELE, d + ".yaml") : null;
// Normalize every item shape (entries / lessons / rules / providers / axes / elements / tactics) to one flat list.
function items(d) {
    const f = fileOf(d);
    if (!f)
        return [];
    let doc;
    try {
        doc = yaml.load(fs.readFileSync(f, "utf8"));
    }
    catch {
        return [];
    }
    const out = [];
    const visit = (node, kind) => {
        if (!Array.isArray(node))
            return;
        for (const it of node)
            if (it && typeof it === "object" && (it.id || it.topic)) {
                const id = it.id ?? `${d}.${it.topic}`;
                out.push({ domain: d, kind, id: String(id).includes(".") ? id : `${d}.${id}`, name: it.name_ja ?? it.label_ja ?? it.name ?? null,
                    summary: it.what ?? it.principle_ja ?? it.principle ?? it.question_ja ?? null,
                    avoid: it.avoid_when ?? it.anti_pattern ?? null, why: it.why ?? null, check: it.check ?? null,
                    depends_on: it.depends_on ?? undefined, options: it.options ?? undefined,
                    verified: it.source?.verified ?? it.verified ?? null, checked: it.source?.checked ?? it.last_checked ?? it.date ?? null });
            }
    };
    for (const [k, v] of Object.entries(doc ?? {}))
        visit(v, k);
    if (doc?.auth?.providers)
        visit(doc.auth.providers, "providers");
    return out;
}
const references = () => fs.readdirSync(REF).filter(f => f.endsWith(".md")).map(f => f.slice(0, -3)).sort();
const loadYaml = (d) => yaml.load(fs.readFileSync(path.join(CAT, d + ".yaml"), "utf8"));
const server = new McpServer({ name: "blueprint", version: "0.1.0" });
server.tool("list_domains", "List catalog domains, elements-layer files and reference documents.", {}, async () => json({ domains: domains(), layers: layers(), references: references() }));
server.tool("get_catalog", "Return a catalog domain or elements-layer file (elements / tactics / project-map.template). format=yaml (default, as-is) or items (normalized list incl. lesson-format entries).", { domain: z.string(), format: z.enum(["yaml", "items"]).optional() }, async ({ domain, format = "yaml" }) => {
    const d = safe(domain).replace(/\.yaml$/, "");
    const f = fileOf(d);
    if (!f)
        return err(`Unknown domain "${domain}". Use list_domains.`);
    if (format === "items") {
        const it = items(d);
        return json({ domain: d, count: it.length, items: it });
    }
    return text(fs.readFileSync(f, "utf8"));
});
server.tool("get_reference", "Return a reference markdown document.", { name: z.string() }, async ({ name }) => {
    const n = safe(name).replace(/\.md$/, "");
    if (!references().includes(n))
        return err(`Unknown reference "${name}". Available: ${references().join(", ")}`);
    return text(fs.readFileSync(path.join(REF, n + ".md"), "utf8"));
});
server.tool("get_skill", "Return the Blueprint SKILL.md.", {}, async () => text(fs.readFileSync(path.join(ROOT, "SKILL.md"), "utf8")));
server.tool("search", "Case-insensitive search across catalog YAML and reference docs. Returns matching lines.", { query: z.string().min(1), limit: z.number().int().positive().max(500).optional() }, async ({ query, limit = 50 }) => {
    const q = query.toLowerCase();
    const files = [...domains().map(d => `catalog/${d}.yaml`), ...layers().map(l => `elements/${l}.yaml`), ...references().map(r => `reference/${r}.md`), "SKILL.md"];
    const hits = [];
    for (const f of files) {
        fs.readFileSync(path.join(ROOT, f), "utf8").split("\n").forEach((l, i) => {
            if (hits.length < limit && l.toLowerCase().includes(q))
                hits.push({ file: f, line: i + 1, text: l.trim() });
        });
    }
    const matched = [...domains(), ...layers()].flatMap(items).filter(i => JSON.stringify(i).toLowerCase().includes(q)).slice(0, limit);
    return json({ query, count: hits.length, hits, item_count: matched.length, items: matched });
});
function walkEntries(node, domain, out) {
    if (Array.isArray(node)) {
        node.forEach(n => walkEntries(n, domain, out));
        return;
    }
    if (node && typeof node === "object") {
        if (node.source && typeof node.source === "object" && ("checked" in node.source || "verified" in node.source)) {
            out.push({ domain, id: node.id ?? null, name: node.name ?? null, checked: node.source.checked ?? null,
                verified: node.source.verified ?? null, url: node.source.url ?? null });
        }
        for (const v of Object.values(node))
            if (v && typeof v === "object")
                walkEntries(v, domain, out);
    }
}
server.tool("stale_items", "Catalog items whose source.checked is older than `days`, missing, or verified:false.", { days: z.number().int().nonnegative() }, async ({ days }) => {
    const all = [];
    for (const d of domains()) {
        try {
            walkEntries(loadYaml(d), d, all);
        }
        catch { /* skip unparsable */ }
    }
    const cutoff = Date.now() - days * 86400000;
    const stale = all.filter(e => {
        if (e.verified === false || !e.checked)
            return true;
        const t = Date.parse(String(e.checked));
        return isNaN(t) || t < cutoff;
    }).map(e => ({ ...e, reason: !e.checked ? "unchecked" : e.verified === false ? "unverified" : "older_than_days" }));
    return json({ days, total_with_source: all.length, stale_count: stale.length, stale });
});
const PHASES = {
    requirements: /copy|announce|hint|onboard|user|flow|feature/i,
    design: /colou?r|border|tint|type|layout|spacing|icon|visual|selected|primary/i,
    qa: /.*/,
};
server.tool("ui_ux_checklist", "UI/UX yes/no checklist. Optional phase: requirements | design | qa (qa = all).", { phase: z.enum(["requirements", "design", "qa"]).optional() }, async ({ phase }) => {
    const rules = loadYaml("ui_ux")?.rules ?? [];
    const pick = rules.filter(r => !phase || (r.phase ? [].concat(r.phase).includes(phase)
        : PHASES[phase].test(`${r.id} ${r.principle}`)));
    return json({ phase: phase ?? "all", count: pick.length,
        checklist: pick.map(r => ({ id: r.id, check: r.check, why: r.why })) });
});
server.tool("propose_learning", "Propose a new learning. Appends to the inbox only; the master is never edited.", { text: z.string().min(5).max(2000), category: z.string().min(1).max(64) }, async ({ text: t, category }) => {
    const rec = { ts: new Date().toISOString(), category, text: t, status: "proposed" };
    fs.mkdirSync(path.dirname(INBOX), { recursive: true });
    fs.appendFileSync(INBOX, JSON.stringify(rec) + "\n");
    return json({ saved: true, inbox: "mcp/inbox/learnings.jsonl", record: rec });
});
await server.connect(new StdioServerTransport());

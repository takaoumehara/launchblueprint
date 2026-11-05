// Blueprint hub — catalog reads over the bundled skill/blueprint (src/generated/catalog.json, built by scripts/build-catalog.mjs).
// (c) CREATIVITY IS EVERYWHERE, LLC. Same normalisation as mcp/src/index.ts, with fs reads replaced by bundle lookups.
export type Bundle = { schema: string; commit: string; generated: string; files: Record<string, string>; docs: Record<string, any> };
export type Profile = { audience?: string; platform?: string; money?: string; country?: string };

export const LIFECYCLE = ["idea", "launch", "operate", "scale", "exit"] as const;
export const safe = (s: string) => s.replace(/[^a-zA-Z0-9_\-.]/g, "");

export function makeCatalog(bundle: Bundle) {
  const paths = Object.keys(bundle.files);
  const listIn = (dir: string, ext: RegExp) => paths.filter(p => p.startsWith(dir + "/") && ext.test(p)).map(p => p.slice(dir.length + 1)).sort();
  const domainList = listIn("catalog", /\.yaml$/).map(f => f.slice(0, -5));
  const layerList = listIn("elements", /\.yaml$/).map(f => f.slice(0, -5));
  const referenceList = listIn("reference", /\.md$/).map(f => f.slice(0, -3));
  const templateList = [...listIn("templates", /\.(md|yaml)$/), "project-map.template.yaml"].sort();

  const domains = () => domainList;
  const layers = () => layerList;
  const references = () => referenceList;
  const templates = () => templateList;
  const read = (rel: string): string | null => bundle.files[rel] ?? null;
  const fileOf = (d: string) => domainList.includes(d) ? `catalog/${d}.yaml` : layerList.includes(d) ? `elements/${d}.yaml` : null;
  const loadFile = (d: string): any => { const f = fileOf(d); return f ? bundle.docs[f.slice(0, -5)] ?? null : null; };
  const loadYaml = (d: string): any => bundle.docs[`catalog/${d}`] ?? null;
  const titleOf = (d: string) => {
    const f = fileOf(d); if (!f) return null;
    const first = (read(f) ?? "").split("\n").find(l => l.startsWith("#"));
    if (first) return first.replace(/^#\s*/, "").replace(/\s*[—–-]\s*CREATIVITY IS EVERYWHERE, LLC.*$/, "").trim();
    const doc = loadFile(d);
    return doc?.title ?? doc?.name_ja ?? (doc?.schema ? `${d} (${doc.schema})` : d);
  };

  // Normalize every item shape (entries / lessons / rules / providers / axes / tiers / groups / checklist / elements / tactics / comparisons) to one flat list.
  const itemCache = new Map<string, any[]>();
  function items(d: string): any[] {
    const hit = itemCache.get(d); if (hit) return hit;
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
    // round-trip so callers never share (and mutate) the cached objects
    itemCache.set(d, JSON.parse(JSON.stringify(out)));
    return itemCache.get(d)!;
  }
  let all: any[] | null = null;
  const allItems = () => all ??= [...domainList, ...layerList].flatMap(items);
  const findItem = (id: string) => allItems().find(i => i.id === id) ?? null;
  const rawItem = (id: string): any => {
    for (const d of [...domainList, ...layerList]) {
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
  function aiPick(t: any, profile: Profile) {
    if (t.kind !== "choose") return null;
    for (const w of t.pick_when ?? []) if (Object.entries(w.if ?? {}).every(([k, v]) => (profile as any)[k] === v)) return { id: w.pick, reason: w.reason_ja, from_profile: true };
    return t.ai_pick ? { id: t.ai_pick, reason: t.ai_reason_ja, from_profile: false } : null;
  }
  function draftMap(opts: { name?: string; goal?: string; profile: Profile; decided?: Record<string, string | string[]> }, dumpYaml: (o: unknown) => string) {
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
    return { project_map, next_steps: next, blocked, progress, lanes, yaml: dumpYaml(project_map) };
  }

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

  // Category registry (elements/categories.yaml) and the catalog's existing principles, for the auto-check pipeline.
  const registry = (): any => loadFile("categories") ?? { categories: [], cross_cutting: [] };
  const knownCategories = () => new Set<string>([...(registry().categories ?? []).map((c: any) => c.id), ...domainList]);
  const rules = () => allItems().filter(i => ["lessons", "rules", "cross_rules"].includes(i.kind) && i.summary).map(i => {
    const raw = rawItem(i.id);
    return { id: i.id as string, text: String(i.summary), anti_pattern: i.avoid ? String(i.avoid) : undefined,
      polarity: raw?.type === "dont" ? "dont" as const : raw?.type === "do" ? "do" as const : null };
  });

  return { bundle, commit: bundle.commit, read, domains, layers, references, templates, fileOf, loadFile, loadYaml, titleOf, items, allItems, findItem, rawItem,
    tacticsDoc, comparisons, aiPick, draftMap, walkEntries, registry, knownCategories, rules };
}
export type Catalog = ReturnType<typeof makeCatalog>;

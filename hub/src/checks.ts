// Blueprint hub — auto-check pipeline for propose_learning (docs/hub/DESIGN.md §7). Pure: no I/O, no clock, unit tested.
// (c) CREATIVITY IS EVERYWHERE, LLC
// Order: schema → PII/secret (reject, never stored) → duplicate/merge (catalog ids and pending submissions)
// → contradiction (flag) → claims forced unverified. The result only ever queues a submission for review:
// nothing here can write to the catalog.
import { z } from "zod";

export const LIFECYCLE = ["idea", "launch", "operate", "scale", "exit"] as const;

// ---- layer schemas (same limits as mcp/src/index.ts) ----
export const principleSchema = z.object({
  principle: z.string().min(5).max(400),
  anti_pattern: z.string().min(5).max(400),
  why: z.string().min(5).max(300),
  check: z.string().min(5).max(300),
});
export const claimSchema = z.object({
  claim: z.string().min(5).max(400),
  source_url: z.string().url().max(500).optional(),
  checked: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
export const contextSchema = z.object({
  stage: z.enum(LIFECYCLE),
  fine_stage: z.string().max(32).optional(),
  stack_type: z.string().max(64).optional(),
  product_type: z.string().max(64).optional(),
  severity: z.enum(["near_miss", "delay", "loss"]).optional(),
  cost_days: z.number().min(0).max(3650).optional(),
  cost_money_usd: z.number().min(0).optional(),
  cost_is_estimate: z.boolean().optional(),
});
export const submissionShape = {
  category: z.string().min(1).max(64),
  kind: z.enum(["rule", "component_map_update"]).optional(),
  text: z.string().min(5).max(2000).optional(),
  principle: principleSchema.optional(),
  claims: z.array(claimSchema).max(20).optional(),
  context: contextSchema.optional(),
};
export const submissionSchema = z.object(submissionShape);
export type SubmissionInput = z.infer<typeof submissionSchema>;

// ---- PII / secrets (ported from mcp/src/index.ts; reject, not stored) ----
export const PII_PATTERNS: [string, RegExp][] = [
  ["email", /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/],
  ["phone", /(?<!\d)(\+\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}(?!\d)/],
  ["secret", /\b(sk_(live|test)_[A-Za-z0-9]{8,}|AKIA[0-9A-Z]{12,}|ghp_[A-Za-z0-9]{20,}|xox[abp]-[A-Za-z0-9-]{10,}|eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}|bph_[A-Za-z0-9_-]{20,})/],
  ["private_key", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
];
export const piiHits = (o: unknown) => { const t = JSON.stringify(o); return PII_PATTERNS.filter(([, re]) => re.test(t)).map(([k]) => k); };
export const fingerprint = (s: string) => { let h = 0x811c9dc5; for (const ch of s.toLowerCase().replace(/[^a-z0-9぀-ヿ一-鿿]+/g, " ").trim()) { h ^= ch.codePointAt(0)!; h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); };

// ---- text similarity: token Jaccard over content words (English) and character bigrams (Japanese) ----
const STOP = new Set(("a an the and or of to in on at for by with from as is are was were be been being it its this that these those "
  + "you your we our they their them he she his her i me my do does did done can could should would will shall may might must "
  + "than then so if when while into onto out up down over under about each every any all some one two per via").split(" "));
// Negation and polarity words: removed before similarity (so "never X" and "always X" look alike), then compared for polarity.
const NEG_EN = new Set("not no never dont don't doesnt doesn't without avoid stop disable forbid forbidden ban banned prohibit refuse skip nor cannot cant can't neither".split(" "));
const NEG_JA = /(しない|ない|ません|禁止|避け|やめ|使わない|させない|不要|せず)/;
const OPPOSITES: [string, string][] = [
  ["always", "never"], ["before", "after"], ["enable", "disable"], ["allow", "block"], ["allow", "deny"], ["increase", "decrease"],
  ["more", "less"], ["early", "late"], ["public", "private"], ["opt-in", "opt-out"], ["keep", "remove"], ["keep", "delete"],
  ["include", "exclude"], ["required", "optional"], ["manual", "automatic"], ["first", "last"], ["start", "stop"], ["add", "remove"],
];
const POLAR = new Set(OPPOSITES.flat());
const stem = (w: string) => w.length > 4 && w.endsWith("ing") ? w.slice(0, -3) : w.length > 3 && w.endsWith("es") ? w.slice(0, -2) : w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w;

export const normalize = (s: string) => s.toLowerCase().normalize("NFKC").replace(/[’'`]/g, "'").replace(/[^a-z0-9'\-぀-ヿ一-鿿]+/g, " ").trim();
export function words(s: string): string[] { return normalize(s).split(/\s+/).filter(Boolean); }
export function tokens(s: string): Set<string> {
  const out = new Set<string>();
  for (const w of words(s)) {
    if (/[぀-ヿ一-鿿]/.test(w)) { const cjk = w.replace(/[a-z0-9'\-]+/g, ""); for (let i = 0; i + 1 < cjk.length; i++) out.add(cjk.slice(i, i + 2)); continue; }
    const b = w.replace(/'/g, "");
    if (NEG_EN.has(w) || NEG_EN.has(b) || POLAR.has(b)) continue;
    // "free-tier" and "free tier" are the same words
    for (const part of b.split("-")) if (part.length >= 2 && !STOP.has(part) && !NEG_EN.has(part) && !POLAR.has(part)) out.add(stem(part));
  }
  return out;
}
export function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let inter = 0; for (const t of a) if (b.has(t)) inter++;
  return inter / (a.size + b.size - inter);
}
export const similarity = (a: string, b: string) => jaccard(tokens(a), tokens(b));
export function polarity(s: string): "do" | "dont" {
  const ws = words(s);
  return ws.some(w => NEG_EN.has(w) || NEG_EN.has(w.replace(/'/g, ""))) || NEG_JA.test(s) ? "dont" : "do";
}
/** An opposite pair split across the two texts (one says "before", the other "after"). */
export function opposite(a: string, b: string): [string, string] | null {
  const wa = new Set(words(a)), wb = new Set(words(b));
  for (const [x, y] of OPPOSITES) {
    if (wa.has(x) && wb.has(y) && !wa.has(y) && !wb.has(x)) return [x, y];
    if (wa.has(y) && wb.has(x) && !wa.has(x) && !wb.has(y)) return [y, x];
  }
  return null;
}

// ---- pipeline ----
export type CatalogRule = { id: string; text: string; anti_pattern?: string; polarity?: "do" | "dont" | null };
export type PendingSubmission = { id: string; text: string; category?: string };
export type Match = { target_id: string; target_type: "catalog" | "submission"; similarity: number };
export type CheckResult = {
  decision: "rejected" | "queued";
  reasons: string[];                         // why rejected (empty when queued)
  flags: string[];                           // what the reviewer must look at
  schema: { ok: boolean; errors: string[] };
  pii: { ok: boolean; hits: string[] };
  duplicate: (Match & { action: "merge" }) | null;
  related: Match[];                          // top near matches below the duplicate threshold
  contradiction: { target_id: string; similarity: number; reason: string } | null;
  claims: { count: number; status: "unverified"; with_source: number };
  needs_structuring: boolean;
  fingerprint: string;
  match_text: string;
};
export const THRESHOLDS = { duplicate: 0.6, related: 0.3, contradiction: 0.35, anti_pattern: 0.5 };

export const matchText = (s: Pick<SubmissionInput, "principle" | "text">) => s.principle?.principle ?? s.text ?? "";

export function runChecks(input: unknown, ctx: { categories: Set<string>; catalogRules: CatalogRule[]; pending: PendingSubmission[]; thresholds?: Partial<typeof THRESHOLDS> }): CheckResult {
  const th = { ...THRESHOLDS, ...ctx.thresholds };
  const base = { flags: [] as string[], duplicate: null, related: [] as Match[], contradiction: null, needs_structuring: false };
  // 1) schema
  const parsed = submissionSchema.safeParse(input);
  const errors = parsed.success ? [] : parsed.error.issues.map(i => `${i.path.join(".") || "(root)"}: ${i.message}`);
  const v = parsed.success ? parsed.data : null;
  if (v && !v.text && !v.principle) errors.push("give either `principle` {principle, anti_pattern, why, check} or `text`");
  if (v && !ctx.categories.has(v.category)) errors.push(`category "${v.category}" is not a category id (elements/categories.yaml) or a catalog domain`);
  for (const c of v?.claims ?? []) if (c.source_url && !c.source_url.startsWith("https://")) errors.push(`claims: source_url must be https (${c.source_url.slice(0, 40)})`);
  // 2) PII / secrets: checked even when the schema fails, so a bad payload never echoes a secret back as "fix the schema"
  const hits = piiHits(input);
  const mt = v ? matchText(v) : "";
  const claimsInfo = { count: v?.claims?.length ?? 0, status: "unverified" as const, with_source: (v?.claims ?? []).filter(c => c.source_url).length };
  if (errors.length || hits.length) {
    return { ...base, decision: "rejected", reasons: [...(hits.length ? [`contains ${hits.join(", ")}`] : []), ...errors],
      schema: { ok: !errors.length, errors }, pii: { ok: !hits.length, hits }, claims: claimsInfo, fingerprint: fingerprint(mt), match_text: mt };
  }
  const flags: string[] = [];
  const sub = v!;
  const fp = fingerprint(mt);
  // 3) duplicate / merge: catalog principles first, then pending submissions; exact fingerprint counts as 1.0
  const candidates: Match[] = [
    ...ctx.catalogRules.map(r => ({ target_id: r.id, target_type: "catalog" as const, similarity: fingerprint(r.text) === fp ? 1 : similarity(mt, r.text) })),
    ...ctx.pending.map(p => ({ target_id: p.id, target_type: "submission" as const, similarity: fingerprint(p.text) === fp ? 1 : similarity(mt, p.text) })),
  ].filter(m => m.similarity >= th.related).sort((a, b) => b.similarity - a.similarity || (a.target_type === "catalog" ? -1 : 1));
  // 4) contradiction vs catalog rules: same topic, opposite polarity or opposite keyword; or the submission recommends a listed anti-pattern
  let contradiction: CheckResult["contradiction"] = null;
  const subPol = polarity(mt);
  for (const r of ctx.catalogRules) {
    const sim = similarity(mt, r.text);
    const rPol = r.polarity ?? polarity(r.text);
    const opp = opposite(mt, r.text);
    let reason = "";
    if (sim >= th.contradiction && opp) reason = `opposite wording: submission "${opp[0]}" vs catalog "${opp[1]}"`;
    else if (sim >= th.contradiction && rPol !== subPol) reason = `catalog says "${rPol === "dont" ? "don't" : "do"}", submission says "${subPol === "dont" ? "don't" : "do"}"`;
    else if (r.anti_pattern && subPol === "do" && similarity(mt, r.anti_pattern) >= th.anti_pattern) reason = "submission recommends what the catalog lists as the anti-pattern";
    if (reason && (!contradiction || sim > contradiction.similarity)) contradiction = { target_id: r.id, similarity: round(sim), reason };
  }
  const best = candidates[0];
  const conflictsWithBest = contradiction && best && contradiction.target_id === best.target_id;
  const duplicate = best && best.similarity >= th.duplicate && !conflictsWithBest ? { ...best, similarity: round(best.similarity), action: "merge" as const } : null;
  if (duplicate) flags.push(`duplicate_of:${duplicate.target_id}`);
  if (contradiction) flags.push(`contradicts:${contradiction.target_id}`);
  if (!sub.principle) flags.push("needs_structuring");
  if (claimsInfo.count) flags.push("claims_unverified");
  if (claimsInfo.count > claimsInfo.with_source) flags.push("claims_without_source");
  return { decision: "queued", reasons: [], flags, schema: { ok: true, errors: [] }, pii: { ok: true, hits: [] },
    duplicate, related: candidates.filter(c => c !== best || !duplicate).slice(0, 3).map(c => ({ ...c, similarity: round(c.similarity) })),
    contradiction, claims: claimsInfo, needs_structuring: !sub.principle, fingerprint: fp, match_text: mt };
}
const round = (x: number) => Math.round(x * 1000) / 1000;

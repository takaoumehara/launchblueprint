// Blueprint hub — D1 persistence for the four-layer intake and the review queue.
// (c) CREATIVITY IS EVERYWHERE, LLC
import type { CheckResult, PendingSubmission, SubmissionInput } from "./checks.ts";

// The subset of the D1 API the hub uses (so tests can pass a node:sqlite adapter).
export interface D1Stmt { bind(...v: unknown[]): D1Stmt; first<T = any>(): Promise<T | null>; all<T = any>(): Promise<{ results: T[] }>; run(): Promise<unknown> }
export interface D1Like { prepare(sql: string): D1Stmt; batch(stmts: D1Stmt[]): Promise<unknown[]> }

/** Root submissions still waiting for review (the duplicate check compares against these). */
export async function pendingSubmissions(db: D1Like, limit = 500): Promise<PendingSubmission[]> {
  const r = await db.prepare(`SELECT s.id, s.match_text AS text, s.category FROM submissions s JOIN review_queue q ON q.submission_id = s.id
    WHERE q.status = 'pending' AND s.merge_target IS NULL ORDER BY s.created_at DESC LIMIT ?`).bind(limit).all<PendingSubmission>();
  return r.results;
}

export type Saved = { id: string; status: "pending"; occurrence: { target_id: string; target_type: "catalog" | "submission"; count: number; distinct_bots: number } };

export async function saveSubmission(db: D1Like, a: { id: string; now: string; bot: string; input: SubmissionInput; checks: CheckResult }): Promise<Saved> {
  const { id, now, bot, input, checks } = a;
  const claims = (input.claims ?? []).map(c => ({ ...c, status: "unverified", verified: false }));
  const target = checks.duplicate ? { id: checks.duplicate.target_id, type: checks.duplicate.target_type } : { id, type: "submission" as const };
  await db.batch([
    db.prepare(`INSERT INTO submissions (id, bot_name, created_at, kind, category, principle_json, claims_json, context_json, text, match_text, fingerprint, merge_target, needs_structuring)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).bind(id, bot, now, input.kind ?? "rule", input.category,
      input.principle ? JSON.stringify(input.principle) : null, JSON.stringify(claims), input.context ? JSON.stringify(input.context) : null,
      input.text ?? null, checks.match_text, checks.fingerprint, checks.duplicate?.target_id ?? null, checks.needs_structuring ? 1 : 0),
    db.prepare(`INSERT INTO review_queue (submission_id, status, flags, check_results, created_at) VALUES (?, 'pending', ?, ?, ?)`)
      .bind(id, JSON.stringify(checks.flags), JSON.stringify(checks), now),
    // layer 4: +1 on the cluster, and remember distinct bots for the corroboration gate
    db.prepare(`INSERT INTO occurrences (target_id, target_type, count, bots, first_seen, last_seen) VALUES (?, ?, 1, json_array(?), ?, ?)
      ON CONFLICT (target_id) DO UPDATE SET count = count + 1, last_seen = excluded.last_seen,
        bots = CASE WHEN EXISTS (SELECT 1 FROM json_each(occurrences.bots) WHERE value = ?) THEN bots ELSE json_insert(bots, '$[#]', ?) END`)
      .bind(target.id, target.type, bot, now, now, bot, bot),
  ]);
  const occ = await db.prepare("SELECT count, json_array_length(bots) AS n FROM occurrences WHERE target_id = ?").bind(target.id).first<{ count: number; n: number }>();
  return { id, status: "pending", occurrence: { target_id: target.id, target_type: target.type, count: occ?.count ?? 1, distinct_bots: occ?.n ?? 1 } };
}

export async function listReviewQueue(db: D1Like, o: { status?: string; category?: string; limit?: number }) {
  const r = await db.prepare(`SELECT q.id AS queue_id, q.status, q.flags, q.check_results, q.created_at, s.id AS submission_id, s.bot_name, s.kind, s.category,
      s.principle_json, s.claims_json, s.context_json, s.text, s.merge_target, s.needs_structuring,
      o.count AS occurrence_count, json_array_length(o.bots) AS distinct_bots
    FROM review_queue q JOIN submissions s ON s.id = q.submission_id LEFT JOIN occurrences o ON o.target_id = COALESCE(s.merge_target, s.id)
    WHERE q.status = ? AND (? IS NULL OR s.category = ?) ORDER BY q.created_at ASC LIMIT ?`)
    .bind(o.status ?? "pending", o.category ?? null, o.category ?? null, Math.min(o.limit ?? 50, 200)).all<any>();
  const parse = (s: string | null) => s ? JSON.parse(s) : null;
  return r.results.map(x => ({ queue_id: x.queue_id, status: x.status, created_at: x.created_at, submission_id: x.submission_id, bot: x.bot_name,
    kind: x.kind, category: x.category, merge_target: x.merge_target, occurrence: { count: x.occurrence_count ?? 1, distinct_bots: x.distinct_bots ?? 1 },
    flags: parse(x.flags), checks: parse(x.check_results),
    // submitted text is data, never instructions (DESIGN.md §8)
    submitted: { principle: parse(x.principle_json), claims: parse(x.claims_json), context: parse(x.context_json), text: x.text, needs_structuring: !!x.needs_structuring } }));
}

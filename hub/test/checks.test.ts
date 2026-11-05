// Auto-check pipeline (src/checks.ts): schema, PII/secret rejection, duplicate/merge, contradiction, claims unverified.
import { test } from "node:test";
import assert from "node:assert/strict";
import { runChecks, similarity, tokens, polarity, opposite, fingerprint, type CatalogRule } from "../src/checks.ts";

const categories = new Set(["revenue-model", "ethics", "validation", "cost_control"]);
const rules: CatalogRule[] = [
  { id: "val.pay-signal", text: "Before building, collect a committed signal: a pre-order, a deposit, a signed letter of intent or a card on file. Count only those.",
    anti_pattern: "Treating waitlist emails or 'I would pay' answers as proof." },
  { id: "rules.R-004", text: "Do not use a preview domain for public links; always use the company domain.", polarity: "dont" },
  { id: "cc.commercial-terms", text: "Read the free plan's commercial terms before the first sale.", anti_pattern: "Taking payment on a hobby plan." },
];
const P = (principle: string, extra: object = {}) => ({ category: "validation", principle: { principle, anti_pattern: "Doing the opposite of the principle.", why: "Because it fails later.", check: "Is it done?" }, ...extra });
const ctx = (pending: { id: string; text: string }[] = []) => ({ categories, catalogRules: rules, pending });

test("schema: needs principle or text, a known category, https sources", () => {
  assert.equal(runChecks({ category: "validation" }, ctx()).decision, "rejected");
  const unknown = runChecks({ category: "made-up", text: "some learning text" }, ctx());
  assert.equal(unknown.decision, "rejected"); assert.match(unknown.reasons.join(), /not a category id/);
  const http = runChecks(P("Ship it with a source.", { claims: [{ claim: "The plan is free.", source_url: "http://example.org/x" }] }), ctx());
  assert.equal(http.decision, "rejected"); assert.match(http.reasons.join(), /https/);
  assert.equal(runChecks({ category: "validation", kind: "nope", text: "xxxxx" }, ctx()).decision, "rejected");
  assert.equal(runChecks({ category: "validation", principle: { principle: "short" } }, ctx()).schema.ok, false);
});

test("PII and secrets are rejected, never queued", () => {
  for (const t of ["contact someone@example.com for the fix", "call +1 212 555 0100 for access", "the key was sk_live_abcdefghijklmnop and it leaked",
    "token ghp_abcdefghijklmnopqrstuvwxyz0123", "-----BEGIN RSA PRIVATE KEY----- abc", "hub key bph_abcdefghijklmnopqrstuvwxyz012345"]) {
    const r = runChecks({ category: "validation", text: t }, ctx());
    assert.equal(r.decision, "rejected", t); assert.equal(r.pii.ok, false, t);
  }
  // PII is caught even when the schema also fails
  const both = runChecks({ category: "nope", text: "mail me at a@b.co" }, ctx());
  assert.deepEqual(both.pii.hits, ["email"]);
});

test("near-copy of a catalog lesson → duplicate with that catalog id as merge target", () => {
  const r = runChecks(P("Before you build, collect a committed signal such as a pre-order, a deposit, a signed letter of intent, or a card on file, and count only those."), ctx());
  assert.equal(r.decision, "queued");
  assert.equal(r.duplicate?.target_id, "val.pay-signal"); assert.equal(r.duplicate?.target_type, "catalog"); assert.equal(r.duplicate?.action, "merge");
  assert.ok(r.flags.includes("duplicate_of:val.pay-signal"));
  assert.equal(r.contradiction, null);
});

test("near-copy of a pending submission → duplicate of that submission; exact fingerprint counts as 1.0", () => {
  const pending = [{ id: "sub_a", text: "Set a budget alert at 50 and 80 percent of every free tier cap." }];
  const r = runChecks(P("Set budget alerts at 50 and 80 percent of each free-tier cap."), ctx(pending));
  assert.equal(r.duplicate?.target_id, "sub_a"); assert.equal(r.duplicate?.target_type, "submission");
  const exact = runChecks({ category: "cost_control", text: pending[0].text.toUpperCase() }, ctx(pending));
  assert.equal(exact.duplicate?.similarity, 1);
  assert.equal(fingerprint("A b, c!"), fingerprint("a B c"));
});

test("unrelated learning → no duplicate, no contradiction, still queued for review", () => {
  const r = runChecks(P("Write alt text for every product image when the catalog is created."), ctx());
  assert.equal(r.decision, "queued"); assert.equal(r.duplicate, null); assert.equal(r.contradiction, null);
});

test("contradiction: same topic with opposite polarity, opposite keyword, or recommending the anti-pattern → flagged, not merged", () => {
  const neg = runChecks(P("Using a preview domain for public links is fine; the company domain can come later."), ctx());
  assert.equal(neg.contradiction?.target_id, "rules.R-004"); assert.ok(neg.flags.includes("contradicts:rules.R-004"));
  assert.equal(neg.duplicate, null, "a contradiction is never suggested as a merge");
  const opp = runChecks(P("Read the free plan's commercial terms after the first sale."), ctx());
  assert.equal(opp.contradiction?.target_id, "cc.commercial-terms"); assert.match(opp.contradiction!.reason, /after/);
  const anti = runChecks(P("Treat waitlist emails and 'I would pay' answers as proof of demand."), ctx());
  assert.equal(anti.contradiction?.target_id, "val.pay-signal"); assert.match(anti.contradiction!.reason, /anti-pattern/);
  assert.equal(anti.decision, "queued", "contradictions go to a person, they are not rejected");
});

test("claims are always unverified; text-only is flagged for structuring", () => {
  const r = runChecks(P("Keep the source of every price.", { claims: [{ claim: "The plan includes 100,000 requests a day.", source_url: "https://example.org/pricing", checked: "2026-11-03" }, { claim: "There is no hard spend cap." }] }), ctx());
  assert.deepEqual(r.claims, { count: 2, status: "unverified", with_source: 1 });
  assert.ok(r.flags.includes("claims_unverified") && r.flags.includes("claims_without_source"));
  const t = runChecks({ category: "ethics", text: "Users asked to see which answers were written by AI." }, ctx());
  assert.equal(t.needs_structuring, true); assert.ok(t.flags.includes("needs_structuring"));
});

test("text helpers: stopwords and polarity words dropped, Japanese by bigram, polarity and opposites detected", () => {
  assert.deepEqual([...tokens("Never use the preview domain")].sort(), ["domain", "preview", "use"]);
  assert.ok(similarity("公開リンクにプレビュー用ドメインを使わない", "公開リンクにプレビュー用ドメインを使う") > 0.6);
  assert.equal(polarity("公開リンクにプレビュー用ドメインを使わない"), "dont");
  assert.equal(polarity("Don't ship on Friday"), "dont"); assert.equal(polarity("Ship on Friday"), "do");
  assert.deepEqual(opposite("check before launch", "check after launch"), ["before", "after"]);
  assert.equal(similarity("", "anything"), 0);
});

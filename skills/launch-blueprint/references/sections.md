# Section prompts (0–6, 8, 9)

Each answer: recommended option, alternative(s) + one-line reason, six angles (cost, legal, operations, marketing, implementation, UX), source or `NEEDS CONFIRMATION`.

## 0. Facts that change everything
Ask these in one batch at kickoff and again whenever the owner reveals a new fact. Each answer switches sections on or off; write the answers at the top of the blueprint.
- Where does the owner live?
- Where is the legal entity registered, or where will it be?
- Where will customers and users be? Which regions can reach the product at all?
- Does money move? Between whom: platform to owner only, or sellers and buyers through the platform?
- Do users publish content that others see?
- May minors use it, even if not targeted?
- Does AI process user data?
Then run `jurisdictions.md` for the Regions table.

## 1. Product and customer
- One-sentence product: who, what problem, at what price.
- First segment, first region, first plan only. Everything else is later.
- Jobs the customer hires it for; what they use today instead.
- Words we never use and promises we never make (uptime, security, income, legal compliance).
- Out of scope list.

## 2. Price and cost
- Plans, prices, billing period, platform fees, add-ons.
- Cost per customer per month: hosting compute, DB, storage, bandwidth, email, SMS, third-party APIs, AI calls, payment fees (% + fixed), support minutes × hourly rate.
- Monthly fixed cost: every service, plan name, price. Total.
- Free things: dollar cap per month (global), per-user caps, what happens when the cap is hit (queue, degrade, stop).
- Break-even: customers needed to cover fixed cost. Gross margin per plan.
- Taxes collected vs. remitted; merchant of record or own registrations (`jurisdictions.md`).
- Assumptions with confidence level (low/med/high). Ask for unknowns.

## 3. Tech stack
- Default: one home (one provider for app, functions, storage, DB where sensible). If split, the reason and the cost of the split. Price both the consolidation and the migration; re-evaluate when the free plan stops fitting.
- Plan class: free and hobby plans often forbid commercial use, and "commercial" starts at the first payment, not at scale. Name the plan the product will be on the day it takes money.
- Per-service table: see `vendor-check.md`.
- Proactive scan: run `proactive-tools.md` across every pain × layer and propose high-fit APIs, turnkey, or white-label options the owner has not asked about (exhaustive survey with search log; reuse owned tools first).
- Whole-stack fit: list current and planned infrastructure (including any hosting migration) and check every tool against both: runtime limits, webhooks and signatures, data and secrets location, cost at 1/10/100 customers, lock-in and exit (`proactive-tools.md` step 3b).
- Choose the host for the 12-month shape (payments, media, traffic, background jobs, regions), and estimate migration effort if wrong.
- Deployment caps: daily deploy caps and per-branch preview deploys (a serverless host's daily deploy cap, for example; verify live, limits change). AI agents pushing often, or stacked PRs, can spend the cap in hours and block a fix. Push discipline: push once per task, avoid stacked PRs, use an ignore-build step for docs-only branches. Write down how to deploy in an emergency when capped (CLI deploy, a second project, a rollback).
- Preview environments: a managed database that branches per preview has a branch cap (verify live). Previews never share production credentials and never run production migrations; migrate-on-build guards key on the real environment, not on the branch name. Clean up preview resources.
- Environment detection fails safe: a missing env var means production-strict, not development-open. Invite-only gates, captchas and test-only flags must default to on. Test it by unsetting the variable (`security.md` §7).
- Edge and serverless SQL databases have limits a local test setup does not show. Verify live for the chosen database: bound parameters per query, function arguments, LIKE pattern length, row and result size, batch semantics, no interactive transactions. Make the test environment emulate production limits so violations fail in tests. Concurrency correctness (counters, quotas, bookings) relies on single conditional statements or real transactions, proven by race tests that use separate connections.
- Testing realism: tests that pass only because a local database answers instantly hide stale UI notices and races. Run the suite under realistic latency or load at least once before launch, and look for tests that depend on ordering by speed.
- Secrets: list by name, where stored (host env, secret manager), who creates each, rotation, never in repo or chat.
- Runaway-cost guards: global counter in a shared store; per-user and per-IP rate limits; caching; provider-side spending caps or budget alerts; kill switch (env flag or config) verified to work on this host and tested.
- Backup frequency, retention, restore drill date, no live credentials in backups (`security.md` §2); monitoring (errors, uptime, cost, scheduled-job heartbeats), alert recipients; one-command or one-toggle shutdown and maintenance mode.
- Email: free-tier daily send caps (verify live); SPF, DKIM, DMARC set before the first send; bounce and complaint handling that stops sending to bad addresses; a plan to reduce email volume (digests, in-app notices) so caps and reputation hold.
- AI features: per-user free caps (daily and monthly); paid-tier quotas; a fallback provider or a graceful "unavailable" state; cost per call and at 10x and 100x; exactly what user data is sent to the model, disclosed in the Privacy Policy; moderation and review of AI output; regional AI rules from `jurisdictions.md`.
- Content and internationalisation: user-generated URLs and slugs from non-Latin scripts (transliterate, allow Unicode, or use IDs; test both); fonts and fallbacks for CJK; right-to-left layout if any target language needs it; which languages the UI ships in on day one.

## 4. Legal and money
- Entity type and jurisdiction; registered agent; business address that is not a home (virtual office / agent address).
- DBA or trade name registered so the card statement descriptor, receipts and the operator page all show the brand customers recognise. Mismatched descriptors drive chargebacks.
- Tax ID (EIN in US), business bank account, bookkeeping.
- Keeping the company current: annual or biennial reports, registered agent renewal, franchise or minimum taxes, with dates in the owner to-do list.
- Insurance: general liability, tech E&O, cyber — get quotes or mark NEEDS CONFIRMATION.
- Sales tax / VAT / GST: where we have obligations by region (`jurisdictions.md`); or use a merchant of record.
- Documents: Terms (with liability cap, warranty disclaimer, indemnity, governing law; marked lawyer review), Privacy, Acceptable Use, Refund policy, Cookie notice, DMCA policy, Accessibility statement, Seller terms if marketplace.
- Trademark: classes to file in (software, online services, and any goods or events), the jurisdictions, and the search done before spending on the brand.
- Messaging: US SMS needs A2P 10DLC brand and campaign registration; email marketing needs CAN-SPAM (physical address, unsubscribe) and consent for EU/UK.
- DMCA designated agent registration (US) if hosting user content; DSA point of contact for EU.
- Vendor accounts: every vendor (host, DNS, payments, email, AI, analytics) under the company, with a work email on the company domain, not the owner's personal account. List which are still personal and the migration step.
- Industries and uses we refuse (also needed by payment processors).
- Lawyer review list: liability cap, arbitration, marketplace liability, privacy, consumer terms per region, any regulated area. Nothing here is legal advice; verify with a primary source and a lawyer.
- The public operator name; keep individuals' personal names and home addresses out of public pages if the owner wishes.

## 5. Marketing and brand
- Name, trademark search (USPTO / EUIPO / local), domain(s), social handles.
- Tagline, positioning against alternatives, visual system (design system tokens).
- Brand-voice rules for UI copy, written down and applied to every user-facing string: tone, what we never say, capitalisation, how errors and limits are explained.
- Funnel: entry offer → sign-up → activation event → paid → retention; metric for each step.
- First 10 customers: named channels and people, not "social media".
- Launch channels and what we will not do (spam, fake reviews).

## 6. Operations
- Manual tasks per customer and minutes each; which can be automated later.
- Actions needing human approval: sending to customers, publishing, charging, refunding, deleting, paying out.
- Support intake: address, form, response target, escalation; abuse intake separate. Identity verification rules for support requests (`security.md` §1).
- Runbooks: incident, refund, takedown, data request, account recovery, seller or organizer cancellation, emergency deploy when capped.
- Scheduled jobs: list each, its heartbeat, and who is alerted when it is late or crashes (`security.md` §6).
- Weekly metrics review.
- Ops tooling scan: use `proactive-tools.md` for intake/phone, messaging, booking, reviews, and back-office. Re-scan on its triggers (new pain, competitor feature, new tool release, quarterly).

## 8. Owner to-do list
- Only things a human must do: sign contracts, create accounts, verify identity, pay, file registrations, create API keys, approve legal docs.
- Format: `# | task | depends on | rough days (incl. waiting) | unblocks`.
- Order by dependency, then by lead time (long-wait items like entity, EIN, 10DLC, trademark, bank, VAT registration or MoR onboarding first).

## 9. Decisions log
- One row per decision: date, decision, alternative not taken, the fact it depends on (from section 0), what would reopen it.
- When a fact changes, add a row for each decision it reopens, even if the decision stands after review.

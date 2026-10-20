# Vendor check

For every external service (host, DB, storage, email, SMS, auth, analytics, payments, AI APIs, threat-lookup and safe-browsing APIs, domain, monitoring):

1. Open the live pricing page and the terms / fair-use page. Do not rely on memory. Limits change; write the date.
2. Record in the table. If a page cannot be opened or the answer is unclear, write `NEEDS CONFIRMATION` and the question.
3. Specifically look for: "personal", "non-commercial", "hobby" wording; hard caps vs. automatic overage billing; CPU/time/bundle limits per request; daily deploy and preview caps; database branch caps; email daily send caps; egress fees; account suspension rules; inactivity deletion rules.

| Service | Purpose | Plan we use | Commercial use allowed? | Key limits (incl. deploy / preview / branch / send caps) | Over limit → | $/month now | $/month at 10x | Lock-in / export | Date checked | Terms / pricing URL |
|---|---|---|---|---|---|---|---|---|---|---|

Rejected alternatives per category: `Category: picked X over Y because ...`.

Common traps to test explicitly:
- Free or hobby tier that forbids commercial use (any paid feature, ads, or business use counts). The flip happens at the first payment. Name the paid plan and its price for the day money moves.
- Daily deploy caps and per-branch preview deploys (for example a serverless host's daily deploy cap; verify live). Agents pushing often, or stacked PRs, can spend the cap in hours and then a fix cannot ship. Record the cap, the emergency deploy path, and the push discipline (push once per task, no stacked PRs, ignore-build step for docs-only branches).
- Preview environments that create a database branch per deploy and hit a branch cap (verify live). Previews must never hold production credentials or run production migrations.
- Edge and serverless SQL databases with limits a local setup does not show: bound parameters per query, function arguments, LIKE pattern length, row and result size, batch semantics, no interactive transactions (verify live for the chosen database). Emulate the limits in tests.
- Per-request CPU or duration limits that real pages exceed.
- Bandwidth/egress billed separately from storage.
- In-memory rate limits on serverless/edge (each instance counts separately).
- Proxying large media through compute instead of serving from storage/CDN.
- Vendor spending caps that are alerts only, not hard stops.
- Email providers with free-tier daily send caps and shared-IP reputation.
- Free threat-lookup or safe-browsing APIs whose terms forbid commercial use or cap lookups.
- AI providers: per-minute and per-day rate limits, data-retention and training terms for user data sent to the model, regional availability.
- Single vendor vs. split: price the consolidation and the migration both ways, and name the trigger (free plan stops fitting, cap hit, terms change) that re-opens the choice.
- Which request headers the host sets and strips (client IP, country, forwarded host); see `security.md` §3.

# Why this exists (anonymized case studies)

## Case 1: the kickoff that never happened

A small team built a creator web app quickly on a popular host's free plan because it deployed with zero setup. Features were added one request at a time, each well executed. Nobody stepped back to look at the whole.

What went wrong:
1. **The free plan forbade commercial use.** Paid plans and payments were on the roadmap from the start, so the product could never legally run on that plan. Nobody read the terms at kickoff.
2. **Limits and costs were never modeled.** Images were proxied through serverless compute, which is the expensive path. When an alternative host was evaluated, its free tier's per-request CPU limit turned out to be lower than what real page renders needed, so a paid tier was required anyway. Earlier information about one limit was also out of date, which shows why vendor pages must be checked live.
3. **Cost caps did not work on the host.** A spending cap for a free feature was built as an in-memory counter. On serverless, every instance has its own memory, so the cap never really applied.
4. **Legal blanks appeared right before launch.** Business address, operator name, and terms placeholders were found late. Sign-up was briefly left open because a configuration flag was not set, and bots used it to trigger outbound emails.
5. **Result:** a multi-day migration to another platform after the product was already built, plus rework on security and legal pages.

Each of these is a single row in this skill: vendor-check (commercial use, limits, over-limit behavior), runaway-cost guards that work on this host, legal section, fail-closed configuration, and the scale-cost table. Ten minutes at kickoff would have saved days.

## Case 2: the surprises that arrived mid-work

A done-for-you local-presence service for small trades was built by AI agents for a non-technical owner. The kickoff was reasonable. The costly surprises came later, one at a time, while the work was in progress. The host's free plan had a daily build cap that the agents' frequent pushes exhausted, blocking previews and production. The parent brand domain's DNS lived at a different provider than the planned cloud, so a scoped token could not see the zone, and the owner bought a product domain mid-migration; every registered URL (OAuth redirects, payment webhooks, bot-protection hostnames, API-key referrers) then had to be found and edited. A screenshot the owner sent showed a secret key. An env var was entered under a slightly wrong name. A state filing published the owner's home address, followed by look-alike "compliance" mail. SMS carrier registration, which takes weeks, was raised late. A PR was merged while a review bot was still running. Two agents worked on one repo with no rules. None of these were kickoff questions; all of them were predictable one or two moves ahead.

That is why v0.2 adds `foresight.md` (procedures that run at each decision, before each request to the owner, and at each milestone) and `field-lessons.md` (the fifteen traps as a checklist).

The broader lesson: the owner asks about what they can see. The AI should cover what the owner cannot see yet — inactive accounts, cancellations, deceased users, takedowns, disputes, breaches, sunset — because every mature service had to learn these, and their patterns are available from day one.

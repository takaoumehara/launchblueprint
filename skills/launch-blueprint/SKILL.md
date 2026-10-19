---
name: launch-blueprint
description: Produce a full-view launch blueprint BEFORE writing code for any new product, app, SaaS, paid feature, marketplace, or big feature. Covers product and customer, pricing and unit cost, tech stack (free-plan commercial-use, limits, overage, kill switches), legal and money, marketing, operations, the full customer lifecycle and risk (inactive accounts, cancellation, deletion, deceased users, takedowns, chargebacks, outages, breaches, minors, privacy law, sunset, lock-in, 10x/100x cost) and an ordered owner to-do list. Use this whenever someone says "let's build", "new idea", "kickoff", "start a project", "add payments", "go live", "pick a host/stack", "is this free tier OK", "launch checklist", or plans to charge money, even if they only ask about code or one piece. Also use at review points: before launch, at the 10th customer, before a price change, and before adding any external service.
---

# Launch Blueprint

One document, written before the first line of code, that looks at the idea the way a whole company would: product, finance, engineering, legal, marketing, support, and risk. The owner usually only asks about the part in front of them. This skill exists to cover the parts they did not ask about.

Read `references/why-this-exists.md` once if you want the motivating case. In short: a product built on a host whose free plan forbids commercial use, with cost caps that did not work on that host and legal blanks found the week of launch, had to be migrated later. Every item below would have caught one of those problems on day one.

## How to work

1. **Gather what exists.** Read the repo (README, package files, env example, infra config, any CLAUDE.md or docs) and the conversation. Note what is already decided.
2. **Fill every section** of the template in `assets/blueprint-template.md`. Do not skip a section because it seems early. If something truly does not apply, write `N/A — <reason>`.
3. **Never guess.** Anything you cannot verify from the repo, the owner, or a primary source you actually opened gets `NEEDS CONFIRMATION` plus the exact question. Collect all of these into the Open Questions list at the end and ask them in one batch. A confident wrong answer about a free tier or a law is what this skill is meant to prevent.
4. **Every decision has a rejected option.** For each choice, write at least one option you did not pick and a one-line reason. This makes the trade-off visible and reviewable later.
5. **Numbers, not adjectives.** Give a monthly fixed cost (each service, plan name, price) and a cost per customer (API, email/SMS, storage, bandwidth, compute, payment fees, human minutes). Then compute at today's size, 10x and 100x. Show the arithmetic and the assumptions.
6. **Check vendor terms live.** For each external service, open its current pricing and terms pages and record: is commercial use allowed on the plan we intend, hard limits, what happens over the limit (blocked, throttled, or billed), monthly price, date checked, and the URL. Training data goes stale; pricing pages change monthly. If you cannot open the page, mark it `NEEDS CONFIRMATION`.
7. **Run the lifecycle and risk pass** using `references/lifecycle-risk.md`. This is mandatory. It is the part owners almost never think about until it hurts.
8. **End with the owner to-do list**: things only a human can do (contracts, accounts, keys, filings, payments), in dependency order, each with a rough number of days and what it unblocks.
9. **Stop before building.** Present the blueprint and the open questions. Code starts after the owner has answered the blockers.

Do not paste secret values anywhere in the blueprint. Refer to secrets by name and where they live.

Write the blueprint to `docs/blueprint/<product-or-feature>-<YYYY-MM-DD>.md` unless the project has its own convention. Write in the owner's language; keep brand and UI strings as they are.

## The sections (summary)

Full prompts for each section are in `references/sections.md`. Read it when you fill the template.

1. **Product and customer.** Who, what problem, at what price. First segment, first region, first plan. Words we never use and promises we never make.
2. **Price and cost.** Prices and plans; cost per customer; monthly fixed cost; free-tier caps for anything we give away (a dollar cap per month and the behavior when it is hit); break-even; how we never lose money on a free user.
3. **Tech stack.** One home by default; justify any split. Per-service table (see step 6). Where secrets live and who creates them. Runaway-cost guards: one global counter across all instances, caching, provider-side spend caps, and a kill switch that works on THIS host (test it). Backup and restore test, monitoring and alerts, how to shut the service off fast.
4. **Legal and money.** Entity, a business address that is not a home, tax ID (EIN in the US), bank, insurance, sales tax/VAT or a merchant of record, Terms, Privacy, Acceptable Use, refunds, accessibility, SMS registration (A2P 10DLC in the US), commercial email rules (CAN-SPAM, plus GDPR/PECR for EU/UK), copyright takedown agent (DMCA), industries we refuse, and the list of items a lawyer must review.
5. **Marketing and brand.** Name and trademark search, domain, tagline, visual system, the path entry offer → sign-up → retention, and where the first 10 customers come from.
6. **Operations.** Manual work and minutes per customer, actions that need human approval (sending, publishing, charging, deleting), how customers reach us and our response target.
7. **Lifecycle and risk.** From `references/lifecycle-risk.md`, every row answered with: our policy, where it is implemented (code, terms, or process), and status.
8. **Owner to-do list.** Ordered, with rough days and dependencies.

## Rules of thumb that catch most problems

- A free plan that forbids commercial use is not a free plan for a business. Check this first for every host, database, email, and analytics service.
- A spend cap that lives in memory on a serverless or edge host is not a cap; each instance counts separately. Use a shared store or the provider's own limit.
- Pick the host for where the product will be in 12 months (payments, images, traffic), not for the fastest first deploy. Price the migration you would face if you are wrong.
- Every promise in the Terms or Privacy Policy must match what the code actually does. A policy describing a process you do not run is a liability.
- Anything that sends, publishes, charges, or deletes on behalf of a customer needs a cap, a log, and an off switch.
- Legal templates are drafts, not legal advice. Mark what a lawyer must review.

## Review points

Re-run the skill (update the same blueprint, keep a dated changelog at the bottom) when any of these happen:
- before public launch
- at the 10th paying customer
- before any price change
- before adding a new external service or moving hosts
- after any incident, dispute, or legal complaint

At review time, re-open vendor pricing and terms pages and update the dates.

## Output checklist (self-check before presenting)

- [ ] All 8 sections filled; no silent gaps
- [ ] Every decision lists a rejected option and reason
- [ ] Fixed cost, per-customer cost, and 10x/100x numbers shown with assumptions
- [ ] Every external service has commercial-use, limits, overage behavior, price, date checked, URL
- [ ] Kill switch and spend caps are described for this specific host, with a test
- [ ] Every lifecycle and risk row answered
- [ ] All `NEEDS CONFIRMATION` items collected as questions
- [ ] Owner to-do list ordered with days
- [ ] No secret values, no personal home address or personal names in public docs

## Files

- `assets/blueprint-template.md` — the fill-in output template. Copy it and fill it.
- `references/sections.md` — detailed prompts for sections 1–6 and 8.
- `references/lifecycle-risk.md` — the mandatory lifecycle and risk catalog, modeled on how mature services handle each case.
- `references/vendor-check.md` — how to verify a vendor's plan, terms, and limits, and the table format.
- `references/why-this-exists.md` — the anonymized case study.
- `references/prompt.md` — copy-paste prompt for kicking off with any AI.

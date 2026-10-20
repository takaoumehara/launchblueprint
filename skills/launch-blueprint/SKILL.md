---
name: launch-blueprint
description: Produce a full-view launch blueprint at kickoff AND keep thinking ahead during the work for any new product, app, SaaS, paid feature, marketplace, or big feature. Kickoff covers product, pricing and unit cost, tech stack (free-plan commercial use, caps, kill switches), legal and money, marketing, operations, the full customer lifecycle and risk, and an ordered owner to-do list. Mid-work it runs foresight procedures - decision look-ahead (2-3 moves), ask-preflight before the owner touches a screen, pre-mortem, "not asked but important" digest, critical-path calendar. Use when someone says "let's build", "new idea", "kickoff", "add payments", "go live", "pick a host", "is this free tier OK", "launch checklist", or mid-work says "decided", "choose", "buy domain", "register", "set up account/token/env var", "screenshot", "merge", "deploy", "what am I missing", "何か見落としは", "決めた", "設定して", "スクショ", "マージ". Also before launch, at the 10th customer, before a price change, before adding any external service.
---

# Launch Blueprint

One document, written before the first line of code, that looks at the idea the way a whole company would: product, finance, engineering, legal, marketing, support, and risk. Then a set of habits that keep looking ahead while the work happens. The owner usually only asks about the part in front of them. This skill exists to cover the parts they did not ask about — at kickoff and continuously during the work.

Read `references/why-this-exists.md` once if you want the motivating cases. In short: one product had to be migrated because its host's free plan forbade commercial use and its cost caps did not work; another lost days mid-project to a daily build cap, a domain change that touched every registered URL, a secret in a screenshot, and a filing that published a home address. The kickoff blueprint catches the first kind. `references/foresight.md` catches the second.

## How to work (kickoff)

1. **Gather what exists.** Read the repo (README, package files, env example, infra config, any CLAUDE.md or docs) and the conversation. Note what is already decided.
2. **Fill every section** of the template in `assets/blueprint-template.md`. Do not skip a section because it seems early. If something truly does not apply, write `N/A — <reason>`.
3. **Never guess.** Anything you cannot verify from the repo, the owner, or a primary source you actually opened gets `NEEDS CONFIRMATION` plus the exact question. Collect all of these into the Open Questions list at the end and ask them in one batch. A confident wrong answer about a free tier or a law is what this skill is meant to prevent.
4. **Every decision has a rejected option.** For each choice, write at least one option you did not pick and a one-line reason. This makes the trade-off visible and reviewable later.
5. **Numbers, not adjectives.** Give a monthly fixed cost (each service, plan name, price) and a cost per customer (API, email/SMS, storage, bandwidth, compute, payment fees, human minutes). Then compute at today's size, 10x and 100x. Show the arithmetic and the assumptions.
6. **Check vendor terms live.** For each external service, open its current pricing and terms pages and record: is commercial use allowed on the plan we intend, hard limits (including daily build/deploy caps against the agents' push rate), what happens over the limit, whether inputs are used for training, how narrowly a token can be scoped, monthly price, date checked, and the URL. Training data goes stale; pricing pages change monthly. If you cannot open the page, mark it `NEEDS CONFIRMATION`. Format in `references/vendor-check.md`.
7. **Run the lifecycle and risk pass** using `references/lifecycle-risk.md`. This is mandatory. It is the part owners almost never think about until it hurts.
8. **Run the day-one foresight set** from `references/foresight.md`: the critical-path calendar (E: earliest launch date from external lead times), a pre-mortem (C), the domain/DNS table and URL registry (template §9), and one batched agent-environment request (F1). Walk the checklist in `references/field-lessons.md`.
9. **End with the owner to-do list**: things only a human can do (contracts, accounts, keys, filings, payments), in dependency order, each with a rough number of days and what it unblocks.
10. **Stop before building.** Present the blueprint and the open questions. Code starts after the owner has answered the blockers.

Do not paste secret values anywhere in the blueprint. Refer to secrets by name and where they live.

Write the blueprint to `docs/blueprint/<product-or-feature>-<YYYY-MM-DD>.md` unless the project has its own convention. Write in the owner's language; keep brand and UI strings as they are.

## During the work (continuous)

The blueprint is not finished at kickoff. These triggers fire throughout the project. When one fires, run the named procedure from `references/foresight.md` before replying. Keep each output short.

| Trigger | Run |
|---|---|
| Deciding anything (owner says "decided", "let's use X", or you choose a host, library, plan, name, data model) | **A** Decision look-ahead: 3 lines — requires next (2–3 moves), also changes (URLs, secrets, legal docs, cost, other products), who decides by when |
| Asking the owner to do anything on a screen, or to send a screenshot | **B** Ask-preflight: can the agent do it via API instead; predict the screen; "if you don't see X, it means Y — do Z"; exact names; fields to hide; verification step |
| Sending UI steps (token, env var, DNS, sign-up) | **B** again; the first credential is human-made, the rest the agent automates |
| Adding a service | **A** + **F1** batched environment request + `references/vendor-check.md` live check |
| Buying or registering anything (domain, entity, trademark, phone number, listing) | **A** + **B** + **E** critical-path update + `references/lifecycle-risk.md` §17 (where the address becomes public, what mail arrives after) |
| Merging a PR | **F2** rule 4: every reviewer finished — humans, review bots, CI, deploy previews |
| A second agent or person joins the repo | **F2** multi-agent rules before the first parallel commit |
| Milestone report, status update, PR summary | **D** "Not asked but important" digest, top 3 |
| Before launch, before an irreversible step | **C** pre-mortem, five causes with mitigations; re-run **E** |
| Owner asks "what am I missing" / "何か見落としは" | **C** + **D** over the current state; walk `references/field-lessons.md` |

Record decisions, deadlines, and pre-mortem rows in template §9 so they survive the conversation.

## The sections (summary)

Full prompts for each section are in `references/sections.md`. Read it when you fill the template.

1. **Product and customer.** Who, what problem, at what price. First segment, first region, first plan. Words we never use and promises we never make.
2. **Price and cost.** Prices and plans; cost per customer; monthly fixed cost; free-tier caps for anything we give away (a dollar cap per month and the behavior when it is hit); break-even; how we never lose money on a free user.
3. **Tech stack.** One home by default; justify any split. Per-service table (see step 6). Where secrets live and who creates them. Runaway-cost guards: one global counter across all instances, caching with full-dimension keys, provider-side spend caps checked before free quotas, and a kill switch that works on THIS host (test it). Owner-entered config names and verification. One batched agent-environment request. Multi-agent rules. Backup and restore test, monitoring and alerts, how to shut the service off fast.
4. **Legal and money.** Entity, a business address that is not a home, tax ID (EIN in the US), bank, insurance, sales tax/VAT or a merchant of record, Terms, Privacy, Acceptable Use, refunds, accessibility, SMS registration (A2P 10DLC in the US), commercial email rules (CAN-SPAM, plus GDPR/PECR for EU/UK), copyright takedown agent (DMCA), industries we refuse, and the list of items a lawyer must review.
5. **Marketing and brand.** Name and trademark search, domain, tagline, visual system with written visual prohibitions and a guard test, the path entry offer → sign-up → retention, and where the first 10 customers come from.
6. **Operations.** Manual work and minutes per customer, actions that need human approval (sending, publishing, charging, deleting), how customers reach us and our response target, merge only after all reviewers finish.
7. **Lifecycle and risk.** From `references/lifecycle-risk.md`, every row answered with: our policy, where it is implemented (code, terms, or process), and status.
8. **Owner to-do list.** Ordered, with rough days and dependencies, headed by the critical-path calendar.
9. **Foresight.** Proposals, pre-mortem, decision deadlines, URL registry, domain/DNS table. Updated throughout the work.

## Rules of thumb that catch most problems

- A free plan that forbids commercial use is not a free plan for a business. Check this first for every host, database, email, and analytics service.
- A spend cap that lives in memory on a serverless or edge host is not a cap; each instance counts separately. Use a shared store or the provider's own limit.
- Pick the host for where the product will be in 12 months (payments, images, traffic), not for the fastest first deploy. Price the migration you would face if you are wrong.
- Every promise in the Terms or Privacy Policy must match what the code actually does. A policy describing a process you do not run is a liability.
- Anything that sends, publishes, charges, or deletes on behalf of a customer needs a cap, a log, and an off switch.
- Legal templates are drafts, not legal advice. Mark what a lawyer must review.
- Before finalizing a blueprint or answering a strategy question, run `references/proactive-tools.md` and point out any high-fit tool or service not yet proposed (exhaustive survey of the full landscape with a search log, tools already owned considered first, all serious candidates compared, with live cost, resale terms, and legal notes).
- Think across the whole stack when choosing any tool: check each candidate against the current AND planned infrastructure (hosting migrations, existing accounts, runtime limits, data and secrets, cost at scale, lock-in). See step 3b of `references/proactive-tools.md`.
- External lead times set the launch date, not coding time. Start every item with a lead time over a week in week one.
- Decide the canonical domain before wiring anything that registers a URL. Keep the URL registry from day one.
- Never ask for a screenshot without saying which fields to hide. If a secret appears anyway, say so and give rotation steps.
- Before asking a human to click, ask whether the agent can do it via API with a credential that already exists.

## Review points

Re-run the skill (update the same blueprint, keep a dated changelog at the bottom) when any of these happen:
- before public launch
- at the 10th paying customer
- before any price change
- before adding a new external service or moving hosts
- after any incident, dispute, or legal complaint

At review time, re-open vendor pricing and terms pages and update the dates, re-run the pre-mortem, and refresh the critical-path calendar.

## Output checklist (self-check before presenting)

Kickoff:
- [ ] All 9 sections filled; no silent gaps
- [ ] Every decision lists a rejected option and reason
- [ ] Fixed cost, per-customer cost, and 10x/100x numbers shown with assumptions
- [ ] Every external service has commercial-use, limits, deploy/build caps vs. agent push rate, training-on-inputs, token scope, overage behavior, price, date checked, URL
- [ ] Kill switch and spend caps are described for this specific host, with a test, and checked before any free quota
- [ ] Every lifecycle and risk row answered
- [ ] All `NEEDS CONFIRMATION` items collected as questions
- [ ] Owner to-do list ordered with days; earliest launch date stated from the critical-path calendar
- [ ] Domain/DNS table and URL registry started; canonical domain decided
- [ ] Pre-mortem with five causes and mitigations
- [ ] One batched agent-environment request sent (scope and blast radius stated)
- [ ] Multi-agent rules agreed if more than one agent or person will commit
- [ ] Visual prohibitions written and a guard test planned
- [ ] `references/field-lessons.md` walked; each row answered or N/A
- [ ] No secret values, no personal home address or personal names in public docs

During the work:
- [ ] Every decision in this reply has its 3-line look-ahead
- [ ] Every screen instruction has "if you don't see…" branches, exact names, fields to hide, and a verification step
- [ ] Any report or milestone ends with the "Not asked but important" top 3
- [ ] Any merge waited for every reviewer to finish
- [ ] Any filing, purchase, or registration was preceded by the public-exposure note and a critical-path update

## Files

- `assets/blueprint-template.md` — the fill-in output template. Copy it and fill it.
- `references/sections.md` — detailed prompts for sections 1–6 and 8.
- `references/lifecycle-risk.md` — the mandatory lifecycle and risk catalog, modeled on how mature services handle each case.
- `references/vendor-check.md` — how to verify a vendor's plan, terms, caps, and token scope, and the table format.
- `references/foresight.md` — the continuous procedures: decision look-ahead, ask-preflight, pre-mortem, "not asked but important" digest, critical-path calendar, batched environment request, multi-agent rules.
- `references/field-lessons.md` — fifteen anonymized traps from a real project as a checklist: trap, how to check, when.
- `references/proactive-tools.md` — the pain × layer scan for proposing tools and services before being asked, at kickoff and mid-work.
- `references/why-this-exists.md` — the anonymized case studies.
- `references/prompt.md` — copy-paste prompt for kicking off with any AI.

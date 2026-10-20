# Section prompts (1–6, 8)

Each answer: decision, rejected option(s) + reason, source or `NEEDS CONFIRMATION`.

## 1. Product and customer
- One-sentence product: who, what problem, at what price.
- First segment, first region, first plan only. Everything else is later.
- Jobs the customer hires it for; what they use today instead.
- Words we never use and promises we never make (uptime, security, income, legal compliance).
- Out of scope list.

## 2. Price and cost
- Plans, prices, billing period, platform fees, add-ons.
- Cost per customer per month: hosting compute, DB, storage, bandwidth, email, SMS, third-party APIs, payment fees (% + fixed), support minutes × hourly rate.
- Monthly fixed cost: every service, plan name, price. Total.
- Free things: dollar cap per month (global), per-user caps, what happens when the cap is hit (queue, degrade, stop).
- Break-even: customers needed to cover fixed cost. Gross margin per plan.
- Taxes collected vs. remitted; who is merchant of record.
- Assumptions with confidence level (low/med/high). Ask for unknowns.

## 3. Tech stack
- Default: one home (one provider for app, functions, storage, DB where sensible). If split, the reason and the cost of the split.
- Per-service table: see `vendor-check.md`.
- Proactive scan: run `proactive-tools.md` across every pain × layer and propose high-fit APIs, turnkey, or white-label options the owner has not asked about (exhaustive survey with search log; reuse owned tools first).
- Whole-stack fit: list current and planned infrastructure (including any hosting migration) and check every tool against both: runtime limits, webhooks and signatures, data and secrets location, cost at 1/10/100 customers, lock-in and exit (`proactive-tools.md` step 3b).
- Choose the host for the 12-month shape (payments, media, traffic, background jobs, regions), and estimate migration effort if wrong.
- Secrets: list by name, where stored (host env, secret manager), who creates each, rotation, never in repo or chat.
- Runaway-cost guards: global counter in a shared store; per-user and per-IP rate limits; caching; provider-side spending caps or budget alerts; kill switch (env flag or config) verified to work on this host and tested.
- Backup frequency, retention, restore drill date; monitoring (errors, uptime, cost), alert recipients; one-command or one-toggle shutdown and maintenance mode.
- Environments: preview vs production data separation; cleanup of preview resources.

## 4. Legal and money
- Entity type and jurisdiction; registered agent; business address that is not a home (virtual office / agent address).
- Tax ID (EIN in US), business bank account, bookkeeping.
- Insurance: general liability, tech E&O, cyber — get quotes or mark NEEDS CONFIRMATION.
- Sales tax / VAT / GST: where we have obligations; or use a merchant of record.
- Documents: Terms, Privacy, Acceptable Use, Refund policy, Cookie notice, DMCA policy, Accessibility statement, Seller terms if marketplace.
- Messaging: US SMS needs A2P 10DLC brand and campaign registration; email marketing needs CAN-SPAM (physical address, unsubscribe) and consent for EU/UK.
- DMCA designated agent registration (US) if hosting user content.
- Industries and uses we refuse (also needed by payment processors).
- Lawyer review list: liability cap, arbitration, marketplace liability, privacy, any regulated area.
- The public operator name; keep individuals' personal names and home addresses out of public pages if the owner wishes.

## 5. Marketing and brand
- Name, trademark search (USPTO / EUIPO / local), domain(s), social handles.
- Tagline, positioning against alternatives, visual system (design system tokens).
- Funnel: entry offer → sign-up → activation event → paid → retention; metric for each step.
- First 10 customers: named channels and people, not "social media".
- Launch channels and what we will not do (spam, fake reviews).

## 6. Operations
- Manual tasks per customer and minutes each; which can be automated later.
- Actions needing human approval: sending to customers, publishing, charging, refunding, deleting.
- Support intake: address, form, response target, escalation; abuse intake separate.
- Runbooks: incident, refund, takedown, data request, account recovery.
- Weekly metrics review.
- Ops tooling scan: use `proactive-tools.md` for intake/phone, messaging, booking, reviews, and back-office. Re-scan on its triggers (new pain, competitor feature, new tool release, quarterly).

## 8. Owner to-do list
- Only things a human must do: sign contracts, create accounts, verify identity, pay, file registrations, create API keys, approve legal docs.
- Format: `# | task | depends on | rough days (incl. waiting) | unblocks`.
- Order by dependency, then by lead time (long-wait items like entity, EIN, 10DLC, trademark, bank first).

# Proactive tools scan

The owner only asks about what is in front of them. This scan exists so the agent proposes tools and services that fit the business **before being asked**, after comparing alternatives.

Motivating miss: for local-service businesses, missed calls were a core pain, yet an AI phone receptionist (developer platforms such as Bland AI / Retell / Vapi, or turnkey answering services) was never proposed. Only a missed-call text-back was built. A scan of the "intake / phone" layer against that pain would have surfaced it on day one.

## When to run

- Before finalizing any blueprint (section 3 and section 6).
- Before answering any strategy, pricing, or "what should we add" question.
- Re-scan triggers:
  - a new customer pain is discovered (interviews, support tickets, reviews, lost deals)
  - a competitor ships or advertises a feature we lack
  - a major model, API, or tool release in a relevant category
  - a vendor in our stack changes price or terms
  - quarterly, even if nothing seems to have changed

## Procedure

1. **List core customer pains.** Use the customer's words, ranked by cost to them (lost revenue, hours, stress). Example: "can't answer the phone on a job", "no time to ask for reviews".
2. **Build the pain × layer grid.** For each pain, check every product layer:
   acquisition · intake/phone · messaging (SMS/email/chat) · booking/scheduling · reviews/reputation · content/website · ops/back-office (invoicing, CRM, dispatch) · AI assistance.
   Each cell is either a candidate opportunity or `N/A — <reason>`.
3. **Start with what the business already has.** List accounts, tools, and code already owned (for example an existing Twilio account, the current host, email provider, CRM, or a built feature such as missed-call text-back). Check whether extending one of them solves the pain before adding anything new.
4. **Survey the whole landscape for every non-N/A cell.** Do it live; do not rely on memory. Enumerate every kind:
   - APIs / developer platforms (we build on them)
   - platforms and marketplaces (app stores and integrations of tools already in use)
   - turnkey SaaS (customer buys directly; we recommend or refer)
   - white-label / reseller / agency programs (we package and resell)
   - open-source / self-hosted options
   - existing accounts and tools already owned (from step 3)
   Keep searching (vendor directories, "X alternatives" lists, review sites, competitor pages, community threads, changelogs) until new searches stop turning up significant options. Record every search query and source used in a `Search log` under the table. Then compare **all serious candidates**, not a sample, and list briefly the ones dropped and why.
5. **Judge build vs. resell vs. refer.** Weigh margin, time to ship, support load, lock-in, and whether it strengthens our core offer or distracts from it.
6. **Propose the best fit unprompted.** Write the pick, at least one rejected option with the reason, the cost per customer, the plan or price change it implies, and the first cheap test. Anything that costs money or signs up for a service waits for the owner's OK.
7. **Record it.** Add it to the blueprint (sections 2, 3, 6, and the open questions). Picked services also go into the `vendor-check.md` table.

## Comparison table

Same style as `vendor-check.md`, with extra columns for proposals.

| Pain / layer | Option | Type (API / turnkey / white-label) | What it does for the pain | Unit cost | $/month (1 customer / 10 / 100) | Commercial use / resale allowed? | Legal notes | Lock-in / export | Build vs. resell judgment | Date checked | Pricing / terms URL |
|---|---|---|---|---|---|---|---|---|---|---|---|

Close each group with: `Pick: X over Y, Z because ...`

Search log (required): `date | query or source | new serious options found`. Stop only when the last few searches found none.

## Legal notes to check by category

- **AI voice calls:** US TCPA (no AI/prerecorded calls to people without prior express consent; the FCC treats AI voices as "artificial"); state call-recording consent laws (some states require all parties to consent); AI disclosure at the start of the call; never promise prices or appointments outside fixed rules.
- **SMS:** A2P 10DLC registration, opt-in records, STOP handling, quiet hours.
- **Email:** CAN-SPAM; GDPR/PECR for EU/UK.
- **Reviews:** FTC rules on fake reviews and review gating; platform review policies (for example, no incentives).
- **Data from platforms:** platform terms of service on scraping and automation; privacy law for any personal data collected.
- **Resale:** whether the vendor's terms allow resale or white-label use, or need a partner agreement.

## Anti-patterns (do not propose)

- Outbound auto-calls, auto-texts, or auto-DMs to people who did not opt in.
- Scraping social platforms, groups, or marketplaces, or selling scraped lists.
- Running bot or automated accounts inside communities (Facebook Groups, Nextdoor, Reddit, WhatsApp groups). Instead, have the human owner take part with their own account, and help with alerts and draft replies.
- Proposing a tool from memory without checking its live price and terms.
- Adding a new tool where the existing stack already covers the job. Prefer extending what exists.
- Proposing from a short sample instead of the full landscape, or without a search log.
- Proposing without a cost per customer.
- Adding a new vendor before checking what the business already owns.

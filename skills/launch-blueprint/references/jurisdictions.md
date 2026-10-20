# Regions and jurisdictions pass

Triggered by three facts: where the entity is registered, where the owner lives, and where users and customers will be. Anything on the open internet is reachable from every region, so "we only market domestically" does not settle it. Run this at kickoff and again when any of the three facts changes, or when the first user from a new region signs up.

Nothing here is legal advice. Every law, threshold and deadline below changes; verify each with a primary source and a lawyer before relying on it, and mark it `NEEDS CONFIRMATION` until then.

## The decision per region

For each region users can reach, pick one and write why:

| Decision | Meaning | Typical reason |
|---|---|---|
| Serve fully | Sign-up, payment and all features open | Obligations understood and covered |
| Serve with limits | Public pages and sign-up open, but no payment, no AI feature, no user publishing, or no minors | One obligation is not ready yet (for example VAT or an EU representative) |
| Block sign-up and payment | Public pages viewable; sign-up and checkout refused | Obligations outweigh expected revenue for now |

Record it in the Regions table of the blueprint: region, decision, why, the obligations it triggers, status. Revisit at every review point.

## What to check per region

Use this as a checklist. Each item becomes a row in the Regions table's obligations column or `N/A — <reason>`.

### EU/EEA
- GDPR: lawful basis per processing purpose; a data processing agreement with every processor; international transfer mechanism (standard contractual clauses or an adequacy decision) for every vendor outside the EU; an Art. 27 representative when the controller has no EU establishment; data subject request process with a deadline; breach notice timelines (regulator, then affected people where required).
- ePrivacy and cookie consent: analytics, session replay, embedded players and marketing pixels need consent before they load. Strictly necessary cookies do not.
- VAT on digital services: non-EU sellers generally owe VAT from the first sale, registered through the non-union One Stop Shop scheme, or use a merchant of record that handles it. Check the current threshold rules for EU-established sellers separately.
- Digital Services Act for any service hosting user content: notice-and-action process, statement of reasons to the user whose content is removed, a single point of contact, transparency reporting. Duties grow with size; check which tier applies.
- EU AI Act transparency duties for AI features: telling users they are interacting with AI, labelling AI-generated content where required, and whether any use case falls into a regulated category.
- Consumer withdrawal right for digital content: the 14-day right and the express-consent waiver wording at the start of delivery.
- Accessibility: the European Accessibility Act applies to many consumer-facing digital services; check scope and exemptions.
- Consumer-facing terms: unfair-terms rules limit liability caps and arbitration clauses for consumers.

### UK and Switzerland
- Each has its own GDPR equivalent (UK GDPR and the Data Protection Act; the Swiss FADP), its own representative requirement for foreign controllers in some cases, and its own transfer rules.
- Each has its own VAT on digital services with its own registration rules and thresholds.
- UK cookie rules under PECR; UK Online Safety Act duties for services with user content, scoped by size and risk.

### US
- Sales tax on SaaS and digital goods is state by state: some tax it, some do not, and economic nexus thresholds (sales or transaction counts) trigger registration in a state without a physical presence. Or use a merchant of record.
- State privacy laws: thresholds based on revenue, number of residents whose data is processed, or data-sale revenue. Below the threshold the law may not apply yet; record when it would.
- Auto-renewal and cancellation: state automatic-renewal laws and the FTC's rules on negative option and "click to cancel". Clear disclosure, express consent, renewal reminders, cancellation as easy as sign-up.
- COPPA if children under 13 may use the service or if it is directed at them.
- CAN-SPAM for commercial email: physical postal address, working unsubscribe honoured within the deadline, no misleading headers.
- A2P 10DLC brand and campaign registration before sending application-to-person SMS.
- DMCA designated agent registration with the Copyright Office, plus the published notice and counter-notice process.
- Accessibility: ADA and state law exposure for inaccessible sites.

### The owner's home country
- Consumer protection and commerce disclosure laws usually apply when the product targets that market, and sometimes when the operator is simply established there. Examples: a required operator identity and address page, specified commercial transaction disclosures, cooling-off rights, local invoice requirements.
- Decide and write down whether the product targets the home market at all. If it does, the home-country disclosures go into the legal section; if it does not, record why that position is defensible.
- Domestic data protection law, consumption tax or VAT, and e-commerce rules apply to the entity regardless of where users are.

### Any other region with real users
- Run the same questions: data protection law and representative requirements, consumption tax on digital services, consumer withdrawal rights, content-hosting duties, minors, AI rules, sanctions and export controls on payments.

## Merchant of record versus own registrations

A real decision with trade-offs; give the recommended option and the alternative, and check the six angles.

| Angle | Merchant of record | Own registrations |
|---|---|---|
| Cost | Higher per-transaction fee, no registrations to maintain | Lower fees; registration, filing and accountant costs per jurisdiction |
| Legal | MoR is the seller of record and handles tax, invoices, and often refunds and disputes; read what they do not cover | You owe every registration, filing and audit response |
| Operations | One payout, one statement; less control over checkout and refunds | Full control; recurring filings in every jurisdiction with sales |
| Marketing | Their name may appear on the card statement and receipts | Your brand on everything |
| Implementation | Their checkout and webhooks; migration cost if you leave | Your payment provider's tax tools plus your own logic |
| UX | Sometimes a redirect or a hosted checkout | Native checkout |

Rule of thumb: start with a merchant of record when selling in more than one tax jurisdiction with a small team; re-evaluate at the price-change and 10th-customer review points. Verify the MoR's own terms live; coverage and fees change.

## How to block a region, and what blocking does not do

- Block by IP geolocation at the edge and by payment-card country at checkout. Both are approximate: VPNs, travellers, and cards issued elsewhere get through. Say so in the blueprint and do not call it compliance.
- Keep public pages viewable; refuse sign-up and checkout with a plain message that names the region and the reason.
- Record the block decision and the date in the Regions table and the Decisions log.
- Obligations that remain even while blocking: a data request from someone who signed up anyway must still be honoured; a breach still has to be notified to anyone affected; content takedown notices still arrive; tax may still be owed on sales that slipped through. Decide how each is handled and log it.
- Revisit the block when the first support request or sign-up attempt from that region arrives; that is a fact change.

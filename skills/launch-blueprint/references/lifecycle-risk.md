# Lifecycle and risk catalog (mandatory)

For every row, write: **our policy**, **where it lives** (code / Terms / Privacy / runbook), **owner action needed**, **status** (done / planned / NEEDS CONFIRMATION). "We'll deal with it later" is not a policy; "out of scope until N customers, because X" is.

The "how mature services do it" notes describe common patterns at large providers (email, payment, website-builder, link-in-bio, app-store and commerce platforms). They are patterns to adapt, not legal advice. Verify current specifics against the provider's own published pages if you cite them, and verify any law or threshold with a primary source and a lawyer.

## Contents
1. Inactive accounts
2. Cancellation, refunds, downgrade
3. Data export and deletion
4. Deceased or incapacitated users
5. Abuse, illegal content, copyright takedown
6. Chargebacks and disputes
7. Outages, status communication, SLA and compensation
8. Liability caps, indemnity, disputes, avoiding lawsuits
9. Minors
10. Privacy laws and regions
11. Price and terms changes
12. Service sunset
13. Account security and takeover
14. Data breach notification
15. Platform lock-in and migration plan
16. Scale cost at 10x / 100x
17. Other easily forgotten items
18. Money between users: marketplaces, tickets, bookings
19. AI features

---

## 1. Inactive accounts
- Define "inactive" (no sign-in for N months) separately for free and paid accounts. Paid accounts are usually never closed for inactivity while payment continues.
- Notice schedule before any action: several emails over months (for example at 90, 30, 7 days), to every address on file, with a one-click "keep my account" link.
- What happens: content unpublished first, then deleted after a further grace period; usernames/handles released only after a cooling-off period to prevent impersonation.
- Mature pattern: large email and cloud providers delete long-inactive free accounts after a published period and send repeated warnings first; social-link services reclaim inactive handles.
- Put the period in the Terms so it is enforceable, and log the notices you sent.

## 2. Cancellation, refunds, downgrade
- Self-serve cancel, as easy as sign-up (required by US "click to cancel" style rules in several states and at federal level, and by EU consumer law; verify current status).
- When does access end: end of paid period (common) or immediately.
- Refund policy: none / prorated / within N days; EU 14-day withdrawal right for digital content unless the user expressly waives it on starting (`jurisdictions.md`).
- Downgrade: what happens to content above free limits (kept read-only, hidden, never silently deleted).
- Failed payments (dunning): retry schedule, grace period, notices, then downgrade.

## 3. Data export and deletion
- Export in a usable format (JSON/CSV/zip of media) on request or self-serve.
- Account deletion: self-serve, with a short undo window; then hard delete from primary DB, object storage, search indexes, caches, analytics, email lists, and backups on their rotation schedule. Document the backup lag in the Privacy Policy.
- What is retained and why (invoices and transaction records for tax law and disputes, abuse logs) and for how long. Anonymise the rest: keep the record, drop the identity. Receipts must survive the deletion of the account that issued or received them.
- Deleting a user must not break other users (shared content, guest lists, payouts owed, tickets bought from a deleted organizer; see §18).

## 4. Deceased or incapacitated users
- A request path for next of kin or legal representative, with proof (death certificate, authority document).
- Options: close account, export for heirs (only where law allows), memorialize public pages.
- Optional: a "legacy contact" or inactive-account manager the user sets in advance (mature email providers offer this).
- Paid subscriptions: stop billing, refund policy for unused time.

## 5. Abuse, illegal content, copyright takedown
- Acceptable Use Policy listing forbidden content and uses (illegal content, CSAM — must be reported in the US to NCMEC, harassment, spam, phishing, malware, impersonation, scams, regulated goods).
- Report button / abuse email; response targets; who reviews; how to suspend fast.
- US copyright: register a DMCA designated agent with the Copyright Office (small fee, renewal period applies), publish the notice and counter-notice process, repeat-infringer policy. EU: Digital Services Act notice-and-action, statement of reasons, point of contact (`jurisdictions.md`).
- Link and URL safety for user-supplied links (safe-browsing checks; check the API's commercial-use terms), rate limits on sign-up and sending to stop spam abuse of your domain. URL-fetching features need SSRF protection (`security.md` §4).
- Keep evidence logs; never delete evidence of crimes you were told about.

## 6. Chargebacks and disputes
- Who is liable: you, or the seller on a marketplace (connected-account model). Write it in the Terms.
- Clear billing descriptor that matches the brand (DBA or trade name), receipts, and easy refunds reduce disputes.
- Evidence kit: sign-up record, terms acceptance, usage logs, delivery proof.
- Dispute rate thresholds at card networks (roughly ~1%) can freeze your account; monitor them.
- Fraud tools: card checks, velocity limits, holding payouts for new sellers.

## 7. Outages, status communication, SLA and compensation
- Status page or at least a status channel; who posts, within how many minutes.
- Monitoring and alerting that reaches a human, including scheduled jobs that fail silently (`security.md` §6).
- SLA: for an early product, usually none ("as is"); if any, credits only, capped at fees paid for the period, no cash. Mature providers limit remedies to service credits.
- Incident write-up template; customer notice for data-affecting incidents.
- Dependency outages (host, DB, email, AI provider): what degrades, what stays up.
- Deploy cap exhausted: counts as an outage of the ability to fix; the emergency deploy path is a runbook.

## 8. Liability caps, indemnity, disputes, avoiding lawsuits
- Limitation of liability: capped at fees paid in the last 12 months (or a small fixed amount for free users); exclude indirect damages, as far as local law allows.
- Warranty disclaimer ("as is").
- User indemnity for their content and use.
- Governing law and venue; arbitration and class-action waiver are common in the US but limited for consumers in the EU/UK and some states — lawyer review.
- Run the business through an entity; keep personal and business money and vendor accounts separate; consider general liability and tech E&O / cyber insurance.
- Avoid claims you cannot prove in marketing ("secure", "never down", "GDPR certified").
- Clickwrap acceptance with stored version and timestamp.

## 9. Minors
- Minimum age (13 in the US due to COPPA; 16 by default in parts of the EU unless parental consent, lower in some member states; many services choose 18 for payments or marketplaces). Verify with a primary source and a lawyer.
- Age gate at sign-up; process when you learn a child signed up (delete).
- No targeting children unless you build full COPPA compliance.
- Even when not targeted: decide what happens when minors are found using it, and whether paid features or user publishing are blocked for them.

## 10. Privacy laws and regions
- Map data: what personal data, why, where stored (region), which sub-processors, retention, what is sent to AI providers.
- Run the regions pass in `jurisdictions.md`: for each reachable region, serve / limit / block, and the obligations that follow (GDPR and representatives, UK and Swiss equivalents, US state laws and thresholds, the owner's home-country rules).
- Cookie/analytics consent where required; session replay and analytics do not load before consent in consent regions.
- Rights-request process with a deadline (e.g., 30/45 days) and a log; honoured even for users from blocked regions who got in anyway.

## 11. Price and terms changes
- Advance notice by email (commonly 30 days; longer for price increases on annual plans), effective at next renewal, with right to cancel.
- Grandfathering policy for early users.
- Keep old versions of Terms with dates; record who accepted which version.

## 12. Service sunset
- Notice period (often 60–180 days), export tools available throughout, refunds for prepaid time, redirects or handle release plan.
- Decide in advance who keeps the domain and data, and that data is deleted at the end.

## 13. Account security and takeover
- Passwordless or strong auth, optional 2FA, session revocation, new-device alerts.
- Email change requires confirming both old and new address, notifies the old one, and offers undo.
- Recovery path when the user lost email access, with identity proof and a delay; recovery revokes OAuth links, sessions and tokens.
- Admin access: least privilege, audit log, 2FA on every vendor console.
- Rate limits and bot protection on every auth path, not just the login page.
- Full detail and the rest of the security pass (backups without credentials, header trust, URL fetching, support-desk verification, silent job failure, fail-safe environment detection): `security.md`.

## 14. Data breach notification
- Incident response plan: contain, assess, notify.
- Legal deadlines differ: GDPR — regulator within 72 hours when required; US states — "without unreasonable delay" with varying specifics; also notify payment processor if card data involved. Verify with a primary source and a lawyer.
- A leaked backup that holds session or OAuth tokens is a breach of every account in it; see `security.md` §2.
- Prepared notice template; contact list (lawyer, insurer, vendors).

## 15. Platform lock-in and migration plan
- For each vendor: what we rely on that is proprietary, how hard it is to leave (days of work), how to export the data.
- Prefer portable formats and standard APIs; keep infra config in the repo.
- Name the trigger that would force a move (price, terms, limits, a free plan that stops fitting) and the fallback.

## 16. Scale cost at 10x and 100x
- Table: users, requests, storage, bandwidth, emails, API and AI calls → monthly cost at 1x/10x/100x.
- Point where each free tier ends and what the next plan costs.
- Confirm revenue per customer still exceeds cost per customer at each size; if free users grow faster than paid, cap free usage.

## 17. Other easily forgotten items
- Domain and DNS ownership in the company account, auto-renew on, registrar lock.
- Bus factor: who can access everything if the owner is unavailable (password manager, documented access).
- Vendor accounts in the company name with a work email on the company domain, not personal email; 2FA on each.
- Your own accounts' inactivity rules (vendors close unused accounts too).
- Email: free-tier daily send caps, SPF, DKIM, DMARC, bounce and complaint handling, reducing volume.
- Accessibility (WCAG 2.2 AA target) and the legal exposure of ignoring it (US ADA, European Accessibility Act).
- Export controls and sanctioned countries for payments.
- Trademark clearance and classes before spending on a brand.
- Records retention for taxes (typically several years).
- Company filings kept current (annual or biennial reports, agent renewal).
- Content and internationalisation: non-Latin slugs, CJK fonts, right-to-left layout, brand-voice rules for UI copy.

## 18. Money between users: marketplaces, tickets, bookings
Applies when sellers, organizers or hosts receive money from buyers through the product.
- Seller or organizer cancels, or deletes their account: who refunds buyers, from which balance, within what time; the platform's exposure if the seller's balance is empty. Deletion is blocked or deferred while obligations are open.
- Records that must be kept for tax and disputes after deletion (transactions, invoices, payout records, dispute evidence) and for how long; anonymise the rest.
- Chargebacks and disputes on a connected-account model: who is liable, who supplies evidence, how the platform recovers from the seller.
- Payouts: schedule, holds for new sellers, minimum amounts, identity verification the payment provider requires, what happens to a payout owed to a deleted or banned account.
- Fee exemptions for staff and test accounts: explicit flag, logged, never a hardcoded email list; reconcile exempt transactions monthly.
- Receipts and tickets survive the deletion of either party's account.
- Platform or seller is the merchant of record for each transaction; tax collection and invoicing follow from that (`jurisdictions.md`).

## 19. AI features
- Per-user free caps, daily and monthly; paid-tier quotas; what the user sees when a cap is hit.
- A fallback provider or a graceful "unavailable" state; the kill switch covers AI calls.
- Cost per call now and at 10x and 100x, in the scale table.
- Exactly what user data is sent to the model, whether the provider retains or trains on it (check terms live), and the Privacy Policy sentence that discloses it.
- Moderation and review of AI output before it is published or sent on the user's behalf; a report path for bad output.
- Regional AI rules from `jurisdictions.md` (for example EU AI Act transparency duties); disclose that the user is interacting with AI where required.

# Lifecycle and risk catalog (mandatory)

For every row, write: **our policy**, **where it lives** (code / Terms / Privacy / runbook), **owner action needed**, **status** (done / planned / NEEDS CONFIRMATION). "We'll deal with it later" is not a policy; "out of scope until N customers, because X" is.

The "how mature services do it" notes describe common patterns at large providers (Google, Stripe, Squarespace, Linktree, Apple, Shopify, etc.). They are patterns to adapt, not legal advice. Verify current specifics against the provider's own published pages if you cite them.

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
10. Privacy laws
11. Price and terms changes
12. Service sunset
13. Account security and takeover
14. Data breach notification
15. Platform lock-in and migration plan
16. Scale cost at 10x / 100x
17. Other easily forgotten items

---

## 1. Inactive accounts
- Define "inactive" (no sign-in for N months) separately for free and paid accounts. Paid accounts are usually never closed for inactivity while payment continues.
- Notice schedule before any action: several emails over months (for example at 90, 30, 7 days), to every address on file, with a one-click "keep my account" link.
- What happens: content unpublished first, then deleted after a further grace period; usernames/handles released only after a cooling-off period to prevent impersonation.
- Mature pattern: large email and cloud providers delete long-inactive free accounts after a published period and send repeated warnings first; social-link services reclaim inactive handles.
- Put the period in the Terms so it is enforceable, and log the notices you sent.

## 2. Cancellation, refunds, downgrade
- Self-serve cancel, as easy as sign-up (required by US "click to cancel" style rules in several states and by EU consumer law).
- When does access end: end of paid period (common) or immediately.
- Refund policy: none / prorated / within N days; EU 14-day withdrawal right for digital services unless the user expressly waives it on starting.
- Downgrade: what happens to content above free limits (kept read-only, hidden, never silently deleted).
- Failed payments (dunning): retry schedule, grace period, notices, then downgrade.

## 3. Data export and deletion
- Export in a usable format (JSON/CSV/zip of media) on request or self-serve.
- Account deletion: self-serve, with a short undo window; then hard delete from primary DB, object storage, search indexes, caches, analytics, email lists, and backups on their rotation schedule. Document the backup lag in the Privacy Policy.
- What is retained and why (invoices for tax law, abuse logs) and for how long.
- Deleting a user must not break other users (shared content, guest lists, payouts owed).

## 4. Deceased or incapacitated users
- A request path for next of kin or legal representative, with proof (death certificate, authority document).
- Options: close account, export for heirs (only where law allows), memorialize public pages.
- Optional: a "legacy contact" or inactive-account manager the user sets in advance (mature email providers offer this).
- Paid subscriptions: stop billing, refund policy for unused time.

## 5. Abuse, illegal content, copyright takedown
- Acceptable Use Policy listing forbidden content and uses (illegal content, CSAM — must be reported in the US to NCMEC, harassment, spam, phishing, malware, impersonation, scams, regulated goods).
- Report button / abuse email; response targets; who reviews; how to suspend fast.
- US copyright: register a DMCA designated agent with the Copyright Office (small fee, renew every 3 years), publish the notice and counter-notice process, repeat-infringer policy. EU: Digital Services Act notice-and-action basics for hosting services.
- Link and URL safety for user-supplied links (safe-browsing checks), rate limits on sign-up and sending to stop spam abuse of your domain.
- Keep evidence logs; never delete evidence of crimes you were told about.

## 6. Chargebacks and disputes
- Who is liable: you, or the seller on a marketplace (connected-account model). Write it in the Terms.
- Clear billing descriptor, receipts, and easy refunds reduce disputes.
- Evidence kit: sign-up record, terms acceptance, usage logs, delivery proof.
- Dispute rate thresholds at card networks (roughly ~1%) can freeze your account; monitor them.
- Fraud tools: card checks, velocity limits, holding payouts for new sellers.

## 7. Outages, status communication, SLA and compensation
- Status page or at least a status channel; who posts, within how many minutes.
- Monitoring and alerting that reaches a human.
- SLA: for an early product, usually none ("as is"); if any, credits only, capped at fees paid for the period, no cash. Mature providers limit remedies to service credits.
- Incident write-up template; customer notice for data-affecting incidents.
- Dependency outages (host, DB, email): what degrades, what stays up.

## 8. Liability caps, indemnity, disputes, avoiding lawsuits
- Limitation of liability: capped at fees paid in the last 12 months (or a small fixed amount for free users); exclude indirect damages, as far as local law allows.
- Warranty disclaimer ("as is").
- User indemnity for their content and use.
- Governing law and venue; arbitration and class-action waiver are common in the US but limited for consumers in the EU/UK and some states — lawyer review.
- Run the business through an entity; keep personal and business money separate; consider general liability and tech E&O / cyber insurance.
- Avoid claims you cannot prove in marketing ("secure", "never down", "GDPR certified").
- Clickwrap acceptance with stored version and timestamp.

## 9. Minors
- Minimum age (13 in the US due to COPPA; 16 by default in parts of the EU unless parental consent; many services choose 18 for payments or marketplaces).
- Age gate at sign-up; process when you learn a child signed up (delete).
- No targeting children unless you build full COPPA compliance.

## 10. Privacy laws
- Map data: what personal data, why, where stored (region), which sub-processors, retention.
- GDPR/UK GDPR if you serve EU/UK users: lawful basis, user rights, DPA with vendors, transfer mechanism, possibly an EU/UK representative.
- US state laws (California CCPA/CPRA and others): notice at collection, "do not sell/share", rights requests.
- Cookie/analytics consent where required.
- Rights-request process with a deadline (e.g., 30/45 days) and a log.

## 11. Price and terms changes
- Advance notice by email (commonly 30 days; longer for price increases on annual plans), effective at next renewal, with right to cancel.
- Grandfathering policy for early users.
- Keep old versions of Terms with dates; record who accepted which version.

## 12. Service sunset
- Notice period (often 60–180 days), export tools available throughout, refunds for prepaid time, redirects or handle release plan.
- Decide in advance who keeps the domain and data, and that data is deleted at the end.

## 13. Account security and takeover
- Passwordless or strong auth, optional 2FA, session revocation, new-device alerts.
- Email change requires confirming both old and new address.
- Recovery path when the user lost email access, with identity proof and a delay.
- Admin access: least privilege, audit log, 2FA on every vendor console.
- Rate limits and bot protection on every auth path, not just the login page.

## 14. Data breach notification
- Incident response plan: contain, assess, notify.
- Legal deadlines differ: GDPR — regulator within 72 hours when required; US states — "without unreasonable delay" with varying specifics; also notify payment processor if card data involved.
- Prepared notice template; contact list (lawyer, insurer, vendors).

## 15. Platform lock-in and migration plan
- For each vendor: what we rely on that is proprietary, how hard it is to leave (days of work), how to export the data.
- Prefer portable formats and standard APIs; keep infra config in the repo.
- Name the trigger that would force a move (price, terms, limits) and the fallback.

## 16. Scale cost at 10x and 100x
- Table: users, requests, storage, bandwidth, emails, API calls → monthly cost at 1x/10x/100x.
- Point where each free tier ends and what the next plan costs.
- Confirm revenue per customer still exceeds cost per customer at each size; if free users grow faster than paid, cap free usage.

## 17. Other easily forgotten items
- Domain and DNS ownership in the company account, auto-renew on, registrar lock.
- Bus factor: who can access everything if the owner is unavailable (password manager, documented access).
- Vendor accounts in the company name with a role address, not personal email.
- Your own accounts' inactivity rules (vendors close unused accounts too).
- Email deliverability: SPF, DKIM, DMARC, bounce and complaint handling.
- Accessibility (WCAG 2.2 AA target) and the legal exposure of ignoring it.
- Export controls and sanctioned countries for payments.
- Trademark clearance before spending on a brand.
- Records retention for taxes (typically several years).

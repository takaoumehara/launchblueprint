# Launch Blueprint — <product / feature>

Date: <YYYY-MM-DD> · Author: <AI/agent> · Status: draft / agreed · Review triggers: pre-launch, 10th customer, price change, new service, incident, any fact below changes

Legend: `NEEDS CONFIRMATION` = unverified, question listed at the end. Every decision has **Recommended:** and **Alternative:** with a reason, and six angles (cost, legal, ops, marketing, implementation, UX). Laws and thresholds: verify with a primary source and a lawyer.

## Facts that change everything
| Fact | Answer | Date | Sections it switches on |
|---|---|---|---|
| Owner lives in | | | home-country rules, tax residency |
| Entity registered in (or will be) | | | legal, tax, representative duties |
| Customers and users will be in | | | regions table, VAT/sales tax, privacy law |
| Money moves? Between whom (platform / sellers / buyers) | | | price and cost, MoR, §7 row 18 |
| Users publish content others see? | | | takedown, DSA, DMCA agent, moderation |
| Minors may use it? | | | §7 row 9, age gate |
| AI processes user data? | | | §7 row 19, privacy disclosure, AI rules |

## Regions
| Region | Serve / limit / block | Why | Obligations (from jurisdictions.md) | Status |
|---|---|---|---|---|
| Owner's home country | | | | |
| EU/EEA | | | | |
| UK | | | | |
| Switzerland | | | | |
| US | | | | |
| <other region with users> | | | | |
- How blocking works (IP, card country) and its limits:
- What is still honoured for users from blocked regions (data requests, breach notice, takedowns):

## 0. Summary
- One sentence: <who> pays <price> to <solve what>.
- Monthly fixed cost: $<n> · Cost per customer: $<n> · Break-even: <n> customers
- Top 3 risks: <...>
- Blockers before code: <...>

## 1. Product and customer
- Customer / problem / price:
- First segment · region · plan:
- Never say / never promise:
- Out of scope:
- Recommended / alternative / six angles:

## 2. Price and cost
| Plan | Price | Fee | Included | Limits |
|---|---|---|---|---|

| Cost per customer / month | 1x | Assumption (confidence) |
|---|---|---|
| Compute / DB / storage / bandwidth | | |
| Email / SMS / APIs / AI calls | | |
| Payment fees | | |
| Support minutes | | |
| **Total** | | |

| Fixed cost | Plan | $/month |
|---|---|---|
| **Total** | | |

- Free-use cap: $<n>/month global; when hit → <behavior>
- Break-even and margin:
- Merchant of record vs. own registrations:
- Recommended / alternative / six angles:

## 3. Tech stack
- Home: <provider> — why one home / why split; cost of consolidation vs. migration:
- 12-month shape considered (payments, media, traffic, jobs, regions):
- Plan on the day money moves (free/hobby plans flip to commercial):

| Service | Purpose | Plan | Commercial OK? | Limits (deploy / preview / branch / send) | Over limit → | $/mo | $/mo 10x | Lock-in | Checked | URL |
|---|---|---|---|---|---|---|---|---|---|---|

- Deploy caps, push discipline, emergency deploy path when capped:
- Preview environments: DB branch cap, no production credentials, no production migrations, migrate-on-build guard:
- Environment detection fails safe (missing var = production-strict) · tested on <date>:
- Edge / serverless DB limits emulated in tests (params, args, LIKE, row size, batches, transactions) · race tests on separate connections:
- Test suite run under realistic latency or load on <date>:
- Secrets (names only, location, creator, rotation):
- Runaway-cost guards (shared counter, rate limits, caching, provider caps):
- Kill switch: <how> · tested on <date>:
- Backup / restore drill: <date> · no live credentials in backups · key held offline · size guard:
- Monitoring and alerts → <who> · scheduled-job heartbeats:
- Email: provider caps, SPF/DKIM/DMARC, bounce and complaint handling, volume plan:
- AI features: free caps (day/month), paid quotas, fallback, cost per call at 1x/10x/100x, data sent, moderation:
- Content and i18n: non-Latin slugs, CJK fonts, RTL, UI languages:
- Shutdown / maintenance mode:
- Migration effort if host is wrong: <days>
- Recommended / alternative / six angles:

## 4. Legal and money
| Item | Decision | Status |
|---|---|---|
| Entity / jurisdiction / registered agent | | |
| Business address (not home) | | |
| DBA / trade name = card descriptor | | |
| Tax ID / bank / bookkeeping | | |
| Annual or biennial filings kept current | | |
| Insurance (GL, tech E&O, cyber) | | |
| Sales tax / VAT / MoR (per Regions table) | | |
| Terms (liability cap, lawyer review) / Privacy / AUP / Refunds / Cookies | | |
| Accessibility statement | | |
| SMS (A2P 10DLC) / email (CAN-SPAM, consent) | | |
| DMCA agent / DSA contact / takedown | | |
| Trademark classes and jurisdictions | | |
| Vendor accounts under the company, work email, 2FA | | |
| Refused industries | | |
| Lawyer review list | | |
- Recommended / alternative / six angles:

## 5. Marketing and brand
- Name / trademark check / domain / handles:
- Tagline / positioning / design system:
- Brand-voice rules for UI copy:
- Funnel and metric per step:
- First 10 customers from:
- Recommended / alternative / six angles:

## 6. Operations
| Task | Manual minutes / customer | Approval needed? | Automate when |
|---|---|---|---|
- Support intake, response target, identity verification rule:
- Runbooks present (incident, refund, takedown, data request, recovery, seller cancellation, emergency deploy):
- Scheduled jobs and who is alerted on failure:

## 7. Lifecycle, risk and security
| # | Topic | Our policy | Lives in (code/terms/runbook) | Owner action | Status |
|---|---|---|---|---|---|
| 1 | Inactive accounts | | | | |
| 2 | Cancellation / refunds / downgrade / dunning | | | | |
| 3 | Data export and deletion (incl. backups, retained records) | | | | |
| 4 | Deceased / incapacitated users | | | | |
| 5 | Abuse, illegal content, copyright takedown | | | | |
| 6 | Chargebacks / disputes | | | | |
| 7 | Outages, status comms, SLA / credits | | | | |
| 8 | Liability cap, indemnity, arbitration, insurance | | | | |
| 9 | Minors / COPPA | | | | |
| 10 | Privacy laws and regions (see Regions table) | | | | |
| 11 | Price / terms change notice | | | | |
| 12 | Service sunset | | | | |
| 13 | Account security / takeover / recovery (security.md §1) | | | | |
| 14 | Data breach notification | | | | |
| 15 | Lock-in / migration plan | | | | |
| 16 | Scale cost 10x / 100x (table below) | | | | |
| 17 | Domain, bus factor, vendor accounts, deliverability, accessibility, sanctions, trademark, records, filings, i18n | | | | |
| 18 | Money between users: seller cancel/delete refunds, retained records, payouts, fee exemptions, receipts | | | | |
| 19 | AI features: caps, quotas, fallback, cost, data sent, moderation, regional rules | | | | |
| S2 | Backups without credentials, offline key, restore drill, size guard | | | | |
| S3 | Header trust per host (client IP, country, forwarded host) | | | | |
| S4 | URL fetching: SSRF, DNS rebinding, redirects, IPv6 | | | | |
| S5 | Link-safety API terms, abuse intake | | | | |
| S6 | Scheduled jobs alert on failure | | | | |
| S7 | Environment detection fails safe; previews isolated | | | | |

| Metric | 1x | 10x | 100x |
|---|---|---|---|
| Users / requests / storage / emails / AI calls | | | |
| Monthly cost | | | |
| Monthly revenue | | | |

## 8. Owner to-do list
| # | Task | Depends on | Rough days | Unblocks |
|---|---|---|---|---|

## Open questions (NEEDS CONFIRMATION)
1.

## Decisions log
| Date | Decision | Alternative not taken | Depends on fact | Reopens when |
|---|---|---|---|---|

## Changelog
- <date>: created

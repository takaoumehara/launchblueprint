# Launch Blueprint — <product / feature>

Date: <YYYY-MM-DD> · Author: <AI/agent> · Status: draft / agreed · Review triggers: pre-launch, 10th customer, price change, new service, incident

Legend: `NEEDS CONFIRMATION` = unverified, question listed at the end. Every decision has **Rejected:** with a reason.

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
- Rejected:

## 2. Price and cost
| Plan | Price | Fee | Included | Limits |
|---|---|---|---|---|

| Cost per customer / month | 1x | Assumption (confidence) |
|---|---|---|
| Compute / DB / storage / bandwidth | | |
| Email / SMS / APIs | | |
| Payment fees | | |
| Support minutes | | |
| **Total** | | |

| Fixed cost | Plan | $/month |
|---|---|---|
| **Total** | | |

- Free-use cap: $<n>/month global; when hit → <behavior>
- Break-even and margin:
- Merchant of record / tax collection:
- Rejected:

## 3. Tech stack
- Home: <provider> — why one home / why split:
- 12-month shape considered (payments, media, traffic, jobs):

| Service | Purpose | Plan | Commercial OK? | Limits | Over limit → | $/mo | $/mo 10x | Lock-in | Checked | URL |
|---|---|---|---|---|---|---|---|---|---|---|

- Secrets (names only, location, creator, rotation):
- Runaway-cost guards (shared counter, rate limits, caching, provider caps):
- Kill switch: <how> · tested on <date>:
- Backup / restore drill:
- Monitoring and alerts → <who>:
- Shutdown / maintenance mode:
- Migration effort if host is wrong: <days>
- Rejected:

## 4. Legal and money
| Item | Decision | Status |
|---|---|---|
| Entity / jurisdiction | | |
| Business address (not home) | | |
| Tax ID / bank / bookkeeping | | |
| Insurance | | |
| Sales tax / VAT / MoR | | |
| Terms / Privacy / AUP / Refunds / Cookies | | |
| Accessibility statement | | |
| SMS (A2P 10DLC) / email (CAN-SPAM, consent) | | |
| DMCA agent / takedown | | |
| Refused industries | | |
| Lawyer review list | | |
- Rejected:

## 5. Marketing and brand
- Name / trademark check / domain / handles:
- Tagline / positioning / design system:
- Funnel and metric per step:
- First 10 customers from:
- Rejected:

## 6. Operations
| Task | Manual minutes / customer | Approval needed? | Automate when |
|---|---|---|---|
- Support intake and response target:
- Runbooks present:

## 7. Lifecycle and risk
| # | Topic | Our policy | Lives in (code/terms/runbook) | Owner action | Status |
|---|---|---|---|---|---|
| 1 | Inactive accounts | | | | |
| 2 | Cancellation / refunds / downgrade / dunning | | | | |
| 3 | Data export and deletion (incl. backups) | | | | |
| 4 | Deceased / incapacitated users | | | | |
| 5 | Abuse, illegal content, copyright takedown | | | | |
| 6 | Chargebacks / disputes | | | | |
| 7 | Outages, status comms, SLA / credits | | | | |
| 8 | Liability cap, indemnity, arbitration, insurance | | | | |
| 9 | Minors / COPPA | | | | |
| 10 | Privacy laws (GDPR, CCPA, others) | | | | |
| 11 | Price / terms change notice | | | | |
| 12 | Service sunset | | | | |
| 13 | Account security / takeover / recovery | | | | |
| 14 | Data breach notification | | | | |
| 15 | Lock-in / migration plan | | | | |
| 16 | Scale cost 10x / 100x (table below) | | | | |
| 17 | Domain, bus factor, vendor accounts, deliverability, accessibility, sanctions, trademark, records | | | | |

| Metric | 1x | 10x | 100x |
|---|---|---|---|
| Users / requests / storage / emails | | | |
| Monthly cost | | | |
| Monthly revenue | | | |

## 8. Owner to-do list
| # | Task | Depends on | Rough days | Unblocks |
|---|---|---|---|---|

## Open questions (NEEDS CONFIRMATION)
1.

## Changelog
- <date>: created

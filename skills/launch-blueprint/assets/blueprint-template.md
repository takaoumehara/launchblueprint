# Launch Blueprint — <product / feature>

Date: <YYYY-MM-DD> · Author: <AI/agent> · Status: draft / agreed · Depth: full / delta · Review triggers: pre-launch, 10th customer, price change, new service, incident, assumption result, missed milestone, hours or cash change

Legend: `NEEDS CONFIRMATION` = unverified, question listed at the end. Every decision has **Rejected:** with a reason. The plan references owner to-do numbers; it does not copy them.

## 0. Summary
- One sentence: <who> pays <price> to <solve what>.
- Horizon: <first paid version | first 10 paying customers | date>
- Monthly fixed cost: $<n> · Cost per customer: $<n> · Break-even: <n> customers
- Constraints: <h/week> · cash before revenue $<n>
- Riskiest assumption: <...> · First milestone tests it by: <...>
- Top 3 risks (from §9.10): <...>
- Blockers before code: <question numbers>

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
| SMS (sender type and its registration) / email (CAN-SPAM, consent) | | |
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
Human tasks only. Section 9 references these numbers.

| # | Task | Depends on | Rough days | Unblocks |
|---|---|---|---|---|

## 9. Plan
See `references/planning.md`. Show the arithmetic. Dates without it are `NEEDS CONFIRMATION`.

Horizon: <...> · Depth: full / delta · Next review: <date or milestone>

### 9.1 Constraints
- Hours/week × weeks: <n> × <n> = <n> available
- Cash before revenue: $<n>
- Hard date and what a miss means: <or none>
- Skills the owner does not have: <...>

### 9.2 Assumptions (worst first)
| # | Assumption | If wrong | Test | Cost (h / $) | Confirms if | Kills if | Days | Confidence |
|---|---|---|---|---|---|---|---|---|
| 1 | | | | | | | | |

### 9.3 Phases
| Phase | User outcome | In | Out | Promotion trigger |
|---|---|---|---|---|
| Now | | | | |
| Next | | | | |
| Later | | | | |

Hand-done before automate: <job> × <n, default 5>

### 9.4 Journey
| Stage | Customer does | We do | Metric | Failure | Owner |
|---|---|---|---|---|---|
| Discover | | | | | |
| Try | | | | | |
| Activate | | | | | |
| Pay | | | | | |
| Succeed | | | | | |
| Leave | | | | | |

Support check: <customers> × <minutes> = <hours> vs <hours available>

### 9.5 Milestones
| # | Milestone | Exit (observable) | Iterate if | Stop if | Depends on | Target |
|---|---|---|---|---|---|---|
| M1 | Assumption #1 tested | | | | | |

### 9.6 Critical path
| # | Work | Track (owner / validation / build / ops) | Hours or wait days | Depends on | Parallel with |
|---|---|---|---|---|---|

Available <hours> − owner effort <hours> = <slack or shortfall>
Owner effort sums every track. A parallel row reduces it only when a different person owns it. Waiting days are calendar, not hours.
Cut to fit: <named cut, or "fits">
Slack: <which milestone can slip, and which cannot>
Long waits started on day one: <§8 numbers, or none>

Next 10 working days:

| Day | Work | Done when |
|---|---|---|

### 9.7 Decisions
| Decision | When (now / later / already) | Recommendation | Rejected | Unblocks | Deadline or trigger | Source |
|---|---|---|---|---|---|---|

### 9.8 Scenarios
| | Tight | Base | Stretch |
|---|---|---|---|
| Customers at horizon | | | |
| Revenue / month | | | |
| Cost / month | | | |
| Cash needed before revenue | | | |
| What changes in the plan | | | |

Assumptions and confidence: <...>
Tight vs variable cost: <covers, or section 2 changed because ...>

### 9.9 Metrics and kill criteria
- North star for this phase:
- Leading indicators (signal, where recorded, who looks, how often):
- Kill or change course if:

### 9.10 Launch sequence
| Step | Who is allowed in | Cohort | Still manual | Lifecycle rows required | Rollback |
|---|---|---|---|---|---|

### 9.11 Project risks
Pre-mortem: It is the horizon date and this failed because <1>, <2>, <3>.

| # | Risk | Likelihood | Impact | Mitigation already in the plan | Trigger to act | Owner |
|---|---|---|---|---|---|---|

### 9.12 Consistency
| Check | Result (pass / fixed in §n / question #) |
|---|---|
| Promise = price = billing | |
| Copy avoids forbidden claims | |
| Journey leave/cancel/delete = §7 | |
| Funnel volume × support minutes fits hours | |
| Free cap, kill switch, and 10x row agree | |
| Every critical-path service is in §3 | |
| Every human wait is a §8 row | |
| Every blocker question names what it blocks | |
| M1 tests assumption #1; no dependent build before it | |
| Capacity arithmetic fits, or the cut is named | |
| Tight case covers variable cost per customer | |
| No secret values | |

## Open questions (NEEDS CONFIRMATION)
Ask every blocker in one batch. Do not wait on Later to present the blueprint.

| # | Question | Blocks (decision or milestone) | Bucket (blocker / this phase / later) |
|---|---|---|---|

## Changelog
- <date>: created

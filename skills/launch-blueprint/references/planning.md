# Planning pass (mandatory)

Sections 1–8 say what the product is, what it costs, and what could go wrong for a user. This pass turns those facts into an order of work: what to learn first, what to build first, what to defer, and what would make us stop. A blueprint without this is a checklist. Checklists do not tell the owner what to do on Monday, or what to skip.

Read this after sections 1–8 and the lifecycle catalog are drafted. Then fill section 9 of the template. If the plan contradicts an earlier section, go back and fix that section. The plan is the source of sequence; the earlier sections stay the source of facts.

| This file | Template |
|---|---|
| 1. Constraints | §9.1 |
| 2. Assumptions | §9.2 |
| 3. Phases | §9.3 |
| 4. Journey | §9.4 |
| 5. Milestones | §9.5 |
| 6. Critical path and next 10 working days | §9.6 |
| 7. Decision agenda | §9.7 |
| 8. Scenarios | §9.8 |
| 9. Metrics and kill criteria | §9.9 |
| 10. Launch sequence | §9.10 |
| 11. Project risks | §9.11 |
| 12. Consistency | §9.12 |
| 13. Question buckets | Open questions, after §9 |

## Planning horizon

Plan thoroughly up to one horizon, and name it in the first line of section 9:

- the first version a stranger can pay for, or
- the first 10 paying customers, or
- a date the owner actually has.

Everything past the horizon goes in **Later**, with the trigger that would pull it forward (a metric, a customer count, or a date). Do not write a roadmap for the year. Do write the path to the horizon in enough detail that a different person could follow it.

## Depth

- **Full** (default): new product, new paid feature, new host, or anything that can charge, send, publish, or store personal data. Complete every part below. `N/A — <reason>` only when a part truly cannot apply.
- **Delta**: a blueprint for this product already exists and this change does not add a vendor, a price, a new kind of user data, or a new promise. Update the rows the change touches. Still redo assumption #1, the next milestone, the capacity check, and the consistency pass for the delta. Write `unchanged — see <prior blueprint path>` for untouched parts.

Do not pick Delta to avoid work. If you are unsure, use Full.

## 1. Constraints before sequence

Write the owner's real limits before ordering any work. If a number is not in the repo or the conversation, mark it `NEEDS CONFIRMATION`. Do not invent a comfortable number.

- Hours per week they can spend on this, and for how many weeks.
- Cash they can spend before the product takes money.
- A hard date, if one exists, and what happens if it is missed (slip, cut scope, or stop).
- Skills they do not have. Those tasks stay on the owner to-do list or become a paid service with a price, not a silent assumption that the agent will "handle legal."

A plan that needs more hours or cash than these numbers is not a plan. Cut scope until it fits, name the cut, and say what the cut delays.

## 2. Assumptions, worst first

List the assumptions the horizon depends on. Sources: section 1 (someone has this problem and will switch), section 2 (they will pay this price and the unit cost stays under it), section 3 (this host allows commercial use and the product fits its limits), section 5 (this channel can produce the first customers).

Rank them by how dead the product is if the assumption is wrong, not by how easy they are to build around. Number 1 is the riskiest. The first milestone tests number 1. Do not start a build that number 1 would cancel.

For each assumption record: the statement, why the plan dies if it is wrong, the cheapest test, the cost of that test in hours and money, what result confirms it, what result kills it, how many days the test takes, and confidence (low / med / high). A test with no kill line is not a test.

Prefer this order of tests, cheapest that can actually kill the assumption:

1. Read a primary source already required elsewhere (vendor terms, a law summary the owner must still confirm).
2. Talk to the people named in "first 10 customers" (a count of conversations, not "do some interviews").
3. Offer the product by hand (concierge): take payment or a written commitment before software exists.
4. A one-page offer or prototype.
5. Software.

If the riskiest assumption is demand or price, the first build is not the app. The first build is the test. Software starts after that test passes, or after the owner explicitly accepts the risk in writing in the blueprint.

Hours and cash spent before that milestone are only the cost of the test. Do not put the build's cost into Now. If assumption #1 is low confidence, say so in the summary and keep the committed spend inside the test row.

## 3. Phases

Three rows only.

| Phase | What it means |
|---|---|
| Now | The smallest outcome that tests assumption #1. A manual step counts. |
| Next | The first version that matches the horizon (usually: a stranger can pay and complete the core job). |
| Later | Explicitly deferred. Each item has a promotion trigger. |

Write user outcomes ("a shop owner gets a missed call handled"), not a feature list ("build dashboard, auth, settings"). Each phase has an **in** list and an **out** list. The out list is the scope cut from step 1 if capacity was too small.

Rule: if a task can spend money or call a paid API, that slice includes the shared spend cap and the kill switch from section 3. "We will add the cap later" is not allowed for that slice.

Rule: do a job by hand until it has been done for real **5 times** (or a number the owner sets). Automate after that, not before, unless the hand version cannot produce the evidence the test needs.

Tools from `proactive-tools.md` go in Now only when they are the cheapest test or the owner already agreed. Otherwise they are Next or Later. A vendor that is not in the section 3 table cannot sit on the critical path.

## 4. Journey across the horizon

One row per stage: Discover, Try, Activate, Pay, Succeed, Leave. For each: what the customer does, what we do, the metric (the same metric as section 5's funnel where the stages overlap), how it fails, and who owns it.

"Leave" must match the cancellation, export, and deletion policies in section 7. If the journey says self-serve cancel and section 7 does not, fix section 7.

Multiply section 6's minutes per customer by the base-scenario customer count. If support hours exceed the hours in step 1, the journey is too heavy: cut a step, make it self-serve, or lower the customer count and say so in the tight scenario.

## 5. Milestones

Each milestone is an observable state, not an activity. "Interviews done" is an activity. "5 of the 8 named prospects said they would pay $29, recorded in the notes" is a milestone.

Columns: name, exit criteria, what we change if the result is mixed (**iterate**), what we do if it fails (**stop** or a named pivot), what it depends on, and the target date **only if** the capacity math in step 6 supports it. A date without that math is `NEEDS CONFIRMATION`.

Minimum set for a Full plan:

1. Assumption #1 tested.
2. Vendor commercial-use and limits checked for every service the Now phase calls (this can be milestone 1 when the risk is the host).
3. The owner blockers that take calendar time are submitted (entity, bank, tax ID, sender registration, trademark — only those this product needs).
4. Horizon reached (stranger can pay, or 10th paying customer, whichever was named).
5. The next blueprint review, on a date or on a milestone.

Every milestone has a stop rule. "Keep going and see" is not a stop rule.

## 6. Critical path, capacity, and the next 10 working days

Split work into tracks:

- **Owner** — section 8 only. Reference those rows by number. Do not copy them into a second list.
- **Validation** — the tests from step 2.
- **Build** — code and configuration. List the rows so the capacity math is honest, but each one depends on the test that would cancel it. Those rows do not start until that test passes, or the owner accepts the risk in writing in the blueprint. Keep them out of the next 10 working days while a blocker question is open.
- **Ops** — support, review, manual fulfillment.

For each row: hours of effort, or wait days if the owner is only waiting on a third party. Say what it depends on and what may run in parallel.

Then show the arithmetic in the blueprint:

```
Available = hours/week × weeks until the horizon
Effort    = hours the owner must personally do, on every track
            (waiting days are calendar, not hours; do not count an hour twice)
            Parallel rows reduce effort only when a different person owns them
Fits?     = yes, or the named cut from step 1
```

Call out slack: which milestone can slip, by how many days, without moving the horizon, and which one cannot. Long waits (entity, tax ID, bank, sender registration, trademark, app-store review) start on day one when they are on the path. Name the work that continues during the wait.

If a row depends on another and that one depends back, stop and make it a blocker question. A cycle is not a schedule.

Name one owner for each milestone and each critical-path row. If the conversation names no one else, that owner is the same person, and two tracks run in parallel only while they are waiting on a third party. Do not invent a team.

**Next 10 working days.** A table the owner can follow without re-reading the blueprint: day or date, the work, and what "done" looks like. Use only tasks whose inputs are already known. Anything blocked by an unanswered blocker question goes after the question, not into the 10 days. If hours/week are unknown, the 10-day table is `NEEDS CONFIRMATION` and you still list the unordered ready tasks.

## 7. Decision agenda

Three buckets:

- **Decide now** — the next milestone cannot start without it. One recommendation, one rejected option, the decision it unblocks, and a deadline (a date, or "before milestone N").
- **Decide later** — safe to defer. Name the trigger that makes it urgent. Do not smuggle a default in by writing the deferred choice as if it were settled. Choices that are expensive to undo (entity type, brand, host, an exclusive contract) stay here unless the horizon actually requires them.
- **Already decided** — taken from the repo or the owner, with the source. Do not re-litigate these unless they contradict a vendor page you opened.

A choice with no rejected option is unfinished, same as the rest of the blueprint.

## 8. Scenarios

Three columns: **Tight**, **Base**, **Stretch**. Use the same horizon. Rows: customers, revenue per month, cost per month, cash needed before revenue, and what we change in the plan.

- Base uses the section 2 price and the section 5 channel, with the assumptions written down.
- Tight is fewer customers or a higher unit cost, not a vague "slow start." It names the scope that gets cut and the costs that still have to be paid (fixed plans, registrations).
- Stretch is the upside that must not be required for the plan to survive.
- If Tight loses money on every customer, change the price or the free cap in section 2 before any build milestone. Do not leave a plan whose downside cannot pay its variable cost.
- The 10x / 100x table in section 7 is a different question (what happens if it works). Do not replace it with these scenarios. Both stay.

Show the arithmetic. Confidence on each driver: low / med / high.

## 9. Metrics and kill criteria

For this phase, one north-star metric tied to the horizon (paid customers, paid commitments, or the assumption-test result). Three to five leading indicators from the journey. For each: event or signal name, where it is recorded, who looks, and how often.

Kill or change-course lines are numeric and attached to a milestone. Example shape: "If fewer than 2 of 8 interviewed prospects will pay the price, stop the build milestone." Put the same lines on the milestone's stop column so they cannot drift.

## 10. Launch sequence

Skip with `N/A — no users in this horizon` only when the horizon is a test that does not face a stranger. Otherwise write the steps in order: private (owner only), design partners (named people), paid beta, public. For each: who is allowed in, cohort size, what is still manual, rollback (feature flag, maintenance mode, or "delete the deployment"), and the lifecycle rows that must be at least **planned** before that step.

Before any stranger uses it, these rows are planned at minimum, and implemented before public: cancellation and refunds, export and deletion, abuse intake, account security, and — if the step charges — chargebacks. Breach notification has a named contact. Minors have an age gate if accounts exist. Do not copy the whole catalog here; point at the section 7 row numbers and the status.

Match section 3's shutdown switch. A launch step with no way to turn the service off is not ready.

## 11. Project risks and a short pre-mortem

Lifecycle rows are about a user in a situation (inactive, deceased, charged back). Project risks are about the plan failing.

Before filling the register, write one sentence: "It is the horizon date and this failed because (1) …, (2) …, (3) …." Use it to check the register. Add any reason that was not already listed.

Columns: risk, likelihood (low / med / high), impact (low / med / high), mitigation already in the plan, the trigger that means we act, owner. The top 3 risks in the summary are the three highest impact × likelihood rows from this table, not a separate guess.

## 12. Consistency pass

Run this after the plan is drafted. Each failed check becomes a fix in the earlier section or a blocker question. Do not present while a row says "contradiction" with no question number.

| Check | Pass looks like |
|---|---|
| Promise, price, billing | Section 1's promise, section 2's price, and section 4's refund and tax rows describe the same offer. |
| Words we never say | Section 5 copy does not use a claim section 1 forbids. |
| Journey and lifecycle | Leave / cancel / delete in section 9 match section 7. |
| Funnel and ops | Section 5 volume × section 6 minutes fits the hours in step 1, or the gap is a named cut. |
| Cost and cap | Free-tier behavior, the kill switch, and the 10x row agree on what stops spend. |
| Vendors | Every service on the critical path is a row in section 3 with commercial use, limits, overage, price, date, URL. |
| Owner work | Every human wait on the critical path is a section 8 row. |
| Questions | Every blocker question names the decision or milestone it blocks. |
| Assumption order | Milestone 1 tests assumption #1, and no dependent build is scheduled before it. |
| Capacity | The hours arithmetic is shown and fits, or the cut is named. |
| Tight case | Tight still covers variable cost per customer, or section 2 was changed. |
| Secrets | The plan names no secret values. |

## 13. Questions in three buckets

Collect every `NEEDS CONFIRMATION` into the open-questions table:

- **Blocker** — a Decide-now item or the next milestone waits on it. Ask all of these in one batch, at the top of the reply.
- **This phase** — needed before the horizon, not before the next milestone.
- **Later** — does not change the horizon plan.

Do not hold the blueprint back for Later questions. Do not start Build-track work that a Blocker question could cancel.

## Re-plan when

Update section 9 and add a changelog line when any of these happen. Do not leave a milestone in place after its test has already passed or failed.

- The assumption test returns a result.
- A milestone is missed by more than the slack written in step 6.
- Hours per week or cash on hand change.
- A vendor on the path changes price or terms (re-open the page; update the date).
- `proactive-tools.md` surfaces a new pain or a tool the owner wants to consider.
- The horizon itself changes.

## Anti-patterns

- A feature backlog titled "plan," with no assumption and no kill line.
- Building the interesting part first because the risky part is an interview or a terms page.
- Milestone dates with no hours × weeks arithmetic.
- One milestone called "launch."
- A test that cannot fail.
- Scenarios that only scale customers up.
- Open questions that do not name what they block.
- Two lists of the same owner tasks (section 8 and again in section 9).
- Scheduling a new vendor the proactive scan has not checked, or that the owner has not been asked to approve.
- Automating a job that has never been done by hand, when the open question is whether anyone wants it.
- Treating Delta as permission to skip the assumption, the capacity check, or the consistency pass.

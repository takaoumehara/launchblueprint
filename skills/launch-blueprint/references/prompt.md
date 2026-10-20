# Copy-paste kickoff prompt

```
I want to build: <one-line description of the product or feature>.

Before writing any code, use the launch-blueprint skill and produce a complete blueprint
using its template (all 9 sections, including Lifecycle & Risk and the Plan).
- Do not guess. Mark anything unverified as NEEDS CONFIRMATION.
  Bucket questions as blocker / this phase / later, and ask the blockers in one list.
- For every decision, write the option you rejected and why, one line each.
- Give numbers: monthly fixed cost (each service, plan, price), cost per customer,
  and totals at 1x, 10x, 100x.
- For every external service, open the live pricing and terms pages and record:
  commercial use allowed on our plan, limits, what happens over the limit, price,
  date checked, URL.
- Describe spend caps and a kill switch that actually work on the chosen host.
- Plan to a named horizon. Test the riskiest assumption before any build that
  assumption would cancel. Fit the work to my hours per week and cash before
  revenue (ask if you do not know them). Milestones need a stop rule.
  Show tight / base / stretch, and the next 10 working days.
- Finish with an ordered list of what I (a human) must do: contracts, accounts,
  keys, filings — with rough days and dependencies. Reference those rows from
  the plan; do not copy them twice.
Stop after the blueprint and wait for my answers before building.
```

Without the skill installed, paste `assets/blueprint-template.md`, `references/lifecycle-risk.md`, and `references/planning.md` after the prompt.

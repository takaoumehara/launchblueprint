# Copy-paste kickoff prompt

```
I want to build: <one-line description of the product or feature>.

Before writing any code, use the launch-blueprint skill and produce a complete blueprint
using its template (facts that change everything, regions table, all 8 sections including
Lifecycle & Risk and the security pass, and a decisions log).
- First ask me the facts that change everything, in one batch: where I live, where the
  entity is registered, where users will be, whether money moves and between whom,
  whether users publish content, whether minors may use it, whether AI processes user data.
- Raise topics I did not ask about, before they matter. Do not wait for me to ask.
- Do not guess. Mark anything unverified as NEEDS CONFIRMATION and ask me, all in one list.
  Laws and thresholds: say "verify with a primary source and a lawyer".
- For every decision, give a recommended option and an alternative with the reason it lost,
  and check six angles: cost, legal, operations, marketing, implementation, UX.
- Give numbers: monthly fixed cost (each service, plan, price), cost per customer,
  and totals at 1x, 10x, 100x.
- For every external service, open the live pricing and terms pages and record:
  commercial use allowed on our plan (free and hobby plans flip at the first payment),
  limits including deploy, preview, database-branch and email-send caps, what happens
  over the limit, price, date checked, URL.
- For each region users can reach, decide serve / limit / block and why, with the
  obligations that follow.
- Describe spend caps and a kill switch that actually work on the chosen host, environment
  detection that fails safe, backups that hold no live credentials, and account recovery
  that revokes OAuth links and sessions.
- Record every decision with its date and the fact it depends on, and tell me which
  decisions to revisit when a fact changes.
- Finish with an ordered list of what I (a human) must do: contracts, accounts,
  keys, filings — with rough days and dependencies.
Stop after the blueprint and wait for my answers before building.
```

Without the skill installed, paste `assets/blueprint-template.md`, `references/lifecycle-risk.md`, `references/jurisdictions.md` and `references/security.md` after the prompt.

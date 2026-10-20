# Copy-paste kickoff prompt

```
I want to build: <one-line description of the product or feature>.

Before writing any code, use the launch-blueprint skill and produce a complete blueprint
using its template (all 9 sections, including Lifecycle & Risk and Foresight).
- Do not guess. Mark anything unverified as NEEDS CONFIRMATION and ask me, all in one list.
- For every decision, write the option you rejected and why, one line each.
- Give numbers: monthly fixed cost (each service, plan, price), cost per customer,
  and totals at 1x, 10x, 100x.
- For every external service, open the live pricing and terms pages and record:
  commercial use allowed on our plan, limits (including daily build/deploy caps),
  what happens over the limit, whether inputs are used for training, token scope,
  price, date checked, URL.
- Describe spend caps and a kill switch that actually work on the chosen host.
- Give me the earliest launch date from external lead times (entity, tax ID, bank,
  payment processor, SMS registration, domain, trademark, insurance) and tell me
  what to start today in parallel.
- List every domain with its registrar and DNS host, decide the canonical domain,
  and start a URL registry.
- Run a pre-mortem: five reasons this fails in six months, each with a mitigation.
- Send one batched list of everything the agent needs from me (network allowlist,
  tokens with the narrowest scope, env var names exactly, permissions).
- Finish with an ordered list of what I (a human) must do: contracts, accounts,
  keys, filings — with rough days and dependencies.
Stop after the blueprint and wait for my answers before building.

During the work, keep thinking ahead:
- On every decision, write what it requires next (2–3 moves), what else it changes
  (URLs, secrets, legal docs, cost, other products), and who decides by when.
- Before asking me to do anything on a screen: predict what I will see, add
  "if you don't see X, it means Y — do Z", tell me which fields to hide before any
  screenshot, give the exact names to enter, and a way to verify it worked.
  Do it yourself via API when you can.
- End every report with "Not asked but important" (top 3).
- Before merging, confirm every reviewer and check has finished.
```

Without the skill installed, paste `assets/blueprint-template.md`, `references/lifecycle-risk.md`, and `references/foresight.md` after the prompt.

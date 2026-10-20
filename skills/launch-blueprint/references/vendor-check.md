# Vendor check

For every external service (host, DB, storage, email, SMS, auth, analytics, payments, AI APIs, domain, monitoring):

1. Open the live pricing page and the terms / fair-use page. Do not rely on memory.
2. Record in the table. If a page cannot be opened or the answer is unclear, write `NEEDS CONFIRMATION` and the question.
3. Specifically look for: "personal", "non-commercial", "hobby" wording; hard caps vs. automatic overage billing; CPU/time/bundle limits per request; egress fees; account suspension rules; inactivity deletion rules; **daily deploy/build/request caps**; **training on inputs** (AI services); **how narrowly a token can be scoped**.

| Service | Purpose | Plan we use | Commercial use allowed? | Key limits | Over limit → | Deploy/build/request caps vs. our agent rate | Inputs used for training? | Token scope (narrowest) / blast radius | $/month now | $/month at 10x | Lock-in / export | Date checked | Terms / pricing URL |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|

Rejected alternatives per category: `Category: picked X over Y because ...`.

Column notes:
- **Caps vs. agent rate.** Estimate pushes per agent per day × number of agents (AI agents push often; 50–150 pushes a day across two agents is normal). Compare with the plan's daily build/deploy cap. If the rate can hit the cap, write the mitigation (batch pushes, preview-only branch, plan change) before it blocks production. `field-lessons.md` L1.
- **Inputs used for training.** For AI APIs, free tiers, and free routers: does the provider train on prompts or outputs? Is commercial use allowed on that tier? Regional restrictions? Rate limits and availability guarantees? Write "no" only if the terms page says so. Keep a paid fallback under the global spend cap. `field-lessons.md` L14.
- **Token scope / blast radius.** The narrowest token the service offers (per project, per zone, read-only) and what an account-wide token could reach, including other products in the same account. `field-lessons.md` L4.

Common traps to test explicitly:
- Free tier that forbids commercial use (any paid feature, ads, or business use counts).
- Per-request CPU or duration limits that real pages exceed.
- Bandwidth/egress billed separately from storage.
- In-memory rate limits on serverless/edge (each instance counts separately).
- Proxying large media through compute instead of serving from storage/CDN.
- Vendor spending caps that are alerts only, not hard stops.
- Daily build/deploy caps that frequent agent pushes exhaust, blocking previews and production.
- Free AI tiers that train on inputs, forbid commercial use, or are unavailable in the owner's region.
- Tokens that can only be account-scoped on an account shared with another product.
- A free quota consumed before the global spend cap and kill switch were checked.

When a service is added mid-project, also run `foresight.md` A (look-ahead) and F1 (batched environment request).

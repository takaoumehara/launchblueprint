# Vendor check

For every external service (host, DB, storage, email, SMS, auth, analytics, payments, AI APIs, domain, monitoring):

1. Open the live pricing page and the terms / fair-use page. Do not rely on memory.
2. Record in the table. If a page cannot be opened or the answer is unclear, write `NEEDS CONFIRMATION` and the question.
3. Specifically look for: "personal", "non-commercial", "hobby" wording; hard caps vs. automatic overage billing; CPU/time/bundle limits per request; egress fees; account suspension rules; inactivity deletion rules.

| Service | Purpose | Plan we use | Commercial use allowed? | Key limits | Over limit → | $/month now | $/month at 10x | Lock-in / export | Date checked | Terms / pricing URL |
|---|---|---|---|---|---|---|---|---|---|---|

Rejected alternatives per category: `Category: picked X over Y because ...`.

Common traps to test explicitly:
- Free tier that forbids commercial use (any paid feature, ads, or business use counts).
- Per-request CPU or duration limits that real pages exceed.
- Bandwidth/egress billed separately from storage.
- In-memory rate limits on serverless/edge (each instance counts separately).
- Proxying large media through compute instead of serving from storage/CDN.
- Vendor spending caps that are alerts only, not hard stops.

# Category gaps

CREATIVITY IS EVERYWHERE, LLC · 2026-11-04 · found while moving categories into `skill/blueprint/elements/categories.yaml`

The registry gives every catalog file exactly one category (or `cross_cutting`), so gaps show up as empty `domains: []` or as topics no category owns. This list is what I found. Nothing here has been decided; each line ends with a proposed next step.

## 1. Categories with no catalog file

| Category | What is missing | Proposed next step |
|---|---|---|
| `brand` (02) | No catalog of brand / creative options (voice, visual system, asset production, media formats). Brand is described in `reference/categories.md` and `templates/brand-context.md` but has no `entries`/`lessons` file. | Add a brand/media catalog file (a separate proposal is in progress elsewhere), then list it under `brand.domains`. |
| `ai-build` (06) | No catalog for AI-driven implementation: test-first workflow, AI code review, dependency hallucination checks, "runs but broken" detectors (lint rules, type coverage, `any` counts). Today it lives only as prose and `lifecycle.yaml` items (`lc.n18`–`lc.n21`, `lc.n26`). | Add `catalog/ai_build.yaml` with lessons plus tool entries (linters, type checkers, test runners, supply-chain scanners). |

## 2. Topics no category owns well

| Topic | Where it partly sits | Gap |
|---|---|---|
| Testing / QA tooling | `qa-security-legal` covers security and legal, not testing | No entries for unit / end-to-end / visual-regression / load testing services and their free tiers. |
| Accessibility tooling | `ethics` now has accessibility lessons | No entries for audit tools, screen-reader test matrix, contrast checkers. |
| Trust and safety / moderation | Nowhere | Products with user-generated content need reporting, moderation queues, abuse handling and appeal rules. Overlaps `ethics` and `operations`. |
| Finance operations | `business_setup` (company formation) | Bookkeeping, invoicing, sales-tax filing cadence, revenue recognition, monthly close. |
| People and contractors | Nowhere | Hiring contractors, IP assignment in contracts, access off-boarding (partly `ops_handoff`). |
| Sales process (B2B) | `gtm` | Pipeline, quotes, security questionnaires, procurement and DPAs. Only marketing channels are covered today. |
| Open-source licence compliance | Nowhere | Licences of dependencies and assets, attribution files, copyleft in shipped code. |
| AI feature evaluation | `ai-context` (`ai_llm`) | Evaluation sets, prompt and model versioning, regression checks when the model changes. `eth.ai-bias-check` is the only item. |
| Incident disclosure | `security` (prevention) | What to tell users and when after a breach or outage; status page wording. |
| Sustainability | Nowhere | Compute and AI energy cost; usually low priority for small products, listed for completeness. |

## 3. Structural gaps found on the way

- **No decision topic for the new categories.** `elements/tactics.yaml` (the map) has no `revenue_model` choice and no `ethics` checklist, so the app's map never asks about them; they are visible only on the catalog screen. Proposed: a `revenue_model` choose topic in the idea stage (options = `rev.*`, before `pricing` and `payments`), and an `ethics_baseline` checklist in launch (options = `eth.*`).
- **Coverage numbers for 13 and 14 are not computed.** `reference/categories.md` shows "—" for ethics and revenue model; `reference/coverage.md` needs a recount.
- **Japanese / English mismatch in the auto-check.** `catalog/rules.yaml` is written in Japanese, most lessons in English. The hub's duplicate and contradiction checks compare tokens, so an English submission is never matched against a Japanese rule (and the other way round). Proposed: an English `text_en` field on rules, or a reviewer step for rules-ledger categories.
- **`elements.yaml` category numbers.** Elements point at categories by number (`'03'`); the new categories are not linked to any element yet (ethics → `el.security` / `el.experience`, revenue model → `el.business` are the obvious picks).
- **Historical source strings** (`source: owner-input 2026-10-26（12カテゴリー案）` in `lifecycle.yaml`, files under `drafts/` and `legacy/`) still name the old count. They are kept as dated provenance, not as current wording.

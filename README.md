# Blueprint

日本語：[README.ja.md](README.ja.md) · 5-minute start: [QUICKSTART.md](QUICKSTART.md)

**Blueprint is a "how to build how-to-build".** Before a product is built, it lays out every decision the product will need, from idea to launch, operation, scale and exit, and attaches to each one the options, one recommendation with a reason, the free tiers and limits, who carries the liability, and what it depends on. People use it as a web app with a map. AI agents use the same files through an MCP server, so the plan a person approves is the plan the agent builds from.

## What you get

- **A map of 64 decisions in five stages** (idea, launch, operate, scale, exit) and six lanes (brand, UX, UI, tech, business/legal, rules). Lines on the map are real dependencies only.
- **A catalog of 42 areas and 607 items**: services, rules and lessons, each with a source and the date it was checked. Unverified numbers are marked `verified: false` instead of guessed.
- **A stack comparison for every tech decision** (rule R-030): similar services and free tiers, one vendor vs combining several, when a cheap paid plan is worth it, the pick and the rejected alternatives.
- **A project map you own.** The app exports YAML in a fixed shape; an agent can draft the same shape with `draft_project_map`. Nothing is marked decided without the owner.

## Three ways to use it

| You are | Use | Start |
|---|---|---|
| A founder or owner who does not code | the web app in `app/` | [QUICKSTART.md §A](QUICKSTART.md#a-five-minutes-as-a-non-engineer-web-app) |
| An AI agent (Claude Code, Cursor, Claude Desktop) | the MCP server in `mcp/` | [QUICKSTART.md §B](QUICKSTART.md#b-five-minutes-as-an-ai-agent-mcp) |
| A Claude Code user who wants the procedure as a skill | `skill/blueprint/SKILL.md` (Japanese) | copy `skill/blueprint` into `.claude/skills/` |

## How to read the map

The strip at the top shows each stage with a large thin numeral (decided) over the total, and one square per decision: outline open, white AI-pick waiting, orange decided. Below it, dots in six lanes; lines are `depends_on` only; decided dots and lines turn orange; the bottom right numeral counts decided steps. The catalog screen lists every area and item. Details in [QUICKSTART.md §C](QUICKSTART.md#c-how-to-read-the-map).

## Preference profiles, later review, and how agents call `decide`

An agent can choose on its own without the owner approving every node — but only after it has looked at the whole field.

- **Preference profile** (`skill/blueprint/preferences/`): weights over seven criteria — cost / free-tier generosity, build speed, breadth of features to try, lock-in, scale, compliance, fit with parts already chosen. Ships with `lean-fast-full` (default: spend as little as possible, build extremely fast, still try building everything) and `all-in` (spend for speed, quality and scale). Organisations add their own (`scope: org`, `extends:`). Each project picks one.
- **`decide(topic, project)`** (MCP) lists the realistic field (tactic options, stack-comparison services, every catalog provider for sign-in), scores every option per criterion **with the evidence behind each score**, and returns the pick, why it won, a short reason for each rejected option, and linkage reasons (same vendor as the database, a shared free tier to check, catalog pairings, conflicts). No evidence = a visible **gap**, never a guess; prices are never invented and unverified sources stay `verified:false`.
- **Statuses**: `ai_selected` (agent pick — proceed, owner reviews later), `observed` (a fact read in a real repo, with file evidence), `decided` (only with `owner_confirmed: true`), `gap` (missing evidence, flagged), `deferred`, `open`. The MCP refuses an agent's `decided`.
- **`update_project_map`** records it and returns a shareable review link `#/p/<slug>`. Changing the profile re-scores every `ai_selected` pick; owner decisions and observed facts are kept and marked where the new profile disagrees.
- **Review later** in the app: `#/p/<slug>` shows all 64 decisions in six lanes; `#/p/<slug>/c/01` … `/c/12` walks the 12 categories one by one; clicking a node shows the pick, alternatives and scores, reasons, linkages, profile, verified/date and gap notes; `#/p/<slug>/arch` draws frontend ↔ backend ↔ data ↔ auth ↔ payments ↔ third-party services, implemented (evidence) vs proposed.
- **Catalog refresh**: `stale_items(refresh_plan: true)` + `propose_catalog_refresh` keep prices and limits current through a reviewed inbox.

Step by step: [skill/blueprint/reference/decide.md](skill/blueprint/reference/decide.md) · refresh: [catalog-refresh.md](skill/blueprint/reference/catalog-refresh.md) · profiles: [preferences/README.md](skill/blueprint/preferences/README.md)

## Repository

```
QUICKSTART.md, QUICKSTART.ja.md   start here
skill/blueprint/                  the skill: SKILL.md, catalog/*.yaml, elements/, reference/, templates/
  catalog/schema.md               shape of every file
  preferences/                    preference profiles (lean-fast-full, all-in, org)
  project-maps/                   shared project maps, opened in the app at #/p/<slug>
  reference/dry-run-sample.md     a sample project run idea → exit through the MCP, with gaps found
  reference/walkthrough-non-engineer.md   screen-by-screen walkthrough (Japanese)
app/                              web app (Vite): npm ci && npm run build → dist/ (+ data.json, llms.txt)
mcp/                              MCP server: npm ci && npm run build && npm test
shared/decide-core.mjs            scoring and decision records, used by both the MCP and the app
legacy/, skills/, drafts/, ui/    earlier versions (v0.2 README in legacy/launch-blueprint/README-v0.2.md), drafts, prototypes
```

## Rules of the house

- The owner decides. Blueprint shows options, a recommendation and consequences; it never flips `open` to `decided`. Agents may record `ai_selected`; only the owner records `decided` (`owner_confirmed: true`).
- Prices, terms and store rules are never asserted from memory. Each has `source.checked` and `verified`; `stale_items` lists what is old.
- Generic only: no product names of user projects and no personal names in the catalog, lessons or proposals. Vendor names in comparisons are fine.
- Every rule or lesson has a principle, what to avoid, why, and a yes/no check.

Not legal or tax advice. Verify laws, thresholds and vendor limits with a primary source.

License: MIT © 2026 CREATIVITY IS EVERYWHERE, LLC · Credits: `CREDITS.md`

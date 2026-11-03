# Blueprint — Quickstart

日本語版：[QUICKSTART.ja.md](QUICKSTART.ja.md)

Blueprint is a map of every decision a product needs, from idea to launch, operation, scale and exit. Each decision comes with options from a catalog (free tiers, limits, lock-in, who is liable, a source and the date it was checked), one AI recommendation with a reason, and the decisions it depends on. People read it as a web app; AI agents read the same files through an MCP server.

Three layers:

| Layer | File | What it holds |
|---|---|---|
| Elements | `skill/blueprint/elements/elements.yaml` | 7 principles that rarely change (experience, product, business, marketing, brand, maintenance, security) |
| Tactics | `skill/blueprint/elements/tactics.yaml` | 41 decisions. Each has a stage, a lane, options (catalog ids), an AI pick, and `depends_on` |
| Project map | exported by the app or `draft_project_map` | your project: status per decision, pick, reason, rejected options |

Six stages: idea → build → launch → operate → scale → exit. Six lanes: BRAND, UX, UI, TECH, BIZ/LEGAL, RULES.

## A. Five minutes as a non-engineer (web app)

```bash
cd app && npm ci && npm run dev
```

Open the URL Vite prints. Then:

1. **01 始める (Start).** Type a name and a one-line goal. Answer four questions: who it is for, where it runs, how money moves, which country. Press "地図を見る →".
2. **02 地図 (Map).** The strip at the top shows the six stages with a large number (decided) over a small one (total) and one square per decision. The map below has six lanes of dots. Lines are real dependencies only. "まずここから" (start here) lists the three decisions you can make right now.
3. **03 決める (Decide).** Open a dot. Accept the AI pick ("おすすめで決める") or choose another option and press "選んだものに決める". Checklists need every box ticked. Tech decisions show a stack comparison underneath: similar services and free tiers, one vendor vs combining several, when a paid plan is worth it, the pick and the rejected ones.
4. Repeat until the stage numbers fill up. Decided dots and their lines turn orange.
5. **EXPORT YAML** (top right) and give the file to your AI agent. "MARKDOWN" gives a human-readable version.

The answers stay in your browser only. A longer, screen-by-screen walkthrough in Japanese is in `skill/blueprint/reference/walkthrough-non-engineer.md`.

## B. Five minutes as an AI agent (MCP)

Build and register the server once:

```bash
cd mcp && npm ci && npm run build && npm test
claude mcp add blueprint -- node /ABS/PATH/launchblueprint/mcp/dist/index.js   # Claude Code
```

Cursor and Claude Desktop use the same command in their `mcpServers` JSON (see `mcp/README.md`).

The server is read-only. Its tools, in the order an agent normally uses them:

| Step | Tool | Returns |
|---|---|---|
| 1 | `list_topics(stage?)` | every decision with stage, lane, options, AI pick, `depends_on`, whether a comparison exists |
| 2 | `draft_project_map({profile, name, goal})` | the project map with AI picks applied from the owner's four answers, `next_steps`, `blocked`, `progress` per stage, YAML |
| 3 | `get_comparison(topic)` / `get_item(id)` | the stack comparison for a tech decision, or one catalog entry (normalized + raw) |
| 4 | ask the owner, then `draft_project_map({..., decided: {topic: optionId or [checked ids] or "all"}})` | the map advanced one round; repeat from 3 |
| any | `search(query)`, `get_catalog(domain, format)`, `list_domains`, `get_reference(name)`, `get_template(name)`, `get_skill` | everything else in `skill/blueprint/` |
| before quoting a price | `stale_items(days)` | entries unverified, unchecked or older than `days` |
| at the end | `propose_learning(text, category)` | appends a generic learning to `mcp/inbox/learnings.jsonl` for a person to review |

A prompt that works:

```
Use the blueprint MCP. My answers: audience=business, platform=web, money=paid, country=jp.
Call draft_project_map, then for each next step read get_comparison or get_item and give me
one recommendation with the reason and the rejected options. Ask me before marking anything
decided. Say "unverified" for any price with verified:false.
```

Rules the agent must keep: the owner decides; never mark `decided` on your own. Prices and limits with `verified: false` or no `checked` date are unverified. No product or personal names in anything you write back (`propose_learning`). A full run of a sample project through every stage, with the gaps it found, is in `skill/blueprint/reference/dry-run-sample.md`; `mcp/test/dryrun.test.mjs` replays it.

Without MCP, an agent can read `app/dist/llms.txt` and `app/dist/data.json` after `npm run build` in `app/`, or load `skill/blueprint/SKILL.md` as a Claude Code skill.

## C. How to read the map

- **Stage strip (top).** Six stages. Large thin numeral = decided, small = total. Squares: outline = open, white = AI pick waiting ("仮"), orange = decided. Press a stage to light up only its decisions.
- **Dots.** Outline = open, white = AI pick waiting, orange = decided. The small line under a dot shows the current pick.
- **Lines.** Only `depends_on` from `tactics.yaml`; nothing decorative. A line turns orange when both ends are decided. Press T to show only the decided path.
- **Lanes.** BRAND, UX, UI, TECH, BIZ/LEGAL, RULES, left to right.
- **TRACE** (bottom right). Number of decided steps.
- **04 カタログ (Catalog).** All 34 catalog areas and 407 items, with which decisions use each item.

## D. What is in the catalog

`skill/blueprint/catalog/*.yaml`, one file per area. Tech services (frontend, backend, database, auth, hosting, storage_media, search, realtime, ai_llm, ci_cd, monitoring, email_notifications, analytics, security, payments, cms, editor_ui, ui_libraries, i18n), go-to-market and operations (gtm_channels, support, business_setup, cross_border, app_distribution), rules and lessons (rules, ui_ux, data_protection, freshness, build_vs_buy), scale and exit (scale_readiness, dd_dashboard, exit_dd), and ledgers (lifecycle, canvas). The shape of every file is in `skill/blueprint/catalog/schema.md`. Every rule or lesson has a principle, what to avoid, why, and a yes/no check. Every tech decision has a stack comparison in `skill/blueprint/elements/stack_comparisons.yaml` (rule R-030).

## E. Where things are

```
README.md / README.ja.md      what this is
QUICKSTART.md / .ja.md        this file
skill/blueprint/              the skill: SKILL.md, catalog/, elements/, reference/, templates/
app/                          web app (Vite). npm run build → dist/ with data.json and llms.txt
mcp/                          MCP server. npm run build && npm test
legacy/, skills/, drafts/, ui/   earlier versions, drafts and UI prototypes
```

© 2026 CREATIVITY IS EVERYWHERE, LLC · MIT

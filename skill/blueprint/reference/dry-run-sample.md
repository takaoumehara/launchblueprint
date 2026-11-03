# Dry run: a small booking app for a local studio, idea → exit, using only the MCP

日本語要約：見本プロジェクト「小さなスタジオの予約アプリ」を、Blueprint の MCP ツールだけで構想から終了まで通した記録です。41 の決めることが 5 回の「次に決めること」で全部埋まり、6 つの段がすべて 100% になりました。見つかった穴（決めることが無かった段、引けなかった id、届かなかったファイル）はこの PR で直し、直していないものは末尾の「残り」に書いています。再現は `cd mcp && BP_DRYRUN_OUT=/tmp/dryrun.json npm test`。

Publisher: CREATIVITY IS EVERYWHERE, LLC. Generic sample; no real product or person.

## The sample

| Intake answer | Value | Why |
|---|---|---|
| audience | `business` | the studio owner is the customer |
| platform | `web` | bookings happen from a phone browser; no store app at first |
| money | `paid` | the studio charges customers; no marketplace |
| country | `jp` | one country, Japanese first, English later |
| name | Studio booking (sample) | |
| goal | Let a small studio take bookings and payment online instead of by phone and cash. | |

This is the same scenario as the sample canvas in `catalog/canvas.yaml` (event booking) but run through the current tools instead of a hand-drawn map.

## How the run works

The run is the test `mcp/test/dryrun.test.mjs`. It behaves like an agent with no prior knowledge of the repo:

1. `get_skill` once, to read the procedure.
2. `list_topics` once, to see every decision with its stage, options, AI pick and `depends_on`.
3. `draft_project_map(profile, name, goal, decided)` in a loop. Each call returns `next_steps` (decisions whose dependencies are decided), `blocked`, `progress` per stage, and the project map YAML.
4. For every next step: `get_comparison(topic)` when a stack comparison exists, else `get_item(id)` for each option. Checklists call `get_item` for each check.
5. The owner "accepts the AI pick" (in the test; in real use the agent asks first), and the loop continues.
6. `stale_items(90)` before any price is quoted.

Total tool calls: 2 setup + 6 map drafts + 20 comparisons + 24 item lookups + 1 stale check.

## The five rounds

| Round | Decisions that became available (stage) | Tools read |
|---|---|---|
| 1 | idea_validation, rules_ledger, business_setup, brand_basics, build_vs_buy, market_entry (idea); database, frontend, ui_patterns (build) | comparisons: database, frontend, build_vs_buy; items: es.us_first, es.jp_en, es.mor_first |
| 2 | hosting, auth, storage, search, realtime, cms, ui_library, i18n, ui_copy, data_protection (build/operate); app_distribution (launch); exit_dd (exit) | comparisons: hosting, auth, storage, search, realtime, cms, ui_library, i18n; items: dist.* |
| 3 | backend, payments, email, ci, editor_ui, ai (build); monitoring (operate); analytics, protection (launch) | comparisons: backend, payments, monitoring, email, protection, ai, ci, editor_ui; items: an.* |
| 4 | launch_channels, cross_border, legal_basics, ai_defense, store_rules (launch); support, dd_metrics (operate); preview_rules (build); scale_plan (scale) | items: gtm.*, sup.* |
| 5 | growth_channels (scale); sunset_plan (exit) | items: gtm.* |

Progress after round 5: idea 6/6, build 19/19, launch 8/8, operate 4/4, scale 2/2, exit 2/2.

Profile rules fired as expected: `country: jp` → market entry `es.jp_en` (Japanese and English from day one); `audience: business` → growth channel `gtm.content`.

## The resulting map, by stage

**Idea.** Problem interviews, pain × persona, demand test, intent sentence, business model (`idea_validation`, from the lifecycle ledger). Rules ledger R-004 / R-012 / R-016 / R-022 / R-030 acknowledged. Business setup: public support address, processor account per brand, LLC formation cost. Brand basics: name, voice, colour, message order. Build vs buy: start on a platform (`bvb.platform`). Market entry: `es.jp_en`.

**Build.** Next.js front end on Vercel, Supabase for database, auth, storage, realtime and Postgres full-text search; backend logic in Route Handlers; Stripe Checkout; Resend for mail; Vercel Git integration for CI with per-PR previews and preview DB isolation; shadcn/ui, vaul for the phone editing sheet, microCMS for owner-edited text, next-intl for the message keys; UI pattern and copy checklists.

**Launch.** PostHog analytics, Cloudflare Turnstile, AI-attack defence checklist, store rules (not applicable for web, still checked), cross-border checks (i18n, legal, payments/tax axes), legal basics (terms and privacy, ad law, tax and MoR, IP, billing operations: refunds, chargebacks, cancellation), launch on X.

**Operate.** Sentry, email support inbox, backup checklist (3-2-1, bucket lock, verify alerts, monthly restore test), DD metrics recorded from day one (users, money, cohort, infra, safety).

**Scale.** Content as the ongoing growth channel; scale tiers t0/t1 with their triggers.

**Exit.** Exit DD checklist (IP, OSS, contracts, privacy) and the sunset plan (notice, code health, infra record, metrics data room, billing sources).

## Gaps found and fixed in this PR

| # | Gap | Fix |
|---|---|---|
| 1 | The **idea stage had no validation decision**; the map started at brand and business setup. | New checklist `idea_validation` from lifecycle items lc.discover.01/02/04 and lc.strategy.06/08. |
| 2 | A paid product had **no legal / refund / tax decision** before launch (terms, privacy, refund policy, 特商法 display, tax, billing operations). | New checklist `legal_basics` (lc.legal.30–33, lc.pricing.35), depends on payments and market_entry. |
| 3 | **Backend** (where server-side logic runs) was not a decision; the catalog file existed but nothing reached it. | New choose topic `backend` plus a stack comparison. Prices and limits are marked unverified. |
| 4 | **DD metrics** and **sunset** were documented but not reachable as decisions, so operate and exit were thin. | New checklists `dd_metrics` (dd.users … dd.safety) and `sunset_plan` (dd.sunset, dd.code, dd.infra, dd.metrics, dd.billing_sources). |
| 5 | The **rules ledger** (rules.yaml) was unreachable from the map. | New checklist `rules_ledger` with the five all-project rules. |
| 6 | Decisions had **no stage**, so progress through idea → exit could not be shown or counted. | `stage` on every tactic, `stages[]` list, progress returned by `draft_project_map` and shown in the app. |
| 7 | MCP: **no way to look up one id** (every tactic option is an id), no list of decisions, no comparison accessor, templates unreachable, no way to produce a project map or the next steps. | New tools `get_item`, `list_topics`, `get_comparison`, `get_template`, `draft_project_map`. |
| 8 | MCP: `stale_items` ignored stack-comparison services; `ui_ux_checklist` returned ids without the `ui_ux.` prefix so they could not be fed back into `get_item`; `list_domains` had no titles or counts; error messages did not list valid values; lesson, rule, tier and group shapes lost their text in `format: items`. | All fixed; `coverage.test.mjs` checks that every file, option id and tech comparison is reachable. |
| 9 | App: only the 134 items referenced by decisions were in `data.json`; 20 of 34 catalog areas were invisible. | Catalog screen (04) lists all 34 areas and 407 items, with links between items and decisions. |
| 10 | App: light theme by default, no stage progress, dense lanes overlapped. | Dark by default, stage rail with large thin numerals and one square per decision, sub-labels hidden when the lane is tight. |

## Unverified items met on the way

`stale_items(90)` reported 74 of 190 sourced entries as unverified or unchecked. The ones this sample actually touched:

- `gtm_channels` (all), `support` (all), `app_distribution` entries (policies are verified, costs are not): memory-based drafts, marked `verified: false` in the files.
- `backend` comparison (new): all four services unverified.
- `ui_library` comparison: shadcn, Base UI, React Aria, HeroUI, daisyUI unverified (licence check pending).
- `auth`: better-auth, Auth.js, passkeys rows unverified; `cms.notion`, `ai.direct`, `i18n.tms-crowdin`, `bvb.build` unverified.
- `cross_border.entry_strategies` (`es.*`) have no `source` block at all, so `verified` is null.

An agent should say "unverified" for these instead of quoting a number.

## Remaining gaps (follow-ups, not in this PR)

1. **Booking-specific building blocks** are not in the catalog: calendar and slot inventory, reminders by SMS or LINE, no-show and deposit policy. Blueprint is generic; a `scheduling` domain or lifecycle items would cover it.
2. **No stack comparison** for `analytics`, `support`, `app_distribution`, and the three non-tech choices (`launch_channels`, `growth_channels`, `market_entry`). R-030 names tech decisions; analytics and support are close enough to deserve one.
3. **Japan-specific payment options** (KOMOJU, PAY.JP) exist in `payments.yaml` but are not options of the `payments` decision, and there is no `pick_when country: jp`. The recommendation (Stripe Checkout) was not changed.
4. `cross_border.entry_strategies` should get a `source` block so `stale_items` can see them.
5. `lifecycle.yaml` has 125 ledger items; only 10 are decisions. The rest are visible in the catalog screen but not actionable.
6. SKILL.md is Japanese only. English-speaking agents get the flow from the MCP server `instructions` and QUICKSTART.md, not from the skill.
7. The app cannot import a project map YAML back in; the flow is one-way (app → YAML → agent).

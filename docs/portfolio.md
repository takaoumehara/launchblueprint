# Five project maps (Part B)

日本語：[portfolio.ja.md](portfolio.ja.md)

Five real products mapped decision by decision, so the owner can walk every category, see how the parts connect, and see what an AI would pick under a preference profile without approving each node first. The maps live in `skill/blueprint/project-maps/` and ship with the web app.

**Default profile: `lean-fast-full`.** Nothing on these maps is decided: there is no owner confirmation anywhere. Statuses used:

- `observed` — a fact from the repo audit, with the file it came from (paths are `<repo>/<path>`; they were taken from the audit brief and not re-read in this pass).
- `ai_selected` — a recommendation only. Either `decide` scored it from the catalog under the profile, or it is a proposal with a named source (a PRD section, the BJM PO canvases); proposals keep their pick when the profile changes and get a "≠" mark instead.
- `gap` — unknown or open. The note says what is missing; the AI's suggestion is still shown under it.

## Open the maps

Run the app (`cd app && npm ci && npm run dev`, then open `http://localhost:5173/`) or use wherever the app is hosted, and add the hash:

| Map | Product | In production? | Map | Architecture | Screens |
|---|---|---|---|---|---|
| rakugaki-jam | live-wall doodle, QR join | unknown (handoff docs record a Firebase Hosting address, not re-verified) | `#/p/rakugaki-jam` | `#/p/rakugaki-jam/arch` | [desktop](screens/rakugaki-jam-map-desktop.png) · [390](screens/rakugaki-jam-map-390.png) · [arch](screens/rakugaki-jam-arch-desktop.png) · [arch 390](screens/rakugaki-jam-arch-390.png) |
| moime | mobile-first site builder | live per its own docs (moime.app; not opened here) | `#/p/moime` | `#/p/moime/arch` | [desktop](screens/moime-map-desktop.png) · [390](screens/moime-map-390.png) · [arch](screens/moime-arch-desktop.png) · [arch 390](screens/moime-arch-390.png) |
| local-pro-kit | store, generated sites, free check | unknown (mid-migration to Cloudflare Workers) | `#/p/local-pro-kit` | `#/p/local-pro-kit/arch` | [desktop](screens/local-pro-kit-map-desktop.png) · [390](screens/local-pro-kit-map-390.png) · [arch](screens/local-pro-kit-arch-desktop.png) · [arch 390](screens/local-pro-kit-arch-390.png) |
| lpk-frontdesk | booking front desk | **not in production** (README: not deployed) | `#/p/lpk-frontdesk` | `#/p/lpk-frontdesk/arch` | [desktop](screens/lpk-frontdesk-map-desktop.png) · [390](screens/lpk-frontdesk-map-390.png) · [arch](screens/lpk-frontdesk-arch-desktop.png) · [arch 390](screens/lpk-frontdesk-arch-390.png) |
| brand-journey-map | early concept, docs only | **not in production** (no app code; domain not registered) | `#/p/brand-journey-map` | `#/p/brand-journey-map/arch` | [desktop](screens/brand-journey-map-map-desktop.png) · [390](screens/brand-journey-map-map-390.png) · [arch](screens/brand-journey-map-arch-desktop.png) · [arch 390](screens/brand-journey-map-arch-390.png) |

Status counts (64 decisions each — `tactics.yaml` has 64 topics):

| Map | observed | ai_selected | gap | flagged (gap + observed with a gap note) |
|---|---|---|---|---|
| rakugaki-jam | 3 | 53 | 8 | 8 |
| moime | 13 | 51 | 0 | 4 |
| local-pro-kit | 12 | 51 | 1 | 5 |
| lpk-frontdesk | 6 | 55 | 3 | 6 |
| brand-journey-map | 0 | 54 | 10 | 10 |

## How to review a node

1. Open `#/p/<slug>`. The banner under the title says whether the product is in production. The row of 12 numbered categories (01–12, plus XB) is the walk order; a `!` marks a category the catalog has no decision for yet.
2. Click any node. The panel shows: the status and who set it; the pick (or the suggestion, for a gap); why it won; the **profile** it was scored under and the source date (**verified / unverified**); the evidence files; **linkages** to other parts (same vendor, pairs well, conflicts); every **alternative** with its seven scores; why each alternative lost; and what the other profile (`all-in`) would pick. A `GAP` tag or `≠` mark explains itself on hover.
3. Or walk the categories in order: `#/p/<slug>/c/01` … `/c/12`, with ← → buttons.
4. `#/p/<slug>/arch` draws frontend ↔ backend ↔ data ↔ sign-in ↔ payments ↔ third-party services. Solid line = implemented with evidence; dashed = proposed (AI pick, standard wiring, or a part the docs propose).
5. To approve, choose another option or defer, use the buttons in the panel. Changes stay in your browser until exported (Export YAML) and committed.

## What `all-in` would change (preview, not applied)

On every map a collapsed line under the banner lists this; the panel of each node shows it too. Nothing is applied until someone presses the profile button.

- **rakugaki-jam** — 14 AI picks change (among them: email → Resend, CI → Vercel Git, pricing model → freemium, CMS → Notion API, distribution → PWA); 1 observed fact flagged: Realtime Database ≠ Supabase Realtime.
- **moime** — 9 AI picks change (distribution → PWA, protection → Vercel Firewall, cost control → Vercel Spend, i18n → Lokalise …); 6 observed facts flagged: Firestore ≠ Supabase, Crisp ≠ help center, Next.js ≠ Expo, direct model APIs ≠ Firebase AI Logic, GitHub Actions ≠ Vercel Git, Cloud Run ≠ Cloudflare Workers.
- **local-pro-kit** — 11 AI picks change; 5 observed facts flagged: Turnstile ≠ Vercel Firewall, Astro ≠ Next.js, R2 ≠ Supabase Storage, direct model APIs ≠ AI Gateway, GitHub Actions ≠ Vercel Git.
- **lpk-frontdesk** — 13 AI picks change (email → Resend, CI → GitHub Actions, distribution → PWA …); no observed fact flagged.
- **brand-journey-map** — 7 AI picks change (monitoring → Vercel Observability, protection → Vercel Firewall …); 3 PO/PRD proposals flagged, kept: Neon ≠ Supabase, Stripe ≠ Paddle, next-intl ≠ Lokalise.

## Gaps and unverified items

Every item below is flagged on the map. None of it was re-verified in this pass.

**rakugaki-jam**
- Production host unknown: `vercel.json` and `firebase.json` hosting both exist; the Firebase Hosting address in the 2026-07-20 handoff docs was not re-verified for this repo.
- Backend: `firebase.json` points at `functions/`, which is missing.
- Sign-in: no `firebase/auth` in the jam code; the README's Firebase Auth mention is not evidenced there.
- No payments, email/SMS, analytics or AI API found; no CI workflows.
- Canvas + Web Audio are core per the brief, but no file is named (drawn as implemented with a note-only source).
- WCAG 2.2 AA is a target in PRODUCT.md, not an audit result.

**moime**
- Payments: checkout cannot start until the Stripe webhook signing secret is configured; no live payment has been made.
- Prices ($5/month, $25/6 months, $45/year + launch coupon) are listed in the repo docs and marked `verified: false`.
- SMS sign-in: regions JP and US first; physical SMS delivery still needs verification.
- AI: model keys are not in `.env.example`; production presence unknown.
- moime.app being live comes from the repo docs; not opened in this pass.
- Facts without a named file in the brief (note-only evidence): Firestore, Firebase Storage, Clarity + insights, Crisp, Secret Manager, Cloud Scheduler.

**local-pro-kit**
- Hosting mid-migration (Vercel → Cloudflare Workers); root `vercel.json` still present; custom-domain cutover not done; localprokit.com not confirmed live.
- Payments: live Stripe refused unless `STRIPE_LIVE_APPROVED`; whether a live payment has run is unknown.
- Email: provider set to Resend with `MESSAGING_LIVE=true`, but whether the API key is installed and mail sends is unknown (mock outbox exists).
- Analytics: no first-party store analytics; only Cloudflare observability.
- Turnstile is optional; on/off in production unknown.
- Note-only evidence: D1 + KV, R2, Cloudflare observability, Twilio, Google Places, the `GEMINI_MODEL` setting. Google OAuth for the Business Profile audit is off (`GBP_AUDIT_ENABLED`); GoHighLevel keys are demo-only; Name.com is sandbox.

**lpk-frontdesk** (not in production)
- Not deployed; LINE / Twilio / Stripe / Vagaro are fakes by default.
- Hyperdrive id is a placeholder (PG_TO_D1 sync not real yet); owner sessions depend on Local Pro Kit's lpk-ops D1.
- Payments: deposit flow behind a gateway interface, fake Stripe only.
- Email and analytics unknown; no AI API.
- Note-only evidence: D1 database name, bearer roles; the wrangler file name is not given in the brief.

**brand-journey-map** (not in production, docs only)
- Open items: O-01 (tldraw commercial license price unverified), O-11 (Clerk Organizations vs Supabase Auth), O-12 (Neon vs Supabase — PO direction now says Neon, not owner-confirmed).
- PO canvases 2026-11-18 (proposals, not decisions): one studio = one organization; payments = Stripe (resolves the Paddle vs Stripe conflict in the earlier pass); data = Neon Postgres + Cloudflare R2; modules usable standalone; the 17-slot "seal" being reconsidered; AI drafts with free models first, cited sources, human confirmation.
- PRD §14 proposals: Next.js on Vercel, next-intl, Vercel Workflow/Queues (not in the catalog), later co-editing (Liveblocks or tldraw sync).
- Image Sensor sources (Pinterest OAuth, Are.na, Unsplash): API terms unverified.
- Owner decisions D-01–D-10 are not mapped to tactic option ids (e.g. "Claude Code, not Base44" → build-or-buy stays a gap until the owner maps it).
- Email, SMS, analytics and production AI APIs: not implemented.
- The earlier pass file (`docs/03-blueprint/project-map.yaml`, 2026-11-13, 0 of 60 decided) was rebuilt from the brief's description of it — intake business / web / paid / global carried over — and was not re-read; its catalog ai_picks were not carried over as decisions.

**Across all five**: AI picks are catalog recommendations only. Under `lean-fast-full` the scorer suggests some options that fit web-only products poorly (Expo for distribution, Firebase Cloud Messaging for email, EAS Workflows for CI). Treat those as review items for the scoring, not advice.

## Refresh a map

- An agent calls `update_project_map({slug: "moime", records: [...], decide_topics: ["all"]})`; it returns the same link `#/p/moime` (and `#/p/moime/arch`). Facts (`observed`), flagged gaps and sourced proposals stay; AI picks are re-scored.
- `rescore_project_map({slug, profile: "all-in"})` previews a profile change without writing.
- To rebuild all five from their evidence files: `cd mcp && npm run build && node scripts/build-portfolio.mjs` (inputs in `mcp/portfolio/<slug>.yaml`; `--fresh` restarts history). Screens: `cd app && npm run build && npx vite preview --port 4173` then `node scripts/capture-screens.cjs`.

© 2026 CREATIVITY IS EVERYWHERE, LLC

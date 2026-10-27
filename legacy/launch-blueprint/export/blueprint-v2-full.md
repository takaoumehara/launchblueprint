# Launch Blueprint v2 + Brand Blueprint — full text for external review

Owner: CREATIVITY IS EVERYWHERE, LLC. Date: 2026-10-22. Status: draft for review, not yet in use.

## Purpose
Two AI-agent skills used before building any product: (1) **Launch Blueprint** — a tiered (T0–T3) intake, Decision Lock, day-1 gates learned from real projects, 9-step UX discovery, per-block planning, account lifecycle/security, per-country regulation, and a linked node map (`blueprint.yaml` with `depends_on`/`impacts`) so changes show their ripple effects; (2) **Brand Blueprint** — strategy, voice, identity, art direction, motion, sound/narration, physical brand, 360° touchpoints, linked into the same map. Goal: stop mid-project pivots of stack, host, name, and offer, without over-planning small projects.

## How to review
Read both skills end to end. Judge them as instructions an AI coding agent will follow for a solo founder / small company. Cite section numbers. Prefer concrete fixes over general advice.

## Questions
1. **Gaps**: what will a real project hit that is not covered (product, ops, data, finance, people)?
2. **Contradictions**: where do two rules conflict (e.g. tier skips vs. mandatory gates, ordering of brand vs. UX steps)?
3. **Over-engineering**: what should be dropped or moved to a higher tier so T0/T1 stay light?
4. **Missing or outdated regulations** for US, EU, UK, Japan (and others worth adding), incl. AI, accessibility, subscriptions, SMS/email, minors.
5. **Map**: are the `blueprint.yaml` nodes and edges right? Any missing node or wrong dependency direction?
6. **Pass conditions**: are UX steps and day-1 gates verifiable by a non-technical owner?
7. Top 5 changes you would make, ranked.

---

# File 1: SKILL.md (Launch Blueprint v2)
---
name: launch-blueprint
description: Produce a whole-project blueprint and one-view map BEFORE building any new product, app, SaaS, internal tool, prototype, paid feature, marketplace, or big change. Starts with a short AI-led intake that sets the depth (prototype / internal tool / public product / regulated or paid product) so only relevant blocks are filled and the rest are explicitly skipped. Covers product, audience, experience and design direction, tech stack and hosting, data, auth and account lifecycle (rename, delete, takeover, death/incapacity), security health, cost and AI-credit budget, legal and per-country regulation (GDPR, UK GDPR, Art.27 representative, CCPA/US states, COPPA, APPI, app stores, accessibility, subscriptions, EU AI Act), marketing, operations/support, analytics, and exit/migration. Outputs a machine-readable blueprint.yaml whose blocks are linked, so changing one block lists every block it impacts. Use whenever someone says "let's build", "new idea", "kickoff", "start a project", "pick a stack/host", "add payments/login", "go live", "is this free tier OK", "launch checklist", or is about to change direction, stack, host, or scope mid-project. Re-run at review points.
---

# Launch Blueprint v2

Purpose: see the whole project once, decide the expensive-to-change things up front, and make every later change show its ripple effects, so the project does not keep changing direction, stack, or host halfway through.

The owner asks about what is in front of them. This skill covers what they have not asked about yet, and only as deep as the project needs.

## 0. Intake first: set the depth (max 10 questions, one batch)

Ask these before anything else. Offer a recommended default answer for each so the owner can reply "defaults OK".

1. What is it, in one sentence, and who is it for?
2. Tier (pick one):
   - **T0 Sketch / prototype**: throwaway, no real users or data. Fill: Product, Experience, Stack (light), Cost cap. Skip everything else with `SKIPPED — T0`.
   - **T1 Internal / personal tool**: real data, known users only. Add: Data, Auth, Security, Ops, Exit. Skip marketing, public legal, most regulation.
   - **T2 Public product (free)**: strangers sign up. Everything except payments/tax; regulation by audience region.
   - **T3 Paid / regulated / minors / health / finance / AI decisions about people**: every block, plus lawyer review list.
3. Where are users (countries/regions) in the first 12 months? Any under 16 (under 13 in the US)?
4. Will it ever take money? When? (If "maybe later", plan the stack as if yes.)
5. Where should it be in 12 months: users, traffic, media (images/video/audio), AI usage?
6. What is already decided and not up for debate (brand, tools already paid for, host, language)?
7. Budget: monthly cash ceiling, and AI-credit budget per tool (which tool does heavy work, which is backup).
8. What is the single thing it must do well (the definition of done for v1)?
9. Content/positioning words to always use and never use.
10. Who approves what (publishing, sending, charging, deleting, merging)?

Rules: never ask more than 10; anything unanswered takes the stated default and is logged as an assumption. The tier can be raised later; raising it re-opens the skipped blocks. This prevents both blind spots and analysis paralysis.

## 1. Lock the "expensive-to-change" decisions (Decision Lock)

Before code, write a short Decision Lock: each item has the choice, one rejected option with reason, the trigger that would justify re-opening it, and the date.

- Host and runtime (decided for the 12-month shape, not for the fastest first deploy; commercial-use terms checked live)
- Framework and language; database and file/media storage
- Auth method and identity model (email, social, passkeys; one account = person or workspace)
- Domain and public URLs (no throwaway preview domains in anything public)
- Brand name, positioning sentence, banned words
- Design direction (pick from 2–3 options ONCE with the owner; record the pick)
- Payments provider / merchant of record (T3)
- Which AI tool does heavy work vs light fixes vs backup

Changing a locked item mid-project requires: impact list from the map (section 3), cost of the switch, and owner OK. No silent switches.

## 1.2 Day-1 gates from real projects (lessons learned; T1+ unless noted)

Every item below cost a real project days of rework. Each is a gate with a pass condition; unmet gates block the next phase.

| # | Gate | Pass condition | Feeds block |
|---|------|----------------|-------------|
| L1 | **Name + domain lock** (T0+) | Name chosen only after domain, trademark search and social handles are checked; domain registered to the company; no renaming without the change protocol | positioning, marketing |
| L2 | **Hosting decided for 12 months** | Cost ceiling computed at 0 / 100 / 10k users; free-tier limits and over-limit behavior listed with URL+date; tools already paid for checked first; one migration budgeted at most | hosting, cost |
| L3 | **Day-1 real-stack deploy spike** | A hello-world using the chosen framework + runtime + DB + auth is deployed on the real host on day 1 (framework/runtime fit proven before features) | hosting |
| L4 | **Demo vs real product** | Written answer: is this a demo, a prototype, or a sellable service? Separate branch/codebase or explicit "prototype will be rewritten"; preview DB strategy (no previews on production data) | scope, hosting, data |
| L5 | **Backup/restore gate** | Before any data-store change: export taken, restore tested on a copy, and a list of real users whose data must not be lost | data, exit |
| L6 | **Company identity before auth** | OAuth apps, sender names, store listings, and consent screens are created under the company (CREATIVITY IS EVERYWHERE, LLC or the project's company), never a personal name | auth, legal |
| L7 | **Email + DNS early** | Inbound and outbound email working with SPF/DKIM/DMARC before sign-up or contact forms ship | ops, auth |
| L8 | **Long-lead registrations on day 1** | Started day 1 with expected lead time: public business address, contact email, payment account, SMS A2P 10DLC, app-store accounts, legal pages | ops, legal |
| L9 | **Credentials checklist** | Per service: owner account, who has access, permissions/scopes, where the key lives, rotation date | security |
| L10 | **Secrets rules** | No secrets in chat, repos, logs, or screenshots; secret manager only; passwords never pasted to AI; card data only via the provider's secure form | security |
| L11 | **Admin excluded from public build** | Pre-deploy check proves admin routes/files are not in the public bundle; CDN cache purged after removal | security, ops |
| L12 | **Brand + real UI before landing page** | Brand direction, target and real product UI exist before the LP (no fake mock screens); motion ambition (none / subtle / showpiece) captured at kickoff | brand.identity, brand.motion, experience |
| L13 | **JTBD offer research** | Offer and pricing built from persona/JTBD/buying-psychology research and the buying experience, not from the maker's feature list; owner-pain/gain wording | positioning, ux.research |
| L14 | **Copy tone per language** | EN / ES / JA tone rules written; JA line breaks reviewed by eye (no orphaned particles); copy reviewed as text first | brand.voice, marketing |
| L15 | **Video pacing + checks** | Before production: scope, outcome, length, pacing (≥4 s per cut unless intended), script approved as text; AI art checked for anatomy errors; narration pronunciation verified (brand §7) | marketing, brand.voice_casting |
| L16 | **Paid-tool billing status** | Every paid tool (voice, video, hosting, AI) has its billing status checked before a job depends on it; failed renewals surfaced at once | cost |
| L17 | **AI-credit tracking** | Weekly table: tool, plan, used %, reset date, which tool does heavy vs light vs backup work | cost |
| L18 | **Shared-machine job queue** | Only one heavy job (build, render, large install) at a time on a shared machine; queue with owner and start time | ops |
| L19 | **Languages + feature flags** | Assume more languages than launch (i18n structure, not an EN/JA toggle); JA line-break rules (`word-break: auto-phrase` / `keep-all`) set; live feature flags listed and checked in production; embedding origins (`frame-ancestors`) decided | experience, hosting |
| L20 | **393px + design-system media** | Every page checked at 393px width (no 2-line headers/bars); all images, video and screenshots use design-system fonts/colors and are cropped at mobile width | brand.identity, experience |
| L21 | **Core message + exclusions** | One core sentence, what is deliberately left out, banned words, and per-channel language rules (e.g. which languages never go on which network) agreed with the owner before any content | positioning, marketing |
| L22 | **Script -> voice -> visuals** | Staged owner OK at each step; pronunciation dictionary (kana) before voice; STT diff vs script before the owner listens; captions max 2 lines (brand §7) | marketing, brand.voice_casting |
| L23 | **Host-move gate** (any host/DB/DNS move) | Tool versions verified (runtime e.g. Node 22 for wrangler; pg_dump >= server; monitor scripts check their commands exist); rehearsal on a copy with checksums + point-in-time bookmark (e.g. D1 Time Travel); read-only roles re-granted on new tables; build cache copy + smoke tests on the new host BEFORE DNS; wildcard + OAuth redirects ready beforehand; write-freeze flag deployed before cutover with announced window; MX/SPF/DKIM untouched; all DNS records (incl. apex CNAME) audited after the NS switch | hosting, data, exit, ops |

## 1.5 UX discovery (BEFORE any code; scaled by tier)

Owner-verifiable thinking, not a vibe. Each step writes a short artifact in `docs/blueprint/ux/` and is not "done" until its exit criteria are visibly met. Coding starts only after the tier's required steps pass (T0: steps 1, 3, 4, 9 in one page; T1: 1–5, 9; T2: all 9; T3: all 9 + research with real people). Unverified claims are marked `ASSUMPTION` and listed for the owner.

| # | Step | Artifact | Exit criteria (a human can check) |
|---|------|----------|-----------------------------------|
| 1 | Research | `research.md` | Problem stated in user words; ≥5 sources or interviews cited with links/dates; 3+ existing alternatives with what users like/hate; facts vs assumptions separated |
| 2 | Personas / JTBD | `personas.md` | 2–4 personas (1 primary), each tied to research evidence, with job-to-be-done ("when…, I want…, so I can…"), context (devices, place, time, ability), and a non-target persona |
| 3 | Pain points | `pains.md` | Pains ranked by frequency × severity, each with evidence; top 3 chosen and why others are out |
| 4 | Solution brainstorm | `ideas.md` | ≥3 genuinely different directions (incl. a non-software/manual one); scored on value, effort, risk; pick + rejected options with reasons |
| 5 | UX concept & user flows | `flows.md` (+Mermaid) | Concept in one paragraph; happy path + empty, error, offline, first-run, return-visit, cancel/delete flows; every step names the screen/channel |
| 6 | Customer journey map | `journey.md` | Stages aware → consider → start → use → get help → renew/leave; per stage: actions, thoughts, feelings, touchpoints, pains, opportunities |
| 7 | Service blueprint | `service-blueprint.md` | Rows: customer actions / frontstage (seen) / backstage (unseen staff or AI) / support processes & systems / evidence; lines of interaction, visibility, internal interaction; failure points and wait times marked |
| 8 | What the provider needs | `provider-needs.md` | People/roles, tools, vendors, data, policies, money, manual minutes per user, human-approval steps; each item linked to blueprint blocks (ops, cost, legal, account lifecycle) |
| 9 | Digital interface definition | `interface.md` | Screen/channel inventory derived from steps 5–7 (nothing in UI that no flow needs); per screen: purpose, data, actions, states, copy needs, a11y notes; this is the build spec |

Pass rule: a step passes only when every exit criterion is checked off in its artifact with evidence links; the owner can verify each box without reading code.

Rules: steps feed each other in order; a later discovery that changes an earlier step reopens it (log in blueprint.yaml under block `ux.*`). Show the owner steps 2, 4, and 7 as one-screen summaries for approval before step 9. Why: AI coding tools tend to jump straight to building; they cover these only when explicitly asked, so this skill asks.

Sources adapted: NN/g personas (https://www.nngroup.com/articles/persona/), journey mapping (https://www.nngroup.com/articles/journey-mapping-101/), service blueprints (https://www.nngroup.com/articles/service-blueprints-definition/), Double Diamond (https://www.designcouncil.org.uk/our-resources/the-double-diamond/), Jobs to be Done (https://www.christenseninstitute.org/theory/jobs-to-be-done/), Value Proposition Canvas (https://www.strategyzer.com/library/the-value-proposition-canvas), GOV.UK user research (https://www.gov.uk/service-manual/user-research), This is Service Design Doing methods (https://www.thisisservicedesigndoing.com/methods).

Brand: for T1+ public-facing work, run the Brand Blueprint (`brand/SKILL.md`) in parallel with steps 2–6; its `brand.*` nodes join this map.

## 2. Fill the blocks (only those the tier needs)

Each block: decisions, numbers, open questions, status (`DONE / NEEDS CONFIRMATION / SKIPPED — reason`). Never guess: unverified items get `NEEDS CONFIRMATION` plus the exact question; collect all into one batch at the end. Check vendor pricing and terms pages live and record URL + date checked.

1. **Purpose and audience**: who, problem, first segment and region, success metric, banned words/promises.
2. **Value and positioning**: offer, why now, tone; content claims must be true about what exists today vs. future (say which is which).
3. **Experience and design**: key flows, design direction picked once, accessibility target (WCAG 2.2 AA for T2+), languages; approve script/copy as text before producing audio/video/visual assets (cheapest check first).
4. **Tech stack and hosting**: one home by default; per-service table (commercial use on this plan, limits, over-limit behavior, price, URL, date). Spend caps and kill switch that work on THIS host (shared counter, not in-memory on serverless). Fail-closed config (sign-up closed unless explicitly opened).
5. **Data**: what personal data, where stored (region), retention, backups with a tested restore, export format, deletion path.
6. **Identity and account lifecycle**: see section 4.
7. **Security health**: see section 4.
8. **Cost and AI credits**: monthly fixed cost, cost per user, 10x/100x with arithmetic; AI credits per tool and when each is used; "cheapest-artifact-first" rule (text → voice → video).
9. **Legal and regulation**: see section 5 (scoped by tier and regions).
10. **Marketing and launch** (T2+): name/trademark search, domain, channels per language, where the first 10 users come from, posting approval rules.
11. **Operations and support**: manual minutes per user, human-approval actions, contact channel, response target, status page, incident runbook.
12. **Analytics**: the 3–5 events that prove the success metric; consent-aware (no non-essential tracking before consent in EU/UK).
13. **Exit and migration**: how to move host/DB/auth/payments, data export, domain ownership, what it costs if the Decision Lock is wrong; sunset plan and notice period.
14. **Owner to-do list**: human-only items (accounts, keys, contracts, filings, payments) in dependency order with rough days.

## 3. The map: blueprint.yaml (source of truth) + rendered view

Write `docs/blueprint/blueprint.yaml` next to the markdown. The markdown is for humans; the YAML is what the AI reads before every change. Render it as a node graph (Mermaid in the markdown; optional HTML view).

```yaml
project: example
tier: T2                    # T0..T3
regions: [US, EU, UK, JP]
updated: 2026-10-22
blocks:
  - id: purpose
    depends_on: []
    impacts: [positioning, ux.research]
  - id: positioning          # value, offer, name, banned words
    depends_on: [purpose, ux.research]
    impacts: [experience, marketing, brand.strategy]
  - id: ux.research
    depends_on: [purpose]
    impacts: [ux.personas, positioning]
  - id: ux.personas
    depends_on: [ux.research]
    impacts: [ux.pains, ux.journey]
  - id: ux.pains
    depends_on: [ux.personas]
    impacts: [ux.ideas]
  - id: ux.ideas
    depends_on: [ux.pains]
    impacts: [ux.flows]
  - id: ux.flows
    depends_on: [ux.ideas]
    impacts: [ux.journey, ux.interface]
  - id: ux.journey
    depends_on: [ux.personas, ux.flows]
    impacts: [ux.service_blueprint, brand.touchpoints, marketing]
  - id: ux.service_blueprint
    depends_on: [ux.journey]
    impacts: [ux.provider_needs, ops]
  - id: ux.provider_needs
    depends_on: [ux.service_blueprint]
    impacts: [ops, cost, legal.privacy, account_lifecycle]
  - id: ux.interface         # build spec
    depends_on: [ux.flows, ux.journey, brand.voice, brand.identity, brand.motion]
    impacts: [experience]
  - id: experience           # design direction, a11y, languages
    depends_on: [positioning, ux.interface, brand.identity]
    impacts: [hosting, marketing]
  - id: hosting
    title: Tech stack and hosting
    status: done            # done | needs_confirmation | skipped | open
    locked: true
    decision: "Cloud Run (us-east1)"
    rejected: [{option: "Vercel Hobby", why: "no commercial use"}]
    reopen_if: "monthly cost > $50 or cold start > 2s"
    depends_on: [data, cost, experience]
    impacts: [auth, analytics, exit, legal.privacy]
    open_questions: []
  - id: data
    depends_on: [ux.provider_needs]
    impacts: [hosting, legal.privacy, exit]
  - id: auth
    depends_on: [hosting]
    impacts: [account_lifecycle, security]
  - id: account_lifecycle
    depends_on: [auth, ux.provider_needs]
    impacts: [legal.privacy, ops]
  - id: security
    depends_on: [auth, hosting]
    impacts: [legal.terms, ops]
  - id: cost
    depends_on: [ux.provider_needs]
    impacts: [hosting]
  - id: legal.privacy
    status: needs_confirmation
    applies_because: "EU/UK users, no EU establishment"
    items: [gdpr, uk_gdpr, art27_rep]
    depends_on: [data, hosting]
    impacts: [data, analytics, ops]
  - id: legal.terms
    depends_on: [security, account_lifecycle]
    impacts: [marketing]
  - id: marketing
    depends_on: [positioning, ux.journey, brand.voice]
    impacts: [analytics]
  - id: ops
    depends_on: [ux.service_blueprint, security]
    impacts: [cost]
  - id: analytics
    depends_on: [marketing, legal.privacy]
    impacts: []
  - id: exit
    depends_on: [hosting, data]
    impacts: []
```

Rendered view (Mermaid; arrows = `impacts`):

```mermaid
graph LR
  purpose --> positioning & ux.research
  ux.research --> ux.personas --> ux.pains --> ux.ideas --> ux.flows
  ux.flows --> ux.journey & ux.interface
  ux.journey --> ux.service_blueprint --> ux.provider_needs
  ux.journey --> marketing & brand.touchpoints
  ux.provider_needs --> ops & cost & legal.privacy & account_lifecycle
  positioning --> experience & marketing & brand.strategy
  brand.strategy --> brand.personality --> brand.voice & brand.motion
  brand.identity --> ux.interface & experience
  brand.voice --> ux.interface & marketing
  ux.interface --> experience --> hosting
  cost --> hosting
  hosting --> auth & analytics & exit & legal.privacy
  auth --> account_lifecycle & security
  security --> legal.terms & ops
  data --> legal.privacy & exit
  classDef locked stroke-width:3px
  class hosting locked
```

Validation: every id used in `depends_on`/`impacts` (here and in `brand.yaml`) must exist as a block; a quick script or the AI checks this before saving.

Rules:
- Every block lists `depends_on` and `impacts`. Before changing any block, walk `impacts` transitively and list affected blocks in the proposal; mark them `open` until rechecked.
- `skipped` blocks keep a reason and the tier that would re-open them.
- The map must fit one screen: blocks as nodes, colored by status, locked items marked, red edges for blocks invalidated by the latest change.

## 4. Account lifecycle and security (T1+; mandatory T2+)

Answer each with: our policy, where implemented (code / terms / process), status.

- Sign-up abuse: bots, disposable email, rate limits, CAPTCHA, sign-up off switch.
- Rename handle/display name; change email; merge or split accounts; switch login method; handle reuse after deletion (cooldown).
- Delete account: self-serve, grace period, what is kept and why (billing/legal), deletion within the legal deadline (GDPR: without undue delay, ~1 month).
- Takeover and recovery: MFA/passkeys, new-device alerts, session list and remote sign-out, recovery that cannot be socially engineered, support identity checks, takeover playbook (lock, restore, notify, audit).
- Death, incapacity, disappearance: legacy contact or memorialization (like Facebook legacy contact, Google Inactive Account Manager, Apple Legacy Contact), inactive-account policy and timeline, how heirs/guardians request access or deletion, what happens to paid subscriptions and public content.
- Minors: age gate, parental consent (COPPA under 13 US; GDPR Art.8 13–16 by country), or refuse minors in terms + checks.
- Security health: dependency updates, secret storage and rotation, least-privilege keys, logging without personal data, backups/restore test, breach notification plan (GDPR 72h to authority), periodic review date.
- Liability allocation (Terms): user responsible for credentials and content; our liability cap; disclaimers; indemnity; acceptable use; dispute venue/arbitration where lawful. Note: consumer law in EU/UK/JP limits how much can be pushed to users; terms cannot replace actually securing the service.

## 5. Legal and per-country regulation (scope by tier + regions)

Mark each `applies / N/A — reason / NEEDS CONFIRMATION`. Templates are drafts, not legal advice.

- **EU GDPR**: lawful basis, privacy notice, DPAs with processors, data transfers (SCCs / EU-US Data Privacy Framework), cookie consent (ePrivacy).
- **Art.27 representative**: a non-EU company offering to EU users must appoint an EU representative; same under UK GDPR for UK users (narrow exemption for occasional, low-risk processing). Providers: Prighter (https://prighter.com/pricing/), DataRep (https://www.datarep.com/, UK: https://www.datarep.uk/).
- **UK GDPR + PECR** (cookies, marketing email/SMS).
- **US**: CCPA/CPRA (California) and other state privacy laws (thresholds vary), COPPA, CAN-SPAM, TCPA/A2P 10DLC for SMS, state auto-renewal laws and FTC rules on subscriptions/cancellation, DMCA agent for user content, sales tax nexus.
- **Japan**: APPI (個人情報保護法; overseas transfer consent/disclosure), 特定商取引法の表記 for paid services, 景品表示法 for claims, 電気通信事業法 (外部送信規律 for trackers).
- **Kids/teens**: COPPA, UK Age Appropriate Design Code, EU DSA minor protections.
- **App stores**: Apple App Store Review Guidelines and Google Play policies (in-app purchase rules, account deletion inside the app, privacy labels/data safety form).
- **Accessibility**: WCAG 2.2 AA; European Accessibility Act (in force June 2025) for consumer digital services in the EU; ADA risk in the US.
- **Consumer/subscriptions**: EU 14-day withdrawal right, clear cancellation, price-change notice, VAT/merchant of record.
- **AI rules**: EU AI Act (transparency for chatbots/generated content; high-risk uses; GPAI duties), disclosure of AI-generated media, model/provider terms on commercial use and outputs.
- **Platform content**: EU DSA notice-and-action for user content, takedown process.

### When a lawyer is needed
Always for T3 before launch: Terms + Privacy review, minors, health/finance, AI decisions about people, cross-border data, trademark conflicts, any dispute or regulator letter. T2: at least a one-time review of Terms/Privacy. Options (verify current pricing live before recommending):
- Policy generators: Termly (https://termly.io), iubenda (https://www.iubenda.com)
- Online legal plans / attorney access (US): LegalZoom (https://www.legalzoom.com), Rocket Lawyer (https://www.rocketlawyer.com)
- Japan: 弁護士ドットコム (https://www.bengo4.com) to find and consult lawyers
- Trademark: USPTO search (https://tmsearch.uspto.gov), J-PlatPat (https://www.j-platpat.inpit.go.jp), EUIPO (https://euipo.europa.eu)
Avoid "AI lawyer" products that claim to replace a lawyer; regulators have acted against such claims. Use AI to prepare questions and drafts, a lawyer to sign off.

## 6. Change protocol (prevents mid-project pivots)

When anyone proposes changing stack, host, scope, design direction, or positioning:
1. Name the block and whether it is locked.
2. Walk `impacts` in blueprint.yaml; list every affected block and the rework cost (hours, credits, money).
3. Show the cheapest test that would confirm the change is right.
4. Get owner OK; update YAML, changelog, and `reopen_if`.

## 7. Review points
Before public launch; at the 10th paying customer; before price changes; before adding an external service or moving host; when raising the tier or adding a region; after any incident, dispute, or legal complaint. Re-open vendor pages and update dates.

## Output checklist
- [ ] Day-1 gates L1–L18 passed or SKIPPED — reason
- [ ] Intake answered (or defaults logged); tier and regions set
- [ ] UX discovery steps for this tier passed exit criteria; owner saw personas, ideas, service blueprint
- [ ] Brand Blueprint run (or SKIPPED — reason) and linked
- [ ] Decision Lock written, each with rejected option and reopen trigger
- [ ] Every block for this tier filled; others `SKIPPED — reason`
- [ ] blueprint.yaml valid, every block has depends_on/impacts; map rendered
- [ ] Cost and AI-credit numbers with 10x/100x
- [ ] Account lifecycle and security rows answered (T1+)
- [ ] Regulation rows scoped to regions; lawyer list marked
- [ ] All NEEDS CONFIRMATION collected into one question batch
- [ ] Owner to-do list ordered with days
- [ ] No secrets, no personal home address or personal names in public docs; no preview domains in public links


---

# File 2: brand/SKILL.md (Brand Blueprint)
---
name: brand-blueprint
description: Define a whole brand before producing any visual, copy, voice, sound, motion, or physical asset, so every AI tool (image, design, copy, ElevenLabs voice, animation, SFX) stays consistent. Covers strategy (mission, vision, values, promise, positioning, Brand Key, Kapferer prism), personality and voice/tone scales, UX writing and naming, logo/favicon/app icon/logo and opening animation, art direction for photo and illustration with AI prompt rules, color/type/layout tokens, motion and micro/nano-interactions, loading and click behaviour, UI sound, sonic logo, voice casting, optional physical brand (scent, lighting, materials, space layout and circulation), a 360° touchpoint map with business-type templates and proactive mockups, and a trend scan. Tiered so small projects skip blocks. Outputs brand.yaml linked to the Launch Blueprint map. Use for "new brand", "rebrand", "logo", "brand book", "tone of voice", "design system", "pick a voice", "sound logo", "store design", or before generating any brand asset.
---

# Brand Blueprint

Brand is not the look. The look, words, voice, motion, sound, and space all come from one defined personality. Define that first, then derive every asset from it. Fill `template.md` and `brand.yaml`.

## Operating loop: Establish -> Encode -> Express (replaces waterfall)
- **Establish** (B0–B1): strategy, personality, voice, identity foundations (§1–§4).
- **Encode** (B1+): write the brand as a codified, agent-readable system — `brand.yaml` + `brand-skill.md` with tokens, "how it should feel", relationships, rules, prompts, style refs, voice IDs. Pass condition: a fresh AI agent given only these files produces an on-brand asset that the owner accepts without extra explanation.
- **Express** (B2+): touchpoints (§9) generated from the encoded system; generate many variants, stress-test, humans curate. Learnings loop back to Establish/Encode.
- **Deliverable is the generator system** ("make things that make things"): prompts, style references, own illustration style, per-language voice, rules — not only final assets. Pick models per strength (humor, language, image) and record which model does what.
- **Anti-slop Why gate**: every output states its Why (intent/story it serves); reject outputs justified only by cheap/fast/volume. Keep a **Not-to-do list** (what we will not make) next to the banned words. Taste and curation stay human; time saved goes to emotion and craft.
- **Prototype in code from day 1**: brand/UI ideas tested as coded Path A/B branches with real users instead of opinion debates.
- **Governance gate** (before any scaled or personalized generation): written compliance tests (e.g. alcohol, minors, health, claims, likeness), red-team example prompts with expected refusals/edits, named human reviewer; pass = all red-team cases handled.

## 0. Intake (max 8 questions, defaults offered)
1. Business type and where customers meet it (online only / local service / retail / B2B / personal brand).
2. Tier: **B0 Sketch** (name, 3 personality words, palette, type, logo placeholder) · **B1 Product/personal** (+ strategy core, voice/tone, UX writing, logo set, favicon/app icon, tokens, motion basics, art direction) · **B2 Public brand** (+ full motion, sound/UI SFX, voice casting, touchpoint map, brand book) · **B3 Physical/multi-location** (+ sonic logo, scent, lighting, materials, space & circulation, vehicles, signage).
3. Existing assets that are locked (name, logo, colors, paid fonts).
4. Audience and markets/languages (JA/EN etc.).
5. 3 brands admired and 1 to never resemble, with why.
6. Words always / never used.
7. Budget for fonts, stock, voice credits, print/physical.
8. Who approves.
Skipped blocks are written `SKIPPED — tier Bx` with the tier that reopens them.

## 1. Strategy core (B1+)
- **Mission** (what we do daily, for whom), **Vision** (world if we succeed), **Values** (3–5, each with "we do / we don't" behaviours).
- **Brand promise**: one sentence the customer can hold us to; list proof points that exist today vs later.
- **Positioning**: for [target] who [need], [brand] is the [frame] that [benefit] because [reason to believe]. Plus competitor map on 2 axes.
- **Brand Key** (Unilever-origin model): root strengths, competitive environment, target, insight, benefits, values/beliefs/personality, reasons to believe, discriminator, essence.
- **Kapferer Identity Prism**: physique, personality, culture, relationship, reflection, self-image.
Exit: owner can repeat the essence in ≤7 words; every later block cites it.

## 2. Personality, voice, tone (B1+)
- Personality: Aaker dimensions (sincerity, excitement, competence, sophistication, ruggedness) — score 1–5 and pick 1–2 dominant. Optional archetype.
- Voice = constant; tone = varies by situation. Use NN/g 4 tone dimensions as sliders 1–5: funny↔serious, casual↔formal, irreverent↔respectful, enthusiastic↔matter-of-fact. Add calm↔energetic and warm↔cool.
- Tone matrix: situations (onboarding, success, error, payment, deletion, outage, marketing, support) × slider settings × example line, per language (JA keigo level stated explicitly).
- "This, not that" pairs (e.g. 落ち着いた、でも冷たくない).
Exit: two writers (or two AI runs) produce lines a reviewer can't tell apart.

## 3. UX writing, copy, naming (B1+)
- Rules: sentence case or not, numbers, dates, buttons as verbs, error = what happened + what to do, no blame, empty states, confirmations for destructive actions, inclusive language, banned words, AI-disclosure wording.
- Glossary (one term per concept, JA/EN pairs). Microcopy library for common states.
- Naming (product, features, plans): criteria, 10+ candidates, linguistic check in each market language, domain/handle/trademark check (links in main blueprint §5).
Exit: copy deck for top flows from UX step 9 written in voice.

## 4. Identity system (B0 minimal, B1+ full)
- **Logo**: brief from strategy → 3 directions → 1 refine; primary, horizontal, stacked, symbol, wordmark; mono/inverse; clear space, minimum size, misuse sheet. Vector (SVG) master.
- **Favicon/app icon**: SVG favicon + 32px ICO + 180px apple-touch + 192/512 PNG + maskable; test at 16px. Follow Apple HIG app icons and platform masks.
- **Logo animation / opening animation**: 1–3 s, built from the logo's geometry, reduced-motion still version; sound sync to sonic logo (§7) if B2+. Deliver as Lottie/Rive/MP4 and first/last frames.
- **Color**: primary, neutrals, semantic (success/warn/error/info), light & dark, contrast-checked (WCAG 2.2 AA). **Type**: families incl. Japanese, scale, line-height, license. **Layout**: grid, spacing scale, radius, elevation, density.
- All as design tokens in DTCG format (`tokens.json`), consumable by code and design tools.

## 5. Art direction: photo & illustration (B1+)
- Mood boards (owner picks once). Photo: subjects, casting/diversity, light (natural/hard), color grade, framing, depth, what never appears. Illustration: style, line, fill, texture, perspective, character rules.
- **AI image prompt rules** (consistency): a fixed style block appended to every prompt (medium, palette with hex, light, lens/composition, texture, mood, negative list); reference images saved in `brand/refs/` and passed every time; seed/model/version logged; same 3 test prompts re-run when switching tools; reject list; disclosure of AI imagery where required.
Exit: 6 generated samples placed side by side read as one brand.

## 6. Motion & interaction (B1 basics, B2 full)
- Motion personality from §2 (e.g. calm = longer ease-out, low overshoot; energetic = snappy spring).
- Tokens: durations (e.g. 100/200/300/500 ms), easings/springs, distances, stagger. Choreography rules (what moves first, enter vs exit).
- **Micro/nano-interactions**: hover, press (scale/depth/ripple), click/tap feedback timing (<100 ms), focus ring, toggle, drag, success/error, copy-to-clipboard, pull-to-refresh, scroll/parallax rules.
- **Loading**: skeletons vs spinners vs progress by wait length (<1 s none, 1–10 s indicator, >10 s progress with %); branded loader; optimistic UI.
- Always `prefers-reduced-motion` alternative; no flashing >3/s.
Exit: Storybook (or HTML) page showing every token and interaction live.

## 7. Sound & voice (B2+; sonic logo B3 or on request)
- **UI SFX**: palette of ≤8 sounds (tap, success, error, notify, open/close), shared key/timbre, loudness normalized, off by default or easy mute, click-only unless asked.
- **Sonic logo / sound signature**: 1–3 s mnemonic (Japanese CM style: animated logo + jingle/voice call of the name); variants (full, short, notification); pairs with §4 animation.
- **Voice casting (ElevenLabs etc.)**: voice brief from personality (age range, gender or neutral, warmth, pace wpm, pitch, accent, energy), per language; audition 3 voices on the same script; record chosen voice ID + settings (stability, similarity, style, speed) in brand.yaml; pronunciation dictionary (brand name, product terms, JA readings in kana); speaking-style notes (pauses, emphasis, 敬語). Approve the script as text before generating audio; verify generated audio by transcribing and diffing against the script.
- Music direction: genre, tempo, instruments, licensing source.
- **Narration rule (any voiced video/audio)** — cheapest artifact first:
  1. **Script as text**: final narration in each language, with reading notes (kana for JA names/terms, IPA or respelling for EN), pauses, and target duration (JA ~300–350 chars/min, EN ~140–160 wpm). Owner approves the text.
  2. **Voice**: generate with the cast voice + pronunciation dictionary.
  3. **Pronunciation check**: transcribe the generated audio with a speech-to-text tool (e.g. Whisper or the provider's STT) and diff against the approved script; every mismatch on names/terms is fixed (dictionary, respelling, or re-take) and the diff is re-run until clean. A native-speaker listen is still required for JA accent/intonation, which STT does not catch.
  4. **Visuals** only after voice passes; cut timing follows the audio.
  Video stays private/unlisted until step 3 passes and the owner approves.
  Captions max 2 lines; screenshots cropped at mobile width; all frames use design-system fonts/colors. Agree the one core sentence and what is left out before the script (Launch §1.2 L21–L22).

## 8. Physical brand (B3 or per business; skip otherwise)
- **Scent** (signature scent notes, intensity, where diffused), **lighting** (color temperature K, brightness, accent vs ambient), **materials/finishes** (touch, sustainability), **uniforms**.
- **Space layout & circulation**: choose intent — *discovery* (meandering paths, varied heights, treasure-hunt displays, like KALDI) vs *efficiency* (straight lanes, clear sightlines, like typical US supermarkets) vs hybrid; entry/decompression zone, hero display, dwell points, checkout flow, accessibility routes.
- **Sound in space**: music genre/tempo by daypart, volume, sonic logo use in store.
- **Signage & wayfinding**: type, color, materials matching tokens; bilingual rules.
- **Packaging & print**: unboxing order, paper/finish, inserts, print color specs (CMYK/Pantone from tokens).
- **Vehicles & outdoor** (local services): wrap, yard signs, uniforms — see §9 templates.
- **Checks**: fire/accessibility codes for layouts, allergen/scent sensitivity notice, local signage permits.
Exit: one-page physical spec (scent, K, materials, layout sketch with circulation intent) approved by the owner.
- **Retail-digital touchpoints**: QR/NFC, in-store screens, receipts, booking, loyalty, signage that matches UI tokens.

## 9. 360° touchpoint map (B2+)
Wheel with three rings: pre-purchase (ads, social, search, website, signage, word of mouth) · purchase (store, checkout, app onboarding, sales, contract) · post-purchase (packaging, email, support, invoices, community, renewal, offboarding). Mark each touchpoint `make now / later / N/A`.
**Business-type templates** — the AI proposes these proactively, with mockups on real templates, even if not asked:
- Local service (lawn care, cleaning, plumbing): truck/van wrap, uniforms/caps, yard signs, door hangers, magnets, invoices, Google Business profile, before/after photo style.
- Café/restaurant/retail: storefront sign, menu, cups/bags/packaging, stickers, receipts, staff apron, window graphics, scent/lighting/music.
- SaaS/app: app icon, onboarding, emails, OG images, docs, status page, pitch deck, swag, conference booth.
- Personal brand/creator: profile images, banners, intro/outro, thumbnails, slide template, email signature, business card, portfolio.
- B2B/agency: proposal/deck, case-study template, contract, LinkedIn, office signage.
Exit: mockup sheet of the top 6 touchpoints for the business type.

- **AI agents / bots as an audience**: content and UI are also read by search, answer engines and agents (SEO/AEO); provide structured, machine-readable versions; adaptive per-context UI only after the governance gate.

## 10. Trend scan (B1+, re-run at reviews)
Scan 5–10 current references (Awwwards, Mobbin, platform design news, competitor sites) dated this month; list trend, where seen (URL, date), fit to personality (adopt / adapt / reject + why). Trends serve the brand, never replace it. Log in brand.yaml `trends:`.

## 11. Map: brand.yaml (linked to blueprint.yaml)
Same node format as the Launch Blueprint. Ids are `brand.*`; edges cross into product blocks.
```yaml
blocks:
  - id: brand.strategy      # mission, vision, values, promise, positioning
    impacts: [brand.personality, brand.naming, positioning]
  - id: brand.personality
    depends_on: [brand.strategy]
    impacts: [brand.voice, brand.art, brand.motion, brand.sound, brand.physical]
  - id: brand.voice         # voice/tone + UX writing
    impacts: [ux.interface, brand.voice_casting, marketing]
  - id: brand.identity      # logo, favicon, color, type, tokens
    impacts: [brand.motion, brand.touchpoints, experience]
  - id: brand.motion
    depends_on: [brand.personality, brand.identity]
    impacts: [ux.interface, brand.sound]
  - id: brand.sound         # UI SFX, sonic logo
  - id: brand.voice_casting # ElevenLabs voice id + settings
  - id: brand.art           # photo/illustration + AI prompt block
  - id: brand.physical
  - id: brand.touchpoints
    depends_on: [brand.identity, ux.journey]
  - id: brand.trends
```
Changing personality or identity walks `impacts` and lists every asset to regenerate with credit/time cost (change protocol from the main blueprint).

## 12. Deliverables
`brand/template.md` filled, `brand.yaml`, `tokens.json`, logo pack, favicon/icon set, AI prompt style block, voice profile, motion/SFX demo page, touchpoint mockups, brand book (PDF/HTML). Order: text decisions → static visuals → motion → sound/voice → physical (cheapest artifact first).

## Sources adopted (verified 2026-10-22)
- Aaker, "Dimensions of Brand Personality", JMR 1997 — https://www.jstor.org/stable/3151897
- Kapferer brand identity prism — https://en.wikipedia.org/wiki/Kapferer
- NN/g tone of voice dimensions — https://www.nngroup.com/articles/tone-of-voice-dimensions/
- Mailchimp voice & tone guide — https://styleguide.mailchimp.com/voice-and-tone/
- Atlassian voice & tone — https://atlassian.design/foundations/content/voice-tone
- Brand strategy template — https://www.ebaqdesign.com/blog/brand-strategy-template
- Design Tokens Community Group format — https://tr.designtokens.org/format/ , https://www.designtokens.org/
- Material 3 motion, color, tokens — https://m3.material.io/styles/motion/overview , https://m3.material.io/styles/color/system/overview , https://m3.material.io/foundations/design-tokens/overview
- Apple HIG motion & app icons — https://developer.apple.com/design/human-interface-guidelines/motion , https://developer.apple.com/design/human-interface-guidelines/app-icons
- Carbon motion — https://carbondesignsystem.com/elements/motion/overview/
- NN/g animation duration, progress indicators — https://www.nngroup.com/articles/animation-duration/ , https://www.nngroup.com/articles/progress-indicators/
- Reduced motion — https://web.dev/articles/prefers-reduced-motion , https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions
- Favicons — https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs , https://realfavicongenerator.net/
- Sonic branding — https://en.wikipedia.org/wiki/Sonic_branding , https://sonicbranding.org
- ElevenLabs voice design & prompting — https://elevenlabs.io/docs/creative-platform/voices/voice-design , https://elevenlabs.io/docs/best-practices/prompting
- Motion files — https://lottiefiles.com/ , https://rive.app/ ; component demo — https://storybook.js.org/
- Trend references — https://www.awwwards.com/websites/ , https://www.mobbin.com
Brand Key (Unilever) and touchpoint wheel are widely used models; no canonical open page verified, so they're described from general knowledge.


---

# File 3: brand/template.md
# Brand Blueprint — [brand]
Tier: B_ · Markets/languages: · Owner/approver: · Updated:
Status per block: DONE / NEEDS CONFIRMATION / SKIPPED — reason

## Loop status
Establish: | Encode (brand.yaml + brand-skill.md path, agent-readable test result): | Express:
Generator system (prompts / style refs / voices / model-per-task):
Why gate: each asset's Why | Not-to-do list:
Code prototypes (Path A/B branch, test, result):
Governance: compliance tests | red-team cases | reviewer | pass?
## 1 Strategy
Mission: | Vision: | Values (do / don't):
Promise: | Proof today: | Proof later:
Positioning: For __ who __, __ is the __ that __ because __.
Brand Key: root strengths | environment | target | insight | benefits | values/personality | RTB | discriminator | essence
Prism: physique | personality | culture | relationship | reflection | self-image
## 2 Personality & voice
Aaker scores (sin/exc/comp/soph/rug): | Dominant:
Sliders 1–5: funny–serious _ casual–formal _ irreverent–respectful _ enthusiastic–matter-of-fact _ calm–energetic _ warm–cool _
Tone matrix (situation × sliders × example EN/JA):
This, not that:
## 3 UX writing & naming
Rules: | Glossary: | Banned words: | Names + checks:
## 4 Identity
Logo set: | Favicon/icon set: | Logo/opening animation: | Colors (hex, light/dark, contrast): | Type (EN/JA, license): | Layout/spacing: | tokens.json path:
## 5 Art direction
Photo rules: | Illustration rules: | AI style block: | Negative list: | Refs folder: | Model/seed log:
## 6 Motion & interaction
Personality→motion: | Duration/easing tokens: | Hover/press/click/focus: | Loading rules: | Reduced motion:
## 7 Sound & voice
UI SFX palette: | Sonic logo: | Voice brief: | Voice ID + settings: | Pronunciation dict: | Music:
## 8 Physical (optional)
Scent: | Lighting (K): | Materials: | Uniforms: | Layout intent (discovery/efficiency/hybrid): | Retail-digital:
## 9 Touchpoints
Business-type template: | AI agents/bots audience (SEO/AEO, structured data): | Make now / later / N/A list: | Mockups:
## 10 Trends
| trend | seen at (URL, date) | adopt/adapt/reject | why |
## Open questions (one batch)

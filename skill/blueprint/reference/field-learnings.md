# Field learnings ledger

Where each batch of field learnings (`po-input` submissions from product-owner and specialist agents) went in the catalog. Names of products, clients, people, shops and repositories are removed; sources are counted, not named.

## Batch 2026-11-04

- Received: 198 numbered items in 25 files from 24 agents.
- Merged into existing items: 43 items into 35 existing ids (incl. rules R-009 and R-020, which got 4-part lesson forms `bm.captions-separate-and-validated` and `fs.L21`).
- New: 148 items became 84 new lessons/rules.
- Facts: 92 claims re-checked on official pages on 2026-11-04; 64 verified, 28 kept as `verified: false` (summary-only research, internal measurements, pages that could not be read).
- Not merged: 6 dropped, 1 held for the owner (contradiction with an existing rule).

Every new or extended item carries `occurrences` (distinct submissions that reported it) and `learned`; new items also carry `stage` and `context` (stack, product, cost), extended items carry `field_notes`; where facts exist, items carry `claims[]` with `source: {url, checked, verified}`. A lesson's own `verified` is true only when all of its claims are verified. `stale_items` lists every unverified claim.

### New items by domain

**Foresight** (`catalog/foresight.yaml`)

- `fs.L16` ×2 — no fact claims
- `fs.L17` ×2 — 0/1 facts verified
- `fs.L18` ×2 — no fact claims
- `fs.L19` ×5 — 0/2 facts verified
- `fs.L20` ×2 — 0/1 facts verified
- `fs.L21` ×3 — 0/2 facts verified
- `fs.L22` ×3 — no fact claims
- `fs.L23` ×1 — no fact claims
- `fs.L24` ×3 — no fact claims
- `fs.L25` ×3 — no fact claims
- `fs.L26` ×4 — 2/3 facts verified
- `fs.L27` ×1 — no fact claims

**CI/CD and release** (`catalog/ci_cd.yaml`)

- `ci.preview-access-planned` ×5 — 1/1 facts verified
- `ci.prod-source-verified` ×2 — 3/3 facts verified
- `ci.diff-scope-before-ship` ×2 — no fact claims
- `ci.deploy-config-in-git` ×1 — no fact claims
- `ci.credential-health-check` ×4 — 1/2 facts verified
- `ci.delete-references-together` ×1 — no fact claims
- `ci.tests-call-production-entrypoint` ×1 — 1/1 facts verified
- `ci.new-failures-vs-main` ×1 — no fact claims
- `ci.lockfile-same-commit` ×1 — 1/1 facts verified
- `ci.read-whole-function-before-severity` ×1 — no fact claims

**Database** (`catalog/database.yaml`)

- `db.no-table-rebuild-when-fk-enforced` ×1 — 1/1 facts verified
- `db.backfill-reviewed-separately` ×2 — no fact claims
- `db.ledger-store-capacity` ×1 — 2/2 facts verified
- `db.rules-deploy-with-client` ×1 — no fact claims

**Backend** (`catalog/backend.yaml`)

- `be.unknown-is-not-absent` ×3 — 1/1 facts verified
- `be.live-mode-guard` ×1 — no fact claims
- `be.tolerant-webhook-intake` ×1 — no fact claims
- `be.webhook-record-after-commit` ×1 — 1/1 facts verified
- `be.atomic-cap-reservation` ×1 — no fact claims

**Security** (`catalog/security.yaml`)

- `sec.dev-routes-excluded` ×1 — no fact claims
- `sec.csp-enforced` ×2 — 1/1 facts verified
- `sec.domain-ownership-reverified` ×1 — 1/1 facts verified
- `sec.inspect-ai-config-before-open` ×1 — 2/2 facts verified
- `sec.supported-runtime-major` ×1 — 2/2 facts verified
- `sec.prod-data-writes-audited` ×1 — 0/1 facts verified

**UI/UX** (`catalog/ui_ux.yaml`)

- `hidden-means-inert` ×2 — 1/1 facts verified
- `one-bordered-layer` ×3 — no fact claims
- `progressive-editor-panels` ×3 — 0/1 facts verified
- `two-width-reading-layout` ×2 — 1/1 facts verified
- `narrow-width-screenshot-gate` ×3 — no fact claims
- `qa-evidence-matches-real-render` ×3 — 0/1 facts verified
- `flagged-redesign-no-regression` ×2 — no fact claims
- `url-changes-redirect` ×2 — no fact claims
- `own-input-visible-on-shared-screen` ×1 — no fact claims
- `share-codes-fit-and-copy` ×1 — no fact claims
- `mode-flags-named-and-shown` ×1 — no fact claims
- `pay-options-in-buyer-words` ×1 — no fact claims
- `index-cards-equal` ×1 — no fact claims
- `urls-break-at-separators` ×1 — no fact claims

**Brand and media** (`catalog/brand_media.yaml`)

- `bm.captions-separate-and-validated` ×6 — 1/2 facts verified
- `bm.look-before-code` ×2 — no fact claims
- `bm.genimage-qa-gate` ×4 — 0/1 facts verified
- `bm.logo-mark-craft` ×2 — 1/1 facts verified
- `bm.safe-area-per-ratio` ×2 — 0/1 facts verified
- `bm.render-qc-every-file` ×2 — 1/2 facts verified
- `bm.recordings-legible-on-phone` ×1 — no fact claims
- `bm.seamless-loop-identical-frame` ×1 — 1/1 facts verified
- `bm.localize-on-screen-text` ×1 — no fact claims
- `bm.apparel-brand-sections` ×1 — no fact claims

**Launch and channels** (`catalog/gtm_channels.yaml`)

- `la.claims-match-live` ×4 — 1/1 facts verified
- `la.no-placeholder-in-deliverables` ×2 — no fact claims
- `la.channel-logins-before-launch` ×1 — 0/2 facts verified

**Pricing** (`catalog/pricing.yaml`)

- `pr.one-recommendation-first` ×1 — no fact claims
- `pr.setup-fee-vs-monthly` ×2 — 1/2 facts verified
- `pr.churn-in-revenue-plan` ×1 — 0/1 facts verified
- `pr.one-source-for-public-numbers` ×3 — no fact claims
- `pr.competitor-price-table-first` ×1 — 2/2 facts verified
- `pr.no-unsold-former-price` ×1 — 1/1 facts verified

**Validation** (`catalog/validation.yaml`)

- `val.positioning-replace-or-overlay` ×2 — 0/1 facts verified

**Legal and IP** (`catalog/legal_terms.yaml`)

- `lt.personal-name-sweep` ×1 — no fact claims
- `lt.subject-consent-recorded` ×2 — 0/1 facts verified
- `lt.patent-before-public` ×2 — 4/4 facts verified
- `lt.patent-claims-technical` ×1 — no fact claims
- `lt.ip-deadline-reminders` ×1 — 2/2 facts verified
- `lt.sign-in-person` ×1 — 1/1 facts verified
- `lt.trademark-search-before-name` ×1 — no fact claims
- `lt.trademark-applicant-is-owner` ×1 — 1/1 facts verified
- `lt.trademark-ids-and-classes` ×1 — 1/1 facts verified

**Client collaboration** (`catalog/client_collaboration.yaml`)

- `collab.multi-location-names` ×3 — 1/1 facts verified
- `collab.content-complete-before-launch` ×1 — no fact claims

**Business setup** (`catalog/business_setup.yaml`)

- `biz.event-income-business-account` ×1 — 2/2 facts verified

**AI** (`catalog/ai_llm.yaml`)

- `ai.voice-agent-preflight` ×1 — 2/2 facts verified

**Support** (`catalog/support.yaml`)

- `sup.one-contact-per-event` ×1 — no fact claims

**Payments** (`catalog/payments.yaml`)

- `pay.agentic-checkout-later` ×1 — 0/1 facts verified

### Existing items extended

- `fs.L01` (`foresight`) ×1 — 2/2 facts verified
- `fs.L05` (`foresight`) ×1
- `fs.L08` (`foresight`) ×1 — 1/1 facts verified
- `fs.L10` (`foresight`) ×1 — 2/2 facts verified
- `fs.L11` (`foresight`) ×1
- `fs.L14` (`foresight`) ×1 — 1/2 facts verified
- `fs.L15` (`foresight`) ×1
- `la.preview-noindex` (`gtm_channels`) ×2
- `la.seo-basics` (`gtm_channels`) ×2 — 1/2 facts verified
- `la.pr-disclosure` (`gtm_channels`) ×1 — 3/3 facts verified
- `pr.unit-cost-before-price` (`pricing`) ×1 — 1/2 facts verified
- `val.alternatives-first` (`validation`) ×1 — 0/1 facts verified
- `dp.admin-phishing-resistant-mfa` (`data_protection`) ×1
- `gate.privacy_rep` (`cross_border`) ×1 — 2/3 facts verified
- `collab.preview-access-by-audience` (`client_collaboration`) ×1
- `collab.case-study-rights` (`client_collaboration`) ×1
- `autoplay-is-muted-and-stoppable` (`ui_ux`) ×1 — 1/1 facts verified
- `i18n-cjk-fonts-line-breaking` (`ui_ux`) ×1
- `touch-targets-and-spacing` (`ui_ux`) ×1
- `decorative-motion-once` (`ui_ux`) ×1
- `perf-core-web-vitals-budget` (`ui_ux`) ×1 — 1/1 facts verified
- `a11y-text-contrast` (`ui_ux`) ×2 — 2/2 facts verified
- `no-hover-only-interactions` (`ui_ux`) ×1 — 1/1 facts verified
- `preview-state-switcher` (`ui_ux`) ×1
- `no-ellipsis-truncation` (`ui_ux`) ×1
- `define-every-screen-state` (`ui_ux`) ×1
- `error-state-recoverable` (`ui_ux`) ×1
- `form-labels-always-visible` (`ui_ux`) ×1
- `tap-row-to-open` (`ui_ux`) ×1
- `real-media-thumbnails` (`ui_ux`) ×1
- `design-system-fonts-everywhere` (`ui_ux`) ×1
- `offline-payment-holds-expire` (`ui_ux`) ×1 — 1/1 facts verified
- `migration-numbers-by-merge-order` (`ui_ux`) ×1 — 0/1 facts verified

### Contradictions and corrections (kept visible, not overwritten)

- A gesture-first input asked for *no* duplicate on-screen button; the existing rule `gestures-have-visible-alternative` (WCAG 2.5.1) requires one. Held for the owner; the rule is unchanged.
- Setup fee: one team needed day-one cash from a setup fee, another found the setup fee was the buyer's main barrier. Both kept in `pr.setup-fee-vs-monthly` as a comparison to run, not a rule.
- Captions: one production used Japanese lines of up to 20 characters; a published broadcast guide says 13 full-width characters (horizontal). Kept as a claim note on `bm.captions-separate-and-validated`.
- A2P 10DLC: submissions said unregistered US SMS cannot be sent; the official page says unregistered traffic pays additional carrier fees. Recorded on `fs.L10` and `la.claims-match-live`.
- Preview protection: submissions said hosted previews require login by default; the official docs do not say so (a team default can switch it on). Corrected in `ci.preview-access-planned`. It also sits next to `collab.preview-access-by-audience`, which keeps internal previews open: for bots use a bypass token rather than switching protection off.
- Prices and thresholds corrected on official pages: a site builder's entry plan is $19/month (annual), not $16; Korea's domestic-agent rule has no KRW 10 billion ICT-revenue test in the 2024 decree.

### Dropped

- chat-tool quirk (attachment with body text failed); tool-specific, the submitter flagged it as possibly not generic
- offline event operations (music licensing, DJ automix) are outside the product-building scope; facts unverified
- game-physics tuning specific to one game
- hit-radius tuning specific to one game
- sound-design taste for one interactive piece (vibrato/filter values)
- sound-design taste (silence when idle) for one interactive piece

© 2026 CREATIVITY IS EVERYWHERE, LLC

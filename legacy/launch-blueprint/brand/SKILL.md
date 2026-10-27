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

# Blueprint (v3, in progress)

新しい Blueprint は `skill/blueprint/` にあります。構成は [STRUCTURE.md](STRUCTURE.md)。以下は旧 launch-blueprint v0.2 の説明です。

The new Blueprint lives in `skill/blueprint/`; see [STRUCTURE.md](STRUCTURE.md). The text below describes the earlier launch-blueprint v0.2.

© 2026 CREATIVITY IS EVERYWHERE, LLC

---

# launch-blueprint

A Claude Code Agent Skill that makes the AI look at a new product or big feature the way a whole company would — **before any code is written** — and raise the topics the owner did not think to ask about.

It produces one blueprint covering: the facts that change everything (where the owner, entity and users are; whether money moves and between whom; user content; minors; AI), a regions table (serve, limit or block per region, with the obligations that follow), product and customer, pricing and unit cost, tech stack (free-plan commercial use, deploy and preview caps, edge database limits, fail-safe environment detection, kill switches, email caps and deliverability, AI feature caps), legal and business identity, marketing, operations, a mandatory **lifecycle and risk** pass (inactive accounts, cancellation, data deletion, deceased users, takedowns, chargebacks, outages, breaches, minors, privacy law, price changes, sunset, lock-in, 10x/100x cost, money between users, AI features), a **security** pass (account takeover and recovery, backups without credentials, header trust, URL fetching, silent job failure), an ordered to-do list for the human owner, and a decisions log with dates.

Every proposal comes with a recommended option, an alternative, and six angles: cost, legal, operations, marketing, implementation, UX. When a fact changes (the owner moves, the first payment, the first user from a new region), the skill revisits the decisions that depended on it.

Why: owners ask about what is in front of them. Costly problems — a host whose free plan forbids commercial use, cost caps that silently fail on serverless, legal blanks found at launch, EU users nobody planned for, a deploy cap spent by lunchtime, backups holding live tokens — live in the parts nobody asked about. See `skills/launch-blueprint/references/why-this-exists.md`.

## Install

```bash
# per project
mkdir -p .claude/skills && cp -r skills/launch-blueprint .claude/skills/
# or for all projects
mkdir -p ~/.claude/skills && cp -r skills/launch-blueprint ~/.claude/skills/
```

Optionally add to `CLAUDE.md`:

> Before writing code for any new product or big feature, use the launch-blueprint skill and wait for answers to its open questions.

## Use

Say "kick off <idea>" or paste `skills/launch-blueprint/references/prompt.md`. Output goes to `docs/blueprint/<name>-<date>.md`. Re-run before launch, at the 10th customer, before price changes, when adding a service, and whenever a fact that changes everything changes.

## Layout

```
skills/launch-blueprint/
  SKILL.md
  assets/blueprint-template.md
  references/{sections,jurisdictions,lifecycle-risk,security,vendor-check,proactive-tools,why-this-exists,prompt}.md
```

Not legal or tax advice. Laws and thresholds in the references must be verified with a primary source and a lawyer. Vendor limits change; the skill checks them live and dates every check.

## Changelog

- **v0.2** — Proactive behaviour: the skill asks the facts that change everything at kickoff and on every new fact, gives a recommended option and an alternative with six angles for every proposal, records decisions with dates, and revisits them when facts change. New regions pass (`references/jurisdictions.md`): EU/EEA, UK and Switzerland, US, the owner's home country; serve, limit or block; merchant of record versus own registrations; what blocking does not do. New security pass (`references/security.md`): OAuth-link takeover, email-change and recovery flows, support-desk verification, backups without credentials, header trust per host, SSRF and DNS rebinding, link-safety API terms, silent job failure, fail-safe environment detection. Tech stack and vendor check now cover free-plan flips at the first payment, daily deploy caps and push discipline, preview and database-branch limits, edge SQL limits emulated in tests, testing under realistic latency, email caps and deliverability, AI feature caps and fallback, content and internationalisation. Legal section adds DBA, trademark classes, filings, cyber insurance, company vendor accounts. Lifecycle catalog adds money between users and AI features. Template gains a facts block, a regions table and a decisions log.
- **v0.1** — First release: eight sections, lifecycle and risk catalog, vendor check, proactive tools scan, kickoff prompt.

## 日本語

新しい商品や大きな機能を作る前に、会社として必要な全側面（商品、価格と原価、技術構成、法律とお金、集客、運用、利用者のライフサイクルとリスク、セキュリティ、オーナーのやること一覧）を一枚の「ブループリント」にまとめさせるスキルです。オーナーが聞いていないことも先回りして指摘します。推測せず「要確認」として質問し、おすすめ案と代替案、費用の数字を必ず出します。詳しくは `README.ja.md` を参照してください。

License: MIT © CREATIVITY IS EVERYWHERE, LLC · Credits: `CREDITS.md`

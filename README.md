# launch-blueprint

A Claude Code Agent Skill that makes the AI look at a new product or big feature the way a whole company would — **before any code is written**.

It produces one blueprint covering product and customer, pricing and unit cost, tech stack (including whether each free plan allows commercial use, limits, and over-limit behavior), legal and money, marketing, operations, a mandatory **lifecycle and risk** pass (inactive accounts, cancellation, data deletion, deceased users, takedowns, chargebacks, outages, breaches, minors, privacy law, price changes, sunset, lock-in, 10x/100x cost), and an ordered to-do list for the human owner.

Why: owners ask about what is in front of them. Costly problems — a host whose free plan forbids commercial use, cost caps that silently fail on serverless, legal blanks found at launch — live in the parts nobody asked about. See `skills/launch-blueprint/references/why-this-exists.md`.

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

Say "kick off <idea>" or paste `skills/launch-blueprint/references/prompt.md`. Output goes to `docs/blueprint/<name>-<date>.md`. Re-run before launch, at the 10th customer, before price changes, and when adding a service.

## Layout

```
skills/launch-blueprint/
  SKILL.md
  assets/blueprint-template.md
  references/{sections,lifecycle-risk,vendor-check,why-this-exists,prompt}.md
```

Not legal or tax advice. Have a lawyer review what the blueprint flags.

## 日本語

新しい商品や大きな機能を作る前に、会社として必要な全側面（商品、価格と原価、技術構成、法律とお金、集客、運用、利用者のライフサイクルとリスク、オーナーのやること一覧）を一枚の「ブループリント」にまとめさせるスキルです。推測せず「要確認」として質問し、選ばなかった案と理由、費用の数字を必ず出します。詳しくは `README.ja.md` を参照してください。

License: MIT © CREATIVITY IS EVERYWHERE, LLC · Credits: `CREDITS.md`

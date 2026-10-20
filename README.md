# launch-blueprint

A Claude Code Agent Skill that makes the AI look at a new product or big feature the way a whole company would — **before any code is written** — and then keeps thinking ahead **while the work happens**.

**v0.2.** Kickoff produces one blueprint covering product and customer, pricing and unit cost, tech stack (including whether each free plan allows commercial use, daily build/deploy caps against the agents' push rate, limits, and over-limit behavior), legal and money, marketing, operations, a mandatory **lifecycle and risk** pass (inactive accounts, cancellation, data deletion, deceased users, takedowns, chargebacks, outages, breaches, minors, privacy law, price changes, sunset, lock-in, 10x/100x cost), and an ordered to-do list for the human owner.

New in v0.2, the skill also runs **continuously during the work** (`references/foresight.md`):
- **Decision look-ahead** — at every decision, three lines: what it requires next (2–3 moves), what else it changes (URLs, secrets, legal docs, cost, other products), who decides by when.
- **Ask-preflight** — before the owner is asked to do anything on a screen: can the agent do it via API instead; predict the screen; "if you don't see X, it means Y — do Z"; exact names to enter; fields to hide before any screenshot; a verification step.
- **Pre-mortem** — "six months later it failed; why?" five causes with mitigations, at kickoff and before launch.
- **"Not asked but important" digest** — top 3 unrequested points (money, legal, irreversible, long lead time, security, blast radius) at every milestone report.
- **Critical-path calendar** — the earliest launch date from external lead times (entity, tax ID, bank, payment processor, SMS registration, domain, trademark, insurance), stated on day one.
- **One batched agent-environment request** and **multi-agent rules** (one branch per agent, work board, one thread, one merger).

The fifteen traps that motivated it are in `references/field-lessons.md` as a checklist (trap, how to check, when).

Why: owners ask about what is in front of them. Costly problems — a host whose free plan forbids commercial use, a build cap hit by agent pushes, a domain change that touches every registered URL, a secret in a screenshot, a filing that publishes a home address — live in the parts nobody asked about, and most of them show up mid-project. See `skills/launch-blueprint/references/why-this-exists.md`.

## Install

```bash
# per project
mkdir -p .claude/skills && cp -r skills/launch-blueprint .claude/skills/
# or for all projects
mkdir -p ~/.claude/skills && cp -r skills/launch-blueprint ~/.claude/skills/
```

Optionally add to `CLAUDE.md`:

> Before writing code for any new product or big feature, use the launch-blueprint skill and wait for answers to its open questions. Keep using its foresight procedures during the work: on every decision, before asking me to do anything on a screen, and at every milestone.

## Use

Say "kick off <idea>" or paste `skills/launch-blueprint/references/prompt.md`. Output goes to `docs/blueprint/<name>-<date>.md`. Re-run before launch, at the 10th customer, before price changes, and when adding a service. Mid-work triggers: "decided", "choose", "buy domain", "register", "set up account/token/env var", "screenshot", "merge", "deploy", "what am I missing".

## Layout

```
skills/launch-blueprint/
  SKILL.md
  assets/blueprint-template.md
  references/
    sections.md          prompts for sections 1–6 and 8
    lifecycle-risk.md    mandatory lifecycle and risk catalog
    vendor-check.md      live vendor verification table
    foresight.md         continuous procedures A–F (new in v0.2)
    field-lessons.md     15 anonymized traps as a checklist (new in v0.2)
    proactive-tools.md   propose tools before being asked
    why-this-exists.md   two anonymized case studies
    prompt.md            copy-paste kickoff prompt
```

Not legal or tax advice. Have a lawyer review what the blueprint flags.

## 日本語

新しい商品や大きな機能を作る前に、会社として必要な全側面（商品、価格と原価、技術構成、法律とお金、集客、運用、利用者のライフサイクルとリスク、オーナーのやること一覧）を一枚の「ブループリント」にまとめさせるスキルです。v0.2 からは作業中も先回りします：決定のたびに2〜3手先を読む、オーナーに画面操作を頼む前に見える画面を予測する、プレモーテム、「頼まれていないが重要なこと」の報告、外部の待ち時間から逆算した最短公開日。詳しくは `README.ja.md` を参照してください。

License: MIT © CREATIVITY IS EVERYWHERE, LLC · Credits: `CREDITS.md`

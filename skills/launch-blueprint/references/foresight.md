# Foresight: think ahead during the work

The kickoff blueprint catches what is visible on day one. Most expensive surprises in a real project arrived *during* the work: a build cap hit by agent pushes, a domain changed mid-migration, a secret shown in a screenshot, a filing that published a home address. This file is the set of habits that catch those. Run them continuously, not once.

Each procedure has a **trigger**. When the trigger fires, run the procedure before replying to the owner. Keep the output short; the point is to surface the thing nobody asked about, not to write an essay.

The traps behind each procedure are listed in `field-lessons.md` (numbers in brackets, e.g. [L2]).

## Contents
- A. Decision look-ahead
- B. Ask-preflight (before the owner touches a screen)
- C. Pre-mortem
- D. "Not asked but important" digest
- E. Critical-path calendar
- F. Agent-environment batch request and multi-agent rules
- Quick reference: trigger → procedure

---

## A. Decision look-ahead

**Trigger:** any decision is made or proposed — by the owner ("let's use X", "I decided", "決めた") or by you (choosing a host, a library, a plan, a domain, a name, a vendor, a data model).

Write three short lines under the decision. Do not skip them for "small" decisions; small decisions are where surprises hide.

```
Decision: <what>
→ Requires next: <move 1> → <move 2> → <move 3>      (2–3 moves ahead; include lead times)
→ Also changes: <URLs / secrets / legal docs / cost / other products / other agents>
→ Who decides, by when: <owner|agent> by <date>; blocks <what>
```

What to look for in "Also changes":
- **URLs.** Anything registered elsewhere: OAuth redirect URIs, payment webhooks and return URLs, bot-protection hostnames, API-key referrer restrictions, platform API applications, site URL settings, email links. Update the URL registry (template §9). [L2][L3]
- **Secrets and tokens.** A new service means a new credential, a scope decision, and a place to store it. The first credential is made by a human; after that the agent automates via API. [L13]
- **Legal documents.** New data flow → Privacy Policy; new vendor → sub-processor list; new message channel → consent and registration. [L10]
- **Cost.** Plan change, new per-unit fee, new cap needed, free-quota behavior. Check the global monthly cap and kill switch first. [L14]
- **Other products and agents.** Shared cloud account, shared domain, shared repo. State the blast radius. [L4][L15]
- **Reversibility.** If it is hard to undo (domain purchase, entity filing, public listing, data migration), say so and ask before acting. [L8]

If a decision touches a URL, a secret, a filing, or money, also run **B** (if the owner must do something) and **E** (if it has a lead time).

## B. Ask-preflight

**Trigger:** you are about to ask the owner to do anything on a screen: create a token, set an env var, buy a domain, change DNS, sign up for a service, approve something, or send a screenshot.

Before sending the instructions, go through this list. Put the results in the message itself.

1. **Can the agent do it instead?** If an API, CLI, or existing credential can do the job, do it and tell the owner what you did. Ask the human only for the first credential of a service and for things that need a human identity (payments, identity verification, legal acceptance). Explain in one line why this one must be human-made. [L13]
2. **Predict the screen.** Write the steps as the owner will actually see them: menu names, button labels, the order of fields. If you have not seen the current UI, say "labels may differ" and give the goal of each step, not just the click. [L13]
3. **Add "if you don't see…" branches.** For every step that can fail silently, add one line: `If you don't see <X>, it means <Y> — do <Z>.` Common cases: the zone or project is not listed (DNS is at another provider, or the token's account differs); the form asks for a different field name; a plan upgrade is required; a verification step is pending. [L2][L13]
4. **Name the exact identifiers.** Env var names, scope names, plan names, exactly as the code expects them. Say "copy this name exactly". If the code can accept an alias, say so. [L6]
5. **Fields to hide before any screenshot.** List them: API keys, secrets, tokens, account IDs, email addresses, billing details. Say "blur or crop these". If a secret still appears in a screenshot or paste, say immediately: this key is now exposed, rotate it, here is how. [L5]
6. **Verification step.** End with one thing the owner (or you) can run or look at to confirm it worked: a settings check endpoint, a CLI command, a log line, a test request. Never leave "done" unverified. [L6]
7. **Public exposure check.** If the action is a filing, registration, listing, or profile, say where the entered data becomes public before they enter it (see `lifecycle-risk.md` §17). [L8]
8. **Cost and reversibility.** One line: does this cost money, is it reversible, and what is the kill switch.

Template:

```
What I need you to do: <one line>   Why a human must do it: <one line>
Steps (as you will see them):
1. ...   If you don't see ..., it means ... — do ...
2. ...
Hide before any screenshot: <fields>
Enter exactly: <NAME_OF_VAR> (not NAME_VAR or NAME_OF_VAR_KEY)
Verify: <command / page / expected result>
Cost / reversible: <...>
```

## C. Pre-mortem

**Trigger:** at kickoff, before launch, and before any irreversible step (domain change, entity filing, public listing, data migration, first paid campaign).

Write: *"It is six months later and this failed. Why?"* Then list **five** causes, each with a mitigation and an owner. Use the field lessons as a seed list, but think about this specific project.

| # | Cause of failure | Early warning sign | Mitigation | Owner | Done? |
|---|---|---|---|---|---|

Rules:
- At least one cause from each of: money, legal/compliance, infrastructure, people/process, external dependency.
- Prefer causes that are cheap to prevent now and expensive later.
- Put the result in template §9 and revisit at each review point.

## D. "Not asked but important" digest

**Trigger:** every milestone report, weekly status, PR summary, or any reply longer than a few lines about progress.

Add a short block at the end:

```
Not asked, but important (top 3):
1. <point> — why it matters — what I propose — by when
2. ...
3. ...
```

What qualifies (at least one must be true):
- **Money:** a cost that will change, a cap that is missing, a free tier about to end.
- **Legal:** a document, registration, consent, or disclosure that is needed.
- **Irreversible:** a step that is hard to undo once taken.
- **Long lead time:** something that takes weeks and has not started.
- **Security:** an exposed secret, an over-broad token, a public address.
- **Blast radius:** a change that can affect another product, account, or agent.

Rules:
- Top 3 only. If there are more, keep the rest in the blueprint's open questions and say "4 more in the blueprint".
- Each point names a concrete next action and a date.
- Do not repeat a point the owner has already decided on; mark it "decided" in §9 instead.
- Include tool and service proposals from `proactive-tools.md` here when they are high-fit and not yet raised.

## E. Critical-path calendar

**Trigger:** day one of any project, and whenever a new external dependency appears.

External lead times, not coding time, set the launch date. Compute the earliest launch date on day one and tell the owner which items to start immediately, in parallel.

Typical chain (verify each for the owner's country and vendors; durations are rough):
```
entity formation → tax ID → business bank account → payment processor live
                                                 → SMS carrier registration (A2P 10DLC: 1–3 weeks)
domain purchase → DNS move → certificates → URL registry updates
trademark search → filing (months; search is the blocker, not the filing)
insurance quotes → policy (days to weeks)
platform API applications / review (app stores, maps, messaging APIs: days to weeks)
```

| Item | Depends on | Start by | Rough duration | Earliest done | Blocks |
|---|---|---|---|---|---|

Rules:
- The longest chain is the launch date. State it: "Earliest launch: <date>, set by <item>."
- Anything with a lead time over a week is started in week one, regardless of when it is needed. [L10]
- Update the table when any item slips; say what the new launch date is.
- Put it in template §9 and in the owner to-do list (§8).

## F. Agent-environment batch request and multi-agent rules

### F1. One batched environment request [L12]

**Trigger:** before the agent starts any work that touches external services, and whenever a new service is added.

Do not ask for prerequisites one at a time. List everything in one message:

| Need | Why | Scope (narrowest) | Who creates | Where it lives | Verify with |
|---|---|---|---|---|---|
| network allowlist for `api.example.com` | deploy / API calls | host only | owner | agent config | `curl` test |
| API token for <service> | <task> | read-only on <project> | owner (first) | host secrets | settings check |
| env var `EXAMPLE_API_KEY` | <task> | — | owner | host env | settings check |
| permission: <action> | <task> | <project> | owner | — | dry run |

Rules:
- Narrowest scope that works. If a token can only be account-wide, say so and name the blast radius (what else it can reach). [L4]
- After the first credential exists, the agent creates further tokens, keys, and settings via API. [L13]
- Deploy and build caps: state the plan's daily cap and the expected agent push rate; if pushes exceed the cap, propose batching, a preview-only branch, or a plan change before it blocks production. [L1]

### F2. Multi-agent rules [L15]

**Trigger:** before a second agent (or a second human) starts work on the same repo or account.

Agree these in writing before the first parallel commit:
1. **One branch per agent.** Named `<agent>/<task>`. No pushes to each other's branches.
2. **A work board** with "files I touch" per agent. Overlap means talk first.
3. **One message thread** for coordination. Decisions in that thread, not in commit messages.
4. **Who merges.** One merger. Merge only after every reviewer (humans, review bots, CI, deploy previews) has finished and reported. [L11]
5. **Shared resources:** who owns the deploy cap, the API quotas, the env vars. One agent changes shared config; the other reads.
6. **Naming prefixes** for anything created in a shared account (`<product>-` on projects, tokens, buckets, DNS records) so the blast radius is visible and cleanup is possible. [L4]

---

## Quick reference: trigger → procedure

| When | Run |
|---|---|
| A decision is made or proposed | A |
| About to ask the owner to do something on a screen or send a screenshot | B |
| Kickoff, before launch, before an irreversible step | C (and E at kickoff) |
| Milestone report, status update, PR summary | D |
| Day one; a new external dependency appears | E |
| Before the agent's first external call; a service is added | F1 |
| A second agent or person joins the repo | F2 |
| Adding a service | A + F1 + `vendor-check.md` |
| Buying or registering anything (domain, entity, trademark, number) | A + B + E + `lifecycle-risk.md` §17 |
| Merging a PR | F2 rule 4 |
| Owner asks "what am I missing" / "何か見落としは" | C + D over the current state |

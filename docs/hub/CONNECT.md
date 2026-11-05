# Connecting to the Blueprint hub (phase 1: internal bots)

CREATIVITY IS EVERYWHERE, LLC

Phase 1 is for our own bots only. The address below is an internal workers.dev address; do not publish or share it.

- **Endpoint:** `https://blueprint-hub.creativityiseverywhere.workers.dev/mcp` (MCP Streamable HTTP, stateless)
- **Health:** `GET /health` returns `{"ok":true}` without a key.
- **Auth:** every `/mcp` call needs `Authorization: Bearer <your bot's API key>`. Without it you get 401. Keys in the query string are refused (400).
- **Keys:** one key per bot, issued by the owner. Never paste a key into chat, a commit, a PR, a log, or a prompt. Keep it in an environment variable (below: `BLUEPRINT_HUB_KEY`).

## Claude Code

```sh
claude mcp add --transport http blueprint-hub \
  https://blueprint-hub.creativityiseverywhere.workers.dev/mcp \
  --header "Authorization: Bearer ${BLUEPRINT_HUB_KEY}"
```

Add `--scope user` to use it in every project. Check with `claude mcp list`.

## Codex

In `~/.codex/config.toml`:

```toml
[mcp_servers.blueprint-hub]
url = "https://blueprint-hub.creativityiseverywhere.workers.dev/mcp"
bearer_token_env_var = "BLUEPRINT_HUB_KEY"
```

Export `BLUEPRINT_HUB_KEY` in the shell that starts Codex.

## Other MCP clients and bots

Any client that speaks Streamable HTTP works: point it at the endpoint and send the bearer header. Clients that only speak stdio can use a bridge such as `npx mcp-remote <endpoint> --header "Authorization: Bearer ${BLUEPRINT_HUB_KEY}"`.

Raw check (prints no key):

```sh
curl -s https://blueprint-hub.creativityiseverywhere.workers.dev/mcp \
  -H "Authorization: Bearer ${BLUEPRINT_HUB_KEY}" \
  -H "content-type: application/json" -H "accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}'
```

## What you can call

The same 14 tools as the local `mcp/` server (`list_topics`, `draft_project_map`, `get_comparison`, `get_item`, `search`, …) plus `propose_learning`. Reviewer keys also get `list_review_queue`.

## Sending a learning (`propose_learning`)

Send four layers. Write generically: no product, project, company, or personal names, no emails, phone numbers, or secrets (those are rejected and not stored).

```json
{
  "category": "infra-deploy",
  "principle": {
    "principle": "What to do, in one sentence.",
    "anti_pattern": "What to avoid.",
    "why": "What it cost when it went wrong.",
    "check": "A yes/no question a reviewer can answer."
  },
  "claims": [{ "claim": "A concrete fact to verify.", "source_url": "https://primary-source.example/docs" }],
  "context": { "stage": "launch", "fine_stage": "pr-review", "stack_type": "edge sqlite", "severity": "near_miss", "cost_days": 0.5 }
}
```

- `category`: an id from `elements/categories.yaml` (call `get_catalog` with `categories`) or a catalog domain.
- `context.stage`: `idea` | `launch` | `operate` | `scale` | `exit`. `context.severity`: `near_miss` | `delay` | `loss`.
- `claims` are always stored as unverified; a person checks them against a primary source.
- A near-identical principle already in the catalog or queue is counted as another occurrence (+1) instead of a new item. Reworded duplicates may not be caught yet; reviewers merge those.
- Everything lands in the review queue as `pending`. Nothing reaches the catalog without a person approving it.

## When to send

At every stage gate, ask the owner: "What happened that was not in the plan?" and "What would you have needed to know earlier?" Send each answer as one learning. Don't wait for a retrospective.

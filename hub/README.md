# Blueprint hub (phase 1: internal bots)

CREATIVITY IS EVERYWHERE, LLC · design: `docs/hub/DESIGN.md`

The hosted Blueprint MCP server as one Cloudflare Worker. It uses `createMcpHandler` from `agents/mcp/server` with an MCP SDK v2 `McpServer` factory. It is stateless: no McpAgent, no Durable Objects. It serves the same 14 tools as `mcp/` (stdio) over Streamable HTTP at `/mcp`, reading a catalog bundle built from `skill/blueprint` at build time. `propose_learning` writes to D1 after the auto-check pipeline runs. Nothing reaches the catalog without a person reviewing it.

| Path | What |
|---|---|
| `src/index.ts` | Worker entry: `GET /health` → `{ok:true}` (public); `/mcp` needs `Authorization: Bearer <key>`, otherwise 401 |
| `src/tools.ts` | The 14 tools (same output as `mcp/src/index.ts`, checked by `test/parity.test.ts`), plus `list_review_queue` for reviewer keys only |
| `src/catalog.ts` | Catalog reads over the bundle (same normalisation as `mcp/`) |
| `src/checks.ts` | Auto-check pipeline. Pure code, unit tested |
| `src/store.ts` | D1: `submissions`, `review_queue`, `occurrences` |
| `src/auth.ts` | Per-bot API keys; only the SHA-256 hex is stored (`api_keys`) |
| `migrations/0001_init.sql` | D1 schema |
| `scripts/build-catalog.mjs` | Writes `src/generated/catalog.json` (gitignored). Runs before tests and as the wrangler `build.command` |
| `scripts/gen-keys.mjs` | Key generation (see below) |
| `scripts/smoke.mjs` | Smoke test against a running hub |

## Auto-check pipeline (every `propose_learning`)

1. **Schema.** Four layers (same limits as `mcp/`). The category must be an id from `elements/categories.yaml` or a catalog domain. Claim URLs must be https.
2. **PII and secrets.** Emails, phone numbers, API keys (including `bph_` hub keys), and private keys are rejected and **not stored**.
3. **Duplicate / merge.** The principle (or `text`) is compared by token Jaccard with every catalog lesson and rule, and with root submissions still pending. Tokens are English content words with stopwords and polarity words removed, plus Japanese character bigrams. An exact fingerprint match counts as 1.0. A match ≥ 0.6 suggests that id as the merge target and adds +1 to its occurrence count (`occurrences`, with the distinct bots for the corroboration gate). Matches ≥ 0.3 are listed as `related`.
4. **Contradiction.** A catalog rule is flagged `contradicts:<id>` (flagged, not rejected) when it is similar (≥ 0.35) and either: one side uses an opposite keyword (before/after, always/never, …), or the two texts have opposite polarity (do vs. don't, with JA negation too). A submission that recommends a catalog anti-pattern (≥ 0.5) is also flagged. A contradiction is never suggested as a merge.
5. **Claims** are always stored with `status: "unverified"` and `verified: false`. Text-only submissions are flagged `needs_structuring`.

Every stored submission gets a `review_queue` row with `status = pending` and the full check result as JSON. No code path sets `approved`.

## Run locally

```sh
npm ci
npm test                                   # builds the catalog bundle, then node --test (needs ../mcp built for the parity test)
npx wrangler d1 migrations apply blueprint-hub --local
node scripts/gen-keys.mjs --out keys/local.keys.json --sql keys/local.sql my-bot owner:reviewer   # prints only the SQL path
npx wrangler d1 execute blueprint-hub --local --file keys/local.sql
npx wrangler dev --local                   # http://127.0.0.1:8787
node scripts/smoke.mjs --keys keys/local.keys.json
npx wrangler deploy --dry-run --outdir dist-bundle   # bundle only, no upload
```

`gen-keys` writes the plaintext keys to `--out` (JSON, mode 600, never overwrites) and the hashes to `--sql`. The default for `--sql` is next to `--out`. It prints only the SQL path; keys are never printed. `keys/` is gitignored. Roles: `bot` (default) or `reviewer` (`name:reviewer`). To revoke a key: `UPDATE api_keys SET revoked = 1 WHERE bot_name = '…'`.

Deploy (remote migrations, remote keys, `wrangler deploy`) is a separate step done by the owner. Config: `wrangler.jsonc` (`workers_dev` only, no routes or custom domains).

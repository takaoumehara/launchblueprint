# Evidence for the local workspace slice (2026-11-06)

Run from a cloud session. Commands: `cd mcp && npm test` (23 tests: store rules, human boundary, stale/changed/rejected, two-workspace isolation, export/import, server auth, MCP tool surface, clean-room install), `npm run test:e2e` (real Chromium), `cd app && npm test` (9, unchanged).

| Claim | Where it is checked |
|---|---|
| Fresh copy of the tree (no node_modules, no mcp/dist) bootstraps itself, serves MCP, saves, reopens, exports/imports | `mcp/test/cleanroom.test.mjs` (needs network for `npm ci`) |
| Agent cannot self-approve: no approve tool; `ownerApproved`/`approved`/`status`/`decidedBy` rejected; HTTP approve needs session token + same origin + loopback host | `mcp/test/workspace.test.mjs` |
| Stale proposal never overwrites a newer decision; amended proposal cannot be approved by an old view; rejected stays in history | same |
| Two workspaces share nothing; project ids cannot traverse paths | same |
| MCP propose -> live node update in browser -> keyboard approve -> reject -> stale -> server restart -> reopen; 390px has no horizontal scroll; reduced motion | `mcp/test/workspace.e2e.mjs` |
| Screenshots desktop + 390, EN + JA | `ui/evidence/*.png` |

## Not exercised
- Real Cursor / VS Code windows (config files and stdio protocol only), Windows, macOS.
- A second physical machine or a real friend install; "friend path" is two folders on one machine.
- Phone review of pending proposals (server is loopback-only by design here).
- Hosted Hub / URL + Bearer: not built, not claimed.
- Checklist-type decisions; screen-reader testing; full WCAG audit; contrast measured only by eye.
- The pre-existing Grok Bot connector (`/workspace/launchblueprint/mcp/dist/index.js`) was not touched; that box needs `node bin/blueprint.mjs bootstrap` run there.

Not release-ready: passing tests do not make this an external release.

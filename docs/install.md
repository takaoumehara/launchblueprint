# Blueprint: install and first project (5 minutes)

日本語: [install.ja.md](install.ja.md)

Blueprint is a map of product decisions. Your AI proposes; **you** approve in a browser. Everything stays in a folder on your computer. No account, no hosted service, no API key from us.

Requires: Node 20+, git, npm.

## 1. Get it and check it

```bash
git clone https://github.com/takaoumehara/launchblueprint.git
cd launchblueprint
node bin/blueprint.mjs bootstrap   # installs dependencies and builds mcp/dist; safe to re-run
node bin/blueprint.mjs doctor      # every line should say ok
```

`bootstrap` also runs automatically the first time your editor starts the MCP server, so a missing `mcp/dist/index.js` heals itself.

## 2. Connect your editor (pick one)

| Editor | Do this |
|---|---|
| **Claude Code** | Open the repo folder and start `claude`. It reads `.mcp.json`; approve the `blueprint` server when asked. Or run `node bin/blueprint.mjs connect claude` and paste the printed `claude mcp add` line. |
| **Cursor** | Open the repo folder. `.cursor/mcp.json` is already there; enable `blueprint` in Settings → MCP. |
| **VS Code (Copilot agent mode)** | Open the repo folder. `.vscode/mcp.json` is already there; start the `blueprint` server from the file's inline action. |
| **Any other MCP client** | `node bin/blueprint.mjs connect cursor` prints JSON with absolute paths (`mcpServers` form); `connect vscode` prints the `servers` form. |

## 3. First real project: save and reopen

```bash
node bin/blueprint.mjs serve        # prints http://127.0.0.1:4173/
```

1. In the browser: type a name and press **Create**. The map opens.
2. In your AI editor ask: *"Use blueprint. Create/choose my project and propose hosting, visual identity and animation with a short reason each."* It calls `workspace_propose_change`.
3. The nodes turn into dashed **Proposed** markers within about 2 seconds. Click a node for the reason, alternatives and what it affects.
4. Press **Approve** or **Reject** (Tab to the button, Enter). Only this browser can approve; the AI has no approve tool.
5. Stop the server (Ctrl+C), start it again, open the same URL: decisions, rejected and stale history are still there. Pending proposals wait for you even if the page was closed.

Your data: `~/.blueprint/projects/<id>/state.json` (set `BLUEPRINT_HOME` to use another folder).

## A friend using their own copy

Same steps on their machine. Their folder, their AI subscription, their keys; nothing of yours is involved and they cannot see your projects. To hand over **one** project on purpose:

```bash
node bin/blueprint.mjs export <project-id> project.json     # you
node bin/blueprint.mjs import project.json                  # friend: arrives as a NEW project
```

The export holds name, goal and decided choices only. Pending proposals and approvals never travel; the friend's AI proposes and the friend approves. The checksum catches damage, it does not prove who wrote the file; only import files you trust. There is no hosted Hub path in this release: the optional Hub design (`docs/hub/`, separate PR) is unverified and not needed for any step above.

## Limits you should know

- The approval boundary stops an AI that only has MCP tools and the HTTP API. It is not a sandbox: an agent with shell access can edit `~/.blueprint` files directly. Keep sensitive projects out of sessions you do not trust.
- Reviewing from a phone is not wired up (the server listens on this computer only). Proposals wait on disk until you open the browser.
- Checklist-type decisions cannot be proposed yet; only "choose one" decisions can.
- Tested in a real browser (Chromium) and over stdio MCP. Not tested in an actual Cursor or VS Code window, nor on Windows or macOS.

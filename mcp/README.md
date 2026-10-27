# Blueprint MCP

Blueprint のカタログ（技術・サービスの一覧）と参考資料を、どの AI からでも読めるようにする MCP サーバーです。
A small MCP server that lets any AI session read Blueprint's catalog and reference files.

- 読むだけです。書くのは `inbox/learnings.jsonl`（学びの提案箱）だけで、本体は変えません。
  Read-only. The only write is `inbox/learnings.jsonl`; the master files are never edited.
- データは `../skill/blueprint/` から読みます（`BLUEPRINT_DIR` で変更可）。

## ツール / Tools

| Tool | 内容 / What it does |
|---|---|
| `list_domains` | カタログの分野と参考資料の一覧 / list catalog domains and references |
| `get_catalog(domain)` | 分野の YAML をそのまま返す / raw YAML for a domain |
| `search(query, limit?)` | カタログ・参考資料・SKILL.md を全文検索 / full-text search |
| `get_reference(name)` | 参考資料（Markdown）/ a reference doc |
| `get_skill` | SKILL.md |
| `stale_items(days)` | 確認日が古い・未確認の項目 / items older than `days`, unchecked or unverified |
| `ui_ux_checklist(phase?)` | はい・いいえで答える UI/UX 確認表（requirements / design / qa）/ yes-no checklist |
| `propose_learning(text, category)` | 学びを提案箱に追加 / append a proposal to the inbox |

## 準備 / Setup

```bash
git clone https://github.com/takaoumehara/launchblueprint.git
cd launchblueprint/mcp
npm install
npm run build     # dist/ を作る / builds dist/
npm test          # 動作確認 / smoke test
```

以下の `/ABS/PATH` は、クローンした場所の絶対パスに置き換えてください。
Replace `/ABS/PATH` with the absolute path of your clone.

### Claude Code

```bash
claude mcp add blueprint -- node /ABS/PATH/launchblueprint/mcp/dist/index.js
```

### Cursor (`~/.cursor/mcp.json` or `.cursor/mcp.json`)

```json
{
  "mcpServers": {
    "blueprint": { "command": "node", "args": ["/ABS/PATH/launchblueprint/mcp/dist/index.js"] }
  }
}
```

### Claude Desktop (`claude_desktop_config.json`)

macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "blueprint": { "command": "node", "args": ["/ABS/PATH/launchblueprint/mcp/dist/index.js"] }
  }
}
```

設定のあと、アプリを再起動してください。/ Restart the app after editing.

## 学びの扱い / Learnings

`propose_learning` は提案を箱に入れるだけです。本体（catalog / reference）への反映は、人が確認してから行います。
Proposals are reviewed by a person before being merged into the master.

© CREATIVITY IS EVERYWHERE, LLC

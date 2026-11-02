# Blueprint MCP

Blueprint のカタログ（技術・サービスの一覧）と参考資料を、どの AI からでも読めるようにする MCP サーバーです。
A small MCP server that lets any AI session read Blueprint's catalog and reference files.

- 読むだけです。書くのは `inbox/learnings.jsonl`（学びの提案箱）だけで、本体は変えません。
  Read-only. The only write is `inbox/learnings.jsonl`; the master files are never edited.
- データは `../skill/blueprint/` から読みます（`BLUEPRINT_DIR` で変更可）。

## ツール / Tools

AI が使う順（典型）/ typical agent flow: `list_topics` → `draft_project_map(profile)` → 次に決めることごとに `get_comparison` か `get_item` → オーナーが決めたら `draft_project_map(..., decided)` → `propose_learning`。
サーバーの `instructions` にも同じ手順が入っているので、対応するクライアントなら自動で読まれます。

| Tool | 内容 / What it does |
|---|---|
| `list_domains` | 読めるもの全部：カタログの分野（題名・件数つき）、elements、参考資料、テンプレート / everything readable, with titles and counts |
| `get_catalog(domain, format?)` | 分野の YAML をそのまま（`yaml`）、または1つの形にそろえた一覧（`items`）/ raw YAML or a flat normalized list |
| `get_item(id)` | カタログの1件（例 `db.supabase`, `rules.R-004`, `lc.discover.01`）/ one entry by id, normalized + raw |
| `list_topics(stage?)` | 決めること（tactics）の一覧：段・列・選択肢・おすすめ・先に決めること / decisions with stage, lane, options, ai_pick, depends_on |
| `get_comparison(topic)` | スタック比較（R-030）：似たサービスと無料枠、1社 vs 組み合わせ、有料に切り替える境目、おすすめと却下理由 / stack comparison |
| `get_template(name)` | `project.axes.yaml` / `brand-context.md` / `project-map.template.yaml` |
| `draft_project_map(profile, name?, goal?, decided?)` | 4つの答えから地図を作る。おすすめ・次に決めること・止まっているもの・段ごとの進み具合・YAML を返す。決定はしない / build the project map; never decides on its own |
| `search(query, limit?)` | カタログ・elements・参考資料・テンプレート・SKILL.md を全文検索 / full-text search |
| `get_reference(name)` | 参考資料（Markdown）/ a reference doc |
| `get_skill` | SKILL.md（AI が従う手順）/ the procedure |
| `stale_items(days)` | 確認日が古い・未確認の項目（スタック比較の services も含む）/ items older than `days`, unchecked or unverified |
| `ui_ux_checklist(phase?)` | はい・いいえで答える UI/UX 確認表（requirements / design / qa）/ yes-no checklist |
| `propose_learning(text, category)` | 学びを提案箱に追加（固有名詞・個人名なし）/ append a proposal to the inbox |

テスト / Tests（`npm test`）: `smoke`（全ツール）、`coverage`（カタログの全ファイルが読める・全選択肢の id が引ける・tech の選択に比較がある）、`dryrun`（見本プロジェクトを最初から最後まで通す。`BP_DRYRUN_OUT=path` で記録を書き出す）。

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

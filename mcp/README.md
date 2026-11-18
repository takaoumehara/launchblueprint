# Blueprint MCP

Blueprint のカタログ（技術・サービスの一覧）と参考資料を、どの AI からでも読めるようにする MCP サーバーです。
A small MCP server that lets any AI session read Blueprint's catalog and reference files.

- 本体は読むだけです。書くのは提案箱 `inbox/learnings.jsonl`・`inbox/catalog-refresh.jsonl` と、プロジェクトの地図の下書き `inbox/project-maps/<slug>.yaml` だけです。
  The master files are never edited. Writes go only to the inbox: `inbox/learnings.jsonl`, `inbox/catalog-refresh.jsonl`, and project-map drafts in `inbox/project-maps/<slug>.yaml` (a person reviews them and moves a map to `skill/blueprint/project-maps/` to publish).
- データは `../skill/blueprint/` から読みます（`BLUEPRINT_DIR` で変更可）。

## ツール / Tools

AI が自分で選ぶ時の順 / agent flow when choosing on its own: `list_profiles` → `update_project_map(slug, name, intake, preference_profile)` → 実在のリポジトリなら事実を `observed`（evidence 必須）・見つからないものを `gap` で記録 → 決めごとごとに `decide(topic, project)` → `update_project_map(records: [{topic, status: "ai_selected"}])` または `decide_topics: ["all"]` → 返ってきた `#/p/<slug>` をオーナーに渡す → 大きな決定だけオーナーに聞き `decided`（`owner_confirmed: true`）。手順は `../skill/blueprint/reference/decide.md`。
従来の順 / classic flow: `list_topics` → `draft_project_map(profile)` → 次に決めることごとに `get_comparison` か `get_item` → オーナーが決めたら `draft_project_map(..., decided)` → `propose_learning`。
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
| `stale_items(days, refresh_plan?, used_only?, domain?, limit?)` | 確認日が古い・未確認の項目（スタック比較の services も含む）。`refresh_plan` で公式 URL・今の料金/上限の文・使っている決めごとを付ける / items older than `days`, unchecked or unverified; `refresh_plan` adds the official URL, current price/limit text and the decisions using it |
| `list_profiles` | 判断の好み（lean-fast-full 既定・all-in・組織の好み）と 7 基準 / preference profiles and the 7 criteria |
| `decide(topic, project?, profile?, intake?, chosen?, evidence?, extra_options?, also_under?)` | 選択肢を全部並べ、好みの重みで根拠つき採点 → 選んだもの・勝った理由・落とした理由・つながり・穴。status は `ai_selected` か `gap`（決定はしない）/ scores the whole field with evidence; never decides |
| `list_project_maps` / `get_project_map(slug, topic?, expand?)` | 地図の一覧（共有・下書き）／1 枚を 64 件そろえて、段・12 カテゴリーの進み具合、アーキテクチャ（実装済み・提案）、穴、好みとのずれと一緒に。地図はコンパクトに保存し、`topic` でその 1 件を、`expand` で全件を、比べた選択肢全部（点と根拠・理由・つながり）つきで返す（status と pick は変えない）/ maps are stored compact; `topic` / `expand` return the full scored field for any status |
| `update_project_map(slug, …)` | 地図を作る・更新する（下書きに書く）。好みの変更で採点し直し、`observed` は evidence、`gap` は gap_note、`decided` は `owner_confirmed: true` が必須。`#/p/<slug>` を返す / create or update a map, returns the review link |
| `rescore_project_map(slug, profile)` | 好みを変えたら何が変わるかの下見（書かない）/ preview a profile change |
| `propose_catalog_refresh(id, url?, checked, verified, changes, note?)` | 公式ページで読んだ料金・上限を、今のカタログとの差分つきで提案箱へ / propose a price/limit update with a diff (inbox only) |
| `ui_ux_checklist(phase?, lifecycle?)` | はい・いいえで答える UI/UX 確認表（phase: requirements / design / qa）。段階ゲート `gates` も返し、lifecycle（idea / launch / operate / scale / exit）で絞れる / yes-no checklist plus phase gates per lifecycle stage |
| `lifecycle_stages(stage?, include_items?)` | 5 段階（idea / launch / operate / scale / exit）と細かい段、known_surprises / revisit_triggers / stages with known surprises and revisit triggers |
| `propose_learning(text, category, kind?)` | 学びを提案箱に追加（固有名詞・個人名なし）。kind: rule（既定）/ component_map_update / append a proposal to the inbox |

環境変数 / env: `BLUEPRINT_PROJECTS`（地図の下書きの置き場）、`BLUEPRINT_PREFERENCES_EXTRA`（組織の好みのフォルダ）、`BLUEPRINT_REFRESH_INBOX`、`BLUEPRINT_APP_URL`（返すリンクを絶対 URL にする時の土台。公開ドメインを指定）。

テスト / Tests（`npm test`）: `smoke`（全ツール）、`decide`（全部の決めごとで選択肢と採点が出る・好みを変えると採点が変わる・オーナーの決定の関門・observed の根拠・リンク・カタログ更新の提案）、`coverage`（カタログの全ファイルが読める・全選択肢の id が引ける・tech の選択に比較がある）、`dryrun`（見本プロジェクトを最初から最後まで通す。`BP_DRYRUN_OUT=path` で記録を書き出す）。

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

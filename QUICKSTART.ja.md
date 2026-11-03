# Blueprint — はじめかた

English: [QUICKSTART.md](QUICKSTART.md)

Blueprint は「作り方の作り方」です。プロダクトを作る時に決めることを、構想 → 作る → 出す → 回す → 増やす → 終える の順に全部並べ、それぞれに選択肢（無料枠・上限・乗り換えの重さ・責任・出典と確認日）、AI のおすすめ1つと理由、先に決めることを付けています。人はウェブアプリで読み、AI は同じファイルを MCP サーバーで読みます。

3つの層：

| 層 | ファイル | 中身 |
|---|---|---|
| 要素 | `skill/blueprint/elements/elements.yaml` | 変わりにくい原則7つ（体験・プロダクト・ビジネス・マーケ・ブランド・保守・セキュリティ） |
| 選択肢 | `skill/blueprint/elements/tactics.yaml` | 決めること60件。段・列・日英のラベル・選択肢（カタログの id）・決まりからのおすすめ・先に決めること |
| プロジェクトの地図 | アプリの書き出し、または `draft_project_map` | あなたのプロジェクト：決めることごとの状態・選んだもの・理由・選ばなかったもの |

5つの段：構想（idea）→ 出す（launch）→ 回す（operate）→ 増やす（scale）→ 終える（exit）。6つの列：BRAND / UX / UI / TECH / BIZ・LEGAL / RULES。

## A. エンジニアでない人の5分（ウェブアプリ）

```bash
cd app && npm ci && npm run dev
```

表示された URL を開きます。

1. **01 始める**：名前と、ひとことで目的。4つの質問（誰のため・どこで使う・お金・国）に答えて「地図を見る →」。
2. **02 地図**：上の帯が5つの段。大きな数字＝決めた数、小さい数字＝その段の決めることの数、小さな四角＝決めること1件ずつ。下の地図は6つの列と点。線は「先に決めること」のつながりだけ。左下「まずここから」に今すぐ決められる3件。
3. **03 決める**：点を押す。「おすすめで決める」か、別の選択肢を押して「選んだものに決める」。確認するもの（チェックリスト）は全部に目を通してから決定。しくみ（TECH）の決めることには下にスタック比較（似たサービスと無料枠／1社か組み合わせか／お金を払った方が楽になる境目／おすすめと却下理由）。
4. 段の数字が埋まるまで繰り返す。決めた点と線はオレンジになります。
5. 右上の **EXPORT YAML** を AI に渡す。**MARKDOWN** は人が読む用。

答えはブラウザの中だけに保存されます。画面ごとの詳しい歩き方は `skill/blueprint/reference/walkthrough-non-engineer.md`。

## B. AI エージェントの5分（MCP）

一度だけ：

```bash
cd mcp && npm ci && npm run build && npm test
claude mcp add blueprint -- node /ABS/PATH/launchblueprint/mcp/dist/index.js   # Claude Code
```

Cursor と Claude Desktop は同じコマンドを `mcpServers` の JSON に書きます（`mcp/README.md`）。

サーバーは読むだけです。ツールを使う順：

| 順 | ツール | 返るもの |
|---|---|---|
| 1 | `list_topics(stage?)` | 決めること全部：段・列・選択肢・AI のおすすめ・先に決めること・比較の有無 |
| 2 | `draft_project_map({profile, name, goal})` | 4つの答えからおすすめを当てはめた地図、次に決めること、止まっているもの、段ごとの進み具合、YAML |
| 3 | `get_comparison(topic)` / `get_item(id)` | しくみの決めることのスタック比較、またはカタログの1件 |
| 4 | オーナーに聞いてから `draft_project_map({..., decided: {topic: 選んだ id か [確認した id] か "all"}})` | 1回分進んだ地図。3 に戻る |
| いつでも | `search` / `get_catalog(domain, format)` / `list_domains` / `get_reference` / `get_template` / `get_skill` | `skill/blueprint/` の残り全部 |
| 料金を言う前 | `stale_items(days)` | 未確認・確認日なし・古い項目 |
| 最後 | `propose_learning(text, category)` | 一般化した学びを提案箱（`mcp/inbox/learnings.jsonl`）へ。人が見てから本体に入れる |

使える指示の例：

```
blueprint の MCP を使って。答え：audience=business, platform=web, money=paid, country=jp。
draft_project_map を呼び、次に決めることごとに get_comparison か get_item を読んで、
おすすめ1つと理由と選ばなかったものを出して。決定にする前に必ず私に聞いて。
verified:false の料金は「未確認」と言って。
```

守ること：決めるのはオーナー。勝手に decided にしない。`verified: false` や確認日の無い料金・上限は未確認。書き戻すものに製品名・個人名を入れない。見本プロジェクトを全部の段に通した記録と見つかった穴は `skill/blueprint/reference/dry-run-sample.md`。`mcp/test/dryrun.test.mjs` が同じことを毎回やります。

MCP なしでも、`app/` で `npm run build` した `dist/llms.txt` と `dist/data.json` を読めます。Claude Code のスキルとして `skill/blueprint/SKILL.md` を読ませる方法もあります。

## C. 地図の読み方

- **上の帯**：5つの段。細い大きな数字＝決めた数、小さい数字＝全部の数。四角：枠＝未決、白＝おすすめ待ち（仮）、オレンジ＝決定。段を押すと、その段だけ明るくなる。
- **点**：枠＝未決、白＝仮、オレンジ＝決定。点の下の小さな字は今選ばれているもの。
- **線**：`tactics.yaml` の `depends_on` だけ。飾りの線は無い。両端が決まるとオレンジ。T キーで決めた道すじだけ表示。
- **列**：左から BRAND / UX / UI / TECH / BIZ・LEGAL / RULES。
- **TRACE**（右下）：決めたステップの数。
- **04 カタログ**：42 分野・607 項目と、どの決めることで使われているか。

## D. カタログに入っているもの

`skill/blueprint/catalog/*.yaml`、1分野1ファイル。技術サービス（frontend, backend, database, auth, hosting, storage_media, search, realtime, ai_llm, ci_cd, monitoring, email_notifications, analytics, security, payments, cms, editor_ui, ui_libraries, i18n）、集客と運用（gtm_channels, support, business_setup, cross_border, app_distribution）、決まりと教訓（rules, ui_ux, data_protection, freshness, build_vs_buy）、規模と出口（scale_readiness, dd_dashboard, exit_dd）、台帳（lifecycle, canvas）。書式は `skill/blueprint/catalog/schema.md`。ルール・教訓は必ず「原則・避けること・なぜ・はい/いいえの確認」を持ちます。しくみの決めることは必ず `elements/stack_comparisons.yaml` にスタック比較を持ちます（R-030）。

## E. どこに何があるか

```
README.md / README.ja.md      これは何か
QUICKSTART.md / .ja.md        このファイル
skill/blueprint/              スキル本体：SKILL.md, catalog/, elements/, reference/, templates/
app/                          ウェブアプリ（Vite）。npm run build → dist/ に data.json と llms.txt
mcp/                          MCP サーバー。npm run build && npm test
legacy/, skills/, drafts/, ui/   以前の版・下書き・画面の試作
```

© 2026 CREATIVITY IS EVERYWHERE, LLC · MIT

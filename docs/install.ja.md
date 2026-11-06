# Blueprint: インストールと最初のプロジェクト（5分）

English: [install.md](install.md)

Blueprint は「決めること」の地図です。AI が提案し、**あなた**がブラウザで承認します。データは自分のPCのフォルダだけ。アカウントも、こちらのサーバーも、こちらの API キーも要りません。

必要なもの：Node 20 以上、git、npm。

## 1. 取得して確認

```bash
git clone https://github.com/takaoumehara/launchblueprint.git
cd launchblueprint
node bin/blueprint.mjs bootstrap   # 依存を入れて mcp/dist を作る（何度でも可）
node bin/blueprint.mjs doctor      # 全行 ok ならOK
```

エディタが最初に MCP を起動するときにも `bootstrap` が自動で走るので、`mcp/dist/index.js` が無くても自動で直ります。

## 2. エディタにつなぐ（どれか1つ）

| エディタ | 手順 |
|---|---|
| **Claude Code** | リポジトリのフォルダで `claude` を起動。`.mcp.json` を読むので `blueprint` を許可。または `node bin/blueprint.mjs connect claude` の出力（`claude mcp add ...`）を貼る。 |
| **Cursor** | フォルダを開く。`.cursor/mcp.json` が入っています。設定 → MCP で `blueprint` を有効に。 |
| **VS Code（Copilot エージェント）** | フォルダを開く。`.vscode/mcp.json` が入っています。ファイル上の「開始」でサーバーを起動。 |
| **その他の MCP クライアント** | `node bin/blueprint.mjs connect cursor`（`mcpServers` 形式）／`connect vscode`（`servers` 形式）が絶対パス入りの JSON を出します。 |

## 3. 最初の本物のプロジェクト：保存して開き直す

```bash
node bin/blueprint.mjs serve        # http://127.0.0.1:4173/ が出ます
```

1. ブラウザで名前を入れて **作成**。地図が開きます。
2. AI に「blueprint を使って、公開する場所・ビジュアルの方向・アニメーションを、理由を短くつけて提案して」と頼む（`workspace_propose_change` が呼ばれます）。
3. 2秒ほどで、該当の項目が点線の「提案中」になります。項目を押すと、理由・他の案・影響先が出ます。
4. **承認** か **却下** を押す（Tab で移動して Enter）。承認できるのはこのブラウザだけ。AI には承認の道具がありません。
5. Ctrl+C で止めて、もう一度起動して同じURLを開く。決定・却下・古くなった提案の履歴が残っています。画面を閉じていても、提案は保存されて待っています。

データの場所：`~/.blueprint/projects/<id>/state.json`（`BLUEPRINT_HOME` で変更可）。

## 友だちが自分のPCで使う

同じ手順を友だちのPCで。フォルダも AI の契約もキーも友だち自身のもので、あなたのプロジェクトは見えません。**1つだけ**わざと渡すとき：

```bash
node bin/blueprint.mjs export <project-id> project.json     # あなた
node bin/blueprint.mjs import project.json                  # 友だち：新しいプロジェクトとして入る
```

書き出されるのは名前・目的・決定済みの選択だけ。未承認の提案や承認は渡りません（友だちの AI が提案し、友だちが承認）。チェックサムは破損の検知で、作成者の証明ではありません。信頼できるファイルだけ取り込んでください。この版にホスト型 Hub の道はありません（`docs/hub/` の設計は別PRで未検証。上の手順には不要）。

## 知っておくこと

- 承認の境界は、MCP と HTTP API しか持たない AI を止めるものです。サンドボックスではありません。シェルを持つ AI は `~/.blueprint` を直接書き換えられます。信用できないセッションには大事なプロジェクトを置かないでください。
- スマホでの承認は未対応（サーバーはこのPC内だけで待ち受け）。提案はディスクに残り、ブラウザを開いたときに見られます。
- チェックリスト型の決定はまだ提案できません（「1つ選ぶ」型のみ）。
- 実ブラウザ（Chromium）と stdio MCP で確認済み。実際の Cursor / VS Code 画面、Windows、macOS では未確認。

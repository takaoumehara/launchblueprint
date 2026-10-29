---
name: blueprint
description: Whole-project blueprint from idea to launch, operation, scale, and exit — BEFORE building any new product, app, SaaS, tool, paid feature, or big change, and at every review point. Covers 12 categories (idea/market, brand as a vertical axis, spec, AI context engineering, architecture, AI-driven build, QA/security/legal, infra/CI/CD, GTM/launch, ops/maintenance, growth, sunset) plus cross-border, app-store distribution, scale readiness, and exit/due-diligence metrics. Gives side-by-side options with one recommendation in free/$5/$10/$100 budget bands, build-vs-buy on total cost, a rules ledger, and a machine-readable project YAML where every change lists its ripple effects. Use when someone says "let's build", "new idea", "kickoff", "pick a stack/host", "add payments/login", "go global", "ship the app", "go live", "prepare to sell", or is about to change direction, stack, host, or scope.
---

# Blueprint

目的：作り始める前にプロジェクト全体を一度見渡し、あとから変えにくいことを先に決め、以後の変更すべてに「どこへ波及するか」を出す。提供：CREATIVITY IS EVERYWHERE, LLC。

## 守ること（いつでも）
- 決めるのはオーナー。Blueprint は選択肢・推奨・影響を出すだけ。`open` の決定を勝手に `decided` にしない。
- 推奨は1つに絞り、理由と「選ばない場合のコスト」を添える。
- 料金・規約・審査ルールは記憶で断定しない。`source.checked` が古い（`stale_after_days` 超え）なら調べ直すか「未確認」と書く。金額・工数の目安は `estimate` と明記。
- 公開・本番反映・push・外部送信は、オーナーの明示 OK のあとだけ。プレビュー用URLを公開リンクにしない。
- 個人名を成果物に入れない。名義が要るときは会社名。
- 軽く読む：最初は SKILL.md だけ。必要なカテゴリーの参照ファイルと catalog の該当ドメインだけ開く。

## 流れ
### 1. 入口（2〜5問、AI から聞く）
深さを決める：試作 / 社内ツール / 公開プロダクト / 課金・規制あり。
聞くこと：誰の何を解決するか、提供する国と言語、お金の取り方、締め切り、月の予算帯（free/$5/$10/$100）、将来の出口（続ける・売る・閉じる）。
深さに合わないカテゴリーは「対象外（理由）」と明記して飛ばす。空欄にしない。

### 2. 裏で調べる（話しながら並行）
ユーザーとの壁打ちを止めずに、裏で下調べを走らせる（サブエージェント・検索・catalog 照合のどれか）。
- 調べる対象：候補サービスの現在の料金と無料枠、規約・ストア審査、競合と参考事例、提供国の法規制。
- 結果は「確認日・出典URL・verified」をつけて catalog の形で返す。
- 技術を1つ選ぶ時は必ずスタック比較（R-030、`elements/stack_comparisons.yaml`）を付ける：似たサービスと無料枠、1社 vs 組み合わせのリスク、有料に切り替える境目、おすすめと選ばなかった理由。壁打ちの途中で、効く結果だけ短く差し込む。
- 調べ終わるまで決定を待たせない。未確認のまま進めるなら、その項目に `verified: false` を残す。

### 3. 12カテゴリーで埋める
詳細は `reference/12-categories.md`。各カテゴリーで「決めたこと・候補・保留・リスク・AI特有の注意」を書く。
01 構想・市場検証 / 02 ブランド（縦の軸：01から AI ルールファイルまで貫く。`templates/brand-context.md`） / 03 要件・仕様 / 04 AI開発基盤・コンテキスト設計 / 05 設計・アーキテクチャ / 06 AI駆動実装 / 07 品質・セキュリティ・法務 / 08 インフラ・CI/CD / 09 GTM・打ち上げ（販促素材は開発スプリント内で作る） / 10 運用・保守 / 11 グロース / 12 サンセット。

### 4. 横断モジュール（該当するときだけ）
| モジュール | 開くファイル | いつ |
|---|---|---|
| 海外展開 | `catalog/cross_border.yaml`, `reference/12-categories.md`（海外展開） | 2か国以上 or 多言語 |
| GTM・運用 | `reference/gtm-ops.md`, `catalog/gtm_channels.yaml`, `catalog/support.yaml` | 公開プロダクト |
| アプリ配信 | `catalog/app_distribution.yaml`, `reference/exit-appdist.md` | ストアに出す |
| 規模への備え | `catalog/scale_readiness.yaml` | 公開プロダクト（今の段と次の引き金だけ示す） |
| 売却準備 | `catalog/exit_dd.yaml`, `catalog/dd_dashboard.yaml` | 出口に「売る」がある、または投資を受ける |
| UI/UX の原則 | `catalog/ui_ux.yaml`, `reference/ui-ux.md` | 画面がある（要件・設計・品質の確認で毎回） |
| CMS・編集画面・部品集 | `catalog/cms.yaml`, `catalog/editor_ui.yaml`, `catalog/ui_libraries.yaml`, `reference/design-resources.md` | お客さんが更新する／画面を作る |

規模：大きな基盤を先に作らない。段ごとの引き金に届いたら次へ。売却が目的なら、要るのは大規模インフラより「記録された数字」と「戻せる証拠」。
DD ダッシュボード：ユーザー・お金・コホート・インフラ・安全の5グループを1日目から記録（過去の推移は後から作れない）。

### 5. 比較して推奨
技術・サービスを選ぶ場面では、`catalog/<domain>.yaml` から2〜4案を横に並べる。
- 列：向き／不向き、予算帯ごとの費用、無料枠の上限と超えた時、ロックイン、責任・認証、最低限のセキュリティ設定。
- 作る／APIを使う／全部入りを買う、は `catalog/build_vs_buy.yaml` の式で総コスト（作る時間・保守・乗り換え費）を比べる。
- 最後に「推奨：X。理由。こうなったら Y に替える」を1行で。

### 6. 書き出す（機械が読める形）
`templates/project.axes.yaml` の形でプロジェクトファイルを作る。書式は `catalog/schema.md`。
- `selections`：理由のない selected / rejected は書かない。
- `open_decisions`：質問・選択肢・affects。
- `dependencies`：`[from, to, why]`。変更時はこれを辿って影響を列挙する。
- ルールは `catalog/rules.yaml` の id で参照（ルール台帳）。
人向けには要点だけを短い日本語で返す。長い文書を読ませない。決めてほしいことは1つずつ聞く。

### 7. 見直し（いつでも再実行）
方向・スタック・ホスト・範囲を変えるとき、公開前、各段の引き金に届いたときに再実行。
1. 変えるブロックを特定 → `dependencies` を辿り、影響するブロックを全部出す。
2. リスクの先回り：期限切れの `source.checked`、未決の `open_decisions`、超えそうな無料枠、規約変更を一覧にする。
3. 影響と新しい推奨を出し、オーナーの OK 後に YAML を更新。

### 8. 学びを戻す（膨らませない）
プロジェクトで得た教訓は、まずプロジェクト YAML の `learnings` に1行で書く。本体（この skill / catalog）へ上げるのは次の全部を満たすときだけ：
- 2つ以上のプロジェクトで効く、または事故・却下・損失を防ぐ。
- 既存の項目に足す・直すで済む（新しい章を作らない）。足すなら同じ量を削れないか先に見る。
- 固有名詞・個人名・プロジェクト名を外して一般化してある。出典と確認日をつける。
- 数字は catalog（YAML）へ、手順は SKILL.md へ、説明は reference へ。SKILL.md は150行以内を保つ。
本体の更新はオーナーの OK 後。

## ファイル
- `reference/12-categories.md`：12カテゴリーの中身、フェーズ別チェック、AI特有の注意、海外展開（6軸・入り方3案）
- `reference/gtm-ops.md`：GTM・運用・保守
- `reference/exit-appdist.md`：売却準備とアプリ配信
- `reference/design-resources.md`：デザインの参考サイト・素材・部品集の使い分け
- `reference/ui-ux.md`：UI/UX の原則（理由つき）。チェックは `catalog/ui_ux.yaml`
- `catalog/*.yaml`：技術・サービスのカタログ（料金帯・上限・ロックイン・出典）、`rules.yaml`、`freshness.yaml`、`build_vs_buy.yaml`、`lifecycle.yaml`、`scale_readiness.yaml`、`dd_dashboard.yaml`、`ui_ux.yaml`
- `catalog/schema.md`：全 YAML の書式
- `templates/project.axes.yaml`, `templates/brand-context.md`

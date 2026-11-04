# 網羅表：段階 × 要素 × tactic（coverage）

提供：CREATIVITY IS EVERYWHERE, LLC ／ 生成：2026-11-02、更新：2026-11-03（60 tactics・5 段）（`elements/tactics.yaml`・`elements/stack_comparisons.yaml`・`catalog/lifecycle.yaml` から）

目的：**idea → launch → operate → scale → exit の 5 段すべてに、要素（elements）と決めること（tactics）があり、choose には 選択肢・おすすめ・理由・選ばなかった理由・無料枠・払う境目 が、checklist には 原則・避ける形・なぜ・確認 がそろっているか** を 1 枚で見る。
更新：tactic や比較を足したら、この表の該当行と `catalog/lifecycle.yaml` の `items[].status/evidence` を直す（手順：`reference/feedback-loop.md`）。

## 読み方
- **状態**：covered＝choose なら比較（R-030）の 4 点（無料枠つき services・1社 vs 組み合わせ・払う境目・pick/理由/rejected）が全部ある、checklist なら全 option に 原則（principle / item / rule / must・add）・避ける形（anti_pattern / avoid_when）・why・確認（check / acceptance）がある。thin＝どれかが欠ける。
- **無料枠／払う境目**：おすすめ（pick）の `free_tier` と、比較の最初の `switch_points`。
- **lifecycle 項目**：`catalog/lifecycle.yaml` の items を macro stage ごとに数えたもの（covered / thin / missing）。12cat の項目は category 番号で段に割り当て（01–04 idea、05–09 launch、10 operate、11 scale、12 exit）。

## 段階ごとの数

| 段階 | 含む stage | 要素 | tactics（choose / checklist） | covered | thin | lifecycle 項目 covered / thin / missing |
|---|---|---|---|---|---|---|
| **idea**（構想） | discover, strategy, brand, design | 4（brand, business, experience, product） | 10（4 / 6） | 10 | 0 | 20 / 11 / 6 |
| **launch**（公開） | build, legal, pricing, gtm | 7（brand, business, experience, maintenance, marketing, product, security） | 32（21 / 11） | 32 | 0 | 14 / 24 / 18 |
| **operate**（運営） | operate, maintain, finance | 3（business, maintenance, security） | 10（6 / 4） | 10 | 0 | 7 / 5 / 1 |
| **scale**（拡大） | growth | 2（maintenance, marketing） | 2（1 / 1） | 2 | 0 | 0 / 3 / 4 |
| **exit**（出口） | sunset, exit | 2（business, maintenance） | 5（2 / 3） | 5 | 0 | 12 / 0 / 0 |

## idea — 構想（discover, strategy, brand, design）

**毎回起きること（known_surprises）**：「競合なし」は代替手段（手作業・何もしない）の見落とし。価格比較の相手は製品ではなく今のやり方／知り合いの好反応が需要に見えるが、知らない人の登録率は一桁台になる／仕様は入出力・例外まで書かないと AI は正常系だけ作って「できた」と言う／提供言語を1つと決めたのに、最初の問い合わせが別の言語で来る（文言の直書きが全画面の作り直しになる）

**再実行の合図（revisit_triggers）**：課題インタビューで「お金を払う」と言った人が 5 人中 2 人未満／待機リストの訪問→登録率が合格値を下回った、またはそもそも測っていない／対象の国・言語・課金方式のどれかが変わった（Intake の答えが変わる）

| topic | 要素 | 列 | 型 | 選択肢 | おすすめ | 理由 | 選ばなかった | 無料枠（おすすめ） | 払う境目 | 状態 |
|---|---|---|---|---|---|---|---|---|---|---|
| `ui_patterns` 画面づくりの約束 | 体験 | ui | checklist | 4 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `brand_basics` ブランドの土台 | ブランド | brand | checklist | 4 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `ui_copy` 画面の言葉 | 体験 | ui | checklist | 4 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `build_vs_buy` 作るか借りるか | ビジネス | tech | choose | 3 | `bvb.platform` | 最初は全部入りのサービスで早く確かめ、強みになる所だけ後で作る。 | 2 件 | 多くの全部入りサービスに無料枠（上の各比較を参照） | サービス代が、自分で作って保守する時間の費用を超えた（例：月 $500 超と保守 月10時間以内） → その部分だけ自… | covered |
| `market_entry` どの国から始めるか | ビジネス | biz | choose | 3 | `es.us_first` | 作る量が一番少なく、反応を早く確かめられる。 | 2 件 | Stripe 2.9%+30¢ のみ（米国内）。i18n は後回し | 提供言語が 2 つ以上になりうる（Intake の答え） → es.jp_en の作り方（文言はキー経由、i18n は… | covered |
| `i18n` 多言語化のしくみ | プロダクト | tech | choose | 5 | `i18n.next-intl` | Next.js で一番自然に書け、複数形や日付も標準で扱える。初日から文言をキーにし、直書きは l… | 5 件 | MIT・無料 | 開発者以外の翻訳者・校正者が1人でも入る、または3言語以上 → Tolgee 無料（3人・3万語）→ Translat… | covered |
| `idea_validation` 需要の確かめ方 | プロダクト | ux | choose | 6 | `val.tally` | 無料で回答数に上限がなく、どの紹介ページにも埋め込める。ホストが決まったら本番側の LP に移す。 | 5 件 | フォーム・回答ともに無制限（フェアユース） | 独自ドメインで公開リンクを出す（SNS・広告に貼る） → Carrd Pro Standard $19/年 か Fra… | covered |
| `validation_rules` 作る前の約束 | プロダクト | rules | checklist | 6 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `problem_discovery` 困りごとの確かめ | プロダクト | ux | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `rules_ledger` 最初に守る約束 | ビジネス | rules | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `planning_pass` 計画の手順 | ビジネス | biz | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |

**lifecycle で まだ thin / missing の項目（17）**：

- `lc.discover.02` ペイン×ペルソナのひもづけ（根拠つき）（thin・P1）→ pains.md に persona_id と根拠必須（既定の残タスク）
- `lc.n01` 最もリスクの高い仮説（価値・成長）と検証KPI（thin・P1）→ 12cat §01
- `lc.brand.14` メッセージ階層（見出し・3本柱・証拠・反論）（missing・P1）→ gtm-ops §G3 メッセージ階層
- `lc.design.19` UI詳細の受け入れ基準の集約（thin・P2）→ ux/ui-detail.md
- `lc.n05` ブランドコンテキストファイル（brand.yaml → CLAUDE.md/.cursorrules の生成節）（missing・P1）→ templates/brand-context.md
- `lc.n06` AIデフォルト臭の排除（ライブラリ既定の配色・字体を使わない）（thin・P1）→ templates/brand-context.md の never 欄
- `lc.n07` AIペルソナ（チャット機能の性格・口調・禁止事項）（missing・P2）→ brand.yaml ai_persona
- `lc.n48` カルチャライズ（翻訳ではなく再創作・社会的証明の出し方）（thin・P2）→ cross_border.yaml axis.culturalization
- `lc.design.17` オンボーディングとアクティベーション（Aha までの時間）（thin・P1）→ gtm-ops §G9 アクティベーション定義と初回体験
- `lc.n08` MVPスコープ（Must／Nice-to-have）とPRD（thin・P1）→ 12cat §03 prd.md
- `lc.n09` 非機能要件（同時接続・レイテンシ・対応端末・可用性）（thin・P1）→ 12cat §03
- `lc.n10` エッジケースと例外状態をPRDに明記（AIは正常系を優先する）（thin・P1）→ 12cat §03
- `lc.n11` AIツールの選定と役割分担（エディタ型／ターミナル型／API）（thin・P2）→ 12cat §04
- `lc.n12` ルールファイル（CLAUDE.md/.cursorrules/AGENTS.md）の配備（missing・P1）→ 12cat §04
- `lc.n13` 不要ファイルの除外（.cursorignore 等）とモジュール分割（missing・P2）→ 12cat §04
- `lc.n14` ルールの過積載を防ぐ（短く・例つき・参照型）（missing・P1）→ 12cat §04
- `lc.strategy.09` 会社・名義・口座・会計（thin・P2）→ gtm-ops §O9 会社・会計・税

## launch — 公開（build, legal, pricing, gtm）

**毎回起きること（known_surprises）**：無料プランは「非商用」条件で、初めての売上の日に有料プランへ強制される／ストア審査・決済アカウント審査・DNS 伝播が数日〜数週間ずれて公開日が動く／価格を決めずに作ると、原価（AI・SMS・転送量）が利用者数に比例することに公開後に気づく／規約・プライバシー・特商法表記・PR 表記は公開直前に「ない」と分かる／確認用 URL（*.vercel.app 等）が検索に出る、公開リンクに混ざる／当日はサポートと監視が手薄で、最初の不具合報告に半日気づかない

**再実行の合図（revisit_triggers）**：初めての有料ユーザー（無料プランの条件・税の登録義務・請求書が一度に現れる）／対象外だった国から登録が来た／公開日の 14 日前で、ロールバック条件と担当がまだ 1 行も書かれていない

| topic | 要素 | 列 | 型 | 選択肢 | おすすめ | 理由 | 選ばなかった | 無料枠（おすすめ） | 払う境目 | 状態 |
|---|---|---|---|---|---|---|---|---|---|---|
| `database` データの置き場所 | プロダクト | tech | choose | 3 | `db.supabase` | 表の形で扱えて、ログインや画像保存も同じ場所でそろう。あとで別の場所へ移しやすい。 | 2 件 | 500MB の DB・5GB 転送・1GB ファイル。1週間使わないと一時停止。無料は2… | 本番で使い始めた日（1週間止まると困る） → Supabase Pro $25/月 | covered |
| `analytics` 使われ方の計測 | プロダクト | ux | choose | 2 | `an.posthog` | どの画面で離れたかまで見られる。無料枠が大きい。 | 1 件 | 月 100 万イベント・録画 5,000・フラグ 100 万・エラー 10 万。上限で止… | 月 100 万イベントの 80%（80 万）に近づいた → PostHog 従量（カード登録・製品ごとの上限額） | covered |
| `business_setup` 事業の立ち上げ | ビジネス | biz | checklist | 3 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `payments` お金の受け取り | ビジネス | biz | choose | 4 | `pay.stripe-checkout` | 月額なしで始められ、カード・Apple Pay・Google Pay がそろう。 | 2 件 | 月額なし。米国カード 2.9%＋30¢／件・チャージバック $15／件 | ユーザー同士でお金が動く（チケット販売の主催者など） → Stripe Connect | covered |
| `launch_channels` 発表する場所 | マーケティング | brand | choose | 4 | `gtm.x` | 作りながら途中経過を出せ、費用ゼロで反応がすぐ分かる。 | 3 件 | 無料（会社アカウント・2FA） | X で 2 週間発信して反応（返信・登録）がほぼゼロ → 利用者が本当にいる場（コミュニティ・業界の掲示板）へ切替 | covered |
| `cross_border` 海外向けの準備 | ブランド | biz | checklist | 3 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `hosting` 公開する場所 | 保守 | tech | choose | 3 | `host.vercel` | 変更ごとに確認用のURLが自動で出て、無料で始められる。 | 2 件 | Hobby 無料：転送 100GB/月・関数 100万回/月。個人・非商用のみ | お金を受け取る・会社として使う（商用） → Vercel Pro $20/月 | covered |
| `email` お知らせメール | 保守 | ux | choose | 2 | `mail.resend` | 送るのが簡単で、迷惑メールに入りにくい設定を案内してくれる。 | 3 件 | 月 3,000通・1日 100通まで・独自ドメイン 3つ | 1日 100通を超える日が出た（イベント前の一斉連絡など） → Resend Pro $20/月 | covered |
| `auth` ログイン | セキュリティ | tech | choose | 9 | `auth.supabase` | データの置き場所と同じ所でそろい、無料枠が大きい。 | 8 件 | 月 5万人（MAU）まで。メール・SNSログイン・匿名・基本の二段階認証 | 管理者にパスキーや二段階認証を必須にしたい（攻撃への守り） → Supabase は無料で基本の二段階認証あり／Cle… | covered |
| `protection` 攻撃からの守り | セキュリティ | tech | choose | 3 | `sec.turnstile` | 無料で、公開フォームへのロボット投稿を止められる。 | 2 件 | 無料：確認回数無制限・20個まで・1つにつき 10ドメイン | ログインや問い合わせに回数制限を細かくかけたい → Vercel Pro（回数制限 100万回 $0.50〜） | covered |
| `data_protection` バックアップ | セキュリティ | rules | checklist | 4 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `app_distribution` 届け方 | 体験 | ux | choose | 5 | `dist.pwa` | ストア審査なしで、ウェブのままホーム画面に置ける。 | 4 件 | 無料（審査なし） | 利用者がストアで探している（検索語にアプリ名・「アプリ」が付く）、または Android の通知が要る → TWA（P… | covered |
| `frontend` 画面の作り方 | プロダクト | tech | choose | 3 | `fe.nextjs` | ページもログインも1つでそろい、AIが一番うまく書ける。 | 2 件 | 無料（オープンソース）。公開先の無料枠に従う | スマホアプリが必須になった（通知・カメラ・ストア掲載） → Expo（無料から） | covered |
| `storage` 画像・動画の置き場所 | プロダクト | tech | choose | 3 | `st.supabase-storage` | データの置き場所と同じ所で、権限も同じ仕組みで守れる。 | 3 件 | 1GB・転送 5GB・1ファイル 50MB まで | 画像が合計 800MB を超えた（無料 1GB の8割） → Supabase Pro（100GB 込み）か、画像だけ… | covered |
| `search` 検索 | プロダクト | tech | choose | 2 | `se.postgres-fts` | 追加のサービスなしで、今のデータのまま探せる。 | 1 件 | 追加料金なし（データの置き場所の中で動く） | 1文字打つごとに結果を出したい・何十万件 → Algolia Grow（使った分だけ） | covered |
| `realtime` すぐに反映 | プロダクト | tech | choose | 2 | `rt.supabase-realtime` | データの置き場所と同じ所で、追加の契約がいらない。 | 2 件 | 同時接続 200・メッセージ 月200万 | 同時に開いている人が 160人（無料 200の8割）を超える日がある → Supabase Pro $25/月 | covered |
| `ai` AIの組み込み | プロダクト | tech | choose | 2 | `ai.gateway` | AIの会社を後から切り替えられ、使いすぎの上限も1か所で決められる。 | 2 件 | 毎月の無料クレジットあり（使えるモデルは一部・回数制限あり） | 無料クレジットのモデルでは品質が足りない → AI Gateway のクレジットを購入（上乗せなし） | covered |
| `ci` 自動チェック | 保守 | tech | choose | 2 | `ci.vercel-git` | つなぐだけで、変更ごとに確認用のページが出る。 | 2 件 | Hobby に含まれる（変更ごとの確認用ページ・自動公開） | テストを書き始めた・2人以上で開発する → GitHub Actions を追加（無料枠内） | covered |
| `ai_defense` AIを使った攻撃への守り | セキュリティ | rules | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `preview_rules` 確認用ページの約束 | 保守 | rules | checklist | 2 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `store_rules` アプリストアの決まり | ビジネス | rules | checklist | 3 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `cms` お客さんが更新する仕組み | プロダクト | tech | choose | 6 | `cms.microcms` | 日本語の管理画面で、入力欄を絞れるので崩れない。無料3人から。 | 5 件 | Hobby 0円：API 5個・3人・転送 20GB/月（超えると翌月までAPI停止）・… | 更新する人が4人以上（microCMS 無料は3人） → microCMS Team | covered |
| `editor_ui` スマホで編集する画面の部品 | 体験 | ui | choose | 5 | `edit.vaul` | タップ→下から入力パネルがスマホ編集の核。並べ替えと文字は足す。 | 4 件 | MIT・無料 | 2人以上で同じページを同時に編集したい → Tiptap Start $49/月（年払い） | covered |
| `ui_library` 画面の部品集 | 体験 | ui | choose | 15 | `ui.shadcn` | AI が一番書き慣れ、コードが自分の物になる。演出系は LP だけ。 | 7 件 | MIT・無料 | LP を1週間以内に何本も出す → Magic UI Pro $49（買い切り） | covered |
| `pricing_model` 値段のつけ方 | ビジネス | biz | choose | 5 | `pm.free-trial` | 原価が利用者数に比例しても赤字にならず、試用→有料の転換率で需要を測れる。 | 4 件 | 決済側の追加料金なし（手数料のみ） | 1 ユーザーあたりの原価（AI・SMS・転送）が売価の 30% を超える → 従量（pm.usage）を定額に足す、ま… | covered |
| `pricing_rules` 値段の約束 | ビジネス | rules | checklist | 6 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `legal_terms` 規約とプライバシー | ビジネス | biz | choose | 5 | `lt.termly` | 無料でプライバシーポリシーと Cookie バナーを今日出せ、必要になったら月 $10 で規約も足… | 4 件 | 基本ポリシー 1 本・バナー 1 万回/月 | 規約とプライバシーの 2 本以上、または Cookie バナーの表示が月 1 万回を超える → Termly Star… | covered |
| `legal_rules` 法律まわりの約束 | ビジネス | rules | checklist | 6 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `launch_rules` 公開日の約束 | マーケティング | rules | checklist | 6 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `backend` 裏側の処理の置き場所 | プロダクト | tech | choose | 2 | `be.route-handlers` | 画面と同じ場所に置けて、追加の契約も公開作業もいらない。長い処理が要る所だけ後で分ける。 | 1 件 | ホストの無料枠内。Vercel Hobby $0（個人・非商用のみ）：Active CPU 4 時間・メモリ 360 G… | 1回の処理がホストの関数の制限時間を超える（動画変換・大量メール・長いAI呼び出し） → 長い処理だけコンテナ（Clou… | covered |
| `legal_basics` 規約・返金・税の決まり | ビジネス | rules | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `foresight_traps` 現場の罠 | 保守 | rules | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |

**lifecycle で まだ thin / missing の項目（42）**：

- `lc.n15` DBスキーマ・マイグレーション・API設計の規約（thin・P2）→ 12cat §05
- `lc.n16` AIがよく知る型付きの普及スタックを選ぶ（missing・P2）→ catalog の各エントリに ai_familiarity を追加
- `lc.n17` 疎結合・小さな責務（AIが修正箇所を見失わない）（missing・P3）→ 12cat §05
- `lc.n45` i18n キー管理・Intl・UTC保存・可変幅UI（thin・P1）→ cross_border.yaml axis.i18n
- `lc.n50` レイテンシ（エッジ配信・DBリージョン）（thin・P3）→ cross_border.yaml axis.latency
- `lc.n18` テスト先行（AIにまずテストを書かせる）（missing・P2）→ 12cat §06
- `lc.n19` モック → ロジック → API/DB の段階実装（thin・P3）→ 12cat §06
- `lc.n20` 定期リファクタリング（スプリント単位）（missing・P2）→ 12cat §06
- `lc.n21` 「動くが破綻したコード」の監視（any・グローバル状態・メモリリーク・再描画）（missing・P1）→ 12cat §06
- `lc.build.26` 脅威モデル・脆弱性診断・依存の脆弱性（thin・P2）→ gtm-ops §O7 依存更新と脆弱性
- `lc.build.27` テスト戦略（単体/E2E/Visual gate）（thin・P2）→ gtm-ops §O8 QAの最小セット
- `lc.legal.32` 税（売上税・VAT・消費税・インボイス）とMoR（thin・P2）→ gtm-ops §O9
- `lc.legal.33` 知財（商標出願・OSSライセンス）（thin・P3）→ OSSライセンス棚卸しを追加
- `lc.n22` 単体・結合・E2E とカバレッジ（thin・P2）→ gtm-ops §O8
- `lc.n23` SQLi/XSS/CSRF・依存の脆弱性チェック（thin・P1）→ gtm-ops §O7
- `lc.n26` 実在しないパッケージ（パッケージ幻覚）とサプライチェーン攻撃（missing・P1）→ 12cat §07
- `lc.n46` 国別のデータ主権・同意（GDPR リージョン・CCPA オプトアウト・年齢ゲート）（thin・P1）→ cross_border.yaml axis.legal
- `lc.n27` CI：Lint→型→テスト→ビルド→プレビュー（thin・P2）→ 12cat §08
- `lc.n28` ステージングで永続化・認証・Webhook を確認（thin・P1）→ 12cat §08
- `lc.n30` IaC・CI設定の版を公式ドキュメントで照合（AIは古いAPIを書く）（missing・P2）→ 12cat §08
- `lc.build.29` 計測設計（イベント辞書・同意）（thin・P1）→ gtm-ops §G8 イベント辞書
- `lc.gtm.37` ポジショニング（Dunford 5要素）（missing・P1）→ gtm-ops §G3
- `lc.gtm.38` ICP と非対象（トリガーイベント）（thin・P1）→ gtm-ops §G3 ICP（トリガー必須）
- `lc.gtm.39` チャネル選定（Bullseye：19チャネルから3つ試す）（missing・P1）→ gtm-ops §G4／catalog/gtm_channels.yaml
- `lc.gtm.41` Product Hunt / Hacker News / X での公開（missing・P2）→ catalog/gtm_channels.yaml ch.producthunt 等
- `lc.gtm.42` App Store / Google Play 掲載・ASO・審査（thin・P2）→ gtm-ops §G7 ASO・審査
- `lc.gtm.46` PR・プレスキット・メディア（missing・P3）→ gtm-ops §G5 プレスキット
- `lc.gtm.51` 営業（B2B：デモ・CRM・提案書）（missing・P2）→ gtm-ops §G4 販売モーション（PLG/SLG/MLG）
- `lc.n31` LP公開と Core Web Vitals（thin・P1）→ gtm-ops §G7
- `lc.n32` プロモーション素材（デモ動画・OGP・プレスキット・告知文）（thin・P1）→ gtm-ops §G5
- `lc.n33` 販促素材をスプリント内で生成（コードと仕様から同期）（missing・P1）→ 12cat §09 『スプリント内の販促素材』
- `lc.n47` 国別の決済手段と税（MoR か Stripe Tax か）（thin・P1）→ cross_border.yaml axis.payments_tax
- `lc.n49` 国別ローンチチャネル（US：PH/HN/Reddit/X、JP：X/Zenn/Qiita/note/PR TIMES）（missing・P2）→ cross_border.yaml axis.channels
- `lc.gtm.44` コンテンツ計画（ブログ・動画・事例）（thin・P2）→ gtm-ops §G4 コンテンツカレンダー
- `lc.gtm.45` SNS運用（投稿承認・頻度・アカウント）（thin・P2）→ gtm-ops §G4
- `lc.gtm.47` 有料広告（予算・停止条件・計測）（missing・P2）→ gtm-ops §G4 広告テスト／catalog/gtm_channels.yaml
- `lc.gtm.48` 提携・連携・マーケットプレイス掲載（missing・P3）→ gtm-ops §G4
- `lc.gtm.49` 紹介・拡散ループ（招待・共有・UGC）（missing・P1）→ gtm-ops §G10 成長ループ
- `lc.gtm.50` コミュニティ（Discord・ユーザー会）（missing・P3）→ gtm-ops §G10
- `lc.dist.order` アプリ配布の順番（PWA/TWA/Capacitor/Expo/ネイティブ）（thin・P1）→ blueprint-v3-exit-appdist.md
- `lc.dist.iap` アプリ内課金の方針とストア規則（Apple 3.1.1/3.1.3(b)/4.2・Play支払い）（thin・P1）→ blueprint-v3-exit-appdist.md
- `lc.gtm.country` 国別GTM（波・言語・決済・プライバシー法・チャネル）（thin・P1）→ blueprint-v3-exit-appdist.md

## operate — 運営（operate, maintain, finance）

**毎回起きること（known_surprises）**：バックアップは「成功」と表示されるのに復元できない。復元を試すまで分からない／無料枠の上限（関数回数・転送量・メール通数）に月の途中で当たり、黙って止まる／AI 機能の再試行・ボットの連打でトークン費用が一晩で跳ねる／依存のメジャー更新・ランタイムのサポート終了で、ある日デプロイが拒否される／外部サービスの規約・価格が変わる（メール通知を読んでいない）／担当が1人なので休めず、鍵・アカウントの在り処が頭の中にしかない

**再実行の合図（revisit_triggers）**：月の請求が前月の 2 倍、または無料枠の 80% に達した／復元テストが 30 日以上行われていない／90 日以内にサポートが切れる依存・ランタイムがある／運用に関わる人が 2 人目になった（引き継ぎ・権限の整理が要る）

| topic | 要素 | 列 | 型 | 選択肢 | おすすめ | 理由 | 選ばなかった | 無料枠（おすすめ） | 払う境目 | 状態 |
|---|---|---|---|---|---|---|---|---|---|---|
| `monitoring` 不具合の見張り | 保守 | tech | choose | 3 | `mon.sentry` | ウェブでもアプリでも、どこで落ちたかを知らせてくれる。 | 2 件 | 1人・エラー 月5万件・トレース・メール通知 | 2人以上で不具合を見る → Sentry Team $26/月 | covered |
| `support` 問い合わせ窓口 | 保守 | ux | choose | 4 | `sup.email` | 最初はメール1本で十分。件数が増えたらチャットへ。 | 3 件 | Gmail 等で無料／Help Scout Free：5 人・受信箱 1・連絡先 100… | 問い合わせが週 20 件を超え、担当が 2 人になる → Help Scout Free（5 人）→ Standard… | covered |
| `backup_dr` 戻せる備え | 保守 | tech | choose | 5 | `bk.dump-to-r2` | どの DB でも同じ手順で費用ほぼゼロ、別の会社に置ける。付属の復元は「あれば使う」。 | 4 件 | R2 10GB・転送無料（自前の cron） | 今すぐ（Free プランで本番データがある） → bk.dump-to-r2（夜間ダンプ・失敗通知・月次復元テスト） | covered |
| `backup_rules` 戻せる約束 | 保守 | rules | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `cost_control` お金の上限 | 保守 | tech | choose | 5 | `cc.vercel-spend` | 最初の有料は Vercel Pro になりやすく、そこで全体の上限・通知・本番停止を 1 か所で決… | 4 件 | —（Hobby では使えない） | 初めての有料プラン（Vercel Pro・Supabase Pro） → その場で Spend Management … | covered |
| `cost_rules` お金の約束 | 保守 | rules | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `uptime` 落ちていないかの見張り | 保守 | tech | choose | 3 | `mon.uptimerobot` | 無料で 50 サイト・5 分おき・ステータスページ 1 つ。1 人運用の最初はこれで足りる。 | 2 件 | 50 モニター・5 分間隔・ステータスページ 1 | 運用する人が 2 人以上（誰が起きるかを決める） → Better Stack（オンコール・インシデント管理が一体） | covered |
| `secrets_sharing` 鍵とパスワードの置き場 | セキュリティ | tech | choose | 4 | `ho.bitwarden` | 個人は無料、共有も月 $3.99 から。会社名義の金庫を初日から作れる。アプリの鍵はホストの環境変… | 3 件 | 個人は無料。共有は Families $3.99/月（6 人） | 2 人目が運用に入る → Bitwarden Families $3.99/月 か Teams $4/人 | covered |
| `handoff_rules` 引き継ぎの約束 | 保守 | rules | checklist | 7 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `dd_metrics` 1日目から残す数字 | ビジネス | biz | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |

**lifecycle で まだ thin / missing の項目（6）**：

- `lc.operate.57` モデレーション・通報対応（thin・P2）→ gtm-ops §O3
- `lc.operate.59` オンコール（誰が何時に起きるか）・SLO（thin・P2）→ gtm-ops §O1 SLO
- `lc.maintain.62` 依存更新・メジャーアップグレード・非推奨API（thin・P1）→ gtm-ops §O7 保守カレンダー
- `lc.maintain.63` 外部サービスの規約・価格変更の監視（thin・P2）→ gtm-ops §O7 ベンダー変更監視
- `lc.maintain.64` 技術的負債・ドキュメント更新（missing・P3）→ gtm-ops §O7
- `lc.n34` エラー追跡・アップタイム監視・通知（thin・P1）→ gtm-ops §O1

## scale — 拡大（growth）

**毎回起きること（known_surprises）**：1 つの DB に全部入れた設計が、接続数・容量の上限で先に止まる（CPU より先に）／従量課金は売上より速く増える部分がある（録画・ログ・転送量）／人気が出た瞬間に不正（自己紹介・偽アカウント・カードテスト）が来る／企業顧客が SOC 2・DPA・SSO を求め、営業が止まる

**再実行の合図（revisit_triggers）**：scale_readiness の各段の引き金（MAU・DB 容量 50%・429 の件数）に届いた／企業顧客または投資家から監査・認証の要求が来た／1 日あたりの費用が売上を超えた日がある

| topic | 要素 | 列 | 型 | 選択肢 | おすすめ | 理由 | 選ばなかった | 無料枠（おすすめ） | 払う境目 | 状態 |
|---|---|---|---|---|---|---|---|---|---|---|
| `growth_channels` 続けて増やす方法 | マーケティング | brand | choose | 5 | `gtm.community` | 最初の熱心な人たちが集まる場所を作ると、紹介と声が自然に増える。 | 4 件 | Discord 無料（ページ未取得） | 紹介が月 20 件を超え、特典の付与と不正判定を手でやっている → Rewardful Starter $49/月 | covered |
| `scale_plan` 増えた時の備え | 保守 | rules | checklist | 4 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |

**lifecycle で まだ thin / missing の項目（7）**：

- `lc.growth.52` ライフサイクルメール・通知（ナーチャリング）（thin・P2）→ gtm-ops §G9
- `lc.growth.53` 継続率・コホート・解約理由（missing・P1）→ gtm-ops §G9 リテンション
- `lc.growth.54` 実験（A/B・フラグ・判定ルール）（thin・P2）→ gtm-ops §G8 実験の書式
- `lc.growth.55` フィードバック収集とロードマップ公開（missing・P3）→ gtm-ops §O3
- `lc.n37` フィードバックウィジェット・ユーザーインタビュー（missing・P2）→ gtm-ops §O3
- `lc.n38` 学びを CLAUDE.md・プロンプトに戻す（AIワークフローの振り返り）（thin・P2）→ 12cat §11
- `lc.n39` AI負債の監査スプリント（デッドコード・共通化）（missing・P2）→ 12cat §11

## exit — 出口（sunset, exit）

**毎回起きること（known_surprises）**：コード・ドメイン・ストア・決済の名義に個人名が残っていて、譲渡に数週間かかる／数字（MRR・解約・継続率）の過去 12 か月が後から再生成できない／業務委託・AI 利用規約の IP 譲渡が書面になく、買い手の調査で止まる／終了後も外部 SaaS・API キー・実験用の基盤が課金され続ける／ユーザーのデータ書き出しと削除の手順がなく、告知が遅れる

**再実行の合図（revisit_triggers）**：買い手候補・投資家との最初の会話（データルームの要求が来る前に揃える）／「続ける／ピボット／撤退」の見直し期日（例：公開から 90 日）／売上が 3 か月連続で下がった、または主要な依存サービスが終了を発表した

| topic | 要素 | 列 | 型 | 選択肢 | おすすめ | 理由 | 選ばなかった | 無料枠（おすすめ） | 払う境目 | 状態 |
|---|---|---|---|---|---|---|---|---|---|---|
| `exit_dd` 売却・終了の備え | ビジネス | biz | checklist | 9 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `exit_route` 売り方 | ビジネス | biz | choose | 3 | `xt.direct-outreach` | 小さなプロダクトの買い手は機能かチーム目当てで、すでに関係のある相手が多い。手数料ゼロ。 | 2 件 | 手数料ゼロ（弁護士費用のみ） | 直接打診 5 件に 2 か月反応がない → Acquire.com（掲載 $25/月〜） | covered |
| `sbom_tool` 部品表の出し方 | 保守 | tech | choose | 2 | `xt.syft` | 無料で CI に 1 行。売却の調査で求められる部品表を初日から出せる。 | 1 件 | Apache-2.0・無料（CLI） | 買い手・企業顧客に「継続的に見ている」証拠を求められた → FOSSA Free（5 プロジェクト） | covered |
| `sunset_rules` 終わり方の約束 | 保守 | rules | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |
| `sunset_plan` きれいに終わる・引き渡す | 保守 | biz | checklist | 5 | — | 全項目に 原則・避ける形・なぜ・確認 | — | — | — | covered |

## 今回埋めた隙間（2026-11-02）

| 隙間 | 足したもの | 段階 |
|---|---|---|
| 構想の検証（需要テスト・インタビュー・PMF） | `catalog/validation.yaml`（6 entries・6 lessons）、tactics `idea_validation`・`validation_rules`、比較 `idea_validation` | idea |
| 国の選び方の比較 | 比較 `market_entry`（cross_border.yaml の entry_strategies を R-030 の形に） | idea |
| 価格・パッケージ・単位経済 | `catalog/pricing.yaml`（5 型・8 lessons）、tactics `pricing_model`・`pricing_rules`、比較 `pricing_model` | launch |
| 規約・プライバシー・表記 | `catalog/legal_terms.yaml`（5 entries・6 lessons）、tactics `legal_terms`・`legal_rules`、比較 `legal_terms` | launch |
| 公開日の体制・ロールバック・PR 表記・SEO | `catalog/gtm_channels.yaml` に lessons 6 件、tactics `launch_rules`、比較 `launch_channels`・`analytics`・`app_distribution` | launch |
| バックアップと復旧（DR） | `catalog/backup_dr.yaml`（5 entries・3 lessons）、tactics `backup_dr`・`backup_rules`、比較 `backup_dr` | operate |
| 費用の上限・止め方 | `catalog/cost_control.yaml`（5 entries・5 lessons）、tactics `cost_control`・`cost_rules`、比較 `cost_control` | operate |
| 外形監視・ステータスページ・サポート窓口の比較 | `catalog/monitoring.yaml` に `mon.uptimerobot`・`mon.betterstack`、tactics `uptime`、比較 `uptime`・`support` | operate |
| 引き継ぎ・権限・採用の引き金 | `catalog/ops_handoff.yaml`（4 entries・7 lessons）、tactics `secrets_sharing`・`handoff_rules`、比較 `secrets_sharing` | operate |
| 規模の段（t2・t3 まで）と成長チャネルの比較 | tactics `scale_plan` の options を `scale.t0`〜`scale.t3` に拡張、tiers に anti_pattern/why/check、比較 `growth_channels` | scale |
| 売却の調査（DD）の全項目・売り方・部品表・終了手順 | tactics `exit_dd` を 9 項目に拡張（各項目に anti_pattern/why/check）、`catalog/exit_tools.yaml`（6 entries・5 lessons）、tactics `exit_route`・`sbom_tool`・`sunset_rules`、比較 `exit_route`・`sbom_tool` | exit |
| 段階ごとの「毎回起きること」「再実行の合図」 | `catalog/lifecycle.yaml` の `macro_stages[]`・`stages[]`（known_surprises / revisit_triggers）、MCP `lifecycle_stages` | 全段 |
| 驚きを rule・tactic に戻す手順 | `po-input/TEMPLATE-surprise.md`、`reference/feedback-loop.md` | 全段 |

## まだ薄いところ（次の候補）

- **scale**：tactic は `scale_plan`（checklist）と `growth_channels` だけ。SLO・オンコール当番表（`lc.operate.59`）、企業顧客向けの SOC 2・DPA・SSO（`scale.t4`）は数値の引き金だけで、選択肢の比較がない。
- **operate**：依存更新・ランタイムのサポート終了（`lc.maintain.62`）とベンダーの規約・価格変更の監視（`lc.maintain.63`）は lifecycle の known_surprises にあるだけで、tactic（Dependabot/Renovate 等の比較）がない。
- **launch**：脆弱性診断・SAST（`lc.n23`・`lc.build.26`）、実在しないパッケージ（`lc.n26`）、IaC の版の照合（`lc.n30`）は lesson も tactic もない。
- **idea**：ブランドのメッセージ階層（`lc.brand.14`）、AI ルールファイルの配備（`lc.n12`・`lc.n14`）は reference の記述のみ。
- **価格が未確認のまま**（2026-11-03 再確認後）：Crowdin のプラン別の語数上限と課金周期（料金表がスクリプト描画）、Cloud Run の単価（無料枠は確認済み）、Typeform 無料枠の回答数、X 広告の最低額（403）、Discord の無料枠（公式に明記なし）、PostHog（料金ページが読めず）、Upwork の手数料（403）、DocSend（403）、弁護士費用や売却の手順など公式価格がないもの。使う前に公式ページで確認（`stale_items` で一覧できる）。

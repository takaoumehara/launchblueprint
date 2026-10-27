# Blueprint 網羅チェック：アイデアから運営・撤退まで（2026-10-26）
提供：CREATIVITY IS EVERYWHERE, LLC ／ 機械可読版：`catalog/lifecycle.yaml`（stage, domain, item, status, evidence, proposed_addition, priority）／追加案の本文：`blueprint-v3-gtm-ops.md`

## 結論
全66項目のうち、**ある 18／薄い 29／ない 19**。
作る側（UX・UI・デザインシステム・テック・セキュリティ・法務）はほぼ揃っています。一方で、**作ったものを知ってもらい、使い続けてもらい、回し続ける側**（GTM・成長・運営・保守）が弱いです。GTM は 15項目のうち「ある」が 0 です。

判定基準
- **ある**：判断すること・合格条件が書いてある
- **薄い**：言及はあるが、判断・合格条件・予算帯のどれかがない
- **ない**：該当する記述がない

## 段階ごとの数
| 段階 | ある | 薄い | ない |
|---|---|---|---|
| discover | 1 | 2 | 2 |
| strategy | 1 | 4 | 0 |
| brand | 3 | 0 | 1 |
| design | 6 | 2 | 0 |
| build | 4 | 3 | 0 |
| legal | 1 | 3 | 0 |
| pricing | 0 | 3 | 0 |
| gtm | 0 | 4 | 11 |
| growth | 0 | 2 | 2 |
| operate | 2 | 3 | 1 |
| maintain | 0 | 1 | 2 |
| finance | 0 | 1 | 0 |
| sunset | 0 | 1 | 0 |
## 足りないもの トップ10（公開前に必須＝P1）
1. **ポジショニング**（代替手段・独自性・価値・誰に・カテゴリーの5要素）。v2 block2 は見出しだけ → gtm-ops §G3
2. **チャネル選定**（Bullseye 方式で候補から3つ試して1つに絞る）。「最初の10人」の1行だけ → §G4 と `catalog/gtm_channels.yaml`
3. **ローンチ計画**（T-14〜T+30、ロールバック条件、T+7/T+30 の振り返り）→ §G5
4. **需要とPMFの検証**（待機リスト、Sean Ellis 40% テスト）→ §G2
5. **計測設計**（北極星指標、入力指標、イベント辞書、同意）→ §G8
6. **アクティベーションと継続率**（Aha までの時間、コホート、解約理由）→ §G9
7. **紹介・拡散ループ**（招待、共有、UGC）→ §G10
8. **価格とパッケージ、単位経済**（CAC・LTV・粗利）→ §G6
9. **サポートと障害対応**（窓口、応答目標、ランブック、ステータスページ）→ §O1/§O3 と `catalog/support.yaml`
10. **保守カレンダー**（依存更新、メジャーアップグレード、非推奨APIの追跡）→ §O7

次点：SEO と構造化データ（P1）、広告の表示規制（ステマ規制・FTC、P1）、メッセージ階層（P1）、ペインとペルソナのひもづけ（既知の残タスク）。

## 参考にした枠組み（2026-10-26 時点）
- ポジショニング 5要素：April Dunford『Obviously Awesome』。要約：https://www.productmarketingalliance.com/mastering-positioning-for-growth/
- ローンチ前後のチェックリスト（T-14〜T+30、ロールバック）：https://github.com/productfculty-aipm/pm-copilot-by-product-faculty/blob/main/commands/plan-launch.md
- 販売モーション（PLG／SLG／MLG）と ICP のトリガー、90日の流れ：https://markcmo.com/blog-go-to-market-strategy-guide
- PLG ローンチの準備（5分以内に価値、テスターでのアクティベーション目標）：https://discover.gtmplaybook.co/plg-launch-strategy
- 8週間のローンチ計画（Dunford、Cagan、Reforge をまとめたもの）：https://genechecklist.com/checklist/product-launch-checklist
- 以下は今回ページを開いて確かめていない、定番の枠組み：Bullseye（Weinberg & Mares『Traction』、19チャネル）、AARRR（Dave McClure）、成長ループ（Reforge）、PMF 40% テスト（Sean Ellis）、SLO とエラーバジェット（Google SRE Book：https://sre.google/sre-book/service-level-objectives/）

## 全項目
| 段階 | 分野 | 項目 | 状態 | 根拠 | 追加案 | 優先 |
|---|---|---|---|---|---|---|
| discover | validation | 課題インタビュー（5〜10人）と事実/仮説の区別 | ✓ ある | v3-draft/blueprint-v3.md §2.1 調査レンズ／ux/research.md | — | P3 |
| discover | validation | ペイン×ペルソナのひもづけ（根拠つき） | △ 薄い | gaps-2026-10-26.md『ペイン』残 | pains.md に persona_id と根拠必須（既定の残タスク） | P1 |
| discover | validation | 市場規模・競合マップ・代替手段 | △ 薄い | v3-draft/blueprint-v3.md §2.1 調査（既存の代替手段）のみ。競合表なし | gtm-ops §G1 競合・代替手段表 | P2 |
| discover | validation | 需要の検証（待機リスト／スモークテスト／事前予約） | × ない | 該当なし | gtm-ops §G2 需要テスト（LP＋待機リスト、合格＝訪問→登録率） | P1 |
| discover | validation | PMFの測り方（Sean Ellis 40%テスト等） | × ない | 該当なし | gtm-ops §G2 PMF判定 | P2 |
| strategy | strategy | 意図の一文・Not-to-build | ✓ ある | v3-draft/blueprint-v3.md §1 D1/D3 | — | P3 |
| strategy | strategy | 北極星指標と成功の定義 | △ 薄い | export/blueprint-v2-full.md §2 block1 success metric／block12 イベント3〜5 | gtm-ops §G8 北極星＋入力指標ツリー | P1 |
| strategy | strategy | ビジネスモデル（誰が払うか・単位経済） | △ 薄い | v3-draft/blueprint-v3.md §16 TCO はコスト側のみ | gtm-ops §G6 単位経済（CAC/LTV/粗利） | P1 |
| strategy | company | 会社・名義・口座・会計 | △ 薄い | v3-draft/blueprint-v3.md L6 会社名義／L8 決済アカウント | gtm-ops §O9 会社・会計・税 | P2 |
| strategy | team | 人とAIエージェントの役割分担（RACI） | △ 薄い | v3-draft/blueprint-v3.md L17/L30 AIクレジット・実行場所 | gtm-ops §O10 役割表（人／AI／承認） | P2 |
| brand | brand | 命名・商標・ドメイン・SNSハンドル | ✓ ある | v3-draft/blueprint-v3.md L1/L26／brand/SKILL.md §3 | — | P3 |
| brand | brand | 声・トーン・言語別ルール | ✓ ある | brand/SKILL.md §2／v3-draft/blueprint-v3.md L14/L21 | — | P3 |
| brand | brand | 色・ロゴ・アイデンティティ | ✓ ある | brand/SKILL.md §4／Part 2 場面×感情×トークン | — | P3 |
| brand | brand | メッセージ階層（見出し・3本柱・証拠・反論） | × ない | Part 2 は感情とトークンのみ | gtm-ops §G3 メッセージ階層 | P1 |
| design | ux | フロー・ジャーニー・サービスブループリント | ✓ ある | v3-draft/blueprint-v3.md §2.1/§2.2 | — | P3 |
| design | ux | UXの方法の並列比較 | ✓ ある | v3-draft/blueprint-v3.md §8 | — | P3 |
| design | ux | オンボーディングとアクティベーション（Aha までの時間） | △ 薄い | v3-draft/blueprint-v3.md §2.1 フロー『初回』のみ。D4 の数値合格条件 | gtm-ops §G9 アクティベーション定義と初回体験 | P1 |
| design | ui | 画面×状態マトリクス | ✓ ある | v3-draft/blueprint-v3.md §13 | — | P3 |
| design | ui | UI詳細の受け入れ基準の集約 | △ 薄い | gaps-2026-10-26.md『UI詳細』残（L20/L38 に散在） | ux/ui-detail.md | P2 |
| design | design_system | デザインシステムの境界と版 | ✓ ある | v3-draft/blueprint-v3.md L37／catalog/DESIGN.md | — | P3 |
| design | accessibility | WCAG 2.2 AA・a11y チェック | ✓ ある | v3-draft/blueprint-v3.md §2.2 UI T3／L38／§5.2 | 実機＋スクリーンリーダー試験の手順を追記 | P2 |
| design | i18n | 多言語・日本語改行 | ✓ ある | v3-draft/blueprint-v3.md L19/L14 | 翻訳ワークフローと用語集を追加 | P3 |
| build | tech | スタック選定・組み合わせ・予算帯 | ✓ ある | v3-draft/blueprint-v3.md §8/§9/§15／catalog/*.yaml | — | P3 |
| build | tech | 作る vs 買う vs 全部入り（TCO） | ✓ ある | v3-draft/blueprint-v3.md §16／catalog/build_vs_buy.yaml | — | P3 |
| build | security | アカウントの一生・秘密情報・権限 | ✓ ある | v3-draft/blueprint-v3.md §5.1／L9/L10 | — | P3 |
| build | security | 脅威モデル・脆弱性診断・依存の脆弱性 | △ 薄い | v3-draft/blueprint-v3.md §5.1 セキュリティの健全性（1行） | gtm-ops §O7 依存更新と脆弱性 | P2 |
| build | qa | テスト戦略（単体/E2E/Visual gate） | △ 薄い | v3-draft/blueprint-v3.md L34 Visual gate／L25 負荷試験 | gtm-ops §O8 QAの最小セット | P2 |
| build | data | データ・保持・バックアップ・復元 | ✓ ある | v3-draft/blueprint-v3.md L5／export/blueprint-v2-full.md block5 | — | P3 |
| build | analytics | 計測設計（イベント辞書・同意） | △ 薄い | export/blueprint-v2-full.md block12（3〜5イベント）／catalog/analytics.yaml | gtm-ops §G8 イベント辞書 | P1 |
| legal | legal | 規約・プライバシー・国別規制 | ✓ ある | v3-draft/blueprint-v3.md §5.2 | — | P3 |
| legal | legal | 広告・マーケの法規（景表法・ステマ規制・FTC 推奨表示・CAN-SPAM） | △ 薄い | v3-draft/blueprint-v3.md §5.2 景品表示法・CAN-SPAM の1語のみ | gtm-ops §G5 広告とインフルエンサーの表示ルール | P1 |
| legal | tax | 税（売上税・VAT・消費税・インボイス）とMoR | △ 薄い | v3-draft/blueprint-v3.md §5.2 売上税ネクサス・VAT/MoR | gtm-ops §O9 | P2 |
| legal | legal | 知財（商標出願・OSSライセンス） | △ 薄い | v3-draft/blueprint-v3.md L26 | OSSライセンス棚卸しを追加 | P3 |
| pricing | pricing | 価格とパッケージ（無料枠・プラン・試用） | △ 薄い | v3-draft/blueprint-v3.md L13（JTBDからオファー） | gtm-ops §G6 価格設計 | P1 |
| pricing | pricing | 課金運用（請求・返金・チャージバック・解約） | △ 薄い | v3-draft/blueprint-v3.md §5.2 解約・撤回／§7 責任の所在 | gtm-ops §G6/§O3 | P2 |
| pricing | pricing | アプリ内課金とストア手数料 | △ 薄い | v3-draft/blueprint-v3.md §5.2 アプリストア | gtm-ops §G6 | P3 |
| gtm | positioning | ポジショニング（Dunford 5要素） | × ない | Part 1 block2『価値と位置づけ』は見出しのみ（export/blueprint-v2-full.md §2 block2） | gtm-ops §G3 | P1 |
| gtm | positioning | ICP と非対象（トリガーイベント） | △ 薄い | v3-draft/blueprint-v3.md D2 ペルソナ仮説（非対象1人） | gtm-ops §G3 ICP（トリガー必須） | P1 |
| gtm | channels | チャネル選定（Bullseye：19チャネルから3つ試す） | × ない | export/blueprint-v2-full.md block10『最初の10人はどこから』の1行のみ | gtm-ops §G4／catalog/gtm_channels.yaml | P1 |
| gtm | launch | ローンチ計画（T-14〜T+30・ロールバック） | × ない | 該当なし | gtm-ops §G5 ローンチ計画 | P1 |
| gtm | launch | Product Hunt / Hacker News / X での公開 | × ない | 該当なし | catalog/gtm_channels.yaml ch.producthunt 等 | P2 |
| gtm | store | App Store / Google Play 掲載・ASO・審査 | △ 薄い | v3-draft/blueprint-v3.md L8 ストアアカウント／§5.2 アプリストア規約 | gtm-ops §G7 ASO・審査 | P2 |
| gtm | seo | SEO・技術SEO・構造化データ・llms.txt | × ない | 該当なし（llms.txt は Blueprint 自身の画面のみ） | gtm-ops §G7 SEO | P1 |
| gtm | content | コンテンツ計画（ブログ・動画・事例） | △ 薄い | v3-draft/blueprint-v3.md L15/L22/L32（制作手順のみ、計画なし） | gtm-ops §G4 コンテンツカレンダー | P2 |
| gtm | social | SNS運用（投稿承認・頻度・アカウント） | △ 薄い | export/blueprint-v2-full.md block10 posting approval rules／L21 | gtm-ops §G4 | P2 |
| gtm | pr | PR・プレスキット・メディア | × ない | 該当なし | gtm-ops §G5 プレスキット | P3 |
| gtm | ads | 有料広告（予算・停止条件・計測） | × ない | 該当なし | gtm-ops §G4 広告テスト／catalog/gtm_channels.yaml | P2 |
| gtm | partnerships | 提携・連携・マーケットプレイス掲載 | × ない | 該当なし | gtm-ops §G4 | P3 |
| gtm | virality | 紹介・拡散ループ（招待・共有・UGC） | × ない | 該当なし | gtm-ops §G10 成長ループ | P1 |
| gtm | community | コミュニティ（Discord・ユーザー会） | × ない | 該当なし | gtm-ops §G10 | P3 |
| gtm | sales | 営業（B2B：デモ・CRM・提案書） | × ない | 該当なし | gtm-ops §G4 販売モーション（PLG/SLG/MLG） | P2 |
| growth | lifecycle | ライフサイクルメール・通知（ナーチャリング） | △ 薄い | catalog/email_notifications.yaml（送信基盤のみ） | gtm-ops §G9 | P2 |
| growth | retention | 継続率・コホート・解約理由 | × ない | 該当なし | gtm-ops §G9 リテンション | P1 |
| growth | experiments | 実験（A/B・フラグ・判定ルール） | △ 薄い | v3-draft/blueprint-v3.md L19 フラグ一覧／catalog/analytics.yaml PostHog | gtm-ops §G8 実験の書式 | P2 |
| growth | feedback | フィードバック収集とロードマップ公開 | × ない | 該当なし | gtm-ops §O3 | P3 |
| operate | support | サポート窓口・応答目標・FAQ/ヘルプ | △ 薄い | export/blueprint-v2-full.md block11／gaps『運用』一部 | gtm-ops §O3／catalog/support.yaml | P1 |
| operate | support | モデレーション・通報対応 | △ 薄い | v3-draft/blueprint-v3.md L28／§5.2 DSA | gtm-ops §O3 | P2 |
| operate | ops | ランブック・障害対応・ステータスページ | △ 薄い | export/blueprint-v2-full.md block11 incident runbook／catalog/monitoring.yaml | gtm-ops §O1 障害対応 | P1 |
| operate | ops | オンコール（誰が何時に起きるか）・SLO | × ない | 該当なし | gtm-ops §O1 SLO | P2 |
| operate | ops | コスト監視・上限・キルスイッチ | ✓ ある | export/blueprint-v2-full.md block4 spend caps／v3-draft/blueprint-v3.md L2/L16/L17 | — | P3 |
| operate | ops | 手作業の運用（管理画面・人の承認） | ✓ ある | v3-draft/blueprint-v3.md L28／§2.2 サービスブループリント | — | P3 |
| maintain | maintenance | 依存更新・メジャーアップグレード・非推奨API | × ない | v3-draft/blueprint-v3.md §5.1 に『依存関係の更新』1語 | gtm-ops §O7 保守カレンダー | P1 |
| maintain | maintenance | 外部サービスの規約・価格変更の監視 | △ 薄い | v3-draft/blueprint-v3.md §15.3 鮮度（カタログ側のみ） | gtm-ops §O7 ベンダー変更監視 | P2 |
| maintain | maintenance | 技術的負債・ドキュメント更新 | × ない | 該当なし | gtm-ops §O7 | P3 |
| finance | finance | 予算・ランウェイ・月次レビュー | △ 薄い | v3-draft/blueprint-v3.md §9 予算帯／export/blueprint-v2-full.md block8 | gtm-ops §O9 月次の数字 | P2 |
| sunset | exit | 撤退・移行・ピボット判断 | △ 薄い | export/blueprint-v2-full.md block13 Exit and migration | gtm-ops §O11 継続/ピボット/撤退の判定基準 | P2 |
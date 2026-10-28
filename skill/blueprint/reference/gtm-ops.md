# Blueprint v3 追加案：Go-to-Market・成長・運営・保守（下書き 2026-10-26）
提供：CREATIVITY IS EVERYWHERE, LLC ／ 対象：`coverage-lifecycle-2026-10-26.md` で「ない」「薄い」だった項目
各節の書式：**決めること／予算帯（無料・$5・$10・$100／月）／リスク／AIが確かめられる合格条件**。
予算帯の金額は記憶ベースです。使う前に `catalog/gtm_channels.yaml`・`support.yaml` の出典で確認してください（verified:false）。
Tier の目安：T0 は省略可。T1 は G2・G3・O3。T2 以上は全部。

---
# Part 5 Go-to-Market と成長

## G1 競合と代替手段
- **決めること**：利用者が今使っている代替手段（他社製品・手作業・何もしない）を5つ以上。それぞれの価格と、乗り換えない理由。
- **予算帯**：無料＝手で調べる／$5〜$10＝追加費用なし（AIの調査で足りる）／$100＝SimilarWeb などの有料データ（要確認）。
- **リスク**：「競合なし」と書くこと。たいていは代替手段の見落としです。
- **合格条件**：`gtm/alternatives.md` の各行に `{name, type: product|manual|nothing, price, source_url, checked}` がある。「何もしない」の行がある。

## G2 需要とPMFの検証
- **決めること**：作る前のテスト（LP＋待機リスト、事前予約、手作業での代行）。合格の数値。PMF の判定方法。
- **予算帯**：無料＝LP＋フォーム（自社ホスト）／$5＝独自ドメインのフォームとメール／$10＝少額広告で流入テスト（1日$5で2日など）／$100＝広告で1〜2週間テスト。
- **リスク**：知り合いだけの反応を需要とみなすこと。広告の少額テストはぶれやすいこと。
- **合格条件**：`gtm/demand-test.md` に仮説、合格の数値（例：訪問→登録 10%以上）、実測値、判定（go / pivot / stop）がある。公開後は、使った人40人以上に「使えなくなったらとても残念」と答える割合を聞き、40%以上を目安にする（Sean Ellis テスト）。

## G3 ICP・ポジショニング・メッセージ
- **決めること**：ICP（誰に、トリガーになる出来事、今のやり方、対象外の人）。ポジショニング5要素（代替手段、独自の特徴、その特徴でできること、いちばん喜ぶ層、市場カテゴリー）。メッセージ階層（見出し7語以内、補足15語以内、3本柱それぞれに証拠、よくある反論3つと答え）。
- **予算帯**：全帯とも追加費用なし。$100 帯ならインタビューの謝礼（1人$20×5など）。
- **リスク**：ブランドの声（Part 2）とメッセージが食い違うこと。まだない機能を言うこと（L27 違反）。
- **合格条件**：`gtm/positioning.yaml` に5要素が空欄なくある。3本柱すべてに `proof`（データ・デモ・利用者の声）がある。見出しが LP・ストア・SNS のプロフィールで同じ。L27 で「提案」の機能が見出しに出ていない。

## G4 チャネルと販売モーション
- **決めること**：販売の型（PLG＝試して買う／SLG＝営業が売る／MLG＝発信で信頼を作る）。候補チャネルから3つ選んで小さく試し、1つに絞る（Bullseye）。投稿の承認ルールと頻度。
- **予算帯**：無料＝X・コミュニティ・SEO・Show HN／$5＝追加なし（独自ドメインのメール）／$10＝少額広告のテスト／$100＝広告で1チャネル2週間、または予約投稿ツール。
- **リスク**：全チャネルを少しずつやって何も分からないこと。会社名義でないアカウント（L6）。ステマ規制。
- **合格条件**：`gtm/channels.yaml` の各チャネルに `{catalog_id, hypothesis, budget_band, metric, stop_rule, owner}` がある。試すチャネルは3つ以下。どの `stop_rule` にも数値がある。

## G5 ローンチ計画
- **決めること**：ローンチの規模（大＝PR＋全チャネル／中＝メール・SNS／小＝アプリ内だけ）、日付、T-14〜T+30 の担当、ロールバック条件と判断する人（1人）、プレスキット。
- **予算帯**：無料＝Product Hunt・Show HN・自社SNS／$5〜$10＝追加なし／$100＝PR配信（要確認）。
- **リスク**：ローンチ当日にサポートや監視が手薄になること。広告やインフルエンサー投稿に「PR」表記がないこと（日本のステマ規制、FTC の推奨表示ガイド）。ストア審査が遅れて日付がずれること。
- **合格条件**：`gtm/launch.md` に T-14／T-7／T-1／T0／T+1／T+7／T+30 の行があり、全行に担当者がいる。ロールバックの数値条件（例：エラー率 2%超）がある。O1 のランブックと O3 の窓口が T-7 までに「済」になっている。広告文に PR 表記のチェックが入っている。

## G6 価格・パッケージ・単位経済
- **決めること**：無料枠、プラン、試用期間、年額割引、価格をどこで払うか（Web／アプリ内課金／MoR）、返金方針。単位経済（1ユーザーあたりの原価、CAC、LTV、粗利）。
- **予算帯**：無料＝Stripe の手数料のみ／$5〜$10＝追加なし／$100＝Paddle などの MoR で税対応を任せる（手数料は要確認）。
- **リスク**：AI の原価がユーザー数に比例して増えるのに、定額で売ること。アプリ内課金の手数料。解約しにくい設計（FTC・EU のルール違反）。
- **合格条件**：`gtm/pricing.yaml` に、プランごとの価格、原価、粗利率の計算式がある。ユーザー数を10倍にした場合の粗利が書いてある。LTV/CAC が出ている（推計なら「推計」と書く）。解約が登録と同じ手数（クリック数）以内で終わる。

## G7 SEO・ASO・AIに見つけてもらう
- **決めること**：狙う検索語10個、ページごとの title と description、構造化データ、サイトマップ、OG画像、`llms.txt`。アプリなら名前・サブタイトル・キーワード・スクリーンショット。
- **予算帯**：無料＝Search Console・App Store Connect の分析／$5〜$10＝追加なし／$100＝有料の SEO・ASO ツール（要確認）。
- **リスク**：*.vercel.app などのプレビューURLが検索に出ること。日本語の title が2行に崩れること（L20）。審査で掲載文が差し戻されること。
- **合格条件**：全公開ページに title・description・canonical・OG がある。プレビュー環境は noindex。`sitemap.xml` と `robots.txt` があり、Search Console にサイトマップが送信済み。`llms.txt` がある。Lighthouse の SEO が 90 以上。

## G8 計測・北極星・実験
- **決めること**：北極星指標を1つと、それを動かす入力指標を3〜5つ。イベント辞書（名前、いつ送るか、プロパティ、個人情報を含まないこと）。同意の扱い。実験の書式。
- **予算帯**：無料＝PostHog の無料枠、Vercel Analytics の Hobby（`catalog/analytics.yaml`）／$5〜$10＝同じ／$100＝従量課金の上限を設定して超過分を払う。
- **リスク**：EU・英国で同意前に計測すること。イベント名がバラバラで集計できないこと。サンプル数が少ないまま A/B テストの結論を出すこと。
- **合格条件**：`analytics/events.yaml` の全イベントに `{name, trigger, props, pii:false}` がある。コード内のイベント名が辞書と一致する（grep で確認できる）。実験ごとに仮説・指標・最小サンプル数・終了日がある。

## G9 オンボーディング・アクティベーション・継続
- **決めること**：アクティベーションの定義（例：登録から24時間以内に〇〇を1回）、Aha までの目標時間、ライフサイクルメール（ようこそ、未完了への声かけ、休眠への声かけ）、解約理由の聞き方。
- **予算帯**：無料＝Resend の無料枠＋自前の配信予定（`catalog/email_notifications.yaml`）／$5〜$10＝独自ドメインの送信／$100＝Customer.io などの配信ツール（要確認）。
- **リスク**：メールを送りすぎて迷惑メール扱いになること（L7）。マーケティングメールの同意（PECR、特定電子メール法）。
- **合格条件**：アクティベーション率、D1／D7／D30 の継続率がダッシュボードで見られる。全メールに配信停止のリンクがある。解約の流れに理由の質問が1つある（任意）。

## G10 成長ループ（紹介・拡散・コミュニティ）
- **決めること**：どのループで伸ばすか（招待＝使うほど人を呼ぶ／コンテンツ＝作ったものが公開されて流入になる／有料＝売上を広告に回す）。紹介の特典と不正対策。コミュニティを作るか、作るなら場所と運営者。
- **予算帯**：無料＝共有リンク・OG画像・Discord／$5〜$10＝特典の原価／$100＝Rewardful などの紹介ツール（要確認）。
- **リスク**：自分で自分を紹介する不正。景品表示法の上限。誰も運営しないコミュニティ。
- **合格条件**：`gtm/loops.md` にループの図（入力 → 行動 → 出力 → 次の入力）と、測る指標（例：招待率×受諾率＝k係数）がある。特典に上限と不正の判定ルールがある。

---
# Part 6 運営と保守

## O1 障害対応・SLO・オンコール
- **決めること**：SLO（例：月の稼働率 99.5%）、アラートの条件、誰に通知するか（夜間も含む）、ランブック、ステータスページ、事後振り返りの書式。
- **予算帯**：無料＝Sentry の無料枠、外形監視とステータスページの無料枠（`catalog/monitoring.yaml`、`support.yaml`）／$5〜$10＝SMS や電話での通知／$100＝オンコールツール（要確認）。
- **リスク**：通知先が1人だけ。ステータスページが本体と同じホストで、本体と一緒に落ちること。
- **合格条件**：`ops/runbook.md` に、よくある障害5つそれぞれの {検知、初動、連絡文テンプレート、復旧確認} がある。アラートを試しに1回鳴らした記録がある。ステータスページが別ホストにある。

## O3 サポート・モデレーション・フィードバック
- **決めること**：窓口（メール／アプリ内チャット）、応答時間の目標、FAQ、AIの一次回答を使うか、人に回す条件、通報への対応、要望の集め方と公開ロードマップ。
- **予算帯**：無料＝support@ と共有受信箱、ヘルプページ／$5〜$10＝独自ドメインのメール／$100＝ヘルプデスクツール（要確認）。
- **リスク**：AIの回答が返金や規約について約束してしまうこと。本人確認なしでアカウントを変えてしまうこと（§5.1）。
- **合格条件**：`ops/support.md` に、窓口・応答目標・人に回す条件・AIに答えさせない話題の一覧がある。問い合わせ先が LP・アプリ・ストアの全部に表示されている。

## O7 保守（依存・アップグレード・ベンダーの変更）
- **決めること**：依存の自動更新（Dependabot か Renovate）、毎月の保守日、主要フレームワークとランタイムのサポート期限、外部APIの非推奨予定、ベンダーの規約・価格変更の監視、技術的負債の記録。
- **予算帯**：無料＝Dependabot・GitHub のセキュリティアラート、カタログの鮮度チェック（§15.3）／$5〜$10＝同じ／$100＝有料のセキュリティ診断（要確認）。
- **リスク**：ランタイムのサポート切れで、ホストがデプロイを拒否すること。APIのバージョンが急に終わること（例：決済・認証）。
- **合格条件**：`ops/maintenance.yaml` に `{component, version, eol_date, source_url, checked}` がある。90日以内にサポートが切れるものはレビュー（§12）で指摘される。重大度 high 以上の脆弱性アラートが 0 件、または対応期限つきで記録されている。

### O7a バックアップ・データ保護（現場の教訓）
一覧は `catalog/data_protection.yaml`（全件 verified:false）。小規模ならコストはほぼゼロ。
| ID | 原則 | 避ける形 | なぜ | チェック |
|---|---|---|---|---|
| dp.backup-3-2-1 | 3-2-1：主DBの時点復元＋同じクラウドのオブジェクトストレージへ毎晩コピー＋削除ロック付きの別事業者コピー | 事業者の標準復元や個人向けドライブだけに頼る | 1つのアカウント・事業者の障害や乗っ取りで全部失う | 別事業者の削除ロック付きコピーがある？ |
| dp.backup-bucket-lock | バックアップのバケットに保持ロック（約90日） | 書き込み権限があれば消せるバケット | ランサムウェアや誤ったスクリプトが消す | 保持／バケットロックはオン？ |
| dp.ai-keys-no-backup-delete | AI・自動化のキーにバックアップの削除権限を渡さない | 管理者キーをそのまま渡す | 誤った・乗っ取られた自動コマンドで復旧手段が消える | AI が持つキーに削除権限はない？ |
| dp.backup-verify-alert | 毎晩のバックアップを検証し失敗で通知 | 黙って動くバックアップ | 止まっていても必要な時まで気づかない | 失敗・空のバックアップで通知が来る？ |
| dp.restore-test-monthly | 毎月復元テスト | 成功表示を信じる | テストしていないバックアップは戻らないことが多い | 30日以内に復元を試した？ |
| dp.backup-worker-isolated | バックアップは本体と別のワーカー＋専用の認証情報 | 本体アプリの中で同じ認証情報で動かす | デプロイやバグで止まらず、権限も絞れる | 独立したジョブで専用の認証情報？ |
| dp.rate-limit-auth-forms（今・無料） | Rate-limit login, signup, magic-link, contact and domain-connect endpoints. | Leaving auth and form endpoints unlimited. | AI-driven credential stuffing and form abuse scale cheaply. | Do all of these endpoints have rate limits? |
| dp.bot-challenge-server-verified（今・無料） | Put a bot challenge on public forms and AI widgets and verify the token server-side. | Client-only challenges or none. | Bots skip client-side checks and abuse forms or burn AI cost. | Is the challenge token verified on the server? |
| dp.bot-block-keep-webhooks（今・無料） | Turn on bot-fight / AI-crawler blocking, then confirm payment and email webhooks still get through. | Enabling bot blocking without testing webhooks. | Blocked webhooks silently break payments and mail. | Were payment and email webhooks tested after enabling bot blocking? |
| dp.agent-least-privilege-keys（今・無料） | Give each agent/job its own least-privilege, expiring key with no delete rights; rotate all keys after an incident. | One shared admin key for every agent and script. | A leaked or hijacked agent key should not unlock everything. | Is every agent key scoped, expiring and without delete rights, with a rotate-all plan? |
| dp.admin-phishing-resistant-mfa（今・無料） | Put admin accounts on passkeys or hardware keys. | SMS or authenticator-app codes for admins. | SMS and app codes get phished; AI makes phishing cheaper. | Do all admin accounts use passkeys or hardware keys? |
| dp.prompt-injection-untrusted-input（今・無料） | Treat inbound mail and user input as untrusted data; keep FAQ AI read-only with no tools or personal data; require human approval before AI drafts are sent. | Letting an AI that reads outside input also hold tools, private data or send rights. | Private data + untrusted input + a way out lets injected text leak data. | Is the FAQ AI tool-less and data-free, and does a human approve every AI draft before sending? |
| dp.ai-usage-caps（今・無料） | Cap tokens and requests per IP and per user. | Unlimited AI calls behind a public endpoint. | Abuse can run up cost or exhaust quota overnight. | Are per-IP and per-user token/request caps set? |
| dp.custom-domains-covered（次） | Confirm WAF and rate limits also apply on customers' custom domains. | Protecting only the main domain. | Attackers use the unprotected custom-domain path. | Do WAF and rate limits cover customer custom domains? |
| dp.retire-unused-keys（次） | Retire keys from old setups you no longer use. | Leaving keys from abandoned projects active. | Forgotten keys are unmonitored entry points. | Are keys from unused setups revoked? |
| dp.later-paid-defenses（後・有料） | At scale, add an AI firewall, higher-tier bot protection, and a twice-yearly key inventory and rotation drill. | Buying paid tools before the free basics are done. | Paid layers pay off only once traffic and risk justify them. | Are the free basics done and the paid triggers written down? |

## O8 QA の最小セット
- **決めること**：主要フロー3本の E2E テスト、Visual gate（L34）、負荷試験（L25）、公開前のチェックリスト。
- **予算帯**：無料＝Playwright と CI の無料枠／$5〜$10＝同じ／$100＝実機テストのクラウド（要確認）。
- **合格条件**：CI で E2E が通る。393px での見た目を比べたスクリーンショットがある。

## O9 会社・会計・税・予算
- **決めること**：契約の名義、銀行口座、会計ツール、売上税・VAT・消費税（インボイス）を誰が扱うか（自社か MoR）、毎月の数字（売上、原価、AIの費用、残り資金）。
- **予算帯**：無料＝表計算／$5〜$10＝会計ツールの安いプラン／$100＝税理士や MoR（要確認）。
- **リスク**：海外で売上税の登録義務が生まれるのに気づかないこと。
- **合格条件**：`ops/finance.md` に月次の表があり、各国の登録義務を確認した日付がある。

### O9a 事業の立ち上げ：住所・ブランド・決済アカウント（現場の教訓・法律助言ではない・US）
一覧は `catalog/business_setup.yaml`（全件 verified:false）。
| ID | 原則 | 避ける形 | なぜ | チェック |
|---|---|---|---|---|
| biz.public-support-address | 決済の公開サポート住所は CMRA／バーチャルメールボックスの住所で、初売上の前に設定 | 自宅住所を入れる | レシートや明細で公開される | 自宅以外の住所を初売上前に設定した？ |
| biz.multi-brand-dba-1583 | ブランドごとに DBA を登録し、全 DBA を USPS Form 1583 の追加受取人に記載。1事業ごとに住所と1583が要るかは購入前に書面で確認 | 法人名だけで契約し他ブランド宛ても届くと思う | 未記載の名前宛ては返送されがち | 全 DBA が登録・記載済みで、方針を書面で確認した？ |
| biz.other-person-business-separate | 他人（例：配偶者の個人事業）の事業は別事業。自分の1583と身分証が要る | 自分の法人の DBA として回す | 売上・税・責任が自分の法人に移る | 別の1583／ID がある、または移る前提を受け入れた？ |
| biz.processor-account-per-brand | 決済アカウントはブランドごと。法的名称と税番号は法人、公開名・明細表記・サポート住所はアカウントごと | 複数ブランドで1アカウントと1つの明細表記 | 見覚えのない表記はチャージバックを生む | ブランドごとに公開名・表記・住所がある？ |
| biz.llc-full-formation-cost | 「$1」「$39」の LLC 設立価格は代行料だけ。州の登録料と公告（例：NY）を先に見積もる | 広告価格で代行や州を選ぶ | 総額が広告価格を大きく超える | 総額を書き出してから注文した？ |
| biz.events-start-sole-prop | 小さな対面イベント事業は個人事業＋EIN＋DBA＋事業用口座＋イベントごとの保険で始め、売上やリスクが増えたら LLC | 売上ゼロで初日から LLC、または保険なし・個人口座 | 固定費を抑えつつお金と責任を分けられる | 4点が揃い、LLC にする条件を書いた？ |

関連：`ui_ux.public-support-address-not-home`、`ui_ux.statement-descriptor-preflight`、`pay.stripe-checkout`、`pay.stripe-connect`。

### O9b アプリ内ドメイン販売（再販）（現場の教訓・法律助言ではない）
一覧は `catalog/business_setup.yaml`（全件 verified:false）。
| ID | 原則 | 避ける形 | なぜ | チェック |
|---|---|---|---|---|
| biz.domain-price-per-name | 価格は名前ごとに登録直前に取得 | TLD ごとの一律価格 | プレミアム名は価格差が大きく、更新もプレミアム価格のことがある | 決済時に卸価格を再取得している？ |
| biz.domain-resale-rights | 再販してよいか規約で確認 | API がある＝再販可と思う | 原価系レジストラは第三者への提供・代理登録を禁じることがある | 再販を認める条項か書面の許可がある？ |
| biz.domain-collect-before-register | 顧客から先に回収してから登録 | 先に買って後で請求 | 登録は返金不可で、未回収は直接の損失 | 登録 API の前に支払い確定している？ |
| biz.domain-no-refund-consent | 登録後返金不可に同意を取る | 返金条件を規約の奥に隠す | 仕入れ先が返金しないので期待がずれる | 購入画面にチェックボックスがあり、規約に同じ文言がある？ |
| biz.domain-supplier-not-by-convenience | ホスティングと同じだからで仕入れ先を選ばない | 便利さだけで選ぶ | 規約・API の成熟度・更新/移管ルールが本番を止める | 再販権・API 更新・移管ロック期間・登録者の所有を全部確認した？ |
| biz.domain-renewal-funding | 更新費の資金を計画 | 自動更新をプラットフォームのカードで払う | 離脱した顧客の分を払うことになる | レジストラ請求前に顧客から更新費を回収している？ |

## O10 役割（人とAIエージェント）
- **決めること**：ローンチと運営の各タスクを、誰がやるか（人／どのAI）、誰が承認するか。
- **合格条件**：G5 と O1 の全行に、担当と承認者がいる。外部に出る操作（投稿・送信・公開）の承認者は人。

## O11 続ける・ピボット・撤退の判断
- **決めること**：見直す時期（例：ローンチから90日後）、続けるための数値条件、撤退するときの告知期間・データの書き出し・返金。
- **合格条件**：判断の日付と数値条件が `blueprint.yaml` にある。撤退の手順が §5.2（解約と返金）と v2 block13 につながっている。

---
## 既存の部分へのつなぎ
- §2.1 カスタマージャーニーの「認知 → 検討」を G3〜G5 で、「継続・離脱」を G9 で埋める。
- §12（常時360°レビュー）の見る範囲に、Part 5 と Part 6 を追加する。
- Canvas に GTM・Ops の列を追加する（ノード：positioning → channels → launch → activation → retention → support）。
- 14ブロックの block10（マーケと公開）、block11（運用）、block12（分析）、block13（撤退）は、この追加案が本文になる。

# Blueprint データ監査レポート（2026-11-25）— 確認用

状態：**提案のみ。リポジトリのデータはまだ変更していません。** ご確認後に一括で反映し、ビルドとテストを回します。

---

## 1. 対象ファイル一覧

### データ（選択肢・比較・推薦）— アプリと MCP が実際に読む本体
| ファイル | 中身 | 規模 |
|---|---|---|
| `skill/blueprint/catalog/*.yaml`（43 分野） | 選択肢ごとの説明・料金（`pricing_bands`）・上限・`avoid_when`・確認日（`source.checked`） | 633 件（うち料金つき **161 件**） |
| `skill/blueprint/elements/tactics.yaml` | 決めごと 64 件（うち選ぶ型 **34 件**）。既定のおすすめ `ai_pick` / `ai_reason_ja`、答えで切り替える `pick_when` | 1,096 行 |
| `skill/blueprint/elements/stack_comparisons.yaml` | 34 件の比較表：無料枠・有料の入口・切り替えの境目・おすすめ理由・**選ばなかった理由** | 1,647 行 |
| `skill/blueprint/elements/glossary.yaml` | 用語の言い換え | 435 行 |
| `skill/blueprint/preferences/*.yaml` | 判断の好み（重み） | 3 件 |
| `skill/blueprint/project-maps/*.yaml` | 共有の地図（2 件） | — |

### 推薦ロジック・文言を組み立てるコード
| ファイル | 役割 |
|---|---|
| `app/src/main.js:63-67` `rulePick()` | 始める画面の答え → `pick_when` → なければ `ai_pick` |
| `app/src/main.js:377` | 「選ばなかったものと理由」＝**各選択肢の `avoid_when` をそのまま表示**（答えも、何が選ばれたかも見ていない） |
| `app/src/main.js:309` `compareHtml()` | 比較表のおすすめ・選ばなかった理由を表示（**常に既定のおすすめ前提**） |
| `app/src/main.js:104` | 書き出し YAML/Markdown の rejected（同じく `avoid_when` 流用） |
| `shared/decide-core.mjs:283-289` `whyRejected()` | 点数で選ぶ時の理由。`0.52 vs 0.61: weaker on cost 0.30 vs 0.80 — avoid when: …` という英語の機械文 |
| `app/src/ai-pick-core.js` / `app/api/ai-pick.js` | 本物の AI に聞く時（既定 off） |
| `mcp/src/index.ts` | MCP の `decide`・`stale_items`・`propose_catalog_refresh` など |
| `app/scripts/build-data.mjs` | YAML → `public/data.json` |

### 対象外（古い写し。今回は触らない予定）
`drafts/data/*.json`・`ui/data/*.json`（試作画面用の古い写し）、`drafts/catalog/*.yaml`（v3 下書き）、`legacy/`・`skills/`（旧版）。→ 確認事項 Q4。

---

## 2. 確認の方法と信頼度（重要）

- 6 グループ＋ホスティングで **約 168 件**を点検。グループ別の詳細表（現在の文・課題・修正案・根拠 URL・信頼度）は同じフォルダの `A-infra.md` 〜 `F-gtm.md`。
- **調査の途中まで、この環境のネットワークがほぼ全ベンダーの公式サイトを遮断していました。** そのためグループ A〜F の多くの数値は「公式ドメインに限定した検索結果の抜粋」が根拠で、信頼度は最大でも「中」です。
- 途中で許可リストに追加できたのは 2 回分（Firebase・Cloudflare・Supabase・Neon・Clerk・Auth0・AWS・Algolia・GitHub・Sentry・Stripe・Paddle・Lemon Squeezy・PAY.JP・KOMOJU 等 40 ホスト）。残り（Expo・Next.js・Astro・Resend・PostHog・CMS・UI ライブラリ・フォーム・法務・広告など約 80 ホスト）はまだです。
- **反映時のルール（提案）**：公式ページを直接読めた項目だけ `verified: true`・`checked: 2026-11-25` にする。抜粋のみの項目は文を直しても `verified: false` のまま。これは既存の決まり（`reference/catalog-refresh.md`）どおりです。
- ホスティング 3 件は私が公式ページを直接読みました（下記）。

---

## 3. カテゴリー別：修正前の課題 → 修正案

### 3-1. ホスティング（直接確認済み・信頼度 高）

**根拠（2026-11-25 に直接読んだ公式ページ）**
- Vercel 規約 `vercel.com/legal/terms`：「You shall only use the Services under a Hobby plan for your personal or non-commercial use.」／料金 `vercel.com/pricing`：Hobby 転送 100 GB/月・関数 100 万回/月、Pro $20/月・$20 の利用クレジット込み・転送 1TB/月。※料金ページ自体からは「非商用」の文言が消えている（規約には残る）
- Firebase Hosting ドキュメント `firebase.google.com/docs/hosting/usage-quotas-pricing`：「Data transfer … at no cost up to **10 GB/month**」「Spark で超えると…next month までサイト停止」。**ただし料金表 `firebase.google.com/pricing` は今も「360 MB/day」表記**（公式内で食い違い）。
- Firebase App Hosting `firebase.google.com/docs/app-hosting/costs`：「App Hosting requires a project that's on the pay-as-you-go **Blaze** pricing plan」。無料分：転送（キャッシュなし）10 GiB/月、その後 $0.20/GiB。
- Cloudflare Pages `developers.cloudflare.com/pages/`：「Are you sure you want to use Pages? Workers supports most Pages use cases… It is Cloudflare's primary platform… **Start new projects with Workers.**」
- Cloudflare Workers 料金：Free 10 万リクエスト/日・CPU 10ms/回、Paid $5/月（1,000 万リクエスト＋CPU 3,000 万 ms 込み、超過 $0.30/100 万・$0.02/100 万 CPU ms）、静的ファイルは無料・無制限、転送料なし。
- Cloudflare の Next.js ガイド：推奨は **vinext（ベータ）**。App Router・RSC・Server Actions・ISR・Middleware 対応、画像最適化は一部。既存は OpenNext。
- Cloudflare 規約 `cloudflare.com/terms`：無料プランに非商用の制限なし。

**修正前の課題**
1. Firebase の転送量が旧表記（360MB/日）。Hosting（静的・Spark 可）と App Hosting（SSR・Blaze 必須）が「静的・SSR ホスティング」の一言に混ざっている。
2. Cloudflare が「静的サイト、低コスト」「Next.js の一部が動かない」＝静的向けの印象。公式は Pages を新規非推奨にして Workers に統合。無料から商用可・DB/ストレージ自社完結という決定的な差が書かれていない。
3. Vercel の推薦理由が「無料で始められる」。始める画面で「有料」「売り買い」と答えても、非商用ルールが理由に出ない。
4. 答えで Firebase がおすすめになっても、比較表は「おすすめ Vercel／Firebase を選ばなかった」のまま。

**差分案**

`catalog/hosting.yaml`
```diff
 - id: host.vercel
-  what: Next.js 向けホスティング＋関数
-  best_for: Next.js、プレビューを多用
-  avoid_when: 商用なのに無料プランのまま使う時、アプリのデータ置き場を Firebase でそろえたい時
+  what: Next.js の開発元の公開先。標準の Node.js で動き、Next.js の新機能が出た日から使える
+  best_for: Next.js を最新のまま使う／変更ごとの確認用 URL／DB は Neon・Supabase など外部を使う前提
+  avoid_when: 月 $20 を払わずに商用で出したい時（無料の Hobby は個人・非商用のみ）、ログインと DB を Firebase にそろえる時
   pricing_bands:
-    free: Hobby $0：個人・非商用のみ。転送100GB、関数呼び出し100万
+    free: Hobby $0：個人・非商用のみ（規約）。転送 100GB/月・関数 100 万回/月。上限で止まり追加購入不可
-    usd100: Pro $20/人：1TB、$20分の利用クレジット、使いすぎは上限設定可
+    usd5: —（商用なら最低 Pro $20/月）
+    usd100: Pro $20/月（1人）：転送 1TB/月・$20 分の利用クレジット込み。超過は従量、予算の上限を設定可
-    checked: '2026-11-03'
+    checked: '2026-11-25'   # vercel.com/pricing と vercel.com/legal/terms

 - id: host.firebase-hosting
   name: Firebase Hosting / App Hosting
-  what: 静的・SSR ホスティング
-  best_for: Firebase 一式で統一
-  avoid_when: 変更ごとの確認用ページを手軽に出したいウェブ中心の時
+  what: Google の Firebase の公開先。Hosting＝静的ファイル（無料の Spark で可）、App Hosting＝Next.js などの SSR（Blaze＝従量課金の登録が必須）
+  best_for: ログイン・DB（Firestore）・通知・公開先を Firebase 1 つにそろえたいスマホ中心のアプリ
+  avoid_when: SSR の画面を無料のまま出したい時（App Hosting は Blaze 必須）、DB に Postgres（Supabase・Neon）を使う時
   pricing_bands:
-    free: Spark：10GB保存、360MB/日 転送
-    usd5: Blaze 従量
+    free: Spark（Hosting のみ）：保存 10GB・転送 10GB/月。超えると月末までサイト停止。※料金表は旧表記「360MB/日」のまま、公式ドキュメントは 10GB/月
+    usd5: Blaze：Hosting 超過は保存 $0.026/GB・転送 $0.15/GB。App Hosting は転送 10GiB/月まで無料、その後 $0.20/GiB（キャッシュなし）
-  limits: App Hosting は Blaze 必須
+  limits: App Hosting は Blaze（カード登録）必須。Blaze は上限なしの従量なので予算アラートの設定が前提
+    url: https://firebase.google.com/docs/hosting/usage-quotas-pricing
+    checked: '2026-11-25'

 - id: host.cloudflare-pages          # id は互換のため据え置き（地図・テストが参照）
-  name: Cloudflare Pages / Workers
-  what: エッジで静的＋関数
-  best_for: 静的サイト、低コスト
-  avoid_when: Next.js の機能をそのまま全部使いたい時（一部が動かないことがある）
+  name: Cloudflare Workers（旧 Pages を含む）
+  what: 世界中のエッジで動く公開先。DB（D1）・ファイル（R2）・キャッシュまで Cloudflare 内でそろう。公式は新規なら Pages より Workers を推奨
+  best_for: 無料のまま商用で出したい／アクセスが増えても安く（転送料なし）／DB・ファイルも 1 社にまとめたい
+  avoid_when: Node.js 専用の部品に頼る時、Next.js の新機能を出た日から使いたい時（vinext・OpenNext 経由で大半は動くが互換チェックが要る）
   pricing_bands:
-    free: Workers Free：10万リクエスト/日、CPU 10ms/回。静的ファイルは無料・無制限
-    usd5: Workers Paid $5：1,000万リクエスト/月、転送料なし
-    usd10: $5＋超過 $0.30/100万リクエスト
+    free: Workers Free：10 万リクエスト/日・CPU 10ms/回。静的ファイルは無料・無制限。商用可（規約に非商用の制限なし）
+    usd5: Workers Paid $5/月：1,000 万リクエスト＋CPU 3,000 万 ms/月込み。転送料なし
+    usd10: $5＋超過 $0.30/100 万リクエスト・$0.02/100 万 CPU ms
-  limits: Free は CPU 10ms/回
+  limits: Free は CPU 10ms/回（超えるとエラー）。Pages は残るが新機能は Workers 側
+  pairs_well_with: [fe.astro, fe.nextjs]
+    checked: '2026-11-25'
```

`stack_comparisons.yaml` の hosting
```diff
   - id: host.cloudflare-pages
-    free_tier: ビルド 月500回・同時1つ・1サイト2万ファイル・確認用ページ無制限。関数は 1日10万回まで
+    free_tier: Workers Free：10 万リクエスト/日・静的ファイル無料無制限・商用可。Pages のビルドは月 500 回
   - id: host.firebase-hosting
-    free_tier: 保存 10GB・転送 1日 360MB
+    free_tier: Hosting（静的）：保存 10GB・転送 10GB/月（Spark）。SSR の App Hosting は Blaze 必須
   switch_points:
+  - when: 商用なのに月 $20 を払いたくない／アクセスが多く転送料を抑えたい
+    upgrade_to: Cloudflare Workers（Free でも商用可、Paid $5/月）
+    why: Vercel の無料は非商用だけ。Cloudflare は無料から商用で使え、転送料もかからない。代わりに Node.js 互換の確認が要る。
   recommendation:
-    reason: 変更ごとに確認用ページが自動で出て、作業が一番少ない。商用で使う日から Pro $20/月。
+    reason: Next.js がそのまま全部動き、変更ごとに確認用 URL が出る。ただし無料は非商用のみ。お金を受け取るなら初日から Pro $20/月。
     rejected:
     - option: host.cloudflare-pages
-      why: 静的サイトは無料で強い（ビルド月500回・確認用ページ無制限）が、Next.js の一部機能が動かないことがある。
+      why: 月 $20 を避けて無料のまま商用で出すなら第一候補（有料も $5/月〜・転送料なし・DB とファイルも同じ所）。代わりに Node.js 専用の部品や Next.js の新機能は互換チェックが要る。
     - option: host.firebase-hosting
-      why: アプリのデータ置き場を Firebase でそろえる時だけ一体になる。
+      why: ログインと DB を Firebase にする時だけ一体になる。Next.js の SSR は App Hosting＝Blaze（従量）必須で、無料の Spark は静的ファイルだけ。
```

`tactics.yaml` の hosting
```diff
-  ai_reason_ja: 変更ごとに確認用のURLが自動で出て、無料で始められる。
+  ai_reason_ja: Next.js がそのまま全部動き、変更ごとに確認用 URL が出る。無料は個人・非商用のみ。
   pick_when:
   - if: {platform: app}
     pick: host.firebase-hosting
-    reason_ja: アプリのデータ置き場と同じ所でそろう。
+    reason_ja: スマホアプリのログイン・DB・通知を Firebase にするので、公開先も同じ管理画面と請求にそろう。
+    rejected:
+    - {option: host.vercel, why: ウェブ画面が主役の時の第一候補。アプリ中心だと Firebase と別アカウント・別請求になる。}
+    - {option: host.cloudflare-pages, why: 無料で商用・転送料なしは強いが、Firebase のログイン・DB とは別の管理画面になる。}
+  caution_when:
+  - if: {money: [paid, marketplace]}
+    applies_to: host.vercel
+    ja: お金を受け取るので Vercel は Pro $20/月が前提（無料の Hobby は非商用のみ）。月 $20 を避けるなら Cloudflare Workers。
```

### 3-2. データベース・ログイン・リアルタイム・検索・バックアップ（詳細：`B-data.md`）
| 課題（修正前） | 修正案 | 信頼度 |
|---|---|---|
| Firebase Auth「月 5 万人無料」— **Blaze の数字**。Spark で Identity Platform に上げると 1 日 3,000 人が上限 | 「Spark：基本のログインは無料。上位版（Identity Platform）は 1 日 3,000 人まで／Blaze：月 5 万人まで無料」 | 中 |
| アプリなら Realtime Database が「同じ所でそろう」— **誤り**。DB の Firestore がすでにリアルタイム反映でき、RTDB を選ぶと DB が 2 つに割れる | 選択肢に「Firestore のリスナー（追加サービスなし）」を足し、アプリの答えのおすすめをそれにする | 高 |
| バックアップ「どの DB でも pg_dump」— **誤り**。Postgres だけ。Firestore は別の書き出し | 「Postgres（Supabase・Neon）なら」に限定。Firestore は管理エクスポート | 高 |
| Neon の無料は 100 プロジェクト（Supabase は 2）。スナップショット機能が出て「バックアップではない」の前提が変わった | 無料枠と `bk.neon-restore` の文を更新 | 中 |
| Algolia 無料は「Search by Algolia」ロゴの表示が条件 | 無料枠に条件を明記 | 中 |
| Stytch は 2025-11 に Twilio が買収済み | 所有の注記を追加 | 中 |
| PostgreSQL 19 が 2026-11-19 に公開 | 参照バージョンを更新 | 中 |

### 3-3. 決済・海外販売（詳細：`C-payments.md`）
| 課題（修正前） | 修正案 | 信頼度 |
|---|---|---|
| **Lemon Squeezy が終了**：新規登録は 2026-11-16 で締切、既存も 2027-03-31 で停止、Stripe Managed Payments へ移行（公式 docs/blog）。カタログは「新規登録は引き続き可能」のまま | 新規プロジェクトの選択肢から外す（`status: sunset` を新設して推薦対象外に）。`pay.lemonsqueezy`・`mor.lemonsqueezy`・`es.mor_first`・`pricing.yaml` の `pairs_well_with` を修正。MoR の候補は Paddle と Stripe Managed Payments | 高（公式 docs 複数） |
| Stripe Tax Complete・日本のカード料率・Adyen の上乗せなど | 抜粋が食い違うので **直接読んでから** 反映（Stripe は許可済み） | 低〜中 |
| `pick_when`（売り買い→Connect、複数国→Paddle）で、比較表の「選ばなかった理由」が Checkout 前提のまま | 答えごとの rejected を追加（下書きは `C-payments.md` §3） | 高 |

### 3-4. 監視・CI・費用管理・保護・ファイル置き場（詳細：`A-infra.md`）
| 課題（修正前） | 修正案 | 信頼度 |
|---|---|---|
| Supabase の使いすぎ上限で「$25 で固定」と読める — 計算資源（追加プロジェクト約 $10/月など）は上限の対象外 | 対象外を明記 | 高 |
| Sentry「5 万件」は**有料プランの量**。無料は 5,000 件/月 | 比較表の数字と理由を修正 | 中 |
| Crashlytics がウェブ対応（Preview、2026-11-12）。ウェブは Blaze・従量 | 「アプリだけ」の文を更新 | 中 |
| Vercel Blob「非公開にできない」— 非公開ストアが一般提供済み。本当の差は「DB の権限（RLS）がなく、読む人の確認を自分のコードで毎回書く」 | `avoid_when` と rejected を差し替え | 高 |
| Mux の無料枠に有料プランのクレジットが混ざっている。無料は動画 10 本まで | 修正 | 中 |
| Vercel Firewall の OWASP ルールが Pro でも使える（追加オプション） | 更新 | 高 |
| Vercel Git と GitHub Actions が二択に見える（役割が違い、両方使う） | 説明を「役割の違い」に | 高 |

### 3-5. AI・メール・計測・アプリ配布・フロント・多言語・鍵の共有（詳細：`D-app.md`）
| 課題（修正前） | 修正案 | 信頼度 |
|---|---|---|
| Vercel の AI Gateway・Analytics の無料枠に**非商用ルールが書かれていない**。Analytics の追加機能は Pro $20 が前提で実質 $30〜 | 無料枠に「非商用のみ」、入口を「Pro $20＋$10」に | 高（規約） |
| Astro＝「静的サイト向け」— Astro は公式アダプターで SSR・ログインも可。2026-01 に **Cloudflare 傘下**（MIT のまま） | 決定的な差＝「画面の動く部分は React などの部品を埋め込む作り」へ。所有の注記 | 中 |
| Bitwarden「無料では共有できない」— **誤り**。無料の組織で 2 人まで共有可 | 5 か所を修正（カタログ・比較表・推薦理由） | 中 |
| Google Play の外部決済（米国・EEA）、Apple の日本向け（MSCA）手数料が古い | 規則を更新（`country=jp` で効く） | 中 |
| Next.js 16.2 で公式のアダプター API。ホスト移行の「乗り換えにくさ」の前提が変わった | `lock_in` を更新 | 中 |
| Lokalise・Crowdin の料金が年払い表記の可能性 | 直接読んでから | 低 |
| Vertex AI → 「Agent Platform」に改名 | 名称を更新 | 中 |

### 3-6. CMS・編集 UI・UI ライブラリ・アイデア検証（詳細：`E-ui.md`）
| 課題（修正前） | 修正案 | 信頼度 |
|---|---|---|
| 編集 UI のおすすめ vaul が 2025-10 から**保守停止**。shadcn の標準 Drawer は Base UI 製に移行 | おすすめを shadcn の Drawer（Base UI）に変更 | 高 |
| UI ライブラリ：選択肢 15 件に対し比較表は 8 件のみ。7 件は「選ばなかった理由」がない | 7 件分を追加（下書きあり） | 高 |
| Tally・BlockNote の料金が**年払いの月換算**（月払いは Tally Pro $29、BlockNote Business $390） | 月払いと年払いを書き分け | 中 |
| Magic UI Pro が比較表で $49、カタログで $199（食い違い） | $199 にそろえる | 中 |
| Tremor は Vercel が買収（2025-01）・更新停止気味、ライセンスは Apache-2.0 のみ | 修正 | 高 |
| daisyUI＝「見た目だけ」の二分法 → 差は「開閉・フォーカス・キーボード操作が入っていない」 | 差し替え | 高 |
| npm のパッケージ名変更（`@base-ui/react`、Puck） | 注記 | 高 |

### 3-7. 集客・サポート・規約・売却・価格設計（詳細：`F-gtm.md`）
| 課題（修正前） | 修正案 | 信頼度 |
|---|---|---|
| Meta 広告「$5 程度から（要確認）」 | 最低 $1/日、推奨 $5 以上・6 日以上 | 中 |
| GetTerms 無料版の中身、iubenda Essentials では規約は作れない | 明記 | 中 |
| Flippa の成約手数料の帯、Acquire の買い手会員の価格 | 更新 | 中 |
| HN・X の `avoid_when` が文面の注意だけ → 「試せる物がない」「利用者がそこにいない」へ | 差し替え | 中 |

---

## 4. 推薦ロジック（「AI のおすすめ」「選ばなかった理由」）の改善案

### 今の動き（コードで確認）
1. **選ばなかった理由＝各選択肢の `avoid_when` の流用**（`main.js:377`）。始める画面の答えも、何が選ばれたかも見ていない。例：答えが「アプリ」で Firebase がおすすめでも、Vercel の理由は「商用なのに無料プランのまま使う時…」と表示される。
2. **比較表は既定のおすすめ前提で固定**。`pick_when` が効く 22 件すべてで、上の「おすすめ」と下の比較表の「おすすめ・選ばなかったもの」が食い違う（検査スクリプトで全件確認）。
3. 答えの **お金（無料／有料／売り買い）がほぼ使われていない**（34 件中 3 件のみ）。商用ルールで結論が変わる Vercel 系の選択肢でも理由に出ない。
4. 点数で選ぶ時の理由（`decide-core.mjs` `whyRejected`）は「0.52 vs 0.61: weaker on cost 0.30 vs 0.80 — avoid when: …」という英語の数字の羅列。

### 改善案
| # | 変更 | ファイル |
|---|---|---|
| L1 | `pick_when` の各ルールに `rejected:`（その答えの時に正しい「選ばなかった理由」）を持たせる。既定には比較表の rejected を使う | `tactics.yaml`（22 ルール分の下書きは A〜F の各ファイルにあり） |
| L2 | 理由を出す優先順：本物の AI → 答えに合ったルールの rejected → 比較表（おすすめが一致する時だけ）→ 選択肢の「決定的な差」1 行 | `main.js`、`mcp/src/index.ts` |
| L3 | 比較表の上に「あなたの答えでは〇〇がおすすめ。下の比較は既定の場合」と出す。または答えに合わせて並べ替え | `main.js` `compareHtml` |
| L4 | `if` に複数値（`money: [paid, marketplace]`）を許し、`caution_when` を新設：おすすめ自体は変えず、答え次第で注意書きを出す（例：有料なら「Vercel は Pro $20/月が前提。避けるなら Cloudflare」） | `tactics.yaml`、`main.js`、`decide-core.mjs` |
| L5 | 選択肢に `trade_off_ja`（決定的な差を 1 行）を新設。比較の表示と「選ばなかった理由」の最後の手段に使う | `catalog/*.yaml` |
| L6 | `whyRejected` を日本語化：「費用と速さで劣る（次点）。〇〇の時はこちら：（trade_off）」 | `shared/decide-core.mjs` |
| L7 | `status: sunset`（終了予定）を新設。推薦と点数から外し、画面に「新規は選べません（〇年〇月に終了）」 | catalog、`decide-core.mjs`、`main.js` |

---

## 5. 自分を直していく仕組み（ご質問への回答と提案）

### すでにあるもの
- `catalog/freshness.yaml`：項目の種類ごとの賞味期限（料金 90 日、上限・対応状況 30 日、セキュリティ 7 日）
- MCP の `stale_items`：期限切れ・未確認の項目を、使われている順に、公式 URL と今の文つきで出す
- MCP の `propose_catalog_refresh`：AI が公式ページを読んだ結果を `mcp/inbox/` に提案として置く（本体は人が確認して直す）
- `app/test/data.test.mjs`：形のテスト（全項目に確認日がある、など）

### 足りないもの（今回の監査で実際に見つかった種類）
1. **ファイルをまたいだ食い違いの検出がない**：同じ選択肢の数字がカタログと比較表で違う（Firebase 360MB、Magic UI $49/$199）、`pick_when` と比較表の矛盾（22 件）、選択肢と比較表の抜け（UI ライブラリ 7 件）。
2. **終了・改名・買収を拾う仕組みがない**（Lemon Squeezy、Cloudflare Pages、Astro、vaul）。
3. **定期実行がない**：手順書はあるが、誰も起動しない。今は料金つき 161 件すべてが確認から 14 日以上。
4. 公式ページに届かない時に「確認済み」と誤って押さない、という決まりは文書だけ。

### 提案
| # | 内容 |
|---|---|
| S1 | `npm run audit`（`app/scripts/audit-data.mjs`）：ファイルをまたいだ検査。**エラー**（テストを落とす）：同じ id で数字が違う、`pick_when` に rejected がない、選択肢が比較表にない、sunset の選択肢がおすすめになっている、URL の形式が不正。**警告**：賞味期限切れ、`verified: false`、確認日の新旧の逆転。`npm test` に組み込む |
| S2 | 月 1 回の定期タスク（クラウドのセッション）：`stale_items` → 公式ページを直接読む → 差分を `propose_catalog_refresh` → 変更があれば下書き PR を作る。マージは人。終了・改名・買収のニュースも公式ブログで確認 |
| S3 | 監査結果を `drafts/audit-YYYY-MM-DD/` に残す（今回のこのフォルダが初回） |
| S4 | 公式ページを開けなかった項目は自動で `verified: false` のまま、理由を `source.note` に残す |

---

## 6. 「始める URL」と「公式サイト URL」

- **Blueprint 自体**：接続済みの Vercel にも Cloudflare にも Blueprint のデプロイは見つかりませんでした（Vercel にあるのは別プロジェクト 1 件、Cloudflare は `lpk-*`・`moime` 系のみ）。公開 URL はまだありません。→ Q3
- **各選択肢**：A〜F の各ファイルの「urls」節に、`site_url`（公式サイト）と `start_url`（登録・始め方のページ）を約 165 件分集めました。カタログに 2 つの欄を足し、決める画面の各選択肢に「始める ↗」「公式サイト ↗」を出す案です。URL が実際に開けるかは、ネットワーク許可の残りが通ってから確かめます。

---

## 7. 確認事項

- **Q1** 料金の数字は「公式ページを直接読めた項目だけ確認済みにする」でよいか（抜粋だけの項目は文を直しても未確認のまま）。
- **Q2** 推薦ロジック L1〜L7 をすべて入れるか、まずデータの修正（L1・L5・L7）だけにするか。
- **Q3** 「始める URL・マーケティングサイトの URL」は、各選択肢の URL のことか、Blueprint 自体の公開先のことか。後者なら、どこに出すか（例：Vercel に `app/` を公開、マーケティングサイトは別に作る）。
- **Q4** `drafts/`・`ui/data/`・`legacy/` の古い写しは触らないでよいか。
- **Q5** 自己点検（S1 の検査、S2 の月 1 回の定期タスク）を入れてよいか。定期タスクは約 80 の公式サイトへの接続許可が前提です。

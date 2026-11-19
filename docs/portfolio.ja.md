# 5 つのプロジェクトの地図（Part B）

English: [portfolio.md](portfolio.md)

実在する 5 つのプロダクトを、決めることごとに地図にしました。オーナーは 12 のカテゴリーを順に歩き、部品どうしのつながりを見て、判断の好み（プロファイル）のもとで AI なら何を選ぶかを、1 つずつ承認しなくても確かめられます。地図は `skill/blueprint/project-maps/` にあり、ウェブアプリに同梱されます。

**既定の好み：`lean-fast-full`（安く・速く・全部試す）。** この地図に「決定」は 1 つもありません（オーナーの確認はどこにもない）。使っている状態：

- `observed`（確認済み）— リポジトリ調査で分かった事実と、その出典ファイル（`<リポジトリ>/<パス>`。調査メモから写したもので、今回は読み直していない）。
- `ai_selected`（AI の選択）— おすすめのみ。`decide` がカタログから好みに沿って採点したもの、または出典つきの提案（PRD の節、BJM PO のキャンバス）。提案は好みを変えても残り、代わりに「≠」印が付く。
- `gap`（穴）— 分からない・未決。何が足りないかをメモに書き、その下に AI の候補も出す。

## 地図を開く

アプリを動かして（`cd app && npm ci && npm run dev` → `http://localhost:5173/`）、またはアプリを置いている場所で、下のハッシュを付けて開きます。

| 地図 | プロダクト | 本番で動いているか | 地図 | つながり | 画面 |
|---|---|---|---|---|---|
| rakugaki-jam | 落書きを壁に映す・QR で参加 | 不明（引き継ぎ文書に Firebase Hosting の住所。今回は未確認） | `#/p/rakugaki-jam` | `#/p/rakugaki-jam/arch` | [PC](screens/rakugaki-jam-map-desktop.png) · [390](screens/rakugaki-jam-map-390.png) · [つながり](screens/rakugaki-jam-arch-desktop.png) · [つながり 390](screens/rakugaki-jam-arch-390.png) |
| moime | スマホで作るサイトビルダー | 文書上は公開中（moime.app。今回は開いていない） | `#/p/moime` | `#/p/moime/arch` | [PC](screens/moime-map-desktop.png) · [390](screens/moime-map-390.png) · [つながり](screens/moime-arch-desktop.png) · [つながり 390](screens/moime-arch-390.png) |
| local-pro-kit | ストア・自動生成サイト・無料診断 | 不明（Cloudflare Workers へ移行中） | `#/p/local-pro-kit` | `#/p/local-pro-kit/arch` | [PC](screens/local-pro-kit-map-desktop.png) · [390](screens/local-pro-kit-map-390.png) · [つながり](screens/local-pro-kit-arch-desktop.png) · [つながり 390](screens/local-pro-kit-arch-390.png) |
| lpk-frontdesk | 予約の受付 | **本番前**（README：未デプロイ） | `#/p/lpk-frontdesk` | `#/p/lpk-frontdesk/arch` | [PC](screens/lpk-frontdesk-map-desktop.png) · [390](screens/lpk-frontdesk-map-390.png) · [つながり](screens/lpk-frontdesk-arch-desktop.png) · [つながり 390](screens/lpk-frontdesk-arch-390.png) |
| brand-journey-map | 初期の構想（文書のみ） | **本番前**（アプリのコードなし・ドメイン未取得） | `#/p/brand-journey-map` | `#/p/brand-journey-map/arch` | [PC](screens/brand-journey-map-map-desktop.png) · [390](screens/brand-journey-map-map-390.png) · [つながり](screens/brand-journey-map-arch-desktop.png) · [つながり 390](screens/brand-journey-map-arch-390.png) |

状態の数（各 64 件。`tactics.yaml` の決めることは 64 件）：

| 地図 | 確認済み | AI の選択 | 穴 | 印つき（穴＋メモつきの確認済み） |
|---|---|---|---|---|
| rakugaki-jam | 3 | 53 | 8 | 8 |
| moime | 13 | 51 | 0 | 4 |
| local-pro-kit | 12 | 51 | 1 | 5 |
| lpk-frontdesk | 6 | 55 | 3 | 6 |
| brand-journey-map | 0 | 54 | 10 | 10 |

## 1 つの点（決めること）を見直す手順

1. `#/p/<slug>` を開く。題名の下の帯が、本番で動いているかを示す。番号つきの 12 カテゴリー（01〜12 と XB）が歩く順番。`!` はカタログにまだ決める項目がないカテゴリー。
2. 点を押すと右に詳しい欄が出る：状態と誰が付けたか、選んだもの（穴ならおすすめ候補）、選ばれた理由、採点に使った**好み**と出典の日付（**公式で確認／未確認**）、根拠のファイル、ほかの部品との**つながり**（同じ会社・相性・ぶつかり）、**ほかの選択肢**と 7 つの点数、それぞれが選ばれなかった理由、もう一方の好み（`all-in`）なら何を選ぶか。`穴` や `≠` の印は、指を置くと理由が出る。
3. カテゴリー順に歩くなら `#/p/<slug>/c/01` 〜 `/c/12`（← → で移動）。
4. `#/p/<slug>/arch` はフロント ↔ バック ↔ データ ↔ ログイン ↔ お金 ↔ 外部サービス。実線は根拠のある実装、点線は提案（AI の選択・定番のつなぎ方・文書の提案）。
5. 承認・別の選択・見送りは欄のボタンで。変更は「YAML で書き出す」でコミットするまで、このブラウザの中だけに残る。

## `all-in`（お金をかけて質と伸びしろ）ならどう変わるか（下見・まだ適用しない）

各地図の帯の下に折りたたみで出ます。点の欄にも出ます。好みのボタンを押すまで何も変わりません。

- **rakugaki-jam** — AI の選択が 14 件変わる（メール → Resend、CI → Vercel Git、値段 → 無料枠＋有料、CMS → Notion API、届け方 → PWA など）。確認済みの事実 1 件に印：Realtime Database ≠ Supabase Realtime。
- **moime** — 9 件変わる（届け方 → PWA、攻撃からの守り → Vercel Firewall、費用 → Vercel Spend、多言語 → Lokalise など）。確認済み 6 件に印：Firestore ≠ Supabase、Crisp ≠ ヘルプセンター、Next.js ≠ Expo、AI 直結 ≠ Firebase AI Logic、GitHub Actions ≠ Vercel Git、Cloud Run ≠ Cloudflare Workers。
- **local-pro-kit** — 11 件変わる。確認済み 5 件に印：Turnstile ≠ Vercel Firewall、Astro ≠ Next.js、R2 ≠ Supabase Storage、AI 直結 ≠ AI Gateway、GitHub Actions ≠ Vercel Git。
- **lpk-frontdesk** — 13 件変わる（メール → Resend、CI → GitHub Actions、届け方 → PWA など）。確認済みへの印なし。
- **brand-journey-map** — 7 件変わる（監視 → Vercel Observability、守り → Vercel Firewall など）。PO・PRD の提案 3 件は残して印：Neon ≠ Supabase、Stripe ≠ Paddle、next-intl ≠ Lokalise。

## 穴と未確認のもの

下はすべて地図に印があります。今回は 1 つも確かめ直していません。

**rakugaki-jam**
- 本番の置き場所が不明：`vercel.json` と `firebase.json` の両方がある。2026-07-20 の引き継ぎ文書の Firebase Hosting の住所は、このリポジトリでは未確認。
- 裏側：`firebase.json` が指す `functions/` がない。
- ログイン：jam のコードに `firebase/auth` がない。README の Firebase Auth は jam では根拠なし。
- 決済・メール/SMS・計測・AI API は見つからず。CI のワークフローもなし。
- Canvas と Web Audio が中心（調査メモ）だがファイル名がない（メモだけを根拠に実装として描画）。
- WCAG 2.2 AA は PRODUCT.md の目標で、監査結果ではない。

**moime**
- 決済：Stripe の Webhook 署名の秘密を入れるまでチェックアウトが始まらない。本番の支払いはまだ 1 度もない。
- 値段（月 $5、6 か月 $25、年 $45、発売記念クーポン）はリポジトリの文書にある表示で `verified: false`。
- SMS ログイン：まず日本と米国。実際に SMS が届くかは未確認。
- AI：鍵が `.env.example` にない。本番で使えるかは不明。
- moime.app が公開中というのはリポジトリの文書による。今回は開いていない。
- 調査メモにファイル名がない事実（メモだけが根拠）：Firestore、Firebase Storage、Clarity と自前の計測、Crisp、Secret Manager、Cloud Scheduler。

**local-pro-kit**
- 置き場所は Vercel → Cloudflare Workers へ移行中。ルートの `vercel.json` が残る。独自ドメインへの切り替えは未完了。localprokit.com の公開は未確認。
- 決済：`STRIPE_LIVE_APPROVED` がないと本番の Stripe は拒否。本番の支払いがあったかは不明。
- メール：Resend と `MESSAGING_LIVE=true` の設定はあるが、鍵が入っていて実際に送れているかは不明（模擬の送信箱が残る）。
- 計測：ストア自前の計測なし。Cloudflare の監視だけ。
- Turnstile は任意。本番で有効かは不明。
- メモだけが根拠：D1 と KV、R2、Cloudflare の監視、Twilio、Google Places、`GEMINI_MODEL`。ビジネスプロフィール監査の Google OAuth は無効（`GBP_AUDIT_ENABLED`）。GoHighLevel の鍵はデモ用。Name.com はサンドボックス。

**lpk-frontdesk**（本番前）
- 未デプロイ。LINE・Twilio・Stripe・Vagaro は既定で偽物。
- Hyperdrive の id は仮の値（PG_TO_D1 の同期はまだ動かない）。オーナーのログインは Local Pro Kit の lpk-ops D1 に頼る。
- 決済：手付金の流れは窓口（PaymentGateway）の裏にあり、Stripe は偽物だけ。
- メールと計測は不明。AI API なし。
- メモだけが根拠：D1 の名前、ロール。wrangler のファイル名は調査メモにない。

**brand-journey-map**（本番前・文書のみ）
- 未決の項目：O-01（tldraw の商用ライセンス料が未確認）、O-11（Clerk Organizations か Supabase Auth か）、O-12（Neon か Supabase か — PO の方向は Neon。オーナー未確認）。
- PO キャンバス 2026-11-18（提案であり決定ではない）：1 スタジオ＝1 組織（マルチテナント）、決済＝Stripe（前回の Paddle と Stripe の食い違いを Stripe に）、データ＝Neon Postgres＋Cloudflare R2、モジュールは単体でも使える、17 枠そろえる「シール」は見直し中、AI 下書きは無料モデル優先・出典つき・人が 1 項目ずつ確認。
- PRD §14 の提案：Vercel 上の Next.js、next-intl、Vercel Workflow/Queues（カタログにない）、あとで共同編集（Liveblocks か tldraw sync）。
- Image Sensor の取得元（Pinterest OAuth、Are.na、Unsplash）：API 規約は未確認。
- オーナー決定 D-01〜D-10 は決めることの選択肢 id に結びついていない（例：「Base44 ではなく Claude Code」→ 作るか借りるかは、オーナーが結びつけるまで穴）。
- メール・SMS・計測・本番の AI API：未実装。
- 前回の地図（`docs/03-blueprint/project-map.yaml`、2026-11-13、60 件中 0 件決定）は調査メモの説明から作り直した（始める画面の答え business / web / paid / global を引き継ぎ）。ファイル自体は読み直しておらず、カタログの ai_pick は決定として引き継いでいない。

**5 つ共通**：AI の選択はカタログのおすすめにすぎません。`lean-fast-full` では、ウェブだけのプロダクトに合わない候補（届け方に Expo、メールに Firebase Cloud Messaging、CI に EAS Workflows）を出すことがあります。助言ではなく、採点を見直す材料として扱ってください。

## 地図を更新する

- AI は `update_project_map({slug: "moime", records: [...], decide_topics: ["all"]})` を呼ぶ。同じリンク `#/p/moime`（と `#/p/moime/arch`）が返る。確認済みの事実・印つきの穴・出典つきの提案は残り、AI の選択だけ採点し直す。
- `rescore_project_map({slug, profile: "all-in"})` は書き込まずに好みの変更を下見する。
- 5 つを根拠ファイルから作り直す：`cd mcp && npm run build && node scripts/build-portfolio.mjs`（入力は `mcp/portfolio/<slug>.yaml`。`--fresh` で履歴をやり直す）。画面：`cd app && npm run build && npx vite preview --port 4173` のあと `node scripts/capture-screens.cjs`。

© 2026 CREATIVITY IS EVERYWHERE, LLC

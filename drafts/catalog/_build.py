import yaml,datetime
D="2026-10-26"
V=lambda u:{"url":u,"checked":D,"verified":True}
U=lambda u:{"url":u,"checked":None,"verified":False,"note":"未確認：使う前に公式ページで確認"}
def e(id,name,what,best,bands,limits,lockin,liab,sec,pairs,src,avoid=None):
    return dict(id=id,name=name,what=what,best_for=best,avoid_when=avoid or "",pricing_bands=dict(zip(["free","usd5","usd10","usd100"],bands)),limits=limits,lock_in=lockin,liability_compliance=liab,security=sec,pairs_well_with=pairs,source=src)
C={}
C["frontend"]=[e("fe.nextjs","Next.js","React のフルスタック・フレームワーク","SEO と動的機能が両方要るWeb",["OSS無料"]*4,"ホスト依存の機能あり（ISR・画像最適化）","中：Vercel 固有機能を使うほど移行が重い","なし","サーバー側の秘密を Client Component に漏らさない",["host.vercel","auth.clerk","db.supabase"],U("https://nextjs.org/docs")),
 e("fe.astro","Astro","コンテンツ中心の静的サイト生成","LP・ドキュメント・ブログ",["OSS無料"]*4,"重い対話UIには不向き","低","なし","静的出力は攻撃面が小さい",["host.vercel","host.cloudflare-pages"],U("https://docs.astro.build"),"ログイン後のアプリ本体"),
 e("fe.expo","Expo (React Native)","iOS/Android を1つのコードで","ネイティブアプリが必須の時",["無料（EAS無料枠）","要確認","要確認","要確認"],"ストア審査・課金ルール","中","ストア規約（アプリ内課金・アカウント削除）","鍵をアプリに埋め込まない",["auth.firebase","db.firestore"],U("https://expo.dev/pricing"))]
C["backend"]=[e("be.route-handlers","Next.js Route Handlers / Server Actions","フロントと同居するAPI","小〜中規模、1チーム",["ホストの無料枠内"]*2+["同左","同左"],"長時間処理に不向き（関数のタイムアウト）","中","なし","入力検証・認可を毎回サーバーで",["fe.nextjs","host.vercel"],U("https://nextjs.org/docs/app/building-your-application/routing/route-handlers")),
 e("be.cloud-run","Google Cloud Run","コンテナをそのまま動かす","長い処理・任意の言語",["無料枠あり","要確認","要確認","要確認"],"コールドスタート","低（コンテナは持ち運べる）","なし","サービスアカウントを最小権限に",["db.firestore","auth.firebase"],U("https://cloud.google.com/run/pricing"))]
C["database"]=[e("db.supabase","Supabase (Postgres)","Postgres＋認証＋ストレージ＋Realtime の一式","リレーショナルなデータ、SQL を使いたい",["$0：500MB、1週間無操作で一時停止、2プロジェクトまで","—（Free と Pro の間の帯はない）","—","$25〜：Pro（8GB、毎日バックアップ7日、休止なし）。$100帯なら Compute 増強 or PITR（$100/月）"],"Free は休止あり・バックアップなし","低：標準 Postgres なので移行しやすい","Team（$599〜）で SOC2/ISO27001、HIPAA はアドオン","RLS を必ず有効化。service_role 鍵をクライアントに出さない",["auth.supabase","host.vercel","fe.nextjs"],V("https://supabase.com/pricing")),
 e("db.firestore","Cloud Firestore","ドキュメント型DB（Firebase）","モバイル・リアルタイム同期・スキーマが緩いデータ",["$0（Spark）：1GiB、読み5万/日、書き2万/日","従量（Blaze）","従量","従量"],"集計・JOIN が苦手。読み取り回数で課金","高：データ構造と SDK に強く依存","Google Cloud の DPA","セキュリティルールのテスト必須",["auth.firebase","fe.expo"],V("https://firebase.google.com/pricing")),
 e("db.neon","Neon (Postgres)","サーバーレス Postgres、ブランチ機能","プレビュー環境ごとにDBを分けたい",["無料枠あり","要確認","要確認","要確認"],"要確認","低","要確認","接続文字列を秘密として扱う",["host.vercel","auth.better-auth"],U("https://neon.tech/pricing"))]
methods=["google","apple","email_password","magic_link","phone_sms","anonymous","passkeys","sso_saml"]
C["auth"]=dict(methods=dict(
 google=dict(what="Googleアカウントでログイン",note="OAuth 同意画面は会社名義（L6）"),
 apple=dict(what="Apple でサインイン",note="iOSアプリで他のソーシャルログインを出すなら Apple も求められる場合あり（App Store 審査ガイドライン 4.8 を要確認）。メールが非公開リレーになる"),
 email_password=dict(what="メール＋パスワード",note="漏えいパスワード検知・総当たり対策が要る"),
 magic_link=dict(what="メールのリンク／コード",note="メール到達性に依存（L7）"),
 phone_sms=dict(what="電話番号＋SMSコード",note="SMS は1通ごとに課金。SMSポンピング詐欺の対策が要る。米国は A2P 10DLC"),
 anonymous=dict(what="登録なしで開始し、後で本登録",note="後からのアカウント統合を設計しておく"),
 passkeys=dict(what="端末の生体認証（WebAuthn）",note="最も安全。復旧手段を別に用意"),
 sso_saml=dict(what="会社のIdP（Okta 等）",note="B2B 向け。接続数で課金されることが多い")),
 providers=[
 dict(id="auth.firebase",name="Firebase Authentication",support=dict(google="yes",apple="yes",email_password="yes",magic_link="yes",phone_sms="paid（Blaze、SMSごと課金）",anonymous="yes",passkeys="要確認",sso_saml="Identity Platform（50 MAUまで無料）"),pricing_bands=dict(free="$0：Identity Platform 5万MAUまで無料、SMSは対象外",usd5="SMS 従量のみ",usd10="同左",usd100="5万MAU超は Google Cloud 料金"),lock_in="高：パスワードハッシュの書き出しは可能だが SDK 依存が強い",best_for="Firebase/Firestore と一緒に使う、モバイル",source=V("https://firebase.google.com/pricing")),
 dict(id="auth.supabase",name="Supabase Auth",support=dict(google="yes",apple="yes",email_password="yes",magic_link="yes",phone_sms="yes（SMS業者は自前で契約）。電話MFAは Pro で月$75",anonymous="yes",passkeys="要確認",sso_saml="Pro 以上：50 MAU 込み、以降 $0.015/MAU"),pricing_bands=dict(free="$0：5万MAU",usd5="—",usd10="—",usd100="$25 Pro：10万MAU、以降 $0.00325/MAU"),lock_in="低：ユーザーは自分の Postgres にある",best_for="Supabase DB を使う、大量の無料ユーザー",source=V("https://supabase.com/pricing")),
 dict(id="auth.clerk",name="Clerk",support=dict(google="yes（Hobby はソーシャル3つまで）",apple="yes",email_password="yes",magic_link="yes",phone_sms="Pro 以上、米加 $0.01/通",anonymous="要確認",passkeys="Pro 以上",sso_saml="Pro に1接続込み、追加 $75/月"),pricing_bands=dict(free="$0 Hobby：アプリごと5万MRU（登録翌日以降に戻った人だけ数える）",usd5="—",usd10="—",usd100="$25 Pro（年払い$20）：MFA・パスキー・ブランド削除"),lock_in="中：データ書き出しは可能、UI部品に依存",best_for="Next.js で最速・UI込み、有料サービス",avoid_when="無料・低単価で大量ユーザーの B2C（公式FAQも Supabase/Firebase を勧める）",source=V("https://clerk.com/pricing")),
 dict(id="auth.auth0",name="Auth0",support=dict(google="yes",apple="yes",email_password="yes",magic_link="yes（Passwordless）",phone_sms="yes（要確認：SMS費用）",anonymous="no",passkeys="yes",sso_saml="Free に1接続"),pricing_bands=dict(free="$0：2.5万MAU",usd5="—",usd10="—",usd100="B2C Essentials $35〜（500MAU）、B2B Essentials $150〜"),lock_in="中",best_for="企業向け要件・監査ログ・Okta 連携",avoid_when="無料枠を超えて伸びる B2C（MAU 段階で急に高くなる）",source=V("https://auth0.com/pricing")),
 dict(id="auth.better-auth",name="Better Auth",support=dict(google="yes",apple="yes",email_password="yes",magic_link="plugin",phone_sms="plugin（SMS業者は自前）",anonymous="plugin",passkeys="plugin",sso_saml="plugin"),pricing_bands=dict(free="OSS無料（DB・メール・SMS の費用だけ）",usd5="同左",usd10="同左",usd100="同左"),lock_in="最低：自分のDBとコード",best_for="ベンダーに縛られたくない、TypeScript",avoid_when="セキュリティ運用を自分で持てない時",source=U("https://www.better-auth.com/docs")),
 dict(id="auth.cognito",name="AWS Cognito",support=dict(google="yes",apple="yes",email_password="yes",magic_link="要確認",phone_sms="yes（SNS課金）",anonymous="Identity Pool",passkeys="要確認",sso_saml="yes"),pricing_bands=dict(free="無料枠あり（要確認）",usd5="要確認",usd10="要確認",usd100="要確認"),lock_in="高：パスワードハッシュを書き出せない",best_for="AWS に寄せている",source=U("https://aws.amazon.com/cognito/pricing/")),
 dict(id="auth.stytch",name="Stytch",support=dict(google="yes",apple="yes",email_password="yes",magic_link="yes",phone_sms="yes",anonymous="要確認",passkeys="yes",sso_saml="yes（B2B）"),pricing_bands=dict(free="無料枠あり（要確認）",usd5="要確認",usd10="要確認",usd100="要確認"),lock_in="中",best_for="パスワードレス中心、不正対策",source=U("https://stytch.com/pricing"))])
C["security"]=[e("sec.vercel-firewall","Vercel Firewall / WAF","ホスト一体のファイアウォール・ボット対策","Vercel 上のアプリ",["Hobby：カスタムルール3、DDoS 緩和込み","—","—","Pro $20：ルール40、BotID $1/1,000回"],"高度なルールは Enterprise","中","SOC2 Type2・ISO27001（ホストとして）","レート制限をログイン・決済APIに",["host.vercel"],V("https://vercel.com/pricing")),
 e("sec.turnstile","Cloudflare Turnstile","CAPTCHA の代わり","登録・問い合わせフォーム",["無料（要確認）"]*4,"要確認","低","Cookie同意の要否を確認","サーバー側でトークン検証",["auth.better-auth"],U("https://developers.cloudflare.com/turnstile/")),
 e("sec.secrets","秘密情報の置き場（ホストの環境変数／Secret Manager）","鍵・トークンの保管","全プロジェクト",["ホスト込み"]*4,"—","低","漏えい時の通知計画（§5.1）","ローテーション日を L9 に記録",["host.vercel","be.cloud-run"],U("https://vercel.com/docs/environment-variables"))]
C["hosting"]=[e("host.vercel","Vercel","Next.js 向けホスティング＋関数","Next.js、プレビューを多用",["Hobby $0：個人・非商用のみ。転送100GB、関数呼び出し100万","—","—","Pro $20/人：1TB、$20分の利用クレジット、使いすぎは上限設定可"],"Hobby は商用不可。Hobby は追加購入不可で上限で止まる","中","SOC2 Type2・ISO27001・PCI DSS・EU-US DPF。HIPAA BAA は Pro で月$350","パスワード保護は Pro で $20/プロジェクト/月",["fe.nextjs","db.supabase","auth.clerk"],V("https://vercel.com/pricing")),
 e("host.firebase-hosting","Firebase Hosting / App Hosting","静的・SSR ホスティング","Firebase 一式で統一",["Spark：10GB保存、360MB/日 転送","Blaze 従量","従量","従量"],"App Hosting は Blaze 必須","中","Google Cloud","—",["auth.firebase","db.firestore"],V("https://firebase.google.com/pricing")),
 e("host.cloudflare-pages","Cloudflare Pages / Workers","エッジで静的＋関数","静的サイト、低コスト",["無料枠あり（要確認）","Workers 有料 $5〜（要確認）","—","—"],"Node API の一部が使えない","中","要確認","—",["fe.astro"],U("https://developers.cloudflare.com/pages/"))]
C["payments"]=[e("pay.stripe-checkout","Stripe Checkout / Payments","決済ページ・カード決済","単一販売者のサービス",["固定費なし、米国カード 2.9%+30¢／件、紛争 $15／件"]*4,"国ごとに対応手段が違う。海外カード +1%","中","チャージバックは販売者（自社）。紛争受付 $15","Webhook 署名を検証",["fe.nextjs"],V("https://stripe.com/pricing")),
 dict(id="pay.stripe-connect",name="Stripe Connect",what="プラットフォームが他者の売上を扱う（マーケットプレイス・SaaS）",best_for="主催者・出店者がいるサービス",
  options=[dict(id="standard",controller="losses.payments=stripe, fees.payer=account, dashboard=full",liability="Direct charges：接続アカウント（主催者）。Destination charges：プラットフォーム",cost="Stripeが料金を持つ方式：プラットフォームの追加費用なし"),
           dict(id="express",controller="losses.payments=application, fees.payer=application, dashboard=express",liability="紛争・不正・マイナス残高：プラットフォーム",cost="$2/アクティブ月 ＋ 0.25%+25¢/入金"),
           dict(id="custom",controller="+ requirement_collection=application, dashboard=none",liability="全部プラットフォーム（KYC情報の管理も）",cost="同上＋大きな開発")],
  lock_in="変更不可：作成後に方式（ダッシュボード種別）は変えられない。新規は Accounts v2／controller properties 推奨",liability_compliance="方式で責任が移る。先回りリスク調査（§7）の必須項目",
  source=[V("https://docs.stripe.com/connect/accounts"),V("https://docs.stripe.com/connect/migrate-to-controller-properties"),V("https://stripe.com/connect/pricing")])]
C["storage_media"]=[e("st.supabase-storage","Supabase Storage","ファイル保存＋CDN","Supabase を使っている",["Free：1GB、1ファイル50MBまで","—","—","Pro：100GB、画像変換100枚込み"],"Free は小さい","低","—","バケットのアクセス制御を RLS で",["db.supabase"],V("https://supabase.com/pricing")),
 e("st.vercel-blob","Vercel Blob","オブジェクト保存","Vercel 上で簡単に",["Hobby：1GB、読み1万回","—","—","Pro：$0.023/GB"],"—","中","—","公開URLの推測に注意",["host.vercel"],V("https://vercel.com/pricing")),
 e("st.mux","Mux","動画配信・字幕トラック","動画が主役（字幕は焼き込まない L33）",["要確認"]*4,"要確認","中","—","署名付き再生URL",["fe.nextjs"],U("https://www.mux.com/pricing"))]
C["email_notifications"]=[e("mail.resend","Resend","送信API（取引メール）","登録確認・通知メール",["Free：3,000通/月・100通/日・ドメイン3","—","—","Pro $20：5万通、日上限なし"],"Free は1日100通","低","SOC2 Type II・GDPR","DKIM/SPF/DMARC 込み。Webhook 署名",["fe.nextjs","auth.better-auth"],V("https://resend.com/pricing")),
 e("push.fcm","Firebase Cloud Messaging","プッシュ通知","モバイル・Web プッシュ",["無料"]*4,"—","中","同意取得","トークン管理",["fe.expo"],V("https://firebase.google.com/pricing"))]
C["analytics"]=[e("an.vercel-analytics","Vercel Web Analytics","Cookie なしの訪問分析","Vercel 上のLP",["Hobby：5万イベント/月","—","Pro アドオン $10（UTM等）","Pro：$3/10万イベント"],"—","中","Cookie同意が不要な設計（要確認）","—",["host.vercel"],V("https://vercel.com/pricing")),
 e("an.posthog","PostHog","プロダクト分析・ファネル・フラグ","使われ方を知りたい",["無料枠あり（要確認）","要確認","要確認","要確認"],"要確認","中","EU ホスト選択可（要確認）","個人情報を送らない",["fe.nextjs"],U("https://posthog.com/pricing"))]
C["ai_llm"]=[e("ai.gateway","AI Gateway（Vercel）","複数モデルの切替・フォールバック・費用監視","モデルを後から変えたい",["Hobby で利用可（トークン実費）"]*4,"—","低","モデル提供元の規約（商用・出力）","鍵をサーバー側だけに",["host.vercel"],V("https://vercel.com/pricing")),
 e("ai.firebase-ai-logic","Firebase AI Logic","アプリから Gemini を直接呼ぶ","モバイル・Firebase",["無料枠（要確認）","従量","従量","従量"],"—","中","EU AI法の透明性表示","App Check で悪用防止",["auth.firebase"],V("https://firebase.google.com/pricing"))]
C["search"]=[e("se.postgres-fts","Postgres 全文検索 / pgvector","DB内蔵の検索・ベクトル","件数が少ない〜中",["DB 料金内"]*4,"日本語の形態素は工夫が要る","低","—","—",["db.supabase","db.neon"],U("https://www.postgresql.org/docs/current/textsearch.html")),
 e("se.algolia","Algolia","ホスト型検索","ECなど検索が主役",["無料枠あり（要確認）","要確認","要確認","要確認"],"レコード数課金","高","—","検索用キーを分ける",["fe.nextjs"],U("https://www.algolia.com/pricing/"))]
C["realtime"]=[e("rt.supabase-realtime","Supabase Realtime","DB変更の購読・チャンネル","チャット・在庫表示",["Free：同時200接続、200万メッセージ","—","—","Pro：同時500、500万"],"Free は同時200","低","—","チャンネルの認可",["db.supabase"],V("https://supabase.com/pricing")),
 e("rt.firebase-rtdb","Firebase Realtime Database","リアルタイム同期DB","同時編集・プレゼンス",["Spark：同時100接続、1GB","Blaze 従量","従量","従量"],"Spark は同時100","高","—","ルールのテスト",["auth.firebase"],V("https://firebase.google.com/pricing"))]
C["ci_cd"]=[e("ci.github-actions","GitHub Actions","テスト・ビルドの自動化","全プロジェクト",["公開リポジトリ無料、非公開は無料枠（要確認）","要確認","要確認","要確認"],"分数上限","低","—","秘密は Environments に、最小権限トークン",["host.vercel"],U("https://docs.github.com/billing/managing-billing-for-github-actions")),
 e("ci.vercel-git","Vercel Git 連携","push でプレビュー・本番デプロイ","Vercel 利用時",["込み"]*4,"Hobby はビルド機が基本のみ","中","—","本番は main だけ（L30）",["host.vercel"],V("https://vercel.com/pricing"))]
C["monitoring"]=[e("mon.sentry","Sentry","エラー監視","全プロジェクト（T1+）",["無料枠あり（要確認）","要確認","要確認","要確認"],"イベント数","低","個人情報のマスク","PII を送らない設定",["fe.nextjs"],U("https://sentry.io/pricing/")),
 e("mon.crashlytics","Firebase Crashlytics","モバイルのクラッシュ監視","モバイル",["無料"]*4,"—","中","—","—",["fe.expo"],V("https://firebase.google.com/pricing")),
 e("mon.vercel-observability","Vercel Observability","関数ログ・トレース","Vercel 上",["Hobby：ログ1時間","—","—","Pro：ログ1日、Plus で30日（$1.20/100万イベント）"],"保持期間が短い","中","—","—",["host.vercel"],V("https://vercel.com/pricing"))]

# --- 2026-10-26 午後：公式ページで確認した値で上書き ---
OV={
"db.neon":dict(pricing_bands=dict(free="$0：1プロジェクト1GB（合計20GB）、100CU時間/プロジェクト、5分で自動停止、6時間の履歴",usd5="Launch 従量：$0.106/CU時間＋$0.35/GB月（最低料金なし）",usd10="同左（小規模なら$10前後、要試算）",usd100="Scale：$0.222/CU時間、SOC2・HIPAA・SLA"),limits="Free は上限到達でコンピュート停止、1GB超で書き込み不可（データは消えない）",liability_compliance="SOC2・HIPAA は Scale のみ",source=V("https://neon.com/pricing")),
"an.posthog":dict(pricing_bands=dict(free="$0：毎月 100万イベント、録画5,000、フラグ100万、エラー10万。上限で止まり課金されない",usd5="従量（カード登録）：無料枠は同じ、超えた分だけ",usd10="同左",usd100="同左。製品ごとに上限額を設定可"),limits="Free は1プロジェクト、データ保持1年",liability_compliance="US / EU（フランクフルト）を選べる。BAA は相談",source=V("https://posthog.com/pricing")),
"mon.sentry":dict(pricing_bands=dict(free="$0 Developer：1人、エラー5万/月",usd5="—",usd10="—",usd100="Team $26（人数無制限）／Business $80"),limits="無料は1ユーザーのみ",source=V("https://sentry.io/pricing/")),
"fe.expo":dict(pricing_bands=dict(free="$0：Android/iOS 各15ビルド/月、OTA更新 1,000MAU",usd5="—",usd10="—",usd100="Starter $19（ビルドクレジット$45）／Production $199"),limits="Free は低優先キュー（混雑時90分以上待ち）、ビルド45分で打ち切り",source=V("https://expo.dev/pricing")),
"st.mux":dict(pricing_bands=dict(free="従量：毎月 配信10万分 無料、エンコード無料（1080p basic）",usd5="保存 $0.003/分/月 → 約1,600分",usd10="約3,300分の保存",usd100="従量 $20クレジット込み。配信は10万分超で $0.001/分"),limits="保存は累積（消さない限り毎月増える）",source=V("https://www.mux.com/pricing")),
"se.algolia":dict(pricing_bands=dict(free="$0：検索1万回/月、5万レコード",usd5="Grow：超過 $0.50/1,000検索",usd10="同左",usd100="Grow Plus（AI機能）：$1.75/1,000検索"),limits="入力のたびに1検索として数える（インクリメンタル検索で増えやすい）",source=V("https://www.algolia.com/pricing/")),
"ci.github-actions":dict(pricing_bands=dict(free="公開リポジトリ無料。非公開は 2,000分/月（Free）",usd5="超過 Linux 2コア $0.006/分 → 約830分",usd10="約1,660分",usd100="約16,600分（macOS は $0.062/分で10倍）"),limits="支払い方法がないと上限で停止",source=V("https://docs.github.com/en/billing/concepts/product-billing/github-actions")),
"host.cloudflare-pages":dict(pricing_bands=dict(free="Workers Free：10万リクエスト/日、CPU 10ms/回。静的ファイルは無料・無制限",usd5="Workers Paid $5：1,000万リクエスト/月、転送料なし",usd10="$5＋超過 $0.30/100万リクエスト",usd100="大規模でも転送料なし（例：1億リクエストで約$45）"),limits="Free は CPU 10ms/回",source=V("https://developers.cloudflare.com/workers/platform/pricing/")),
}
AUTH_OV={
"auth.cognito":dict(pricing_bands=dict(free="Lite/Essentials：1万MAU/月まで無料（期限なし）、SAML は50MAU",usd5="Essentials：$0.015/MAU → 約330人分",usd10="約660人分",usd100="約6,600人分（Plus は無料枠なし $0.02/MAU）"),support_patch=dict(passkeys="Essentials 以上",magic_link="Essentials（メールのワンタイムコード）"),source=V("https://aws.amazon.com/cognito/pricing/")),
"auth.stytch":dict(pricing_bands=dict(free="$0：1万アクティブ、SSO/SCIM 5接続、上限で急に高くならない",usd5="超過分だけ従量",usd10="同左",usd100="ブランド変更 $99（固定）、SSO追加 $125/接続"),source=V("https://stytch.com/pricing")),
"auth.better-auth":dict(support_patch=dict(passkeys="plugin（@better-auth/passkey、確認済み）"),source=V("https://www.better-auth.com/docs/plugins/passkey")),
"auth.supabase":dict(support_patch=dict(passkeys="beta（2026-05 公開、experimental フラグが必要）"),passkey_source=V("https://supabase.com/docs/guides/auth/passkeys")),
"auth.firebase":dict(support_patch=dict(passkeys="未提供（公式の要望ページで 2027年Q1 プレビュー予定）"),passkey_source=V("https://firebase.uservoice.com/forums/948424-general/suggestions/46647016-support-authentication-with-passkeys")),
}
for k,v in C.items():
    if k=="auth":
        for p in v["providers"]:
            o=AUTH_OV.get(p["id"],{})
            for kk,vv in o.items():
                if kk=="support_patch": p["support"].update(vv)
                else: p[kk]=vv
    else:
        for en in v:
            for kk,vv in OV.get(en["id"],{}).items(): en[kk]=vv
for k,v in C.items():
    open(f"{k}.yaml","w").write(f"# Blueprint Tech Catalog — {k}\n# 提供：CREATIVITY IS EVERYWHERE, LLC ／ 価格は確認日時点。verified:false は使う前に要確認\n"+yaml.safe_dump({"domain":k,"updated":D,"stale_after_days":90,"freshness":"freshness.yaml（フィールド別TTL。stale_after_days は料金の既定値）","entries" if k!="auth" else "auth":v},allow_unicode=True,sort_keys=False,width=200))
print(len(C))

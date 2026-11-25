# B-data — database / auth / realtime / search / backup_dr audit (2026-11-23)

## How this was checked (read first)
- **WebFetch and curl could not reach any vendor host from this session.** supabase.com and firebase.google.com fail DNS in WebFetch, and curl gets `403 agent proxy: no rule or network setting allows this host`. No official page was read directly.
- All evidence below comes from **WebSearch restricted to the vendor's own domain** (allowed_domains = the official site). The quotes are the official-page snippets the search returned. Confidence is therefore at most **med** for numbers, and **high** only where several official pages agree.
- By the brief's rule, an entry whose page cannot be read stays `verified: false`. **Strictly, every `source.verified` in this group should not be re-stamped as true at 2026-11-23** until the pages are fetched with the hosts allowed: supabase.com, firebase.google.com, neon.com, clerk.com, auth0.com, stytch.com, aws.amazon.com, magic.link, better-auth.com, authjs.dev, algolia.com, developers.cloudflare.com, backblaze.com, postgresql.org.
- URLs in the `urls` section were **not resolved with curl** (blocked). Those marked (seen) appeared as live results in the official-domain search. The others follow the vendor's usual URL pattern and still need a check.

Options checked: 22 (db×3, auth×10, rt×2, se×2, bk×5). rt.ably appears in stack_comparisons but is outside this group's list, so it was not checked.

---

## db.supabase — unchanged (checked)
Free 500MB / 50k MAU / pause after 1 week / 2 active projects; Pro $25 incl. 8GB, 100k MAU, $0.00325/MAU; Team $599 with SOC2 and ISO27001, HIPAA as an add-on. All match (supabase.com/pricing via search, med).

## db.firestore
| id | field (file:key) | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| db.firestore | tactics.yaml:database.pick_when[platform:app].reason_ja | スマホアプリと相性がよく、電波が弱くても動く。 | The axis is right (offline), but "相性がよく" is vague. Supabase also has mobile SDKs. The real difference is the **built-in offline cache and automatic sync**. | 端末に一時保存して圏外でも読み書きでき、つながると自動で同期（Supabase は自前で作る）。 | firebase.google.com/docs/firestore (offline persistence is a documented Firestore feature; not re-read this session) | med |
| db.firestore | catalog/database.yaml:db.firestore.pricing_bands.free | $0（Spark）：1GiB、読み5万/日、書き2万/日 | Correct, but the free quota covers **one database per project only**, and Firestore now has Standard and Enterprise editions with different free metrics. | $0（Spark）：1GiB、読み5万/日、書き2万/日（1プロジェクト1DBのみ・Standard 版） | firebase.google.com/docs/projects/billing/firebase-pricing-plans: "the Spark plan includes 20,000 Cloud Firestore document writes and 50,000 document reads every day"; the pricing page says the free tier applies to one database per project | med |

## db.neon
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| db.neon | catalog/database.yaml:db.neon.pricing_bands.free | $0：1プロジェクト1GB（合計20GB）、100CU時間/プロジェクト、5分で自動停止、6時間の履歴 | Numbers correct. Missing the project count (now 100 on Free), which beginners compare against Supabase's 2. | $0：100プロジェクト・各1GB（合計20GB）、100CU時間/月/プロジェクト、5分で自動停止、6時間の履歴 | neon.com/docs/introduction/plans: "$0/month and includes 100 projects, 10 branches per project, 100 CU-hours of compute per project per month"; "1 GB Postgres storage per project (up to 20 GB total)" | high |
| db.neon | stack_comparisons.yaml:database.services[db.neon].free_tier | 1プロジェクト 1GB（合計 20GB）・計算 100時間/月・5分で自動停止・転送 5GB | Same point, plus the unit is CU時間 (not just 時間). Egress 5GB is per project per month. | 100プロジェクト・各 1GB（合計 20GB）・計算 100CU時間/月・5分で自動停止・転送 5GB/月 | same + "Free includes 5 GB per project per month" (egress) | high |

(Launch $0.106/CU-h, $0.35/GB-month, no minimum; Scale $0.222/CU-h: unchanged.)

---

## auth.firebase (the important change: Spark vs Blaze)
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| auth.firebase | catalog/auth.yaml:auth.providers[auth.firebase].pricing_bands.free | $0：Identity Platform 5万MAUまで無料、SMSは対象外 | **Misleading on Spark.** 50k MAU free applies on **Blaze**. On Spark, a project upgraded to Identity Platform is capped at **3,000 daily active users** (SAML/OIDC: 2 per day). Basic Firebase Auth without the upgrade has no MAU charge. | Spark：Identity Platform 有効時は1日3,000人まで／Blaze：月5万MAUまで無料。SMS は Blaze のみ | firebase.google.com/docs/auth: "when upgraded, no-cost (Spark) plan projects will be limited to 3,000 daily active users, and pay-as-you-go (Blaze) plan projects will be charged for usage beyond the free tier of 50,000 monthly active users"; docs/auth/limits: "Tier 1 Daily Active Users 3000 per day … Tier 2 … 2 per day" | high (two official pages agree) |
| auth.firebase | auth.yaml:…[auth.firebase].support.sso_saml | Identity Platform（50 MAUまで無料） | The 50 MAU free tier is on Blaze. Spark allows 2 DAU for SAML/OIDC, and SAML needs the Identity Platform upgrade. | Identity Platform が必要。Blaze で50MAUまで無料（Spark は1日2人まで） | docs/auth/web/saml: "SAML authentication is only available in upgraded projects"; docs/auth/limits Tier 2 = 2/day | med |
| auth.firebase | auth.yaml:…[auth.firebase].support.phone_sms | paid（Blaze、SMSごと課金） | Correct. Optionally add the date the rule started. | paid（2024-09 から Blaze 必須、SMSごと課金） | firebase.google.com/support/faq: "starting September 2024 … Firebase projects must be linked to a Cloud Billing account to enable and use the SMS Service" | high |
| auth.firebase | auth.yaml:…[auth.firebase].support.passkeys | 未提供（公式の要望ページで 2027年Q1 プレビュー予定） | **Conflict.** Search of the same uservoice page surfaced a Firebase PM comment (Apr 2026) saying "public preview later in Q2/early Q3" (2026). CLI v15.21.0 (2026-06-17) added mock passkeys to the Auth emulator. A later comment may have moved the date to 2027 Q1; the page could not be read. | 未提供（本番は未公開。エミュレーターのみ対応 2026-06。予定は要望ページで要確認） | firebase.uservoice.com/…/46647016 (PM comment, Apr 2026); firebase.google.com/support/release-notes/cli (v15.21.0 mock passkey support) | low |
| auth.firebase | stack_comparisons.yaml:auth.services[auth.firebase].free_tier | 月 5万人（Identity Platform）まで。電話の SMS は1通ごとに課金 | Same Spark/Blaze issue as the catalog | 無料（Spark）は Identity Platform 有効時 1日3,000人まで。Blaze で月5万人まで無料。SMS は Blaze のみ | as above | high |
| auth.firebase | stack_comparisons.yaml:auth.recommendation.rejected[auth.firebase].why | データの置き場所が Firebase の時だけ一体になる。 | Vague. Name the axis (DB choice) and the Spark cap. | DB が Firestore の時だけ一体。無料（Spark）は1日3,000人の上限があり、伸びたら Blaze へ。 | as above | high |
| auth.firebase | tactics.yaml:auth.pick_when[platform:app].reason_ja | アプリのデータ置き場と同じ所でそろう。 | OK, but it hides the Spark cap a beginner will hit. | アプリのデータ（Firestore）と同じ所でそろう。無料は1日3,000人まで、超えたら Blaze。 | as above | med |

## auth.supabase — unchanged (checked)
Free 50k MAU; Pro $25 incl. 100k MAU, $0.00325 after; SAML SSO $0.015/MAU over 50; phone MFA $75/month (first project); passkeys beta behind `experimental: { passkey: true }`. All match supabase.com pricing, billing docs and changelog (med).

## auth.clerk — unchanged (checked)
Hobby $0, 50,000 MRU (counted on return 24h+ after signup), 3 social connections, no MFA/passkeys; Pro $25 ($20 annual) with MFA, passkeys, 1 enterprise connection; extra $75. Matches clerk.com (search; plan took effect 2026-02-05). One clerk.com article claims Hobby includes 1 enterprise connection (Feb 2026), but other clerk.com sources disagree; left as is (low).

## auth.auth0
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| auth.auth0 | auth.yaml:…[auth.auth0].best_for | 企業向け要件・監査ログ・Okta 連携 | Fine. Optionally add that the free plan already includes self-service SSO and SCIM, which is the concrete B2B reason. | 企業向け（無料でも SSO 1接続・SCIM）、Okta 連携 | auth0.com/blog/auth0-b2b-plans-upgraded: "Free Self-Service SSO, SCIM"; pricing: free tier allows one enterprise connection | med |

Numbers (25k MAU free; B2C Essentials $35 for 500 MAU → $70 at 1,000; B2B Essentials $150): unchanged.

## auth.better-auth
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| auth.better-auth | auth.yaml:…[auth.better-auth].pricing_bands.usd5 / usd10 / usd100 | 同左 | Better Auth now sells an **optional** managed "Infrastructure" (dashboard, abuse protection, messaging): Starter free, Pro $20/month. The framework itself stays free. | usd5：同左／usd10：同左（任意の管理画面 Infrastructure Pro $20/月）／usd100：同左 | better-auth.com/pricing: "The Better Auth framework is free and open source"; "Infrastructure: Starter Free, Pro $20/month, Enterprise Custom". A products page shows a $299 Business tier, so the pages conflict. | med |

## auth.authjs — unchanged (checked)
"Auth.js is now part of Better Auth" (Better Auth blog 2025-09-22); new projects are pointed to Better Auth, and security fixes continue. Catalog wording matches.

## auth.stytch
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| auth.stytch | auth.yaml:…[auth.stytch].(missing) avoid_when | (none) | Missing avoid_when field | 無料の普通のログインだけで足りる時（Supabase/Firebase の方が一体） | — (editorial) | med |
| auth.stytch | auth.yaml:…[auth.stytch].(add) liability_compliance or name note | (none) | **Ownership change:** Twilio completed its acquisition of Stytch on 2025-11-14. Stytch, Inc. remains the contracted processor, and pricing is unchanged for now. | 2025-11 から Twilio 傘下（契約先は Stytch, Inc. のまま） | twilio.com/en-us/blog/company/news/twilio-to-acquire-stytch: "On November 14, we completed our acquisition of Stytch"; Stytch changelog 2025-11-14 | high |
| auth.stytch | auth.yaml:…[auth.stytch].pricing_bands.usd100 | ブランド変更 $99（固定）、SSO追加 $125/接続 | $125 per connection is confirmed for connections 6–10; above 10 is sales. The $99 branding fee was **not found** in official snippets. | SSO 6〜10接続目 $125/接続（11以上は要相談）。ブランド変更 $99 は要確認 | stytch.com/pricing: "6-10 connections: $125 per connection / month" | med (low for $99) |

Free tier (10,000 MAU, 5 SSO/SCIM connections, no cliffs): unchanged.

## auth.cognito
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| auth.cognito | auth.yaml:…[auth.cognito].(missing) avoid_when | (none) | Missing avoid_when field | AWS を使っていない時、後で他社へ移る可能性がある時（パスワードを持ち出せない） | editorial; lock_in already says hashes cannot be exported | med |

Numbers (Lite/Essentials 10k MAU free, no expiry; Essentials $0.015; Plus $0.02 with no free tier; SAML/OIDC 50 MAU): unchanged (aws.amazon.com/cognito/pricing via search, med).

## auth.magic
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| auth.magic | auth.yaml:…[auth.magic].pricing_bands.free | Developer $0：月1,000ウォレット | The free plan also caps signatures | Developer $0：月1,000ウォレット＋5万署名 | magic.link/pricing: "1,000 Monthly Active Wallets + 50,000 signatures; $0/mo" | med |
| auth.magic | auth.yaml:…[auth.magic].pricing_bands.usd100 | $99/月で 2,500人 | Plan name and overage missing | Startup $99/月：2,500ウォレット（超過 $0.04/人） | magic.link/pricing: Startup … 2,500 monthly active wallets, extra wallets $0.04 | med |

## auth.passkeys — unchanged (checked; MIT license page not re-read; low)

---

## rt.supabase-realtime
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| rt.supabase-realtime | catalog/realtime.yaml:…pricing_bands.free | Free：同時200接続、200万メッセージ | The period is missing on messages | Free：同時200接続、メッセージ 200万/月 | supabase.com/docs/guides/platform/manage-your-usage/realtime-messages | high |
| rt.supabase-realtime | …pricing_bands.usd100 | Pro：同時500、500万 | Period and overage missing, so it doesn't match stack_comparisons ("その後 1,000接続 $10") | Pro $25/月：同時500・500万/月（超過 1,000接続 $10・100万通 $2.50） | realtime-peak-connections: "$10 per 1,000 peak connections"; messages overage $2.50 per million | high |

## rt.firebase-rtdb (misleading framing)
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| rt.firebase-rtdb | tactics.yaml:realtime.pick_when[platform:app].reason_ja | アプリのデータ置き場と同じ所でそろう。 | **Wrong framing.** For apps the database pick is Firestore, and **Firestore already pushes changes live (listeners)**. Realtime Database is a *separate* database, so choosing it splits the data in two. "同じ所でそろう" is false here. | Firestore だけで変更はすぐ届く。RTDB は在席表示など低遅延が要る部分だけ別DBとして足す。 | Firestore realtime listeners are a core documented feature (firebase.google.com/docs/firestore/query-data/listen; not re-read) | high (logic) |
| rt.firebase-rtdb | catalog/realtime.yaml:rt.firebase-rtdb.what | リアルタイム同期DB | It doesn't say this is a separate DB from Firestore | Firestore とは別のリアルタイム同期DB | — | high |
| rt.firebase-rtdb | …pricing_bands.free | Spark：同時100接続、1GB | Add the monthly download allowance and Spark's hard stop | Spark：同時100接続・保存1GB・転送10GB/月（超えるとその月は停止） | firebase.google.com/docs/projects/billing/firebase-pricing-plans: "1 GB of data storage and 10 GB/month of data downloads"; "exceeding any limit in a month turns the app off"; limits: Spark 100, Blaze 200,000/DB | high |
| (topic) | tactics.yaml:realtime.options | [rt.supabase-realtime, rt.firebase-rtdb] | There is no "Firestore listeners (no extra service)" option, so app users are steered into a second DB. **Suggest adding an option** (e.g. `rt.firestore-listeners`) and making it the app pick_when. | — | — | med |

(Blaze $5/GB stored is confirmed; the $1/GB download rate appeared only on a cached copy, so it is kept but low confidence.)

---

## se.postgres-fts
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| se.postgres-fts | catalog/search.yaml:se.postgres-fts.source.note | 全文検索は PostgreSQL 18 文書 第 12 章。… | **PostgreSQL 19 was released 2026-11-19** (after the 11-03 check), so docs/current now points to 19 | 全文検索は PostgreSQL 19 文書 第 12 章（2026-11-19 公開）。… | postgresql.org/about/news/postgresql-19-released-3449/ ("PostgreSQL 19 Released!") | med-high |
| se.postgres-fts | search.yaml:se.postgres-fts.limits | 日本語の形態素は工夫が要る | Vague for non-engineers | 日本語は標準では単語に区切れない（pg_bigm・PGroonga などの拡張が要る） | — (could not verify which extensions each host offers) | low |
| se.postgres-fts | stack_comparisons.yaml:search.services[se.postgres-fts].url / checked | https://supabase.com/pricing / '2026-10-28' | Inconsistent with the catalog source (postgresql.org) and older date | https://www.postgresql.org/docs/current/textsearch.html / date of re-check | — | high |

## se.algolia
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| se.algolia | catalog/search.yaml:se.algolia.pricing_bands.free | $0：検索1万回/月、5万レコード | **Free-plan condition missing:** the "Search by Algolia" logo must be shown on the free plan. Commercial use itself is OK. | $0：検索1万回/月・5万レコード（商用可、ただし Algolia ロゴ表示が条件） | support.algolia.com "Do I need to display the Algolia logo when on a free plan?": "Yes, if you are on a Free plan." | med |
| se.algolia | search.yaml:se.algolia.pricing_bands.usd5 | Grow：超過 $0.50/1,000検索 | Record overage missing (it is in stack_comparisons) | Grow：1万回超 $0.50/1,000検索、10万件超 $0.40/1,000件 | algolia.com/pricing: "$0.50 per 1,000 search requests"; "first 100,000 records free, then $0.40 per 1,000 records" | high |

---

## bk.dump-to-r2 (misleading framing)
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| bk.dump-to-r2 | tactics.yaml:backup_dr.ai_reason_ja | どの DB でも同じ手順で費用ほぼゼロ、別の会社に置ける。付属の復元は「あれば使う」。 | **"どの DB でも" is wrong.** pg_dump works only for Postgres (Supabase/Neon). Firestore needs a managed export (to Cloud Storage) instead. | Postgres（Supabase/Neon）なら同じ手順で費用ほぼゼロ、別の会社に置ける。付属の復元は「あれば使う」。 | entry's own `what` says pg_dump | high |
| bk.dump-to-r2 | stack_comparisons.yaml:backup_dr.recommendation.reason | どの DB でも同じ手順で、費用ほぼゼロ、… | same | Postgres 系 DB なら同じ手順で、費用ほぼゼロ、… | same | high |

R2 numbers (10 GB-month, 1M Class A, 10M Class B, free egress, $0.015/GB-month): unchanged. Note: the free tier is Standard storage only, not Infrequent Access.

## bk.supabase-builtin — unchanged (checked)
Pro daily backups 7 days and Team 14 days are confirmed. The PITR $100/month figure was **not found** in official snippets (low); keep it, but re-check when supabase.com is reachable.

## bk.neon-restore
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| bk.neon-restore | backup_dr.yaml:bk.neon-restore.avoid_when | 数日前に戻したい（Free は 6 時間・履歴 1GB まで） | Neon now has **snapshots**, which are real point-in-time copies kept beyond the history window. Free 1 manual, Launch/Scale 100, $0.09/GB-month. This changes the "not a backup" framing in rejected[]. | 数日前に戻したいのに履歴だけに頼る時（長く残すならスナップショット：Free 1つ・有料100、$0.09/GB-月） | neon.com docs: "The Free plan includes 1 manual snapshot, and the Launch and Scale plans include 100. Snapshot storage is billed at $0.09/GB-month." | med |

(Launch default 1 day, max 7; Scale max 30; $0.20/GB-month; root branches only: unchanged.)

## bk.firestore-pitr
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| bk.firestore-pitr | backup_dr.yaml:…pricing_bands.usd5 | PITR の保存分（GB-月）＋復元時の読み取り。最低 1 日分は課金 | A restore price is published: backup restore is $0.20/GiB. The backup storage unit (per GiB-month vs per GiB-hour) conflicts across Google pages, so no number is proposed for storage. | PITR の保存分（GB-月）。バックアップからの復元 $0.20/GiB | cloud.google.com/firestore/pricing: "Restores are billed at $0.20 per GiB" | low-med |

## bk.backblaze-b2 — unchanged (checked)
$6.95/TB/month, first 10 GB free, egress free up to 3× storage, then $0.01/GB, and Object Lock price not listed. Matches backblaze.com/cloud-storage/pricing.

---

## pick_when rejected (lists valid when the pick_when pick wins)

**database — if platform:app → pick db.firestore**
- db.supabase: 表の集計や移行のしやすさは上だが、圏外での読み書き・自動同期は自前で作る。
- db.neon: DB だけ。ログイン・ファイル・オフライン同期を別に用意する手間が大きい。

**auth — if platform:app → pick auth.firebase**
- auth.supabase: DB が Supabase なら第一候補。Firestore と組むとユーザーが2か所に分かれる。
- auth.clerk: 画面はきれいだが、Firestore と同期の仕組みが要り、無料はパスキー・二段階認証なし。
- auth.auth0: 無料2.5万人は十分だが、有料は1,000人で $70/月と高い。
- auth.better-auth: 自分のサーバーと DB が要る。Firestore だけのアプリには合わない。
- auth.authjs: Next.js 向けで、スマホアプリのログインには向かない。
- auth.stytch: 不正対策・B2B SSO が要る時の候補。Firestore との連携は自前。
- auth.passkeys: 選ぶものではなく足すもの。Firebase はパスキー未提供なので後で足す時に検討。
- auth.magic: 暗号資産ウォレット向けの料金体系。普通のログインには合わない。

**realtime — if platform:app → pick rt.firebase-rtdb** (note: we recommend changing this pick; see rt.firebase-rtdb above)
- rt.supabase-realtime: DB が Supabase の時の選択。Firestore と組むとデータが2か所に分かれる。
- (if a Firestore-listener option is added) rt.firestore-listeners should be the pick, and rt.firebase-rtdb's line becomes: 在席表示など特に低遅延が要る部分だけ。別DBになるので最初は不要。

**backup_dr — if platform:app → pick bk.firestore-pitr**
- bk.dump-to-r2: pg_dump は Postgres 用。Firestore は使えない（書き出し先を別事業者にする時は export を自前で）。
- bk.supabase-builtin: DB が Supabase の時だけ。
- bk.neon-restore: DB が Neon の時だけ。
- bk.backblaze-b2: Firestore の定期書き出しを別事業者に置く「2つ目のコピー」として併用。

---

## urls
Verification: curl and WebFetch were blocked for all hosts, so none were resolved. (seen) = the URL was returned live by an official-domain search.

| id | site_url | start_url |
|---|---|---|
| db.supabase | https://supabase.com/database | https://supabase.com/dashboard/sign-up |
| db.firestore | https://firebase.google.com/products/firestore | https://console.firebase.google.com/ |
| db.neon | https://neon.com/ (pricing seen) | https://console.neon.tech/signup |
| auth.supabase | https://supabase.com/auth | https://supabase.com/docs/guides/auth |
| auth.firebase | https://firebase.google.com/products/auth | https://firebase.google.com/docs/auth (seen) |
| auth.clerk | https://clerk.com/ (seen) | https://dashboard.clerk.com/sign-up |
| auth.auth0 | https://auth0.com/ | https://auth0.com/signup |
| auth.better-auth | https://better-auth.com/ (seen) | https://better-auth.com/docs/installation |
| auth.authjs | https://authjs.dev/ | https://authjs.dev/getting-started/installation (seen) |
| auth.stytch | https://stytch.com/ | https://stytch.com/dashboard/start-now |
| auth.passkeys | https://simplewebauthn.dev/ | https://simplewebauthn.dev/docs/ |
| auth.magic | https://magic.link/ (seen) | https://dashboard.magic.link/signup |
| auth.cognito | https://aws.amazon.com/cognito/ | https://console.aws.amazon.com/cognito/ |
| rt.supabase-realtime | https://supabase.com/realtime | https://supabase.com/docs/guides/realtime |
| rt.firebase-rtdb | https://firebase.google.com/products/realtime-database | https://firebase.google.com/docs/database |
| se.postgres-fts | https://www.postgresql.org/docs/current/textsearch.html | https://supabase.com/docs/guides/database/full-text-search |
| se.algolia | https://www.algolia.com/ (pricing seen) | https://dashboard.algolia.com/users/sign_up |
| bk.dump-to-r2 | https://www.cloudflare.com/developer-platform/products/r2/ (seen) | https://dash.cloudflare.com/sign-up |
| bk.supabase-builtin | https://supabase.com/docs/guides/platform/backups | https://supabase.com/dashboard |
| bk.neon-restore | https://neon.com/docs/postgres/backup-restore/history-window (seen) | https://console.neon.tech/ |
| bk.firestore-pitr | https://firebase.google.com/docs/firestore/pitr (seen) | https://firebase.google.com/docs/firestore/backups |
| bk.backblaze-b2 | https://www.backblaze.com/cloud-storage | https://www.backblaze.com/sign-up/cloud-storage (seen) |

---

## could not verify
- **No official page was read directly** (network policy blocks every vendor host). All numbers are from official-domain search snippets, so keep `verified: false` until re-fetched.
- Firebase passkeys timeline: the catalog says 2027 Q1, but search shows an Apr 2026 PM comment saying Q2/early Q3 2026. Unresolved.
- Supabase PITR $100/month (7 days): not surfaced in snippets.
- Stytch "branding change $99": not surfaced.
- Firebase RTDB $1/GB download: only on a cached page copy.
- Firestore backup/PITR storage unit price: Google pages conflict (per GiB-month vs per GiB-hour).
- Algolia free records (5万 vs an older page's 1M): current page says 50K; kept.
- Better Auth Infrastructure tiers: the pricing page ($20 Pro) and products page ($299 Business) conflict.
- Japanese tokenizer extension availability (pg_bigm/PGroonga) on Supabase and Neon: not checked.
- All start_url / site_url resolution.

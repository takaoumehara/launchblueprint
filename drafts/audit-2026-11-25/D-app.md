# D-app: AI / app / frontend / i18n / ops audit (2026-11-23)

Scope: 28 options across topics ai, email, analytics, app_distribution, frontend, i18n and secrets_sharing, plus the app_distribution `policy_checks`. Sources checked: catalog files ai_llm, email_notifications, analytics, app_distribution, frontend, i18n and ops_handoff, plus `elements/stack_comparisons.yaml` and `elements/tactics.yaml`.

**How each source was checked.** This session's network allows only these hosts: vercel.com, developer.apple.com, developer.android.com, cloud.google.com and registry.npmjs.org. Pages on these hosts were read directly with WebFetch or curl. All other vendor hosts (resend.com, firebase.google.com, posthog.com, expo.dev, nextjs.org, astro.build, support.google.com, tolgee.io, crowdin.com, lokalise.com, locize.com, bitwarden.com, 1password.com, doppler.com, ai.google.dev, android-developers.googleblog.com) failed DNS resolution, so they were checked only through WebSearch restricted to the vendor's own domain. Each evidence cell marks the method:
- **[read]**: the official page was fetched and quoted.
- **[search]**: a search summary of the official page on the vendor's own domain. Confidence is capped at med. Keep `verified: false` until someone reads the page.

---

## 1. Per-option tables

### ai.gateway (Vercel AI Gateway)
| id | field (file:key) | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ai.gateway | ai_llm.yaml:pricing_bands.free | Hobby で利用可（トークン実費） | Vercel's Hobby plan is for **personal or non-commercial use only**. A beginner with `money=paid` would read this as "free for my business". | Hobby（非商用のみ）で毎月の無料クレジット（一部モデル・回数制限あり）。商用は Pro $20/月〜 | [read] vercel.com/legal/terms: "You shall only use the Services under a Hobby plan for your personal or non-commercial use." | high |
| ai.gateway | ai_llm.yaml:pricing_bands.usd5 / usd10 | Hobby で利用可（トークン実費） | Same issue. Buying credits also **ends** the monthly free credit. | クレジット購入で定価・上乗せなし。購入後は毎月の無料クレジットは終了 | [read] vercel.com/docs/ai-gateway/pricing: "Once you purchase credits, your account transitions to the paid tier and the monthly free credit no longer applies." / "AI Gateway charges no markup and no platform fee on tokens." | high |
| ai.gateway | ai_llm.yaml:pricing_bands.usd100 | Hobby で利用可（トークン実費） | Same issue. Add the Pro-only paid add-ons. | 定価・上乗せなし（Pro $20/月）。EU/US 受付固定は推論費の +5%（Pro 以上） | [read] same page: "Requests to a regional endpoint: 5% of inference cost — Pro and Enterprise" | high |
| ai.gateway | ai_llm.yaml:limits | — | Missing. | 無料は一部モデルのみ・モデルごとの回数制限（超えると429）。自分の鍵（BYOK）は有料枠から | [read] vercel.com/docs/ai-gateway/rate-limits: "Free tier: Free-tier-eligible models … Lower limit per model"; pricing: "BYOK is available on the paid tier." | high |
| ai.gateway | stack_comparisons.yaml:ai.switch_points[0].why | 有料にしても単価は同じで、使えるモデルと回数が増える。 | Leaves out that the free credit stops after a purchase. | 単価は同じで全モデル・回数制限解除。ただし購入すると毎月の無料クレジットはなくなる。 | [read] same quote as above | high |
| ai.gateway | source.url | https://vercel.com/pricing | The pricing page has no AI Gateway numbers. stack_comparisons already uses the docs page. | https://vercel.com/docs/ai-gateway/pricing | [read] vercel.com/pricing lists AI Gateway only as "Included" | high |

### ai.firebase-ai-logic
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ai.firebase-ai-logic | ai_llm.yaml:pricing_bands.free | Firebase AI Logic 自体は無料。Gemini Developer API の無料枠は課金未連携（Spark）のまま使える（枠の数値は ai.google.dev） | Leaves out the decisive commercial and privacy rules for the free tier. | AI Logic 自体は無料。Gemini 無料枠は Spark で可。ただし入力は Google の改善に使われ、EEA・スイス・英国向けアプリは有料枠のみ | [search] ai.google.dev/gemini-api/terms: "Only Paid Services may be used when making API Clients available to users in" EEA/CH/UK; for Unpaid Services Google "uses the content you submit … to … improve … products" and human reviewers may read it. [search] firebase.google.com/docs/ai-logic/pricing: free tier "you do not link your project to a Cloud Billing account … Spark" | med |
| ai.firebase-ai-logic | ai_llm.yaml:avoid_when | AI の会社をあとで切り替えたい時、ウェブ中心の時 | "ウェブ中心" is misleading because AI Logic ships a Web (JS) SDK. The real axis is that it works with Gemini/Imagen only. | Gemini 以外のモデルも使いたい時（Google のモデル専用） | [search] firebase.google.com/docs/ai-logic: SDKs for "Apple, Android, Web (JavaScript), Flutter, and Unity" | med |
| ai.firebase-ai-logic | ai_llm.yaml:liability_compliance | EU AI法の透明性表示 | Add the free-tier data-use rule. | EU AI法の透明性表示。無料枠は入力が学習・人の確認に使われ得る（個人情報を送らない） | [search] ai.google.dev/gemini-api/terms (see above) | med |
| ai.firebase-ai-logic | stack_comparisons.yaml:ai.services[ai.firebase-ai-logic].url | https://firebase.google.com/pricing | Inconsistent with the catalog's source URL. | https://firebase.google.com/docs/ai-logic/pricing | — | high |
| ai.firebase-ai-logic | stack_comparisons.yaml:ai.recommendation.rejected[ai.firebase-ai-logic].why | スマホアプリから直接呼ぶなら候補。ウェブ中心なら不要。 | Vague framing (web vs app). | Gemini 専用で会社を切り替えにくい。ウェブはサーバーから呼べば鍵を守れる。 | as above | med |
| ai.firebase-ai-logic | note only | — | Google renamed Vertex AI. Firebase docs now say "Agent Platform Gemini API (formerly Vertex AI)" and cloud.google.com/vertex-ai redirects to /products/gemini-enterprise-agent-platform. Use the new name if Vertex is mentioned anywhere. | — | [read] curl: 301 to cloud.google.com/products/gemini-enterprise-agent-platform | high |

### mail.resend
Unchanged (checked). Free: 3,000/月・100/日・3 domains. Pro: $20/月, 50,000 emails, no daily limit. SOC 2 Type II. Marketing free: 1,000 contacts. All agree with the catalog and stack_comparisons. Evidence: [search] resend.com/pricing, resend.com/security/soc-2. Confidence med because the page could not be read directly. Optional improvement:
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| mail.resend | tactics.yaml:email.ai_reason_ja | 送るのが簡単で、迷惑メールに入りにくい設定を案内してくれる。 | Vague: names no number and no decision axis. | 無料で月3,000通（1日100通まで）。超えたら Pro $20/月。ドメイン認証の設定が簡単。 | [search] resend.com/pricing | med |

### push.fcm
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| push.fcm | email_notifications.yaml:limits | — | FCM itself is free, but iPhone delivery needs Apple's paid program plus an APNs key. Beginners miss this cost. | 送信は無料。iPhone へ送るには Apple Developer Program（99 USD/年）と APNs 鍵が要る | [read] developer.apple.com/programs/enroll: "99 USD per membership year"; [search] firebase.google.com/pricing: Cloud Messaging is no-cost on Spark and Blaze | med |
The price fields are unchanged (free on both plans).

### an.vercel-analytics
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| an.vercel-analytics | analytics.yaml:pricing_bands.free | Hobby：5万イベント/月 | Hobby is non-commercial only. It also keeps only 1 month of data and has no custom events. | Hobby（非商用のみ）：5万イベント/月・データ1か月・超えると計測停止 | [read] vercel.com/docs/analytics/limits-and-pricing: "50,000 events / month included … Reporting Window 1 Month … Custom Events -"; terms quote above | high |
| an.vercel-analytics | analytics.yaml:pricing_bands.usd10 | Pro アドオン $10（UTM等） | The add-on needs Pro ($20/月) first, so the real entry cost is $30. The add-on's name is Web Analytics Plus. | Pro $20/月＋Web Analytics Plus $10/月（UTM・24か月保存） | [read] same page: "Web Analytics Plus add-on for an additional $10/month per team"; "UTM Parameters … Included"; "Reporting Window … 24 Months". vercel.com/docs/plans/pro-plan: "$20/month Pro platform fee" | high |
| an.vercel-analytics | analytics.yaml:pricing_bands.usd100 | Pro：$3/10万イベント | OK, but Pro has no free event allowance. Events come out of the $20 monthly credit. | Pro：$3/10万イベント（無料分なし。月 $20 のクレジットから消化） | [read] limits-and-pricing: Pro "Included Events: None … $0.03 per 1K events"; pro-plan: "Every Pro plan has $20 in monthly credit." | high |
| an.vercel-analytics | stack_comparisons.yaml:analytics.services[an.vercel-analytics].paid_entry | Pro アドオン $10/月（UTM 等）、超過 $3/10 万イベント | "超過" is wrong because Pro includes no events. Same $20 + $10 point as above. | Pro $20/月で $3/10万イベント（無料分なし）。UTM は Web Analytics Plus $10/月 | as above | high |
| an.vercel-analytics | stack_comparisons.yaml:analytics.combine.combined | LP は Vercel Web Analytics（Cookie なし・同意前でも可）… | "同意前でも可" contradicts the catalog's own liability note ("公式に「不要」の記載はない"). PostHog also has a cookieless mode, so the cookie point does not separate the two products. | LP は Vercel Web Analytics（Cookie なし・設定が少ない）、アプリ内は PostHog、と分ける。 | catalog analytics.yaml:liability_compliance; [search] posthog.com/tutorials/cookieless-tracking: `cookieless_mode: "always"` "doesn't require a cookie banner" | med |
| an.vercel-analytics | stack_comparisons.yaml:analytics.recommendation.rejected[an.vercel-analytics].why | 訪問数だけで足りる小さな紹介ページ向け。使われ方（ファネル・録画）は見られない。 | Fine, but the commercial-use rule is the decisive axis for `money=paid`. | 訪問数だけで足りる紹介ページ向け。ファネル・録画は無く、無料の Hobby は非商用のみ。 | terms quote | high |

### an.posthog
Unchanged in substance (checked). Free tier: 1M events, 5,000 recordings, 1M flag requests, 100K exceptions, 1 project, 1-year retention. Usage stops at the limit with no billing. Evidence: [search] posthog.com/pricing, us.posthog.com/signup ("1 project, and 1-year data retention"). The page itself still could not be read, so keep the existing note. Optional framing fix:
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| an.posthog | analytics.yaml:liability_compliance | US / EU（フランクフルト）を選べる。BAA は相談 | Add that the Cookie / consent difference with Vercel can be closed. | US / EU（フランクフルト）を選べる。Cookie なし計測モードあり（録画・アンケートは止まる）。BAA は相談 | [search] posthog.com/tutorials/cookieless-tracking: in "always" mode "session replay and surveys are off" | med |

### dist.pwa
Unchanged (checked). [read] Apple guideline 4.2: "Your app should include features, content, and UI that elevate it beyond a repackaged website." The guidelines were last updated 2026-10-16.

### dist.twa
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| dist.twa | app_distribution.yaml:depends_on | [dist.pwa, Digital Asset Links, Play Console組織アカウント, Android開発者本人確認] | Does not say why an organization account matters. A **personal** account created after 2023-11-13 needs a closed test (12 testers for 14 days) before production. Beginners usually sign up as individuals. | [dist.pwa, Digital Asset Links, Play Console（個人は本番前に12人×14日のテスト必須。組織なら不要）, Android開発者本人確認] | [search] support.google.com/googleplay/android-developer/answer/14151465: "personal accounts created after November 13, 2023, must run a closed test … minimum of 12 testers … opted in continuously for at least 14 days" | med |
| dist.twa | app_distribution.yaml:store_billing | ウェブ画面＝アプリ内扱い。デジタル課金はPlay課金、またはTWA内で課金導線を隠す | Outdated for US/EEA/UK. Google now runs alternative billing and external-link programs there, with service fees that still apply. | ウェブ画面＝アプリ内扱い。原則 Play 課金。米国・EEA・英国は登録制で外部リンク／代替決済も可（手数料は残る）。他地域は導線を隠す | [search] support.google.com/googleplay/android-developer/answer/15582165 and /16470497 (US programs launched 2025-12-09); android-developers.googleblog.com/2026/06/play-expanded-billing.html: from 2026-06-30 in US/EEA/UK the service fee applies "whether a developer uses Google Play Billing, alternative billing, or external web links", and the billing fee is 5% | med |
| dist.twa | stack_comparisons.yaml:app_distribution.services[dist.twa].url | https://support.google.com/googleplay/android-developer/answer/6112435 | Inconsistent with the catalog (answer/113468). | Use one URL for both: answer/6112435 ("Get started with Play Console", where the $25 fee appears in search results) | [search] support.google.com/googleplay/android-developer/answer/6112435: "US$25 one-time registration fee" | med |
The $25 one-time fee is unchanged ([search]).

### dist.capacitor
Unchanged (checked). [read] developer.apple.com/programs/enroll: "99 USD per membership year. Prices may vary by region …"; fee waiver for nonprofits, accredited education and government; D-U-N-S required "excluding government entities". The current version is Capacitor 8 (npm @capacitor/core 8.6.2, MIT). Optional: the best_for text could mention that iOS builds need Xcode on a Mac, because Capacitor 8 needs Xcode 26 ([search] capacitorjs.com/docs/getting-started). Low priority.

### dist.expo
Unchanged (checked). Free: 15 Android + 15 iOS builds, low-priority queue, 1,000 MAU updates. Starter: $19 with $45 credit. Production: $199 with $225 credit. Evidence: [search] expo.dev/pricing, docs.expo.dev/billing/plans.

### dist.native
Unchanged (checked). It stays `verified: false` because the main cost is development, not a published price. The store fees in its note match the official values (Apple 99 USD/yr [read], Play US$25 one-time [search]).

### app_distribution policy_checks (not in the option list, but in the catalog file and they drive `store_billing`)
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| policy.google.payments | rule | アプリ内のデジタル機能・サブスクの支払いは Google Play 課金必須（…）。アプリ内のリンク・ボタン・WebView・登録フローで他の支払いへ誘導しない | Outdated for the US (external content links and alternative billing programs since 2025-12-09; download/fee reporting due by 2027-02-01) and for EEA/UK (billing choice, fees split from 2026-06-30). The Epic settlement of 2026-03-04 is still being implemented. | 原則 Play 課金。米国・EEA・英国は登録制の外部リンク／代替決済プログラムで他の支払いへ誘導可（サービス手数料は残る）。未登録・他地域では誘導しない | [search] support.google.com/googleplay/android-developer/answer/15582165, /16470497, /16787536, /16954621; android-developers.googleblog.com/2026/06/play-expanded-billing.html | med (re-read pages once the hosts are reachable; set checked date) |
| policy.apple.3_1_1a | rule (add a Japan line) | 米国ストアでは…entitlement 不要。その他の地域は StoreKit External Purchase Link Entitlement を申請 | Still true, but `country=jp` users need the Japan specifics under the MSCA (iOS 26.2+): link-out commission 15% (10% for the Small Business Program and for subscriptions after year 1), in-app alternative payment allowed only if IAP is shown alongside, commission 21%. | （追記）日本：外部購入リンクは手数料15%（小規模事業者10%）、アプリ内の代替決済は IAP と並べて表示が条件 | [read] developer.apple.com/support/app-distribution-in-japan: "15% Out-of-app offers"; "10% … App Store Small Business Program …"; "you're required to also present Apple In-App Purchase as an option at the same time" | high |

### fe.nextjs
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| fe.nextjs | frontend.yaml:lock_in | 中：Vercel 固有機能を使うほど移行が重い | Still true, but since Next.js 16.2 there is a stable official Adapter API built with OpenNext, Netlify, Cloudflare, AWS Amplify and Google Cloud. The decisive point is host support for ISR and image optimization. | 中：ISR・画像最適化などはホストの対応次第。16.2 で公式アダプタ API が安定し、他ホストへの移行は軽くなりつつある | [search] nextjs.org/blog/next-16-2, nextjs.org/blog/nextjs-across-platforms, nextjs.org/docs/app/api-reference/config/next-config-js/adapterPath | med |
| fe.nextjs | source.note | MIT（license.md を 2026-11-02 確認） | Version reference only. | MIT（npm next 16.4.6、2026-11-23 確認） | [read] registry.npmjs.org/next/latest: version 16.4.6, license MIT | high |
| fe.nextjs | stack_comparisons.yaml:frontend.services[fe.nextjs].free_tier / paid_entry | 無料（オープンソース）。公開先の無料枠に従う／ホスティング側の料金（例：Vercel Pro $20/月） | Add the commercial rule, which is the trap for Vercel's free tier. | 無料（オープンソース）。公開先の無料枠に従う（Vercel の Hobby は非商用のみ）／商用は Vercel Pro $20/月 など | [read] vercel.com/legal/terms (quote above) | high |
Ownership: no change. Next.js is still maintained by Vercel.

### fe.astro (misleading framing + ownership change)
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| fe.astro | frontend.yaml:what | コンテンツ中心の静的サイト生成 | This is the "static only" dichotomy. Astro also renders on demand (SSR) through official adapters for Node, Vercel, Netlify and Cloudflare, and supports sessions and Actions. | コンテンツ中心のサイト向け。静的出力が基本、アダプタでサーバー処理（SSR）も可 | [search] docs.astro.build/en/guides/on-demand-rendering: "To render any page on demand, you need to add an adapter. Astro maintains official adapters for Node.js, Netlify, Vercel, and Cloudflare" | high |
| fe.astro | frontend.yaml:avoid_when | ログイン後のアプリ本体 | Login is possible. The real trade-off is that interactive screens need React (or similar) islands, and auth/payment examples are fewer. | ログイン後の対話画面が中心のアプリ（画面ごとに React 等の部品が要り、Next.js の方が素直） | as above; docs.astro.build/en/guides/sessions, /actions | med |
| fe.astro | frontend.yaml:limits | 重い対話UIには不向き | Same issue. | 対話部分は React 等の「アイランド」で書く。ページ単位で静的か SSR を選ぶ | as above | med |
| fe.astro | frontend.yaml:lock_in | 低 | Ownership change: The Astro Technology Company joined **Cloudflare** in January 2026. Astro stays MIT, and the team says it will keep supporting other hosts. | 低（2026-01 から Cloudflare 傘下。MIT のまま、他ホスト対応も継続と公式表明） | [search] astro.build/blog/joining-cloudflare, blog.cloudflare.com/astro-joins-cloudflare (2026-01-16): all full-time staff are now Cloudflare employees; Astro remains MIT-licensed and platform-neutral | med |
| fe.astro | source.note | MIT（LICENSE を 2026-11-02 確認） | Version reference only. | MIT（npm astro 7.4.13、2026-11-23 確認） | [read] registry.npmjs.org/astro/latest | high |
| fe.astro | stack_comparisons.yaml:frontend.recommendation.rejected[fe.astro].why | 文章中心のサイトには最適だが、ログインや決済のある画面には向かない。 | Misleading: login and payments can run on Astro SSR. | 文章中心なら最適。ログイン後の対話画面が多いと部品が増え、AI の作例も Next.js より少ない。 | as above | med |
| fe.astro | stack_comparisons.yaml:frontend.services[fe.astro].url | https://www.cloudflare.com/plans/developer-platform/ | This is a hosting price page, not Astro's page. | https://docs.astro.build/en/guides/deploy/ (or keep, now that Cloudflare owns Astro) | — | low |

### fe.expo
Unchanged (checked). Same numbers as dist.expo. Current version: expo 58.0.26 (MIT). The figure "混雑時90分以上待ち" in limits could not be confirmed. The official pages only say "low priority", plus a 45-minute build timeout on Free ([search] expo.dev/pricing). Suggested text: `limits: Free は低優先キュー（待ち時間は混雑次第）、ビルド45分で打ち切り`. Confidence low.

### i18n.next-intl / i18n.formatjs / i18n.lingui / i18n.lint-i18next / i18n.lint-formatjs
No content changes; licenses are unchanged. Only the version notes in `source.note` are stale ([read] registry.npmjs.org, 2026-11-23):
| id | field | current text | proposed text |
|---|---|---|---|
| i18n.next-intl | i18n.yaml:source.note | v4.14.9 MIT | v4.16.0 MIT |
| i18n.formatjs | i18n.yaml:source.note | v12.1.6 BSD-3-Clause | v12.2.1 BSD-3-Clause |
| i18n.lingui | i18n.yaml:source.note | v6.11.0 MIT | v6.12.0 MIT |
| i18n.lint-i18next | — | v6.1.5 ISC | unchanged |
| i18n.lint-formatjs | i18n.yaml:source.note | v8.1.2 MIT | v8.1.4 MIT |

### i18n.i18next
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| i18n.i18next | i18n.yaml:source.note | i18next 26.5.12 / react-i18next 17.1.9 MIT | Both packages had major version bumps. | i18next 27.2.6 / react-i18next 18.0.3 MIT（2026-11-23） | [read] registry.npmjs.org | high |
| i18n.i18next | i18n.yaml:pricing_bands.free / usd5 | Locize Free：2,000語・2言語・1人 / Starter $7/月：1.5万語・5言語・5人 | Unchanged. Starter's 5 users appears in only one source. | — | [search] locize.com/blog/new-pricing-plans | med |

### i18n.paraglide
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| i18n.paraglide | i18n.yaml:source.note | v2.29.3 MIT | Major version jump to v3. | v3.2.2 MIT（2026-11-23）。公式サイトは paraglidejs.com | [read] registry.npmjs.org/@inlang/paraglide-js/latest: 3.2.2, MIT, homepage https://paraglidejs.com | high |
| i18n.paraglide | i18n.yaml:avoid_when | 実績や情報量を重視（比較的新しい） | OK. | unchanged | — | — |

### i18n.tms-tolgee
Unchanged (checked). Cloud free: 3 seats, 30,000 hosted words (counted as words × languages), plus 10,000 machine-translation credits. Translate: €58/月 billed annually, unlimited seats. Evidence: [search] docs.tolgee.io/platform, tolgee.io/tolgee-vs-crowdin. Confidence med because the pricing page itself was not read.

### i18n.tms-crowdin
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| i18n.tms-crowdin | i18n.yaml:pricing_bands.usd100 | 公式の比較ページに「$50/月から」（2026-08 時点表記）… | Crowdin's own comparison page now shows a different starting price. Still unverified on the pricing page, and the structured data says organization plans are "Annual billing only". | 公式の比較ページに「$75/月から（Pro）」（2026-11 時点表記）、Team は $150〜$179/月で表記が揺れる。料金ページ本文は未確認 | [search] crowdin.com/alternatives/lokalise-alternative (Nov 2026): "starts at $75/month"; crowdin.com/pricing structured data "Pro $75.00" | low |
The entry stays `verified: false`.

### i18n.tms-lokalise
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| i18n.tms-lokalise | i18n.yaml:pricing_bands.usd100 | Explorer $149/月／Growth $379／Advanced $1,049（月払い表示。年払い額はページに無し） | Likely wrong billing label. The pricing page shows these as **annual-billing** prices, and its structured data gives month-to-month prices of $169 (Explorer) and $439 (Growth). | Explorer $149/月（年払い。月払い $169）／Growth $379（月払い $439）／Advanced $1,049（年払い） | [search] lokalise.com/pricing: "Explorer is $149/mo with annual billing … month-to-month rates of $169 for Explorer and $439 for Growth" | med (re-read the page; this contradicts the 2026-11-02 reading) |
| i18n.tms-lokalise | stack_comparisons.yaml:i18n.services[i18n.tms-lokalise].paid_entry | Explorer $149/月（月払い表示）… | Same issue. | Explorer $149/月（年払い）・月払い $169 | as above | med |

### ho.bitwarden (factual error: free sharing exists)
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ho.bitwarden | ops_handoff.yaml:limits | 共有は Families か Teams から | Wrong. A **free organization** lets 2 users share items in up to 2 collections. | 2人までなら無料の組織で共有可（コレクション2つまで）。3人以上は Families か Teams | [search] bitwarden.com/help/password-manager-plans: "Free organizations offer both users all the core features of Password Manager and secure data sharing in up to two collections"; "Maximum users: Free org 2, Families org 6" | med-high |
| ho.bitwarden | ops_handoff.yaml:pricing_bands.free | 個人：無料（端末・件数無制限） | Add the free 2-person organization. | 個人：無料（端末・件数無制限）。2人の共有組織も無料（コレクション2つ） | as above | med-high |
| ho.bitwarden | ops_handoff.yaml:best_for | 1〜2 人で無料から始め、人が増えたら $4/人 | OK, and now consistent with the fix above. | unchanged | — | — |
| ho.bitwarden | stack_comparisons.yaml:secrets_sharing.services[ho.bitwarden].free_tier | 個人は無料。共有は Families $3.99/月（6 人） | Same error. | 個人は無料。2人までの共有も無料（コレクション2つ）。3〜6人は Families $3.99/月 | as above | med-high |
| ho.bitwarden | stack_comparisons.yaml:secrets_sharing.switch_points[0] | when: 2 人目が運用に入る / upgrade_to: Families $3.99/月 か Teams $4/人 / why: 共有は有料プランから。… | The "why" is wrong. | when: 3 人目が入る、または共有フォルダが3つ以上要る / upgrade_to: Bitwarden Families $3.99/月 か Teams $4/人 / why: 無料の共有は2人・コレクション2つまで。個人アカウントの貸し借りはしない。 | as above | med-high |
| ho.bitwarden | stack_comparisons.yaml:secrets_sharing.recommendation.reason | 個人は無料、共有も $3.99/月から。… | Same error. | 個人も2人の共有も無料、3人目から $3.99/月。オープンソースで書き出し可、会社名義の金庫を初日から作れる。アプリの鍵はホストの環境変数（Secret 型）に置き、控えだけ金庫へ。 | as above | med-high |
| ho.bitwarden | tactics.yaml:secrets_sharing.ai_reason_ja | 個人は無料、共有も月 $3.99 から。… | Same error. | 個人も2人での共有も無料、3人目から月 $3.99。会社名義の金庫を初日から作れる。アプリの鍵はホストの環境変数に置き、控えだけ金庫へ。 | as above | med-high |
Paid prices are unchanged: Families $3.99/月 (6 people, $47.88/年), Teams $4/人/月 billed annually (monthly billing also offered), Enterprise $6/人/月, Secrets Manager $6/人 on Teams and $12/人 on Enterprise. Evidence: [search] bitwarden.com/pricing/business, /help/secrets-manager-faqs.

### ho.1password
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ho.1password | ops_handoff.yaml:pricing_bands.usd5 | …Teams Starter Pack $24.95/月（10 人まで。追加 $4.99/席） | Missing the 20-person cap. | …Teams Starter Pack $24.95/月（10 人まで。追加 $4.99/席・最大 20 人） | [search] 1password.com/pricing/business: "Extra seats cost $4.99 per seat per month on annual billing, which allows up to 20 members total" | med |
| ho.1password | source.url (catalog + stack_comparisons) | https://1password.com/business-pricing | The canonical URL is now /pricing/business. | https://1password.com/pricing/business | [search] result title "Business & Teams Pricing & Plans" at that URL | med |
Prices are unchanged: Business $8.99/人/月, Individual $3.99, Families $5.99.

### ho.doppler
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ho.doppler | ops_handoff.yaml:pricing_bands.free / limits | Developer：3 人まで無料（…）／無料は 3 人・ログ 3 日 | The user cap is unclear. The pricing page says "Free for 3 users, $8/mo per additional user". The newer Platform Limits doc lists Developer "Users 25". The likely reading is 3 free users, paid seats up to 25, but neither page was read. | Developer：3 人まで無料、追加 $8/人/月（上限 25 人と思われる・要確認）／ログ 3 日 | [search] doppler.com/pricing; docs.doppler.com/docs/platform-limits ("Developer … Users 25, Projects 10, Environments per Project 4 … Logs 3 days") | low |
Team $21/人/月 is unchanged.

### ho.host-env-vars
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| ho.host-env-vars | ops_handoff.yaml:limits | 1 デプロイ 64KB まで | Correct. Add the edge-runtime limit. | 1 デプロイ合計 64KB まで（edge ランタイムは 1 変数 5KB） | [read] vercel.com/docs/environment-variables: "a total of 64 KB … per-Deployment"; "edge runtime are limited to 5KB per Environment Variable" | high |
The Config/Secret naming is confirmed: "Secret values are write-only after saving" [read].

---

## 2. pick_when rejected lists (for when the pick_when pick wins)

**app_distribution: if platform=app → dist.expo**
- dist.pwa: アプリ必須ならストアに出ない。iPhone の通知はホーム画面追加が前提。
- dist.twa: Android だけ。iPhone に出せない。
- dist.capacitor: 包むウェブのコードがまだ無いなら利点が薄い。4.2 で却下されやすい。
- dist.native: iPhone 用と Android 用を2回作る。OS 機能が中核の時だけ。

**frontend: if platform=app → fe.expo**
- fe.nextjs: ウェブ用。アプリ必須なら Expo が本体、LP や管理画面が要る時に足す。
- fe.astro: 紹介ページ・文章向け。スマホアプリは作れない。

**ai: if platform=app → ai.firebase-ai-logic**
- ai.gateway: 鍵をサーバーに置く仕組みで、アプリから直接は呼べない（間にサーバーが要る）。Hobby は非商用のみ。
- ai.direct: 鍵をアプリに埋めると抜かれる。守るにはサーバーを自前で用意する。
- Note for this rule's reason_ja: Gemini 専用。無料枠は入力が Google の改善に使われ、EEA・英国向けは有料枠のみ.

**i18n: if platform=app → i18n.i18next**
- i18n.next-intl: Next.js 専用で、Expo（React Native）では使えない。
- i18n.formatjs: アプリでも使えるが書き方が冗長。ICU を厳密に使う大規模向け。
- i18n.lingui: アプリでも使えるが、抽出・コンパイルの手順が増える。
- i18n.paraglide: Vite/ウェブ中心で、アプリでの実績・情報が少ない。
- i18n.tms-lokalise / i18n.tms-crowdin: same as the default list (翻訳管理は翻訳者が入ってから).

**Suggested new rule (optional).** Add `if: {money: paid}` (and `marketplace`) to the ai and analytics topics. Its reason_ja would be: Vercel の Hobby は非商用のみ。AI Gateway／Web Analytics を商用で使うなら Pro $20/月が前提. The pick does not change. Only the cost text changes.

---

## 3. urls
Verification codes: "curl 200" means fetched from this session. "search" means the URL appeared on the vendor's own domain in search results (the host is blocked here, so it was not fetched).

| id | site_url | start_url | verified |
|---|---|---|---|
| ai.gateway | https://vercel.com/ai-gateway | https://vercel.com/docs/ai-gateway/getting-started | curl 200 / curl 200 |
| ai.firebase-ai-logic | https://firebase.google.com/docs/ai-logic | https://firebase.google.com/docs/ai-logic/get-started | search / search |
| mail.resend | https://resend.com/ | https://resend.com/signup | search / search |
| push.fcm | https://firebase.google.com/products/cloud-messaging | https://firebase.google.com/docs/cloud-messaging | search / not verified (blocked) |
| an.posthog | https://posthog.com/ | https://us.posthog.com/signup | search / search |
| an.vercel-analytics | https://vercel.com/docs/analytics | https://vercel.com/docs/analytics/quickstart | curl 200 / curl 200 (note: vercel.com/analytics now redirects to /products/observability) |
| dist.pwa | https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps | https://web.dev/learn/pwa | not verified (both hosts blocked) |
| dist.twa | https://developer.android.com/develop/ui/views/layout/webapps/trusted-web-activities | https://play.google.com/console/signup | curl 200 / not verified (blocked) |
| dist.capacitor | https://capacitorjs.com/ | https://capacitorjs.com/docs/getting-started | search / search |
| dist.expo | https://expo.dev/eas | https://docs.expo.dev/build/setup/ | not verified / search |
| dist.native | https://developer.apple.com/xcode/ ・ https://developer.android.com/studio | https://developer.apple.com/programs/enroll/ ・ https://play.google.com/console/signup | curl 200 ×3 / Play not verified |
| fe.nextjs | https://nextjs.org/ | https://nextjs.org/docs/app/getting-started/installation | search / search |
| fe.astro | https://astro.build/ | https://docs.astro.build/en/install-and-setup/ | search / search |
| fe.expo | https://expo.dev/ | https://docs.expo.dev/get-started/create-a-project/ | search / search |
| i18n.next-intl | https://next-intl.dev/ | https://next-intl.dev/docs/getting-started | npm homepage / not verified |
| i18n.i18next | https://www.i18next.com/ | https://react.i18next.com/getting-started | npm homepage / not verified |
| i18n.formatjs | https://formatjs.github.io/ | https://formatjs.github.io/docs/react-intl | npm homepage / npm homepage |
| i18n.lingui | https://lingui.dev/ | https://lingui.dev/installation | npm homepage / not verified |
| i18n.paraglide | https://paraglidejs.com/ | https://paraglidejs.com/basics | npm homepage / search |
| i18n.lint-i18next | https://github.com/edvardchen/eslint-plugin-i18next | same (README) | npm homepage (GitHub blocked here) |
| i18n.lint-formatjs | https://formatjs.github.io/docs/tooling/linter | same | not verified |
| i18n.tms-tolgee | https://tolgee.io/ | https://app.tolgee.io/sign_up | search / not verified |
| i18n.tms-crowdin | https://crowdin.com/ | https://accounts.crowdin.com/register | search / search |
| i18n.tms-lokalise | https://lokalise.com/ | https://lokalise.com/pricing/ (14日試用の開始ボタン) | search / search |
| ho.bitwarden | https://bitwarden.com/ | https://vault.bitwarden.com/#/register | search / not verified |
| ho.1password | https://1password.com/ | https://1password.com/pricing/business (「Try free for 14 days」) | search / search |
| ho.doppler | https://www.doppler.com/ | https://dashboard.doppler.com/ (Sign up) | search / search |
| ho.host-env-vars | https://vercel.com/docs/environment-variables | https://vercel.com/docs/environment-variables/managing-environment-variables | curl 200 / curl 200 |

---

## 4. Could not verify
- **Direct page reads were impossible** for every non-Vercel/Apple/Android host because the session network blocks them. All [search] rows are med confidence at most and need a direct read before `verified: true` or a new `checked` date: Resend, Firebase (AI Logic, FCM), PostHog, Expo, Next.js, Astro, Google Play help pages, Tolgee, Crowdin, Lokalise, Locize, Bitwarden, 1Password, Doppler, Gemini API terms.
- **Lokalise:** annual vs monthly billing for the $149 / $379 / $1,049 prices. This contradicts the 2026-11-02 reading.
- **Crowdin:** all paid prices ($75 / $150 / $179 / $450 appear in different places). Keep `verified: false`.
- **Doppler:** whether the Developer plan allows 3 or 25 users.
- **Google Play payments policy:** the exact current US status after the 2026-03-04 Epic settlement, and whether Japan has opened external links or alternative billing (only the fee split for 2026-09-30 was found).
- **Expo:** the "混雑時90分以上待ち" figure.
- **Vercel AI Gateway:** the dollar amount of the free credit, which no official page states.
- **Paraglide 3.x:** whether the major version changed setup or framework support. Only the version and license were checked.

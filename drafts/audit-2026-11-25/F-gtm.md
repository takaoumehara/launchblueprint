# F-gtm — audit of go-to-market / support / legal / exit / pricing / build-vs-buy

Checked 2026-11-23. 38 options in 6 catalog files (gtm_channels, support, legal_terms, exit_tools, pricing, build_vs_buy), plus their entries in stack_comparisons.yaml and tactics.yaml.

**Method limitation (important):** this sandbox could not reach any vendor host. WebFetch failed with ENOTFOUND for acquire.com, flippa.com, termly.io, getterms.io, termageddon.com and iubenda.com, and `curl` returned 000 for every other URL (stripe, producthunt, HN, helpscout, crisp, instatus, mintlify, rewardful, circle, prtimes, paddle, x, facebook, google, apptweak, ahrefs, fossa). The only evidence available was the WebSearch tool, run with `allowed_domains` set to each vendor's own domain. So every quote below is a search-index snippet of the **official** page, not a page I opened myself. Confidence is capped at **med** for that reason. Nothing here should flip `verified` to true until someone reads the page directly. URL resolution could not be tested either (see the urls section).

---

## gtm_channels

### gtm.x
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| gtm_channels.yaml:gtm.x.pricing_bands.usd100 | 広告は入札制（公式ヘルプでは最低出稿額なし・日額上限を自分で設定。料金ページは自動取得で読めず未確認） | The official help page states there is no minimum, so the "未確認" caveat can go and the source can move to the help page | 広告は入札制。最低出稿額なし・日額予算は自分で決め、超えない（最低入札 $0.01） | help.x.com/en/business-and-advertising/ads-pricing: "There is no minimum spend required for X Ads"; business.x.com/en/help/campaign-setup/campaigns-101: "You choose a daily budget … we will never go over this amount"; bidding FAQ: minimum bid $0.01 | med |
| gtm_channels.yaml:gtm.x.source.url | https://business.x.com/ | The page that states the fact is the help article | https://help.x.com/en/business-and-advertising/ads-pricing | as above | med |
| gtm_channels.yaml:gtm.x.avoid_when | 実名を出せない場合（会社アカウントで運用） | Contradictory: it says to avoid X, then says to run it on a company account. A beginner can't tell whether to use X or not | 発信を続ける人がいない、または利用者が X にいない（国内の非IT層など） | — (framing) | med |
| stack_comparisons.yaml:launch_channels/gtm.x.paid_entry, checked | 広告は入札制（最低額は未確認） / '2026-11-02' | Out of sync with the catalog (catalog checked 11-03, and it already notes "no minimum") | 広告は入札制・最低出稿額なし（日額上限を自分で設定） / checked = the catalog date | as above | med |

### gtm.ads.meta
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| gtm_channels.yaml:gtm.ads.meta.pricing_bands.usd5 | 1日$5程度から試せる（要確認） | Official numbers now found | 最低 $1/日（表示課金の場合）。公式は $5 以上・6 日以上を推奨 | facebook.com/business/help/203183363050448: "allocate at least USD 1 per day for daily budgets" (impression-charged); facebook.com/business/ads/pricing: "starting with at least $5 … duration over six days" | med |
| gtm_channels.yaml:gtm.ads.meta.source.url / note | https://www.facebook.com/business/ads / 公式ページで金額が読めず… | Point to the help page that gives the number | https://www.facebook.com/business/help/203183363050448 | as above | med |
| stack_comparisons.yaml:growth_channels/gtm.ads.meta.paid_entry, checked | 1 日 $5 程度から（最低額は未確認） / '2026-10-26' | Same issue as above, and the date is out of sync | 最低 $1/日（推奨 $5 以上・6 日以上） / the catalog date | as above | med |

### gtm.ads.google
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| gtm_channels.yaml:gtm.ads.google.pricing_bands.usd5 | 少額可（要確認） | Vague. The official help documents how the budget works and states no minimum | 最低額の記載なし。1日の平均予算を自分で決める（1日は最大2倍・月は平均予算×30.4が上限） | support.google.com/google-ads/answer/2375420: "Your campaign spend will never exceed 2 times your average daily budget on a given day"; monthly limit "30.4 times your average daily budget" | med |
| gtm_channels.yaml:gtm.ads.google.source.url | https://business.google.com/us/google-ads/ | The help page carries the budget rule | https://support.google.com/google-ads/answer/2375420 | as above | med |

### gtm.producthunt
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| gtm_channels.yaml:gtm.producthunt.limits | 1日1回の勝負。準備（ハンター・素材・初日の返信）が結果を決める | Missing the practical rules from the rebuilt official launch guide: being featured is hand-picked, launches are reviewed, and a relaunch needs a 2-month gap | 1日1回の勝負。予約は30日先まで・公開前に審査あり。トップ掲載は運営が選ぶ。再ローンチは2か月空ける | help.producthunt.com/en/articles/17350772-launch-guide; "7. Relaunch your product" (help.producthunt.com/en/articles/17734411): two-month window; "hand-picks which ones to feature" | med |
| gtm_channels.yaml:gtm.producthunt.pricing_bands.free | 無料で掲載（公式：100% free） | Could not re-read the "100% free" wording (host blocked). No contrary evidence | unchanged | — | low |

### gtm.seo
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| gtm_channels.yaml:gtm.seo.pricing_bands.usd10 | Ahrefs Starter $29/月 | Correct, but Starter is month-to-month only (no annual plan) | Ahrefs Starter $29/月（月払いのみ） | ahrefs.com/pricing via search: "Starter plan can only be renewed monthly"; Lite $129, Standard $249, Advanced $449 | med |
| stack_comparisons.yaml:launch_channels/gtm.seo.url vs catalog | ahrefs.com/pricing vs developers.google.com/search/docs | The two URLs differ. Acceptable (catalog = method, comparison = price), so just noting it | — | — | — |

### gtm.aso
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| gtm_channels.yaml:gtm.aso.pricing_bands.usd100 | AppTweak Essential $79/月〜（7日試用） | The pricing-page snippet shows "$79/Mo … $949 billed annually" next to "$99/Mo". $949/yr ≈ $79/mo, so $79 is probably the annual-billing rate. Also, the free tier is an "AppTweak Starter" (free, lifetime) and the trial needs a business email | AppTweak Essential $79/月（年払い $949）〜・7日試用（会社メール必須）／無料の Starter あり | apptweak.com/en/pricing (search snippet); help.apptweak.com "How does the 7-day free trial work?" | low (could not open the page; the monthly price is unclear) |
| — | — | gtm.aso is not in any tactics `options` list or comparison. With platform=app or both, no launch topic offers ASO | Consider adding gtm.aso to launch_channels options with `pick_when {platform: app} → gtm.aso` | — | med |

### gtm.referral
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| gtm_channels.yaml:gtm.referral.limits | 不正（自己紹介）対策が必要 | Missing the price step: Rewardful tiers are set by affiliate-generated revenue | 不正（自己紹介）対策が必要。Rewardful Starter は紹介経由の売上 $7,500/月まで（超えると Growth $99） | help.rewardful.com/en/articles/14240865: "Starter · $7,500; Growth · $15,000"; rewardful.com/pricing: $49/mo or $490/yr, Growth $99/$990, 14-day trial | med |

### gtm.community
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| gtm_channels.yaml:gtm.community.pricing_bands.usd100 | Circle Professional $89/月（年払い）／Business $199／Scale $419。加えて取引手数料 2%／1%／1% | Add the monthly-billing price (the step a beginner actually hits) | Circle Professional $89/月（年払い。月払い $99）／Business $199（月払い $219）／Scale $419。加えて取引手数料 2%／1%／1% | circle.so/pricing structured data: monthly $99 / $219; help.circle.so paywall-transaction-fees: "Professional - 2%, Business - 1%, Scale - 1%" | med |
| stack_comparisons.yaml:growth_channels/gtm.community.url | https://circle.so/pricing | The catalog uses discord.com. Both are fine; align on one | — | — | low |

### gtm.hn
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| gtm_channels.yaml:gtm.hn.avoid_when | マーケ色の強い文面 | This is advice on wording, not a decision axis | まだ試せる物がない（LP・登録待ちだけ）、または利用者が開発者でない | news.ycombinator.com/showhn.html: "If your work isn't ready for users to try out, please don't do a Show HN"; "don't post landing pages or fundraisers" | med |

### gtm.content
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| stack_comparisons.yaml:growth_channels/gtm.content.checked | '2026-10-26' | Out of sync with the catalog ('2026-11-03') | '2026-11-03' | — | high |

### gtm.pr, gtm.partners, gtm.outbound
Unchanged (checked). The PR TIMES rates match the official price page: 従量 3万円/件 (excl. tax), 定額 7万円〜/月 on an annual contract, up to 30 releases/月. The same page also lists a monthly contract at 8万円/月, a 6-month contract at 7.5万円/月, and +4万円 for 31 or more releases. These could be added but are not required. Shopify Partner "free to join" was not re-read (host blocked). gtm.outbound "CRM・送信ツール（要確認）" is an estimate and acceptable as is.

---

## support

### sup.email
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| support.yaml:sup.email.pricing_bands.free | Gmail 等で無料／Help Scout Free：5人・受信箱1・Docs 1・連絡先 100/月 | The Docs site on Free is capped at 10 articles. Replies stop at 100 contacts per cycle | Gmail 等で無料／Help Scout Free：5人・受信箱1・Docs 1（記事 10 本）・返信できる連絡先 100/月 | docs.helpscout.com/article/1597-free-plan: "up to 10 articles"; contacts cap: "you won't be able to reply … until the next cycle" | med |
| tactics.yaml:support.ai_reason_ja | 最初はメール1本で十分。件数が増えたらチャットへ。 | Contradicts the comparison. There, growing volume leads to a shared inbox and FAQ, while chat is only for when you sell instant replies (paid / B2B). A beginner would add chat at the wrong time | 無料で今日から使え、返事の目標を自分で決められる。件数が増えたら共有受信箱と FAQ へ | stack_comparisons support.switch_points | high |

### sup.status
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| support.yaml:sup.status.pricing_bands.free | …／Better Stack 無料：10 モニター・ページ1／UptimeRobot 無料：50 モニター・5分間隔・ページ1 | The commercial-use rule matters here. The Better Stack pricing page labels its free tier "Free for personal projects" (its own blog says it allows commercial use, so the two conflict) and checks every 3 min. The UptimeRobot FAQ says the free plan allows commercial use | …／Better Stack 無料：10 モニター・3分間隔・ページ1（料金ページは「個人プロジェクト向け」表記。商用は要確認）／UptimeRobot 無料：50 モニター・5分間隔・ページ1（商用可） | betterstack.com/pricing: "Free for personal projects"; uptimerobot.com: "free plan is available for any use, including commercial and business use" | med |
| — | Instatus Starter / Pro $20 | Unchanged. Instatus's own pages say Starter is free with 15 monitors, 2-min checks and 200 subscribers, and Pro is $20/mo with 50 monitors, 30 s checks, SMS, a custom domain and 5,000 subscribers | — | instatus.com blog posts (search) | med |

### sup.crisp
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| support.yaml:sup.crisp.pricing_bands.usd10 / usd100 | 追加席 $10/月 / Mini $45/月（ワークスペース）／Essentials $95／Plus $295 | The prices are right, but the seat counts are the real price step and are missing. The $10 extra seat applies to Plus | usd10: — ; usd100: Mini $45/月（4席）／Essentials $95（10席）／Plus $295（20席〜・追加席 $10/月） | crisp.chat/en/pricing (search): Mini 4 seats, Essentials 10, Plus 20+, "Additional agents cost $10 per month each" | med |

### sup.docs
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| support.yaml:sup.docs.pricing_bands.free | …Mintlify Starter 無料：編集者 5 席・独自ドメイン | The pricing page appears to call the plan "Free" (blog posts say "Starter"). Prices are unchanged: Pro $450/mo annual, $540 monthly | …Mintlify Free（無料）：編集者 5 席・独自ドメイン | mintlify.com/pricing (search): "5 editors, custom domain…"; "$450/month billed annually or $540/month billed monthly" | low |

---

## legal_terms

### lt.getterms (most important finding in this group)
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| legal_terms.yaml:lt.getterms.avoid_when | Cookie 同意の管理まで要る時 | **Factually wrong now.** GetTerms sells a cookie consent manager in its paid plans: Starter includes consent logs and 50,000 banner views/月, Business has unlimited views | 規約・ポリシーの法改正追跡を米国の州ごとに任せたい時（Termageddon の領域） | getterms.io/consent-manager and getterms.io/pricing (search): Starter "consent logs, 50,000 monthly banner views … geotargeting"; Business "unlimited banner views … regulation monitoring, multi-language" | med |
| legal_terms.yaml:lt.getterms.pricing_bands.usd5 / usd10 | Starter $5/月（年払い。月払い $9。買い切り $199） / Business $8/月（年払い。月払い $12。買い切り $249） | Prices unchanged. Add what is bundled | Starter $5/月（年払い。月払い $9。買い切り $199）：ポリシー＋Cookie バナー 5 万表示/月 / Business $8/月（年払い。月払い $12。買い切り $249）：バナー表示無制限・多言語 | as above | med |
| legal_terms.yaml:lt.getterms.pricing_bands.free | 無料版（GetTerms のブランド表示つき。上限はページに非表示） | The official page describes the free version as a basic privacy-policy generator for simple blogs and personal sites | 無料は簡易プライバシーポリシーのみ（個人サイト・ブログ向け） | getterms.io (search): "basic free privacy policy generator to suit simple blogs and personal websites" | low |
| stack_comparisons.yaml:legal_terms.rejected[lt.getterms].why | 買い切り $199 は長く使うなら最安。Cookie 同意の管理はない。 | Wrong for the same reason | 買い切り $199 で Cookie バナー（5 万表示/月）まで付き、長く使うなら最安。法改正の自動更新は弱い | as above | med |

### lt.termageddon
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| legal_terms.yaml:lt.termageddon.limits | 1サイトごと | Missing the bundled cookie banner (Usercentrics) and its cap | 1サイトごと。Cookie バナー（Usercentrics）込み・5 万セッション/月まで | termageddon.com/tools/cookie-consent-solution (search): "powered by Usercentrics", "up to 50,000 user sessions per month" | med |
| — | $12/月 または $119/年 | Unchanged (one comparison page says $120/yr; the pricing-page title says "$12 per month or $119 per year") | — | termageddon.com/pricing title | med |

### lt.iubenda
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| legal_terms.yaml:lt.iubenda.pricing_bands.usd5 | Essentials $5.99/サイト/月（…）：2.5万 PV/月まで。超過 €0.05/1,000PV | Essentials has **no terms-and-conditions generator** (Advanced and above only). A beginner would assume $5.99 covers terms too | …：2.5万 PV/月まで（規約は作れない。規約は Advanced 以上）。超過 €0.05/1,000PV | iubenda.com/en/help/6633-pricing-faqs-2: Terms generator "only available in our Advanced and Ultimate plans" | med |
| stack_comparisons.yaml:legal_terms.switch_points[EU].upgrade_to | iubenda Essentials $5.99/月 | Same point. If terms are also needed, the price step is Advanced $24.99 | iubenda Essentials $5.99/月（規約も要るなら Advanced $24.99/月） | as above | med |

### lt.termly, lt.lawyer
Unchanged (checked). Termly's own pages confirm Starter at $10/mo annual or $14 monthly (2 policies, 50k banner views), Pro+ at $15 or $20 (unlimited), and Free with 1 policy and quarterly scans.

---

## exit_tools

### xt.acquire
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| exit_tools.yaml:xt.acquire.limits | 買い手も会員制（$390〜） | Missing the period | 買い手も会員制（Premium $390/年・Platinum $780/年） | help.acquire.com "How do buyer pricing plans work?" (search): $390/yr Premium, $780/yr Platinum | med |
| — | 掲載 $25／$50／$100/月＋成約 8%／7%／6% | Unchanged. The help center (updated 2026-03-04) confirms $25/$50/$100 per month by asking price (<$250K, $250K–$1M, $1M+) and an 8/7/6% closing fee | — | help.acquire.com/how-much-does-it-cost-to-sell | med |

### xt.flippa
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| exit_tools.yaml:xt.flippa.pricing_bands.usd100 | 掲載 $29（60 日）〜$699／6 か月。成約手数料 10%（$1 万未満）〜6%（帯ごと…要確認） | Official pages say self-service sales pay **10%** (self-service is limited to asking prices up to $100K). The lower 5–6% rates belong to the brokered packages ($399–$1,499 upfront). "$1 万未満" is not supported by any official snippet | 掲載 $29（60 日）〜$699。自己出品の成約手数料 10%（希望価格 $10 万まで）。仲介プランは前払い $399〜＋10%〜5% | flippa.com/sell: "success fee for self-service sales is 10% of the final transaction value"; flippa.com/free-valuation: "self-service packages are available for businesses with an asking price up to $100K"; flippa.com/pricing: broker tiers "$399 to $1,499 … 10% to 5%" | low–med |
| exit_tools.yaml:xt.flippa.limits | エスクロー別料金（1%〜1.2%） | Official pages conflict: Escrow.com "from 1.2%" (pricing page), 0.71–1% (payments page), and FlippaPay is about 0.5% for deals of $10K or more. The buyer usually pays | エスクロー料は通常買い手負担（Escrow.com 約 1%前後・FlippaPay 約 0.5%） | support.flippa.com/hc/en-us/articles/360000774276; landing.flippa.com/product/payments | low |
| exit_tools.yaml:xt.flippa.avoid_when | 手数料の帯の対応が読めないまま出す時（出品前に見積もり画面で確認） | Not a decision axis | 希望価格 $10 万超の SaaS（自己出品は 10%。Acquire は 6〜8%） | as above | med |
| stack_comparisons.yaml:exit_route/xt.flippa.paid_entry | 掲載 $29（60 日）〜＋成約 10%〜6%（帯の対応は要確認） | Align with the above | 掲載 $29（60 日）〜＋自己出品の成約 10% | as above | low–med |

### xt.fossa
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| exit_tools.yaml:xt.fossa.pricing_bands.free | Free：5 プロジェクト・10 人・SBOM 取り込み 5 | Unchanged (pricing page: 5 projects, 10 contributing developers, 5 imported SBOMs). The blog says 25 devs, but that is older | — | fossa.com/pricing (search) | med |
| exit_tools.yaml:xt.fossa.pricing_bands.usd100 | Business $20/プロジェクト/月（年払い） | A second official FOSSA pricing URL (website-live.fossa.com/pricing) shows Business at **$73/month** (5 projects, 10 SBOM imports). The main page shows $20/project/mo. Could not resolve which is current | Keep, but set `verified: false` with the note: 料金ページに $20/プロジェクト/月 と $73/月 の 2 表記。要確認 | fossa.com/pricing vs website-live.fossa.com/pricing (search) | low |

### xt.syft, xt.shared-folder-dataroom, xt.direct-outreach
Unchanged (checked). The Syft README says it is "released under the Apache-2.0 License". The other two have no vendor facts.

---

## pricing

### pm.free-trial, pm.freemium, pm.seats
| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| stack_comparisons.yaml:pricing_model/pm.free-trial, pm.freemium, pm.seats .checked | '2026-10-26' | Out of sync with the catalog ('2026-11-03') | '2026-11-03' | — | high |

### pm.usage
Unchanged. Stripe Billing pay-as-you-go is 0.7% of Billing volume (stripe.com/billing/pricing via search; a Stripe support article says Starter and Scale were replaced by a single 0.70% plan). The "$620/月〜・1年契約" figure for the monthly-paid plan was **not** confirmed by search (low). Keep it with a 要確認 note.

### pm.one-time
Unchanged. Paddle charges 5% + 50¢ (paddle.com/pricing and the MSA). Paddle also has separate pricing for invoices and for transactions under $10. Optionally add to limits: 「$10 未満の商品は別料金（要相談）」.

### pricing_model pick_when money=free → pm.freemium
Low-severity framing issue. "Freemium" assumes there is a paid plan. With money=free the label reads oddly. The reason 「お金を取らないなら、無料枠の上限だけ決めておく」 is fine. Consider 「無料で配る時も、原価のかかる所に上限とキルスイッチを付ける」.

---

## build_vs_buy

| field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|
| stack_comparisons.yaml:build_vs_buy/bvb.platform.{free_tier, paid_entry, url} | 多くの全部入りサービスに無料枠（上の各比較を参照） / 月 $20〜$25 前後から（例：Supabase Pro $25、Vercel Pro $20） / supabase.com/pricing | **Inconsistent with the catalog.** build_vs_buy.yaml defines bvb.platform as an all-in-one box like GoHighLevel (CRM, site, automation, phone), and its numbers are GoHighLevel's. The comparison instead cites Supabase and Vercel, which by the catalog's definition are "parts" (bvb.api). GoHighLevel has no free tier, only a 14-day trial. A beginner gets two different meanings of "platform" | free_tier: 無料プランなし（14日試用） / paid_entry: GoHighLevel Starter $97/月（年 $970）・3サブアカウント / url: https://www.gohighlevel.com/pricing. Or, if the topic is meant to be generic, rewrite the catalog's bvb.platform `what` to drop GoHighLevel. Pick one meaning | gohighlevel.com/pricing (search): Starter $97, Unlimited $297, $497 tier; build_vs_buy.yaml verified_2026_10_26 | med |
| build_vs_buy.yaml:verified_2026_10_26.gohighlevel.pro_saas | $497/月（年$4,970）・SaaSモード・上乗せ再請求 | The newest HighLevel support article calls the $497 tier the "Founder Plan, formerly Agency Pro". The price is unchanged; only the name may have changed | Add the note: 「$497 プランは Founder Plan（旧 Agency Pro）と表記される場合あり」 | help.gohighlevel.com/support/solutions/articles/155000006652 (search) | low |
| stack_comparisons.yaml:build_vs_buy.recommendation.reason | 確かめる前は借りるのが最速で最安。強みと分かった所だけ後で作る。 | Doesn't separate platform from api (both are "rent"). The decisive axis, a fixed monthly fee with everything bundled versus pay-per-use parts plus your own glue code, is missing | 確かめる前は全部入り（月額固定・つなぎ不要）が最速。強みと分かった所だけ後で作る | — | med |
| stack_comparisons.yaml:build_vs_buy/bvb.platform.checked | '2026-10-28' | Older than the other items | Re-check date when fixed | — | — |

bvb.api and bvb.build are unchanged (no vendor facts beyond "e.g. 3,000 emails/月" and "10k searches/月", which belong to other groups).

---

## Other reason-quality notes (tactics ai_reason_ja)

| field | current | issue | proposed | conf |
|---|---|---|---|---|
| tactics.yaml:launch_channels.ai_reason_ja (+ comparison reason) | 作りながら途中経過を出せ、費用ゼロで反応がすぐ分かる。 | Names no audience axis. X fits consumer, indie and English-speaking early adopters (the catalog's own best_for). There is also no pick_when for audience=business or platform=app | 個人・英語圏の早期層に届き、費用ゼロで公開前から反応を測れる | med |
| tactics.yaml:exit_route / sbom_tool / growth_channels default reasons | — | OK. Each names its axis (fees or known buyers / free plus CI / free plus operator time) | unchanged | — |

---

## pick_when rejected

**growth_channels — `{audience: business}` → gtm.content**
- gtm.community: 仕事の利用者は Discord に常駐しない。事例・解説を読んで決めるので記事が先。
- gtm.referral: 会社の購入は決裁者が別で、紹介特典では動きにくい。導入事例を紹介に使う。
- gtm.seo: コンテンツと一緒に育てる土台。単独では効果まで 3〜6 か月。
- gtm.ads.meta: 消費者向けの面で B2B の決裁者に届きにくい。LTV が分かる前は損失の上限なし。

**pricing_model — `{audience: business}` → pm.seats**
- pm.free-trial: 席数プランに試用期間を付けて併用する。単独の型にはしない。
- pm.freemium: 会社は無料枠で済ませがちで、請求書払い・年契約の流れに乗らない。
- pm.usage: AI・API など原価が使用量に比例する部分だけ席に足す。従量だけだと購買部門が予算を組めない。
- pm.one-time: 会社向けは保守・サポート・SSO が続き、買い切りでは費用だけ残る。

**pricing_model — `{money: free}` → pm.freemium**
- pm.free-trial: お金を取らないので試用の終わりがない。
- pm.usage: 請求しないので、計測は上限（キルスイッチ）用だけで足りる。
- pm.one-time: 販売しないので不要。
- pm.seats: 請求しないので不要。会社向けに有料化する時に検討。

**legal_terms — `{money: marketplace}` → lt.lawyer**
- lt.termly: プライバシーポリシーと Cookie バナーの土台としては併用可。ユーザー間取引の責任分担は書けない。
- lt.iubenda: EU の同意記録は併用可。規約は Advanced（$24.99/月）以上で、取引条件は雛形の範囲外。
- lt.getterms: 安い雛形。出品者・購入者間の返金・紛争・手数料の条項は作れない。
- lt.termageddon: 米国の州プライバシー法の追跡用。出品者規約・取引条件は対象外。

(No pick_when rules exist for launch_channels, support, exit_route, sbom_tool or build_vs_buy. Suggested addition: launch_channels `{platform: app}` → gtm.aso, which would require adding gtm.aso to the options list.)

---

## urls

Resolution could **not** be tested: the sandbox blocks every vendor host (curl 000 or ENOTFOUND). URLs marked * appeared as live official pages in the vendor-restricted search index. The others are the vendor's standard paths and need a resolve check.

| id | site_url | start_url |
|---|---|---|
| gtm.producthunt | https://www.producthunt.com/ | https://help.producthunt.com/en/articles/17350772-launch-guide * |
| gtm.hn | https://news.ycombinator.com/ | https://news.ycombinator.com/showhn.html * (rules) then https://news.ycombinator.com/submit |
| gtm.x | https://business.x.com/en/advertising * | https://ads.x.com/ |
| gtm.seo | https://developers.google.com/search/docs | https://search.google.com/search-console |
| gtm.aso | https://developer.apple.com/app-store/product-page/ | https://appstoreconnect.apple.com/ (Google Play: https://play.google.com/console) |
| gtm.content | https://developers.google.com/search/docs/fundamentals/creating-helpful-content | same |
| gtm.ads.meta | https://www.facebook.com/business/ads * | https://adsmanager.facebook.com/ |
| gtm.ads.google | https://business.google.com/us/google-ads/ | https://ads.google.com/ |
| gtm.referral | https://www.rewardful.com/ | https://www.rewardful.com/pricing * |
| gtm.community | https://discord.com/ | https://discord.com/app (Circle: https://circle.so/pricing *) |
| gtm.pr | https://prtimes.jp/ | https://prtimes.jp/price/ * |
| gtm.partners | https://www.shopify.com/partners | https://help.shopify.com/en/partners/about |
| gtm.outbound | https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business | same |
| sup.email | https://www.helpscout.com/ | https://www.helpscout.com/pricing/ * |
| sup.crisp | https://crisp.chat/en/ | https://crisp.chat/en/pricing/ * |
| sup.docs | https://www.mintlify.com/ * | https://www.mintlify.com/pricing * |
| sup.status | https://instatus.com/ | https://instatus.com/pricing |
| lt.termly | https://termly.io/ | https://termly.io/pricing/ |
| lt.iubenda | https://www.iubenda.com/en/ | https://www.iubenda.com/en/pricing/ * |
| lt.getterms | https://getterms.io/ * | https://getterms.io/pricing * |
| lt.termageddon | https://termageddon.com/ | https://termageddon.com/pricing/ * |
| lt.lawyer | null (country-specific) | null |
| xt.shared-folder-dataroom | null (use the drive you already have) | https://support.google.com/drive/answer/2494822 (Drive sharing help) |
| xt.acquire | https://acquire.com/ | https://help.acquire.com/how-to-sign-up-on-acquire-seller * |
| xt.flippa | https://flippa.com/ | https://flippa.com/sell * |
| xt.direct-outreach | null | null |
| xt.syft | https://github.com/anchore/syft * | https://github.com/anchore/sbom-action * (CI) |
| xt.fossa | https://fossa.com/ | https://fossa.com/pricing/ * |
| pm.free-trial | https://stripe.com/billing | https://docs.stripe.com/billing/subscriptions/trials |
| pm.freemium | https://stripe.com/billing | https://docs.stripe.com/billing/subscriptions/build-subscriptions |
| pm.usage | https://stripe.com/billing/pricing * | https://docs.stripe.com/billing/subscriptions/usage-based |
| pm.one-time | https://www.paddle.com/ | https://www.paddle.com/pricing * |
| pm.seats | https://stripe.com/billing | https://docs.stripe.com/billing/subscriptions/quantities |
| bvb.platform | https://www.gohighlevel.com/ | https://www.gohighlevel.com/pricing * |
| bvb.api | null (generic; examples: Twilio, Stripe, Resend) | null |
| bvb.build | null | null |

---

## Could not verify
- **No page was opened directly.** Every vendor host is blocked in this sandbox (WebFetch ENOTFOUND, curl 000). All findings come from vendor-domain-restricted search snippets. None of them justify setting `verified: true`.
- Stripe Billing monthly-paid plan "$620/月〜・1年契約": not found in search.
- AppTweak Essential monthly price ($79 vs $99).
- FOSSA Business: $20/project/mo vs $73/mo (two official URLs disagree).
- Flippa success-fee bands and escrow rates (official pages conflict with each other).
- Better Stack free tier commercial use (pricing page says "personal projects"; its blog says commercial use is OK).
- Product Hunt "100% free" wording; Shopify Partner "free to join"; Discord free tier (unchanged, not re-read).
- Mintlify free plan name ("Free" vs "Starter").
- GoHighLevel $497 tier name ("Founder Plan" vs "Agency Pro").
- URL resolution for all rows in the urls section.

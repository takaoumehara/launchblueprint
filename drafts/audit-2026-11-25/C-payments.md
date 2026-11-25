# C — payments / cross-border audit (topics: payments, market_entry)

Audited 2026-11-23. Files: `skill/blueprint/catalog/payments.yaml`, `skill/blueprint/catalog/cross_border.yaml`, `skill/blueprint/elements/stack_comparisons.yaml` (topics `payments` L223–270, `market_entry` L1578–1620), `skill/blueprint/elements/tactics.yaml` (payments L72–93, market_entry L418–438).

**Method caveat (read first):** this session could not open any vendor page. WebFetch returned DNS failure and `curl` got `403 (agent proxy: no rule or network setting allows this host)` for stripe.com, support.stripe.com, paddle.com, lemonsqueezy.com, pay.jp, komoju.com and polar.sh. Every quote below comes from WebSearch restricted to the vendor's own domains, meaning the search index's text from the official page. It is not a live read of the page. So confidence is at most **med** unless several official pages agree. No entry should move to `verified: true` on this evidence alone. Entries already `verified: true` keep their status. Whoever applies a numeric change should re-open the live page first.

23 options checked. Totals: 9 with changes, 12 unchanged (checked), 2 strategy entries changed only through their reasons.

---

## 1. Most important: Lemon Squeezy is shutting down (official, 2026-11-16)

Lemon Squeezy's own docs and blog announce a wind-down:
- New sign-ups closed on **2026-11-16**.
- Existing stores keep processing until **2027-03-31** ("won't be able to extend").
- Migration tooling to Stripe Managed Payments opens **2026-12-02**, and they advise starting by mid-January 2027 (migration takes 4–8 weeks).
- Migrating merchants may get a promotional Managed Payments rate of **1.5% until 2027-12-01**, plus Stripe processing fees.
- License keys, file delivery, PayPal and affiliates do not carry over.
- If Managed Payments is not available in the seller's country, the account cannot be moved.

Sources: https://docs.lemonsqueezy.com/migration , https://docs.lemonsqueezy.com/migration/faq , https://docs.lemonsqueezy.com/migration/comparison , https://www.lemonsqueezy.com/blog/saying-goodbye-to-lemon-squeezy

The catalog still says "新規登録は引き続き可能で、強制移行の期日は出ていない". That is now wrong. Every place that offers Lemon Squeezy as a choice for a new project must change (rows below). It also appears in `catalog/pricing.yaml:79` `pairs_well_with: [pay.paddle, pay.lemonsqueezy]`, which is outside my files; the pricing owner should change it.

---

## 2. Per-option tables

### pay.lemonsqueezy
| id | field (file:key) | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| pay.lemonsqueezy | payments.yaml:what | MoR 型のデジタル販売（Stripe 傘下） | Product is being shut down | MoR 型のデジタル販売（Stripe 傘下・2027-03-31 で終了） | docs.lemonsqueezy.com/migration: "will stop processing transactions for all businesses on March 31, 2027" | high |
| pay.lemonsqueezy | payments.yaml:best_for | 個人・小規模のデジタル商品／SaaS | Cannot be a new pick | 既存ストアの移行計画だけ（新規は不可） | same | high |
| pay.lemonsqueezy | payments.yaml:avoid_when | 物販・マーケットプレイス・大規模 | Misses the decisive axis | 新規の案件すべて（2026-11-16 で新規登録停止、2027-03-31 で決済停止） | docs.lemonsqueezy.com/migration: sign-ups stopped Nov 16, 2026 | high |
| pay.lemonsqueezy | payments.yaml:pricing_bands.free (and usd5/10/100 "同左") | 5%+50¢／件（月額なし） | Surcharges omitted; product closing | 5%+50¢／件（月額なし）。米国外 +1.5%・PayPal +1.5%・サブスク +0.5%。新規登録は停止 | docs.lemonsqueezy.com/help/getting-started/fees: "+1.5% for international (outside of the US) transactions, +1.5% for PayPal transactions, +0.5% for subscription payments" | med |
| pay.lemonsqueezy | payments.yaml:limits | 2026-01-28 の公式ブログで、今後の重点を Stripe Managed Payments（Stripe の MoR）に移すと発表。新規登録は引き続き可能で、強制移行の期日は出ていない（更新とサポートは遅くなる見込み）。新規は Stripe Managed Payments も並べて比較する | Factually outdated | 2026-11-16 に終了を発表。新規登録は停止、2027-03-31 で決済停止（延長なし）。2026-12-02 から Stripe Managed Payments への移行ツール。移行者は 2027-12-01 まで MP 手数料 1.5%（＋Stripe 決済手数料）。ライセンスキー・ファイル配布・PayPal・アフィリエイトは移らない | docs.lemonsqueezy.com/migration/faq; /migration/comparison: "promotional Managed Payments rate of 1.5% through December 1, 2027" | high (dates) / med (1.5%) |
| pay.lemonsqueezy | payments.yaml:source.note | 5%+50¢ は料金ページで確認（2026-11-03）。2026-01-28 公式ブログ：重点を Stripe Managed Payments に移す。移行期日なし・新規登録は継続 | Outdated | 2026-11-16 公式：終了を発表（新規停止・2027-03-31 決済停止）。出典 docs.lemonsqueezy.com/migration | same | high |
| pay.lemonsqueezy | payments.yaml:lock_in | 中 | Forced exit | 高（2027-03-31 までに移行が必須） | same | high |

### mor.lemonsqueezy (cross_border.yaml fees_verified_2026_10_26)
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| mor.lemonsqueezy | cross_border.yaml:fees_verified_2026_10_26[mor.lemonsqueezy].fee | 5% + 50¢/取引、月額0。米国外の取引や一部の支払い方法で追加手数料あり | Missing the shutdown; surcharges can be stated exactly | 5% + 50¢/取引、月額0（米国外 +1.5%・PayPal +1.5%・サブスク +0.5%）。2026-11-16 新規登録停止・2027-03-31 決済停止 | see pay.lemonsqueezy | high / med |
| mor.lemonsqueezy | same:what | Lemon Squeezy（MoR） | — | Lemon Squeezy（MoR・終了予定。新規は選べない） | same | high |

### es.mor_first and the places that name Lemon Squeezy as a MoR choice
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| es.mor_first | cross_border.yaml:entry_strategies[es.mor_first].name | MoR決済先行（最初から Paddle / Lemon Squeezy） | LS closed to new sign-ups | MoR決済先行（最初から Paddle / Stripe Managed Payments） | LS migration docs | high |
| es.mor_first | cross_border.yaml:…cons | 手数料が高い（5%+50¢。$10の商品なら約10%） | Paddle-only; MP has a different curve | 手数料が高い（Paddle 5%+50¢＝$10 で10%。Stripe MP は 2.9%+30¢＋3.5%＝$10 で9.4%、$15 以上なら Paddle の方が安い） | stripe.com/pricing (Managed Payments "3.5% per successful transaction" on top of payments fees); paddle.com/pricing "5% + 50¢". Break-even is my own arithmetic: 5%+50¢ = 6.4%+30¢ at ≈$14.3 | med |
| es.mor_first | cross_border.yaml:…cons item 3 | 審査あり（対象はデジタル商品のみ） | Keep, and add the Connect restriction | 審査あり（デジタル商品のみ。Stripe MP は Connect と併用不可） | docs.stripe.com/payments/managed-payments/eligibility: "supports direct integrations only. It doesn't support… Connect platforms" | med |
| es.mor_first | stack_comparisons.yaml:market_entry.services[es.mor_first].free_tier | 月額 0。売上ごとに 5%+50¢（Paddle／Lemon Squeezy） | LS gone | 月額 0。Paddle は 5%+50¢／件、Stripe MP は Stripe 手数料＋3.5%／件 | as above | med |
| — | payments.yaml:payment_roles.roles[role.own_subscription].alternatives[0] | MoR（Paddle / Lemon Squeezy）：各国の税の登録・納税を任せたい時（5%+50¢） | LS gone | MoR（Paddle 5%+50¢／Stripe Managed Payments 手数料＋3.5%）：各国の税の登録・納税を任せたい時 | as above | med |
| — | cross_border.yaml:recommendation.check_first[2] | Stripe Managed Payments の料金（未確認） | Fee is now known; the open question is eligibility | Stripe Managed Payments の対象国（事業の所在地）と対象商品（デジタルのみ・Connect 不可）。日本拠点なら国内売上の消費税は自分 | docs.stripe.com/payments/managed-payments/tax-compliance: "…except… Japan (all domestic transactions)… you're responsible for calculating, collecting, filing, and remitting taxes on domestic sales" | med |
| — | cross_border.yaml:recommendation.why[2] | $10の商品で Stripe+Tax Basic は約7.4%（米国内カードの場合、登録・申告は自分）、MoR は約10%。差は1件30¢前後… | Arithmetic: 2.9%+30¢+0.5% on $10 = $0.64 = 6.4%. Only with the Billing 0.7% (subscriptions) is it 7.1%. 7.4% matches neither | $10の商品で Stripe+Tax Basic は約6.4%（サブスクは Billing 0.7% が足され約7.1%。米国内カード、登録・申告は自分）、Paddle は10%。差は1件30〜36¢… | stripe.com/billing/pricing "0.7% of Billing volume"; stripe.com/tax/pricing 0.5% | med |

### mor.stripe.managed
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| mor.stripe.managed | cross_border.yaml:fees…[mor.stripe.managed].fee | 決済手数料（国内カード 2.9%+30¢）に加えて 3.5%／件（税・不正対策・紛争対応・Link 経由のサポート込み） | Omits the subscription Billing fee, the eligibility limits and the Japan domestic-tax carve-out | 決済手数料（米国カード 2.9%+30¢）＋3.5%／件（税込み総額に対して）。サブスクは Billing 0.7% も別途。デジタル商品のみ・Connect 不可。日本拠点は国内売上の消費税を自分で申告 | support.stripe.com/questions/managed-payments-pricing: "Additional charges apply for subscription payments… 'Pay as you go' fee for Stripe Billing"; docs.stripe.com/payments/managed-payments/eligibility; …/tax-compliance | med |
| mor.stripe.managed | same:url | https://stripe.com/pricing | A more specific page exists | https://support.stripe.com/questions/managed-payments-pricing (also https://docs.stripe.com/payments/managed-payments/eligibility) | — | high |
| mor.stripe.managed | (new note) | — | Availability | 2026-04-22 に一般提供（changelog は「39 か国」、二次情報は「37 か所」で食い違い。米国・日本は対象と報じられるが一覧本文は未読） | docs.stripe.com/payments/managed-payments/changelog | low |

### pay.stripe-checkout / pay.stripe.cards (Stripe US + Japan)
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| pay.stripe-checkout | payments.yaml:pricing_bands.free…usd100 | 固定費なし、米国カード 2.9%+30¢／件、紛争 $15／件 | US page also lists a "dispute countered fee" | 固定費なし、米国カード 2.9%+30¢／件、紛争 $15／件（反論すると +$15、勝てば返金） | stripe.com/pricing: "$15.00 for each dispute you respond to manually"; support.stripe.com/questions/dispute-fees-faq: "If you win the dispute, the dispute countered fee is returned" (excludes Mexico and Japan) | med |
| pay.stripe-checkout | payments.yaml:limits | 国ごとに対応手段が違う。海外カード +1.5%、通貨換算 +1% | Rates are US-only; the Japan account rates differ and appear nowhere in the catalog | 料金は米国アカウントの場合。日本の Stripe アカウントはカード 3.6%／件（通貨換算 +2%）で、Visa/MC の手数料に 2026-04-01 から消費税がかかる。国ごとに対応手段が違う | stripe.com/en-jp/pricing: "3.6% per successful transaction for domestic cards, + 2% if currency conversion is required"; support.stripe.com/questions/taxes-on-stripe-fees-for-businesses-in-japan: Visa and Mastercard fees subject to JCT from April 1, 2026 | med |
| pay.stripe-checkout | payments.yaml:liability_compliance | チャージバックは販売者（自社）。紛争受付 $15 | Same countered-fee gap | チャージバックは販売者（自社）。紛争受付 $15、反論 +$15（勝てば返金） | as above | med |
| pay.stripe.cards | cross_border.yaml:fees…[pay.stripe.cards].extra | 国際カード +1.5%、通貨換算 +1%、紛争 $15（2026-11-03 公式確認） | Same; also says nothing about Japan | 国際カード +1.5%、通貨換算 +1%、紛争 $15（反論 +$15・勝てば返金）。日本アカウントはカード 3.6%＋換算 2% | as above | med |
| pay.stripe-checkout | stack_comparisons.yaml:payments.services[pay.stripe-checkout].free_tier | 月額なし。米国カード 2.9%＋30¢／件（海外カード +1.5%・通貨換算 +1%）・チャージバック $15／件 | Wording differs from the catalog (チャージバック vs 紛争); countered fee missing | 月額なし。米国カード 2.9%＋30¢／件（海外カード +1.5%・通貨換算 +1%）・紛争 $15／件（反論 +$15、勝てば返金） | as above | med |
| pay.stripe-checkout | stack_comparisons.yaml:payments.services[pay.stripe-checkout].paid_entry | 同じ（手数料だけ）。税の自動計算は別料金 | Vague | 同じ（手数料だけ）。税の計算は Stripe Tax 0.5%／件、サブスク管理は Billing 0.7% が別 | stripe.com/tax/pricing; stripe.com/billing/pricing | med |

### tax.stripe.basic / tax.stripe.complete
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| tax.stripe.basic | — | — | unchanged (checked): 0.5% (no-code) or $0.50/件 (API), charged only in jurisdictions where you are registered. Matches the index text of stripe.com/tax/pricing | — | stripe.com/tax/pricing | med |
| tax.stripe.complete | cross_border.yaml:fees…[tax.stripe.complete].fee | 月額・1年契約。最小は 登録2/年・200取引/月・申告4/年。金額はページの取得で読めず要確認 | Amount is now findable | 月額 $90〜（1年契約）。最小プランは 200取引/月込み（超過 $0.50/件）・登録と申告込み。上位 $430／$1,000／$1,500/月 | stripe.com/tax/pricing and support.stripe.com/questions/understanding-stripe-tax-pricing (index text: "$90, $430, $1,000 and $1,500 per month on a 1-year contract"; "$90 tier includes 200 transactions per month, USD 0.50 per additional") | med; keep `verified: false` until the live page is read |
| es.us_first | cross_border.yaml:entry_strategies[es.us_first].cost.usd100 | + 州の売上税対応（Stripe Tax 0.5% など） | OK; optionally add the Complete step | + 州の売上税対応（Stripe Tax Basic 0.5%／件。登録・申告も任せるなら Complete $90/月〜） | as above | med |

### pay.paddle / mor.paddle
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| pay.paddle | payments.yaml:avoid_when | 物販・マーケットプレイス。料率を下げたい場合 | "料率を下げたい場合" is vague (no axis) | 物販・対面・マーケットプレイス（SaaS とデジタル商品のみ対象）。$10 未満が中心（1件10%超になる） | developer.paddle.com: "Paddle only supports the sales of SaaS and digital products"; paddle.com/pricing "5% + 50¢" | med |
| pay.paddle | payments.yaml:pricing_bands.free | 5%+50¢／件（月額なし。$10 未満の商品は個別相談） | Current page wording is "high-volume, low-value transactions" custom pricing; the "<$10" line is from an older FAQ | 5%+50¢／件（月額なし。少額・大量の取引は個別料金の相談） | paddle.com/pricing (index text: "pricing for high-volume, low-value transactions" under custom) | low |
| pay.paddle | stack_comparisons.yaml:payments.recommendation.rejected[pay.paddle].why | 海外の税は任せられるが、手数料が高く、ユーザー同士の売り買いには向かない。 | "手数料が高く" has no number | 海外の税は任せられるが 5%+50¢（Stripe より1件約2%+20¢高い）。デジタル商品のみで、ユーザー同士の売買には使えない。 | paddle.com/pricing; stripe.com/pricing | med |
| mor.paddle | — | — | unchanged (checked) apart from the same "$10 未満" wording note (low) | — | paddle.com/pricing | med |

### pay.polar
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| pay.polar | payments.yaml:limits | 新しめのサービス | Vague (no axis); payout fee missing | 入金は Stripe 経由で、入金のある月 $2＋0.25%+25¢／回が別にかかる。比較的新しいサービス | polar.sh/docs/merchant-of-record/fees (index text: "$2 per month for active payouts and 0.25% + $0.25 per payout") | med |
| pay.polar | payments.yaml:best_for | 開発者向けプロダクト、オープンソース収益化 | Could note the role it now takes | 開発者向けプロダクト・SaaS。Lemon Squeezy 終了後の小規模 MoR の候補 | (framing) | med |
| pay.polar | payments.yaml:pricing_bands | (as is) | Fees unchanged: Starter 5%+50¢; Pro $20/3.8%+40¢; Growth $100/3.6%+35¢; Scale $400/3.4%+30¢; intl +1.5%; Early Member 4%+40¢ before 2026-05-27 | — | polar.sh/docs/merchant-of-record/fees | med |

### pay.adyen
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| pay.adyen | payments.yaml:pricing_bands.free | $0.13＋Interchange++＋0.60%（Visa/MC）。… | The search index shows the main pricing page's Visa/Mastercard row as "$0.13 + 0.80% + Interchange++" (likely US). The Visa method page's "Global" row and US debit networks show 0.60% | Leave as is but recheck the live page. If the US row says 0.80%: $0.13＋Interchange++＋0.60%〜0.80%（地域で違う。米国 Visa/MC は 0.80%） | adyen.com/pricing; adyen.com/payment-methods/visa | low |

### pay.komoju
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| pay.komoju | payments.yaml:source.note | 2026-10-26 付で不正アクセスの公表あり。契約前に状況を確認 | Wrong date (first official notice 2026-10-22, follow-up 10-27); scope can be stated | 2026-10-22 公表：10-13 以降の不正アクセスで個人データ約4,100件と一部加盟店の API 認証情報が漏えい（カード情報は漏えいなしと説明）。CRM 分は調査中。契約前に最新の続報を確認 | ja.komoju.com/news/1022-notice/ ("2026年10月13日以降…不正にログイン"; "カード情報は漏れていません") | med |
| pay.komoju | payments.yaml:pricing_bands.free | カード 3.25%・コンビニ 2.75%・初期費用と月額 0 円 | Fees are plus consumption tax; payout fee omitted | カード 3.25%・コンビニ 2.75%（別途消費税）・初期費用と月額 0 円。出金の振込手数料あり（国内 220円/410円） | help.komoju.com/hc/en-us/articles/4747472702622 (no fees besides transaction and payout fees; tax added) | med |
| pay.komoju | payments.yaml:liability_compliance | 販売者が責任 | The incident is a vendor-risk point | 販売者が責任。2026-10 の漏えいを受け、API キーを再発行したか確認 | as above | med |

### pay.payjp
unchanged (checked). Standard 3.3%, ¥0/月 (under ¥4M/月 in sales). Business ¥20,000/月 (tax incl.), 2.78%. Enterprise ¥50,000/月, 2.59% for Visa/MC (2.7% for other brands). Source: pay.jp/plan, help.pay.jp "最適なプランの選び方". Conf: med. (The 250円/回 payout fee was not re-seen.)

### pay.stripe-connect — unchanged (checked)
$2 per monthly active account plus 0.25%+25¢ per payout when the platform sets pricing; nothing extra when Stripe sets pricing. Instant Payouts are 1% (not in the catalog; optional). Sources: stripe.com/connect/pricing, support.stripe.com/questions/monetizing-payments-with-stripe-connect. Conf: med.

### pay.ryft — unchanged (checked)
No public rate card; a custom proposal plus a monthly SaaS fee. Source: ryftpay.com/pricing. Conf: med.

### pay.checkout-com — unchanged (checked)
Custom pricing; no setup or account maintenance fee. Source: checkout.com/pricing. Conf: med (the index copy is old).

### pay.mollie — unchanged (checked)
EEA consumer cards 1.80%+€0.25, business cards 2.90%+€0.25, iDEAL €0.32. Sources: mollie.com/pricing, /payments/credit-card. Conf: med (old index copy).

### pay.square — unchanged (checked)
Online 3.3%+30¢; API / eCommerce 2.9%+30¢; in-person 2.6%+15¢; keyed 3.5%+15¢. Source: squareup.com/us/en/payments/our-fees, developer.squareup.com/docs/payments-pricing. Square Plus $49/月 in stack_comparisons was not re-seen. Conf: med.

### pay.paypal-braintree — unchanged (checked)
PayPal/Venmo 3.49%+49¢, cards via PayPal Checkout 2.99%+49¢, Expanded/Advanced 2.89%+29¢, chargeback $20. Source: paypal.com/us/business/fees. Conf: med.

### pay.venmo — unchanged (checked)
1.9%+10¢ business profile. Tap to Pay is 2.29%+9¢ on the help/fee page and 2.9%+9¢ on the marketing page; the existing note already records this conflict. Source: venmo.com/resources/our-fees, help.venmo.com business-profile-transaction-fees. Conf: med.

### es.us_first — unchanged (checked) except the optional usd100 text above. Note: stack_comparisons `market_entry.services[es.us_first]` says `verified: true`, but the catalog marks the same strategy `verified: false` (estimate). The fee in it (Stripe 2.9%+30¢) is verified, and the strategy is not; this is acceptable, but should be noted.

### es.jp_en — one addition
| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| es.jp_en | cross_border.yaml:entry_strategies[es.jp_en].risks[1] | 日本の消費者向けは特商法表記・消費税（国外事業者）を自分で確認する必要 | Add the fee fact a JP seller needs | 日本の消費者向けは特商法表記・消費税（国外事業者）を自分で確認する必要。日本法人で Stripe を使うとカード 3.6%（Stripe MP でも国内売上の消費税は自分） | stripe.com/en-jp/pricing; docs.stripe.com/payments/managed-payments/tax-compliance | med |

### Consistency note (no factual error)
`cross_border.yaml:recommendation.pick` recommends `es.jp_en` with `es.mor_first`, but `stack_comparisons.yaml:market_entry.recommendation.pick` is `es.us_first`. The cross_border recommendation is written for one profile (NY LLC, JP+EN digital product), so it is not a contradiction. Adding one line to the cross_border `for:` such as "（汎用の既定は es.us_first）" would stop the two from reading as conflicting. Conf: low (editorial).

---

## 3. pick_when rejected lists

### topic payments (options: pay.stripe-checkout, pay.stripe-connect, pay.paddle, pay.ryft)

The default `rejected` list in stack_comparisons names pay.square, which is not one of the tactics options. pay.stripe-connect and pay.ryft have no default rejected line. Proposed lines for the default pick (pay.stripe-checkout):
- pay.stripe-connect: 自分だけが売るなら不要。受け取り手ごとの口座・本人確認の手間が増える。
- pay.ryft: 英国・EU のマーケットプレイス向けで公開料金なし。米国・日本の小規模には合わない。

**if money: marketplace → pick pay.stripe-connect**
- pay.stripe-checkout: 他人の売上を自社の口座で受けることになり、受け取り手ごとの本人確認・送金ができない。
- pay.paddle: MoR は自社が唯一の売り手の時だけ。出店者への分配ができない。
- pay.ryft: 分配・エスクローはあるが英国・EU 中心で公開料金なし。米国・日本の小規模は対象外になりやすい。

**if country: global → pick pay.paddle**
- pay.stripe-checkout: 各国の税の登録・申告は自分（Stripe Tax は計算だけ）。単価 $15 未満なら Stripe Managed Payments も比較。
- pay.stripe-connect: 他人の売上を扱わないなら不要。MoR（Paddle・Stripe MP）とは併用できない。
- pay.ryft: 税の代行（MoR）はしない。英国・EU 中心。

### topic market_entry (options: es.us_first, es.jp_en, es.mor_first)

**if country: jp → pick es.jp_en**
- es.us_first: 最初の利用者が日本の人なので、英語だけでは使ってもらえない。
- es.mor_first: 1か国目の税の手間は小さく、5%+50¢ の手数料の方が重い。2か国目で売れたら移る。

**if country: global → pick es.mor_first**
- es.us_first: 2か国目以降の税の登録・申告を自分で追うことになる。
- es.jp_en: 言葉の作り方の話で、税の担当は決まらない（i18n の骨組みは併用する）。

---

## 4. urls
None of these could be checked for resolution with WebFetch or curl, because the proxy blocks the hosts. Every URL below appeared as a live result on the vendor's own domain in the search index. Mark the resolve check as pending.

| id | site_url | start_url |
|---|---|---|
| pay.stripe-checkout | https://stripe.com/payments/checkout | https://dashboard.stripe.com/register |
| pay.stripe-connect | https://stripe.com/connect | https://docs.stripe.com/connect |
| pay.paddle | https://www.paddle.com/ | https://vendors.paddle.com/signup |
| pay.ryft | https://www.ryftpay.com/ | https://www.ryftpay.com/pricing (sales proposal; there is no self-serve sign-up) |
| pay.adyen | https://www.adyen.com/ | https://www.adyen.com/pricing (sales-led; contact form linked there) |
| pay.checkout-com | https://www.checkout.com/ | https://www.checkout.com/pricing (sales-led) |
| pay.lemonsqueezy | https://www.lemonsqueezy.com/ | https://docs.lemonsqueezy.com/migration (sign-ups closed; existing stores only) |
| pay.polar | https://polar.sh/ | https://polar.sh/docs/introduction (sign-up from polar.sh) |
| pay.mollie | https://www.mollie.com/ | https://my.mollie.com/dashboard/signup |
| pay.square | https://squareup.com/us/en | https://developer.squareup.com/docs/payments-pricing (developer start) |
| pay.paypal-braintree | https://www.paypal.com/us/business | https://www.paypal.com/us/business/fees (sign-up from page) / Braintree: https://www.braintreepayments.com/ |
| pay.venmo | https://venmo.com/business/profiles | https://venmo.com/business/start |
| pay.komoju | https://ja.komoju.com/ | https://komoju.com/en/sign_up |
| pay.payjp | https://pay.jp/ | https://console.pay.jp/d/signup |
| pay.stripe.cards | https://stripe.com/pricing | https://dashboard.stripe.com/register |
| tax.stripe.basic | https://stripe.com/tax | https://docs.stripe.com/tax |
| tax.stripe.complete | https://stripe.com/tax/pricing | https://docs.stripe.com/tax |
| mor.lemonsqueezy | https://www.lemonsqueezy.com/ | https://docs.lemonsqueezy.com/migration |
| mor.paddle | https://www.paddle.com/ | https://vendors.paddle.com/signup |
| mor.stripe.managed | https://stripe.com/managed-payments | https://docs.stripe.com/payments/managed-payments/set-up |
| es.us_first | https://stripe.com/pricing | https://dashboard.stripe.com/register |
| es.jp_en | https://next-intl.dev/ | https://next-intl.dev/docs/getting-started |
| es.mor_first | https://www.paddle.com/pricing | https://vendors.paddle.com/signup |

Note: `es.jp_en` currently points at https://www.npmjs.com/package/next-intl. The official next-intl site is next-intl.dev. That URL is from memory and has not been checked; verify it.

---

## 5. Could not verify
- **All live page reads.** The proxy blocks every vendor host, so all numbers come from the search index's text of official pages. Nothing should flip to `verified: true` until someone reads the live pages.
- **Stripe Tax Complete prices** ($90/$430/$1,000/$1,500 per month): consistent across stripe.com/tax/pricing and the support page in the index, but not read live. Keep `verified: false`.
- **Stripe US dispute countered fee $15:** the index labels the pricing-page copy as older. The support FAQ confirms the fee exists but gives no amount.
- **Stripe Japan international-card rate:** the Japan page shows "3.6% domestic cards"; no separate international rate was found.
- **Stripe Managed Payments eligible business locations:** the country count conflicts (37 vs 39), and Japan is only confirmed by secondary sources. The JP domestic-tax carve-out is official.
- **Lemon Squeezy 1.5% migration promo:** the FAQ says merchants "may" get it, so it is conditional.
- **Adyen Visa/MC markup:** 0.60% vs 0.80% (US) needs a live check.
- **Paddle "$10 未満は個別相談":** possibly old FAQ wording.
- **PAY.JP payout fee 250円/回, Square Plus $49/月, Polar dispute $15:** not re-seen.
- **KOMOJU:** the final investigation report (CRM breach scope) is not yet published.

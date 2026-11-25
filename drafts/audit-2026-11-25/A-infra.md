# A-infra — infra / ops audit (backend, ci, cost_control, protection, storage, monitoring, uptime)

Audited 2026-11-23. 22 options checked. Repo files are unchanged (read only).

**Network access in this session:** vercel.com and cloud.google.com/run/pricing could be read directly.
- GitHub docs, Supabase docs, Cloudflare docs and Sentry docs were read from their official source repositories on GitHub (github/docs, supabase/supabase, cloudflare/cloudflare-docs, getsentry/sentry-docs at HEAD on 2026-11-23). These repositories are the sources of docs.github.com, supabase.com/docs, developers.cloudflare.com and docs.sentry.io.
- These hosts were blocked by the proxy: sentry.io, mux.com, firebase.google.com, uptimerobot.com, betterstack.com, instatus.com, docs.cloud.google.com, nextjs.org and supabase.com. For these, the only evidence is a WebSearch snippet limited to the vendor's own domain. Every row that rests on that kind of evidence is marked **(search snippet)** and given confidence med or low.

File abbreviations: CAT = `skill/blueprint/catalog/<file>.yaml`, SC = `skill/blueprint/elements/stack_comparisons.yaml`, TA = `skill/blueprint/elements/tactics.yaml`.

---

## be.route-handlers

| id | field (file:key) | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| be.route-handlers | CAT backend: avoid_when | `''` (empty) | The field is empty, so it gives the reader no decision axis | `1 回の処理が 300 秒（Pro 800 秒）を超える時、画面のないスマホアプリだけの時` | https://vercel.com/docs/functions/limitations "Hobby: 300s default and maximum. Pro and Enterprise: 300s default, 800s maximum" | high |
| be.route-handlers | CAT backend: limits | `…リクエスト本文は 4.5 MB まで` | The limit is correct. The text omits that Pro now has an opt-in for larger bodies (public beta) | `…リクエスト本文は 4.5 MB まで（Pro で 4 GB メモリにすると 20 MiB まで・ベータ）` | same page: "Request bodies up to **20 MiB** are available in **Public Beta**… Set your project's function memory to **Performance (4 GB)**, available on Pro" | high |

Checked and unchanged:
- Hobby: 4 CPU-hours, 360 GB-hours and 1M invocations per month.
- Pro: $20 per month, which includes $20 of credit. Overage: Active CPU $0.128/hour, memory $0.0106/GB-hour, invocations $0.60 per 1M.
- Hobby is non-commercial only. The Vercel Terms say: "You shall only use the Services under a Hobby plan for your personal or non-commercial use" (https://vercel.com/legal/terms).

## be.cloud-run

| id | field | current text | issue | proposed text | evidence | conf |
|---|---|---|---|---|---|---|
| be.cloud-run | CAT backend: pricing_bands.usd5 | `従量（単価は料金ページが読めず未確認）。請求は 2 方式：…` | The unit prices can now be read from the pricing page | `従量（us-central1）：リクエスト課金 CPU $0.000024/vCPU秒・メモリ $0.0000025/GiB秒・$0.40/100万リクエスト。インスタンス課金 CPU $0.000018/vCPU秒・メモリ $0.000002/GiB秒（無料枠 24万 vCPU秒・45万 GiB秒/月）` | https://cloud.google.com/run/pricing "CPU (per vCPU-second) Active time $0.000024 … Memory (per GiB-second) Active time $0.0000025 … Requests (per 1,000,000) $0.40"; "instance-based billing Free tier: CPU - First 240,000 vCPU-seconds free per month RAM - First 450,000 GiB-seconds"; instance-based "CPU $0.000018 … Memory $0.000002" | high |
| be.cloud-run | CAT backend: pricing_bands.free | `…北米からの送信 1 GB。超えた分は従量課金` | The pricing page says "within North America", in GiB | `…北米内への送信 1 GiB/月。超えた分は従量課金` | same page: "a free tier of 1GiB free data transfer within North America per month" | high |
| be.cloud-run | CAT backend: avoid_when | `''` | The field is empty | `画面と同じ Next.js で足りる時（コンテナ作成・公開作業・監視が別に要る）` | — (framing) | high |
| be.cloud-run | CAT backend: limits | `…超過は自動で課金されるので予算アラートを設定` | Since 2026-10-12, Cloud Run can be stopped automatically with a spend-cap budget | `…超過は自動で課金。予算の「spend cap」で Cloud Run を自動停止できる（2026-10 GA・プロジェクト×サービス単位）` | (search snippet) docs.cloud.google.com/run/docs/release-notes "support for Budget spend caps to pause your Cloud Run workloads is in General Availability (GA)" (Oct 12, 2026); docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps lists Cloud Run, Cloud Run functions, Gemini API and Agent Platform | med |
| be.cloud-run | CAT backend: source.url / verified note | url = free-cloud-features page; note `…単価…は未確認` | The pricing page itself is now readable | url `https://cloud.google.com/run/pricing`. Note: `無料枠・単価とも 2026-11-23 に料金ページで確認` | as above | high |
| be.cloud-run | SC backend: services[be.cloud-run].paid_entry | `使った分だけ（単価は料金ページ本文が読めず未確認 2026-11-03）。リクエスト課金とインスタンス課金の 2 方式` | Same as the catalog | `使った分だけ：CPU $0.000024/vCPU秒・メモリ $0.0000025/GiB秒・$0.40/100万リクエスト（リクエスト課金・us-central1）。インスタンス課金もあり` | as above | high |

## ci.github-actions

The catalog entry is unchanged. Checked against the docs source (github/docs `content/billing/concepts/product-billing/github-actions.md` and `data/reusables/billing/actions-included-quotas.md`):
- Free plan: $12 included per month, which is about 2,000 minutes on Linux.
- Linux 2-core costs $0.006/min. macOS costs $0.062/min.
- Free plan artifact storage is 500 MB.
- The docs say: "If your account does not have a valid payment method on file, usage is blocked once you consume the included compute usage."

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| ci.github-actions | SC ci: switch_points[1].when | `非公開リポジトリでテストが月 1,500分を超える` | 1,500 minutes is about 75% of the $12 allowance, so the reason for that threshold is unclear. Use 80% to match the other switch points | `非公開リポジトリでテストが月 1,600分（無料 $12≒2,000分の8割）を超える` | as above | high |
| ci.github-actions | CAT ci_cd: source.url | `…/billing/concepts/product-billing/github-actions` | still valid | (no change) | — | — |

## ci.vercel-git

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| ci.vercel-git | CAT ci_cd: limits | `Hobby はビルド機が基本のみ` | The text omits the deploy cap and the commercial-use rule | `Hobby：ビルド機は基本のみ（2 vCPU・8 GB）・1 日 100 デプロイ・非商用のみ。Pro は 1 日 6,000` | https://vercel.com/docs/plans/hobby: "Build vCPUs 2", "Build memory (GB) 8", "Deployments per day 100 / 6,000"; Terms: Hobby "personal or non-commercial use" | high |
| ci.vercel-git | SC ci: services[ci.vercel-git].free_tier | `Hobby に含まれる（変更ごとの確認用ページ・自動公開）` | The commercial-use rule is missing | `Hobby に含まれる（変更ごとの確認用ページ・自動公開。Hobby は非商用のみ）` | Vercel Terms (above) | high |
| ci.vercel-git | TA ci / SC ci: framing | The question is framed as "pick one": `ci.vercel-git` vs `ci.github-actions` | A beginner may read these as alternatives. They do different jobs: Vercel Git does preview and publish, and GitHub Actions runs tests. The SC `combine` already says to use both | add to SC ci rejected[ci.github-actions].why: `選ぶものではなく足すもの。テストを書いたら Vercel 連携に重ねる（無料枠内）` | framing | med |

## cc.vercel-spend

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| cc.vercel-spend | CAT cost_control: what | `チームの月額上限を決め、50/75/100% で通知。上限で本番デプロイを止められる` | Budgets can now be set per team, per project or per product. On Pro, the team budget counts only usage above the $20 credit | `チーム・プロジェクト・製品ごとに予算を決め、50/75/100% で通知。チームかプロジェクトの予算で本番を止められる` | https://vercel.com/docs/spend-management "A budget can cover your whole team, one project, one product…"; "Team and project budgets can automatically pause production deployments… Product and organization budgets can't pause" | high |
| cc.vercel-spend | CAT cost_control: pricing_bands.usd100 | `Pro $20/月に含まれる（Enterprise は Flexible Commitment が必要）` | The default budget for new Pro teams is missing | `Pro $20/月に含まれる。新規 Pro は $200 の予算（通知）が既定。チーム予算は $20 クレジットを超えた分だけ数える` | https://vercel.com/docs/plans/pro-plan "By default, Vercel enables spend management notifications for new customers at a spend amount of $200 per billing cycle"; spend-management: "On Pro, a team budget only counts usage beyond the monthly credit" | high |

The limits are unchanged and confirmed by the docs:
- The spend check runs every few minutes.
- "It does not stop AI Gateway API key usage". Storage charges continue while paused.
- SMS alerts are sent only at 100%.

## cc.supabase-spend-cap

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| cc.supabase-spend-cap | CAT cost_control: best_for | `Supabase Pro で請求を $25 に固定したい時` | Misleading. The cap does not cover compute, so each extra project (about $10/month) and any compute upgrade is still billed. The bill is not fixed at $25 | `Supabase Pro で使用量の超過課金を止めたい時（計算・追加プロジェクトは対象外）` | supabase/supabase `apps/docs/content/guides/platform/cost-control.mdx`: "Usage items not covered by the Spend Cap: Compute, Branching Compute, Read Replica Compute, Custom Domain, … IPv4 address, Log Drain…, Multi-Factor Authentication Phone, Point-in-Time-Recovery"; billing-faq.mdx: "Each paid organization comes with $10 in Compute Credits to cover one project… Additional projects start at ~$10 a month" | high |
| cc.supabase-spend-cap | CAT cost_control: avoid_when | `…計算・ブランチ・独自ドメイン・PITR は対象外` | The list of excluded items is incomplete | `…計算・ブランチ・リードレプリカ・独自ドメイン・IPv4・ログ転送・電話 MFA・PITR は対象外` | same | high |
| cc.supabase-spend-cap | CAT cost_control: what | `…上限を超えた項目（ディスク・転送・保存・Realtime）は翌請求期まで止まり…` | Correct but incomplete. Auth MAU, Edge Functions and logs are also covered | `…上限を超えた項目（ディスク・転送・保存・Realtime・MAU・Edge Functions・ログ）は翌請求期まで止まり…` | cost-control.mdx "Usage items covered by the Spend Cap" | high |
| cc.supabase-spend-cap | CAT/SC: source.url | `https://supabase.com/docs/guides/platform/spend-cap` | The docs page id is now `cost-control`. Could not confirm whether the old URL redirects, because supabase.com was blocked | `https://supabase.com/docs/guides/platform/cost-control#spend-cap` | docs source path | med |

"Pro has the Spend Cap on by default" is confirmed by billing-faq.mdx: "The Pro Plan has a Spend Cap enabled by default".

## cc.ai-gateway-budget

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| cc.ai-gateway-budget | CAT cost_control: limits | `BYOK は対象外。予算は Spend Management とは別` | The entry does not say how the budget stops usage or that it can overshoot | `BYOK は対象外。上限に達すると 402 で拒否（直前の 1 件は通るので少し超える）。予算は日・週・月で設定、Spend Management とは別` | https://vercel.com/docs/ai-gateway/observability-and-spend/budgets "rejects further requests for that scope with an HTTP 402"; "A budget is a soft cap… the request that crosses the limit still completes" | high |

Unchanged:
- Zero markup on tokens.
- Budgets can be set per team, project, API key or user.
- BYOK is excluded from budgets.

## cc.gcp-budget

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| cc.gcp-budget | CAT cost_control: what | `金額のしきい値で通知。通知だけでは止まらない（対応サービスの spend-cap 予算か、自前の自動化で止める）` | The covered services can be named now. Firestore/Firebase is not covered | `金額のしきい値で通知。通知だけでは止まらない。Cloud Run・Gemini API は spend cap 予算で自動停止できる（2026-10 GA）。Firestore は対象外なので自前の自動化で止める` | (search snippet) docs.cloud.google.com/billing/docs/how-to/budgets-spend-caps lists "Gemini API, Gemini Enterprise Agent Platform (formerly Vertex AI), Cloud Run, Cloud Run functions"; the alerts-only budget "doesn't automatically cap … usage or spending" | med |
| cc.gcp-budget | CAT cost_control: limits | `アラートのみの予算は使用を止めない（公式）` | add spend-cap caveats | `アラートのみの予算は使用を止めない。spend cap も即時ではなく超過分は請求され、ストレージ等の常時課金は止まらない` | (search snippet) same page: "Enforcement isn't instant and any cost overages are billed as normal… don't pause ongoing, fixed usage associated with persistent resources" | med |

## cc.github-actions-budget

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| cc.github-actions-budget | CAT cost_control: limits | `「上限で停止」を選ばないと通知だけ` | Not true for personal accounts. User-level budgets always stop at the limit | `組織の予算は「上限で停止」を選ばないと通知だけ（個人アカウントの予算は常に停止）。作成前の使用分は数えない` | github/docs `content/billing/how-tos/set-up-budgets.md`: "This option is not available for user-level budgets, which always enforce a hard stop"; budgets-and-alerts.md: "the budget applies only to metered usage from the date of its creation onwards" | high |
| cc.github-actions-budget | CAT/SC: source.url | `https://docs.github.com/en/billing/managing-billing-for-your-products/managing-billing-for-github-actions/managing-your-spending-limit-for-github-actions` | This is an old redirect path | `https://docs.github.com/en/billing/how-tos/set-up-budgets` | set-up-budgets.md `redirect_from` contains the old path | high |

Thresholds of 75%, 90% and 100% are confirmed.

## sec.vercel-firewall

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| sec.vercel-firewall | CAT security: limits | `高度なルールは Enterprise` | Out of date. The OWASP core ruleset and bot signals are available on Pro through the Priority projects add-on | `OWASP ルール・ボット詳細は Pro の追加（Priority projects）か Enterprise` | https://vercel.com/docs/vercel-firewall "Priority projects are an add-on for Pro and Enterprise teams… The OWASP core ruleset … on Pro" | high |
| sec.vercel-firewall | CAT security: pricing_bands.free | `Hobby：カスタムルール3、DDoS 緩和込み` | IP blocks and the rate-limit allowance are missing | `Hobby：カスタムルール3・IP 遮断10・回数制限 月100万回、DDoS 緩和込み（Hobby は非商用のみ）` | https://vercel.com/pricing: "IP blocking: Hobby up to 10"; "Rate limiting: Hobby includes 1M allowed requests/month" | high |
| sec.vercel-firewall | CAT security: liability_compliance | `SOC2 Type2・ISO27001（ホストとして）` | The security page lists more frameworks and does not name the SOC 2 type | `SOC 2・ISO 27001・PCI DSS・HIPAA（BAA は Pro で月 $350 の追加）（ホストとして）` | https://vercel.com/security lists ISO 27001, ISO 42001, SOC 2, PCI DSS, HIPAA, GDPR, DPF; pro-plan doc "HIPAA BAA … $350/month" | med |
| sec.vercel-firewall | SC protection: switch_points[0].why | `無料は独自ルール3つだけで足りない。` | Hobby already includes 1M rate-limited requests | `無料は独自ルール3つ・回数制限 月100万回まで。ルールが足りない・商用になったら Pro` | pricing page | high |

## sec.turnstile

The entry is unchanged. Checked against cloudflare-docs `src/content/docs/turnstile/plans.mdx`:
- Up to 20 widgets.
- Unlimited challenges.
- 10 hostnames per widget.
- 7 days of analytics.

The page also says Free is "best for … Small to medium businesses … Most production applications", so commercial use is OK.

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| sec.turnstile | SC protection: services[sec.turnstile].free_tier | `無料：確認回数無制限・20個まで・1つにつき 10ドメイン` | The official unit is hostnames, not domains (the catalog already says ホスト名) | `無料（商用可）：確認回数無制限・ウィジェット 20 個・1 つにつき 10 ホスト名` | plans.mdx "Hostname management: 10 hostnames per widget" | high |

## sec.secrets

The entry is unchanged. The Vercel "Secret" type is write-only after saving, as the docs say: "Secret values are write-only after saving" (https://vercel.com/docs/environment-variables/sensitive-environment-variables).

Optional addition to `security`: `本番だけ別の値にする方針（Separate Production Secret Values）をオン`. Evidence is the same page: "Require Separate Values". Confidence: med.

## st.supabase-storage

The entry is unchanged. Checked against the docs source:
- Free: 1 GB storage, 50 MB max file size.
- Pro: 100 GB storage, files up to 500 GB, 100 image transformations, then $5 per 1,000.
- Free egress: 5 GB.

Sources: `_partials/billing/pricing/pricing_storage_size.mdx`, `guides/storage/uploads/file-limits.mdx`, `manage-your-usage/egress.mdx`.

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| st.supabase-storage | CAT storage_media: pricing_bands.free | `Free：1GB、1ファイル50MBまで` | The catalog leaves out egress, which the SC states | `Free：1GB・転送 5GB/月・1ファイル50MBまで（画像変換なし）` | egress.mdx "Free 5 GB / 5 GB"; image transformations quota table lists Pro/Team only | high |

## st.vercel-blob

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| st.vercel-blob | CAT storage_media: avoid_when | `ファイルごとに細かく見られる人を決めたい時` | Out of date and misleading. Private Blob stores are now generally available. The real trade-off: there is no database-level policy like Supabase RLS. Your own route has to check who may read each file on every request | `閲覧権限を DB のルール（RLS）でまとめて書きたい時（非公開ストアは自分の API で毎回確認して配る）` | https://vercel.com/docs/vercel-blob/private-storage "Private Blob stores require authentication for all read and write operations… create a route that authenticates the request, fetches the blob…" (changelog: "Vercel Private Blob is now generally available") | high |
| st.vercel-blob | CAT storage_media: security | `公開URLの推測に注意` | Since private stores exist, use one | `人に見せないファイルは非公開ストアに置き、配信の API で毎回認可` | same | high |
| st.vercel-blob | CAT storage_media: pricing_bands.free | `Hobby：1GB、読み1万回` | Incomplete, and the commercial-use rule is missing | `Hobby：1GB・読み取り 1万回・書き込み 2千回・転送 10GB/月（非商用のみ）` | https://vercel.com/docs/vercel-blob/usage-and-pricing table: 1GB/month, First 10,000, First 2,000, First 10 GB | high |
| st.vercel-blob | CAT storage_media: limits | `—` | The Hobby lockout is not stated | `Hobby は上限を超えると 30 日間使えない。非公開ファイルの配信は関数経由で転送料が増える` | same page: "you will not be able to access Vercel Blob if limits are exceeded… wait until 30 days have passed" | high |
| st.vercel-blob | CAT storage_media: pricing_bands.usd100 | `Pro：$0.023/GB` | Operation prices are missing | `Pro：保存 $0.023/GB・読み $0.35/100万回・書き $4.50/100万回〜（地域で変わる）` | https://vercel.com/pricing "Simple Operations… Pro starts at $0.35 per 1M… Advanced Operations… $4.50 per 1M" | high |
| st.vercel-blob | SC storage: recommendation.rejected[st.vercel-blob].why | `手軽だが、ファイルごとの細かい閲覧権限を自分で作る必要がある。` | Partly right. Replace with the concrete axis | `非公開ストアはあるが、誰が見られるかの判定を自分の API に毎回書く（DB のルールと別管理）。Hobby は非商用のみ` | as above | high |

## st.mux

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| st.mux | SC storage: services[st.mux].free_tier | `動画の取り込み無料・視聴 月10万分無料・毎月 $20 分の利用枠` | Mixes two plans. The $20 monthly credit belongs to Pay-as-you-go, not the Free plan. The Free plan stores at most 10 videos | `無料プラン：動画 10 本まで保存・視聴 月10万分無料（カード不要）。カード登録の従量は毎月 $20 分の利用枠` | (search snippet) mux.com/blog/free-plan and mux.com/docs/changelog/video-free-plan: "store up to 10 video assets… 100,000 free delivery minutes per month"; mux.com/pricing: "Pay as you go also includes a $20 monthly usage credit" | med |
| st.mux | CAT storage_media: pricing_bands.free | `従量：毎月 配信10万分 無料、エンコード無料（1080p basic）` | The 10-video cap is missing. Also, the free delivery minutes are no longer limited to 1080p | `無料プラン：動画 10 本まで・配信 月10万分無料（画質の上限なし）・エンコード無料` | (search snippet) same, "those minutes aren't capped at 1080p anymore" | med |
| st.mux | CAT storage_media: usd5/usd100 storage and delivery rates | `保存 $0.003/分/月` / `配信は10万分超で $0.001/分` | Snippets give 720p rates of storage $0.0024/min and delivery $0.0008/min. The catalog figures may be 1080p rates. Could not read the page | keep. Add `（1080p の場合。720p は安い）` only after the page is checked | (search snippet) "basic-quality 720p storage is $0.002400 per minute… Delivery at 720p starts at $0.000800" | low |

## mon.sentry

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| mon.sentry | SC monitoring: switch_points[1].when | `エラーが月4万件（無料 5万の8割）` | Inconsistent with the catalog (Developer: 5,000 errors/month). 50k is the quota included with **paid** plans | `エラーが月4,000件（無料 5,000の8割）` | getsentry/sentry-docs `docs/pricing/index.mdx`: "Each paid plan comes with … 50k errors"; catalog mon.sentry free: `エラー5,000/月` (verified 2026-11-03) | med |
| mon.sentry | SC monitoring: recommendation.reason | `無料でエラー月5万件、ウェブもアプリも1か所で見られる。2人目が入ったら $26/月。` | Wrong number (it is the paid quota), and the price is unlabelled | `無料（1人・エラー月5,000件）でウェブもアプリも1か所で見られる。2人目から Team $26/月（年払い、月払い $29）。` | same; search snippet from sentry.io/pricing: "$26/mo when billed annually… $29 monthly" | med |
| mon.sentry | SC monitoring: switch_points[0].upgrade_to | `Sentry Team $26/月` | The billing period is unlabelled | `Sentry Team $29/月（年払い $26）` | (search snippet) sentry.io/pricing | med |

The Developer free numbers (1 user, 5,000 errors/month) could not be read directly, because sentry.io was blocked and the docs say only "similar presets". The catalog entry is otherwise unchanged.

## mon.crashlytics

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| mon.crashlytics | CAT monitoring: avoid_when | `ウェブだけのサービス（ウェブのエラーは集められない）` | Out of date. Crashlytics added web apps (Preview) on 2026-11-12. Web is billed at Google Cloud rates and needs Blaze, while mobile stays free | `ウェブが主役の時（ウェブ対応は 2026-11 にプレビュー開始・Google Cloud の従量で Blaze 必須。安定するまでは Sentry）` | (search snippet) firebase.google.com/support/releases "Firebase Crashlytics now supports web apps (in Preview)" (Nov 12, 2026); firebase.google.com/products/crashlytics "For mobile apps, there's no cost to using Crashlytics. Web apps use Google Cloud pricing." | med |
| mon.crashlytics | CAT monitoring: pricing_bands.free/usd* | `無料` | Free only for mobile | `アプリは無料（ウェブはプレビュー・Google Cloud の従量）` | same | med |
| mon.crashlytics | SC monitoring: services[mon.crashlytics].free_tier | `無料（アプリの落ち方の収集）` | same | `アプリは無料（落ち方の収集）。ウェブは 2026-11 からプレビュー・従量` | same | med |
| mon.crashlytics | SC monitoring: rejected[mon.crashlytics].why | `アプリだけなら無料で十分。ウェブは見られない。` | No longer strictly true | `アプリだけなら無料で十分。ウェブはプレビュー段階で有料（Blaze）なので、ウェブもあるなら Sentry 1 つの方が楽。` | same | med |

## mon.vercel-observability

The entry is unchanged. The pricing page confirms:
- Hobby keeps logs for 1 hour.
- Pro keeps logs for 1 day.
- Observability Plus keeps 30 days, at $1.20 per 1M events.

## mon.uptimerobot

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| mon.uptimerobot | CAT monitoring: pricing_bands.free | `Free：50 モニター・5 分間隔・ステータスページ 1・保持 3 か月` | The commercial-use rule matters here | `Free（商用可）：50 モニター・5 分間隔・ステータスページ 1・保持 3 か月` | (search snippet) uptimerobot.com/terms and /terms-fair-use: free plan usable "for any use, including commercial and business use"; pricing page: "Free $0/month, good for personal and commercial projects" | med |
| mon.uptimerobot | CAT monitoring: pricing_bands.usd100 | `Team $46/月（年払い $39）：3 席・30 秒・ページ 100` | Snippets of the pricing page conflict: one shows "$39 then $33/month… 3 seats", an older one shows "$41 then $35". Could not verify | keep, and mark `verified: false` until read | (search snippet) uptimerobot.com/pricing | low |
| mon.uptimerobot | CAT monitoring: pricing_bands.usd10 | `Solo $13/月（年払い $12）：60 秒間隔・ページ 3` | The price matches the snippet. The snippet says Solo has **10 monitors**, fewer than Free's 50, and a beginner would not expect that | `Solo $13/月（年払い $12）：10 モニター・60 秒間隔・ページ 3` | (search snippet) "$13 then $12/month for 10 monitors, with 60-second monitoring intervals" | low |

## mon.betterstack

| id | field | current | issue | proposed | evidence | conf |
|---|---|---|---|---|---|---|
| mon.betterstack | CAT monitoring: limits | `無料の確認間隔はページに明記なし（製品全体で最短 30 秒）` | The docs give the free interval | `無料は 3 分間隔（有料で最短 30 秒）` | (search snippet) betterstack.com/docs/uptime/check-frequency: "frequency options range from 3 minutes for free plans to 30 seconds for paid plans" | med |
| mon.betterstack | CAT monitoring: pricing_bands.usd100 | `追加 50 モニター $25/月（年払い $21）／追加の公開ページ $15/月（年払い $12）` | The entry recommends Better Stack for on-call, but on-call phone/SMS needs a paid Responder seat, which the entry does not mention | `オンコール担当 1 人 $34/月（年払い $29）・電話/SMS 無制限。追加 50 モニター $25/月（年払い $21）／追加ページ $15/月（年払い $12）` | (search snippet) betterstack.com/pricing: "Responder (Uptime + Telemetry) seat at $34/month, or $29/month billed yearly… unlimited phone call and SMS alerts" | med |
| mon.betterstack | SC uptime: switch_points[0].why | `無料のまま当番表が持てる。` | Probably wrong, because phone/SMS on-call needs the Responder seat | `当番表と電話・SMS 通知が一体（担当 1 人 $34/月、年払い $29）。` | same | low |
| mon.betterstack | SC uptime: services[mon.betterstack].paid_entry | `追加 50 モニター $25/月` | same | `オンコール担当 $34/人/月（年払い $29）／追加 50 モニター $25/月` | same | med |

## sup.status (Instatus)

The entry is unchanged. Evidence is low: only instatus.com blog posts were reachable through search. They agree on Starter (15 monitors, 2-minute checks, 200 subscribers) and Pro at $20/month (50 monitors, 30-second checks, SMS, custom domain). The pricing page itself could not be read, so `verified` should stay as-is only if the team accepts the 2026-11-02 check.

## scale.t4

The entry is unchanged. Its cost is explicitly marked as an estimate, and no official source exists for the dollar range. Optional: add `source.url` for the official SOC 2 description, https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 (not reachable from this session).

---

## pick_when rejected (item 4)

### TA backend, pick_when `{platform: app}` → be.cloud-run

The current reason_ja is OK: `スマホアプリには画面側のサーバーがないので、独立した置き場所が要る。` Proposed `rejected`:
- be.route-handlers: `画面が無いのに Next.js を置くと、API のためだけにホストを契約することになる（Hobby は非商用のみ）。`
- be.supabase-edge: `データの置き場所が Supabase なら第一候補。Firebase なら Cloud Run の方が同じ Google 内で権限がそろう。`
- be.cloudflare-workers: `安いが Node.js の一部 API が使えず、1 回の CPU 時間に上限（無料 10 ms）がある。`

### TA monitoring, pick_when `{platform: app}` → mon.crashlytics

Proposed reason_ja: `スマホアプリの落ち方を無料・回数無制限で集められる。` Proposed `rejected`:
- mon.sentry: `アプリだけなら Crashlytics で足りる。2 人以上で見る・ウェブもある時に Sentry（無料は 1 人）。`
- mon.vercel-observability: `サーバー側のログだけ。アプリの落ち方は見られない。`

### TA cost_control, pick_when `{platform: app}` → cc.gcp-budget

The current reason_ja is accurate: Firestore is not covered by GCP spend caps. Proposed tweak: `…Firestore は自動停止の対象外なので、通知を受けて止める仕組みを先に作る。Cloud Run は spend cap 予算で止められる。` Proposed `rejected`:
- cc.vercel-spend: `Vercel を使わないアプリだけなら対象がない。ウェブも Vercel に置くなら併用。`
- cc.supabase-spend-cap: `データの置き場所が Supabase の時だけ。Firebase なら関係ない。`
- cc.ai-gateway-budget: `AI を Vercel AI Gateway 経由で呼ぶ時だけ。その時は併用。`
- cc.github-actions-budget: `CI の分数だけ。アプリのビルドは EAS 側の費用なので別に見る。`

---

## urls

| id | site_url | start_url | verified |
|---|---|---|---|
| be.route-handlers | https://nextjs.org/ | https://nextjs.org/docs/app/api-reference/file-conventions/route | not reachable here. The doc source exists in vercel/next.js `docs/01-app/03-api-reference/03-file-conventions/route.mdx` (200) |
| be.cloud-run | https://cloud.google.com/run | https://docs.cloud.google.com/run/docs/quickstarts | site 200; the start URL is the 301 target of cloud.google.com/run/docs/quickstarts |
| ci.github-actions | https://github.com/features/actions | https://docs.github.com/en/actions/get-started/quickstart | proxy-blocked; the doc source exists in github/docs `content/actions/get-started/quickstart.md` |
| ci.vercel-git | https://vercel.com/docs/git | https://vercel.com/new | both 200 |
| cc.vercel-spend | https://vercel.com/docs/spend-management | https://vercel.com/signup (then Settings → Billing → Spend Management) | both 200 |
| cc.supabase-spend-cap | https://supabase.com/docs/guides/platform/cost-control | https://supabase.com/dashboard/org/_/billing | not reachable (supabase.com blocked); the doc id `cost-control` was confirmed in the source |
| cc.ai-gateway-budget | https://vercel.com/ai-gateway | https://vercel.com/docs/ai-gateway/observability-and-spend/budgets | both 200 |
| cc.gcp-budget | https://docs.cloud.google.com/billing/docs/how-to/budgets | https://console.cloud.google.com/billing/budgets | site is the 301 target of cloud.google.com; console blocked |
| cc.github-actions-budget | https://docs.github.com/en/billing/how-tos/set-up-budgets | https://github.com/settings/billing/budgets | not reachable; the doc path was confirmed in the source |
| sec.vercel-firewall | https://vercel.com/security/web-application-firewall | https://vercel.com/docs/vercel-firewall | both 200 |
| sec.turnstile | https://www.cloudflare.com/application-services/products/turnstile/ | https://developers.cloudflare.com/turnstile/get-started/ | blocked; the doc source exists (cloudflare-docs `turnstile/get-started/index.mdx`) |
| sec.secrets | https://vercel.com/docs/environment-variables | https://vercel.com/docs/environment-variables/sensitive-environment-variables | both 200. GCP alternative: https://cloud.google.com/security/products/secret-manager (200) |
| st.supabase-storage | https://supabase.com/storage | https://supabase.com/docs/guides/storage/quickstart | blocked; the doc source exists (`guides/storage/quickstart.mdx`) |
| st.vercel-blob | https://vercel.com/storage/blob | https://vercel.com/docs/vercel-blob | both 200 |
| st.mux | https://www.mux.com/ | https://dashboard.mux.com/signup | not reachable |
| mon.sentry | https://sentry.io/ | https://sentry.io/signup/ | not reachable |
| mon.crashlytics | https://firebase.google.com/products/crashlytics | https://firebase.google.com/docs/crashlytics/get-started | not reachable (both appear in official search results) |
| mon.vercel-observability | https://vercel.com/products/observability | https://vercel.com/docs/observability | both 200 |
| mon.uptimerobot | https://uptimerobot.com/ | https://dashboard.uptimerobot.com/sign-up | not reachable |
| mon.betterstack | https://betterstack.com/uptime | https://uptime.betterstack.com/users/sign-up | not reachable |
| sup.status | https://instatus.com/ | https://dashboard.instatus.com/ | not reachable |
| scale.t4 | https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2 | — (no sign-up; it is an audit) | not reachable |

---

## could not verify (hosts blocked; the entry stays as-is or `verified: false`)

- **Sentry Developer free quota:** 1 user and 5,000 errors could not be confirmed. sentry.io was blocked, and the docs say only "similar presets". The Team price ($26 annual / $29 monthly) comes from a search snippet only.
- **UptimeRobot Team price:** snippets conflict ($39/$33, $41/$35, catalog $46/$39). The Solo monitor count (10) is also from a snippet only.
- **Better Stack:** the free check interval (3 min) and the Responder seat ($34/$29) are from snippets only. Commercial use on the free plan is unconfirmed.
- **Instatus:** all numbers come only from instatus.com blog posts. The pricing page was not read.
- **Mux:** the per-minute rates (720p vs 1080p) and the free-plan limit of 10 videos are from snippets only.
- **Firebase Crashlytics web support:** Preview since 2026-11-12, from snippets of firebase.google.com release notes. The pricing page itself was not read.
- **GCP:** the budgets page and the spend-cap service list come from snippets of docs.cloud.google.com. Not read: the minimum memory for instance-based billing (512 MiB, in billing-settings) and the free-cloud-features page.
- **Supabase:** read from the docs source on GitHub, not from the rendered supabase.com/pricing. The Pro $25 price is from the billing-faq example only. Not confirmed whether the old URL `/docs/guides/platform/spend-cap` redirects.
- **Next.js route docs URL:** nextjs.org was blocked. The URL is assumed live because its source file exists.

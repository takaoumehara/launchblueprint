<!-- 原文のまま。社内の語句チェックのため通信会社を表す英単語だけ telecom に置換 -->
I answered from the catalog files and `project.blueprint.yaml` only; I did not use `answers-v1.md` or `claude-err.log`. Every catalog item I cite was checked on **2026-10-26 (today)**, and all files set a 90-day stale limit, so nothing is stale. Items marked `verified: false` or "要確認" (needs checking) are flagged below as unverified. I didn't open any official pages because you asked me to stay inside the folder.

---

**Q1. Phone (SMS) login under $10/month**
Keep **auth.supabase** (already selected). It supports phone SMS login at $0 for up to 50k monthly active users, but you have to sign up with an SMS provider yourself. Using the Twilio prices in the catalog, the fixed cost is about $2.65/month (a $1.15 number plus a $1.50 low-volume campaign fee). Each SMS costs about $0.012–0.013 ($0.0083 plus a $0.0035–0.005 telecom fee), so roughly 550 SMS fit under $10. Extra costs and risks:
- **One-time US registration (A2P 10DLC):** $4.50 brand fee plus $15 vetting. Approval takes up to 5 business days, and sometimes weeks.
- **SMS pumping fraud:** you need protection against it.
- **Phone MFA:** on Supabase this needs Pro at $75/month.

Clerk is out for this budget because SMS needs its $25 Pro plan.
- Sources: auth.yaml `auth.supabase`, `auth.methods.phone_sms`, `auth.clerk` (https://supabase.com/pricing, https://clerk.com/pricing). build_vs_buy.yaml `twilio_sms_us` and `a2p_10dlc` (https://www.twilio.com/en-us/sms/pricing/us, https://help.twilio.com/articles/1260803965530). All checked 2026-10-26, verified.
- Unverified: the catalog doesn't say which SMS providers Supabase supports. Auth0's SMS cost is marked 要確認.

**Q2. Stripe Connect type**
Use **Standard with Direct charges** (`pay.stripe-connect`, option `standard`). With Direct charges, disputes and refunds belong to the organizer (the connected account), and the platform pays no extra Stripe fees. Express was rejected because disputes, fraud and negative balances land on the platform, plus $2 per active account per month and 0.25%+25¢ per payout. Custom was rejected because the platform would carry all KYC and support. Two things are irreversible:
- **Account type:** the account/dashboard type can't be changed after an account is created, and accounts can't be converted to another type.
- **Charge type:** Destination charges would move liability back to the platform, so it has to be Direct charges.

Stripe recommends Accounts v2 / controller properties for new builds.
- Sources: payments.yaml `pay.stripe-connect` (https://docs.stripe.com/connect/accounts, https://docs.stripe.com/connect/migrate-to-controller-properties, https://stripe.com/connect/pricing), checked 2026-10-26, verified. Blueprint rule R-006.

**Q3. Stale or unverified items**
Stale: **none**. Every `checked` date is 2026-10-26 and every file uses `stale_after_days: 90`.

Unverified (`verified: false`, `checked: null`):
- **fe.nextjs**
- **fe.astro**
- **be.route-handlers**
- **be.cloud-run**
- **se.postgres-fts**
- **sec.turnstile**
- **sec.secrets**

Three of these are currently selected: fe.nextjs, be.route-handlers and se.postgres-fts.

Fields marked 要確認 inside otherwise verified entries:
- auth.clerk and auth.stytch: anonymous login
- auth.auth0: SMS cost
- Apple sign-in note: App Store guideline 4.8
- host.cloudflare-pages: liability/compliance
- ai.firebase-ai-logic: free tier
- an.vercel-analytics: whether cookie consent is needed
- be.cloud-run: paid pricing bands

Also, the blueprint cites rules R-004, R-006 and R-012, but there's no rules-ledger file in the folder, so I couldn't read their text.

**Q4. Missed-call text-back for 3 clients: Twilio vs GoHighLevel**
- **Twilio (build it yourself on the API):**
  - One-time: about $58.50 (3 × $19.50 A2P fees).
  - Monthly fixed: about $7.95 (3 × ($1.15 number + $1.50 campaign)), plus $0–25 server.
  - Usage: about $0.013 per text, plus $0.0085/min if inbound calls are answered.
  - Example: 100 texts per client is about $4/month, so roughly **$12–37/month plus your maintenance time**.
- **GoHighLevel:**
  - Monthly: Starter is **$97/month**, which covers exactly 3 client sub-accounts.
  - Usage: SMS at $0.00747 plus the telecom fee.
  - One-time: an A2P bundle of $22.50–64.
  - Example: about **$100/month**, rising to $297 Unlimited for a 4th client.
- **Recommendation:** Twilio. Rule R-016 says communications should default to the API route, and Twilio is about $60–85/month cheaper. Choose GoHighLevel only if you haven't validated demand yet and also want its built-in CRM and review tools to start selling first; there's a 14-day trial. The A2P registration wait applies on both paths.
- Sources: build_vs_buy.yaml `bvb.api`, `bvb.platform`, `twilio_sms_us`, `twilio_voice_us`, `a2p_10dlc`, `gohighlevel` (https://www.gohighlevel.com/pricing and the Twilio URLs above), verified 2026-10-26. blueprint-v3.md §16.
- Not in catalog: your hourly rate, maintenance hours and AI coding cost, so the break-even point can't be fully calculated.

**Q5. Passkeys**
- **Full support:** Auth0 and Stytch.
- **On paid tiers only:** Clerk (Pro and up) and Cognito (Essentials and up).
- **Better Auth:** via a plugin (`@better-auth/passkey`).
- **Firebase:** not offered; its public request page mentions a preview planned for Q1 2027.
- **Your current pick, auth.supabase:** **beta only**, public since 2026-05 and needing an experimental flag. That isn't production-grade.

Passkeys also need a separate account-recovery method.
- Sources: auth.yaml providers' `support.passkeys`, plus `passkey_source` for Supabase (https://supabase.com/docs/guides/auth/passkeys) and Firebase (https://firebase.uservoice.com/…46647016…). Checked 2026-10-26, verified.

**Q6. Vercel Hobby**
**No.** Hobby is for personal, non-commercial use only, and this is a commercial project. The blueprint already says Pro at $20/month is required (R-004), which is outside your $10 target. The cheapest alternative is **host.cloudflare-pages** on Workers Paid at **$5/month**: commercial use is allowed and there are no transfer fees. The trade-offs:
- **Next.js features need checking:** ISR and image optimization depend on the host, and the fe.nextjs source is unverified.
- **Compliance is unknown:** Cloudflare's liability/compliance entry is 要確認.
- **Vercel-tied picks would need replacing:** sec.vercel-firewall and ci.vercel-git.
- Sources: hosting.yaml `host.vercel` (https://vercel.com/pricing) and `host.cloudflare-pages` (https://developers.cloudflare.com/workers/platform/pricing/), checked 2026-10-26, verified.

**Q7. Supabase free-tier pause**
On the free tier, a project pauses after a week with no activity and has no backups. Auth, storage and realtime all run inside that same project. So if the app is idle for a week between events, everything goes down together: login, images and live seat counts. Avoiding that means **Pro at $25/month**: no pausing, 8GB, and daily backups kept for 7 days. There is no $5 or $10 tier, so this alone breaks the $10 target. Point-in-time recovery is $100/month.
- Source: database.yaml `db.supabase` (https://supabase.com/pricing), checked 2026-10-26, verified.
- Not in catalog: how to restore a paused project and how long it takes.

**Q8. What the project rejects**
- **fe.expo:** native apps are on the not-to-build list.
- **db.firestore:** lots of aggregation and joins, and read-based billing is hard to predict.
- **auth.auth0:** cost jumps sharply past the free tier.
- **pay.stripe-connect express:** disputes, fraud and negative balances fall on the platform, plus $2 per active account per month.
- **pay.stripe-connect custom:** the platform would own all KYC and support.
- **se.algolia:** only a few hundred events, and it bills per keystroke search.
- Source: project.blueprint.yaml `selections` (catalog_version 2026-10-26).

**Q9. What pairs well with db.supabase**
The catalog pairs it with **auth.supabase**, **host.vercel** and **fe.nextjs**, and all three are selected. Caveats: host.vercel only works for this project on Pro at $20 (see Q6), and fe.nextjs's source is unverified. Supabase's own add-ons st.supabase-storage and rt.supabase-realtime list db.supabase as a pairing and are also selected.
- Source: database.yaml `db.supabase.pairs_well_with` (https://supabase.com/pricing), checked 2026-10-26, verified.

**Q10. Switching auth to Clerk**
- **Cost:** Hobby is free up to 50k monthly retained users, but you'd need **Pro at $25/month** ($20/month billed yearly) for SMS, passkeys or MFA. Hobby is also limited to 3 social logins.
- **Fit:** Clerk's own FAQ advises against it for free, high-volume B2C use, which matches the blueprint's note that it gets expensive with many free attendees.
- **Anonymous login:** support is **要確認** (unverified), and the project currently uses it.
- **Migration:** lock-in moves from low (your users sit in your own Postgres) to medium (data can be exported, but you'd depend on Clerk's UI components). You'd have to move users out of Supabase.
- **Process:** first run the impact view (§11). Then mark auth.supabase as `rejected` with "owner change + date" and update its status.
- Sources: auth.yaml `auth.clerk` (https://clerk.com/pricing) and `auth.supabase`, checked 2026-10-26, verified.
- Not in catalog: how Supabase's database access rules (RLS) would work with Clerk logins, and how password hashes would migrate.

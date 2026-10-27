<!-- 原文のまま。社内の語句チェックのため通信会社を表す英単語だけ telecom に置換 -->
I've read all the catalog files; here are the answers.

All dates below are "checked 2026-10-26" unless noted. Today − checked = 0 days, so nothing with a checked date is stale today. Problems come from `verified:false`/`checked:null`, "要確認" (needs checking) fields, and overdue rules.

---

**Q1. Phone (SMS) login under $10/month**
Use **auth.supabase**, which is already selected. Its free tier ($0, 50k MAU) supports phone_sms, but you sign your own contract with an SMS vendor and pay per message. With Twilio that's about $0.0083 plus a $0.0035–0.005 telecom fee per US SMS. US numbers also need A2P 10DLC registration: a one-time $4.50 brand fee and $15 vetting, then $1.50+/month per campaign, with up to 5 business days of waiting (sometimes weeks). Other risks: SMS-pumping fraud needs a defence, and phone *MFA* (not login) costs $75/month on Pro. Clerk needs Pro at $25 for SMS and Firebase needs the pay-as-you-go Blaze plan, so neither fits the band cleanly. Note that the project's current auth methods (google, magic_link, anonymous) don't include phone, so adding it changes the selection.
- Sources: `catalog/auth.yaml` auth.supabase, auth.clerk, auth.firebase and `methods.phone_sms` (https://supabase.com/pricing, https://clerk.com/pricing, https://firebase.google.com/pricing); `build_vs_buy.yaml` twilio_sms_us / a2p_10dlc (https://www.twilio.com/en-us/sms/pricing/us, https://help.twilio.com/articles/1260803965530).
- Freshness: A2P 10DLC is a regulation (30-day TTL), so it's fresh today. Auth0's SMS cost is marked "要確認" (needs checking).

**Q2. Stripe Connect type**
**Standard with Direct charges.** Disputes and refunds then sit with the organizer, Stripe sets the fees, and the platform pays nothing extra. Express puts disputes, fraud and negative balances on you and costs $2 per active account per month plus 0.25%+25¢ per payout. Custom adds KYC and all support. **Irreversible:** an account's type (dashboard type) can't be changed after creation (`lock_in: 変更不可`, "cannot change"). Also, Standard with *Destination* charges moves liability back to the platform, so the charge type matters as much as the account type. Rule **R-006** ("don't design assuming you can change the payment method later") is **review_overdue** (due 2026-10-01) and its source is AI inference, so confirm it with the owner.
- Sources: `catalog/payments.yaml` pay.stripe-connect (https://docs.stripe.com/connect/accounts, https://docs.stripe.com/connect/migrate-to-controller-properties, https://stripe.com/connect/pricing); `project.blueprint.yaml`; `rules.yaml` R-006.

**Q3. Stale or unverified right now**
- **Unverified (`checked: null`, `verified: false`):** fe.nextjs, be.route-handlers and se.postgres-fts (all three **selected**), plus fe.astro, be.cloud-run, sec.turnstile and sec.secrets.
- **Fields marked 要確認 (needs checking):** auth.clerk and auth.stytch `anonymous`, auth.auth0 SMS cost, host.cloudflare-pages `liability_compliance`, an.vercel-analytics `liability_compliance`, ai.firebase-ai-logic `free`, be.cloud-run paid bands, sec.turnstile pricing and limits.
- **Rules:** R-006 is overdue (due 2026-10-01). R-017 is due today (2026-10-26) and needs confirmation. R-012 needs confirmation (due 2026-11-02).
- **Nothing is stale by TTL today.**
- One possible data error: pay.stripe-checkout cites the *Connect* pricing URL.

**Q4. Missed-call text-back for 3 clients**
Assumptions are the catalog defaults: 150 SMS per client, telecom fee about $0.004.
- **In-house (Twilio), cash only:** $25 infra + 3 × ($1.15 number + $1.50 campaign + 150 × $0.0123) ≈ $25 + 3 × $4.50 ≈ **$38.6**, plus AI coding cost. That's ≈ **$139 with $100 AI** or ≈ **$239 with the default $200**.
- **GoHighLevel Starter, cash only:** $97 + 3 × (150 × $0.0115) ≈ **$102**. The catalog's reference figure is about $109.
- **Including time:** in-house adds 10h × $50 = $500 (≈ $739). GoHighLevel adds 3h × $50 = $150 (≈ $252).

**Recommendation: GoHighLevel at 3 clients.** It wins on cash and on time. R-016 also says to use an all-in-one platform to prove revenue before you have a differentiator. Re-run the numbers at the 4th client: Starter only covers 3 sub-accounts, the price jumps to $297, and in-house becomes cheaper on cash. A2P 10DLC is required either way, per client, and the wait applies to both.
- Sources: `build_vs_buy.yaml` (formula, default_assumptions, reference_result, verified_2026_10_26; https://www.twilio.com/en-us/sms/pricing/us, https://www.gohighlevel.com/pricing, https://help.gohighlevel.com/support/solutions/articles/48001223556); `blueprint-v3.md` §16; `rules.yaml` R-016.
- Freshness: maintenance hours, hourly rate and AI cost are assumptions with no recorded actuals.

**Q5. Passkeys**
- **Supported:** auth.auth0 (yes), auth.stytch (yes), auth.clerk (Pro and above, $25), auth.cognito (Essentials and above), auth.better-auth (plugin @better-auth/passkey, confirmed).
- **auth.firebase:** not available; a preview is planned for 2027 Q1.
- **Current selection, auth.supabase:** **beta only** (public since 2026-05, needs an experimental flag), so it isn't production-grade yet.
- Whichever you use, plan a separate account-recovery path.
- Sources: `catalog/auth.yaml` (Supabase passkey page https://supabase.com/docs/guides/auth/passkeys; Firebase https://firebase.uservoice.com/…46647016…; Better Auth https://www.better-auth.com/docs/plugins/passkey).
- Freshness: `support` has a 30-day TTL. It's fresh now and goes stale after 2026-11-25.

**Q6. Vercel Hobby?**
**No.** Hobby is non-commercial only. Rule R-004 (absolute: "always use the company domain for public links") assumes commercial use, so Hobby is out, and the blueprint already notes Pro at $20 per user, which is in the $100 band, above the $10 target. The cheapest alternative is **host.cloudflare-pages**: Workers Paid is $5/month, commercial use is allowed and there are no transfer fees. The Free plan's 100k requests/day and 10ms CPU per request are tight. Trade-offs:
- Some Next.js features need testing.
- Its liability/compliance field is "要確認" (needs checking).
- You'd lose the Vercel-tied selections ci.vercel-git and sec.vercel-firewall.
- Sources: `catalog/hosting.yaml` host.vercel (https://vercel.com/pricing), host.cloudflare-pages (https://developers.cloudflare.com/workers/platform/pricing/); `rules.yaml` R-004; `project.blueprint.yaml`.

**Q7. Supabase free-tier pause**
The free tier pauses a project after **1 week with no activity** and has **no backups**. For an event app, a quiet stretch between events could take the booking site down until someone restores it, and booking data has no backup. Pro is the only fix: **$25/month** for no pausing, daily backups kept 7 days, and 8GB. There's no $5 or $10 band, so this goes over the $10 target. PITR (point-in-time recovery) is another $100/month. How a paused project is restored is not in the catalog.
- Source: `catalog/database.yaml` db.supabase (https://supabase.com/pricing).
- Freshness: `limits` goes stale after 2026-11-25.

**Q8. Rejected items**
- **fe.expo:** native apps are on the Not-to-build list.
- **db.firestore:** lots of aggregation and JOINs, and read-based billing is unpredictable.
- **auth.auth0:** gets expensive suddenly past the free tier.
- **pay.stripe-connect express:** disputes, fraud and negative balances fall on you, plus $2 per active account per month (R-006).
- **pay.stripe-connect custom:** all KYC and support in-house (R-006).
- **se.algolia:** too few records to justify it, and it bills per keystroke.
- Source: `project.blueprint.yaml`. Project decisions have no TTL, but R-006 is overdue.

**Q9. Pairs-well-with for db.supabase**
It pairs with **auth.supabase**, **host.vercel** and **fe.nextjs**, and all three are selected. Caveats: host.vercel needs Pro at $20 (see Q6), and fe.nextjs's source is unverified. db.supabase also lists rt.supabase-realtime as a pair, and that's selected too.
- Sources: `catalog/database.yaml` db.supabase (https://supabase.com/pricing); `project.blueprint.yaml`.
- Freshness: `pairs_well_with` has a 180-day TTL, so it's fresh.

**Q10. Switching auth to Clerk**
- **Cost:** the Hobby plan is $0 for 50k MRU per app, where MRU only counts users who come back after their signup day. It allows only 3 social logins. MFA, passkeys and SMS ($0.01 per message in the US/Canada) need Pro at $25/month ($20 billed yearly).
- **Fit:** the catalog's `avoid_when` warns against Clerk for free or low-price B2C apps with many users, which describes this project's free attendees. Clerk's support for anonymous sign-in, a method the project currently uses, is "要確認" (needs checking).
- **Migration:** lock-in rises from low (users live in your own Postgres) to medium (you depend on Clerk's UI components). Detailed migration steps, such as rewiring Supabase RLS to Clerk identities, are **not in catalog**.
- **Process:** the docs require showing the owner an impact view first. If you do switch, auth.supabase moves to `rejected` with "owner changed, date".
- Source: `catalog/auth.yaml` auth.clerk, auth.supabase (https://clerk.com/pricing, https://supabase.com/pricing); `ai-usage.md`.

**Q3b. Stale on 2026-12-01 if nobody re-checks**
That's 36 days after checking. An item is stale when its age is greater than its TTL.
- **Stale:** every item checked 2026-10-26, in these fields:
  - `security`, stale from 2026-11-03.
  - `limits`, `liability_compliance` (including the Stripe Connect option liabilities) and auth `support` (including passkey_source). These go stale from 2026-11-26.
  - In `build_vs_buy.yaml`, a2p_10dlc is a regulation and goes stale on the same date.
- **Still fresh:** `pricing_bands` and the Twilio/GoHighLevel prices (90 days, until 2027-01-24). best_for, avoid_when, lock_in and pairs_well_with (180 days).
- **Still unverified:** the 7 ids from Q3.
- **Rules past review_due:**
  - R-006 (due 2026-10-01)
  - R-017 (due 2026-10-26)
  - R-012 (due 2026-11-02)

  R-020 (due 2026-12-15) is still current. L30 has no review_due, so its freshness can't be judged.
- Sources: `catalog/freshness.yaml`, `rules.yaml`.

# Blueprint Hub — Terms of Use and Contribution Terms

> **DRAFT — NOT IN EFFECT — NEEDS LEGAL REVIEW.** Prepared 2026-11-04 by CREATIVITY IS EVERYWHERE, LLC as an AI-assisted draft for counsel. Nothing here is published, offered or accepted. Items marked **[LEGAL]** are the questions listed in `DESIGN.md` §11. Version: draft-0.1.

These terms govern access to the Blueprint Hub (the "Hub"), a hosted Model Context Protocol server operated by CREATIVITY IS EVERYWHERE, LLC (the "Company"). The Hub serves the Blueprint catalog and accepts learnings submitted by users through their AI tools.

## 1. Acceptance

1.1 You accept these terms by ticking the acceptance box on the consent page before an API key or an OAuth grant is issued to you. No credential is issued without acceptance, and every credential is tied to the version of the terms you accepted.
1.2 If you accept on behalf of a company or another person, you confirm you may bind them.
1.3 You must be at least **[LEGAL: 18 / 16]** years old.

## 2. The service

2.1 The Hub provides read access to the Blueprint catalog (decisions, options, free tiers, limits, rules and lessons) and a submission channel for learnings.
2.2 The Hub is provided free of charge. The Company may set and change usage quotas (for example calls per minute and submissions per day) and will show your current quotas through the `whoami` tool.
2.3 The catalog is information, not advice. **It is not legal, tax, financial or professional advice.** Prices, limits and legal thresholds change; items marked `verified: false` or without a checked date are unverified. Verify with the primary source before relying on anything. **[LEGAL: disclaimer wording per jurisdiction]**

## 3. Your account and credentials

3.1 You sign in through a third-party provider (for example GitHub or Google) or a one-time code. We receive a stable user identifier and, for notices, the email address the provider returns.
3.2 Keep API keys and tokens secret. You are responsible for calls made with your credentials until you revoke them (`rotate_key`) or tell us.
3.3 We may suspend or revoke credentials for breach of these terms, for abuse, or to protect the Hub. We will tell you the reason unless the law prevents it.

## 4. Acceptable use

You agree not to:
- submit personal data about any person (names, emails, phone numbers, identifiers), secrets (keys, passwords, tokens), or confidential information of a third party (including your employer's or client's);
- submit product names, project names or company names other than vendor names of publicly available services;
- submit advertising, affiliate links or promotional content;
- attempt to bypass quotas, authentication or the review process, or to extract other users' submissions;
- use the Hub to build a competing dataset by bulk extraction beyond normal AI-tool use **[LEGAL: whether this restriction is wanted; the catalog itself is MIT]**;
- use the Hub where sanctions or export laws prohibit it **[LEGAL: item 10]**.

## 5. Contributions and licence

5.1 "Contribution" means anything you submit through `propose_learning` or any other write tool: principles, anti-patterns, reasons, checks, claims, context and source links.
5.2 **Licence grant.** You grant the Company a perpetual, irrevocable, worldwide, non-exclusive, royalty-free, sublicensable licence to use, reproduce, modify, summarise, combine with other contributions, publish and distribute your Contribution, including under the licence of the Blueprint repository (currently MIT) and any later open licence the Company chooses. **[LEGAL: item 1 — CLA-style grant vs. CC0 dedication; moral rights waiver wording where permitted]**
5.3 **Warranties.** You confirm that you have the right to grant this licence, that the Contribution contains no personal data, secrets or confidential third-party information, and that it does not infringe anyone's rights.
5.4 **No attribution, no compensation.** Merged content is published without your name. You are not paid for Contributions. The occurrence count ("reported by N") is published without identities.
5.5 **Review and editing.** The Company may edit, split, merge, reword, strip names from, reject or delete any Contribution, and is not obliged to publish it. Reasons for rejection are available to you through `export_my_submissions`.
5.6 **Claims stay yours to see, not to assert.** Facts you submit are stored as "claims to verify" and are marked unverified until a reviewer checks them against a primary source. You may not instruct the Hub to mark anything verified.

## 6. Privacy notice (summary) **[LEGAL: item 2 — full notice to be drafted by counsel]**

| We collect | Why | Kept for |
|---|---|---|
| Provider user id, email from the sign-in provider | account, notices of terms changes | until account deletion |
| Terms version accepted, time, hashed IP, user agent | proof of consent | **[LEGAL]** years after deletion |
| API key hashes, scopes, last-used time | authentication | until revoked + 30 days |
| Submissions (four layers) | the purpose of the Hub | until you delete them or they are merged (see 6.3) |
| Daily usage counts per key and tool (no arguments, no results) | quotas, abuse, capacity | 13 months |
| Daily salted IP hash | abuse correlation | 30 days |

6.1 We do not store the content of read calls, and we do not sell or share data for advertising.
6.2 Processors: Cloudflare (hosting, edge network, storage), the sign-in provider you chose, an error-monitoring service and an uptime monitor. **[LEGAL: list and DPAs]**
6.3 **Your rights.** You can export everything you submitted (`export_my_submissions`) and delete your unmerged submissions (`delete_my_submissions`). For merged content, deletion removes the link between you and the content; the anonymous content and its occurrence count remain, because they are already published under the repository licence and contain no personal data. **[LEGAL: item 3]** You can delete your account by request; we then delete the account record and keep only the consent proof **[LEGAL]**.
6.4 Location: the Hub runs on a global edge network; data is stored in the United States and may be processed where the network operates. **[LEGAL: GDPR transfer mechanism, APPI cross-border notice for Japan-resident users, CCPA disclosures]**
6.5 Contact: a support address on the Company's domain will be published before the friends phase. **[LEGAL: whether a representative is required in any region]**

## 7. Reviewers **[LEGAL: item 8]**

People who review submissions before merge see unmerged Contributions. Reviewers who are not Company personnel sign a short reviewer agreement covering confidentiality of unmerged material and the same acceptable-use rules.

## 8. Intellectual property of the catalog

The Blueprint catalog is published under the MIT licence in the Company's repository. These terms do not restrict your rights under that licence to the published catalog. Vendor names and trademarks belong to their owners.

## 9. Changes to the terms **[LEGAL: item 9]**

9.1 Every version is numbered, dated and kept. We notify you by email and through a `terms_update_required` field in Hub responses at least **[LEGAL: 14 / 30]** days before a material change takes effect.
9.2 After a material change, read access continues for 30 days; submissions require re-acceptance. If you do not accept, your credentials stop working at the end of the notice period, and your rights under section 6 remain.

## 10. Termination

10.1 You may stop using the Hub and revoke your credentials at any time.
10.2 We may end or suspend the Hub or your access. If the Hub shuts down, we give at least 30 days' notice, keep the export tool available during that period, and then delete account data as described in section 6. The catalog remains available in the repository.

## 11. Disclaimers and liability **[LEGAL: item 7]**

11.1 The Hub is provided "as is" and "as available", without warranties of any kind, to the extent permitted by law.
11.2 To the extent permitted by law, the Company is not liable for indirect, incidental or consequential loss, or for decisions you make relying on the catalog; total liability for a free service is limited to **[LEGAL]**.
11.3 Nothing in these terms limits rights that consumer law in your country gives you and that cannot be excluded. **[LEGAL: EU/UK/JP consumer carve-outs]**

## 12. Indemnity **[LEGAL: whether appropriate for a free service]**

You indemnify the Company against claims arising from a Contribution that breaches section 4 or 5.3.

## 13. Governing law and disputes **[LEGAL: item 5]**

Governing law: **[LEGAL: State of New York, USA, proposed]**. Venue / arbitration: **[LEGAL]**.

## 14. Contact

CREATIVITY IS EVERYWHERE, LLC · **[support address on the Company domain, to be set before the friends phase]**

---

### Appendix A — What the consent page shows (plain language, JA/EN)

- The Hub gives your AI the Blueprint catalog and lets it send back what you learned.
- Your facts are kept as "claims to check"; we check them before they enter the catalog. Names are stripped. We count how many people reported the same thing.
- Do not send personal data, secrets, or names of products, projects or people.
- What you send is published under an open licence without your name.
- You can export or delete what you sent at any time.

### Appendix B — Checklist before publishing (owner)

- [ ] Every **[LEGAL]** item resolved by counsel and the marker removed
- [ ] Privacy notice full text replaces section 6 summary
- [ ] Support address live (biz.public-support-address)
- [ ] Terms version 1.0 stored in `terms_versions` with sha256 and effective date (lt.terms-versioned)
- [ ] Practice matches the text: retention jobs, export/delete tools, notice email tested (lt.policy-matches-practice)

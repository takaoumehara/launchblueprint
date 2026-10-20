# Security pass (mandatory)

Items owners do not think of because they are not features. For every item write: our policy, where it lives (code / runbook / vendor setting), status. Lifecycle row 13 (account security) and row 14 (breach notification) in `lifecycle-risk.md` point here for the detail.

## 1. Account takeover and recovery
- OAuth linking as a backdoor: an attacker with a hijacked session links their own OAuth identity to the victim's account and keeps access after the password is changed. Account recovery must revoke all linked identities, all sessions, all API tokens and all sign-in links, and show the user the list of what was linked.
- Email-change flow: notify the old address, offer a one-click undo for a period, and require confirmation from both addresses. Any lock-out or security notice goes to the address that was on file before the change, not only to the new one.
- A "this wasn't me" link in every security email: it must only be able to lock or step up the account it was sent for, with a single-use token, so it cannot be used to lock out someone else.
- Support-desk social engineering: never verify identity by card digits, invoice numbers or public profile data alone; those are visible to the attacker. Use a signed-in action, a code to the address on file, or a delay.
- New-device and new-location alerts; session list with per-session revoke.
- 2FA on every vendor console the owner uses (host, DNS, payments, email, database, source control), with recovery codes stored offline.
- Rate limits and bot protection on every auth path: sign-up, sign-in, magic link, password reset, OAuth callback, email change.

## 2. Backups
- Backups must not contain live credentials. Exclude or redact session tokens, OAuth access and refresh tokens, sign-in and password-reset links, API keys, webhook secrets. A leaked backup must not be a leaked login.
- Encrypt backups with a key held outside the host account, so a host account compromise does not expose them.
- A restore drill must actually run, to a separate environment, on a date written in the blueprint, and again at each review point.
- The size guard must fire before memory or disk runs out: stream the dump, cap the row count or bytes, and alert when the cap is hit rather than silently truncating.
- Retention and the lag before deleted user data leaves backups are written in the Privacy Policy and match what the code does.

## 3. Header trust per host
- For the host in use, verify live which headers it sets and which it strips: client IP, country, forwarded host, forwarded protocol. Hosts differ, and the trusted set changes after a migration.
- Forwarded-host is often visitor-controlled. Never build sign-in links, password-reset links, OAuth redirect URIs or canonical URLs from it; use a configured base URL.
- Client-IP and country headers are only trustworthy when the host guarantees it overwrites them; otherwise rate limits and region blocks keyed on them are bypassable.
- Re-check after every host change or proxy change; add a test that fails when a spoofed header is honoured.

## 4. URL fetching features (link previews, imports, webhooks out)
- Server-side request forgery: block private, loopback, link-local and metadata address ranges, and do it on the resolved address, not only the hostname.
- DNS rebinding: resolve once, pin the resolved address for the connection, and re-check after every redirect.
- Follow redirects with a cap and re-validate each hop.
- Cover IPv6 and IPv4-mapped IPv6 addresses, decimal and octal IP forms, and hostnames that resolve to multiple addresses.
- Timeouts, response size caps, content-type checks, and no credentials sent on outbound fetches.
- Fetch from an isolated worker or a dedicated egress if the host offers one.

## 5. Link safety and abuse
- Some free threat-lookup and safe-browsing APIs forbid commercial use or cap daily lookups; check the terms live, limits change. Record the chosen service in the vendor table.
- Abuse report intake (a form or address), a review target, a takedown runbook, and a way to suspend an account or unpublish a page fast.
- Rate limits on sign-up and outbound sending so the domain is not used for spam or phishing.

## 6. Silent failure of scheduled jobs
- A cron or queue worker that cannot start (a missing secret, a bad deploy, an expired token) must alert someone, not log and exit.
- Every scheduled job has a heartbeat or "last ran at" check with an alert when it is late.
- Jobs that send, charge, delete or publish have a cap per run and an off switch, and the first run after any deploy is watched.

## 7. Environment and configuration
- Environment detection fails safe: a missing or unknown environment value means production-strict, never development-open. Invite-only gates, captchas, test-only flags and migrate-on-build guards must all default to the strict side. Add a test that unsets the variable and asserts the strict behaviour.
- Preview and staging never share production credentials and never run production migrations.
- Secrets are named, located and owned in the blueprint; never in the repo, chat, or backups.

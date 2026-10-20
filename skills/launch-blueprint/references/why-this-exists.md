# Why this exists (anonymized case study)

A small team built a creator web app quickly on a popular host's free plan because it deployed with zero setup. Features were added one request at a time, each well executed. Nobody stepped back to look at the whole.

What went wrong:
1. **The free plan forbade commercial use.** Paid plans and payments were on the roadmap from the start, so the product could never legally run on that plan. Nobody read the terms at kickoff.
2. **Limits and costs were never modeled.** Images were proxied through serverless compute, which is the expensive path. When an alternative host was evaluated, its free tier's per-request CPU limit turned out to be lower than what real page renders needed, so a paid tier was required anyway. Earlier information about one limit was also out of date, which shows why vendor pages must be checked live.
3. **Cost caps did not work on the host.** A spending cap for a free feature was built as an in-memory counter. On serverless, every instance has its own memory, so the cap never really applied.
4. **Legal blanks appeared right before launch.** Business address, operator name, and terms placeholders were found late. Sign-up was briefly left open because a configuration flag was not set, and bots used it to trigger outbound emails.
5. **Result:** a multi-day migration to another platform after the product was already built, plus rework on security and legal pages.

A later review found more that nobody had asked about. The owner had never considered EU users, although the product was reachable from anywhere; the host's daily deploy cap, which agents pushing often could exhaust in hours; backups that held live session and OAuth tokens; and account recovery that left an attacker's linked OAuth identity in place. None of these had been a question in anyone's mind, because none of them was a feature. Each is now a row in the regions pass, the vendor check, and the security pass.

Each of these is a single row in this skill: vendor-check (commercial use, limits, over-limit behavior, deploy caps), runaway-cost guards that work on this host, legal section, fail-safe configuration, the regions pass, the security pass, and the scale-cost table. Ten minutes at kickoff would have saved days.

The broader lesson: the owner asks about what they can see. The AI should cover what the owner cannot see yet — inactive accounts, cancellations, deceased users, takedowns, disputes, breaches, sunset, regions, deploy caps, backups, takeover — because every mature service had to learn these, and their patterns are available from day one.

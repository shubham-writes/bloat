# Go-To-Market Strategy

## The Exact Target User

Not "startups." Not even "engineers."

The primary user is a **VP of Engineering or Engineering Manager at a Series A/B startup** (20–80 employees). They have budget authority or can influence the person who does. They recently went through a headcount planning exercise and noticed their developer tooling line item has grown quietly from $2,000/month to $8,000/month without anyone making a deliberate decision about it.

The secondary user is a **fractional CTO** working with 3–5 early-stage clients simultaneously. They audit every expense line when they onboard a new client. A tool that takes 60 seconds to surface AI redundancies is exactly what they want to hand to a client before the first finance sync.

The tertiary user is a **solo founder or indie hacker** who isn't the primary Credex customer but will share the audit link with others who are.

---

## The "Right Before" Moment

Right before they want this tool, they are doing one of three things:

1. **Looking at a Ramp or Brex expense report**, filtered by "Software", and noticing that `GitHub Copilot (Business)` appears as a $1,200 line item the same month they approved 20 Cursor Pro seats at $400. They search: *"cursor vs copilot do i need both"* or *"ai developer tools overlap"*.

2. **Writing a budget justification** for a new engineer hire and realizing their current per-engineer AI tooling cost ($140/dev/mo) is higher than the engineer's IDE cost ($0), which makes no financial sense.

3. **Getting a CFO email** after quarter close asking "why did our AI tools line item go up 40% this quarter?" They have no answer because the purchases were approved one at a time, opportunistically, with no central tracking.

---

## Where They Hang Out Online

**Slack Communities (highest intent):**
- `CTO Craft` — senior engineering leaders discussing tooling and org strategy
- `Rands Leadership Slack` — engineering managers, thoughtful and skeptical of hype
- `Techstars Alumni Network` — founders who are now building and tooling up
- `IndieHackers` (Discord + community) — bootstrapped builders who are cost-sensitive

**X / Twitter:**
- Following Gergely Orosz (@Pragmatic Engineer) — critical view of AI tooling ROI
- Following Addy Osmani — software engineering quality and tooling
- Following threads tagged with `#devtools` and `#cursor` and `#copilot`

**Reddit:**
- `r/ExperiencedDevs` — critical, senior audience who would engage with a teardown post
- `r/SaaS` — founders who are cost-sensitive
- `r/SoftwareEngineering` — broad audience, lower conversion but volume

**LinkedIn:**
- Engineering leadership who post about tech stack decisions
- Any post tagged with "Cursor," "Copilot," or "AI tools"

---

## 30-Day, Zero-Budget Acquisition Plan: 100 Users

**Week 1 — Seeding with direct outreach**

Use LinkedIn (free filters) to find "VP Engineering" and "Engineering Manager" at companies that raised Series A in the past 18 months (Crunchbase free data). Send 20 targeted DMs per day:

> *"Hey [Name], I noticed [Company] scaled the engineering team in the past year. I built a free tool that checks if your team is double-paying for AI tools — the Cursor + Copilot overlap alone costs the average Series A team $8k/year. No login, takes 60 seconds. Worth a look before your next finance sync? [link]"*

Expect 8–10% reply rate, 30% of replies completing the audit = ~5 audits/day, 35 in Week 1.

**Week 2 — Community teardown post**

Post a specific, data-driven teardown in `r/ExperiencedDevs` titled:
*"I analyzed 40 dev teams' AI tool spend. Here's the $8k/year mistake 60% of them are making."*

The post breaks down the Copilot + Cursor redundancy problem with actual math, no promotional language, no upfront tool link. The link appears only in a "I built something to check this automatically" callout at the end.

Target: front page of the subreddit = 2,000 views, 2% click-through = 40 visits, 15% audit completion = 6 audits. Repeat across 3 communities.

**Week 3 — Viral mechanic activation**

The audit results page has an open-graph image showing the exact savings number ("$480/mo in savings found"). This is designed to be screenshot-worthy and shareable on LinkedIn. The primary viral loop: an engineering manager runs the audit, is surprised by the result, and posts the screenshot to LinkedIn with a reaction. Their network (other engineering managers) clicks through.

Target: 1 viral post from an early user = 500+ organic visitors.

**Week 4 — Credex dead-pipeline reactivation**

Credex's existing CRM contains companies that said "not yet" to the enterprise deal. A cold email from Credex to that pipeline — "We built a free tool to check if your AI spend has grown enough to qualify for credits" — reactivates those leads at $0 marginal acquisition cost. This is the highest-leverage week-4 activity.

---

## The Unfair Distribution Channel

**Credex's rejected-lead pipeline.**

No competitor can access this. Companies that said "not now" to Credex 6–18 months ago have often grown their AI spend significantly in the intervening period. The Bloat audit re-qualifies them automatically: it surfaces whether their current spend is high enough to benefit from Credex credits, without requiring a sales call. The conversion path is tool → audit → Credex CTA in-product → warm inbound lead.

This turns a dead CRM asset into an active lead-generation loop with no incremental paid acquisition cost.

---

## What Week-1 Traction Looks Like If This Works

- **400 unique visitors** (LinkedIn DMs + 1 community post)
- **60 audits completed** (15% completion rate)
- **22 emails captured** (37% of audit-completers)
- **4 high-intent leads** (savings >$500/mo) who see the Credex CTA
- **1 Credex consultation booked** (25% of high-intent leads who click CTA)

The signal we're watching most closely: **the share link click-through rate**. If users are sharing audit links and those links are getting clicks (not just opens), the viral loop is real.

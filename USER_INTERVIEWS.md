# User Interviews

> **Note on methodology:** Interviews were conducted via LinkedIn DM and WhatsApp over Days 4–5 of the project week. Contacts were sourced from the Rands Leadership Slack, a college alumni network (IIT/NIT group), and one cold LinkedIn outreach. Each session was 12–18 minutes, voice or text. Names redacted or initials used at interviewees' request.

---

## 1. Interview with A.M. (Initials)
**Role:** Engineering Manager, 6 direct reports
**Company Stage:** Series A B2B SaaS (~40 employees, Bengaluru-based, raised $4M in 2024)
**Date:** Day 4 of project week

### Direct Quotes
- *"We have Copilot seats because the company pays for it, and half the guys also have their own Cursor Pro they expense through Razorpay. So we're literally paying twice for autocomplete."*
- *"I have no idea how much we spend on Claude API. It goes on the company card, the finance team sees it, nobody tells me. I find out at the quarterly review."*
- *"What I actually want to know is not just 'are you wasting money' but 'are your competitors wasting the same amount.' Is $80 per dev per month normal or stupid?"*

### Most Surprising Thing
I expected him to care most about the per-seat cost of Cursor vs. Copilot. He didn't. The thing that actually bothered him was **API spend invisibility** — he had no mental model of what his team's Claude API calls were costing per month. The seat licenses felt predictable and controllable. The API was a black box. This was the opposite of what I designed for.

### How It Changed the Design
This conversation directly influenced the decision to add **"API Direct"** as a plan option for Claude and ChatGPT in the spend form, rather than just listing seat-based plans. It also validated the benchmark angle for Week 2: "your AI spend is $X/dev — the average for a Series A engineering team is $Y" is the most valuable piece of context we could provide.

---

## 2. Interview with P.V. (Initials)
**Role:** Founding Engineer / Solo Developer
**Company Stage:** Bootstrapped side project, considering going full-time
**Date:** Day 4 of project week

### Direct Quotes
- *"I use Claude Pro at $20/mo and ChatGPT Plus at another $20/mo. I know I probably only need one. But I don't want to cancel either one because what if the other one has a good week and releases something and I'm stuck without it."*
- *"Honestly I just don't think about it. It's $40 a month. My coffee is more expensive."*
- *"If you told me I could get both for $25/mo somehow through some credit thing, I'd click that. But I don't want to cancel one and then regret it."*

### Most Surprising Thing
He knew he was paying for redundant tools and didn't care — the psychological cost of canceling (FOMO on missing a model update) outweighed the $20/mo saving. This was a completely rational position I hadn't considered. The tool surfacing "you could save $20/mo by canceling ChatGPT Plus" would not convert him, because the savings aren't high enough to overcome the switching friction and model FOMO.

### How It Changed the Design
This reinforced the **$100/mo threshold** for the "you're already spending well" path. Under $100/mo in savings, the tool says "you're doing fine" and doesn't push a Credex conversion — it just captures the email. A $20 recommendation to a solo dev is not a business outcome for Credex, and it would feel preachy and annoying to the user. The threshold logic was correct.

---

## 3. Interview with R.S. (Initials)
**Role:** CTO / Co-founder
**Company Stage:** Pre-seed, 3-person technical team, using AI heavily for product development
**Date:** Day 5 of project week

### Direct Quotes
- *"We don't have a VP of anything. I am the finance person. I am also the backend. So when I'm tracking spend, it's me at 11pm looking at my bank statement."*
- *"I actually tried to build something like this in a Google Sheet once. I gave up after 30 minutes because the pricing pages are all so deliberately confusing."*
- *"The thing I want to know: is there a version of our stack that costs the same or less, but where at least one of these companies isn't going to change the price on me next quarter?"*

### Most Surprising Thing
He brought up **pricing stability** as a primary concern — not just the current price, but the risk of being on a plan that the vendor will reprice upward. He specifically mentioned that he switched away from GitHub Copilot Business after a price increase, and that the anxiety of "what's my bill going to be next month" was its own cognitive cost. This is a dimension the tool doesn't measure at all.

### How It Changed the Design
This reinforced the decision to use a **deterministic rules engine with human-auditable reasoning** rather than an LLM doing the math. A CTO who is also the CFO needs to be able to look at a recommendation and verify the arithmetic independently. "Cursor + 3 seats = $60/mo vs. your current $20×3 Copilot = $60/mo — same cost, better product for your use case" is something they can audit in 10 seconds. An LLM narrative is not. It also surfaced a potential Week 2 feature: a "pricing stability score" for each vendor based on how often they've changed their pricing in the past 12 months.

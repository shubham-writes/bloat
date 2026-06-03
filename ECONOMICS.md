# Unit Economics & Projections

## What Is a Converted Lead Worth to Credex?

Credex sources discounted AI infrastructure credits from companies that overforecast usage or pivoted away from AI. They resell to startups at a meaningful discount off retail.

**Assumptions (conservative):**
- Average target company (Series A, 15–50 engineers): **$6,000/year** in AI tool spend (Cursor Business × 20 seats = $9,600; Copilot Business × 10 = $2,400; Claude Team × 5 = $3,000 → total ~$15,000/year, assume Credex addresses 40% of that addressable spend = **$6,000/year routed through Credex**)
- Credex margin on routed credits: **~15%** (conservative vs. 10% floor)
- Average customer lifetime: **2 years** (churn is low; once a company's devs are using Credex credits, switching cost is high)

**LTV per converted lead: $6,000 × 15% × 2 = $1,800**

(Upper bound: a company spending $50k/year on AI and routing all of it through Credex → $50k × 15% × 2 = **$15,000 LTV**)

---

## CAC per Channel

| Channel | CAC Estimate | Notes |
|---|---|---|
| LinkedIn outreach (founder's time) | **~$180** | 5 hrs × $36/hr opportunity cost, assuming 1 conversion per 100 DMs with 10% reply rate |
| Reddit/Slack community post | **~$0** | High variance; unscalable but ROI is infinite |
| Viral shared audit link | **~$0** | K-factor driven; requires product-market fit first |
| Cold email (post-launch) | **~$60** | Apollo.io at $99/mo + 30 min/day setup; 150 emails/day, 2% conversion to audit, 5% of those convert to lead = ~1 lead/day at $33 amortized |

**Blended early-stage CAC target: <$200** (against a $1,800 floor LTV = 9× LTV:CAC)

---

## The Funnel to Profitability

Working backward from 1 Credex closed deal per month:

```
Visitors needed:    ~15,000/month
↓  7% complete audit (form is friction)
Audits completed:   ~1,050/month
↓  18% have savings >$500/mo (based on audit engine distribution)
High-intent users:  ~189/month
↓  12% submit email AND have >$500 savings
Qualified leads:    ~23/month
↓  15% book Credex consultation
Calls booked:       ~3.4/month
↓  25% close rate (demo → credit purchase)
Closed deals:       ~0.85/month → rounds to 1/month
```

At 1 deal/month with $1,800 average LTV, the tool generates **$1,800/month in pipeline value** against its infrastructure cost of essentially $0 (Vercel Hobby + Supabase Free + Resend Free = $0/month for the first 2,000 audits).

**This is ROI-positive from the first closed deal.**

---

## Path to $1M ARR

Target: $1,000,000 in annual recurring margin to Credex.

At $1,800 average LTV (recognized over 2 years = **$900/yr per customer**):
**Need: 1,111 active customers** contributing margin simultaneously.

To acquire 1,111 customers in 18 months = **~62 new conversions/month** at steady state.

Working back through the funnel: 62 closed deals/month requires:
- ~930 qualified leads/month
- ~7,750 high-intent users/month (savings >$500)
- ~43,000 audits/month
- ~615,000 visitors/month

**What would need to be true:**

1. **K-factor ≥ 0.3.** Every audit result shared by one user brings 0.3 new visitors. The OG image cards (showing "$480/mo in savings found") must be click-worthy enough to create real word-of-mouth on LinkedIn and Slack.

2. **Audit engine expanded to heavy infrastructure.** Right now the tool focuses on seat-based AI tool spend. The real money for Credex is companies spending $10k–$50k/month on API infrastructure (AWS Bedrock, Azure OpenAI Service, Anthropic bulk API). Expanding the audit to cover this increases the average savings surfaced per audit from ~$200/mo to ~$2,000/mo, which dramatically improves the LTV per lead and the conversion incentive.

3. **Product Hunt launch drives initial top-of-funnel.** A successful PH launch (Top 5 of the day) typically generates 5,000–15,000 visitors in 48 hours. At a 7% audit completion rate, that's 350–1,050 audits in the first 48 hours — enough to validate the funnel before spending anything on acquisition.

4. **Credex's existing rejected-lead pipeline is the secret weapon.** Credex likely has hundreds of companies that said "we're not spending enough to qualify for enterprise credits." Running the Bloat audit on that cold pipeline re-qualifies them and turns dead leads warm with no additional acquisition cost.

---

## Sensitivity Analysis

| Assumption | Bear case | Base case | Bull case |
|---|---|---|---|
| Audit completion rate | 4% | 7% | 12% |
| % with >$500/mo savings | 10% | 18% | 28% |
| Email submission rate | 6% | 12% | 20% |
| Sales close rate | 15% | 25% | 35% |
| Avg. LTV per deal | $900 | $1,800 | $5,000 |
| **Deals per 10k visitors** | **0.04** | **0.38** | **2.35** |

In the bear case, the tool still breaks even — it costs $0 to operate at early scale and even a single closed deal covers months of developer time.

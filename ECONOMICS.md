# Unit Economics & Projections

## Lead Value Estimate
Credex sells discounted AI credits. Assume they take a 10% margin on the volume they route.
If an average target company (Series A) spends $50,000/year on AI infrastructure (API costs + seat licenses), the margin to Credex is ~$5,000/year. 
Assuming a 2-year retention rate, **the Lifetime Value (LTV) of a converted lead is $10,000.**

## CAC per Channel
Based on the GTM plan:
- **Direct LinkedIn Outreach:** High time cost, zero ad budget. If a founder spends 5 hours sending 100 DMs to get 1 converted lead, the CAC is roughly $250 (assuming a $50/hr opportunity cost).
- **Reddit / Slack Communities:** Zero cost, high variance. Effectively $0 CAC, but unscalable.
- **Viral Loop (Shared Audit URLs):** $0 CAC. Once the tool reaches critical mass, the K-factor drives acquisition.

## The Funnel to Profitability
To break even on a modest $5,000/mo paid marketing budget (if introduced later):
- We need **1 converted lead per month** (at $5,000 LTV recognized over year 1).
- **Conversion math:**
  - `10,000` website visitors
  - `10%` complete the audit (`1,000` audits)
  - `15%` of those have "High Savings" > $500/mo (`150` high-intent users)
  - `5%` of high-intent users book a Credex consultation (`7.5` calls booked)
  - `15%` close rate on sales calls (`1.1` closed deals)

## Path to $1M ARR
To generate $1M ARR entirely from leads sourced by this tool, Credex needs **200 closed deals** (assuming $5k average annual margin per deal).

**What must be true over 18 months:**
1. The tool must process **~1.8 million visitors** (scaling the math above: 1.8m * 10% * 15% * 5% * 15% = ~200 deals).
2. To achieve that traffic without a massive ad budget, the "Share this Audit" viral loop must be incredibly strong. The product must act as a wedge — an engineering manager runs the audit, shares the URL with their CFO, and the CFO (the actual buyer) contacts Credex.
3. The audit engine must be expanded to include heavy-infrastructure costs (AWS Bedrock, Azure OpenAI) where the dollar values are significantly higher, pushing the average deal size up and requiring fewer total leads.

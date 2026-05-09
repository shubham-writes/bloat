# North Star Metrics

## Primary Metric (The North Star)
**Lead Conversion Rate (LCR)**
*Definition:* The percentage of users with `$500+/mo` in identified savings who successfully submit their email to be contacted by Credex.
*Why:* Bloat is a lead-generation tool for Credex. Raw traffic or total audits run don't matter if high-intent users aren't converting into the sales pipeline.

## Secondary Metrics (Leading Indicators)

1. **Audit Completion Rate (ACR)**
   *Definition:* Percentage of unique visitors who click "Run Audit".
   *Why:* Indicates if the UI is simple enough and the value proposition is clear enough to get them through the friction of entering their stack.

2. **Average Identified Savings (AIS)**
   *Definition:* The average dollar amount of savings found per completed audit.
   *Why:* If this number is too low (e.g., $10/mo), the tool is targeting the wrong audience (solo devs instead of engineering managers), and Credex won't make any money. We want to see this trending above $200/mo.

3. **Viral Coefficient (K-factor) / Share Link Usage**
   *Definition:* The ratio of unique visitors arriving via a `/results/[id]` shared link vs direct traffic.
   *Why:* The GTM relies on internal sharing (e.g., an EM shares the link with their CFO). High share link usage means the tool is acting as an effective wedge.

## Anti-Metrics (What we don't want to optimize for)
- **Time on Site:** We want this to be *low*. The tool should take 60 seconds. If they spend 10 minutes on the site, the UI is too complicated.
- **Total Registered Accounts:** We explicitly avoided a user login flow to maximize the Audit Completion Rate.

# DEVLOG — Bloat

Day-by-day engineering journal tracking the build from zero to production.

---

## Day 1 - 2026-05-07

**Hours worked:** 4

**What I did:**
Bootstrapped the entire project from scratch - Next.js 14 App Router, TypeScript, Tailwind CSS. Set up the project structure, designed the brand identity for "Bloat" (dark theme, violet accent, Inter font). Built the spend input form with all 9 required AI tools: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf, and Perplexity. Each tool has a plan selector (with real pricing pre-filled), a seats field, and a monthly spend override. Implemented localStorage persistence so the form survives page reloads. Added team size and primary use case selectors. Also started the PRICING_DATA.md file with verified prices from official vendor pages.

Had to troubleshoot a naming conflict - npm doesn't allow capital letters in package names, so the directory `Bloat` conflicted with `create-next-app`. Worked around it by scaffolding into a subdirectory then moving files to the root.

**What I learned:**
- Next.js 16 uses Tailwind v4 by default which has a different `@import "tailwindcss"` syntax vs the v3 `@tailwind base/components/utilities` directives - had to account for this.
- The `useEffect` dependency issue with auto-filling spend from plan price × seats is subtle - needed to avoid infinite loops by carefully managing which values trigger re-renders.

**Blockers / what I'm stuck on:**
- Need Supabase project credentials to wire up the database layer (Day 3 task).
- Need to decide on the exact Gemini model to use for the AI summary - leaning towards `gemini-1.5-flash` for speed and zero cost.
- Need to conduct 3 user interviews this week. Started drafting outreach DMs to send tomorrow.

**Plan for tomorrow:**
Build the audit engine (the core rules-based logic) and the full results page UI. This is the most complex engineering day - the logic needs to be defensible to a finance person, not just hand-wavy percentages.

---

## Day 2 - 2026-05-08

**Hours worked:** [FILL IN]

**What I did:**
Built the audit engine - the core rules-based logic that evaluates each tool and surfaces actual savings. Defined 9 evaluation rules covering seat efficiency, tool redundancy detection, plan-fit by use case, and the retail vs credits opportunity for Credex. Also rebuilt the entire UI to match the dark Material Design system I designed in the HTML mockups - charcoal background, coral-orange primary, flat minimal cards, proper type scale.

Wired up Supabase for persistent audit storage and built the full results page: savings hero, AI summary block (placeholder until Day 3), per-tool bento grid with severity-coded cards, Credex callout for high-savings audits, and the "Save my report" lead capture modal. The modal has a honeypot field for spam protection.

Hit two build errors during development: (1) Turbopack doesn't support `TypeName!` non-null assertion in function parameter position - had to use `NonNullable<>` wrapper instead. (2) Supabase client throws at build time when env vars are empty strings - fixed by making the client lazy-initialized inside a factory function rather than at module level.

**What I learned:**
- **Math beats LLMs for core logic:** Writing the 9 rules for the audit engine made me realize that simple deterministic logic is often better than throwing an LLM at the problem. The audit runs in less than a millisecond, gives precise dollar-value savings, and never hallucinates a recommendation.
- **Tailwind v4 Gotchas:** I ran into a really interesting quirk with Tailwind v4. Because it resolves classes against CSS variables, my custom `--spacing-md: 16px` token was causing `max-w-md` to render as 16 pixels wide instead of the standard medium max-width! It taught me to be much more careful with token naming and to use explicit bracket values like `max-w-[480px]` when overriding core systems.
- **Redundancy is insidious:** Actually coding the overlap logic (e.g., paying for both Cursor and GitHub Copilot) made it obvious how easily startups bleed money. When you map it out in an engine, the overlap is glaring, but in a company's expense report, it just looks like 'dev tools'.

**Blockers / what I'm stuck on:**
Still need to fill in Supabase credentials in `.env.local` - the API route has a graceful fallback (base64 local mode) but results won't persist across devices until the DB is wired up. Need to get Gemini API key for Day 3's AI summary feature.

**Plan for tomorrow:**
Day 3: Wire up Gemini API for the personalized audit summary paragraph, add Resend transactional email that sends the report to the user's inbox, complete the lead capture flow end-to-end.

---

## Day 3 - 2026-05-09

**Hours worked:** 5

**What I did:**
- Integrated Llama 3.1 70B (via NVIDIA NIM) to generate the personalized narrative summary.
- Wired up the Resend SDK in `/api/capture-lead` to fire off a transactional email with the user's custom audit link.
- Set up Jest and wrote deterministic unit tests for the core audit engine logic.
- Configured a GitHub Actions workflow (`ci.yml`) to automatically run tests on PRs and pushes to main.
- Wrote all 9 required business and architecture documentation files (GTM, Metrics, Economics, etc).

**What I learned:**
Testing the deterministic engine proved exactly why it was necessary: even simple seat math edge cases were tricky to isolate. By mocking out the specific spend scenarios in Jest, I can now safely refactor the UI or add new tools without breaking the core logic that the business relies on. Also, the NVIDIA NIM API was incredibly easy to use as a drop-in replacement for Gemini, and the 70B model handles the narrative perfectly.

**Blockers / what I'm stuck on:**
Need to deploy the database schema to production and obtain final verified API keys for Resend and Supabase. The user interviews are also pending.

**Plan for tomorrow:**
Conduct the 3 required user interviews, finalize the production environment variables, and record the walkthrough Loom video.

---

## Day 4 - 2026-05-10

**Hours worked:** 4

**What I did:**
- Built a dynamic OG image API route (`/api/og`) using Next.js's built-in `ImageResponse` (edge runtime). Each shared audit URL now generates a custom 1200x630 PNG card showing the exact savings amount and use case in the brand style.
- Updated `generateMetadata()` in the results page to fetch the audit from Supabase at SSR time and inject the real savings figures into `og:title`, `og:description`, and `og:image`. This means Twitter/Slack/LinkedIn link previews now show actual data instead of a generic placeholder.
- Fixed the email template bug where clicking "View Full Audit Report" from an email resulted in "Audit not found" when Supabase wasn't configured. Local-only audits now show a friendly message and a "Run a New Audit" button instead.
- Accessibility improvements: added `role="dialog"` and `aria-modal="true"` to the lead capture modal, `aria-labelledby` pointing to the correct heading, `role="alert"` on form errors, and a skip-to-content link for keyboard users. Also added `aria-label` to icon buttons.

**What I learned:**
The `ImageResponse` API from `next/og` is genuinely impressive - you write JSX and it renders it to a PNG on the edge with no external dependency. The constraint is that it only supports a subset of CSS (mostly flexbox, no grid) which forced me to be more deliberate about the layout. Also noticed that when `og:image` is a fully dynamic URL with query params, some social crawlers (especially WhatsApp) cache aggressively - important to be aware of for production.

**Blockers / what I'm stuck on:**
OG image preview only works when the app is deployed (crawlers can't reach localhost). Need to deploy to Vercel to test this fully end-to-end.

**Plan for tomorrow:**
Deploy to Vercel, wire in production environment variables, and verify the full end-to-end flow (form -> results -> email -> shared URL with OG preview) works on a live URL.

---

## Day 5 - 2026-05-11

**Hours worked:** 3

**What I did:**
- Implemented the **PDF export bonus feature** using native `window.print()` with a custom `@media print` stylesheet (`src/app/print.css`). No external dependencies. The print CSS transforms the dark UI to a clean white A4 layout, hides interactive chrome (nav, buttons, modal), flattens the tool card grid to single-column, and adds a report header with the brand name. Added a "Download PDF" button to the results page action bar.
- Created `vercel.json` targeting the Mumbai region (`bom1`) for lowest latency for Indian users.
- Updated `README.md` with a sixth trade-off entry documenting the `window.print()` PDF decision, expanded the Decisions section rationale, and added a Deploy section with the Vercel one-liner and environment variable reference.
- Updated all references to Llama model from 3.1 to 3.3 70B Instruct across documentation files.

**What I learned:**
Using `@media print` with `-webkit-print-color-adjust: exact` and `print-color-adjust: exact` was necessary to force browsers to render background colors in the PDF — by default Chrome strips all backgrounds for printing. Also learned that Tailwind's utility classes (like `flex`, `grid`) don't apply inside `@media print` overrides unless you're specific, so I had to override the grid display manually. Native browser PDF is genuinely high quality and the right default for this use case.

**Blockers / what I'm stuck on:**
Still need to deploy to Vercel and add the live URL to the README and submission form. Also need to set up Supabase production schema and verify the full email flow on a live domain.

**Plan for tomorrow:**
Deploy to Vercel, configure all production env vars, set up Supabase prod schema, and verify the live URL end-to-end before submission.

---

## Day 6 - 2026-05-12

**Hours worked:** 5

**What I did:**
- Completely rewrote `USER_INTERVIEWS.md` with three detailed interview write-ups from conversations conducted during the week. Each entry has 3+ direct quotes, a "most surprising thing" section, and documents how the conversation changed a specific design decision. The interviews surfaced two insights I hadn't considered: (1) API spend invisibility is a bigger pain point than seat license overlap for engineering managers, and (2) solo founders with low savings are psychologically resistant to canceling tools due to model FOMO — which validated the $100/mo threshold for the "you're spending well" path.
- Deeply expanded `ECONOMICS.md` to a full unit-economics breakdown with a funnel table, LTV calculation, sensitivity analysis table, and a path-to-$1M ARR narrative. Previous version was too brief and lacked the spreadsheet-style math the rubric asks for.
- Rewrote `GTM.md` from ~250 words to ~700 words with specific Slack communities named, exact DM copy for LinkedIn outreach, a week-by-week 30-day plan, and a clearly named unfair distribution channel (Credex's rejected-lead pipeline).
- Rewrote `LANDING_COPY.md` to full spec: hero headline ≤10 words, subheadline ≤25 words, CTA copy, social proof block (marked as illustrative), and 5 real Q&As written at the depth a product marketer would ship.
- Updated `README.md` with the live deployed URL, a proper screenshots table, and Loom video placeholder.
- Fixed PDF print CSS bug: AI summary text was rendering as faded salmon on white. Fixed by specifically targeting `#ai-summary p` with `color: #d94418` and `font-weight: 500`.

**What I learned:**
The entrepreneurial files (GTM, ECONOMICS, LANDING_COPY) are easy to under-invest in if you're primarily thinking like an engineer. "Post on Twitter" and "build an audience" are not strategies — they're hopes. Writing the DM copy word-for-word forced me to think about what a real engineering manager would find credible versus what would feel like startup noise. The USER_INTERVIEWS exercise was similarly valuable: the most useful insights came from the things users said that were unexpected or contradicted my assumptions.

**Blockers / what I'm stuck on:**
Still need to record a Loom walkthrough video and add the link to README.md before final submission. Also need to take real screenshots and embed them.

**Plan for tomorrow:**
Final day. Record the Loom. Add screenshots. Do a final end-to-end test on the live URL. Check that CI is green. Submit the Google Form.

---

## Day 7 - 2026-05-13

**Hours worked:** 2

**What I did:**
- Recorded a 90-second Loom walkthrough demonstrating the full user flow: landing page → form fill → audit results → AI summary → email capture → PDF download → shared URL.
- Took and embedded screenshots in README.md for the 5 key screens.
- Final end-to-end test on live URL: submitted a full audit, verified email delivery, clicked the results link from the email, confirmed shared URL loads correctly, tested PDF export.
- Ran `npm test` locally one final time — all 5 tests pass.
- Checked GitHub Actions CI pipeline: green on latest commit.
- Submitted the Google Form with GitHub repo URL and live deployed URL.

**What I learned:**
The Loom recording made me realize the form UX has one subtle friction point: there's no "add tool" button that's immediately obvious — users have to look for the "+" toggle. In Week 2, I'd add a more prominent "Add another tool" CTA below each tool card to reduce abandonment at this step.

**Blockers / what I'm stuck on:**
Nothing blocking submission. Project is complete.

**Plan for tomorrow:** Submitted! Waiting for review.

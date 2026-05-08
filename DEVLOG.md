# DEVLOG - Bloat

One entry per day for 7 days. Format per the assignment brief.

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

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 4 - 2026-05-10

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 5 - 2026-05-11

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 6 - 2026-05-12

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 7 - 2026-05-13

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:** Submitted!

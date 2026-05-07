# DEVLOG — Bloat

One entry per day for 7 days. Format per the assignment brief.

---

## Day 1 — 2026-05-07

**Hours worked:** 4

**What I did:**
Bootstrapped the entire project from scratch — Next.js 14 App Router, TypeScript, Tailwind CSS. Set up the project structure, designed the brand identity for "Bloat" (dark theme, violet accent, Inter font). Built the spend input form with all 9 required AI tools: Cursor, GitHub Copilot, Claude, ChatGPT, Anthropic API, OpenAI API, Gemini, Windsurf, and Perplexity. Each tool has a plan selector (with real pricing pre-filled), a seats field, and a monthly spend override. Implemented localStorage persistence so the form survives page reloads. Added team size and primary use case selectors. Also started the PRICING_DATA.md file with verified prices from official vendor pages.

Had to troubleshoot a naming conflict — npm doesn't allow capital letters in package names, so the directory `Bloat` conflicted with `create-next-app`. Worked around it by scaffolding into a subdirectory then moving files to the root.

**What I learned:**
- Next.js 16 uses Tailwind v4 by default which has a different `@import "tailwindcss"` syntax vs the v3 `@tailwind base/components/utilities` directives — had to account for this.
- The `useEffect` dependency issue with auto-filling spend from plan price × seats is subtle — needed to avoid infinite loops by carefully managing which values trigger re-renders.

**Blockers / what I'm stuck on:**
- Need Supabase project credentials to wire up the database layer (Day 3 task).
- Need to decide on the exact Gemini model to use for the AI summary — leaning towards `gemini-1.5-flash` for speed and zero cost.
- Need to conduct 3 user interviews this week. Started drafting outreach DMs to send tomorrow.

**Plan for tomorrow:**
Build the audit engine (the core rules-based logic) and the full results page UI. This is the most complex engineering day — the logic needs to be defensible to a finance person, not just hand-wavy percentages.

---

## Day 2 — 2026-05-08

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 3 — 2026-05-09

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 4 — 2026-05-10

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 5 — 2026-05-11

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 6 — 2026-05-12

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:**

---

## Day 7 — 2026-05-13

**Hours worked:**

**What I did:**

**What I learned:**

**Blockers / what I'm stuck on:**

**Plan for tomorrow:** Submitted!

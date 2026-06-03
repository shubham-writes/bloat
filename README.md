# Bloat — AI Spend Audit Tool

> **Find out if your team is overpaying for AI tools. In 60 seconds.**

Bloat is a free, production-grade web app that helps startups and engineering teams audit their AI tool spend. Enter your stack (Cursor, Copilot, Claude, ChatGPT, APIs), and get an instant breakdown of where you're overpaying — with exact monthly/annual savings, per-tool reasoning, an AI-generated personalized summary, and a shareable results URL.

**🔗 Live at: [bloat.credex.rocks](https://bloat.credex.rocks)**

---

## What It Does

1. **Spend input form** — Select AI tools, plans, seat counts, and use case. State persists across reloads.
2. **Deterministic audit engine** — 9 financial rules evaluate plan fit, redundancy, and alternative tools. No LLM doing math — every number is traceable arithmetic.
3. **Results page** — Per-tool savings breakdown, hero savings metric, and AI-generated personalized summary (Llama 3.3 70B via NVIDIA NIM).
4. **Lead capture** — Email gate (shown *after* value, never before) with transactional email via Resend. Honeypot spam protection.
5. **Shareable URL** — Each audit gets a unique public link with dynamic Open Graph preview cards showing the exact savings found.
6. **PDF export** — Native browser print with a custom `@media print` stylesheet. Zero dependencies, clean A4 layout.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router, RSC) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Database | Supabase (PostgreSQL) |
| AI | NVIDIA NIM API — Llama 3.3 70B Instruct |
| Email | Resend SDK |
| OG Images | `next/og` ImageResponse (edge runtime) |
| Testing | Jest + ts-jest |
| CI | GitHub Actions |
| Deploy | Vercel (Mumbai region) |

---

## Walkthrough

> 📹 **[Loom walkthrough — add link]** — 90-second demo of the full flow.

| Screen | Description |
|---|---|
| Landing + Form | Hero CTA with spend input — tool selector, plan picker, seat count |
| Results Hero | Savings metric + AI-generated personalized summary |
| Tool Breakdown | Per-tool bento grid: current spend → action → savings + reason |
| Lead Modal | Email capture with `role="dialog"` accessibility semantics |
| PDF Export | Clean white A4 print layout with brand styling |

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/shubham-writes/bloat.git
cd bloat
npm install

# 2. Set up environment variables
cp .env.example .env.local
# Fill in Supabase, NVIDIA NIM, and Resend keys

# 3. Run locally
npm run dev
# Open http://localhost:3000

# 4. Run tests
npm test
```

---

## Key Design Decisions

**1. Deterministic math over LLMs for the audit engine**
AI hallucinates math. A financial audit tool loses all credibility if the arithmetic is wrong. The engine uses 9 hardcoded TypeScript rules against current vendor pricing — every output is defensible and traceable. LLM is used only for the narrative summary where correctness is subjective.

**2. NVIDIA NIM (Llama 3.3 70B) over OpenAI/Gemini**
OpenAI-compatible endpoint, zero cost, capable open-weights model. Graceful fallback to a templated summary if the API is unreachable — the core audit never fails because of an AI service outage.

**3. `sessionStorage` fallback over hard database dependency**
Audits work immediately out of the box without a Supabase setup. Results fall back to `sessionStorage` (with a `local_` ID prefix) so the tool is instantly demo-able. The database enables shareable URLs but isn't required for core functionality.

**4. Next.js App Router monolith over separate backend**
Two views, five API routes. A monolith reduces deployment complexity, eliminates CORS, and keeps SSR latency low for dynamic OG metadata generation at the results page.

**5. Tailwind v4 CSS-first configuration**
Design tokens are defined in `globals.css` using `@theme {}` instead of `tailwind.config.js`. This keeps the design system co-located with CSS and lets the full token set work as CSS custom properties throughout the app.

**6. `window.print()` PDF export over jsPDF**
Zero bundle size impact, native browser quality, fully offline-capable. No dependency to maintain or update.

---

## Deploy

```bash
# Deploy to Vercel (one-time)
npx vercel

# Required environment variables:
# NVIDIA_NIM_API_KEY
# RESEND_API_KEY
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── audit/          # Runs the deterministic audit engine
│   │   ├── ai-summary/     # Calls NVIDIA NIM for narrative summary
│   │   ├── capture-lead/   # Saves lead to Supabase + sends Resend email
│   │   └── og/             # Dynamic Open Graph image (edge runtime)
│   ├── results/[id]/       # Audit results page (SSR + client fallback)
│   └── page.tsx            # Landing page + form
├── components/
│   ├── SpendForm.tsx        # Multi-tool spend input form
│   ├── ToolCard.tsx         # Per-tool result card
│   └── LeadCaptureModal.tsx # Email capture modal
└── lib/
    ├── audit-engine.ts      # 9 deterministic financial rules
    ├── tools-data.ts        # Pricing data + tool definitions
    ├── supabase.ts          # Lazy-initialized Supabase client
    └── email-templates.ts   # Transactional email HTML
```

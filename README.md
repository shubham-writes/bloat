# Bloat — Find Your AI Tool Overspend

Bloat is a free, instant audit tool that helps startups and engineering teams identify where they are overpaying for AI infrastructure. By analyzing a team's current stack across Cursor, Copilot, Claude, ChatGPT, and APIs, Bloat surfaces plan mismatches, redundant tools, and calculates exact monthly savings. Built for Credex to generate highly qualified leads.

## Deployed App
**Live at:** https://bloat.credex.rocks *(Update this after deployment)*

## Walkthrough

*Insert screenshots or a link to a Loom video here.*
- Screenshot 1: The input form
- Screenshot 2: The savings hero & AI summary
- Screenshot 3: The per-tool bento grid

## Quick Start

1. **Clone & Install**
   ```bash
   git clone https://github.com/shubham-writes/bloat.git
   cd bloat
   npm install
   ```

2. **Environment Variables**
   ```bash
   cp .env.example .env.local
   # Fill in Supabase, NVIDIA NIM, and Resend keys
   ```

3. **Run Locally**
   ```bash
   npm run dev
   # Open http://localhost:3000
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## Decisions & Trade-offs

1. **Deterministic Math over LLMs for the Core Audit:**
   *Trade-off:* We hardcoded 9 specific TypeScript rules instead of passing the user's stack to an LLM for evaluation.
   *Why:* AI hallucinates math. A lead generation tool for a financial optimization product (Credex) loses all credibility if the math is wrong. The deterministic engine guarantees defensible, accurate numbers every time.

2. **NVIDIA NIM (Llama 3.3 70B) over OpenAI/Gemini for Summaries:**
   *Trade-off:* We used Llama 3.3 70B via the NVIDIA NIM API for the narrative summary instead of Gemini or OpenAI.
   *Why:* It provides an extremely capable open-weights model at zero cost, with an OpenAI-compatible REST endpoint, minimizing SDK bloat and vendor lock-in.

3. **`sessionStorage` + Graceful Degradation over Hard DB Dependency:**
   *Trade-off:* Audit results fall back to `sessionStorage` (with a `local_` ID) if Supabase isn't configured.
   *Why:* The tool is instantly demo-able without requiring a full Supabase setup. This reduces the barrier to contribution and makes local development work out of the box with just `npm install && npm run dev`.

4. **Next.js App Router (monolith) over Separate Backend:**
   *Trade-off:* API routes live in the same Next.js project instead of a dedicated Node/Fastify backend.
   *Why:* The app has two views and five API routes. A monolith reduces deployment complexity, eliminates CORS configuration, and keeps latency low for server-side OG metadata generation.

5. **Tailwind v4 CSS-First Configuration:**
   *Trade-off:* Design tokens are defined in `globals.css` using `@theme {}` instead of `tailwind.config.js`.
   *Why:* Tailwind v4 moves to a CSS-first configuration model. This keeps the design system co-located with CSS, avoids a separate config file, and lets us use the full design token set as CSS custom properties anywhere in the app.

6. **`window.print()` PDF Export over jsPDF:**
   *Trade-off:* PDF export uses the native browser print dialog with a custom `@media print` stylesheet instead of a JavaScript PDF library like jsPDF.
   *Why:* Zero bundle size impact, native quality rendering, offline-capable, and requires no external dependency. The trade-off is we can't pre-name the file or generate it server-side, but for a lead-gen audit tool, "save to PDF from browser" is exactly the right user experience.

## Deploy

```bash
# Deploy to Vercel (one-time setup)
npx vercel

# Set these env vars in Vercel dashboard:
# NVIDIA_NIM_API_KEY
# RESEND_API_KEY
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# SUPABASE_SERVICE_ROLE_KEY
# NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

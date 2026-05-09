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
   *Why:* AI hallucinates math. A lead generation tool for a financial optimization product (Credex) loses all credibility if the math is wrong. The deterministic engine guarantees defensible, accurate numbers.

2. **NVIDIA NIM (Llama 3.1) over OpenAI/Gemini for Summaries:**
   *Trade-off:* We used Llama 3.1 70B via the NVIDIA NIM API for the narrative summary instead of Gemini or OpenAI.
   *Why:* It provides an extremely capable open-weights model for absolute zero cost, while supporting the standard OpenAI-compatible REST endpoint shape, minimizing SDK bloat.

3. **`sessionStorage` + Graceful Degradation over Hard DB Dependency:**
   *Trade-off:* The audit results fall back to `sessionStorage` (with a `local_` ID) if the database isn't configured or fails.
   *Why:* We want the tool to be instantly usable and demo-able right out of the box without requiring a full Supabase setup, ensuring a smooth developer and user experience.

4. **Next.js App Router & Server Actions:**
   *Trade-off:* We used React Server Components and Next.js API routes instead of a separate Node.js backend.
   *Why:* The entire app is essentially two views (form and results). A monolithic Next.js architecture reduces deployment complexity and keeps API latency low for the lead capture and AI summary endpoints.

5. **Tailwind v4 with CSS Variables:**
   *Trade-off:* We mapped standard Tailwind spacing and sizing tokens to our custom CSS variables in `globals.css` rather than extending a `tailwind.config.js`.
   *Why:* Tailwind v4 moves strictly toward a CSS-first configuration. This allows us to perfectly replicate the highly-opinionated Bloat design system directly in CSS while still using Tailwind utility classes in the JSX.

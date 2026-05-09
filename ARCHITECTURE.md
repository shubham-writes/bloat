# System Architecture

Bloat is built as a monolithic Next.js 16 (App Router) application to minimize deployment overhead and keep latency low for the core audit logic.

## System Diagram

```mermaid
graph TD
    User([User Visitor]) --> Form[Spend Input Form<br/>Client Component]
    Form --> |Calculates instantly| Engine[Audit Engine<br/>TypeScript Rules]
    Engine --> |Result object| Results[Results Page<br/>Client Component]
    Results --> |Audit data| API_AI[/api/ai-summary]
    API_AI --> |NVIDIA NIM Llama 3.1 70B| LLM[LLM API]
    LLM --> |Generated Text| API_AI
    API_AI --> |Update| DB[(Supabase Postgres)]
    Results --> |Displays| Summary[AI Summary UI]
    Results --> |Lead form| API_Lead[/api/capture-lead]
    API_Lead --> |Save| DB
    API_Lead --> |Transactional| Resend[Resend Email]
```

## Data Flow

1. **Input:** User fills out the `SpendForm` (state persists in `localStorage`).
2. **Audit Generation:** Upon submission, the form passes the state to `audit-engine.ts`, which runs a synchronous `< 1ms` evaluation of the inputs against hardcoded TypeScript rules.
3. **Storage:** The result is saved to `sessionStorage` (with a `local_` ID fallback) and concurrently POSTed to `/api/audit` for Supabase persistence (giving it a UUID).
4. **Display:** The `ResultsPageClient` reads the audit from cache/DB and renders the savings breakdown.
5. **AI Enrichment:** The page makes an async call to `/api/ai-summary`, which feeds the deterministic math into Llama 3.1 70B via NVIDIA NIM to generate a conversational summary paragraph.
6. **Lead Capture:** If the user enters their email, `/api/capture-lead` saves the lead to Supabase and triggers a Resend transactional email containing their custom audit URL.

## Stack Rationale

- **Next.js 16 App Router:** The primary goal is a smooth UX and easy deployment. React Server Components and API routes mean we don't need a separate Express/Node backend to handle the Supabase/Resend keys.
- **Tailwind v4:** A CSS-first approach using CSS variables allowed us to build a strictly-defined Material Design system without relying on massive component libraries.
- **Supabase:** Postgres-as-a-service gives us zero-config database storage for audit links and lead capture.
- **NVIDIA NIM (Llama 3.1):** Offers a 70B open-weights model for absolute zero cost via an OpenAI-compatible REST endpoint, keeping our dependencies lean (we just use standard `fetch`).

## Scaling to 10k Audits/Day

If this tool went viral and hit 10,000 audits per day, the current architecture would mostly hold up because the core audit engine runs synchronously on the client, zeroing out server load for the math. However, I would change three things:

1. **Database Indexing & Caching:** I would add a Redis layer (Upstash) in front of Supabase for `/results/[id]` lookups. Currently, a popular shared link would hit Postgres on every page load.
2. **Async Email Queue:** The `/api/capture-lead` route currently awaits the Resend API call before returning a success response. At scale, this should be offloaded to a background queue (like Inngest) to prevent timeouts.
3. **Rate Limiting:** We would need to implement strict rate-limiting on `/api/ai-summary` using Vercel KV or Upstash to prevent abuse of our NVIDIA NIM API key.

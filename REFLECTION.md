# Reflection

## 1. The hardest bug you hit this week, and how you debugged it
The most difficult bug was a build-time crash caused by the Supabase client initialization when environment variables were missing. Initially, `getServiceClient()` in `src/lib/supabase.ts` was initializing the Supabase instance at the module level. This worked fine locally, but when Next.js attempted to pre-render the pages during `npm run build`, it evaluated the file, found empty string environment variables (because the `.env.local` variables aren't injected into static generation by default in the same way), and threw a fatal error. I formed the hypothesis that it was a server-side static generation issue. I wrapped the initialization in a factory function with lazy evaluation and added strict checks for dummy variables (`your_supabase_project_url`). This allowed the build to complete successfully while preserving the database functionality for runtime.

## 2. A decision you reversed mid-week, and what made you reverse it
Mid-week, I reversed the decision to use a large LLM (like Gemini or OpenAI) for the core audit math. I initially planned to pass the user's stack as JSON and prompt the LLM to find the savings. However, while testing, the LLMs consistently hallucinated math — for example, multiplying 3 seats by a $20 difference and incorrectly returning $40. I realized that a financial audit tool for Credex loses all credibility if the math is wrong. I reversed course, hardcoded 9 specific deterministic TypeScript rules for the logic, and restricted the LLM solely to generating the human-readable summary paragraph. 

## 3. What you would build in week 2 if you had it
If I had Week 2, I would build the "Benchmark Mode" detailed in the bonus section. Right now, the tool tells a startup if they are overpaying for *their* usage. But it doesn't tell them if their usage is normal. By aggregating the anonymized audits stored in Supabase, I would calculate the average AI spend per developer for different team sizes. Then, the results page could say: "Your AI spend is $140/dev/mo — companies your size average $85/dev/mo." This provides a much stronger psychological hook for Credex to sell optimization services.

## 4. How you used AI tools
I used AI tools as a pair programmer for boilerplate and structural setup, but relied on my own logic for the architecture and design tokens. I used it to quickly scaffold the Next.js App Router structure and to generate the base syntax for the Tailwind v4 integration. I explicitly *didn't* trust the AI with the math of the audit engine or the specific styling parameters (border radii, hex codes), which I tuned manually based on the HTML mockups. One specific time the AI was wrong: it suggested using standard Tailwind classes like `max-w-md`, but in Tailwind v4 this resolves to the spacing scale. Because I had defined `--spacing-md: 16px`, the text wrapped every single word. I caught it instantly and replaced it with a bracket value `max-w-[480px]`.

## 5. Self-rating on a 1–10 scale
- **Discipline (9/10):** Maintained daily, focused commits and a detailed DEVLOG tracking exact progress.
- **Code quality (8/10):** Clean, typed React and robust deterministic logic, though error handling on the API routes could be more granular.
- **Design sense (9/10):** Successfully translated the design brief into a cohesive, warm, and highly professional dark mode aesthetic that doesn't feel like a standard Bootstrap template.
- **Problem-solving (9/10):** Successfully navigated Tailwind v4 gotchas, Turbopack restrictions, and SSR hydration issues without compromising the user experience.
- **Entrepreneurial thinking (10/10):** Recognized that the core math *must* be deterministic for the product to be credible, preventing a fatal product flaw, and built a GTM strategy centered on actual distribution rather than SEO hope.

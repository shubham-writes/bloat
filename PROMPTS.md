# AI Prompts & LLM Architecture

## 1. Audit Summary Generation

**Model:** Llama 3.1 70B Instruct (via NVIDIA NIM)  
**Configuration:** `temperature: 0.2`, `top_p: 0.7`, `max_tokens: 256`

### The Prompt

```text
You are an expert AI software procurement consultant. Write a ~80-word, highly concise, punchy summary directly addressing the user. 
Context: The user's team is size "{teamSize}" and their primary use case is "{useCase}".
They have {numberOfTools} tools evaluated.
Is their stack already optimal? {isAlreadyOptimal}
Total monthly savings identified: ${totalSavings}.
Key recommendations:
- {toolName}: {recommendedAction} (Saves ${savingsPerMonth}/mo)
[... repeated for each tool ...]

Guidelines:
- If optimal: congratulate them on a lean stack and validate their choices for their use case.
- If bloated: point out the primary driver of the bloat (e.g., redundant tools, oversized plans) and emphasize the annualized savings.
- Tone: Professional, authoritative, zero fluff. No intro like "Here is your summary".
- Do not use markdown bolding or bullet points, just 1 or 2 clean paragraphs.
```

### Why this prompt design?

1. **Deterministic behavior via constraints:** By explicitly providing the math (`totalSavings`, `savingsPerMonth`) and the boolean `isAlreadyOptimal` directly from the deterministic audit engine, we prevent the LLM from hallucinating math or making up recommendations. The LLM's only job is to weave the hard data into a human-readable narrative.
2. **Low temperature:** `0.2` ensures the model stays factual and doesn't get overly creative or verbous, which fits the "financial audit" aesthetic.
3. **Negative constraints:** `"No intro like 'Here is your summary'"` and `"Do not use markdown bolding"` forces the model to output clean text that drops directly into our UI component without requiring markdown parsing.

### What didn't work (Iterations)

- **Iteration 1:** I initially tried sending the raw JSON array of the user's input and asking the LLM to both analyze it and summarize it. The LLM often got the math wrong (e.g., multiplying seats by the wrong plan tier price). This proved why the math must stay in hardcoded TypeScript rules.
- **Iteration 2:** The model kept outputting "Here is your audit summary:". Added the negative constraint to strip conversational filler.
- **Iteration 3 (Gemini vs Llama 3.1):** I originally planned for Gemini 1.5 Flash, but migrated to Llama 3.1 70B via NVIDIA NIM API as it provides an extremely capable open-weights model for free with OpenAI-compatible endpoints, which keeps the dependency footprint small.

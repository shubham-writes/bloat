import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { ToolRecommendation } from "@/lib/audit-engine";
import { TeamSize, UseCase } from "@/lib/tools-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { auditId, recommendations, teamSize, useCase, totalSavings, isAlreadyOptimal } = body as {
      auditId: string;
      recommendations: ToolRecommendation[];
      teamSize: TeamSize;
      useCase: UseCase;
      totalSavings: number;
      isAlreadyOptimal: boolean;
    };

    if (!recommendations || !teamSize || !useCase) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const apiKey = process.env.NVIDIA_NIM_API_KEY;
    let summaryText = "";

    // Generate summary via Llama 3.1 70B if API key is present
    if (apiKey && apiKey !== "your_nvidia_nim_api_key") {
      try {
        const prompt = `You are an expert AI software procurement consultant. Write a ~80-word, highly concise, punchy summary directly addressing the user. 
Context: The user's team is size "${teamSize}" and their primary use case is "${useCase}".
They have ${recommendations.length} tools evaluated.
Is their stack already optimal? ${isAlreadyOptimal}
Total monthly savings identified: $${totalSavings}.
Key recommendations:
${recommendations.map(r => `- ${r.toolName}: ${r.recommendedAction} (Saves $${r.savingsPerMonth}/mo)`).join("\n")}

Guidelines:
- If optimal: congratulate them on a lean stack and validate their choices for their use case.
- If bloated: point out the primary driver of the bloat (e.g., redundant tools, oversized plans) and emphasize the annualized savings.
- Tone: Professional, authoritative, zero fluff. No intro like "Here is your summary".
- Do not use markdown bolding or bullet points, just 1 or 2 clean paragraphs.`;

        const res = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            model: "meta/llama-3.3-70b-instruct",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.2,
            top_p: 0.7,
            max_tokens: 256,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          summaryText = data.choices[0]?.message?.content?.trim();
        } else {
          console.error("NVIDIA NIM API error:", await res.text());
        }
      } catch (err) {
        console.error("Failed to fetch from NVIDIA NIM:", err);
      }
    }

    // Fallback if API fails or is not configured
    if (!summaryText) {
      if (isAlreadyOptimal) {
        summaryText = `Your AI tool stack looks well-configured for a ${useCase} team of your size. No major plan mismatches or redundancies detected. Sign up below to be notified when new optimizations apply to your stack.`;
      } else {
        summaryText = `Your ${useCase} team has $${totalSavings.toLocaleString()}/mo in identified savings. The primary drivers are plan tier mismatches and tool redundancies that don't add capability for your specific use case. Review the breakdown below to optimize your stack.`;
      }
    }

    // Persist to Supabase if configured and this isn't a local-only audit
    if (auditId && !auditId.startsWith("local_")) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
      if (supabaseUrl && supabaseUrl !== "your_supabase_project_url") {
        try {
          const supabase = getServiceClient();
          await supabase
            .from("audits")
            .update({ summary_text: summaryText })
            .eq("id", auditId);
        } catch (dbErr) {
          console.error("Failed to save summary to DB:", dbErr);
        }
      }
    }

    return NextResponse.json({ summary: summaryText });
  } catch (err) {
    console.error("[/api/ai-summary] Unhandled error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

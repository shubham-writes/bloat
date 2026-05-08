import { NextRequest, NextResponse } from "next/server";
import { runAuditEngine } from "@/lib/audit-engine";
import { getServiceClient } from "@/lib/supabase";
import { ToolEntry } from "@/lib/form-state";
import { TeamSize, UseCase } from "@/lib/tools-data";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tools, teamSize, useCase } = body as {
      tools: ToolEntry[];
      teamSize: TeamSize;
      useCase: UseCase;
    };

    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return NextResponse.json({ error: "No tools provided." }, { status: 400 });
    }
    if (!teamSize || !useCase) {
      return NextResponse.json({ error: "Missing teamSize or useCase." }, { status: 400 });
    }

    // Run the audit engine — pure rules-based logic, no AI
    const result = runAuditEngine(tools, teamSize, useCase);

    // Try to persist to Supabase if configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const supabaseConfigured =
      supabaseUrl.length > 0 && supabaseUrl !== "your_supabase_project_url";

    if (supabaseConfigured) {
      try {
        const supabase = getServiceClient();
        const { data, error } = await supabase
          .from("audits")
          .insert({
            tools_data: tools,
            use_case: useCase,
            team_size: teamSize,
            team_size_num: result.teamSizeNum,
            recommendations: result.recommendations,
            total_monthly_savings: result.totalMonthlySavings,
            total_annual_savings: result.totalAnnualSavings,
            total_current_spend: result.totalCurrentSpend,
            has_high_savings: result.hasHighSavings,
            is_already_optimal: result.isAlreadyOptimal,
          })
          .select("id")
          .single();

        if (!error && data?.id) {
          // Persist succeeded — return the real UUID
          // Also return result so client can cache it in sessionStorage
          return NextResponse.json({ auditId: data.id, result });
        }

        console.error("Supabase insert failed:", error?.message);
      } catch (dbErr) {
        console.error("Supabase error:", dbErr);
      }
    }

    // Fallback: generate a local ID (no DB needed)
    // The full result is returned in the response body so the client
    // can cache it in sessionStorage for the results page to read.
    const localId = `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    return NextResponse.json({ auditId: localId, result });
  } catch (err) {
    console.error("[/api/audit] Unhandled error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

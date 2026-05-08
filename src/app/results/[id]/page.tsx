import type { Metadata } from "next";
import { AuditResult } from "@/lib/audit-engine";
import { ResultsPageClient } from "./ResultsPageClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const title = "AI Spend Audit Results — Bloat";
  return {
    title,
    description: "Free AI spend audit. Find out where your team is overpaying on AI tools.",
    openGraph: { title, type: "website", siteName: "Bloat" },
    twitter: { card: "summary_large_image", title },
  };
}

// Server component — passes the ID to the client component.
// The client component fetches the audit from sessionStorage first,
// then falls back to Supabase for shared links.
export default async function ResultsPage({ params }: Props) {
  const { id } = await params;

  // Try Supabase server-side for proper SSR (shared links get real OG tags)
  let serverAudit: AuditResult | null = null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseConfigured =
    supabaseUrl.length > 0 && supabaseUrl !== "your_supabase_project_url";

  if (supabaseConfigured && !id.startsWith("local_")) {
    try {
      const { getServiceClient } = await import("@/lib/supabase");
      const supabase = getServiceClient();
      const { data, error } = await supabase
        .from("audits")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        serverAudit = {
          recommendations: data.recommendations,
          totalMonthlySavings: data.total_monthly_savings,
          totalAnnualSavings: data.total_annual_savings,
          totalCurrentSpend: data.total_current_spend,
          hasHighSavings: data.has_high_savings,
          isAlreadyOptimal: data.is_already_optimal,
          useCase: data.use_case,
          teamSize: data.team_size,
          teamSizeNum: data.team_size_num,
        } as AuditResult;
      }
    } catch (err) {
      console.error("Server-side audit fetch failed:", err);
    }
  }

  return <ResultsPageClient auditId={id} serverAudit={serverAudit} />;
}

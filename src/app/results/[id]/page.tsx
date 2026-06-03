import type { Metadata } from "next";
import { AuditResult } from "@/lib/audit-engine";
import { ResultsPageClient } from "./ResultsPageClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  // Try to fetch audit data for rich OG tags
  let savings = 0;
  let annual = 0;
  let useCase = "team";
  let optimal = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseConfigured =
    supabaseUrl.length > 0 && supabaseUrl !== "your_supabase_project_url";

  if (supabaseConfigured && !id.startsWith("local_")) {
    try {
      const { getServiceClient } = await import("@/lib/supabase");
      const supabase = getServiceClient();
      const { data } = await supabase
        .from("audits")
        .select("total_monthly_savings, total_annual_savings, use_case, is_already_optimal")
        .eq("id", id)
        .single();

      if (data) {
        savings = data.total_monthly_savings ?? 0;
        annual = data.total_annual_savings ?? 0;
        useCase = data.use_case ?? "team";
        optimal = data.is_already_optimal ?? false;
      }
    } catch {
      // Non-critical — fall back to generic tags
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://bloat.credex.rocks";
  const ogImageUrl = `${appUrl}/api/og?savings=${savings}&annual=${annual}&useCase=${encodeURIComponent(useCase)}&optimal=${optimal}`;

  const title = optimal
    ? "AI Spend Audit: Stack is lean — Bloat"
    : savings > 0
    ? `AI Spend Audit: $${savings.toLocaleString()}/mo in savings found — Bloat`
    : "AI Spend Audit Results — Bloat";

  const description = optimal
    ? "This team's AI tool stack is well-optimized. No major redundancies or plan mismatches found."
    : savings > 0
    ? `This audit identified $${savings.toLocaleString()}/mo ($${annual.toLocaleString()}/yr) in potential AI tool savings. Run your own free audit.`
    : "Free AI spend audit. Find out where your team is overpaying on AI tools.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Bloat",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
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

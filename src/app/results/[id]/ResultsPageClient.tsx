"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Share2, FileDown, Inbox } from "lucide-react";
import { AuditResult, ToolRecommendation, Severity } from "@/lib/audit-engine";
import { LeadCaptureModal } from "@/components/LeadCaptureModal";

interface Props {
  auditId: string;
  serverAudit: AuditResult | null; // Pre-fetched from Supabase (for shared links)
}

function severityBorder(severity: Severity) {
  if (severity === "critical") return "border-[#ffb4ab]";
  if (severity === "moderate") return "border-[#ab8980]";
  return "border-[#353535] opacity-80";
}

function severityIcon(severity: Severity) {
  if (severity === "critical") return { icon: "⚠", color: "text-[#ffb4ab]" };
  if (severity === "moderate") return { icon: "ℹ", color: "text-[#ab8980]" };
  return { icon: "✓", color: "text-[#353535]" };
}

function severityActionColor(severity: Severity) {
  if (severity === "critical") return "text-[#ffb4ab]";
  if (severity === "moderate") return "text-[#ffb5a0]";
  return "text-[#e4beb4]";
}

function ToolCard({ rec }: { rec: ToolRecommendation }) {
  const { icon, color } = severityIcon(rec.severity);
  return (
    <div
      className={`bg-[#141210] border ${severityBorder(rec.severity)} rounded-[8px] p-[24px] flex flex-col justify-between gap-[48px] group hover:bg-[#1e1c1a] transition-colors duration-200`}
    >
      <div>
        <div className="flex justify-between items-start mb-[8px]">
          <h3 className="text-h2 text-[#e5e2e1]">{rec.toolName}</h3>
          <span className={`text-xl ${color}`}>{icon}</span>
        </div>
        <div className="text-label-caps text-[#e4beb4] uppercase">
          {rec.currentPlanLabel}
          {rec.currentMonthlySpend > 0 && (
            <span className="ml-2 normal-case font-normal text-[#ab8980]">
              · ${rec.currentMonthlySpend.toLocaleString()}/mo
            </span>
          )}
        </div>
        <p className="text-body-sm text-[#e4beb4] mt-[8px] leading-relaxed">
          {rec.reason}
        </p>
      </div>

      <div className="border-t border-[#353535] pt-[8px]">
        <div className={`text-label-caps uppercase mb-[4px] ${severityActionColor(rec.severity)}`}>
          Action: {rec.recommendedAction}
        </div>
        <div className="flex items-baseline gap-[4px]">
          {rec.savingsPerMonth > 0 ? (
            <>
              <span className="text-metric-lg text-[#e5e2e1]">
                +${rec.savingsPerMonth.toLocaleString()}
              </span>
              <span className="text-body-sm text-[#e4beb4]">/mo</span>
            </>
          ) : (
            <span className="text-metric-lg text-[#353535]">—</span>
          )}
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="bg-[#141210] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-[#ffb5a0] text-4xl mb-4 animate-pulse">◌</div>
        <p className="text-body-base text-[#e4beb4]">Loading your audit…</p>
      </div>
    </div>
  );
}

function NotFoundState() {
  return (
    <div className="bg-[#141210] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-h1 text-[#e5e2e1] mb-2">Audit not found</h1>
        <p className="text-body-base text-[#e4beb4] mb-6">
          This audit may have expired or the link is invalid.
        </p>
        <Link
          href="/"
          className="bg-[#f04f23] text-white text-label-caps uppercase px-[24px] py-[8px] rounded-[6px] hover:opacity-90 transition-opacity"
        >
          Start new audit
        </Link>
      </div>
    </div>
  );
}

export function ResultsPageClient({ auditId, serverAudit }: Props) {
  const [audit, setAudit] = useState<AuditResult | null>(serverAudit);
  const [loading, setLoading] = useState(!serverAudit);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Try to read from sessionStorage (set by SpendForm after audit creation)
  useEffect(() => {
    if (audit) return;

    try {
      const cached = sessionStorage.getItem(`audit_${auditId}`);
      if (cached) {
        setAudit(JSON.parse(cached));
        setLoading(false);
        return;
      }
    } catch {
      // sessionStorage unavailable
    }

    // Nothing found — audit was accessed via a shared link with no server-side data
    setLoading(false);
  }, [auditId, audit]);

  // Fetch AI Summary once audit is loaded
  useEffect(() => {
    if (!audit || summaryText || isGeneratingSummary) return;

    // If serverAudit has summary_text, use it
    if (serverAudit && (serverAudit as any).summary_text) {
      setSummaryText((serverAudit as any).summary_text);
      return;
    }

    setIsGeneratingSummary(true);
    fetch("/api/ai-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auditId,
        recommendations: audit.recommendations,
        teamSize: audit.teamSize,
        useCase: audit.useCase,
        totalSavings: audit.totalMonthlySavings,
        isAlreadyOptimal: audit.isAlreadyOptimal,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.summary) {
          setSummaryText(data.summary);
        }
      })
      .catch((err) => {
        console.error("Summary fetch error", err);
      })
      .finally(() => {
        setIsGeneratingSummary(false);
      });
  }, [audit, auditId, summaryText, isGeneratingSummary, serverAudit]);

  async function handleShare() {
    const url = `${window.location.origin}/results/${auditId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked
    }
  }

  function handlePrint() {
    window.print();
  }

  if (loading) return <LoadingState />;
  if (!audit) return <NotFoundState />;

  return (
    <div className="bg-[#141210] text-[#e5e2e1] min-h-screen flex flex-col">
      {/* Skip to content — keyboard navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#f04f23] focus:text-white focus:px-4 focus:py-2 focus:rounded focus:text-sm"
      >
        Skip to main content
      </a>
      {/* Nav */}
      <header className="bg-[#141210] border-b border-[#5b4039] flex justify-between items-center w-full px-[24px] py-[16px] sticky top-0 z-50">
        <Link href="/" className="text-h1 font-bold text-[#ffb5a0] tracking-tight">
          Bloat
        </Link>
        <Link
          href="/"
          className="bg-[#f04f23] text-white text-label-caps uppercase px-[16px] py-[8px] rounded-[6px] hover:opacity-90 transition-opacity"
        >
          Start audit
        </Link>
      </header>

      <main id="main-content" className="flex-grow max-w-[1280px] mx-auto w-full px-[24px] py-[48px] flex flex-col gap-[48px]">

        {/* Hero — Savings */}
        <section className="flex flex-col items-center justify-center text-center py-[48px] border-b border-[#353535]">
          {audit.isAlreadyOptimal ? (
            <>
              <h1 className="text-h2 text-[#e4beb4] mb-[8px]">You&apos;re spending well</h1>
              <div className="text-metric-xl text-[#ffb5a0] mb-[4px]">$0/mo</div>
              <p className="text-body-base text-[#ab8980]">
                No significant optimizations found for your current stack.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-h2 text-[#e4beb4] mb-[8px]">You could save</h1>
              <div className="text-metric-xl text-[#ffb5a0] mb-[4px]">
                ${audit.totalMonthlySavings.toLocaleString()}/mo
              </div>
              <p className="text-body-base text-[#ab8980]">
                ${audit.totalAnnualSavings.toLocaleString()}/yr annualized equivalent
              </p>
            </>
          )}
        </section>

        {/* AI Summary */}
        <section
          id="ai-summary"
          className="bg-[#141210] border border-[#5b4039] rounded-[8px] p-[24px] flex flex-col gap-[8px] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#f04f23]" />
          <div className="flex items-center gap-[8px] mb-[4px]">
            <span className="text-[#f04f23] text-sm">{isGeneratingSummary ? "⚡" : "✦"}</span>
            <span className="text-label-caps text-[#ffb5a0] uppercase tracking-widest">
              {isGeneratingSummary ? "Generating AI summary..." : "AI summary"}
            </span>
          </div>
          <p className={`text-body-base text-[#e4beb4] max-w-3xl leading-relaxed ${isGeneratingSummary ? 'animate-pulse' : ''}`}>
            {summaryText || (audit.isAlreadyOptimal
              ? `Your AI tool stack looks well-configured for a ${audit.useCase} team. No major plan mismatches or redundancies detected. Sign up below to be notified when new optimizations apply to your stack.`
              : `Your ${audit.useCase} team is spending $${audit.totalCurrentSpend.toLocaleString()}/mo on AI tools with $${audit.totalMonthlySavings.toLocaleString()}/mo in identified savings — that's $${audit.totalAnnualSavings.toLocaleString()}/yr annualized. The primary drivers are plan tier mismatches and tool redundancies that don't add capability for your use case.`)}
          </p>
        </section>

        {/* Per-Tool Breakdown */}
        <section className="flex flex-col gap-[16px]">
          <h2 className="text-h2 text-[#e5e2e1] border-b border-[#353535] pb-[8px]">
            Expenditure Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {audit.recommendations.map((rec) => (
              <ToolCard key={rec.toolId} rec={rec} />
            ))}
          </div>
        </section>

        {/* Credex CTA — shown for high savings audits */}
        {audit.hasHighSavings && (
          <section className="bg-[#141210] border border-[#ab8980] p-[24px] rounded-[8px] flex flex-col md:flex-row items-start md:items-center justify-between gap-[16px] relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-[#f04f23] rounded-full blur-3xl opacity-10 pointer-events-none" />
            <div className="flex flex-col gap-[4px] z-10">
              <div className="flex items-center gap-[8px]">
                <span className="text-[#ffb5a0]">💳</span>
                <h3 className="text-h2 text-[#e5e2e1]">Optimize further with Credex</h3>
              </div>
              <p className="text-body-base text-[#e4beb4]">
                Credex sells discounted AI credits — Cursor, Claude, ChatGPT Enterprise and more. Capture your $
                {audit.totalMonthlySavings.toLocaleString()}/mo in savings now.
              </p>
            </div>
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 border border-[#ab8980] text-[#e5e2e1] text-label-caps uppercase px-[24px] py-[8px] rounded-[6px] hover:border-[#ffb5a0] hover:text-[#ffb5a0] transition-colors z-10"
            >
              Learn more
            </a>
          </section>
        )}

        {/* Already optimal — notification signup */}
        {audit.isAlreadyOptimal && (
          <section className="bg-[#141210] border border-[#5b4039] p-[24px] rounded-[8px] text-center">
            <p className="text-body-base text-[#e4beb4] mb-[16px]">
              Sign up to be notified when new optimizations apply to your stack.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#f04f23] text-white text-label-caps uppercase px-[24px] py-[8px] rounded-[6px] hover:opacity-90 transition-opacity"
            >
              Notify me
            </button>
          </section>
        )}

        {/* Action Buttons */}
        <section className="flex flex-col sm:flex-row items-center justify-center gap-[16px] border-t border-[#353535] pt-[48px] mt-[48px]" aria-label="Report actions">
          <button
            onClick={() => setShowModal(true)}
            id="save-report-btn"
            aria-label="Save report — send to email"
            className="w-full sm:w-auto bg-[#f04f23] text-white text-h2 px-[48px] py-[16px] rounded-[6px] hover:opacity-90 transition-opacity flex items-center justify-center gap-[8px]"
          >
            <Inbox size={20} aria-hidden="true" /> Save my report
          </button>
          <button
            onClick={handleShare}
            id="share-audit-btn"
            aria-label={copied ? "Link copied to clipboard" : "Copy shareable link to clipboard"}
            className="w-full sm:w-auto bg-transparent border border-[#ab8980] text-[#e5e2e1] text-h2 px-[48px] py-[16px] rounded-[6px] hover:border-[#e5e2e1] transition-colors flex items-center justify-center gap-[8px]"
          >
            <Share2 size={20} aria-hidden="true" /> {copied ? "Copied!" : "Share this audit"}
          </button>
          <button
            onClick={handlePrint}
            id="download-pdf-btn"
            aria-label="Download audit as PDF"
            className="no-print w-full sm:w-auto bg-transparent border border-[#5b4039] text-[#e4beb4] text-h2 px-[48px] py-[16px] rounded-[6px] hover:border-[#ab8980] hover:text-[#e5e2e1] transition-colors flex items-center justify-center gap-[8px]"
          >
            <FileDown size={20} aria-hidden="true" /> Download PDF
          </button>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#141210] border-t border-[#5b4039] flex flex-col md:flex-row justify-between items-center w-full px-[24px] py-[48px] gap-[16px] mt-auto">
        <div className="text-label-caps text-[#e5e2e1] uppercase tracking-widest">
          © 2025 Bloat. Built for Credex.
        </div>
        <div className="flex items-center gap-[24px]">
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="text-body-sm text-[#e4beb4] hover:text-[#ffb5a0] transition-colors">Credex</a>
          <a href="https://github.com/shubham-writes/bloat" target="_blank" rel="noopener noreferrer" className="text-body-sm text-[#e4beb4] hover:text-[#ffb5a0] transition-colors">GitHub</a>
        </div>
      </footer>

      {showModal && (
        <LeadCaptureModal
          auditId={auditId}
          savingsTotal={audit.totalMonthlySavings}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

// ============================================================
// AUDIT ENGINE — Rules-based AI spend analysis
// Pure TypeScript, no AI, no external calls.
// Logic must be defensible to a finance person.
// ============================================================

import { TOOLS, teamSizeToNumber, UseCase, TeamSize } from "./tools-data";
import { ToolEntry } from "./form-state";

export type Severity = "critical" | "moderate" | "optimal";

export interface ToolRecommendation {
  toolId: string;
  toolName: string;
  currentPlanLabel: string;
  currentMonthlySpend: number;
  recommendedAction: string;   // Short action label e.g. "Downgrade to Individual"
  reason: string;              // 1-sentence finance-readable reason
  savingsPerMonth: number;
  severity: Severity;
}

export interface AuditResult {
  recommendations: ToolRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  hasHighSavings: boolean;     // > $500/mo — show Credex CTA
  isAlreadyOptimal: boolean;
  useCase: UseCase;
  teamSize: TeamSize;
  teamSizeNum: number;
}

// ── Helper ────────────────────────────────────────────────
function getToolById(id: string) {
  return TOOLS.find((t) => t.id === id);
}

function getPlanById(toolId: string, planId: string) {
  const tool = getToolById(toolId);
  return tool?.plans.find((p) => p.id === planId);
}

// ── Main engine ───────────────────────────────────────────
export function runAuditEngine(
  entries: ToolEntry[],
  teamSize: TeamSize,
  useCase: UseCase
): AuditResult {
  const teamSizeNum = teamSizeToNumber(teamSize);
  const recommendations: ToolRecommendation[] = [];

  // Track which tools are present for redundancy detection
  const toolIds = new Set(entries.map((e) => e.toolId));

  for (const entry of entries) {
    const tool = getToolById(entry.toolId);
    if (!tool) continue;

    const currentPlan = getPlanById(entry.toolId, entry.planId);
    if (!currentPlan) continue;

    const rec = evaluateTool(entry, tool, currentPlan, teamSizeNum, useCase, toolIds);
    recommendations.push(rec);
  }

  const totalMonthlySavings = recommendations.reduce((s, r) => s + r.savingsPerMonth, 0);
  const totalCurrentSpend = entries.reduce((s, e) => s + e.monthlySpend, 0);

  return {
    recommendations,
    totalMonthlySavings: Math.round(totalMonthlySavings),
    totalAnnualSavings: Math.round(totalMonthlySavings * 12),
    totalCurrentSpend: Math.round(totalCurrentSpend),
    hasHighSavings: totalMonthlySavings > 500,
    isAlreadyOptimal: totalMonthlySavings === 0,
    useCase,
    teamSize,
    teamSizeNum,
  };
}

// ── Per-tool evaluation ───────────────────────────────────
function evaluateTool(
  entry: ToolEntry,
  tool: NonNullable<ReturnType<typeof getToolById>>,
  currentPlan: { id: string; label: string; pricePerSeat: number; minSeats?: number },
  teamSizeNum: number,
  useCase: UseCase,
  allToolIds: Set<string>
): ToolRecommendation {
  const base: Omit<ToolRecommendation, "recommendedAction" | "reason" | "savingsPerMonth" | "severity"> = {
    toolId: entry.toolId,
    toolName: tool.name,
    currentPlanLabel: currentPlan.label,
    currentMonthlySpend: entry.monthlySpend,
  };

  // ── RULE 1: Seat efficiency ──────────────────────────────
  // Team/Business plan for very small teams wastes money
  if (
    entry.toolId === "cursor" &&
    entry.planId === "business" &&
    entry.seats <= 2
  ) {
    const individualCost = 20 * entry.seats;
    const savings = entry.monthlySpend - individualCost;
    if (savings > 0) {
      return { ...base, recommendedAction: "Switch to Pro plan", reason: `Business plan is $40/seat but Pro is $20/seat — with ${entry.seats} seat${entry.seats > 1 ? "s" : ""}, that's $${savings}/mo wasted on team overhead you don't need yet.`, savingsPerMonth: savings, severity: "critical" };
    }
  }

  // ── RULE 2: GitHub Copilot + Cursor overlap ──────────────
  // These tools do the same thing. Paying for both is redundant.
  if (entry.toolId === "github-copilot" && allToolIds.has("cursor")) {
    const savings = entry.monthlySpend;
    return { ...base, recommendedAction: "Cancel — Cursor already covers this", reason: `Cursor and GitHub Copilot both provide AI code completion in the IDE. Running both for a ${useCase} team means you're paying twice for the same capability.`, savingsPerMonth: savings, severity: "critical" };
  }

  if (entry.toolId === "cursor" && allToolIds.has("github-copilot")) {
    // Cursor is probably the better choice for most, so flag copilot not cursor
    // Just mark cursor as optimal in this pair
    return { ...base, recommendedAction: "Keep — drop Copilot instead", reason: "Cursor's context window and codebase indexing are superior to Copilot for most coding use cases. Cancel Copilot to eliminate redundancy.", savingsPerMonth: 0, severity: "optimal" };
  }

  // ── RULE 3: Claude Team with very small team ─────────────
  if (
    entry.toolId === "claude" &&
    entry.planId === "team" &&
    entry.seats <= 2
  ) {
    const proSavings = entry.monthlySpend - 20 * entry.seats;
    if (proSavings > 0) {
      return { ...base, recommendedAction: "Downgrade to Pro (per seat)", reason: `Claude Team is $30/seat with a 2-seat minimum. With ${entry.seats} seat${entry.seats > 1 ? "s" : ""} you'd save $${proSavings}/mo on Pro — Team features (admin, SSO) aren't worth the premium at this scale.`, savingsPerMonth: proSavings, severity: "moderate" };
    }
  }

  // ── RULE 4: ChatGPT Team with small team ─────────────────
  if (
    entry.toolId === "chatgpt" &&
    entry.planId === "team" &&
    entry.seats <= 2
  ) {
    const plusSavings = (30 - 20) * entry.seats;
    return { ...base, recommendedAction: "Downgrade to Plus", reason: `ChatGPT Team is $30/seat vs Plus at $20/seat. With ${entry.seats} user${entry.seats > 1 ? "s" : ""}, Team features (shared workspace, admin console) are overkill — save $${plusSavings}/mo.`, savingsPerMonth: plusSavings, severity: "moderate" };
  }

  // ── RULE 5: Claude Max for non-power users ───────────────
  if (
    entry.toolId === "claude" &&
    entry.planId === "max" &&
    useCase !== "coding" &&
    entry.seats <= 3
  ) {
    const savings = (100 - 20) * entry.seats;
    return { ...base, recommendedAction: "Downgrade to Pro", reason: `Claude Max ($100/seat) is 5× the usage limit of Pro ($20/seat). For a ${useCase} use case with ${entry.seats} seat${entry.seats > 1 ? "s" : ""}, most teams never hit Pro limits — you're paying for headroom you don't use.`, savingsPerMonth: savings, severity: "moderate" };
  }

  // ── RULE 6: Windsurf overlap with Cursor ─────────────────
  if (entry.toolId === "windsurf" && allToolIds.has("cursor")) {
    return { ...base, recommendedAction: "Cancel — Cursor already covers this", reason: "Windsurf and Cursor are both AI-native IDEs with overlapping feature sets. Running both simultaneously doubles your IDE spend with no capability gain.", savingsPerMonth: entry.monthlySpend, severity: "critical" };
  }

  // ── RULE 7: Perplexity for coding teams ──────────────────
  if (
    entry.toolId === "perplexity" &&
    useCase === "coding" &&
    (allToolIds.has("cursor") || allToolIds.has("github-copilot"))
  ) {
    return { ...base, recommendedAction: "Consider cancelling", reason: `Perplexity Pro is primarily a research/web-search tool. For a coding team already using ${allToolIds.has("cursor") ? "Cursor" : "GitHub Copilot"} (which includes web context), Perplexity adds marginal value at $${entry.monthlySpend}/mo.`, savingsPerMonth: entry.monthlySpend * 0.5, severity: "moderate" };
  }

  // ── RULE 8: GitHub Copilot Enterprise for small teams ────
  if (
    entry.toolId === "github-copilot" &&
    entry.planId === "enterprise" &&
    entry.seats < 10
  ) {
    const savings = (39 - 19) * entry.seats;
    return { ...base, recommendedAction: "Downgrade to Business", reason: `Copilot Enterprise ($39/seat) adds policy controls and org-wide knowledge bases — features that only matter at 10+ developers. At ${entry.seats} seats, Business plan at $19/seat saves $${savings}/mo.`, savingsPerMonth: savings, severity: "moderate" };
  }

  // ── RULE 9: Gemini Business for non-Google-Workspace teams
  if (
    entry.toolId === "gemini" &&
    entry.planId === "business" &&
    useCase !== "research"
  ) {
    const savings = (30 - 20) * entry.seats;
    return { ...base, recommendedAction: "Downgrade to Advanced", reason: `Gemini Business ($30/seat) bundles Google Workspace integration. If you're not a Workspace shop, the Advanced plan ($20/seat) gives the same AI capability for $${savings}/mo less.`, savingsPerMonth: savings, severity: "moderate" };
  }

  // ── DEFAULT: Already optimal ─────────────────────────────
  return {
    ...base,
    recommendedAction: "No action needed",
    reason: `${tool.name} ${currentPlan.label} is appropriately sized for your team and use case.`,
    savingsPerMonth: 0,
    severity: "optimal",
  };
}

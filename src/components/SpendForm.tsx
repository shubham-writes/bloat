"use client";

import { useEffect, useState, useCallback } from "react";
import { TOOLS, USE_CASES, TEAM_SIZES, UseCase, TeamSize } from "@/lib/tools-data";
import { FormState, loadFormState, saveFormState, ToolEntry } from "@/lib/form-state";
import { ToolCard } from "./ToolCard";
import { cn } from "@/lib/utils";
import { ArrowRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function SpendForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load from localStorage on mount (client only)
  useEffect(() => {
    setForm(loadFormState());
  }, []);

  // Persist to localStorage on every change
  useEffect(() => {
    if (form) saveFormState(form);
  }, [form]);

  const updateTool = useCallback((entry: ToolEntry) => {
    setForm((prev) => {
      if (!prev) return prev;
      const existing = prev.tools.findIndex((t) => t.toolId === entry.toolId);
      const tools =
        existing >= 0
          ? prev.tools.map((t, i) => (i === existing ? entry : t))
          : [...prev.tools, entry];
      return { ...prev, tools };
    });
  }, []);

  const setUseCase = (useCase: UseCase) =>
    setForm((prev) => prev ? { ...prev, useCase } : prev);

  const setTeamSize = (teamSize: TeamSize) =>
    setForm((prev) => prev ? { ...prev, teamSize } : prev);

  const enabledTools = form?.tools.filter((t) => t.enabled) ?? [];
  const totalSpend = enabledTools.reduce((sum, t) => sum + t.monthlySpend, 0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    if (enabledTools.length === 0) {
      setError("Add at least one AI tool to audit.");
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools: enabledTools,
          teamSize: form.teamSize,
          useCase: form.useCase,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      const { auditId } = await res.json();
      router.push(`/results/${auditId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (!form) {
    // Skeleton while hydrating
    return (
      <div className="space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Tool Grid */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">
          Your AI Tools
        </h2>
        <p className="text-sm text-gray-400 mb-4">
          Toggle each tool you pay for and fill in your actual spend.
        </p>
        <div className="grid gap-3">
          {TOOLS.map((tool) => {
            const entry = form.tools.find((t) => t.toolId === tool.id);
            return (
              <ToolCard
                key={tool.id}
                tool={tool}
                entry={entry}
                onChange={updateTool}
              />
            );
          })}
        </div>
      </div>

      {/* Team Context */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Use Case */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Primary use case
          </label>
          <div className="grid grid-cols-1 gap-2">
            {USE_CASES.map((uc) => (
              <button
                key={uc.value}
                type="button"
                onClick={() => setUseCase(uc.value)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition-all duration-200",
                  form.useCase === uc.value
                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-300"
                )}
              >
                <span className="text-sm font-medium">{uc.label}</span>
                <span className="text-xs text-gray-500 ml-auto hidden sm:block">{uc.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Team Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Team size
          </label>
          <div className="grid grid-cols-1 gap-2">
            {TEAM_SIZES.map((ts) => (
              <button
                key={ts.value}
                type="button"
                onClick={() => setTeamSize(ts.value)}
                className={cn(
                  "px-4 py-2.5 rounded-xl border text-left transition-all duration-200",
                  form.teamSize === ts.value
                    ? "border-violet-500 bg-violet-500/10 text-violet-300"
                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20 hover:text-gray-300"
                )}
              >
                <span className="text-sm font-medium">{ts.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spend Summary + Submit */}
      <div className="sticky bottom-4 z-10">
        <div className="bg-gray-900/90 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div>
            {enabledTools.length > 0 ? (
              <>
                <p className="text-xs text-gray-400">{enabledTools.length} tool{enabledTools.length !== 1 ? "s" : ""} · ${totalSpend.toLocaleString()}/mo</p>
                <p className="text-sm font-semibold text-white">
                  Find your savings →
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-400">Add at least one tool above</p>
            )}
          </div>

          {error && (
            <p className="text-xs text-red-400 flex-1 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting || enabledTools.length === 0}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200",
              "bg-gradient-to-r from-violet-600 to-purple-600 text-white",
              "hover:from-violet-500 hover:to-purple-500 hover:scale-105",
              "disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100",
              "shadow-lg shadow-violet-900/30"
            )}
          >
            {submitting ? (
              <>
                <span className="animate-spin">⋯</span>
                Auditing…
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Run Audit
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

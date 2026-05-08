"use client";

import { useEffect, useState, useCallback } from "react";
import { TOOLS, USE_CASES, TEAM_SIZES, UseCase, TeamSize } from "@/lib/tools-data";
import { FormState, loadFormState, saveFormState, ToolEntry } from "@/lib/form-state";
import { ToolCard } from "./ToolCard";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function SpendForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setForm(loadFormState()); }, []);
  useEffect(() => { if (form) saveFormState(form); }, [form]);

  const updateTool = useCallback((entry: ToolEntry) => {
    setForm((prev) => {
      if (!prev) return prev;
      const existing = prev.tools.findIndex((t) => t.toolId === entry.toolId);
      const tools = existing >= 0
        ? prev.tools.map((t, i) => (i === existing ? entry : t))
        : [...prev.tools, entry];
      return { ...prev, tools };
    });
  }, []);

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
        body: JSON.stringify({ tools: enabledTools, teamSize: form.teamSize, useCase: form.useCase }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }
      const { auditId, result } = await res.json();
      // Cache the result so the results page can read it without a DB round-trip
      // This is especially important for local_ IDs when Supabase isn't configured
      if (result) {
        try {
          sessionStorage.setItem(`audit_${auditId}`, JSON.stringify(result));
        } catch {
          // sessionStorage might be unavailable (private browsing, storage full) — not fatal
        }
      }
      router.push(`/results/${auditId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  if (!form) {
    return (
      <div className="space-y-2 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-14 rounded-[8px] bg-[#1e1c1a]" />
        ))}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[48px]">
      {/* Global settings */}
      <section className="flex flex-col gap-[24px] border-b border-[#20201f] pb-[48px]">
        {/* Team size — now a number input matching form.html */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-label-caps text-[#e5e2e1] uppercase" htmlFor="team-size-select">
            Team Size
          </label>
          <div className="flex flex-wrap gap-[8px]">
            {TEAM_SIZES.map((ts) => (
              <button
                key={ts.value}
                type="button"
                onClick={() => setForm((p) => p ? { ...p, teamSize: ts.value as TeamSize } : p)}
                className={cn(
                  "px-[16px] py-[8px] rounded-full border text-label-caps uppercase transition-colors",
                  form.teamSize === ts.value
                    ? "border-[#f04f23] bg-[#f04f23] text-white"
                    : "border-[#20201f] bg-[#1e1c1a] text-[#e4beb4] hover:bg-[#2c2a27]"
                )}
              >
                {ts.label}
              </button>
            ))}
          </div>
        </div>

        {/* Use Case — pill buttons matching form.html */}
        <div className="flex flex-col gap-[8px]">
          <label className="text-label-caps text-[#e5e2e1] uppercase">
            Primary Use Case
          </label>
          <div className="flex flex-wrap gap-[8px]">
            {USE_CASES.map((uc) => (
              <button
                key={uc.value}
                type="button"
                onClick={() => setForm((p) => p ? { ...p, useCase: uc.value as UseCase } : p)}
                className={cn(
                  "px-[16px] py-[8px] rounded-full border text-label-caps uppercase transition-colors",
                  form.useCase === uc.value
                    ? "border-[#ff5722] bg-[#ff5722] text-white"
                    : "border-[#20201f] bg-[#1c1b1b] text-[#e4beb4] hover:bg-[#2a2a2a]"
                )}
              >
                {uc.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tool input section */}
      <section className="flex flex-col gap-[16px]">
        <h2 className="text-h2 text-[#e5e2e1]">Add a tool</h2>
        <div className="flex flex-col gap-[8px]">
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
      </section>

      {/* CTA */}
      <div className="flex flex-col gap-[8px]">
        {error && <p className="text-body-sm text-[#ffb4ab] text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitting || enabledTools.length === 0}
          className="w-full bg-[#f04f23] text-white rounded-[6px] px-[24px] py-[16px] text-h2 text-center hover:opacity-90 transition-opacity flex items-center justify-center gap-[8px] disabled:opacity-40 disabled:cursor-not-allowed"
          id="run-audit-btn"
        >
          {submitting ? "Running audit…" : "Run my audit"}{" "}
          {!submitting && <span>→</span>}
        </button>

        <p className="text-center text-body-sm text-[#e4beb4] flex items-center justify-center gap-[4px]">
          <span>☁</span> Form saves automatically
          {enabledTools.length > 0 && (
            <span className="ml-2 text-[#ab8980]">
              · {enabledTools.length} tool{enabledTools.length !== 1 ? "s" : ""}, ${totalSpend.toLocaleString()}/mo
            </span>
          )}
        </p>
      </div>
    </form>
  );
}

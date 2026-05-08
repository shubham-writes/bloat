"use client";

import { useState, useEffect } from "react";
import { Tool, Plan } from "@/lib/tools-data";
import { ToolEntry } from "@/lib/form-state";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  tool: Tool;
  entry: ToolEntry | undefined;
  onChange: (entry: ToolEntry) => void;
}

export function ToolCard({ tool, entry, onChange }: ToolCardProps) {
  const enabled = entry?.enabled ?? false;
  const selectedPlanId = entry?.planId ?? tool.plans[0].id;
  const selectedPlan = tool.plans.find((p) => p.id === selectedPlanId) ?? tool.plans[0];
  const seats = entry?.seats ?? 1;

  const [spendInput, setSpendInput] = useState<string>(
    entry?.monthlySpend?.toString() ?? ""
  );

  useEffect(() => {
    if (enabled && selectedPlan.pricePerSeat > 0) {
      const auto = (selectedPlan.pricePerSeat * seats).toFixed(0);
      setSpendInput(auto);
      onChange({ toolId: tool.id, planId: selectedPlanId, monthlySpend: parseFloat(auto), seats, enabled: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanId, seats]);

  function toggleEnabled() {
    if (!enabled) {
      const defaultSpend = selectedPlan.pricePerSeat * seats;
      setSpendInput(defaultSpend > 0 ? defaultSpend.toString() : "");
      onChange({ toolId: tool.id, planId: selectedPlanId, monthlySpend: defaultSpend, seats, enabled: true });
    } else {
      onChange({ toolId: tool.id, planId: selectedPlanId, monthlySpend: 0, seats, enabled: false });
    }
  }

  function handlePlanChange(planId: string) {
    const plan = tool.plans.find((p) => p.id === planId)!;
    const newSpend = plan.pricePerSeat * seats;
    setSpendInput(newSpend > 0 ? newSpend.toString() : spendInput);
    onChange({ toolId: tool.id, planId, monthlySpend: newSpend > 0 ? newSpend : parseFloat(spendInput) || 0, seats, enabled: true });
  }

  function handleSeatsChange(val: number) {
    const newSeats = Math.max(1, val);
    const newSpend = selectedPlan.pricePerSeat * newSeats;
    setSpendInput(newSpend > 0 ? newSpend.toString() : spendInput);
    onChange({ toolId: tool.id, planId: selectedPlanId, monthlySpend: newSpend > 0 ? newSpend : parseFloat(spendInput) || 0, seats: newSeats, enabled: true });
  }

  function handleSpendChange(val: string) {
    setSpendInput(val);
    onChange({ toolId: tool.id, planId: selectedPlanId, monthlySpend: parseFloat(val) || 0, seats, enabled: true });
  }

  return (
    <div
      className={cn(
        "bg-[#1e1c1a] border rounded-[8px] transition-all duration-200 overflow-hidden",
        enabled ? "border-[#5b4039]" : "border-[#20201f]"
      )}
    >
      {/* Header row */}
      <button
        type="button"
        onClick={toggleEnabled}
        className="w-full flex items-center gap-[16px] p-[16px] text-left"
      >
        {/* Logo chip */}
        <div
          className={cn(
            "w-9 h-9 rounded-[8px] bg-gradient-to-br flex-shrink-0 flex items-center justify-center text-white font-bold text-sm",
            tool.logoColor,
            !enabled && "opacity-30 grayscale"
          )}
        >
          {tool.name.slice(0, 2)}
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn("text-body-base font-semibold transition-colors", enabled ? "text-[#e5e2e1]" : "text-[#454747]")}>
            {tool.name}
          </p>
          <p className="text-body-sm text-[#ab8980]">{tool.vendor}</p>
        </div>

        {enabled && entry && entry.monthlySpend > 0 && (
          <span className="text-body-sm font-mono text-[#ffb5a0] flex-shrink-0">
            ${entry.monthlySpend.toLocaleString()}/mo
          </span>
        )}

        {/* Checkbox indicator */}
        <div
          className={cn(
            "w-5 h-5 rounded-[6px] border-2 flex-shrink-0 flex items-center justify-center transition-all",
            enabled ? "bg-[#f04f23] border-[#f04f23]" : "border-[#5b4039] bg-transparent"
          )}
        >
          {enabled && (
            <svg viewBox="0 0 20 20" fill="white" className="w-full h-full p-0.5">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </button>

      {/* Expanded controls */}
      {enabled && (
        <div className="px-[16px] pb-[16px] grid grid-cols-1 sm:grid-cols-3 gap-[16px] border-t border-[#20201f] pt-[16px]">
          {/* Plan */}
          <div className="flex flex-col gap-[4px]">
            <label className="text-label-caps text-[#e4beb4] uppercase" htmlFor={`plan-${tool.id}`}>
              Plan
            </label>
            <div className="relative">
              <select
                id={`plan-${tool.id}`}
                value={selectedPlanId}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="w-full appearance-none bg-[#0f0d0c] border border-[#5b4039] rounded-[6px] px-[16px] py-[8px] text-body-base text-[#e5e2e1] focus:outline-none focus:border-[#f04f23] transition-colors"
              >
                {tool.plans.map((plan: Plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.label}{plan.pricePerSeat > 0 ? ` — $${plan.pricePerSeat}/seat` : ""}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-[12px] pointer-events-none text-[#e4beb4] text-xs">
                ▾
              </div>
            </div>
          </div>

          {/* Seats */}
          <div className="flex flex-col gap-[4px]">
            <label className="text-label-caps text-[#e4beb4] uppercase" htmlFor={`seats-${tool.id}`}>
              Seats
            </label>
            <input
              id={`seats-${tool.id}`}
              type="number"
              min={1}
              value={seats}
              onChange={(e) => handleSeatsChange(parseInt(e.target.value) || 1)}
              className="bg-[#0f0d0c] border border-[#5b4039] rounded-[6px] px-[16px] py-[8px] text-body-base text-[#e5e2e1] focus:outline-none focus:border-[#f04f23] transition-colors"
            />
          </div>

          {/* Monthly spend */}
          <div className="flex flex-col gap-[4px]">
            <label className="text-label-caps text-[#e4beb4] uppercase" htmlFor={`spend-${tool.id}`}>
              Monthly Spend ($)
            </label>
            <input
              id={`spend-${tool.id}`}
              type="number"
              min={0}
              step="0.01"
              value={spendInput}
              onChange={(e) => handleSpendChange(e.target.value)}
              placeholder="0.00"
              className="bg-[#0f0d0c] border border-[#5b4039] rounded-[6px] px-[16px] py-[8px] text-body-base text-[#e5e2e1] focus:outline-none focus:border-[#f04f23] transition-colors"
            />
            {selectedPlan.notes && (
              <p className="text-body-sm text-[#ab8980]">{selectedPlan.notes}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

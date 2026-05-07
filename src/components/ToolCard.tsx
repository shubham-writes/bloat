"use client";

import { useState, useEffect } from "react";
import { Tool, Plan } from "@/lib/tools-data";
import { ToolEntry } from "@/lib/form-state";
import { cn } from "@/lib/utils";
import { ChevronDown, DollarSign } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
  entry: ToolEntry | undefined;
  onChange: (entry: ToolEntry) => void;
}

export function ToolCard({ tool, entry, onChange }: ToolCardProps) {
  const enabled = entry?.enabled ?? false;
  const selectedPlanId = entry?.planId ?? tool.plans[0].id;
  const selectedPlan = tool.plans.find((p) => p.id === selectedPlanId) ?? tool.plans[0];

  // Auto-fill monthly spend from plan price × seats when plan changes
  const seats = entry?.seats ?? 1;

  const [spendInput, setSpendInput] = useState<string>(
    entry?.monthlySpend?.toString() ?? ""
  );

  // Keep spend input in sync when plan changes
  useEffect(() => {
    if (enabled && selectedPlan.pricePerSeat > 0) {
      const auto = (selectedPlan.pricePerSeat * seats).toFixed(0);
      setSpendInput(auto);
      onChange({
        toolId: tool.id,
        planId: selectedPlanId,
        monthlySpend: parseFloat(auto),
        seats,
        enabled: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanId, seats]);

  function toggleEnabled() {
    if (!enabled) {
      const defaultSpend = selectedPlan.pricePerSeat * seats;
      setSpendInput(defaultSpend > 0 ? defaultSpend.toString() : "");
      onChange({
        toolId: tool.id,
        planId: selectedPlanId,
        monthlySpend: defaultSpend,
        seats,
        enabled: true,
      });
    } else {
      onChange({ toolId: tool.id, planId: selectedPlanId, monthlySpend: 0, seats, enabled: false });
    }
  }

  function handlePlanChange(planId: string) {
    const plan = tool.plans.find((p) => p.id === planId)!;
    const newSpend = plan.pricePerSeat * seats;
    setSpendInput(newSpend > 0 ? newSpend.toString() : spendInput);
    onChange({
      toolId: tool.id,
      planId,
      monthlySpend: newSpend > 0 ? newSpend : parseFloat(spendInput) || 0,
      seats,
      enabled: true,
    });
  }

  function handleSeatsChange(val: number) {
    const newSeats = Math.max(1, val);
    const newSpend = selectedPlan.pricePerSeat * newSeats;
    setSpendInput(newSpend > 0 ? newSpend.toString() : spendInput);
    onChange({
      toolId: tool.id,
      planId: selectedPlanId,
      monthlySpend: newSpend > 0 ? newSpend : parseFloat(spendInput) || 0,
      seats: newSeats,
      enabled: true,
    });
  }

  function handleSpendChange(val: string) {
    setSpendInput(val);
    onChange({
      toolId: tool.id,
      planId: selectedPlanId,
      monthlySpend: parseFloat(val) || 0,
      seats,
      enabled: true,
    });
  }

  return (
    <div
      className={cn(
        "rounded-2xl border transition-all duration-300 overflow-hidden",
        enabled
          ? "border-white/20 bg-white/5 shadow-lg"
          : "border-white/8 bg-white/[0.02]"
      )}
    >
      {/* Header — always visible */}
      <button
        type="button"
        onClick={toggleEnabled}
        className="w-full flex items-center gap-4 p-4 text-left group"
      >
        {/* Logo dot */}
        <div
          className={cn(
            "w-10 h-10 rounded-xl bg-gradient-to-br flex-shrink-0 flex items-center justify-center",
            tool.logoColor,
            !enabled && "opacity-40 grayscale"
          )}
        >
          <span className="text-white font-bold text-sm">
            {tool.name.slice(0, 2)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-semibold text-sm transition-colors",
              enabled ? "text-white" : "text-gray-500"
            )}
          >
            {tool.name}
          </p>
          <p className="text-xs text-gray-500">{tool.vendor}</p>
        </div>

        {/* Monthly spend preview */}
        {enabled && entry && entry.monthlySpend > 0 && (
          <span className="text-sm font-mono font-semibold text-violet-300 flex-shrink-0">
            ${entry.monthlySpend.toLocaleString()}/mo
          </span>
        )}

        {/* Toggle indicator */}
        <div
          className={cn(
            "w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all duration-200",
            enabled
              ? "bg-violet-500 border-violet-500"
              : "border-gray-600 bg-transparent"
          )}
        >
          {enabled && (
            <svg viewBox="0 0 20 20" fill="white" className="w-full h-full p-0.5">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </button>

      {/* Expanded controls — only when enabled */}
      {enabled && (
        <div className="px-4 pb-4 pt-0 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-white/5">
          {/* Plan selector */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Plan</label>
            <div className="relative">
              <select
                value={selectedPlanId}
                onChange={(e) => handlePlanChange(e.target.value)}
                className="w-full appearance-none bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white pr-8 focus:outline-none focus:border-violet-500 transition-colors"
                id={`plan-${tool.id}`}
              >
                {tool.plans.map((plan: Plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.label}
                    {plan.pricePerSeat > 0 ? ` — $${plan.pricePerSeat}/seat` : ""}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Seats */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">Seats</label>
            <input
              type="number"
              min={1}
              value={seats}
              onChange={(e) => handleSeatsChange(parseInt(e.target.value) || 1)}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
              id={`seats-${tool.id}`}
            />
          </div>

          {/* Monthly spend override */}
          <div>
            <label className="block text-xs text-gray-500 mb-1 font-medium">
              Monthly spend (USD)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min={0}
                step="0.01"
                value={spendInput}
                onChange={(e) => handleSpendChange(e.target.value)}
                placeholder="Auto"
                className="w-full bg-black/30 border border-white/10 rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 transition-colors"
                id={`spend-${tool.id}`}
              />
            </div>
            {selectedPlan.notes && (
              <p className="text-xs text-gray-500 mt-1">{selectedPlan.notes}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

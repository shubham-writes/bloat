import { runAuditEngine } from "../audit-engine";
import { ToolEntry } from "../form-state";
import { TeamSize, UseCase } from "../tools-data";

describe("Audit Engine", () => {
  const defaultContext = { teamSize: "2-5" as TeamSize, useCase: "coding" as UseCase };

  it("1. Flags single user on Team plan as oversized", () => {
    const inputs: ToolEntry[] = [
      { toolId: "chatgpt", planId: "team", monthlySpend: 30, seats: 1 }
    ];
    
    const result = runAuditEngine(inputs, "solo", "writing");
    const rec = result.recommendations[0];
    
    expect(rec.recommendedAction).toContain("Downgrade to Plus");
    expect(rec.savingsPerMonth).toBe(10); // 30 (team) - 20 (plus)
    expect(result.totalMonthlySavings).toBe(10);
  });

  it("2. Detects redundancy between Cursor and Copilot", () => {
    const inputs: ToolEntry[] = [
      { toolId: "cursor", planId: "pro", monthlySpend: 20, seats: 1 },
      { toolId: "github-copilot", planId: "individual", monthlySpend: 10, seats: 1 }
    ];
    
    const result = runAuditEngine(inputs, "solo", "coding");
    const copilotRec = result.recommendations.find(r => r.toolId === "github-copilot");
    
    expect(copilotRec).toBeDefined();
    expect(copilotRec?.recommendedAction).toContain("Cancel");
    expect(copilotRec?.savingsPerMonth).toBe(10);
    expect(result.totalMonthlySavings).toBe(10);
  });

  it("3. Detects business/team plan mismatches", () => {
    const inputs: ToolEntry[] = [
      { toolId: "cursor", planId: "business", monthlySpend: 80, seats: 2 }
    ];
    
    const result = runAuditEngine(inputs, "solo", "writing");
    const rec = result.recommendations[0];
    
    expect(rec.recommendedAction).toContain("Switch to Pro plan");
    expect(rec.savingsPerMonth).toBe(40); // 80 - 40
  });

  it("4. Sets isAlreadyOptimal to true when all tools are optimal", () => {
    const inputs: ToolEntry[] = [
      { toolId: "claude", planId: "pro", monthlySpend: 20, seats: 1 }
    ];
    
    const result = runAuditEngine(inputs, "solo", "writing");
    
    expect(result.isAlreadyOptimal).toBe(true);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations[0].savingsPerMonth).toBe(0);
  });

  it("5. Sets hasHighSavings flag correctly at $500 threshold", () => {
    // Large savings by triggering redundancy rule with high spend
    const inputsHighAPI: ToolEntry[] = [
      { toolId: "cursor", planId: "pro", monthlySpend: 20, seats: 1 },
      { toolId: "github-copilot", planId: "enterprise", monthlySpend: 600, seats: 15 } // overlap saves the entire 600
    ];
    
    const resultHigh = runAuditEngine(inputsHighAPI, "solo", "coding");
    expect(resultHigh.hasHighSavings).toBe(true);

    const inputsLow: ToolEntry[] = [
      { toolId: "cursor", planId: "pro", monthlySpend: 20, seats: 1 }
    ];
    const resultLow = runAuditEngine(inputsLow, "solo", "coding");
    expect(resultLow.hasHighSavings).toBe(false);
  });
});

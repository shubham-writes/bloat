import { NextRequest, NextResponse } from "next/server";

// Stub route — fully implemented on Day 2 with audit engine + Supabase
// For Day 1: just validates input and returns a placeholder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tools, teamSize, useCase } = body;

    if (!tools || !Array.isArray(tools) || tools.length === 0) {
      return NextResponse.json({ error: "No tools provided." }, { status: 400 });
    }

    if (!teamSize || !useCase) {
      return NextResponse.json({ error: "Missing teamSize or useCase." }, { status: 400 });
    }

    // Temporary: return a demo ID until Day 2 wires up the full engine
    const demoId = "demo-" + Date.now();
    return NextResponse.json({ auditId: demoId });
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

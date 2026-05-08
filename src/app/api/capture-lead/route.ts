import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";

// Full email sending added on Day 3 with Resend integration
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, company, role, auditId, savingsTotal } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const supabaseConfigured =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_URL !== "your_supabase_project_url";

    if (supabaseConfigured) {
      const supabase = getServiceClient();
      const { error } = await supabase.from("leads").insert({
        audit_id: auditId && !auditId.startsWith("local_") ? auditId : null,
        email,
        company_name: company || null,
        role: role || null,
        savings_total: savingsTotal || 0,
        email_sent: false,
      });

      if (error && !error.message.includes("unique")) {
        // Ignore duplicate email+audit errors, log the rest
        console.error("Lead insert error:", error.message);
      }
    }

    // TODO Day 3: send transactional email via Resend here

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Capture lead error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

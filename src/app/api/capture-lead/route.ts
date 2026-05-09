import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase";
import { Resend } from "resend";
import { getAuditEmailHtml } from "@/lib/email-templates";

const resend = new Resend(process.env.RESEND_API_KEY || "dummy_key");
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

    // Send transactional email via Resend
    let emailSent = false;
    const resendKey = process.env.RESEND_API_KEY;
    console.log("[capture-lead] RESEND_API_KEY present:", !!resendKey, "| first 10 chars:", resendKey?.slice(0, 10));
    console.log("[capture-lead] Sending to:", email, "| savingsTotal:", savingsTotal);

    if (resendKey && resendKey !== "your_resend_api_key") {
      try {
        const result = await resend.emails.send({
          from: "onboarding@resend.dev",
          to: [email],
          subject: `Your AI Spend Audit ($${(savingsTotal ?? 0).toLocaleString()}/mo savings)`,
          html: getAuditEmailHtml(auditId, savingsTotal ?? 0, company),
        });

        console.log("[capture-lead] Resend result:", JSON.stringify(result));

        if (result.error) {
          console.error("[capture-lead] Resend API error:", result.error);
        } else {
          emailSent = true;
          if (supabaseConfigured) {
            const supabase = getServiceClient();
            await supabase
              .from("leads")
              .update({ email_sent: true })
              .eq("email", email)
              .eq("audit_id", auditId);
          }
        }
      } catch (emailErr) {
        console.error("[capture-lead] Exception sending email:", emailErr);
      }
    } else {
      console.warn("[capture-lead] Resend API key not configured — skipping email.");
    }
    console.log("[capture-lead] emailSent:", emailSent);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Capture lead error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

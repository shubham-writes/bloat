export function getAuditEmailHtml(auditId: string, savingsTotal: number, company: string | null) {
  const auditUrl = `${process.env.NEXT_PUBLIC_APP_URL}/results/${auditId}`;
  
  // Use a generic greeting if company is not provided
  const greeting = company ? `someone at ${company}` : "your team";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Your AI Spend Audit</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #141210; color: #e5e2e1; margin: 0; padding: 40px 20px;">
        <div style="max-w-md margin: 0 auto; background-color: #1e1c1a; border: 1px solid #353535; border-radius: 8px; padding: 32px;">
          
          <h1 style="color: #ffb5a0; margin-top: 0; font-size: 24px;">Bloat Audit Results</h1>
          
          <p style="font-size: 16px; line-height: 1.5; color: #e4beb4;">
            Your AI tool audit is complete. We identified <strong>$${savingsTotal.toLocaleString()}/mo</strong> in potential savings for ${greeting}.
          </p>
          
          <div style="margin: 32px 0;">
            ${auditId.startsWith("local_") ? `
            <p style="font-size: 14px; color: #ab8980; background-color: #2c2a27; border: 1px solid #353535; border-radius: 6px; padding: 16px; margin: 0;">
              Your audit was run without a database connection, so it is only stored in your browser. To view it, return to the browser tab where you ran the audit.
            </p>
            <div style="margin-top: 16px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="background-color: #f04f23; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
                Run a New Audit
              </a>
            </div>
            ` : `
            <a href="${auditUrl}" style="background-color: #f04f23; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; display: inline-block;">
              View Full Audit Report
            </a>
            `}
          </div>
          
          ${savingsTotal > 500 ? `
          <div style="background-color: #2c2a27; border-left: 4px solid #f04f23; padding: 16px; margin-bottom: 24px;">
            <h3 style="color: #e5e2e1; margin-top: 0; margin-bottom: 8px; font-size: 16px;">Optimize with Credex</h3>
            <p style="color: #ab8980; margin: 0; font-size: 14px; line-height: 1.5;">
              Because you have significant savings opportunities, we recommend exploring Credex for discounted AI infrastructure credits (Cursor, Claude, OpenAI, etc).
            </p>
          </div>
          ` : ''}
          
          <hr style="border: 0; border-top: 1px solid #353535; margin: 32px 0;">
          
          <p style="color: #ab8980; font-size: 12px; margin: 0;">
            Built for Credex. If you didn't request this audit, you can ignore this email.
          </p>
        </div>
      </body>
    </html>
  `;
}

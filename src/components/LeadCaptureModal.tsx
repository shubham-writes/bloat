"use client";

import { useState, useRef } from "react";

interface Props {
  auditId: string;
  savingsTotal: number;
  onClose: () => void;
}

const ROLES = [
  { value: "founder", label: "Founder" },
  { value: "eng_manager", label: "Eng. Manager" },
  { value: "cto", label: "CTO / VP Eng" },
  { value: "developer", label: "Developer" },
  { value: "other", label: "Other" },
];

export function LeadCaptureModal({ auditId, savingsTotal, onClose }: Props) {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Honeypot field — bots fill this, humans don't
  const honeypotRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Honeypot check — if filled, silently ignore
    if (honeypotRef.current?.value) {
      setDone(true);
      return;
    }
    if (!email) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/capture-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company, role, auditId, savingsTotal }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong.");
      }

      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    /* Overlay */
    <div
      className="fixed inset-0 bg-black/80 z-50 backdrop-blur-sm flex items-center justify-center p-[16px]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="presentation"
    >
      {/* Modal Card */}
      <div
        className="bg-[#141210] border border-[#5b4039] rounded-[8px] w-full max-w-[440px] relative p-[48px] flex flex-col gap-[24px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] text-[#e4beb4] hover:text-[#e5e2e1] transition-colors p-[4px] flex items-center justify-center text-xl"
          aria-label="Close"
        >
          ✕
        </button>

        {done ? (
          /* Success state */
          <div className="flex flex-col items-center text-center gap-[16px] py-[16px]" aria-live="polite">
            <div className="w-12 h-12 rounded-full bg-[#f04f23]/10 border border-[#f04f23]/30 flex items-center justify-center text-2xl" aria-hidden="true">
              ✓
            </div>
            <h2 id="modal-title" className="text-h2 text-[#e5e2e1]">Report sent!</h2>
            <p className="text-body-sm text-[#e4beb4]">
              Check your inbox for the full breakdown.
              {savingsTotal > 500 && " A Credex team member will follow up about your savings opportunity."}
            </p>
            <button
              onClick={onClose}
              className="mt-[8px] bg-[#f04f23] text-white text-label-caps uppercase px-[24px] py-[8px] rounded-[6px] hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col gap-[4px] pr-[32px]">
            <h2 id="modal-title" className="text-h2 text-[#e5e2e1] tracking-tight">
                Save your Bloat report
              </h2>
              <p className="text-body-sm text-[#e4beb4]">
                We&apos;ll send you a detailed, actionable breakdown of your AI spend savings.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
              {/* Honeypot — hidden from humans */}
              <input
                ref={honeypotRef}
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="absolute -left-[9999px] opacity-0 pointer-events-none"
                aria-hidden="true"
              />

              {/* Email */}
              <div className="flex flex-col gap-[4px]">
                <label
                  className="text-label-caps text-[#e4beb4] uppercase"
                  htmlFor="modal-email"
                >
                  Email <span className="text-[#ffb5a0]">*</span>
                </label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="bg-[#0f0d0c] border border-[#5b4039] rounded-[6px] text-[#e5e2e1] text-body-base px-[16px] py-[8px] w-full h-11 focus:outline-none focus:border-[#f04f23] focus:ring-1 focus:ring-[#f04f23] transition-all placeholder:text-[#e4beb4]/40"
                />
              </div>

              {/* Company */}
              <div className="flex flex-col gap-[4px]">
                <label
                  className="text-label-caps text-[#e4beb4] uppercase"
                  htmlFor="modal-company"
                >
                  Company{" "}
                  <span className="text-[#e4beb4]/50 lowercase normal-case">(optional)</span>
                </label>
                <input
                  id="modal-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Corp"
                  className="bg-[#0f0d0c] border border-[#5b4039] rounded-[6px] text-[#e5e2e1] text-body-base px-[16px] py-[8px] w-full h-11 focus:outline-none focus:border-[#f04f23] focus:ring-1 focus:ring-[#f04f23] transition-all placeholder:text-[#e4beb4]/40"
                />
              </div>

              {/* Role */}
              <div className="flex flex-col gap-[4px]">
                <label
                  className="text-label-caps text-[#e4beb4] uppercase"
                  htmlFor="modal-role"
                >
                  Role
                </label>
                <div className="relative">
                  <select
                    id="modal-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="bg-[#0f0d0c] border border-[#5b4039] rounded-[6px] text-[#e5e2e1] text-body-base px-[16px] py-[8px] w-full h-11 appearance-none focus:outline-none focus:border-[#f04f23] focus:ring-1 focus:ring-[#f04f23] transition-all"
                  >
                    <option value="" disabled>
                      Select your role
                    </option>
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-[16px] pointer-events-none text-[#e4beb4]">
                    ▾
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-body-sm text-[#ffb4ab]" role="alert">{error}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || !email}
                className="bg-[#f04f23] text-white text-body-base font-semibold rounded-[6px] px-[16px] w-full h-11 flex items-center justify-center hover:bg-[#e64a19] transition-colors mt-[8px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Sending…" : "Email me the report"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

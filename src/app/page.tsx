import Link from "next/link";
import { SpendForm } from "@/components/SpendForm";

export default function HomePage() {
  return (
    <div className="bg-[#141210] text-[#e5e2e1] min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex justify-between items-center w-full px-[24px] py-[16px] sticky top-0 z-50 bg-[#141210] border-b border-[#5b4039]">
        <div className="text-h1 font-bold text-[#ffb5a0] tracking-tight">Bloat</div>
        <div className="flex items-center gap-[16px]">
          <span className="text-body-sm text-[#e4beb4] hidden sm:block">
            Free · No sign-up required
          </span>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-grow flex flex-col items-center w-full px-[16px] py-[48px]">
        <div className="w-full max-w-[640px] flex flex-col gap-[48px]">
          {/* Step indicator */}
          <div className="mx-auto inline-flex items-center gap-[8px] px-[16px] py-[8px] rounded-[6px] bg-[#1e1c1a] border border-[#20201f]">
            <span className="text-label-caps text-[#e5e2e1]">Your tools</span>
            <span className="text-[#e4beb4] text-xs">→</span>
            <span className="text-label-caps text-[#e4beb4]">Results</span>
          </div>

          {/* Hero copy */}
          <div className="text-center">
            <h1 className="text-[40px] font-bold leading-tight tracking-tight text-[#e5e2e1] mb-[8px]">
              Your AI bill<br />
              <span className="text-[#ffb5a0]">has bloat.</span>
            </h1>
            <p className="text-body-base text-[#e4beb4] max-w-[480px] mx-auto">
              Most startups overpay for AI tools by 30–60%. Add your tools below and get an instant audit.
            </p>
          </div>

          {/* Form */}
          <SpendForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col md:flex-row justify-between items-center w-full px-[24px] py-[48px] gap-[16px] border-t border-[#5b4039] bg-[#141210]">
        <div className="text-body-sm text-[#c6c6c7]">
          © 2025 Bloat. Built for{" "}
          <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer" className="hover:text-[#ffb5a0] transition-colors">
            Credex
          </a>
          .
        </div>
        <div className="flex gap-[24px] text-body-sm text-[#e4beb4]">
          <Link href="/privacy" className="hover:text-[#ffb5a0] transition-colors">Privacy</Link>
          <a href="https://github.com/shubham-writes/bloat" target="_blank" rel="noopener noreferrer" className="hover:text-[#ffb5a0] transition-colors">
            GitHub
          </a>
        </div>
      </footer>
    </div>
  );
}

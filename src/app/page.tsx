import { SpendForm } from "@/components/SpendForm";
import { Zap } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-900/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16">
        {/* Nav */}
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-900/40">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Bloat</span>
          </div>
          <span className="text-xs text-gray-500 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            Free · No sign-up required
          </span>
        </nav>

        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 mb-6 font-medium">
            <Zap className="w-3 h-3" />
            Free AI spend audit · Results in 60 seconds
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05] mb-4">
            Your AI bill
            <br />
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              has bloat.
            </span>
          </h1>

          <p className="text-lg text-gray-400 max-w-lg mx-auto leading-relaxed">
            Most startups overpay for AI tools by 30–60% without knowing it.
            Find out where your money is going — and what to do about it.
          </p>
        </div>

        {/* Social proof strip */}
        <div className="flex items-center justify-center gap-6 mb-12 flex-wrap">
          {[
            "Cursor",
            "GitHub Copilot",
            "Claude",
            "ChatGPT",
            "Gemini",
            "+4 more",
          ].map((tool) => (
            <span key={tool} className="text-xs text-gray-500 font-medium">
              {tool}
            </span>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50">
          <SpendForm />
        </div>

        {/* Trust footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-600">
            No account required. We never share your data.
            Email captured only if you choose to save your report.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            Built for{" "}
            <a
              href="https://credex.rocks"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-400 transition-colors"
            >
              Credex
            </a>{" "}
            ·{" "}
            <a
              href="https://github.com/shubham-writes/bloat"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-400 transition-colors"
            >
              Open source
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}

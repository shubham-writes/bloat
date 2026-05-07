import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bloat — Find Your AI Tool Overspend",
  description:
    "Free AI spend audit for startups and engineering teams. Find out where you're overpaying on Cursor, GitHub Copilot, Claude, ChatGPT and more — in 60 seconds.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://bloat.vercel.app"),
  openGraph: {
    title: "Bloat — Free AI Spend Audit",
    description: "Are you overpaying for AI tools? Find out in 60 seconds.",
    type: "website",
    siteName: "Bloat",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bloat — Free AI Spend Audit",
    description: "Are you overpaying for AI tools? Find out in 60 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-gray-950 text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}

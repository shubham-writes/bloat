// All AI tool plans and pricing data
// Prices verified from official vendor pricing pages — see PRICING_DATA.md for citations

export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";

export interface Plan {
  id: string;
  label: string;
  pricePerSeat: number; // USD/month
  minSeats?: number;
  maxSeats?: number;
  notes?: string;
}

export interface Tool {
  id: string;
  name: string;
  vendor: string;
  category: "ide" | "chat" | "api";
  plans: Plan[];
  primaryUseCase: UseCase[];
  logoColor: string; // Tailwind color class
}

export const TOOLS: Tool[] = [
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Anysphere",
    category: "ide",
    primaryUseCase: ["coding"],
    logoColor: "from-violet-500 to-purple-600",
    plans: [
      { id: "hobby", label: "Hobby", pricePerSeat: 0, notes: "Free, limited" },
      { id: "pro", label: "Pro", pricePerSeat: 20 },
      { id: "business", label: "Business", pricePerSeat: 40, minSeats: 1 },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 60, notes: "Estimated, contact sales" },
    ],
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub",
    category: "ide",
    primaryUseCase: ["coding"],
    logoColor: "from-gray-700 to-gray-900",
    plans: [
      { id: "individual", label: "Individual", pricePerSeat: 10 },
      { id: "business", label: "Business", pricePerSeat: 19, minSeats: 1 },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 39, minSeats: 1 },
    ],
  },
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    category: "chat",
    primaryUseCase: ["writing", "research", "coding", "mixed"],
    logoColor: "from-orange-400 to-amber-500",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0, notes: "Limited" },
      { id: "pro", label: "Pro", pricePerSeat: 20 },
      { id: "max", label: "Max", pricePerSeat: 100 },
      { id: "team", label: "Team", pricePerSeat: 30, minSeats: 2 },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 0, notes: "Custom pricing" },
      { id: "api", label: "API Direct", pricePerSeat: 0, notes: "Usage-based" },
    ],
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    category: "chat",
    primaryUseCase: ["writing", "research", "mixed", "coding"],
    logoColor: "from-emerald-400 to-teal-500",
    plans: [
      { id: "plus", label: "Plus", pricePerSeat: 20 },
      { id: "team", label: "Team", pricePerSeat: 30, minSeats: 2 },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 0, notes: "Custom pricing" },
      { id: "api", label: "API Direct", pricePerSeat: 0, notes: "Usage-based" },
    ],
  },
  {
    id: "anthropic-api",
    name: "Anthropic API",
    vendor: "Anthropic",
    category: "api",
    primaryUseCase: ["coding", "data", "mixed"],
    logoColor: "from-orange-500 to-red-500",
    plans: [
      { id: "api", label: "Pay-as-you-go", pricePerSeat: 0, notes: "Usage-based" },
    ],
  },
  {
    id: "openai-api",
    name: "OpenAI API",
    vendor: "OpenAI",
    category: "api",
    primaryUseCase: ["coding", "data", "mixed"],
    logoColor: "from-teal-400 to-cyan-500",
    plans: [
      { id: "api", label: "Pay-as-you-go", pricePerSeat: 0, notes: "Usage-based" },
    ],
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    category: "chat",
    primaryUseCase: ["research", "writing", "mixed"],
    logoColor: "from-blue-400 to-indigo-500",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0 },
      { id: "advanced", label: "Advanced (Pro)", pricePerSeat: 20 },
      { id: "business", label: "Business / Ultra", pricePerSeat: 30, minSeats: 1 },
      { id: "api", label: "API Direct", pricePerSeat: 0, notes: "Usage-based" },
    ],
  },
  {
    id: "windsurf",
    name: "Windsurf",
    vendor: "Codeium",
    category: "ide",
    primaryUseCase: ["coding"],
    logoColor: "from-sky-400 to-blue-500",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0 },
      { id: "pro", label: "Pro", pricePerSeat: 15 },
      { id: "teams", label: "Teams", pricePerSeat: 30, minSeats: 2 },
    ],
  },
  {
    id: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity AI",
    category: "chat",
    primaryUseCase: ["research", "writing"],
    logoColor: "from-cyan-400 to-teal-500",
    plans: [
      { id: "free", label: "Free", pricePerSeat: 0 },
      { id: "pro", label: "Pro", pricePerSeat: 20 },
      { id: "enterprise", label: "Enterprise", pricePerSeat: 40, minSeats: 5 },
    ],
  },
];

export const USE_CASES: { value: UseCase; label: string; description: string }[] = [
  { value: "coding", label: "Coding", description: "Writing, reviewing, or debugging code" },
  { value: "writing", label: "Writing", description: "Drafting content, emails, docs" },
  { value: "data", label: "Data & Analysis", description: "Data processing, analytics, insights" },
  { value: "research", label: "Research", description: "Information gathering, summarization" },
  { value: "mixed", label: "Mixed", description: "All of the above" },
];

export type TeamSize = "solo" | "2-5" | "6-15" | "16-50" | "50+";
export const TEAM_SIZES: { value: TeamSize; label: string }[] = [
  { value: "solo", label: "Solo (just me)" },
  { value: "2-5", label: "2–5 people" },
  { value: "6-15", label: "6–15 people" },
  { value: "16-50", label: "16–50 people" },
  { value: "50+", label: "50+ people" },
];

export function teamSizeToNumber(size: TeamSize): number {
  const map: Record<TeamSize, number> = {
    solo: 1,
    "2-5": 3,
    "6-15": 10,
    "16-50": 30,
    "50+": 75,
  };
  return map[size];
}

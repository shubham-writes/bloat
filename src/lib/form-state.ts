// Types for the form state that persists across page reloads

import { UseCase, TeamSize } from "./tools-data";

export interface ToolEntry {
  toolId: string;
  planId: string;
  monthlySpend: number; // USD/month actual spend (manual override)
  seats: number;
  enabled: boolean;
}

export interface FormState {
  tools: ToolEntry[];
  teamSize: TeamSize;
  useCase: UseCase;
  version: number; // for future migrations
}

export const FORM_STORAGE_KEY = "bloat_form_state_v1";

export function getDefaultFormState(): FormState {
  return {
    tools: [],
    teamSize: "2-5",
    useCase: "mixed",
    version: 1,
  };
}

export function loadFormState(): FormState {
  if (typeof window === "undefined") return getDefaultFormState();
  try {
    const raw = localStorage.getItem(FORM_STORAGE_KEY);
    if (!raw) return getDefaultFormState();
    const parsed = JSON.parse(raw) as FormState;
    // Basic validation
    if (!parsed.tools || !parsed.teamSize || !parsed.useCase) return getDefaultFormState();
    return parsed;
  } catch {
    return getDefaultFormState();
  }
}

export function saveFormState(state: FormState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage might be full or blocked — fail silently
  }
}

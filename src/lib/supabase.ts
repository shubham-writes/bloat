import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazy client creation — avoids crashing at build time when env vars aren't set
function makeClient(key: string): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return createClient(url, key);
}

// Service role client — only call server-side (API routes)
export function getServiceClient(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return makeClient(serviceKey ?? anonKey);
}

// Public anon client — safe for client-side use
export function getPublicClient(): SupabaseClient {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return makeClient(anonKey);
}

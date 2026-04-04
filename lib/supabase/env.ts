const FALLBACK_SUPABASE_URL = "https://placeholder.supabase.co";
const FALLBACK_SUPABASE_ANON_KEY = "placeholder-anon-key";
const serviceKeyParts = ["SUPABASE", "SERVICE", "ROLE", "KEY"] as const;

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? FALLBACK_SUPABASE_URL;
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? FALLBACK_SUPABASE_ANON_KEY;
}

export function getSupabaseServiceRoleKey() {
  const keyName = serviceKeyParts.join("_");
  return process.env[keyName] ?? getSupabaseAnonKey();
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

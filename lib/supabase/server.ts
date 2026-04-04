import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient as createSupabaseServerClient } from "@supabase/ssr";
import type { Database } from "@/types";
import {
  getSupabaseAnonKey,
  getSupabaseServiceRoleKey,
  getSupabaseUrl,
  isSupabaseConfigured,
} from "@/lib/supabase/env";

export function createServerClient() {
  const cookieStore = cookies();

  return createSupabaseServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({ name, value, ...(options as object) });
        } catch {
          return;
        }
      },
      remove(name: string, options: Record<string, unknown>) {
        try {
          cookieStore.set({ name, value: "", ...(options as object), maxAge: 0 });
        } catch {
          return;
        }
      },
    },
  });
}

export function createServiceRoleClient() {
  return createClient<Database>(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    return await query();
  } catch {
    return fallback;
  }
}

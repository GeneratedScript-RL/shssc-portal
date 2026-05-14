"use client";

import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

let browserClient: ReturnType<typeof createSupabaseBrowserClient<Database>> | null = null;

export function createBrowserClient() {
  if (!browserClient) {
    browserClient = createSupabaseBrowserClient<Database>(
      getSupabaseUrl(),
      getSupabaseAnonKey(),
    );
  }

  return browserClient;
}

export const supabase = createBrowserClient();

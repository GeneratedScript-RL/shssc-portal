import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export function createMiddlewareClient(request: NextRequest, response: NextResponse) {
  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options) {
        request.cookies.set({ name, value: "", ...options, maxAge: 0 });
        response.cookies.set({ name, value: "", ...options, maxAge: 0 });
      },
    },
  });
}

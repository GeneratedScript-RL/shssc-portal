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
      set(name: string, value: string, options: Record<string, unknown>) {
        request.cookies.set(name, value);
        response.cookies.set({ name, value, ...(options as object) });
      },
      remove(name: string, options: Record<string, unknown>) {
        request.cookies.delete(name);
        response.cookies.set({ name, value: "", ...(options as object), maxAge: 0 });
      },
    },
  });
}

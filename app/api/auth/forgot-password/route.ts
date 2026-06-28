import { NextResponse } from "next/server";
import { z } from "zod";
import { createServerClient } from "@/lib/supabase/server";
import { jsonError } from "@/app/api/_helpers";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith("@gendejesus.edu.ph"), "Use your school email address."),
});

export async function POST(request: Request) {
  const payload = forgotPasswordSchema.parse(await request.json());
  const url = new URL(request.url);
  const supabase = createServerClient();

  const { error } = await supabase.auth.resetPasswordForEmail(payload.email, {
    redirectTo: `${url.origin}/api/auth/callback?next=/auth/reset-password`,
  });

  if (error) {
    return jsonError(error.message, 400);
  }

  return NextResponse.json({ ok: true });
}

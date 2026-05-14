import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/supabase/env";

const resendSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  const payload = resendSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  const { data: authUsers } = await supabase.auth.admin.listUsers();
  const existingAuthUser = authUsers?.users.find((u) => u.email === payload.email);

  if (!existingAuthUser) {
    return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
  }

  if (existingAuthUser.email_confirmed_at) {
    return NextResponse.json({ error: "Email already confirmed. Please login instead." }, { status: 400 });
  }

  const { error: resendError } = await supabase.auth.resend({
    type: "signup",
    email: payload.email,
    options: { emailRedirectTo: `${getSiteUrl()}/api/auth/callback` },
  });

  if (resendError) {
    return NextResponse.json({ error: resendError.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
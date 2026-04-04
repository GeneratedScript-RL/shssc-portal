import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getSiteUrl } from "@/lib/supabase/env";

const registerSchema = z.object({
  email: z
    .string()
    .email()
    .refine((email) => email.endsWith("@gendejesus.edu.ph")),
  password: z.string().min(8),
  full_name: z.string().min(2),
  privacy_consent: z.literal(true),
});

export async function POST(request: Request) {
  const payload = registerSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  const [{ data: existingUser }, { data: studentLevel }] = await Promise.all([
    supabase.from("users").select("id").eq("email", payload.email).maybeSingle(),
    supabase.from("access_levels").select("id").eq("name", "Student").maybeSingle(),
  ]);

  if (existingUser) {
    return NextResponse.json({ error: "Email already registered." }, { status: 400 });
  }

  const { data: authUser, error: createError } = await supabase.auth.admin.createUser({
    email: payload.email,
    password: payload.password,
    email_confirm: false,
  });

  if (createError || !authUser.user) {
    return NextResponse.json({ error: createError?.message ?? "Unable to create user." }, { status: 400 });
  }

  const { error: insertError } = await supabase.from("users").insert({
    auth_id: authUser.user.id,
    email: payload.email,
    full_name: payload.full_name,
    access_level_id: studentLevel?.id ?? null,
    privacy_consent: payload.privacy_consent,
  });

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 400 });
  }

  await supabase.auth.resend({
    type: "signup",
    email: payload.email,
    options: { emailRedirectTo: `${getSiteUrl()}/api/auth/callback` },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}

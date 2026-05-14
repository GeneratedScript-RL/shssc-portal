import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { requireApiUser, jsonError } from "@/app/api/_helpers";
import { getUsersWithAccessLevels } from "@/lib/supabase/queries";
import { getSiteUrl } from "@/lib/supabase/env";

const createUserSchema = z.object({
  email: z.string().email().refine((email) => email.endsWith("@gendejesus.edu.ph")),
  full_name: z.string().min(2),
  access_level_id: z.string().uuid(),
  student_id: z.string().min(2).optional(),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  const supabase = createServiceRoleClient();

  if (email) {
    const { data } = await supabase.from("users").select("id").eq("email", email).maybeSingle();
    return NextResponse.json({ exists: !!data });
  }

  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const users = await getUsersWithAccessLevels();
  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const { error, context } = await requireApiUser();
  if (error || !context?.isSysadmin) {
    return error ?? jsonError("Forbidden", 403);
  }

  const payload = createUserSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  const [{ data: existingEmail }, { data: existingStudent }] = await Promise.all([
    supabase.from("users").select("id").eq("email", payload.email).maybeSingle(),
    payload.student_id
      ? supabase.from("users").select("id").eq("student_id", payload.student_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (existingEmail) {
    return jsonError("Email already registered.", 400);
  }

  if (existingStudent) {
    return jsonError("Student ID already registered.", 400);
  }

  const { data: invitedUser, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
    payload.email,
    { redirectTo: `${getSiteUrl()}/api/auth/callback` },
  );

  if (inviteError || !invitedUser.user) {
    return jsonError(inviteError?.message ?? "Unable to invite user.", 400);
  }

  const { error: insertError } = await supabase.from("users").insert({
    auth_id: invitedUser.user.id,
    email: payload.email,
    full_name: payload.full_name,
    access_level_id: payload.access_level_id,
    student_id: payload.student_id ?? null,
    created_by: context.user.id,
    privacy_consent: true,
  });

  if (insertError) {
    return jsonError(insertError.message, 400);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

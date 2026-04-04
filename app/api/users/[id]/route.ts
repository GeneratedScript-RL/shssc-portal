import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { getUserProfile } from "@/lib/supabase/queries";

const updateUserSchema = z.object({
  access_level_id: z.string().uuid(),
  rank_ids: z.array(z.string().uuid()).default([]),
  award_ids: z.array(z.string().uuid()).default([]),
  is_active: z.boolean(),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const user = await getUserProfile(params.id);
  return NextResponse.json({ user });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const payload = updateUserSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  const { error: userError } = await supabase
    .from("users")
    .update({
      access_level_id: payload.access_level_id,
      is_active: payload.is_active,
    })
    .eq("id", params.id);

  if (userError) {
    return jsonError(userError.message, 400);
  }

  await Promise.all([
    supabase.from("user_ranks").delete().eq("user_id", params.id),
    supabase.from("user_awards").delete().eq("user_id", params.id),
  ]);

  if (payload.rank_ids.length) {
    await supabase.from("user_ranks").insert(
      payload.rank_ids.map((rankId) => ({
        user_id: params.id,
        rank_id: rankId,
      })),
    );
  }

  if (payload.award_ids.length) {
    await supabase.from("user_awards").insert(
      payload.award_ids.map((awardId) => ({
        user_id: params.id,
        award_id: awardId,
      })),
    );
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const updateRosterEntrySchema = z.object({
  user_id: z.string().uuid(),
  position_title: z.string().min(2),
  rank_id: z.string().uuid().optional().or(z.literal("")),
  committee_id: z.string().uuid().optional().or(z.literal("")),
  photo_url: z.string().url().optional().or(z.literal("")),
  order_index: z.number().int().min(0).default(0),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { error } = await requireApiUser(PERMISSIONS.MANAGE_ROSTER);
  if (error) {
    return error;
  }

  const payload = updateRosterEntrySchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: entry, error: updateError } = await supabase
    .from("officer_roster_entries")
    .update({
      user_id: payload.user_id,
      position_title: payload.position_title,
      rank_id: payload.rank_id || null,
      committee_id: payload.committee_id || null,
      photo_url: payload.photo_url || null,
      order_index: payload.order_index,
    })
    .eq("id", params.id)
    .select("*, ranks(id, name, color_hex), users(id, full_name, avatar_url)")
    .single();

  if (updateError) {
    return jsonError(updateError.message, 400);
  }

  return NextResponse.json({
    entry: {
      ...entry,
      rank: Array.isArray((entry as any).ranks) ? (entry as any).ranks[0] : (entry as any).ranks,
      user: Array.isArray((entry as any).users) ? (entry as any).users[0] : (entry as any).users,
      awards: [],
    },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const { error } = await requireApiUser(PERMISSIONS.MANAGE_ROSTER);
  if (error) {
    return error;
  }

  const supabase = createServiceRoleClient();
  const { error: deleteError } = await supabase
    .from("officer_roster_entries")
    .delete()
    .eq("id", params.id);

  if (deleteError) {
    return jsonError(deleteError.message, 400);
  }

  return NextResponse.json({ ok: true });
}

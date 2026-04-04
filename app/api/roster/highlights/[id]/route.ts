import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const updateLegacyHighlightSchema = z.object({
  roster_id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().min(8),
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

  const payload = updateLegacyHighlightSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: highlight, error: updateError } = await supabase
    .from("legacy_wall_entries")
    .update({
      roster_id: payload.roster_id,
      title: payload.title,
      description: payload.description,
      order_index: payload.order_index,
    })
    .eq("id", params.id)
    .select("*")
    .single();

  if (updateError) {
    return jsonError(updateError.message, 400);
  }

  return NextResponse.json({ highlight });
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
    .from("legacy_wall_entries")
    .delete()
    .eq("id", params.id);

  if (deleteError) {
    return jsonError(deleteError.message, 400);
  }

  return NextResponse.json({ ok: true });
}

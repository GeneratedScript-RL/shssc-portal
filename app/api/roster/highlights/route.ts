import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const legacyHighlightSchema = z.object({
  roster_id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().min(8),
  order_index: z.number().int().min(0).default(0),
});

export async function POST(request: Request) {
  const { error, context } = await requireApiUser(PERMISSIONS.MANAGE_ROSTER);
  if (error || !context) {
    return error;
  }

  const payload = legacyHighlightSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: highlight, error: createError } = await supabase
    .from("legacy_wall_entries")
    .insert({
      roster_id: payload.roster_id,
      title: payload.title,
      description: payload.description,
      order_index: payload.order_index,
      created_by: context.user.id,
    })
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ highlight }, { status: 201 });
}

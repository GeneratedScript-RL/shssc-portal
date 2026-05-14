import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const updateRosterYearSchema = z.object({
  school_year: z.string().min(4),
  is_active: z.boolean().default(false),
  achievements: z.array(z.string().min(1)).default([]),
  milestones: z.array(z.string().min(1)).default([]),
  impact_summary: z.string().optional().or(z.literal("")),
  president_quote: z.string().optional().or(z.literal("")),
});

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { error } = await requireApiUser(PERMISSIONS.MANAGE_ROSTER);
  if (error) {
    return error;
  }

  const payload = updateRosterYearSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  if (payload.is_active) {
    await supabase.from("officer_rosters").update({ is_active: false }).neq("id", params.id);
  }

  const { data: roster, error: updateError } = await supabase
    .from("officer_rosters")
    .update({
      school_year: payload.school_year,
      is_active: payload.is_active,
      achievements: payload.achievements,
      milestones: payload.milestones,
      impact_summary: payload.impact_summary || null,
      president_quote: payload.president_quote || null,
    })
    .eq("id", params.id)
    .select("*")
    .single();

  if (updateError) {
    return jsonError(updateError.message, 400);
  }

  return NextResponse.json({ roster });
}

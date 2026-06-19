import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const rosterYearSchema = z.object({
  school_year: z.string().min(4),
  is_active: z.boolean().default(false),
  order_index: z.number().int().min(0).optional(),
  achievements: z.array(z.string().min(1)).default([]),
  milestones: z.array(z.string().min(1)).default([]),
  impact_summary: z.string().optional().or(z.literal("")),
  president_quote: z.string().optional().or(z.literal("")),
});

const reorderRosterYearsSchema = z.object({
  rosters: z
    .array(
      z.object({
        id: z.string().uuid(),
        order_index: z.number().int().min(0),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  const { error } = await requireApiUser(PERMISSIONS.MANAGE_ROSTER);
  if (error) {
    return error;
  }

  const payload = rosterYearSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  if (payload.is_active) {
    await supabase.from("officer_rosters").update({ is_active: false }).not("id", "is", null);
  }

  const { data: roster, error: createError } = await supabase
    .from("officer_rosters")
    .insert({
      school_year: payload.school_year,
      is_active: payload.is_active,
      order_index: payload.order_index ?? 0,
      achievements: payload.achievements,
      milestones: payload.milestones,
      impact_summary: payload.impact_summary || null,
      president_quote: payload.president_quote || null,
    })
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ roster }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { error } = await requireApiUser(PERMISSIONS.MANAGE_ROSTER);
  if (error) {
    return error;
  }

  const payload = reorderRosterYearsSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  const results = await Promise.all(
    payload.rosters.map((roster) =>
      supabase
        .from("officer_rosters")
        .update({ order_index: roster.order_index })
        .eq("id", roster.id),
    ),
  );

  const reorderError = results.find((result) => result.error)?.error;
  if (reorderError) {
    return jsonError(reorderError.message, 400);
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";

const rosterEntrySchema = z.object({
  roster_id: z.string().uuid(),
  user_id: z.string().uuid(),
  position_title: z.string().min(2),
  rank_id: z.string().uuid().optional().or(z.literal("")),
  committee_id: z.string().uuid().optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const payload = rosterEntrySchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: entry, error: createError } = await supabase
    .from("officer_roster_entries")
    .insert({
      roster_id: payload.roster_id,
      user_id: payload.user_id,
      position_title: payload.position_title,
      rank_id: payload.rank_id || null,
      committee_id: payload.committee_id || null,
    })
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ entry }, { status: 201 });
}

import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCommittees } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";

const committeeSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

export async function GET() {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const committees = await getCommittees();
  return NextResponse.json({ committees });
}

export async function POST(request: Request) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const payload = committeeSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: committee, error: createError } = await supabase
    .from("committees")
    .insert(payload)
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ committee }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const idResult = z.string().uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!idResult.success) {
    return jsonError("Invalid committee id.", 400);
  }

  const supabase = createServiceRoleClient();
  const { error: detachError } = await supabase
    .from("officer_roster_entries")
    .update({ committee_id: null })
    .eq("committee_id", idResult.data);

  if (detachError) {
    return jsonError(detachError.message, 400);
  }

  const { data: deletedCommittee, error: deleteError } = await supabase
    .from("committees")
    .delete()
    .eq("id", idResult.data)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    return jsonError(deleteError.message, 400);
  }

  if (!deletedCommittee) {
    return jsonError("Committee not found.", 404);
  }

  return NextResponse.json({ ok: true });
}

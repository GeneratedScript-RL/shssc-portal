import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getRanks } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";

const rankSchema = z.object({
  name: z.string().min(2),
  color_hex: z.string().regex(/^#([A-Fa-f0-9]{6})$/),
  hierarchy_order: z.number().int().min(0),
});

export async function GET() {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const ranks = await getRanks();
  return NextResponse.json({ ranks });
}

export async function POST(request: Request) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const payload = rankSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: rank, error: createError } = await supabase
    .from("ranks")
    .insert(payload)
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ rank }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const idResult = z.string().uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!idResult.success) {
    return jsonError("Invalid rank id.", 400);
  }

  const supabase = createServiceRoleClient();
  const { error: detachError } = await supabase
    .from("officer_roster_entries")
    .update({ rank_id: null })
    .eq("rank_id", idResult.data);

  if (detachError) {
    return jsonError(detachError.message, 400);
  }

  const { data: deletedRank, error: deleteError } = await supabase
    .from("ranks")
    .delete()
    .eq("id", idResult.data)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    return jsonError(deleteError.message, 400);
  }

  if (!deletedRank) {
    return jsonError("Rank not found.", 404);
  }

  return NextResponse.json({ ok: true });
}

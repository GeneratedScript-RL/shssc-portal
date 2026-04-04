import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getAwards } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";

const awardSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  emblem_url: z.string().optional(),
});

export async function GET() {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const awards = await getAwards();
  return NextResponse.json({ awards });
}

export async function POST(request: Request) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const payload = awardSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: award, error: createError } = await supabase
    .from("awards")
    .insert(payload)
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ award }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const idResult = z.string().uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!idResult.success) {
    return jsonError("Invalid award id.", 400);
  }

  const supabase = createServiceRoleClient();
  const { data: deletedAward, error: deleteError } = await supabase
    .from("awards")
    .delete()
    .eq("id", idResult.data)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    return jsonError(deleteError.message, 400);
  }

  if (!deletedAward) {
    return jsonError("Award not found.", 404);
  }

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUserContext } from "@/lib/auth/getCurrentUserContext";
import { jsonError } from "@/app/api/_helpers";

export async function POST(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const context = await getCurrentUserContext();

  if (!context.user) {
    return jsonError("Unauthorized", 401);
  }

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("suggestion_upvotes").insert({
    submission_id: params.id,
    user_id: context.user.id,
  });

  if (error) {
    return jsonError(error.message, 400);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

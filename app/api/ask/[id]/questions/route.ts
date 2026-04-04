import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUserContext } from "@/lib/auth/getCurrentUserContext";
import { getQaQuestions } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const questionSchema = z.object({
  body: z.string().min(8),
  is_anonymous: z.boolean().default(false),
});

const questionUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["queued", "answered", "skipped"]),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const questions = await getQaQuestions(params.id);
  return NextResponse.json({ questions });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const context = await getCurrentUserContext();
  if (!context.user) {
    return jsonError("Unauthorized", 401);
  }

  const payload = questionSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: question, error } = await supabase
    .from("qa_questions")
    .insert({
      session_id: params.id,
      body: payload.body,
      submitter_id: context.user.id,
      is_anonymous: payload.is_anonymous,
    })
    .select("*")
    .single();

  if (error) {
    return jsonError(error.message, 400);
  }

  return NextResponse.json({ question }, { status: 201 });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  const { error } = await requireApiUser(PERMISSIONS.LIVE_QA_RESPOND);
  if (error) {
    return error;
  }

  const payload = questionUpdateSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { error: updateError } = await supabase
    .from("qa_questions")
    .update({
      status: payload.status,
      answered_at: payload.status === "answered" ? new Date().toISOString() : null,
    })
    .eq("id", payload.id)
    .eq("session_id", params.id);

  if (updateError) {
    return jsonError(updateError.message, 400);
  }

  return NextResponse.json({ ok: true });
}

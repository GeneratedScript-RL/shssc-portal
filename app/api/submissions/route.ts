import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { getSubmissions } from "@/lib/supabase/queries";

const submissionSchema = z.object({
  submission_type: z.enum(["concern", "suggestion", "complaint", "feedback"]),
  subject: z.string().min(4),
  body: z.string().min(16),
  is_anonymous: z.boolean().default(false),
  is_public: z.boolean().default(false),
});

const submissionUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["pending", "reviewing", "resolved", "dismissed"]),
});

export async function GET() {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const submissions = await getSubmissions();
  return NextResponse.json({ submissions });
}

export async function POST(request: Request) {
  const { error, context } = await requireApiUser();
  if (error || !context) {
    return error;
  }

  const payload = submissionSchema.parse(await request.json());
  const isPublicSuggestion =
    payload.submission_type === "suggestion" ? payload.is_public : false;
  const supabase = createServiceRoleClient();
  const { data: submission, error: createError } = await supabase
    .from("submissions")
    .insert({
      ...payload,
      is_public: isPublicSuggestion,
      submitter_id: context.user.id,
    })
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ submission }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { error } = await requireApiUser();
  if (error) {
    return error;
  }

  const payload = submissionUpdateSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { error: updateError } = await supabase
    .from("submissions")
    .update({
      status: payload.status,
      resolved_at: payload.status === "resolved" ? new Date().toISOString() : null,
    })
    .eq("id", payload.id);

  if (updateError) {
    return jsonError(updateError.message, 400);
  }

  return NextResponse.json({ ok: true });
}

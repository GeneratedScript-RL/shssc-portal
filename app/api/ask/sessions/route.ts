import { NextResponse } from "next/server";
import { z } from "zod";
import type { JSONContent } from "@tiptap/react";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getActiveQASession, getQaQuestions } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { slugify } from "@/lib/utils/slugify";

const sessionSchema = z.object({
  title: z.string().min(4),
  event_id: z.string().uuid().optional(),
});

const sessionToggleSchema = z.object({
  id: z.string().uuid(),
  is_open: z.boolean(),
});

function buildTranscriptContent(questions: Awaited<ReturnType<typeof getQaQuestions>>): JSONContent {
  return {
    type: "doc",
    content: questions.map((question) => ({
      type: "paragraph",
      content: [
        {
          type: "text",
          text: `${question.status.toUpperCase()}: ${question.body}`,
        },
      ],
    })),
  };
}

export async function GET() {
  const session = await getActiveQASession();
  return NextResponse.json({ session });
}

export async function POST(request: Request) {
  const { error, context } = await requireApiUser(PERMISSIONS.LIVE_QA_RESPOND);
  if (error || !context) {
    return error;
  }

  const payload = sessionSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: session, error: createError } = await supabase
    .from("qa_sessions")
    .insert({
      title: payload.title,
      event_id: payload.event_id ?? null,
      created_by: context.user.id,
      is_open: false,
    })
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ session }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { error, context } = await requireApiUser(PERMISSIONS.LIVE_QA_RESPOND);
  if (error || !context) {
    return error;
  }

  const payload = sessionToggleSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  if (payload.is_open) {
    await supabase
      .from("qa_sessions")
      .update({ is_open: true, opened_at: new Date().toISOString() })
      .eq("id", payload.id);

    return NextResponse.json({ ok: true });
  }

  const answeredQuestions = (await getQaQuestions(payload.id)).filter(
    (question) => question.status === "answered",
  );

  const { data: post } = await supabase
    .from("posts")
    .insert({
      title: `Q&A Transcript ${new Date().toLocaleDateString()}`,
      slug: slugify(`qa-transcript-${payload.id}`),
      body: buildTranscriptContent(answeredQuestions),
      post_type: "minutes",
      status: "published",
      author_id: context.user.id,
      published_at: new Date().toISOString(),
    })
    .select("*")
    .single();

  await supabase
    .from("qa_sessions")
    .update({
      is_open: false,
      closed_at: new Date().toISOString(),
      transcript_post_id: post?.id ?? null,
    })
    .eq("id", payload.id);

  return NextResponse.json({ ok: true });
}

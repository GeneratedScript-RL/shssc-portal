import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getForumChannels } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const channelSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
});

export async function GET() {
  const channels = await getForumChannels();
  return NextResponse.json({ channels });
}

export async function POST(request: Request) {
  const { error } = await requireApiUser(PERMISSIONS.MODERATE_FORUMS);
  if (error) {
    return error;
  }

  const payload = channelSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: channel, error: createError } = await supabase
    .from("forum_channels")
    .insert(payload)
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ channel }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { error } = await requireApiUser(PERMISSIONS.MODERATE_FORUMS);
  if (error) {
    return error;
  }

  const idResult = z.string().uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!idResult.success) {
    return jsonError("Invalid channel id.", 400);
  }

  const supabase = createServiceRoleClient();
  const { data: threadRows, error: threadLookupError } = await supabase
    .from("forum_threads")
    .select("id")
    .eq("channel_id", idResult.data);

  if (threadLookupError) {
    return jsonError(threadLookupError.message, 400);
  }

  const threadIds = (threadRows ?? []).map((thread) => thread.id);
  const { data: replyRows, error: replyLookupError } = threadIds.length
    ? await supabase.from("forum_replies").select("id").in("thread_id", threadIds)
    : { data: [] as Array<{ id: string }>, error: null };

  if (replyLookupError) {
    return jsonError(replyLookupError.message, 400);
  }

  const replyIds = (replyRows ?? []).map((reply) => reply.id);

  const cleanupResults = await Promise.all([
    threadIds.length
      ? supabase.from("forum_reactions").delete().eq("target_type", "thread").in("target_id", threadIds)
      : Promise.resolve({ error: null }),
    threadIds.length
      ? supabase.from("forum_reports").delete().eq("target_type", "thread").in("target_id", threadIds)
      : Promise.resolve({ error: null }),
    replyIds.length
      ? supabase.from("forum_reactions").delete().eq("target_type", "reply").in("target_id", replyIds)
      : Promise.resolve({ error: null }),
    replyIds.length
      ? supabase.from("forum_reports").delete().eq("target_type", "reply").in("target_id", replyIds)
      : Promise.resolve({ error: null }),
  ]);

  const cleanupError = cleanupResults.find((result) => result.error)?.error;
  if (cleanupError) {
    return jsonError(cleanupError.message, 400);
  }

  const { data: deletedChannel, error: deleteError } = await supabase
    .from("forum_channels")
    .delete()
    .eq("id", idResult.data)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    return jsonError(deleteError.message, 400);
  }

  if (!deletedChannel) {
    return jsonError("Channel not found.", 404);
  }

  return NextResponse.json({ ok: true });
}

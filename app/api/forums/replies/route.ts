import { NextResponse } from "next/server";
import { z } from "zod";
import type { JSONContent } from "@tiptap/react";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUserContext } from "@/lib/auth/getCurrentUserContext";
import { getForumChannelAccess } from "@/lib/auth/forumAccess";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const replySchema = z.object({
  thread_id: z.string().uuid(),
  body: z.custom<JSONContent>(),
});

const replyActionSchema = z.object({
  action: z.enum(["delete", "react"]),
  target_type: z.literal("reply"),
  target_id: z.string().uuid(),
  emoji: z.string().optional(),
});

export async function POST(request: Request) {
  const context = await getCurrentUserContext();
  if (!context.user) {
    return jsonError("Unauthorized", 401);
  }

  const payload = replySchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: thread } = await supabase
    .from("forum_threads")
    .select("id, channel_id, is_locked")
    .eq("id", payload.thread_id)
    .maybeSingle();

  if (!thread) {
    return jsonError("Thread not found.", 404);
  }

  const { data: channel } = await supabase
    .from("forum_channels")
    .select("id, is_locked, min_post_level_id, min_view_level_id")
    .eq("id", thread.channel_id)
    .maybeSingle();

  if (!channel) {
    return jsonError("Channel not found.", 404);
  }

  const access = await getForumChannelAccess(channel, context);
  if (thread.is_locked) {
    return jsonError("This thread is currently locked.", 409);
  }

  if (channel.is_locked) {
    return jsonError("This channel is currently locked.", 409);
  }

  if (!access.canPost) {
    return jsonError("You do not have permission to reply in this channel.", 403);
  }

  const { data: reply, error } = await supabase
    .from("forum_replies")
    .insert({
      thread_id: payload.thread_id,
      body: payload.body,
      author_id: context.user.id,
    })
    .select("*")
    .single();

  if (error) {
    return jsonError(error.message, 400);
  }

  const { count } = await supabase
    .from("forum_replies")
    .select("*", { count: "exact", head: true })
    .eq("thread_id", payload.thread_id)
    .eq("is_deleted", false);

  await supabase
    .from("forum_threads")
    .update({
      reply_count: count ?? 0,
      last_reply_at: reply.created_at,
    })
    .eq("id", payload.thread_id);

  return NextResponse.json({ reply }, { status: 201 });
}

export async function PATCH(request: Request) {
  const payload = replyActionSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  if (payload.action === "react") {
    const context = await getCurrentUserContext();
    if (!context.user) {
      return jsonError("Unauthorized", 401);
    }

    const { error } = await supabase.from("forum_reactions").insert({
      target_type: "reply",
      target_id: payload.target_id,
      user_id: context.user.id,
      emoji: payload.emoji ?? "👍",
    });

    if (error) {
      return jsonError(error.message, 400);
    }

    return NextResponse.json({ ok: true });
  }

  const { error } = await requireApiUser(PERMISSIONS.MODERATE_FORUMS);
  if (error) {
    return error;
  }

  const { data: deletedReply, error: deleteError } = await supabase
    .from("forum_replies")
    .update({ is_deleted: true })
    .eq("id", payload.target_id)
    .select("thread_id")
    .maybeSingle();

  if (deleteError) {
    return jsonError(deleteError.message, 400);
  }

  if (deletedReply?.thread_id) {
    const { count } = await supabase
      .from("forum_replies")
      .select("*", { count: "exact", head: true })
      .eq("thread_id", deletedReply.thread_id)
      .eq("is_deleted", false);

    await supabase
      .from("forum_threads")
      .update({ reply_count: count ?? 0 })
      .eq("id", deletedReply.thread_id);
  }

  return NextResponse.json({ ok: true });
}

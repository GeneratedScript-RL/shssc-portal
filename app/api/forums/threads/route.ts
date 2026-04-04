import { NextResponse } from "next/server";
import { z } from "zod";
import type { JSONContent } from "@tiptap/react";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCurrentUserContext } from "@/lib/auth/getCurrentUserContext";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const threadSchema = z.object({
  channel_id: z.string().uuid(),
  title: z.string().min(4),
  body: z.custom<JSONContent>(),
});

const threadActionSchema = z.object({
  action: z.enum(["pin", "lock", "delete", "react"]),
  target_type: z.literal("thread"),
  target_id: z.string().uuid(),
  emoji: z.string().optional(),
});

export async function POST(request: Request) {
  const context = await getCurrentUserContext();
  if (!context.user) {
    return jsonError("Unauthorized", 401);
  }

  const payload = threadSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: thread, error } = await supabase
    .from("forum_threads")
    .insert({
      channel_id: payload.channel_id,
      title: payload.title,
      body: payload.body,
      author_id: context.user.id,
    })
    .select("*")
    .single();

  if (error) {
    return jsonError(error.message, 400);
  }

  return NextResponse.json({ thread }, { status: 201 });
}

export async function PATCH(request: Request) {
  const payload = threadActionSchema.parse(await request.json());
  const supabase = createServiceRoleClient();

  if (payload.action === "react") {
    const context = await getCurrentUserContext();
    if (!context.user) {
      return jsonError("Unauthorized", 401);
    }

    const { error } = await supabase.from("forum_reactions").insert({
      target_type: "thread",
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

  if (payload.action === "pin") {
    await supabase.from("forum_threads").update({ is_pinned: true }).eq("id", payload.target_id);
  }

  if (payload.action === "lock") {
    await supabase.from("forum_threads").update({ is_locked: true }).eq("id", payload.target_id);
  }

  if (payload.action === "delete") {
    await supabase.from("forum_threads").delete().eq("id", payload.target_id);
  }

  return NextResponse.json({ ok: true });
}

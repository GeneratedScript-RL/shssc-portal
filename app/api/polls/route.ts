import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getPollById, getPolls } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const pollSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(8),
  poll_type: z.enum(["single", "multiple", "ranked"]),
  closes_at: z.string().optional(),
  is_anonymous: z.boolean().default(false),
  is_satisfaction_poll: z.boolean().default(false),
  options: z.array(z.string().min(1)).min(1),
});

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (id) {
    const poll = await getPollById(id);
    return NextResponse.json({ poll });
  }

  const polls = await getPolls();
  return NextResponse.json({ polls });
}

export async function POST(request: Request) {
  const { error, context } = await requireApiUser(PERMISSIONS.MANAGE_POLLS);
  if (error || !context) {
    return error;
  }

  const payload = pollSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: poll, error: createError } = await supabase
    .from("polls")
    .insert({
      title: payload.title,
      description: payload.description,
      poll_type: payload.poll_type,
      closes_at: payload.closes_at || null,
      is_anonymous: payload.is_anonymous,
      is_satisfaction_poll: payload.is_satisfaction_poll,
      created_by: context.user.id,
    })
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  const { error: optionError } = await supabase.from("poll_options").insert(
    payload.options.map((label, index) => ({
      poll_id: poll.id,
      label,
      order_index: index,
    })),
  );

  if (optionError) {
    return jsonError(optionError.message, 400);
  }

  return NextResponse.json({ poll }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { error } = await requireApiUser(PERMISSIONS.MANAGE_POLLS);
  if (error) {
    return error;
  }

  const idResult = z.string().uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!idResult.success) {
    return jsonError("Invalid poll id.", 400);
  }

  const supabase = createServiceRoleClient();
  const { data: deletedPoll, error: deleteError } = await supabase
    .from("polls")
    .delete()
    .eq("id", idResult.data)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    return jsonError(deleteError.message, 400);
  }

  if (!deletedPoll) {
    return jsonError("Poll not found.", 404);
  }

  return NextResponse.json({ ok: true });
}

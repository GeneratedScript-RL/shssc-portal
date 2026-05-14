import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getAllEvents } from "@/lib/supabase/queries";
import { jsonError, requireApiUser } from "@/app/api/_helpers";
import { PERMISSIONS } from "@/lib/rbac/permissions";

const eventSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(8),
  start_at: z.string().min(1),
  end_at: z.string().min(1),
  location: z.string().min(2),
  max_attendees: z.number().int().nullable().optional(),
});

export async function GET() {
  const events = await getAllEvents();
  return NextResponse.json({ events });
}

export async function POST(request: Request) {
  const { error, context } = await requireApiUser(PERMISSIONS.MANAGE_EVENTS);
  if (error || !context) {
    return error;
  }

  const payload = eventSchema.parse(await request.json());
  const supabase = createServiceRoleClient();
  const { data: event, error: createError } = await supabase
    .from("events")
    .insert({
      ...payload,
      max_attendees: payload.max_attendees ?? null,
      created_by: context.user.id,
    })
    .select("*")
    .single();

  if (createError) {
    return jsonError(createError.message, 400);
  }

  return NextResponse.json({ event }, { status: 201 });
}

export async function DELETE(request: Request) {
  const { error } = await requireApiUser(PERMISSIONS.MANAGE_EVENTS);
  if (error) {
    return error;
  }

  const idResult = z.string().uuid().safeParse(new URL(request.url).searchParams.get("id"));
  if (!idResult.success) {
    return jsonError("Invalid event id.", 400);
  }

  const supabase = createServiceRoleClient();
  const { error: detachError } = await supabase
    .from("qa_sessions")
    .update({ event_id: null })
    .eq("event_id", idResult.data);

  if (detachError) {
    return jsonError(detachError.message, 400);
  }

  const { data: deletedEvent, error: deleteError } = await supabase
    .from("events")
    .delete()
    .eq("id", idResult.data)
    .select("id")
    .maybeSingle();

  if (deleteError) {
    return jsonError(deleteError.message, 400);
  }

  if (!deletedEvent) {
    return jsonError("Event not found.", 404);
  }

  return NextResponse.json({ ok: true });
}

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
  const [{ data: event }, { data: existingRegistration }] = await Promise.all([
    supabase.from("events").select("*").eq("id", params.id).maybeSingle(),
    supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", params.id)
      .eq("user_id", context.user.id)
      .maybeSingle(),
  ]);

  if (!event) {
    return jsonError("Event not found.", 404);
  }

  if (existingRegistration) {
    return jsonError("Already registered.", 409);
  }

  if (event.max_attendees) {
    const { count } = await supabase
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("event_id", params.id);

    if ((count ?? 0) >= event.max_attendees) {
      return jsonError("Event is already full.", 409);
    }
  }

  const { error } = await supabase.from("event_registrations").insert({
    event_id: params.id,
    user_id: context.user.id,
  });

  if (error) {
    return jsonError(error.message, 400);
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.8";
import { Resend } from "npm:resend@4.0.0";

const supabase = createClient(
  Deno.env.get("NEXT_PUBLIC_SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
);

const resend = new Resend(Deno.env.get("RESEND_API_KEY") ?? "");

Deno.serve(async () => {
  const now = new Date();
  const nextWindow = new Date(now.getTime() + 25 * 60 * 60 * 1000).toISOString();

  const { data: registrations, error } = await supabase
    .from("event_registrations")
    .select("id, event_id, user_id, events!inner(title, start_at, location), users!inner(email, full_name)")
    .eq("reminder_sent", false)
    .lt("events.start_at", nextWindow);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  for (const registration of registrations ?? []) {
    const event = Array.isArray((registration as any).events)
      ? (registration as any).events[0]
      : (registration as any).events;
    const user = Array.isArray((registration as any).users)
      ? (registration as any).users[0]
      : (registration as any).users;

    await resend.emails.send({
      from: "SHSSC Portal <onboarding@resend.dev>",
      to: user.email,
      subject: `Reminder: ${event.title} starts soon`,
      html: `
        <p>Hello ${user.full_name},</p>
        <p>This is a reminder that <strong>${event.title}</strong> begins within 24 hours.</p>
        <p>Start: ${new Date(event.start_at).toLocaleString()}</p>
        <p>Location: ${event.location ?? "TBA"}</p>
      `,
    });
  }

  if (registrations?.length) {
    await supabase
      .from("event_registrations")
      .update({ reminder_sent: true })
      .in(
        "id",
        registrations.map((registration) => registration.id),
      );
  }

  return new Response(JSON.stringify({ sent: registrations?.length ?? 0 }), { status: 200 });
});

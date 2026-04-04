import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import RegistrationButton from "@/components/features/events/RegistrationButton";
import { formatDate } from "@/lib/utils/formatDate";
import { getEventById } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function EventDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="container py-10">
      <div className="panel-hero">
        <Badge variant={event.is_registration_open ? "default" : "warning"}>
          {event.is_registration_open ? "Registration Open" : "Registration Closed"}
        </Badge>
        <h1 className="mt-4 text-4xl font-semibold text-brand-green">{event.title}</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">{event.description}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="panel">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">Starts</p>
            <p className="mt-2 text-lg font-semibold text-brand-green">{formatDate(event.start_at, "PPP p")}</p>
          </div>
          <div className="panel">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">Ends</p>
            <p className="mt-2 text-lg font-semibold text-brand-green">{formatDate(event.end_at, "PPP p")}</p>
          </div>
          <div className="panel">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">Capacity</p>
            <p className="mt-2 text-lg font-semibold text-brand-green">
              {event.max_attendees ? `${event.registrations}/${event.max_attendees}` : `${event.registrations} registered`}
            </p>
          </div>
        </div>
        <div className="mt-8">
          <RegistrationButton eventId={event.id} isOpen={event.is_registration_open} />
        </div>
      </div>
    </div>
  );
}

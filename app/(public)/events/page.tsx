import EventCalendar from "@/components/features/events/EventCalendar";
import EventCard from "@/components/features/events/EventCard";
import { getAllEvents } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Events</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Council activities, launches, and deadlines in one view.</h1>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Switch between month, week, and agenda views. Event colors show whether registration is
          still open.
        </p>
      </section>
      <EventCalendar events={events} />
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-brand-green">Event cards</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>
    </div>
  );
}

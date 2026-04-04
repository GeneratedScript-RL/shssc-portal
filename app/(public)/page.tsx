import Link from "next/link";
import AnnouncementsCarousel from "@/components/features/home/AnnouncementsCarousel";
import QuickLinks from "@/components/features/home/QuickLinks";
import SatisfactionPollWidget from "@/components/features/home/SatisfactionPollWidget";
import EventCard from "@/components/features/events/EventCard";
import {
  getLatestAnnouncements,
  getOpenSatisfactionPoll,
  getSatisfactionHistory,
  getUpcomingEvents,
} from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function HomePage() {
  const [announcements, upcomingEvents, poll, satisfactionHistory] = await Promise.all([
    getLatestAnnouncements(),
    getUpcomingEvents(3),
    getOpenSatisfactionPoll(),
    getSatisfactionHistory(),
  ]);

  return (
    <div className="container space-y-8 py-8">
      <AnnouncementsCarousel posts={announcements} />
      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Quick Links</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Direct routes for students and officers</h2>
        </div>
        <QuickLinks />
      </section>
      <section className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="panel space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Upcoming Events</p>
              <h2 className="mt-2 text-2xl font-semibold text-brand-green">What’s next on the calendar</h2>
            </div>
            <Link href="/events" className="text-sm font-semibold text-brand-green">
              View all events
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
        <SatisfactionPollWidget poll={poll} historicalAverages={satisfactionHistory} />
      </section>
    </div>
  );
}

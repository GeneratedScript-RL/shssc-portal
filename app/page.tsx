import AnnouncementsCarousel from "@/components/features/home/AnnouncementsCarousel";
import QuickLinks from "@/components/features/home/QuickLinks";
import UpcomingEventsStrip from "@/components/features/home/UpcomingEventsStrip";
import SatisfactionPollWidget from "@/components/features/home/SatisfactionPollWidget";

export const revalidate = 60;

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-8">
        <AnnouncementsCarousel />
      </section>

      <section className="mb-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Links</h2>
        <QuickLinks />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <UpcomingEventsStrip />
        </section>
        <section>
          <SatisfactionPollWidget />
        </section>
      </div>
    </div>
  );
}
import Link from "next/link";
import { Calendar, MapPin, Clock } from "lucide-react";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "General Assembly",
    date: "April 15, 2026",
    time: "9:00 AM",
    location: "Main Auditorium",
  },
  {
    id: "2",
    title: "Council Meeting",
    date: "April 18, 2026",
    time: "3:00 PM",
    location: "Room 201",
  },
  {
    id: "3",
    title: "Charity Fundraiser",
    date: "April 22, 2026",
    time: "10:00 AM",
    location: "School Gym",
  },
];

export default function UpcomingEventsStrip() {
  return (
    <div className="rounded-xl border border-gray-200 p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
        <Link
          href="/events"
          className="text-sm font-medium text-[#2D7D32] hover:underline"
        >
          View All
        </Link>
      </div>
      <div className="space-y-4">
        {mockEvents.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-4 rounded-lg bg-gray-50 p-4"
          >
            <div className="flex flex-col items-center rounded-lg bg-[#2D7D32] px-3 py-2 text-white">
              <span className="text-xs font-medium uppercase">
                {event.date.split(" ")[0]}
              </span>
              <span className="text-xl font-bold">
                {event.date.split(" ")[1].replace(",", "")}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{event.title}</h3>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {event.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
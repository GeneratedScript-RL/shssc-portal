import Link from "next/link";
import { CalendarClock, MapPin } from "lucide-react";
import type { EventRecord } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatDate";

interface EventCardProps {
  event: EventRecord;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`} className="forum-card flex h-full flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Badge variant={event.is_registration_open ? "default" : "warning"}>
          {event.is_registration_open ? "Registration Open" : "Closed"}
        </Badge>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {formatDate(event.start_at, "MMM d")}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-brand-green">{event.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground break-words">
        {event.description}
      </p>
      <div className="mt-6 space-y-2 text-sm text-brand-green/75">
        <div className="flex items-start gap-2">
          <CalendarClock className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{formatDate(event.start_at, "PPP p")}</span>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{event.location || "Campus venue to be announced"}</span>
        </div>
      </div>
    </Link>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { addMonths, compareAsc, endOfMonth, format, getDay, isWithinInterval, parse, startOfMonth, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { EventRecord } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

interface EventCalendarProps {
  events: EventRecord[];
}

export default function EventCalendar({ events }: EventCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarEvents = useMemo(
    () =>
      events.map((event) => ({
        title: event.title,
        start: new Date(event.start_at),
        end: new Date(event.end_at),
        resource: event,
      })),
    [events],
  );

  const visibleMonthEvents = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    return events
      .filter((event) =>
        isWithinInterval(new Date(event.start_at), {
          start: monthStart,
          end: monthEnd,
        }),
      )
      .sort((left, right) => compareAsc(new Date(left.start_at), new Date(right.start_at)));
  }, [currentDate, events]);

  return (
    <div className="rounded-[1.5rem] border border-brand-green/10 bg-white p-4 shadow-panel sm:p-5">
      <div className="space-y-4 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-orange">
              Event Schedule
            </p>
            <h3 className="mt-1 text-xl font-semibold text-brand-green">
              {format(currentDate, "MMMM yyyy")}
            </h3>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Show previous month"
              onClick={() => setCurrentDate((value) => addMonths(value, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Show next month"
              onClick={() => setCurrentDate((value) => addMonths(value, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid gap-3">
          {visibleMonthEvents.length ? (
            visibleMonthEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="rounded-2xl border border-brand-green/10 bg-brand-green/[0.03] p-4 transition hover:border-brand-green/25"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge variant={event.is_registration_open ? "default" : "warning"}>
                    {event.is_registration_open ? "Registration Open" : "Closed"}
                  </Badge>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    {format(new Date(event.start_at), "MMM d")}
                  </span>
                </div>
                <h4 className="mt-4 text-lg font-semibold text-brand-green">{event.title}</h4>
                {event.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                ) : null}
                <div className="mt-4 space-y-2 text-sm text-brand-green/80">
                  <p>{format(new Date(event.start_at), "PPP p")}</p>
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{event.location || "Campus venue to be announced"}</span>
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-green/15 px-4 py-5 text-sm text-muted-foreground">
              No events are scheduled for this month yet.
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:block">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          date={currentDate}
          onNavigate={setCurrentDate}
          views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
          eventPropGetter={(event) => {
            const resource = event.resource as EventRecord;
            return {
              style: {
                backgroundColor: resource.is_registration_open ? "#2D7D32" : "#F57C00",
                borderRadius: "0.9rem",
                color: "white",
              },
            };
          }}
        />
      </div>
    </div>
  );
}

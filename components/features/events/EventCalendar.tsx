"use client";

import { useMemo, useState } from "react";
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar";
import { format, getDay, parse, startOfWeek } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import type { EventRecord } from "@/types";

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

  return (
    <div className="rounded-[1.5rem] border border-brand-green/10 bg-white p-4 shadow-panel">
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
  );
}

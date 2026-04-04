"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/types";

const eventSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(8),
  start_at: z.string().min(1),
  end_at: z.string().min(1),
  location: z.string().min(2),
  max_attendees: z.coerce.number().int().optional(),
});

export default function AdminEventsPage() {
  const [events, setEvents] = useState<Tables<"events">[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof eventSchema>>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      start_at: "",
      end_at: "",
      location: "",
      max_attendees: undefined,
    },
  });

  useEffect(() => {
    void fetch("/api/events")
      .then((response) => response.json())
      .then((data) => setEvents(data.events ?? []));
  }, []);

  async function onSubmit(values: z.infer<typeof eventSchema>) {
    setErrorMessage(null);
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json().catch(() => null);
    if (response.ok) {
      setEvents((current) => [...current, data.event]);
      form.reset();
      return;
    }

    setErrorMessage(data?.error ?? "Unable to create event right now.");
  }

  async function handleDelete(eventId: string, eventTitle: string) {
    if (!window.confirm(`Delete "${eventTitle}"?`)) {
      return;
    }

    setDeletingId(eventId);
    setErrorMessage(null);

    const response = await fetch(`/api/events?id=${eventId}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);

    if (response.ok) {
      setEvents((current) => current.filter((event) => event.id !== eventId));
      setDeletingId(null);
      return;
    }

    setErrorMessage(data?.error ?? "Unable to delete this event right now.");
    setDeletingId(null);
  }

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Admin Events</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Create and manage council events.</h1>
      </section>
      <form onSubmit={form.handleSubmit(onSubmit)} className="panel space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="admin-event-title">Title</Label>
            <Input id="admin-event-title" {...form.register("title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-event-location">Location</Label>
            <Input id="admin-event-location" {...form.register("location")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-event-start">Start</Label>
            <Input id="admin-event-start" type="datetime-local" {...form.register("start_at")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-event-end">End</Label>
            <Input id="admin-event-end" type="datetime-local" {...form.register("end_at")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="admin-event-description">Description</Label>
            <Textarea id="admin-event-description" {...form.register("description")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-event-capacity">Max attendees</Label>
            <Input id="admin-event-capacity" type="number" {...form.register("max_attendees")} />
          </div>
        </div>
        <Button type="submit">Create event</Button>
      </form>
      <div className="roblox-panel grid gap-3">
        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        {events.map((event) => (
          <article key={event.id} className="rounded-2xl border border-brand-green/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-brand-green">{event.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
              </div>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={deletingId === event.id}
                onClick={() => void handleDelete(event.id, event.title)}
              >
                {deletingId === event.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

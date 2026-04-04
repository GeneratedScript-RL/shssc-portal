"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Tables } from "@/types";

const pollSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(8),
  poll_type: z.enum(["single", "multiple", "ranked"]),
  closes_at: z.string().optional(),
  is_anonymous: z.boolean().default(false),
  is_satisfaction_poll: z.boolean().default(false),
  options: z.string().min(3),
});

export default function AdminPollsPage() {
  const [polls, setPolls] = useState<Tables<"polls">[]>([]);
  const form = useForm<z.infer<typeof pollSchema>>({
    resolver: zodResolver(pollSchema),
    defaultValues: {
      title: "",
      description: "",
      poll_type: "single",
      closes_at: "",
      is_anonymous: false,
      is_satisfaction_poll: false,
      options: "1\n2\n3\n4\n5",
    },
  });

  useEffect(() => {
    void fetch("/api/polls")
      .then((response) => response.json())
      .then((data) => setPolls(data.polls ?? []));
  }, []);

  async function onSubmit(values: z.infer<typeof pollSchema>) {
    const response = await fetch("/api/polls", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        options: values.options.split("\n").map((option) => option.trim()).filter(Boolean),
      }),
    });
    const data = await response.json();
    if (response.ok) {
      setPolls((current) => [...current, data.poll]);
      form.reset();
    }
  }

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Admin Polls</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Launch council votes and satisfaction surveys.</h1>
      </section>
      <form onSubmit={form.handleSubmit(onSubmit)} className="panel space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="admin-poll-title">Title</Label>
            <Input id="admin-poll-title" {...form.register("title")} />
          </div>
          <div className="space-y-2">
            <Label>Poll type</Label>
            <Select value={form.watch("poll_type")} onValueChange={(value) => form.setValue("poll_type", value as z.infer<typeof pollSchema>["poll_type"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="multiple">Multiple</SelectItem>
                <SelectItem value="ranked">Ranked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="admin-poll-description">Description</Label>
            <Textarea id="admin-poll-description" {...form.register("description")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-poll-close">Closes at</Label>
            <Input id="admin-poll-close" type="datetime-local" {...form.register("closes_at")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-poll-options">Options (one per line)</Label>
            <Textarea id="admin-poll-options" {...form.register("options")} />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-3 rounded-2xl border border-brand-green/10 px-4 py-3">
            <Checkbox checked={form.watch("is_anonymous")} onCheckedChange={(value) => form.setValue("is_anonymous", !!value)} />
            <span className="text-sm text-brand-green">Anonymous poll</span>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-brand-green/10 px-4 py-3">
            <Checkbox checked={form.watch("is_satisfaction_poll")} onCheckedChange={(value) => form.setValue("is_satisfaction_poll", !!value)} />
            <span className="text-sm text-brand-green">Satisfaction poll</span>
          </label>
        </div>
        <Button type="submit">Create poll</Button>
      </form>
      <div className="roblox-panel grid gap-3">
        {polls.map((poll) => (
          <article key={poll.id} className="rounded-2xl border border-brand-green/10 p-4">
            <h2 className="text-2xl font-semibold text-brand-green">{poll.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{poll.description}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

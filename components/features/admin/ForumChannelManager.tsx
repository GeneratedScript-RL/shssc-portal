"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tables } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const channelSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
});

interface ForumChannelManagerProps {
  channels: Tables<"forum_channels">[];
}

export default function ForumChannelManager({ channels: initialChannels }: ForumChannelManagerProps) {
  const [channels, setChannels] = useState(initialChannels);
  const form = useForm<z.infer<typeof channelSchema>>({
    resolver: zodResolver(channelSchema),
    defaultValues: { name: "", slug: "", description: "" },
  });

  async function onSubmit(values: z.infer<typeof channelSchema>) {
    const response = await fetch("/api/forums/channels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (response.ok) {
      setChannels((current) => [...current, data.channel]);
      form.reset();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="roblox-panel space-y-4">
        <div className="space-y-2">
          <Label htmlFor="channel-name">Channel name</Label>
          <Input id="channel-name" {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="channel-slug">Slug</Label>
          <Input id="channel-slug" {...form.register("slug")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="channel-description">Description</Label>
          <Textarea id="channel-description" {...form.register("description")} />
        </div>
        <Button type="submit">Create channel</Button>
      </form>
      <div className="roblox-panel grid gap-3">
        {channels.map((channel) => (
          <div key={channel.id} className="rounded-2xl border border-brand-green/10 p-4">
            <h3 className="text-lg font-semibold text-brand-green">{channel.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">#{channel.slug}</p>
            <p className="mt-1 text-sm text-muted-foreground">{channel.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

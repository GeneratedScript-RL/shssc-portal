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
import AwardEmblem from "@/components/shared/AwardEmblem";

const awardSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  emblem_url: z.string().url().optional().or(z.literal("")),
});

interface AwardManagerProps {
  awards: Tables<"awards">[];
}

export default function AwardManager({ awards: initialAwards }: AwardManagerProps) {
  const [awards, setAwards] = useState(initialAwards);
  const form = useForm<z.infer<typeof awardSchema>>({
    resolver: zodResolver(awardSchema),
    defaultValues: { name: "", description: "", emblem_url: "" },
  });

  async function onSubmit(values: z.infer<typeof awardSchema>) {
    const response = await fetch("/api/awards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json();
    if (response.ok) {
      setAwards((current) => [...current, data.award]);
      form.reset();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="roblox-panel space-y-4">
        <div className="space-y-2">
          <Label htmlFor="award-name">Award name</Label>
          <Input id="award-name" {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="award-description">Description</Label>
          <Textarea id="award-description" {...form.register("description")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="award-emblem">Emblem URL</Label>
          <Input id="award-emblem" {...form.register("emblem_url")} />
        </div>
        <Button type="submit">Create award</Button>
      </form>
      <div className="roblox-panel grid gap-3 md:grid-cols-2">
        {awards.map((award) => (
          <div key={award.id} className="rounded-2xl border border-brand-green/10 p-4">
            <AwardEmblem award={award} />
            <h3 className="mt-4 text-lg font-semibold text-brand-green">{award.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{award.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

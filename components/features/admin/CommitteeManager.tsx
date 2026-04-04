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

const committeeSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
});

interface CommitteeManagerProps {
  committees: Tables<"committees">[];
}

export default function CommitteeManager({ committees: initialCommittees }: CommitteeManagerProps) {
  const [committees, setCommittees] = useState(initialCommittees);
  const form = useForm<z.infer<typeof committeeSchema>>({
    resolver: zodResolver(committeeSchema),
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(values: z.infer<typeof committeeSchema>) {
    const response = await fetch("/api/committees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (response.ok) {
      setCommittees((current) => [...current, data.committee]);
      form.reset();
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="roblox-panel space-y-4">
        <div className="space-y-2">
          <Label htmlFor="committee-name">Committee name</Label>
          <Input id="committee-name" {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="committee-description">Description</Label>
          <Textarea id="committee-description" {...form.register("description")} />
        </div>
        <Button type="submit">Create committee</Button>
      </form>
      <div className="roblox-panel grid gap-3">
        {committees.map((committee) => (
          <div key={committee.id} className="rounded-2xl border border-brand-green/10 p-4">
            <h3 className="text-lg font-semibold text-brand-green">{committee.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{committee.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

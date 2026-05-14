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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof committeeSchema>>({
    resolver: zodResolver(committeeSchema),
    defaultValues: { name: "", description: "" },
  });

  async function onSubmit(values: z.infer<typeof committeeSchema>) {
    setErrorMessage(null);
    const response = await fetch("/api/committees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json().catch(() => null);
    if (response.ok) {
      setCommittees((current) => [...current, data.committee]);
      form.reset();
      return;
    }

    setErrorMessage(data?.error ?? "Unable to create committee right now.");
  }

  async function handleDelete(committeeId: string, committeeName: string) {
    if (!window.confirm(`Delete "${committeeName}"?`)) {
      return;
    }

    setDeletingId(committeeId);
    setErrorMessage(null);

    const response = await fetch(`/api/committees?id=${committeeId}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);

    if (response.ok) {
      setCommittees((current) => current.filter((committee) => committee.id !== committeeId));
      setDeletingId(null);
      return;
    }

    setErrorMessage(data?.error ?? "Unable to delete this committee right now.");
    setDeletingId(null);
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
        {errorMessage ? <p className="text-sm text-destructive">{errorMessage}</p> : null}
        {committees.map((committee) => (
          <div key={committee.id} className="rounded-2xl border border-brand-green/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold text-brand-green">{committee.name}</h3>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={deletingId === committee.id}
                onClick={() => void handleDelete(committee.id, committee.name)}
              >
                {deletingId === committee.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{committee.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

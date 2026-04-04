"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tables } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import RankChip from "@/components/shared/RankChip";

const rankSchema = z.object({
  name: z.string().min(2),
  color_hex: z.string().regex(/^#([A-Fa-f0-9]{6})$/),
  hierarchy_order: z.coerce.number().int().min(0),
});

interface RankManagerProps {
  ranks: Tables<"ranks">[];
}

export default function RankManager({ ranks: initialRanks }: RankManagerProps) {
  const [ranks, setRanks] = useState(initialRanks);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof rankSchema>>({
    resolver: zodResolver(rankSchema),
    defaultValues: { color_hex: "#888888", hierarchy_order: initialRanks.length + 1, name: "" },
  });

  async function onSubmit(values: z.infer<typeof rankSchema>) {
    setErrorMessage(null);
    const response = await fetch("/api/ranks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = await response.json().catch(() => null);
    if (response.ok) {
      const nextRanks = [...ranks, data.rank];
      setRanks(nextRanks);
      form.reset({ color_hex: "#888888", hierarchy_order: nextRanks.length + 1, name: "" });
      return;
    }

    setErrorMessage(data?.error ?? "Unable to create rank right now.");
  }

  async function handleDelete(rankId: string, rankName: string) {
    if (!window.confirm(`Delete "${rankName}"?`)) {
      return;
    }

    setDeletingId(rankId);
    setErrorMessage(null);

    const response = await fetch(`/api/ranks?id=${rankId}`, {
      method: "DELETE",
    });
    const data = await response.json().catch(() => null);

    if (response.ok) {
      setRanks((current) => current.filter((rank) => rank.id !== rankId));
      setDeletingId(null);
      return;
    }

    setErrorMessage(data?.error ?? "Unable to delete this rank right now.");
    setDeletingId(null);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="roblox-panel space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rank-name">Rank name</Label>
          <Input id="rank-name" {...form.register("name")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rank-color">Color</Label>
          <Input id="rank-color" {...form.register("color_hex")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rank-order">Hierarchy order</Label>
          <Input id="rank-order" type="number" {...form.register("hierarchy_order")} />
        </div>
        <Button type="submit">Add rank</Button>
      </form>
      <div className="roblox-panel grid gap-3 md:grid-cols-2">
        {errorMessage ? <p className="md:col-span-2 text-sm text-destructive">{errorMessage}</p> : null}
        {ranks.map((rank) => (
          <div key={rank.id} className="rounded-2xl border border-brand-green/10 p-4">
            <div className="flex items-start justify-between gap-3">
              <RankChip rank={rank} />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={deletingId === rank.id}
                onClick={() => void handleDelete(rank.id, rank.name)}
              >
                {deletingId === rank.id ? "Deleting..." : "Delete"}
              </Button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Order: {rank.hierarchy_order}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

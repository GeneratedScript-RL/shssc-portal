"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Tables, UserProfile } from "@/types";

const userDetailSchema = z.object({
  access_level_id: z.string().uuid(),
  rank_ids: z.array(z.string().uuid()),
  award_ids: z.array(z.string().uuid()),
  is_active: z.boolean(),
});

export default function AdminUserDetailPage() {
  const params = useParams<{ id: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [levels, setLevels] = useState<Tables<"access_levels">[]>([]);
  const [ranks, setRanks] = useState<Tables<"ranks">[]>([]);
  const [awards, setAwards] = useState<Tables<"awards">[]>([]);
  const form = useForm<z.infer<typeof userDetailSchema>>({
    resolver: zodResolver(userDetailSchema),
    defaultValues: { access_level_id: "", rank_ids: [], award_ids: [], is_active: true },
  });

  useEffect(() => {
    void Promise.all([
      fetch(`/api/users/${params.id}`).then((response) => response.json()),
      fetch("/api/access-levels").then((response) => response.json()),
      fetch("/api/ranks").then((response) => response.json()),
      fetch("/api/awards").then((response) => response.json()),
    ]).then(([userPayload, levelsPayload, ranksPayload, awardsPayload]) => {
      setUser(userPayload.user ?? null);
      setLevels(levelsPayload.accessLevels ?? []);
      setRanks(ranksPayload.ranks ?? []);
      setAwards(awardsPayload.awards ?? []);
      form.reset({
        access_level_id: userPayload.user?.access_level?.id ?? "",
        rank_ids: (userPayload.user?.ranks ?? []).map((rank: Tables<"ranks">) => rank.id),
        award_ids: (userPayload.user?.awards ?? []).map((award: Tables<"awards">) => award.id),
        is_active: userPayload.user?.is_active ?? true,
      });
    });
  }, [form, params.id]);

  function toggleArrayValue(field: "rank_ids" | "award_ids", value: string, checked: boolean) {
    const current = form.getValues(field);
    form.setValue(field, checked ? [...current, value] : current.filter((item) => item !== value));
  }

  async function onSubmit(values: z.infer<typeof userDetailSchema>) {
    await fetch(`/api/users/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  }

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">User Detail</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">{user?.full_name ?? "Loading user..."}</h1>
        {user ? <Badge>{user.email}</Badge> : null}
      </section>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 xl:grid-cols-2">
        <section className="roblox-panel space-y-4">
          <div className="space-y-2">
            <Label>Access level</Label>
            <Select value={form.watch("access_level_id")} onValueChange={(value) => form.setValue("access_level_id", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose access level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-brand-green/10 px-4 py-3">
            <Checkbox checked={form.watch("is_active")} onCheckedChange={(value) => form.setValue("is_active", !!value)} />
            <span className="text-sm text-brand-green">User is active</span>
          </label>
        </section>
        <section className="roblox-panel space-y-4">
          <div>
            <Label>Ranks</Label>
            <div className="mt-3 grid gap-2">
              {ranks.map((rank) => (
                <label key={rank.id} className="flex items-center gap-3 rounded-2xl border border-brand-green/10 px-4 py-3">
                  <Checkbox
                    checked={form.watch("rank_ids").includes(rank.id)}
                    onCheckedChange={(value) => toggleArrayValue("rank_ids", rank.id, !!value)}
                  />
                  <span>{rank.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label>Awards</Label>
            <div className="mt-3 grid gap-2">
              {awards.map((award) => (
                <label key={award.id} className="flex items-center gap-3 rounded-2xl border border-brand-green/10 px-4 py-3">
                  <Checkbox
                    checked={form.watch("award_ids").includes(award.id)}
                    onCheckedChange={(value) => toggleArrayValue("award_ids", award.id, !!value)}
                  />
                  <span>{award.name}</span>
                </label>
              ))}
            </div>
          </div>
        </section>
        <Button type="submit" className="w-fit">
          Save changes
        </Button>
      </form>
    </div>
  );
}

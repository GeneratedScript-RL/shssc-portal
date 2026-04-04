"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash2 } from "lucide-react";
import type { LegacyRosterEntryRecord, Tables, UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uploadLegacyPhoto } from "@/lib/utils/uploadLegacyPhoto";

const NO_RANK_VALUE = "__no-rank__";
const NO_COMMITTEE_VALUE = "__no-committee__";

const rosterEntrySchema = z.object({
  roster_id: z.string().uuid(),
  user_id: z.string().uuid(),
  position_title: z.string().min(2),
  rank_id: z.string().uuid().optional().or(z.literal("")),
  committee_id: z.string().uuid().optional().or(z.literal("")),
  photo_url: z.string().url().optional().or(z.literal("")),
  order_index: z.coerce.number().int().min(0).default(0),
});

interface RosterEntryCardEditorProps {
  entry: LegacyRosterEntryRecord;
  users: UserProfile[];
  ranks: Tables<"ranks">[];
  committees: Tables<"committees">[];
  onSaved: (entry: LegacyRosterEntryRecord) => void;
  onDeleted: (entryId: string) => void;
}

export default function RosterEntryCardEditor({
  entry,
  users,
  ranks,
  committees,
  onSaved,
  onDeleted,
}: RosterEntryCardEditorProps) {
  const [uploading, setUploading] = useState(false);
  const form = useForm<z.infer<typeof rosterEntrySchema>>({
    resolver: zodResolver(rosterEntrySchema),
    defaultValues: {
      roster_id: entry.roster_id,
      user_id: entry.user_id,
      position_title: entry.position_title,
      rank_id: entry.rank_id ?? "",
      committee_id: entry.committee_id ?? "",
      photo_url: entry.photo_url ?? "",
      order_index: entry.order_index,
    },
  });

  useEffect(() => {
    form.reset({
      roster_id: entry.roster_id,
      user_id: entry.user_id,
      position_title: entry.position_title,
      rank_id: entry.rank_id ?? "",
      committee_id: entry.committee_id ?? "",
      photo_url: entry.photo_url ?? "",
      order_index: entry.order_index,
    });
  }, [entry, form]);

  const previewUrl = form.watch("photo_url") || entry.user?.avatar_url || null;

  async function handlePhotoChange(file?: File | null) {
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const url = await uploadLegacyPhoto(file);
      form.setValue("photo_url", url, { shouldDirty: true, shouldValidate: true });
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof rosterEntrySchema>) {
    const response = await fetch(`/api/roster/entries/${entry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = await response.json().catch(() => null);

    if (response.ok && payload?.entry) {
      onSaved(payload.entry);
    }
  }

  async function handleDelete() {
    const response = await fetch(`/api/roster/entries/${entry.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      onDeleted(entry.id);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-[1.5rem] border border-brand-green/10 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4 xl:grid-cols-[120px_1fr]">
        <div className="space-y-3">
          <div className="relative aspect-square overflow-hidden rounded-[1.25rem] border border-brand-green/10 bg-brand-green/[0.04]">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt={entry.user?.full_name ?? "Roster photo"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm font-semibold text-muted-foreground">
                No photo
              </div>
            )}
          </div>
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="cursor-pointer file:mr-3 file:rounded-full file:border-0 file:bg-brand-green file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
            onChange={(event) => void handlePhotoChange(event.target.files?.[0])}
          />
          {uploading ? <p className="text-xs text-muted-foreground">Uploading photo...</p> : null}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label>Officer</Label>
            <Select value={form.watch("user_id")} onValueChange={(value) => form.setValue("user_id", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`position-${entry.id}`}>Position</Label>
            <Input id={`position-${entry.id}`} {...form.register("position_title")} />
          </div>
          <div className="space-y-2">
            <Label>Rank</Label>
            <Select
              value={form.watch("rank_id") || NO_RANK_VALUE}
              onValueChange={(value) => form.setValue("rank_id", value === NO_RANK_VALUE ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_RANK_VALUE}>No rank</SelectItem>
                {ranks.map((rank) => (
                  <SelectItem key={rank.id} value={rank.id}>
                    {rank.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Committee</Label>
            <Select
              value={form.watch("committee_id") || NO_COMMITTEE_VALUE}
              onValueChange={(value) =>
                form.setValue("committee_id", value === NO_COMMITTEE_VALUE ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NO_COMMITTEE_VALUE}>No committee</SelectItem>
                {committees.map((committee) => (
                  <SelectItem key={committee.id} value={committee.id}>
                    {committee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`order-${entry.id}`}>Display order</Label>
            <Input id={`order-${entry.id}`} type="number" min={0} {...form.register("order_index")} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor={`photo-url-${entry.id}`}>Photo URL</Label>
            <Input id={`photo-url-${entry.id}`} {...form.register("photo_url")} />
          </div>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Button type="submit" className="gap-2">
              <Save className="h-4 w-4" />
              Save officer
            </Button>
            <Button type="button" variant="destructive" className="gap-2" onClick={() => void handleDelete()}>
              <Trash2 className="h-4 w-4" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Tables, UserProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const rosterEntrySchema = z.object({
  roster_id: z.string().uuid(),
  user_id: z.string().uuid(),
  position_title: z.string().min(2),
  rank_id: z.string().uuid().optional().or(z.literal("")),
  committee_id: z.string().uuid().optional().or(z.literal("")),
});

interface RosterEditorProps {
  rosters: Tables<"officer_rosters">[];
  entries: Tables<"officer_roster_entries">[];
  users: UserProfile[];
  ranks: Tables<"ranks">[];
  committees: Tables<"committees">[];
}

export default function RosterEditor({
  rosters,
  entries: initialEntries,
  users,
  ranks,
  committees,
}: RosterEditorProps) {
  const [entries, setEntries] = useState(initialEntries);
  const form = useForm<z.infer<typeof rosterEntrySchema>>({
    resolver: zodResolver(rosterEntrySchema),
    defaultValues: {
      roster_id: rosters[0]?.id ?? "",
      user_id: users[0]?.id ?? "",
      position_title: "",
      rank_id: "",
      committee_id: "",
    },
  });

  const selectedRosterEntries = useMemo(
    () => entries.filter((entry) => entry.roster_id === form.watch("roster_id")),
    [entries, form],
  );

  async function onSubmit(values: z.infer<typeof rosterEntrySchema>) {
    const response = await fetch("/api/roster", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await response.json();
    if (response.ok) {
      setEntries((current) => [...current, data.entry]);
      form.reset({
        ...values,
        position_title: "",
      });
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
      <form onSubmit={form.handleSubmit(onSubmit)} className="roblox-panel space-y-4">
        <div className="space-y-2">
          <Label>School year</Label>
          <Select value={form.watch("roster_id")} onValueChange={(value) => form.setValue("roster_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a roster" />
            </SelectTrigger>
            <SelectContent>
              {rosters.map((roster) => (
                <SelectItem key={roster.id} value={roster.id}>
                  {roster.school_year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>User</Label>
          <Select value={form.watch("user_id")} onValueChange={(value) => form.setValue("user_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a user" />
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
        <div className="space-y-2">
          <Label htmlFor="position-title">Position title</Label>
          <Input id="position-title" {...form.register("position_title")} />
        </div>
        <div className="space-y-2">
          <Label>Rank</Label>
          <Select value={form.watch("rank_id")} onValueChange={(value) => form.setValue("rank_id", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Optional rank" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No rank</SelectItem>
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
            value={form.watch("committee_id")}
            onValueChange={(value) => form.setValue("committee_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Optional committee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">No committee</SelectItem>
              {committees.map((committee) => (
                <SelectItem key={committee.id} value={committee.id}>
                  {committee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Add roster entry</Button>
      </form>
      <div className="roblox-panel">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Rank</TableHead>
              <TableHead>Committee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedRosterEntries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>{users.find((user) => user.id === entry.user_id)?.full_name ?? "Unknown"}</TableCell>
                <TableCell>{entry.position_title}</TableCell>
                <TableCell>{ranks.find((rank) => rank.id === entry.rank_id)?.name ?? "None"}</TableCell>
                <TableCell>
                  {committees.find((committee) => committee.id === entry.committee_id)?.name ?? "None"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

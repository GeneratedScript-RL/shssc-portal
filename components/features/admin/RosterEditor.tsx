"use client";

import { type DragEvent, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GripVertical, ImagePlus, Plus, Save, Trash2 } from "lucide-react";
import type { LegacyHighlightRecord, LegacyRosterEntryRecord, Tables, UserProfile } from "@/types";
import LegacyHighlightEditorCard from "@/components/features/admin/LegacyHighlightEditorCard";
import RosterEntryCardEditor from "@/components/features/admin/RosterEntryCardEditor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";
import { uploadLegacyPhoto } from "@/lib/utils/uploadLegacyPhoto";

const NO_RANK_VALUE = "__no-rank__";
const NO_COMMITTEE_VALUE = "__no-committee__";

const createYearSchema = z.object({
  school_year: z.string().min(4),
  is_active: z.boolean().default(false),
});

const rosterYearSchema = z.object({
  school_year: z.string().min(4),
  is_active: z.boolean().default(false),
  achievements_text: z.string().default(""),
  milestones_text: z.string().default(""),
  impact_summary: z.string().default(""),
  president_quote: z.string().default(""),
});

const rosterEntrySchema = z.object({
  roster_id: z.string().uuid(),
  user_id: z.string().uuid(),
  position_title: z.string().min(2),
  rank_id: z.string().uuid().optional().or(z.literal("")),
  committee_id: z.string().uuid().optional().or(z.literal("")),
  photo_url: z.string().url().optional().or(z.literal("")),
  order_index: z.coerce.number().int().min(0).default(0),
});

const legacyHighlightSchema = z.object({
  roster_id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().min(8),
  order_index: z.coerce.number().int().min(0).default(0),
});

interface RosterEditorProps {
  rosters: Tables<"officer_rosters">[];
  entries: LegacyRosterEntryRecord[];
  highlights: LegacyHighlightRecord[];
  users: UserProfile[];
  ranks: Tables<"ranks">[];
  committees: Tables<"committees">[];
}

function linesToText(lines: string[] | null | undefined) {
  return (lines ?? []).join("\n");
}

function textToLines(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function sortByOrderThenYear(rosters: Tables<"officer_rosters">[]) {
  return [...rosters].sort(
    (left, right) =>
      left.order_index - right.order_index || right.school_year.localeCompare(left.school_year),
  );
}

function reorderById<T extends { id: string; order_index: number }>(
  items: T[],
  draggedId: string,
  droppedOnId: string,
) {
  const currentIndex = items.findIndex((item) => item.id === draggedId);
  const targetIndex = items.findIndex((item) => item.id === droppedOnId);

  if (currentIndex === -1 || targetIndex === -1 || currentIndex === targetIndex) {
    return items;
  }

  const next = [...items];
  const [movedItem] = next.splice(currentIndex, 1);
  next.splice(targetIndex, 0, movedItem);

  return next.map((item, index) => ({ ...item, order_index: index }));
}

export default function RosterEditor({
  rosters: initialRosters,
  entries: initialEntries,
  highlights: initialHighlights,
  users,
  ranks,
  committees,
}: RosterEditorProps) {
  const [rosters, setRosters] = useState(() => sortByOrderThenYear(initialRosters));
  const [entries, setEntries] = useState(initialEntries);
  const [highlights, setHighlights] = useState(initialHighlights);
  const [selectedRosterId, setSelectedRosterId] = useState(
    () => sortByOrderThenYear(initialRosters)[0]?.id ?? "",
  );
  const [creatingYear, setCreatingYear] = useState(false);
  const [creatingEntry, setCreatingEntry] = useState(false);
  const [creatingHighlight, setCreatingHighlight] = useState(false);
  const [uploadingNewPhoto, setUploadingNewPhoto] = useState(false);
  const [draggedRosterId, setDraggedRosterId] = useState<string | null>(null);
  const [draggedEntryId, setDraggedEntryId] = useState<string | null>(null);
  const [savingRosterOrder, setSavingRosterOrder] = useState(false);
  const [savingEntryOrder, setSavingEntryOrder] = useState(false);
  const [deletingRosterId, setDeletingRosterId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedRoster = useMemo(
    () => rosters.find((roster) => roster.id === selectedRosterId) ?? null,
    [rosters, selectedRosterId],
  );

  const selectedRosterEntries = useMemo(
    () =>
      entries
        .filter((entry) => entry.roster_id === selectedRosterId)
        .sort(
          (left, right) =>
            left.order_index - right.order_index ||
            left.position_title.localeCompare(right.position_title),
        ),
    [entries, selectedRosterId],
  );

  const selectedHighlights = useMemo(
    () =>
      highlights
        .filter((highlight) => highlight.roster_id === selectedRosterId)
        .sort(
          (left, right) =>
            left.order_index - right.order_index || left.title.localeCompare(right.title),
        ),
    [highlights, selectedRosterId],
  );

  const createYearForm = useForm<z.infer<typeof createYearSchema>>({
    resolver: zodResolver(createYearSchema),
    defaultValues: { school_year: "", is_active: false },
  });

  const rosterYearForm = useForm<z.infer<typeof rosterYearSchema>>({
    resolver: zodResolver(rosterYearSchema),
    defaultValues: {
      school_year: selectedRoster?.school_year ?? "",
      is_active: selectedRoster?.is_active ?? false,
      achievements_text: linesToText(selectedRoster?.achievements),
      milestones_text: linesToText(selectedRoster?.milestones),
      impact_summary: selectedRoster?.impact_summary ?? "",
      president_quote: selectedRoster?.president_quote ?? "",
    },
  });

  const rosterEntryForm = useForm<z.infer<typeof rosterEntrySchema>>({
    resolver: zodResolver(rosterEntrySchema),
    defaultValues: {
      roster_id: selectedRosterId || "00000000-0000-0000-0000-000000000000",
      user_id: users[0]?.id ?? "00000000-0000-0000-0000-000000000000",
      position_title: "",
      rank_id: "",
      committee_id: "",
      photo_url: "",
      order_index: selectedRosterEntries.length,
    },
  });

  const highlightForm = useForm<z.infer<typeof legacyHighlightSchema>>({
    resolver: zodResolver(legacyHighlightSchema),
    defaultValues: {
      roster_id: selectedRosterId || "00000000-0000-0000-0000-000000000000",
      title: "",
      description: "",
      order_index: selectedHighlights.length,
    },
  });

  useEffect(() => {
    if (!selectedRoster) {
      return;
    }

    rosterYearForm.reset({
      school_year: selectedRoster.school_year,
      is_active: selectedRoster.is_active,
      achievements_text: linesToText(selectedRoster.achievements),
      milestones_text: linesToText(selectedRoster.milestones),
      impact_summary: selectedRoster.impact_summary ?? "",
      president_quote: selectedRoster.president_quote ?? "",
    });
  }, [rosterYearForm, selectedRoster]);

  useEffect(() => {
    if (!selectedRosterId) {
      return;
    }

    rosterEntryForm.reset({
      roster_id: selectedRosterId,
      user_id: users[0]?.id ?? "00000000-0000-0000-0000-000000000000",
      position_title: "",
      rank_id: "",
      committee_id: "",
      photo_url: "",
      order_index: selectedRosterEntries.length,
    });
  }, [rosterEntryForm, selectedRosterEntries.length, selectedRosterId, users]);

  useEffect(() => {
    if (!selectedRosterId) {
      return;
    }

    highlightForm.reset({
      roster_id: selectedRosterId,
      title: "",
      description: "",
      order_index: selectedHighlights.length,
    });
  }, [highlightForm, selectedHighlights.length, selectedRosterId]);

  async function handleCreateYear(values: z.infer<typeof createYearSchema>) {
    setCreatingYear(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/roster/years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          order_index: rosters.length,
          achievements: [],
          milestones: [],
          impact_summary: "",
          president_quote: "",
        }),
      });
      const payload = await response.json().catch(() => null);

      if (response.ok && payload?.roster) {
        setRosters((current) => {
          const next = values.is_active
            ? current.map((roster) => ({ ...roster, is_active: false }))
            : current;

          return sortByOrderThenYear([...next, payload.roster]);
        });
        setSelectedRosterId(payload.roster.id);
        createYearForm.reset({ school_year: "", is_active: false });
      } else {
        setErrorMessage(payload?.error ?? "Unable to create that legacy year right now.");
      }
    } finally {
      setCreatingYear(false);
    }
  }

  async function handleUpdateYear(values: z.infer<typeof rosterYearSchema>) {
    if (!selectedRoster) {
      return;
    }

    setErrorMessage(null);
    const response = await fetch(`/api/roster/years/${selectedRoster.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        school_year: values.school_year,
        is_active: values.is_active,
        order_index: selectedRoster.order_index,
        achievements: textToLines(values.achievements_text),
        milestones: textToLines(values.milestones_text),
        impact_summary: values.impact_summary,
        president_quote: values.president_quote,
      }),
    });
    const payload = await response.json().catch(() => null);

    if (response.ok && payload?.roster) {
      setRosters((current) =>
        current
          .map((roster) => {
            if (payload.roster.is_active) {
              return roster.id === payload.roster.id
                ? payload.roster
                : { ...roster, is_active: false };
            }

            return roster.id === payload.roster.id ? payload.roster : roster;
          })
          .sort(
            (left, right) =>
              left.order_index - right.order_index ||
              right.school_year.localeCompare(left.school_year),
          ),
      );
    } else {
      setErrorMessage(payload?.error ?? "Unable to save that legacy year right now.");
    }
  }

  async function handleRosterDrop(rosterId: string, event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();

    if (!draggedRosterId || draggedRosterId === rosterId) {
      setDraggedRosterId(null);
      return;
    }

    const previousRosters = rosters;
    const nextRosters = reorderById(rosters, draggedRosterId, rosterId);
    setRosters(nextRosters);
    setDraggedRosterId(null);
    setSavingRosterOrder(true);
    setErrorMessage(null);

    const response = await fetch("/api/roster/years", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rosters: nextRosters.map((roster) => ({
          id: roster.id,
          order_index: roster.order_index,
        })),
      }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setRosters(previousRosters);
      setErrorMessage(payload?.error ?? "Unable to save the legacy year order right now.");
    }

    setSavingRosterOrder(false);
  }

  async function handleEntryDrop(entryId: string, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();

    if (!draggedEntryId || draggedEntryId === entryId) {
      setDraggedEntryId(null);
      return;
    }

    const previousEntries = entries;
    const nextSelectedEntries = reorderById(selectedRosterEntries, draggedEntryId, entryId);
    const nextEntries = entries.map(
      (entry) => nextSelectedEntries.find((nextEntry) => nextEntry.id === entry.id) ?? entry,
    );

    setEntries(nextEntries);
    setDraggedEntryId(null);
    setSavingEntryOrder(true);
    setErrorMessage(null);

    const response = await fetch("/api/roster", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entries: nextSelectedEntries.map((entry) => ({
          id: entry.id,
          order_index: entry.order_index,
        })),
      }),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setEntries(previousEntries);
      setErrorMessage(payload?.error ?? "Unable to save the officer card order right now.");
    }

    setSavingEntryOrder(false);
  }

  async function handleDeleteYear() {
    if (!selectedRoster) {
      return;
    }

    if (
      !window.confirm(
        `Delete "${selectedRoster.school_year}" and all officer cards and project highlights for that year?`,
      )
    ) {
      return;
    }

    setDeletingRosterId(selectedRoster.id);
    setErrorMessage(null);

    const response = await fetch(`/api/roster/years/${selectedRoster.id}`, {
      method: "DELETE",
    });
    const payload = await response.json().catch(() => null);

    if (response.ok) {
      setRosters((current) => {
        const next = current
          .filter((roster) => roster.id !== selectedRoster.id)
          .map((roster, index) => ({ ...roster, order_index: index }));
        setSelectedRosterId(next[0]?.id ?? "");
        return next;
      });
      setEntries((current) => current.filter((entry) => entry.roster_id !== selectedRoster.id));
      setHighlights((current) =>
        current.filter((highlight) => highlight.roster_id !== selectedRoster.id),
      );
      setDeletingRosterId(null);
      return;
    }

    setErrorMessage(payload?.error ?? "Unable to delete that legacy year right now.");
    setDeletingRosterId(null);
  }

  async function handleNewEntryPhoto(file?: File | null) {
    if (!file) {
      return;
    }

    setUploadingNewPhoto(true);
    try {
      const url = await uploadLegacyPhoto(file);
      rosterEntryForm.setValue("photo_url", url, { shouldDirty: true, shouldValidate: true });
    } finally {
      setUploadingNewPhoto(false);
    }
  }

  async function handleCreateEntry(values: z.infer<typeof rosterEntrySchema>) {
    setCreatingEntry(true);
    try {
      const response = await fetch("/api/roster", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => null);

      if (response.ok && payload?.entry) {
        setEntries((current) => [...current, payload.entry]);
        rosterEntryForm.reset({
          roster_id: values.roster_id,
          user_id: users[0]?.id ?? values.user_id,
          position_title: "",
          rank_id: "",
          committee_id: "",
          photo_url: "",
          order_index: values.order_index + 1,
        });
      }
    } finally {
      setCreatingEntry(false);
    }
  }

  async function handleCreateHighlight(values: z.infer<typeof legacyHighlightSchema>) {
    setCreatingHighlight(true);
    try {
      const response = await fetch("/api/roster/highlights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const payload = await response.json().catch(() => null);

      if (response.ok && payload?.highlight) {
        setHighlights((current) => [
          ...current,
          {
            ...payload.highlight,
            school_year: selectedRoster?.school_year,
          },
        ]);
        highlightForm.reset({
          roster_id: values.roster_id,
          title: "",
          description: "",
          order_index: values.order_index + 1,
        });
      }
    } finally {
      setCreatingHighlight(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
      <aside className="roblox-panel space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">
            Legacy Years
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-brand-green">
            Choose a school year to curate
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Set the year details, order officers, upload photos, and publish standout projects.
          </p>
          {savingRosterOrder ? (
            <p className="mt-2 text-xs font-semibold text-brand-orange">Saving year order...</p>
          ) : null}
        </div>
        {errorMessage ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}
        <div className="grid gap-3">
          {rosters.map((roster) => (
            <button
              key={roster.id}
              type="button"
              draggable
              onDragStart={(event) => {
                setDraggedRosterId(roster.id);
                event.dataTransfer.effectAllowed = "move";
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => void handleRosterDrop(roster.id, event)}
              onDragEnd={() => setDraggedRosterId(null)}
              onClick={() => setSelectedRosterId(roster.id)}
              className={cn(
                "cursor-grab rounded-[1.35rem] border px-4 py-4 text-left transition active:cursor-grabbing",
                selectedRosterId === roster.id
                  ? "border-brand-green bg-brand-green text-white shadow-sm"
                  : "border-brand-green/10 bg-white hover:border-brand-green/25",
                draggedRosterId === roster.id ? "opacity-60" : "",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <GripVertical className="h-4 w-4 shrink-0" />
                  <p className="font-semibold">{roster.school_year}</p>
                </div>
                {roster.is_active ? (
                  <Badge className={selectedRosterId === roster.id ? "bg-white text-brand-green" : ""}>
                    Active
                  </Badge>
                ) : null}
              </div>
              <p className={cn("mt-2 text-sm", selectedRosterId === roster.id ? "text-white/80" : "text-muted-foreground")}>
                {entries.filter((entry) => entry.roster_id === roster.id).length} officers
              </p>
            </button>
          ))}
          {!rosters.length ? (
            <div className="rounded-[1.35rem] border border-dashed border-brand-green/15 px-4 py-5 text-sm text-muted-foreground">
              Create the first legacy year to start building the archive.
            </div>
          ) : null}
        </div>
        <form
          onSubmit={createYearForm.handleSubmit(handleCreateYear)}
          className="space-y-4 rounded-[1.35rem] border border-brand-green/10 bg-brand-green/[0.03] p-4"
        >
          <div>
            <p className="text-sm font-semibold text-brand-green">Add a new year</p>
            <p className="mt-1 text-sm text-muted-foreground">Example: `SY 2024-2025`</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-school-year">School year</Label>
            <Input id="new-school-year" {...createYearForm.register("school_year")} />
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-brand-green/10 bg-white px-4 py-3">
            <Checkbox
              checked={createYearForm.watch("is_active")}
              onCheckedChange={(value) => createYearForm.setValue("is_active", !!value)}
            />
            <span className="text-sm text-brand-green">Set as active roster</span>
          </label>
          <Button type="submit" className="w-full gap-2" disabled={creatingYear}>
            <Plus className="h-4 w-4" />
            {creatingYear ? "Creating year..." : "Create legacy year"}
          </Button>
        </form>
      </aside>
      <section className="space-y-6">
        {selectedRoster ? (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="mobile-chip-row h-auto w-full justify-start rounded-[1.5rem] bg-brand-green/8 p-2">
              <TabsTrigger value="overview" className="shrink-0">Year Setup</TabsTrigger>
              <TabsTrigger value="officers" className="shrink-0">Officers</TabsTrigger>
              <TabsTrigger value="projects" className="shrink-0">Projects</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <form onSubmit={rosterYearForm.handleSubmit(handleUpdateYear)} className="panel space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Year Setup</p>
                    <h3 className="mt-2 text-2xl font-semibold text-brand-green">
                      Legacy overview for {selectedRoster.school_year}
                    </h3>
                  </div>
                  {selectedRoster.is_active ? <Badge>Current active roster</Badge> : null}
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="roster-school-year">School year label</Label>
                    <Input id="roster-school-year" {...rosterYearForm.register("school_year")} />
                  </div>
                  <label className="flex items-center gap-3 rounded-2xl border border-brand-green/10 bg-white px-4 py-3">
                    <Checkbox
                      checked={rosterYearForm.watch("is_active")}
                      onCheckedChange={(value) => rosterYearForm.setValue("is_active", !!value)}
                    />
                    <span className="text-sm text-brand-green">Use this as the active officers page</span>
                  </label>
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="achievements-text">Key achievements</Label>
                    <Textarea id="achievements-text" {...rosterYearForm.register("achievements_text")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="milestones-text">Milestones</Label>
                    <Textarea id="milestones-text" {...rosterYearForm.register("milestones_text")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="impact-summary">Impact summary</Label>
                  <Textarea id="impact-summary" {...rosterYearForm.register("impact_summary")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="president-quote">President quote</Label>
                  <Textarea id="president-quote" {...rosterYearForm.register("president_quote")} />
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button type="submit" className="gap-2">
                    <Save className="h-4 w-4" />
                    Save year details
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    className="gap-2"
                    disabled={deletingRosterId === selectedRoster.id}
                    onClick={() => void handleDeleteYear()}
                  >
                    <Trash2 className="h-4 w-4" />
                    {deletingRosterId === selectedRoster.id ? "Deleting year..." : "Delete year"}
                  </Button>
                </div>
              </form>
            </TabsContent>
            <TabsContent value="officers">
              <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
                <form onSubmit={rosterEntryForm.handleSubmit(handleCreateEntry)} className="panel space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Officer Setup</p>
                    <h3 className="mt-2 text-2xl font-semibold text-brand-green">
                      Add officers for {selectedRoster.school_year}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <Label>Officer</Label>
                    <Select value={rosterEntryForm.watch("user_id")} onValueChange={(value) => rosterEntryForm.setValue("user_id", value)}>
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
                    <Label htmlFor="new-position-title">Position title</Label>
                    <Input id="new-position-title" {...rosterEntryForm.register("position_title")} />
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Rank</Label>
                      <Select
                        value={rosterEntryForm.watch("rank_id") || NO_RANK_VALUE}
                        onValueChange={(value) => rosterEntryForm.setValue("rank_id", value === NO_RANK_VALUE ? "" : value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Optional rank" />
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
                        value={rosterEntryForm.watch("committee_id") || NO_COMMITTEE_VALUE}
                        onValueChange={(value) =>
                          rosterEntryForm.setValue("committee_id", value === NO_COMMITTEE_VALUE ? "" : value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Optional committee" />
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
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-officer-order">Display order</Label>
                    <Input id="new-officer-order" type="number" min={0} {...rosterEntryForm.register("order_index")} />
                  </div>
                  <div className="space-y-3 rounded-[1.35rem] border border-brand-green/10 bg-brand-green/[0.03] p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                        <ImagePlus className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-brand-green">Officer photo</p>
                        <p className="text-sm text-muted-foreground">
                          Upload a year-specific portrait or paste a direct image URL.
                        </p>
                      </div>
                    </div>
                    <Input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="cursor-pointer file:mr-3 file:rounded-full file:border-0 file:bg-brand-green file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
                      onChange={(event) => void handleNewEntryPhoto(event.target.files?.[0])}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="new-photo-url">Photo URL</Label>
                      <Input id="new-photo-url" {...rosterEntryForm.register("photo_url")} />
                    </div>
                    {uploadingNewPhoto ? <p className="text-xs text-muted-foreground">Uploading photo...</p> : null}
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={creatingEntry}>
                    <Plus className="h-4 w-4" />
                    {creatingEntry ? "Adding officer..." : "Add officer to roster"}
                  </Button>
                </form>
                <div className="grid gap-4">
                  {savingEntryOrder ? (
                    <p className="text-xs font-semibold text-brand-orange">Saving officer order...</p>
                  ) : null}
                  {selectedRosterEntries.map((entry) => (
                    <div
                      key={entry.id}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={(event) => void handleEntryDrop(entry.id, event)}
                      className={cn(draggedEntryId === entry.id ? "opacity-60" : "")}
                    >
                      <button
                        type="button"
                        draggable
                        onDragStart={(event) => {
                          setDraggedEntryId(entry.id);
                          event.dataTransfer.effectAllowed = "move";
                        }}
                        onDragEnd={() => setDraggedEntryId(null)}
                        className="mb-2 flex cursor-grab items-center gap-2 rounded-full border border-brand-green/10 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-green shadow-sm active:cursor-grabbing"
                      >
                        <GripVertical className="h-4 w-4" />
                        Drag card
                      </button>
                      <RosterEntryCardEditor
                        entry={entry}
                        users={users}
                        ranks={ranks}
                        committees={committees}
                        onSaved={(updatedEntry) =>
                          setEntries((current) =>
                            current.map((currentEntry) =>
                              currentEntry.id === updatedEntry.id ? updatedEntry : currentEntry,
                            ),
                          )
                        }
                        onDeleted={(entryId) =>
                          setEntries((current) => current.filter((currentEntry) => currentEntry.id !== entryId))
                        }
                      />
                    </div>
                  ))}
                  {!selectedRosterEntries.length ? (
                    <div className="rounded-[1.5rem] border border-dashed border-brand-green/15 px-4 py-8 text-sm text-muted-foreground">
                      No officers added for this year yet.
                    </div>
                  ) : null}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="projects">
              <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
                <form onSubmit={highlightForm.handleSubmit(handleCreateHighlight)} className="panel space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Major Projects</p>
                    <h3 className="mt-2 text-2xl font-semibold text-brand-green">
                      Highlight the biggest projects or events
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legacy-project-title">Title</Label>
                    <Input id="legacy-project-title" {...highlightForm.register("title")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legacy-project-description">Description</Label>
                    <Textarea id="legacy-project-description" {...highlightForm.register("description")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="legacy-project-order">Display order</Label>
                    <Input id="legacy-project-order" type="number" min={0} {...highlightForm.register("order_index")} />
                  </div>
                  <Button type="submit" className="w-full gap-2" disabled={creatingHighlight}>
                    <Plus className="h-4 w-4" />
                    {creatingHighlight ? "Adding highlight..." : "Add project highlight"}
                  </Button>
                </form>
                <div className="grid gap-4">
                  {selectedHighlights.map((highlight) => (
                    <LegacyHighlightEditorCard
                      key={highlight.id}
                      highlight={highlight}
                      onSaved={(updatedHighlight) =>
                        setHighlights((current) =>
                          current.map((currentHighlight) =>
                            currentHighlight.id === updatedHighlight.id
                              ? updatedHighlight
                              : currentHighlight,
                          ),
                        )
                      }
                      onDeleted={(highlightId) =>
                        setHighlights((current) =>
                          current.filter((currentHighlight) => currentHighlight.id !== highlightId),
                        )
                      }
                    />
                  ))}
                  {!selectedHighlights.length ? (
                    <div className="rounded-[1.5rem] border border-dashed border-brand-green/15 px-4 py-8 text-sm text-muted-foreground">
                      No project highlights have been published for this year yet.
                    </div>
                  ) : null}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="panel text-sm text-muted-foreground">
            Create a legacy year from the left panel to start building the archive.
          </div>
        )}
      </section>
    </div>
  );
}

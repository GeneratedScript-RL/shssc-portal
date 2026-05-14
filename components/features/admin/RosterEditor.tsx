"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Plus, Save } from "lucide-react";
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

export default function RosterEditor({
  rosters: initialRosters,
  entries: initialEntries,
  highlights: initialHighlights,
  users,
  ranks,
  committees,
}: RosterEditorProps) {
  const [rosters, setRosters] = useState(initialRosters);
  const [entries, setEntries] = useState(initialEntries);
  const [highlights, setHighlights] = useState(initialHighlights);
  const [selectedRosterId, setSelectedRosterId] = useState(initialRosters[0]?.id ?? "");
  const [creatingYear, setCreatingYear] = useState(false);
  const [creatingEntry, setCreatingEntry] = useState(false);
  const [creatingHighlight, setCreatingHighlight] = useState(false);
  const [uploadingNewPhoto, setUploadingNewPhoto] = useState(false);

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
    try {
      const response = await fetch("/api/roster/years", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
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

          return [payload.roster, ...next].sort((left, right) =>
            right.school_year.localeCompare(left.school_year),
          );
        });
        setSelectedRosterId(payload.roster.id);
        createYearForm.reset({ school_year: "", is_active: false });
      }
    } finally {
      setCreatingYear(false);
    }
  }

  async function handleUpdateYear(values: z.infer<typeof rosterYearSchema>) {
    if (!selectedRoster) {
      return;
    }

    const response = await fetch(`/api/roster/years/${selectedRoster.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        school_year: values.school_year,
        is_active: values.is_active,
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
          .sort((left, right) => right.school_year.localeCompare(left.school_year)),
      );
    }
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
        </div>
        <div className="grid gap-3">
          {rosters.map((roster) => (
            <button
              key={roster.id}
              type="button"
              onClick={() => setSelectedRosterId(roster.id)}
              className={cn(
                "rounded-[1.35rem] border px-4 py-4 text-left transition",
                selectedRosterId === roster.id
                  ? "border-brand-green bg-brand-green text-white shadow-sm"
                  : "border-brand-green/10 bg-white hover:border-brand-green/25",
              )}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">{roster.school_year}</p>
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
                <Button type="submit" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save year details
                </Button>
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
                  {selectedRosterEntries.map((entry) => (
                    <RosterEntryCardEditor
                      key={entry.id}
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

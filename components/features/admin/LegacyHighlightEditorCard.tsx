"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, Trash2 } from "lucide-react";
import type { LegacyHighlightRecord } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const legacyHighlightSchema = z.object({
  roster_id: z.string().uuid(),
  title: z.string().min(2),
  description: z.string().min(8),
  order_index: z.coerce.number().int().min(0).default(0),
});

interface LegacyHighlightEditorCardProps {
  highlight: LegacyHighlightRecord;
  onSaved: (highlight: LegacyHighlightRecord) => void;
  onDeleted: (highlightId: string) => void;
}

export default function LegacyHighlightEditorCard({
  highlight,
  onSaved,
  onDeleted,
}: LegacyHighlightEditorCardProps) {
  const form = useForm<z.infer<typeof legacyHighlightSchema>>({
    resolver: zodResolver(legacyHighlightSchema),
    defaultValues: {
      roster_id: highlight.roster_id,
      title: highlight.title,
      description: highlight.description,
      order_index: highlight.order_index,
    },
  });

  useEffect(() => {
    form.reset({
      roster_id: highlight.roster_id,
      title: highlight.title,
      description: highlight.description,
      order_index: highlight.order_index,
    });
  }, [form, highlight]);

  async function onSubmit(values: z.infer<typeof legacyHighlightSchema>) {
    const response = await fetch(`/api/roster/highlights/${highlight.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = await response.json().catch(() => null);

    if (response.ok && payload?.highlight) {
      onSaved({ ...payload.highlight, school_year: highlight.school_year });
    }
  }

  async function handleDelete() {
    const response = await fetch(`/api/roster/highlights/${highlight.id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      onDeleted(highlight.id);
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="rounded-[1.5rem] border border-brand-green/10 bg-white p-4 shadow-sm"
    >
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor={`highlight-title-${highlight.id}`}>Project or event title</Label>
          <Input id={`highlight-title-${highlight.id}`} {...form.register("title")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`highlight-description-${highlight.id}`}>Description</Label>
          <Textarea id={`highlight-description-${highlight.id}`} {...form.register("description")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`highlight-order-${highlight.id}`}>Display order</Label>
          <Input
            id={`highlight-order-${highlight.id}`}
            type="number"
            min={0}
            {...form.register("order_index")}
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Save highlight
          </Button>
          <Button type="button" variant="destructive" className="gap-2" onClick={() => void handleDelete()}>
            <Trash2 className="h-4 w-4" />
            Remove
          </Button>
        </div>
      </div>
    </form>
  );
}

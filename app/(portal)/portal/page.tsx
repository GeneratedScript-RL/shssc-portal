"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const portalSchema = z.object({
  submission_type: z.enum(["concern", "suggestion", "complaint", "feedback"]),
  subject: z.string().min(4),
  body: z.string().min(16),
  is_anonymous: z.boolean().default(false),
  is_public: z.boolean().default(false),
});

interface SuggestionItem {
  id: string;
  subject: string;
  status: string;
  upvotes: number;
}

export default function PortalPage() {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
  const form = useForm<z.infer<typeof portalSchema>>({
    resolver: zodResolver(portalSchema),
    defaultValues: {
      submission_type: "concern",
      subject: "",
      body: "",
      is_anonymous: false,
      is_public: false,
    },
  });

  useEffect(() => {
    void fetch("/api/suggestions")
      .then((response) => response.json())
      .then((data) => setSuggestions(data.suggestions ?? []))
      .catch(() => setSuggestions([]));
  }, []);

  async function onSubmit(values: z.infer<typeof portalSchema>) {
    setStatus("saving");
    const response = await fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      form.reset();
      setStatus("success");
      return;
    }

    setStatus("error");
  }

  async function upvote(id: string) {
    const response = await fetch(`/api/suggestions/${id}/upvote`, { method: "POST" });
    if (response.ok) {
      setSuggestions((current) =>
        current.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item)),
      );
    }
  }

  return (
    <div className="container grid gap-8 py-10 xl:grid-cols-[0.85fr_1.15fr]">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Student Portal</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Submit a concern, suggestion, complaint, or feedback.</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Choose whether to remain anonymous, and optionally make suggestions visible on the public
          tracker so other students can support them with upvotes.
        </p>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div className="space-y-2">
            <Label>Submission type</Label>
            <Select
              value={form.watch("submission_type")}
              onValueChange={(value) => form.setValue("submission_type", value as z.infer<typeof portalSchema>["submission_type"])}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="concern">Concern</SelectItem>
                <SelectItem value="suggestion">Suggestion</SelectItem>
                <SelectItem value="complaint">Complaint</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="portal-subject">Subject</Label>
            <Input id="portal-subject" {...form.register("subject")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="portal-body">Details</Label>
            <Textarea id="portal-body" {...form.register("body")} />
          </div>
          <label className="flex items-center gap-3 rounded-2xl border border-brand-green/10 px-4 py-3">
            <Checkbox checked={form.watch("is_anonymous")} onCheckedChange={(value) => form.setValue("is_anonymous", !!value)} />
            <span className="text-sm text-brand-green">Submit anonymously</span>
          </label>
          {form.watch("submission_type") === "suggestion" ? (
            <label className="flex items-center gap-3 rounded-2xl border border-brand-green/10 px-4 py-3">
              <Checkbox checked={form.watch("is_public")} onCheckedChange={(value) => form.setValue("is_public", !!value)} />
              <span className="text-sm text-brand-green">Display on the public suggestion tracker</span>
            </label>
          ) : null}
          <Button type="submit">
            {status === "saving" ? "Submitting..." : status === "success" ? "Submitted" : "Send to council"}
          </Button>
        </form>
      </section>
      <section className="panel">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Suggestion Tracker</p>
            <h2 className="mt-2 text-2xl font-semibold text-brand-green">Active public suggestions</h2>
          </div>
          <Button asChild variant="outline">
            <a href="/portal/tracker">Open tracker</a>
          </Button>
        </div>
        <div className="mt-6 grid gap-3">
          {suggestions.map((suggestion) => (
            <article key={suggestion.id} className="rounded-2xl border border-brand-green/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <Badge variant="outline">{suggestion.status}</Badge>
                <Button variant="ghost" onClick={() => upvote(suggestion.id)}>
                  Upvote {suggestion.upvotes}
                </Button>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-brand-green">{suggestion.subject}</h3>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

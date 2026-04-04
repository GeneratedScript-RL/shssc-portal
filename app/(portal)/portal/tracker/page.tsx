"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SuggestionItem {
  id: string;
  subject: string;
  status: string;
  upvotes: number;
}

export default function PortalTrackerPage() {
  const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);

  async function loadSuggestions() {
    try {
      const response = await fetch("/api/suggestions", { cache: "no-store" });
      const data = await response.json();
      setSuggestions(data.suggestions ?? []);
    } catch {
      setSuggestions([]);
    }
  }

  useEffect(() => {
    void loadSuggestions();
  }, []);

  async function upvote(id: string) {
    const response = await fetch(`/api/suggestions/${id}/upvote`, { method: "POST" });
    if (response.ok) {
      setSuggestions((current) =>
        current.map((item) => (item.id === id ? { ...item, upvotes: item.upvotes + 1 } : item)),
      );
    }
  }

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Suggestion Tracker</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Public ideas students can rally behind.</h1>
      </section>
      <div className="grid gap-4">
        {suggestions.map((suggestion) => (
          <article key={suggestion.id} className="panel">
            <div className="flex items-center justify-between gap-3">
              <div>
                <Badge variant="outline">{suggestion.status}</Badge>
                <h2 className="mt-4 text-2xl font-semibold text-brand-green">{suggestion.subject}</h2>
              </div>
              <Button onClick={() => upvote(suggestion.id)}>Upvote {suggestion.upvotes}</Button>
            </div>
          </article>
        ))}
        {!suggestions.length ? (
          <div className="panel text-sm text-muted-foreground">
            No public suggestions have been shared yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}

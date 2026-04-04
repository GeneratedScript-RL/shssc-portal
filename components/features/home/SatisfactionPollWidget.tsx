"use client";

import { useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Line, LineChart, ResponsiveContainer } from "recharts";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PollRecord } from "@/types";

const satisfactionSchema = z.object({
  option_id: z.string().uuid(),
});

interface SatisfactionPollWidgetProps {
  poll: PollRecord | null;
  historicalAverages: Array<{ month: string; average: number }>;
}

export default function SatisfactionPollWidget({
  poll,
  historicalAverages,
}: SatisfactionPollWidgetProps) {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<z.infer<typeof satisfactionSchema>>({
    resolver: zodResolver(satisfactionSchema),
  });

  const stars = useMemo(
    () =>
      (poll?.options ?? [])
        .filter((option) => /^\d+$/.test(option.label))
        .sort((a, b) => Number(a.label) - Number(b.label)),
    [poll?.options],
  );

  async function onSubmit(values: z.infer<typeof satisfactionSchema>) {
    if (!poll) {
      return;
    }

    const response = await fetch(`/api/polls/${poll.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ option_ids: [values.option_id] }),
    });

    if (response.ok) {
      setSubmitted(true);
      form.reset();
    }
  }

  return (
    <section className="panel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">
            Satisfaction Poll
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-brand-green">
            Student pulse snapshot
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Vote from 1 to 5 stars when a satisfaction poll is open, then compare trends month to
            month.
          </p>
        </div>
        <Badge>{historicalAverages.length} months</Badge>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[1.5rem] border border-brand-green/10 bg-brand-green/[0.03] p-4">
          {poll ? (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <h4 className="text-lg font-semibold text-brand-green">{poll.title}</h4>
              <div className="flex flex-wrap gap-3">
                {stars.map((option, index) => (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={`Rate ${index + 1} stars`}
                    className={`touch-target rounded-2xl border px-4 py-3 transition ${
                      form.watch("option_id") === option.id
                        ? "border-brand-yellow bg-brand-yellow/25 text-brand-green"
                        : "border-brand-green/15 bg-white text-brand-green/70"
                    }`}
                    onClick={() => form.setValue("option_id", option.id)}
                  >
                    <div className="flex gap-1">
                      {Array.from({ length: Number(option.label) }).map((_, starIndex) => (
                        <Star key={`${option.id}-${starIndex}`} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
              <Button type="submit" disabled={submitted || form.formState.isSubmitting}>
                {submitted ? "Vote submitted" : "Submit rating"}
              </Button>
            </form>
          ) : (
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-brand-green">No open poll right now</h4>
              <p className="text-sm text-muted-foreground">
                The monthly trend chart still stays live so the council can compare previous
                satisfaction scores.
              </p>
            </div>
          )}
        </div>
        <div className="h-44 rounded-[1.5rem] border border-brand-green/10 bg-white p-3">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalAverages}>
              <Line
                type="monotone"
                dataKey="average"
                stroke="#2D7D32"
                strokeWidth={3}
                dot={{ r: 2, fill: "#F5C400" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}

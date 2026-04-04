"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { PollRecord, Tables } from "@/types";

const voteSchema = z.object({
  option_ids: z.array(z.string().uuid()).min(1, "Select at least one option."),
});

interface PollVoteFormProps {
  poll: PollRecord;
}

export default function PollVoteForm({ poll }: PollVoteFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof voteSchema>>({
    resolver: zodResolver(voteSchema),
    defaultValues: { option_ids: [] },
  });

  function toggleOption(optionId: string, checked: boolean) {
    const current = form.getValues("option_ids");
    if (poll.poll_type === "single") {
      form.setValue("option_ids", checked ? [optionId] : []);
      return;
    }

    form.setValue(
      "option_ids",
      checked ? [...current, optionId] : current.filter((value) => value !== optionId),
    );
  }

  async function onSubmit(values: z.infer<typeof voteSchema>) {
    setStatus("saving");
    setMessage(null);
    const response = await fetch(`/api/polls/${poll.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error ?? "Unable to submit your vote.");
      return;
    }

    setStatus("success");
    setMessage(payload?.message ?? "Vote recorded.");
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {(poll.options ?? []).map((option: Tables<"poll_options">) => {
        const checked = form.watch("option_ids").includes(option.id);
        return (
          <label
            key={option.id}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-brand-green/10 bg-white px-4 py-3"
          >
            <Checkbox checked={checked} onCheckedChange={(value) => toggleOption(option.id, !!value)} />
            <div>
              <Label className="cursor-pointer">{option.label}</Label>
            </div>
          </label>
        );
      })}
      <p className="text-sm text-red-600">{form.formState.errors.option_ids?.message}</p>
      {message ? (
        <p className={status === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
          {message}
        </p>
      ) : null}
      <Button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Submitting vote..." : status === "success" ? "Vote recorded" : "Submit vote"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const questionSchema = z.object({
  body: z.string().min(8, "Please write a full question."),
  is_anonymous: z.boolean().default(false),
});

interface QuestionSubmitFormProps {
  sessionId: string;
}

export default function QuestionSubmitForm({ sessionId }: QuestionSubmitFormProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      body: "",
      is_anonymous: false,
    },
  });

  async function onSubmit(values: z.infer<typeof questionSchema>) {
    setStatus("saving");
    const response = await fetch(`/api/ask/${sessionId}/questions`, {
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

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ask-body">Question</Label>
        <Textarea id="ask-body" {...form.register("body")} />
        <p className="text-sm text-red-600">{form.formState.errors.body?.message}</p>
      </div>
      <label className="flex items-center gap-3 rounded-2xl border border-brand-green/10 bg-brand-green/[0.03] px-4 py-3">
        <Checkbox
          checked={form.watch("is_anonymous")}
          onCheckedChange={(value) => form.setValue("is_anonymous", !!value)}
        />
        <span className="text-sm text-brand-green">Submit anonymously</span>
      </label>
      <Button type="submit" disabled={status === "saving"}>
        {status === "saving"
          ? "Sending..."
          : status === "success"
            ? "Question submitted"
            : "Submit question"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JSONContent } from "@tiptap/react";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const threadSchema = z.object({
  title: z.string().min(4, "Thread titles must be at least 4 characters."),
  body: z.custom<JSONContent>(),
});

interface ThreadComposerProps {
  channelId: string;
  channelSlug: string;
}

const defaultBody: JSONContent = {
  type: "doc",
  content: [{ type: "paragraph" }],
};

export default function ThreadComposer({ channelId, channelSlug }: ThreadComposerProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<z.infer<typeof threadSchema>>({
    resolver: zodResolver(threadSchema),
    defaultValues: {
      title: "",
      body: defaultBody,
    },
  });

  async function onSubmit(values: z.infer<typeof threadSchema>) {
    setStatus("saving");
    setMessage(null);

    const response = await fetch("/api/forums/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        channel_id: channelId,
        title: values.title,
        body: values.body,
      }),
    });

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error ?? "Unable to create a new thread right now.");
      return;
    }

    form.reset({
      title: "",
      body: defaultBody,
    });
    router.push(`/forums/${channelSlug}/${payload.thread.id}`);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="thread-title">Thread title</Label>
        <Input
          id="thread-title"
          placeholder="What would you like to discuss?"
          {...form.register("title")}
        />
      </div>
      <RichTextEditor
        value={form.watch("body")}
        onChange={(value) => form.setValue("body", value)}
        placeholder="Share the details, context, or suggestion here..."
      />
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
      <Button type="submit" disabled={status === "saving"}>
        {status === "saving" ? "Posting thread..." : "Post thread"}
      </Button>
    </form>
  );
}

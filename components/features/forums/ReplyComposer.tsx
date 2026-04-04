"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { JSONContent } from "@tiptap/react";
import RichTextEditor from "@/components/shared/RichTextEditor";
import { Button } from "@/components/ui/button";

const replySchema = z.object({
  body: z.custom<JSONContent>(),
});

interface ReplyComposerProps {
  threadId: string;
  disabled?: boolean;
}

export default function ReplyComposer({ threadId, disabled }: ReplyComposerProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      body: {
        type: "doc",
        content: [{ type: "paragraph" }],
      },
    },
  });

  async function onSubmit(values: z.infer<typeof replySchema>) {
    setStatus("saving");
    const response = await fetch("/api/forums/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thread_id: threadId,
        body: values.body,
      }),
    });

    setStatus(response.ok ? "success" : "error");
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <RichTextEditor value={form.watch("body")} onChange={(value) => form.setValue("body", value)} />
      <Button type="submit" disabled={disabled || status === "saving"}>
        {disabled ? "Thread locked" : status === "saving" ? "Posting reply..." : "Post reply"}
      </Button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
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
    setMessage(null);
    const response = await fetch("/api/forums/replies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thread_id: threadId,
        body: values.body,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setStatus("error");
      setMessage(payload?.error ?? "Unable to post reply right now.");
      return;
    }

    setStatus("success");
    setMessage("Reply posted.");
    form.reset({
      body: {
        type: "doc",
        content: [{ type: "paragraph" }],
      },
    });
    router.refresh();
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <RichTextEditor value={form.watch("body")} onChange={(value) => form.setValue("body", value)} />
      {message ? (
        <p className={status === "error" ? "text-sm text-destructive" : "text-sm text-muted-foreground"}>
          {message}
        </p>
      ) : null}
      <Button type="submit" disabled={disabled || status === "saving"}>
        {disabled ? "Thread locked" : status === "saving" ? "Posting reply..." : "Post reply"}
      </Button>
    </form>
  );
}

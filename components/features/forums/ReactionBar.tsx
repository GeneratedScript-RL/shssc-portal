"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const emojis = ["👍", "🎉", "💡", "🔥"];

interface ReactionBarProps {
  targetType: "thread" | "reply";
  targetId: string;
  reactions: Record<string, number>;
}

export default function ReactionBar({ targetType, targetId, reactions }: ReactionBarProps) {
  const [counts, setCounts] = useState(reactions);

  async function react(emoji: string) {
    const endpoint = targetType === "thread" ? "/api/forums/threads" : "/api/forums/replies";
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "react",
        target_type: targetType,
        target_id: targetId,
        emoji,
      }),
    });

    if (response.ok) {
      setCounts((current) => ({ ...current, [emoji]: (current[emoji] ?? 0) + 1 }));
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {emojis.map((emoji) => (
        <Button key={emoji} type="button" variant="outline" size="sm" onClick={() => react(emoji)}>
          {emoji} {counts[emoji] ?? 0}
        </Button>
      ))}
    </div>
  );
}

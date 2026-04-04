"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type ModerationAction = "pin" | "lock" | "delete";

interface ForumModerationControlsProps {
  targetType: "thread" | "reply";
  targetId: string;
  redirectHref?: string;
  isPinned?: boolean;
  isLocked?: boolean;
}

export default function ForumModerationControls({
  targetType,
  targetId,
  redirectHref,
  isPinned = false,
  isLocked = false,
}: ForumModerationControlsProps) {
  const router = useRouter();
  const [pendingAction, setPendingAction] = useState<ModerationAction | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleAction(action: ModerationAction) {
    if (
      action === "delete" &&
      !window.confirm(
        targetType === "thread"
          ? "Delete this thread and all of its replies?"
          : "Delete this reply?",
      )
    ) {
      return;
    }

    setPendingAction(action);
    setMessage(null);

    const response = await fetch(
      targetType === "thread" ? "/api/forums/threads" : "/api/forums/replies",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          target_type: targetType,
          target_id: targetId,
        }),
      },
    );
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      setMessage(payload?.error ?? "Unable to update this forum item right now.");
      setPendingAction(null);
      return;
    }

    setPendingAction(null);

    if (action === "delete" && redirectHref) {
      router.push(redirectHref);
      router.refresh();
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <div className="flex flex-wrap gap-2">
        {targetType === "thread" ? (
          <>
            <Button
              type="button"
              variant="outline"
              disabled={pendingAction !== null || isPinned}
              onClick={() => void handleAction("pin")}
            >
              {pendingAction === "pin" ? "Pinning..." : isPinned ? "Pinned" : "Pin"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={pendingAction !== null || isLocked}
              onClick={() => void handleAction("lock")}
            >
              {pendingAction === "lock" ? "Locking..." : isLocked ? "Locked" : "Lock"}
            </Button>
          </>
        ) : null}
        <Button
          type="button"
          variant="destructive"
          size={targetType === "reply" ? "sm" : "default"}
          disabled={pendingAction !== null}
          onClick={() => void handleAction("delete")}
        >
          {pendingAction === "delete" ? "Deleting..." : "Delete"}
        </Button>
      </div>
      {message ? <p className="text-sm text-destructive">{message}</p> : null}
    </div>
  );
}

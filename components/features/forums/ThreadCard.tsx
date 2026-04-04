import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import UserBadge from "@/components/shared/UserBadge";
import { formatDate } from "@/lib/utils/formatDate";
import type { ForumThreadRecord } from "@/types";

interface ThreadCardProps {
  thread: ForumThreadRecord;
  channelSlug: string;
}

export default function ThreadCard({ thread, channelSlug }: ThreadCardProps) {
  return (
    <Link href={`/forums/${channelSlug}/${thread.id}`} className="forum-card block">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {thread.is_pinned ? <Badge>Pinned</Badge> : null}
            {thread.is_locked ? <Badge variant="warning">Locked</Badge> : null}
          </div>
          <h3 className="text-xl font-semibold text-brand-green">{thread.title}</h3>
          <UserBadge userId={thread.author_id} size="sm" />
        </div>
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-right">
          <p>{thread.reply_count} replies</p>
          <p>{formatDate(thread.last_reply_at, "MMM d, p")}</p>
        </div>
      </div>
    </Link>
  );
}

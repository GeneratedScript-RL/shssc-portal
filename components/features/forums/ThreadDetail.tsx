import { Badge } from "@/components/ui/badge";
import RichTextRenderer from "@/components/shared/RichTextRenderer";
import UserBadge from "@/components/shared/UserBadge";
import ReactionBar from "@/components/features/forums/ReactionBar";
import ReplyComposer from "@/components/features/forums/ReplyComposer";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/types";
import { formatDate } from "@/lib/utils/formatDate";

interface ThreadDetailProps {
  thread: Tables<"forum_threads">;
  replies: Tables<"forum_replies">[];
  canReply: boolean;
  canModerate: boolean;
}

export default function ThreadDetail({
  thread,
  replies,
  canReply,
  canModerate,
}: ThreadDetailProps) {
  return (
    <div className="space-y-6">
      <article className="panel">
        <div className="flex flex-wrap items-center gap-3">
          {thread.is_pinned ? <Badge>Pinned</Badge> : null}
          {thread.is_locked ? <Badge variant="warning">Locked</Badge> : null}
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {formatDate(thread.created_at, "PPP p")}
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-semibold text-brand-green">{thread.title}</h1>
        <div className="mt-4">
          <UserBadge userId={thread.author_id} />
        </div>
        <RichTextRenderer className="mt-6" content={thread.body as never} />
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <ReactionBar targetType="thread" targetId={thread.id} reactions={{}} />
          {canModerate ? (
            <div className="flex gap-2">
              <Button type="button" variant="outline">
                Pin
              </Button>
              <Button type="button" variant="outline">
                Lock
              </Button>
              <Button type="button" variant="destructive">
                Delete
              </Button>
            </div>
          ) : null}
        </div>
      </article>
      <section className="space-y-4">
        {replies.map((reply) => (
          <article key={reply.id} className="panel">
            <div className="flex items-center justify-between gap-3">
              <UserBadge userId={reply.author_id} size="sm" />
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {formatDate(reply.created_at, "PPP p")}
              </span>
            </div>
            <div className="mt-4">
              {reply.is_deleted ? (
                <p className="italic text-muted-foreground">[deleted]</p>
              ) : (
                <RichTextRenderer content={reply.body as never} />
              )}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <ReactionBar targetType="reply" targetId={reply.id} reactions={{}} />
              {canModerate ? (
                <Button type="button" variant="destructive" size="sm">
                  Delete
                </Button>
              ) : null}
            </div>
          </article>
        ))}
      </section>
      {canReply ? (
        <section className="panel">
          <h2 className="text-xl font-semibold text-brand-green">Reply to thread</h2>
          <div className="mt-4">
            <ReplyComposer threadId={thread.id} disabled={thread.is_locked} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

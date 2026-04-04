import Link from "next/link";
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
  replyHint?: string | null;
  replyLoginHref?: string;
}

export default function ThreadDetail({
  thread,
  replies,
  canReply,
  canModerate,
  replyHint,
  replyLoginHref,
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
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <ReactionBar targetType="thread" targetId={thread.id} reactions={{}} />
          {canModerate ? (
            <div className="flex flex-wrap gap-2">
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
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
      ) : replyHint ? (
        <section className="panel space-y-4">
          <h2 className="text-xl font-semibold text-brand-green">Reply to thread</h2>
          <p className="text-sm text-muted-foreground">{replyHint}</p>
          {replyLoginHref && replyHint.includes("Sign in") ? (
            <Button asChild>
              <Link href={replyLoginHref}>Sign in to reply</Link>
            </Button>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}

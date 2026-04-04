import { notFound } from "next/navigation";
import ThreadDetail from "@/components/features/forums/ThreadDetail";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { getCurrentUserContext } from "@/lib/auth/getCurrentUserContext";
import { getForumChannelAccess } from "@/lib/auth/forumAccess";
import { getForumChannelBySlug, getForumReplies, getForumThread } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function ForumThreadPage({
  params,
}: {
  params: { channel: string; thread: string };
}) {
  const [channel, thread, replies, context] = await Promise.all([
    getForumChannelBySlug(params.channel),
    getForumThread(params.thread),
    getForumReplies(params.thread),
    getCurrentUserContext(),
  ]);

  if (!channel || !thread || thread.channel_id !== channel.id) {
    notFound();
  }

  const access = await getForumChannelAccess(channel, context);
  if (!access.canView) {
    notFound();
  }

  const replyHint = !context.user
    ? "Sign in to reply to this thread."
    : thread.is_locked
      ? "This thread is currently locked."
      : channel.is_locked
        ? "This channel is currently locked."
        : "Your current access level cannot reply in this channel.";

  return (
    <div className="container py-10">
      <ThreadDetail
        thread={thread}
        replies={replies}
        canReply={access.canPost && !thread.is_locked}
        canModerate={
          context.isSysadmin || context.permissions.includes(PERMISSIONS.MODERATE_FORUMS)
        }
        replyHint={access.canPost && !thread.is_locked ? null : replyHint}
        replyLoginHref={`/auth/login?redirectedFrom=/forums/${channel.slug}/${thread.id}`}
      />
    </div>
  );
}

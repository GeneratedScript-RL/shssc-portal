import { notFound } from "next/navigation";
import ThreadDetail from "@/components/features/forums/ThreadDetail";
import { getForumChannelBySlug, getForumReplies, getForumThread } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function ForumThreadPage({
  params,
}: {
  params: { channel: string; thread: string };
}) {
  const [channel, thread, replies] = await Promise.all([
    getForumChannelBySlug(params.channel),
    getForumThread(params.thread),
    getForumReplies(params.thread),
  ]);

  if (!channel || !thread) {
    notFound();
  }

  return (
    <div className="container py-10">
      <ThreadDetail
        thread={thread}
        replies={replies}
        canReply={!channel.is_locked && !thread.is_locked}
        canModerate={false}
      />
    </div>
  );
}

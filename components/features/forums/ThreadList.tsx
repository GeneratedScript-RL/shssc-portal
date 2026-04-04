import type { ForumThreadRecord } from "@/types";
import ThreadCard from "@/components/features/forums/ThreadCard";

interface ThreadListProps {
  threads: ForumThreadRecord[];
  channelSlug: string;
}

export default function ThreadList({ threads, channelSlug }: ThreadListProps) {
  return (
    <div className="space-y-4">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} channelSlug={channelSlug} />
      ))}
    </div>
  );
}

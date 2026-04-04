import Link from "next/link";
import { Hash } from "lucide-react";
import { formatDate } from "@/lib/utils/formatDate";
import type { ForumChannelRecord } from "@/types";

interface ChannelListProps {
  channels: ForumChannelRecord[];
}

export default function ChannelList({ channels }: ChannelListProps) {
  return (
    <div className="grid gap-4">
      {channels.map((channel) => (
        <Link key={channel.id} href={`/forums/${channel.slug}`} className="forum-card">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-4">
              <div className="mt-1 rounded-2xl bg-brand-green/10 p-3 text-brand-green">
                <Hash className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-brand-green">{channel.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{channel.description}</p>
              </div>
            </div>
            <div className="text-right text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              <p>{channel.thread_count ?? 0} threads</p>
              <p>{channel.last_activity ? formatDate(channel.last_activity, "MMM d") : "Quiet"}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

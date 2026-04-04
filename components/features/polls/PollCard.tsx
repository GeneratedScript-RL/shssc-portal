import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import type { PollRecord } from "@/types";
import { formatDate } from "@/lib/utils/formatDate";

interface PollCardProps {
  poll: PollRecord;
}

export default function PollCard({ poll }: PollCardProps) {
  const open = !poll.closes_at || new Date(poll.closes_at) > new Date();

  return (
    <Link href={`/vote/${poll.id}`} className="forum-card flex flex-col">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <Badge variant={open ? "default" : "warning"}>{open ? "Open" : "Closed"}</Badge>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {poll.closes_at ? `Closes ${formatDate(poll.closes_at, "MMM d")}` : "No close date"}
        </span>
      </div>
      <h3 className="mt-4 text-xl font-semibold text-brand-green">{poll.title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{poll.description}</p>
      <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">
        <span>{poll.poll_type}</span>
        {poll.is_anonymous ? <span>Anonymous</span> : null}
        {poll.is_satisfaction_poll ? <span>Satisfaction</span> : null}
      </div>
    </Link>
  );
}

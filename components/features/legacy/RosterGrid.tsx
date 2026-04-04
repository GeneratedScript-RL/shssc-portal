import UserBadge from "@/components/shared/UserBadge";
import RankChip from "@/components/shared/RankChip";
import type { Tables } from "@/types";

interface RosterGridProps {
  entries: Array<
    Tables<"officer_roster_entries"> & {
      rank?: Pick<Tables<"ranks">, "name" | "color_hex"> | null;
    }
  >;
}

export default function RosterGrid({ entries }: RosterGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {entries.map((entry) => (
        <div key={entry.id} className="forum-card">
          <UserBadge userId={entry.user_id} size="lg" />
          <p className="mt-4 text-lg font-semibold text-brand-green">{entry.position_title}</p>
          {entry.rank ? (
            <div className="mt-3">
              <RankChip rank={entry.rank} />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

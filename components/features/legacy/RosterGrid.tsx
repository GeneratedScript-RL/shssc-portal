import Image from "next/image";
import AwardEmblem from "@/components/shared/AwardEmblem";
import RankChip from "@/components/shared/RankChip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { LegacyRosterEntryRecord } from "@/types";

interface RosterGridProps {
  entries: LegacyRosterEntryRecord[];
}

function getInitials(name: string | undefined) {
  return (name ?? "SH")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function RosterGrid({ entries }: RosterGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {entries.map((entry) => (
        <article key={entry.id} className="forum-card overflow-hidden">
          <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-brand-green/[0.04]">
            {entry.photo_url || entry.user?.avatar_url ? (
              <Image
                src={entry.photo_url || entry.user?.avatar_url || ""}
                alt={`${entry.user?.full_name ?? entry.position_title} portrait`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="text-xl">
                    {getInitials(entry.user?.full_name)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-orange">
            {String(entry.order_index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-2 text-xl font-semibold text-brand-green">
            {entry.user?.full_name ?? "Unknown officer"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{entry.position_title}</p>
          {entry.rank ? (
            <div className="mt-3">
              <RankChip rank={entry.rank} />
            </div>
          ) : null}
          {entry.awards?.length ? (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {entry.awards.map((award) => (
                <AwardEmblem key={`${entry.id}-${award.id}`} award={award} />
              ))}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}

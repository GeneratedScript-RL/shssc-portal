import AwardEmblem from "@/components/shared/AwardEmblem";
import RankChip from "@/components/shared/RankChip";
import type { LegacyRosterEntryRecord } from "@/types";

interface RecognitionListProps {
  entries: LegacyRosterEntryRecord[];
}

export default function RecognitionList({ entries }: RecognitionListProps) {
  const recognizedEntries = entries.filter((entry) => (entry.awards ?? []).length > 0);

  if (!recognizedEntries.length) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-brand-green/15 px-4 py-8 text-sm text-muted-foreground">
        No awards or recognitions have been recorded for this roster yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {recognizedEntries.map((entry) => (
        <article key={entry.id} className="panel">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-brand-green">
                {entry.user?.full_name ?? "Unknown officer"}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">{entry.position_title}</p>
            </div>
            {entry.rank ? <RankChip rank={entry.rank} /> : null}
          </div>
          <div className="mt-5 space-y-3">
            {(entry.awards ?? []).map((award) => (
              <div key={`${entry.id}-${award.id}`} className="flex items-start gap-3 rounded-2xl border border-brand-green/10 bg-brand-green/[0.03] px-4 py-3">
                <AwardEmblem award={award} />
                <div>
                  <p className="font-semibold text-brand-green">{award.name}</p>
                  {award.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{award.description}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}

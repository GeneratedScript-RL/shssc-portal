import { Badge } from "@/components/ui/badge";
import type { LegacyHighlightRecord } from "@/types";

interface LegacyWallProps {
  entries: LegacyHighlightRecord[];
  eyebrow?: string;
  title?: string;
  emptyMessage?: string;
}

export default function LegacyWall({
  entries,
  eyebrow = "Legacy Wall",
  title = "Pinned achievements through the years",
  emptyMessage = "No project highlights have been added for this year yet.",
}: LegacyWallProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">
          {eyebrow}
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-brand-green">
          {title}
        </h2>
      </div>
      {entries.length ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {entries.map((entry) => (
            <article key={entry.id} className="panel-hero">
              {entry.school_year ? <Badge>{entry.school_year}</Badge> : null}
              <h3 className="mt-4 text-2xl font-semibold text-brand-green">{entry.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{entry.description}</p>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[1.5rem] border border-dashed border-brand-green/15 px-4 py-8 text-sm text-muted-foreground">
          {emptyMessage}
        </div>
      )}
    </section>
  );
}

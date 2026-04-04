import { Badge } from "@/components/ui/badge";

interface LegacyWallProps {
  entries: Array<{
    id: string;
    title: string;
    description: string;
    school_year: string;
  }>;
}

export default function LegacyWall({ entries }: LegacyWallProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">
          Legacy Wall
        </p>
        <h2 className="mt-2 text-3xl font-semibold text-brand-green">
          Pinned achievements through the years
        </h2>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {entries.map((entry) => (
          <article key={entry.id} className="panel-hero">
            <Badge>{entry.school_year}</Badge>
            <h3 className="mt-4 text-2xl font-semibold text-brand-green">{entry.title}</h3>
            <p className="mt-3 text-sm text-muted-foreground">{entry.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

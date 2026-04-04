import { notFound } from "next/navigation";
import AchievementsList from "@/components/features/legacy/AchievementsList";
import LegacyWall from "@/components/features/legacy/LegacyWall";
import RosterGrid from "@/components/features/legacy/RosterGrid";
import YearSelector from "@/components/features/legacy/YearSelector";
import { getLegacyRosters, getLegacyWallEntries, getRosterEntries } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function LegacyPage({
  searchParams,
}: {
  searchParams: { year?: string };
}) {
  const rosters = await getLegacyRosters();
  const selectedYear = searchParams.year ?? rosters[0]?.school_year;
  const selectedRoster = rosters.find((roster) => roster.school_year === selectedYear) ?? rosters[0];

  if (!selectedRoster) {
    notFound();
  }

  const [entries, legacyWallEntries] = await Promise.all([
    getRosterEntries(selectedRoster.id),
    getLegacyWallEntries(),
  ]);

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Legacy</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Past councils, milestones, and institutional memory.</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          Browse each school year, revisit officer rosters, and surface standout achievements that
          define SHSSC history.
        </p>
        <div className="mt-6">
          <YearSelector years={rosters.map((roster) => roster.school_year)} currentYear={selectedRoster.school_year} />
        </div>
      </section>
      <RosterGrid entries={entries} />
      <div className="grid gap-6 xl:grid-cols-2">
        <AchievementsList title="Achievements" items={selectedRoster.achievements} />
        <AchievementsList title="Milestones" items={selectedRoster.milestones} />
      </div>
      <section className="panel space-y-4">
        <h2 className="text-2xl font-semibold text-brand-green">Impact summary</h2>
        <p className="text-sm text-muted-foreground">{selectedRoster.impact_summary}</p>
        {selectedRoster.president_quote ? (
          <blockquote className="rounded-2xl border-l-4 border-brand-yellow bg-brand-yellow/10 px-5 py-4 text-lg italic text-brand-green">
            {selectedRoster.president_quote}
          </blockquote>
        ) : null}
      </section>
      <LegacyWall entries={legacyWallEntries} />
    </div>
  );
}

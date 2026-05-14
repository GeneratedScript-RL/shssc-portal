import AchievementsList from "@/components/features/legacy/AchievementsList";
import RosterGrid from "@/components/features/legacy/RosterGrid";
import { getLegacyRosters, getRosterEntries } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function OfficersPage() {
  const rosters = await getLegacyRosters();
  const activeRoster = rosters.find((roster) => roster.is_active) ?? rosters[0];
  const entries = activeRoster ? await getRosterEntries(activeRoster.id) : [];

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Current Officers</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">{activeRoster?.school_year ?? "Current"} student council roster.</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          Meet the active SHSSC officers, their roles, and the committee structure currently
          leading projects for the student body.
        </p>
      </section>
      <RosterGrid entries={entries} />
      {activeRoster ? (
        <div className="grid gap-6 xl:grid-cols-2">
          <AchievementsList title="Achievements" items={activeRoster.achievements} />
          <AchievementsList title="Milestones" items={activeRoster.milestones} />
        </div>
      ) : null}
    </div>
  );
}

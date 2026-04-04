import { notFound } from "next/navigation";
import AchievementsList from "@/components/features/legacy/AchievementsList";
import LegacyWall from "@/components/features/legacy/LegacyWall";
import RecognitionList from "@/components/features/legacy/RecognitionList";
import RosterGrid from "@/components/features/legacy/RosterGrid";
import YearSelector from "@/components/features/legacy/YearSelector";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    getLegacyWallEntries(selectedRoster.id),
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
      <Tabs defaultValue="officers" className="space-y-6">
        <TabsList className="mobile-chip-row h-auto w-full justify-start rounded-[1.5rem] bg-brand-green/8 p-2">
          <TabsTrigger value="officers" className="shrink-0">Officers</TabsTrigger>
          <TabsTrigger value="projects" className="shrink-0">Projects</TabsTrigger>
          <TabsTrigger value="achievements" className="shrink-0">Achievements</TabsTrigger>
          <TabsTrigger value="recognition" className="shrink-0">Recognition</TabsTrigger>
        </TabsList>
        <TabsContent value="officers">
          <RosterGrid entries={entries} />
        </TabsContent>
        <TabsContent value="projects">
          <LegacyWall
            entries={legacyWallEntries}
            eyebrow="Major Projects"
            title={`Highlights from ${selectedRoster.school_year}`}
            emptyMessage="No major projects or events have been published for this school year yet."
          />
        </TabsContent>
        <TabsContent value="achievements">
          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-2">
              <AchievementsList title="Key Achievements" items={selectedRoster.achievements} />
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
          </div>
        </TabsContent>
        <TabsContent value="recognition">
          <RecognitionList entries={entries} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

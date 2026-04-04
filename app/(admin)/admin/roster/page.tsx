import RosterEditor from "@/components/features/admin/RosterEditor";
import { getCommittees, getRanks, getRosters, getRosterEntries, getUsersWithAccessLevels } from "@/lib/supabase/queries";

export default async function AdminRosterPage() {
  const [rosters, users, ranks, committees] = await Promise.all([
    getRosters(),
    getUsersWithAccessLevels(),
    getRanks(),
    getCommittees(),
  ]);

  const entryGroups = await Promise.all(rosters.map((roster) => getRosterEntries(roster.id)));
  const entries = entryGroups.flat();

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Roster Editor</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Maintain current and legacy officer rosters.</h1>
      </section>
      <RosterEditor rosters={rosters} entries={entries} users={users} ranks={ranks} committees={committees} />
    </div>
  );
}

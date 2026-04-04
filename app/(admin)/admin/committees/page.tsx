import CommitteeManager from "@/components/features/admin/CommitteeManager";
import { getCommittees } from "@/lib/supabase/queries";

export default async function AdminCommitteesPage() {
  const committees = await getCommittees();

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Committees</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Committee structure, responsibilities, and staffing.</h1>
      </section>
      <CommitteeManager committees={committees} />
    </div>
  );
}

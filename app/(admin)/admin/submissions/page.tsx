import SubmissionsTable from "@/components/features/admin/SubmissionsTable";
import { getSubmissions } from "@/lib/supabase/queries";

export default async function AdminSubmissionsPage() {
  const submissions = await getSubmissions();

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Submissions</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Concerns, feedback, complaints, and suggestions.</h1>
      </section>
      <SubmissionsTable submissions={submissions} />
    </div>
  );
}

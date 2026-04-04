import AwardManager from "@/components/features/admin/AwardManager";
import { getAwards } from "@/lib/supabase/queries";

export default async function AdminRecognitionPage() {
  const awards = await getAwards();

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Recognition</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Manage public-facing commendations and award visuals.</h1>
      </section>
      <AwardManager awards={awards} />
    </div>
  );
}

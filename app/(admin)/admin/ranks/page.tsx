import RankManager from "@/components/features/admin/RankManager";
import { getRanks } from "@/lib/supabase/queries";

export default async function AdminRanksPage() {
  const ranks = await getRanks();

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Ranks</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Color-coded student council hierarchy.</h1>
      </section>
      <RankManager ranks={ranks} />
    </div>
  );
}

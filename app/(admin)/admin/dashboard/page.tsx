import { Badge } from "@/components/ui/badge";
import { getAdminDashboardStats } from "@/lib/supabase/queries";

export default async function AdminDashboardPage() {
  const stats = await getAdminDashboardStats();

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Admin Dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Council management overview.</h1>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.entries(stats).map(([label, value]) => (
          <article key={label} className="roblox-panel">
            <Badge>{label}</Badge>
            <p className="mt-4 text-4xl font-semibold text-brand-green">{value}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

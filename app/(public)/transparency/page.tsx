import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils/formatDate";
import { getTransparencyData } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function TransparencyPage() {
  const { financials, resolutions } = await getTransparencyData();

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Transparency</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Financial summaries, resolutions, and official records.</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          This section publishes the council’s financial snapshots, approved resolutions, and
          supporting documents for student review.
        </p>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="panel space-y-4">
          <h2 className="text-2xl font-semibold text-brand-green">Financial summaries</h2>
          {financials.map((item) => (
            <article key={item.id} className="rounded-2xl border border-brand-green/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <Badge>{item.period}</Badge>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {formatDate(item.published_at, "PPP")}
                </span>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{item.summary_text}</p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl bg-brand-green/[0.03] p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">Income</p>
                  <p className="mt-2 font-semibold text-brand-green">₱{item.total_income.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-brand-green/[0.03] p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">Expenses</p>
                  <p className="mt-2 font-semibold text-brand-green">₱{item.total_expenses.toLocaleString()}</p>
                </div>
                <div className="rounded-2xl bg-brand-green/[0.03] p-3 text-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-orange">Balance</p>
                  <p className="mt-2 font-semibold text-brand-green">₱{item.balance.toLocaleString()}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="panel space-y-4">
          <h2 className="text-2xl font-semibold text-brand-green">Resolutions</h2>
          {resolutions.map((resolution) => (
            <article key={resolution.id} className="rounded-2xl border border-brand-green/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <Badge variant={resolution.status === "approved" ? "default" : "warning"}>
                  {resolution.status}
                </Badge>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  {resolution.resolution_number}
                </span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-brand-green">{resolution.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{resolution.body}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

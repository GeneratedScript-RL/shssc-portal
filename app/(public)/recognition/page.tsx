import AwardEmblem from "@/components/shared/AwardEmblem";
import UserBadge from "@/components/shared/UserBadge";
import { getRecognitionData } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function RecognitionPage() {
  const { awards, awardees } = await getRecognitionData();

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Recognition</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Awards, service highlights, and council honors.</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          Showcase award categories, celebrate contributors, and keep a public recognition wall for
          student leaders and volunteers.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {awards.map((award) => (
          <article key={award.id} className="panel">
            <AwardEmblem award={award} />
            <h2 className="mt-4 text-2xl font-semibold text-brand-green">{award.name}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{award.description}</p>
          </article>
        ))}
      </section>
      <section className="panel">
        <h2 className="text-2xl font-semibold text-brand-green">Recent awardees</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {awardees.map((entry: any, index) => (
            <div key={`${entry.user_id}-${index}`} className="rounded-2xl border border-brand-green/10 p-4">
              <UserBadge userId={entry.user_id} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

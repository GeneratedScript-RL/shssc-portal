import { notFound } from "next/navigation";
import UserBadge from "@/components/shared/UserBadge";
import AwardEmblem from "@/components/shared/AwardEmblem";
import RankChip from "@/components/shared/RankChip";
import { getUserProfile } from "@/lib/supabase/queries";

export default async function ProfileDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const profile = await getUserProfile(params.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <UserBadge userId={profile.id} size="lg" />
        <p className="mt-4 text-sm text-muted-foreground">{profile.email}</p>
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <div className="panel">
          <h2 className="text-2xl font-semibold text-brand-green">Ranks</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {(profile.ranks ?? []).map((rank) => (
              <RankChip key={rank.id} rank={rank} />
            ))}
          </div>
        </div>
        <div className="panel">
          <h2 className="text-2xl font-semibold text-brand-green">Awards</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {(profile.awards ?? []).map((award) => (
              <AwardEmblem key={award.id} award={award} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

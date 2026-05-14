import ChannelList from "@/components/features/forums/ChannelList";
import { getCurrentUserContext } from "@/lib/auth/getCurrentUserContext";
import { getForumChannelAccess } from "@/lib/auth/forumAccess";
import { getForumChannels } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function ForumsPage() {
  const [channels, context] = await Promise.all([getForumChannels(), getCurrentUserContext()]);
  const visibleChannels = (
    await Promise.all(
      channels.map(async (channel) => ({
        channel,
        access: await getForumChannelAccess(channel, context),
      })),
    )
  )
    .filter(({ access }) => access.canView)
    .map(({ channel }) => channel);

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Forums</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Bulletins, questions, and student discussion spaces.</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          Open channels stay visible to the student body, while restricted channels respect access
          levels through database row-level security.
        </p>
      </section>
      <ChannelList channels={visibleChannels} />
    </div>
  );
}

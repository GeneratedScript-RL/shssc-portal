import ForumChannelManager from "@/components/features/admin/ForumChannelManager";
import { getForumChannels } from "@/lib/supabase/queries";

export default async function AdminForumsPage() {
  const channels = await getForumChannels();

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Forum Channels</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Configure student discussion spaces and announcements.</h1>
      </section>
      <ForumChannelManager channels={channels} />
    </div>
  );
}

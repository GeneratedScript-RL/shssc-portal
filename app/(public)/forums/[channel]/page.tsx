import { notFound } from "next/navigation";
import ThreadList from "@/components/features/forums/ThreadList";
import { Badge } from "@/components/ui/badge";
import { getForumChannelBySlug, getForumThreads } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function ForumChannelPage({
  params,
  searchParams,
}: {
  params: { channel: string };
  searchParams: { page?: string };
}) {
  const channel = await getForumChannelBySlug(params.channel);

  if (!channel) {
    notFound();
  }

  const threads = await getForumThreads(channel.id, Number(searchParams.page ?? "1"));

  return (
    <div className="container space-y-6 py-10">
      <section className="panel-hero">
        <Badge>{channel.channel_type}</Badge>
        <h1 className="mt-4 text-4xl font-semibold text-brand-green">#{channel.slug}</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">{channel.description}</p>
      </section>
      <ThreadList threads={threads} channelSlug={channel.slug} />
    </div>
  );
}

import { notFound } from "next/navigation";
import Link from "next/link";
import ThreadList from "@/components/features/forums/ThreadList";
import ThreadComposer from "@/components/features/forums/ThreadComposer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUserContext } from "@/lib/auth/getCurrentUserContext";
import { getForumChannelAccess } from "@/lib/auth/forumAccess";
import { getForumChannelBySlug, getForumThreads } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function ForumChannelPage({
  params,
  searchParams,
}: {
  params: { channel: string };
  searchParams: { page?: string };
}) {
  const [channel, context] = await Promise.all([
    getForumChannelBySlug(params.channel),
    getCurrentUserContext(),
  ]);

  if (!channel) {
    notFound();
  }

  const access = await getForumChannelAccess(channel, context);
  if (!access.canView) {
    notFound();
  }

  const threads = await getForumThreads(channel.id, Number(searchParams.page ?? "1"));
  const postMessage = !context.user
    ? "Sign in to start a thread in this channel."
    : channel.is_locked
      ? "This channel is currently locked."
      : "Your current access level cannot start a thread in this channel.";

  return (
    <div className="container space-y-6 py-10">
      <section className="panel-hero">
        <Badge>{channel.channel_type}</Badge>
        <h1 className="mt-4 text-4xl font-semibold text-brand-green">#{channel.slug}</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">{channel.description}</p>
      </section>
      <section className="panel space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-brand-green">Start a new thread</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Share questions, suggestions, and updates with the council community.
          </p>
        </div>
        {access.canPost ? (
          <ThreadComposer channelId={channel.id} channelSlug={channel.slug} />
        ) : (
          <div className="rounded-2xl border border-brand-green/10 bg-brand-green/[0.03] px-4 py-4">
            <p className="text-sm text-muted-foreground">{postMessage}</p>
            {!context.user ? (
              <Button asChild className="mt-4">
                <Link href={`/auth/login?redirectedFrom=/forums/${channel.slug}`}>Sign in to post</Link>
              </Button>
            ) : null}
          </div>
        )}
      </section>
      <ThreadList threads={threads} channelSlug={channel.slug} />
    </div>
  );
}

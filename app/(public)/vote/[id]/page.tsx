import { notFound } from "next/navigation";
import PollVoteForm from "@/components/features/polls/PollVoteForm";
import PollResultsChart from "@/components/features/polls/PollResultsChart";
import { Badge } from "@/components/ui/badge";
import { createServiceRoleClient, safeQuery } from "@/lib/supabase/server";
import { getPollById } from "@/lib/supabase/queries";

export const dynamic = "force-dynamic";

export default async function VoteDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const poll = await getPollById(params.id);

  if (!poll) {
    notFound();
  }

  const results = await safeQuery(async () => {
    const supabase = createServiceRoleClient();
    const { data } = await supabase
      .from("poll_options")
      .select("id, label, poll_votes(count)")
      .eq("poll_id", poll.id)
      .order("order_index");

    return (data ?? []).map((option: any) => ({
      label: option.label,
      votes: option.poll_votes?.[0]?.count ?? 0,
    }));
  }, [] as Array<{ label: string; votes: number }>);

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{poll.poll_type}</Badge>
          {poll.is_anonymous ? <Badge variant="outline">Anonymous</Badge> : null}
        </div>
        <h1 className="mt-4 text-4xl font-semibold text-brand-green">{poll.title}</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">{poll.description}</p>
      </section>
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="panel">
          <h2 className="text-2xl font-semibold text-brand-green">Cast your vote</h2>
          <div className="mt-4">
            <PollVoteForm poll={poll} />
          </div>
        </div>
        <div className="panel">
          <h2 className="text-2xl font-semibold text-brand-green">Current results</h2>
          <div className="mt-4">
            <PollResultsChart results={results} />
          </div>
        </div>
      </section>
    </div>
  );
}

import PollCard from "@/components/features/polls/PollCard";
import SatisfactionPollWidget from "@/components/features/home/SatisfactionPollWidget";
import { getOpenSatisfactionPoll, getPolls, getSatisfactionHistory } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function VotePage() {
  const [polls, satisfactionPoll, satisfactionHistory] = await Promise.all([
    getPolls(),
    getOpenSatisfactionPoll(),
    getSatisfactionHistory(),
  ]);

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Voting Center</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Polls, council votes, and satisfaction tracking.</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          Every poll opens from the same vote hub, and satisfaction history stays visible in a
          monthly line chart for long-term trend tracking.
        </p>
      </section>
      <SatisfactionPollWidget poll={satisfactionPoll} historicalAverages={satisfactionHistory} />
      <section className="space-y-4">
        <h2 className="text-3xl font-semibold text-brand-green">All polls</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {polls.map((poll) => (
            <PollCard key={poll.id} poll={poll} />
          ))}
        </div>
      </section>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import LiveQASession from "@/components/features/ask/LiveQASession";
import QuestionSubmitForm from "@/components/features/ask/QuestionSubmitForm";
import { getActiveQASession, getQaQuestions } from "@/lib/supabase/queries";

export const revalidate = 60;

export default async function AskPage() {
  const session = await getActiveQASession();
  const questions = session ? await getQaQuestions(session.id) : [];

  return (
    <div className="container space-y-8 py-10">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Ask the Council</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Live questions and moderated council responses.</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          When a session is open, students can submit questions in real time and watch the queue as
          officers sort questions into answered or skipped columns.
        </p>
      </section>
      {session ? (
        <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <section className="panel">
            <Badge>Live session open</Badge>
            <h2 className="mt-4 text-2xl font-semibold text-brand-green">{session.title}</h2>
            <div className="mt-6">
              <QuestionSubmitForm sessionId={session.id} />
            </div>
          </section>
          <section className="panel">
            <h2 className="text-2xl font-semibold text-brand-green">Question queue</h2>
            <div className="mt-6">
              <LiveQASession sessionId={session.id} initialQuestions={questions} />
            </div>
          </section>
        </div>
      ) : (
        <div className="panel">
          <h2 className="text-2xl font-semibold text-brand-green">No active session</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Officers can open a new Q&A session from the admin panel when a live event starts.
          </p>
        </div>
      )}
    </div>
  );
}

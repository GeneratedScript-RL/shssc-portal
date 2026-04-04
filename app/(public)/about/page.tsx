export const revalidate = 60;

export default function AboutPage() {
  return (
    <div className="container py-10">
      <div className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">About the Portal</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">One workspace for the council and the student body.</h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          SHSSC Portal centralizes announcements, events, voting, transparency reports, forum
          discussions, live Q&A sessions, officer rosters, and the concern tracker so students can
          stay informed without hopping between separate tools.
        </p>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <section className="panel">
          <h2 className="text-2xl font-semibold text-brand-green">Student-facing tools</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Students can vote in polls, register for events, join forum channels, and send concerns
            or suggestions with privacy controls.
          </p>
        </section>
        <section className="panel">
          <h2 className="text-2xl font-semibold text-brand-green">Officer operations</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Officers can manage rosters, committees, Q&A sessions, content publishing, moderation,
            recognition, and submissions from one admin console.
          </p>
        </section>
        <section className="panel">
          <h2 className="text-2xl font-semibold text-brand-green">Transparency by default</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Financial summaries, resolutions, and by-laws stay easy to access while permissions and
            row-level security protect sensitive internal data.
          </p>
        </section>
      </div>
    </div>
  );
}

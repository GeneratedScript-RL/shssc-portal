export const revalidate = 60;

export default function BylawsPage() {
  return (
    <div className="container py-10">
      <div className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">By-Laws</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Council governance and operating rules.</h1>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground">
          <p>
            This section is reserved for the SHSSC constitution, by-laws, committee mandates, and
            operational guidelines published by the council.
          </p>
          <p>
            Store final by-law documents or their summaries here through the admin transparency
            tools so students can always access the current governance rules.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Settings</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Environment and deployment reminders.</h1>
        <div className="mt-6 space-y-4 text-sm text-muted-foreground">
          <p>Configure Supabase and Resend environment variables through Vercel before production deployment.</p>
          <p>Use the access-level permission matrix to grant admin navigation visibility and route access.</p>
          <p>Confirm privacy notice behavior, auth callback URLs, and scheduled edge function secrets after deployment.</p>
        </div>
      </section>
    </div>
  );
}

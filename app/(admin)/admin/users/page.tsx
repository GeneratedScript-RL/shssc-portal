import UsersTable from "@/components/features/admin/UsersTable";
import { getUsersWithAccessLevels } from "@/lib/supabase/queries";

export default async function AdminUsersPage() {
  const users = await getUsersWithAccessLevels();

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Users</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Access management and account review.</h1>
      </section>
      <UsersTable users={users} />
    </div>
  );
}

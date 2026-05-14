import PermissionsGrid from "@/components/features/admin/PermissionsGrid";
import { PERMISSION_VALUES } from "@/lib/rbac/permissions";
import { getAccessLevelAssignments, getAccessLevels } from "@/lib/supabase/queries";

export default async function AdminAccessLevelsPage() {
  const [levels, assignments] = await Promise.all([getAccessLevels(), getAccessLevelAssignments()]);

  return (
    <div className="space-y-6">
      <section className="panel-hero">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">Access Levels</p>
        <h1 className="mt-3 text-4xl font-semibold text-brand-green">Permission matrix for every council level.</h1>
      </section>
      <PermissionsGrid levels={levels} permissions={PERMISSION_VALUES} currentAssignments={assignments} />
    </div>
  );
}

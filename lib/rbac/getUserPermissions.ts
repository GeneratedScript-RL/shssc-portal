import type { Permission } from "@/lib/rbac/permissions";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function getUserPermissions(userId: string): Promise<Permission[]> {
  const supabase = createServiceRoleClient();
  const { data: user } = await supabase
    .from("users")
    .select("access_level_id")
    .eq("id", userId)
    .maybeSingle();

  if (!user?.access_level_id) {
    return [];
  }

  const { data } = await supabase
    .from("access_level_permissions")
    .select("permission")
    .eq("access_level_id", user.access_level_id)
    .eq("granted", true);

  return (data ?? []).map(({ permission }) => permission as Permission);
}

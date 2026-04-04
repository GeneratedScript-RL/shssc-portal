import type { Permission } from "@/lib/rbac/permissions";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function checkPermission(userId: string, permission: Permission): Promise<boolean> {
  const supabase = createServiceRoleClient();
  const { data: user } = await supabase
    .from("users")
    .select("access_level_id")
    .eq("id", userId)
    .maybeSingle();

  if (!user?.access_level_id) {
    return false;
  }

  const { data } = await supabase
    .from("access_level_permissions")
    .select("granted")
    .eq("access_level_id", user.access_level_id)
    .eq("permission", permission)
    .eq("granted", true)
    .maybeSingle();

  return !!data;
}

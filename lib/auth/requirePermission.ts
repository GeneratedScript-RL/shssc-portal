import { redirect } from "next/navigation";
import type { Permission } from "@/lib/rbac/permissions";
import { getSession } from "@/lib/auth/getSession";
import { getUserPermissions } from "@/lib/rbac/getUserPermissions";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function requirePermission(permission?: Permission) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const supabase = createServiceRoleClient();
  const { data: user } = await supabase
    .from("users")
    .select("id, access_level_id")
    .eq("auth_id", session.user.id)
    .maybeSingle();

  if (!user) {
    redirect("/auth/login");
  }

  const isSysadmin = await supabase.rpc("is_sysadmin").then(({ data }) => !!data);
  const permissions = await getUserPermissions(user.id);

  if (permission && !isSysadmin && !permissions.includes(permission)) {
    throw new Error("Forbidden");
  }

  return {
    session,
    user,
    isSysadmin,
    permissions,
  };
}

import { redirect } from "next/navigation";
import type { Permission } from "@/lib/rbac/permissions";
import { getSession } from "@/lib/auth/getSession";
import { getCurrentUserContext } from "@/lib/auth/getCurrentUserContext";

export async function requirePermission(permission?: Permission) {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const context = await getCurrentUserContext();

  if (!context.user) {
    redirect("/auth/login");
  }

  if (permission && !context.isSysadmin && !context.permissions.includes(permission)) {
    throw new Error("Forbidden");
  }

  return {
    session,
    user: context.user,
    isSysadmin: context.isSysadmin,
    permissions: context.permissions,
    accessLevel: context.accessLevel,
  };
}

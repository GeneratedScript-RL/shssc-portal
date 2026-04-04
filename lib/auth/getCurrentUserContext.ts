import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getUserPermissions } from "@/lib/rbac/getUserPermissions";
import type { Permission } from "@/lib/rbac/permissions";
import type { Tables } from "@/types";

export type AccessLevelContext = Pick<
  Tables<"access_levels">,
  "id" | "name" | "hierarchy_order" | "is_sysadmin"
>;

export interface AuthenticatedUserContext {
  sessionUserId: string;
  user: Tables<"users">;
  permissions: Permission[];
  isSysadmin: boolean;
  accessLevel: AccessLevelContext | null;
}

export interface CurrentUserContext {
  sessionUserId: string | null;
  user: Tables<"users"> | null;
  permissions: Permission[];
  isSysadmin: boolean;
  accessLevel: AccessLevelContext | null;
}

export async function getCurrentUserContext(): Promise<CurrentUserContext> {
  const serverClient = createServerClient();
  const {
    data: { session },
  } = await serverClient.auth.getSession();

  if (!session?.user) {
    return {
      sessionUserId: null,
      user: null,
      permissions: [],
      isSysadmin: false,
      accessLevel: null,
    };
  }

  const serviceClient = createServiceRoleClient();
  const { data: rawUser } = await serviceClient
    .from("users")
    .select("*, access_levels(id, name, hierarchy_order, is_sysadmin)")
    .eq("auth_id", session.user.id)
    .maybeSingle();

  if (!rawUser) {
    return {
      sessionUserId: session.user.id,
      user: null,
      permissions: [],
      isSysadmin: false,
      accessLevel: null,
    };
  }

  const accessLevel = Array.isArray(rawUser.access_levels)
    ? rawUser.access_levels[0] ?? null
    : rawUser.access_levels ?? null;
  const { access_levels: _accessLevels, ...user } = rawUser;
  const permissions = await getUserPermissions(user.id);
  const isSysadmin = !!accessLevel?.is_sysadmin;

  return {
    sessionUserId: session.user.id,
    user,
    permissions,
    isSysadmin,
    accessLevel,
  };
}

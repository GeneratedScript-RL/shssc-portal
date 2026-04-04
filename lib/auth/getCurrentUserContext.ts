import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getUserPermissions } from "@/lib/rbac/getUserPermissions";
import type { Permission } from "@/lib/rbac/permissions";
import type { Tables } from "@/types";

export interface AuthenticatedUserContext {
  sessionUserId: string;
  user: Tables<"users">;
  permissions: Permission[];
  isSysadmin: boolean;
}

export interface CurrentUserContext {
  sessionUserId: string | null;
  user: Tables<"users"> | null;
  permissions: Permission[];
  isSysadmin: boolean;
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
    };
  }

  const serviceClient = createServiceRoleClient();
  const { data: user } = await serviceClient
    .from("users")
    .select("*")
    .eq("auth_id", session.user.id)
    .maybeSingle();

  if (!user) {
    return {
      sessionUserId: session.user.id,
      user: null,
      permissions: [],
      isSysadmin: false,
    };
  }

  const [permissions, isSysadmin] = await Promise.all([
    getUserPermissions(user.id),
    serviceClient.rpc("is_sysadmin").then(({ data }) => !!data),
  ]);

  return {
    sessionUserId: session.user.id,
    user,
    permissions,
    isSysadmin,
  };
}

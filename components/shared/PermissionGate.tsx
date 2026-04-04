"use client";

import type { ReactNode } from "react";
import type { Permission } from "@/lib/rbac/permissions";
import { useAuthStore } from "@/stores/authStore";

interface Props {
  permission: Permission;
  fallback?: ReactNode;
  children: ReactNode;
}

export default function PermissionGate({ permission, fallback, children }: Props) {
  const permissions = useAuthStore((state) => state.permissions);
  const isSysadmin = useAuthStore((state) => state.isSysadmin);

  if (isSysadmin || permissions.includes(permission)) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
}

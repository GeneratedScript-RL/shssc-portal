"use client";

import { useAuthStore } from "@/stores/authStore";

export function usePermissions() {
  const permissions = useAuthStore((state) => state.permissions);
  const isSysadmin = useAuthStore((state) => state.isSysadmin);

  return {
    permissions,
    isSysadmin,
  };
}

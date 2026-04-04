"use client";

import { useAuthStore } from "@/stores/authStore";

export function usePermissions() {
  return useAuthStore((state) => ({
    permissions: state.permissions,
    isSysadmin: state.isSysadmin,
  }));
}

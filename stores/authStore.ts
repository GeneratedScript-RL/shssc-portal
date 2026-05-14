"use client";

import { create } from "zustand";
import type { Permission } from "@/lib/rbac/permissions";
import type { UserProfile } from "@/types";

interface AuthStore {
  user: UserProfile | null;
  permissions: Permission[];
  isSysadmin: boolean;
  setUser: (user: UserProfile | null) => void;
  setPermissions: (perms: Permission[]) => void;
  setIsSysadmin: (isSysadmin: boolean) => void;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  permissions: [],
  isSysadmin: false,
  setUser: (user) => set({ user }),
  setPermissions: (permissions) => set({ permissions }),
  setIsSysadmin: (isSysadmin) => set({ isSysadmin }),
  hydrate: async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });

      if (!response.ok) {
        set({ user: null, permissions: [], isSysadmin: false });
        return;
      }

      const payload = await response.json();
      set({
        user: payload.user,
        permissions: payload.permissions ?? [],
        isSysadmin: payload.isSysadmin ?? false,
      });
    } catch {
      set({ user: null, permissions: [], isSysadmin: false });
    }
  },
}));

import { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { PERMISSIONS } from '@/lib/rbac/permissions';

interface PermissionGateProps {
  permission: typeof PERMISSIONS[keyof typeof PERMISSIONS];
  fallback?: ReactNode;
  children: ReactNode;
}

export default function PermissionGate({ permission, fallback, children }: PermissionGateProps) {
  const { permissions, isSysadmin } = useAuthStore();

  if (isSysadmin || permissions.includes(permission)) {
    return <>{children}</>;
  }

  return <>{fallback ?? null}</>;
}
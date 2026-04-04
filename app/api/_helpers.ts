import { NextResponse } from "next/server";
import type { Permission } from "@/lib/rbac/permissions";
import {
  getCurrentUserContext,
  type AuthenticatedUserContext,
} from "@/lib/auth/getCurrentUserContext";

export function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status });
}

export async function requireApiUser(permission?: Permission) {
  const context = await getCurrentUserContext();

  if (!context.user) {
    return { error: jsonError("Unauthorized", 401), context: null };
  }

  if (permission && !context.isSysadmin && !context.permissions.includes(permission)) {
    return { error: jsonError("Forbidden", 403), context: null };
  }

  return { error: null, context: context as AuthenticatedUserContext };
}

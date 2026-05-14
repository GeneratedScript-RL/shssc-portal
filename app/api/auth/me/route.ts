import { NextResponse } from "next/server";
import { getCurrentUserContext } from "@/lib/auth/getCurrentUserContext";

export async function GET() {
  const context = await getCurrentUserContext();

  return NextResponse.json({
    user: context.user,
    permissions: context.permissions,
    isSysadmin: context.isSysadmin,
  });
}

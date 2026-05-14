import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@/lib/supabase/middleware";
import { PERMISSION_VALUES } from "@/lib/rbac/permissions";

const PROTECTED_PREFIXES = ["/portal", "/profile", "/admin"];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return response;
  }

  if (!session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    loginUrl.searchParams.set("redirectedFrom", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!pathname.startsWith("/admin")) {
    return response;
  }

  const [{ data: sysadmin }, { data: permissions }] = await Promise.all([
    supabase.rpc("is_sysadmin"),
    supabase.from("current_user_permissions").select("permission"),
  ]);

  const hasAdminPermission =
    !!sysadmin ||
    (permissions ?? []).some(({ permission }) =>
      PERMISSION_VALUES.includes(permission as (typeof PERMISSION_VALUES)[number]),
    );

  if (!hasAdminPermission) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return response;
}

export const config = {
  matcher: [
    "/portal/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};

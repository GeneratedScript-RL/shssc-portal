import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import { requirePermission } from "@/lib/auth/requirePermission";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  try {
    const { permissions, isSysadmin } = await requirePermission();

    if (!permissions.length && !isSysadmin) {
      redirect("/403");
    }

    return (
      <div className="container grid gap-8 py-10 xl:grid-cols-[280px_1fr]">
        <AdminSidebar permissions={permissions} isSysadmin={isSysadmin} />
        <div className="space-y-6">{children}</div>
      </div>
    );
  } catch {
    redirect("/403");
  }
}

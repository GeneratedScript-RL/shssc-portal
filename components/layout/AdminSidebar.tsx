"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  Building2,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MessageCircleQuestion,
  MessageSquare,
  ScrollText,
  Shield,
  Star,
  Trophy,
  UserCog,
  Users,
} from "lucide-react";
import type { Permission } from "@/lib/rbac/permissions";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import { cn } from "@/lib/utils/cn";

interface AdminSidebarProps {
  permissions: Permission[];
  isSysadmin: boolean;
}

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users, permission: PERMISSIONS.MANAGE_USERS },
  {
    href: "/admin/access-levels",
    label: "Access Levels",
    icon: Shield,
    permission: PERMISSIONS.MANAGE_ROLES,
  },
  { href: "/admin/ranks", label: "Ranks", icon: Star, permission: PERMISSIONS.MANAGE_ROLES },
  { href: "/admin/awards", label: "Awards", icon: Award, permission: PERMISSIONS.MANAGE_AWARDS },
  {
    href: "/admin/committees",
    label: "Committees",
    icon: Building2,
    permission: PERMISSIONS.MANAGE_COMMITTEES,
  },
  {
    href: "/admin/roster",
    label: "Roster",
    icon: UserCog,
    permission: PERMISSIONS.MANAGE_ROSTER,
  },
  { href: "/admin/posts", label: "Posts", icon: FileText, permission: PERMISSIONS.POST_NEWS },
  {
    href: "/admin/events",
    label: "Events",
    icon: ClipboardList,
    permission: PERMISSIONS.MANAGE_EVENTS,
  },
  { href: "/admin/polls", label: "Polls", icon: MessageCircleQuestion, permission: PERMISSIONS.MANAGE_POLLS },
  {
    href: "/admin/submissions",
    label: "Submissions",
    icon: ScrollText,
    permission: PERMISSIONS.VIEW_COMPLAINTS,
  },
  {
    href: "/admin/forums",
    label: "Forums",
    icon: MessageSquare,
    permission: PERMISSIONS.MODERATE_FORUMS,
  },
  {
    href: "/admin/transparency",
    label: "Transparency",
    icon: Trophy,
    permission: PERMISSIONS.MANAGE_FINANCIALS,
  },
  {
    href: "/admin/recognition",
    label: "Recognition",
    icon: Award,
    permission: PERMISSIONS.MANAGE_AWARDS,
  },
  { href: "/admin/settings", label: "Settings", icon: Shield },
];

export default function AdminSidebar({ permissions, isSysadmin }: AdminSidebarProps) {
  const pathname = usePathname();

  const visibleItems = items.filter(
    (item) => !item.permission || isSysadmin || permissions.includes(item.permission),
  );

  return (
    <aside className="roblox-panel sticky top-28 hidden h-fit xl:block">
      <div className="mb-5 rounded-[1.35rem] bg-brand-green px-5 py-4 text-white">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-yellow">
          Admin Control
        </p>
        <h2 className="mt-2 text-xl font-semibold">SHSSC Management</h2>
        <p className="mt-1 text-sm text-white/75">
          Role, roster, and council systems organized like a management console.
        </p>
      </div>
      <nav className="space-y-2">
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "touch-target flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-brand-green/70 transition hover:bg-brand-green/6 hover:text-brand-green",
                active && "bg-brand-green text-white shadow-md hover:bg-brand-green hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

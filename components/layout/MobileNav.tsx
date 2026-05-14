"use client";

import Link from "next/link";
import { Archive, Bell, CalendarDays, Home, MessageSquareText, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/legacy", label: "Legacy", icon: Archive },
  { href: "/forums", label: "Forums", icon: MessageSquareText },
  { href: "/transparency", label: "Reports", icon: ShieldCheck },
  { href: "/portal", label: "Portal", icon: Bell },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed left-1/2 z-40 flex w-[calc(100%-1rem)] max-w-lg -translate-x-1/2 items-center justify-between gap-1 rounded-[1.75rem] border border-brand-green/10 bg-white/95 px-2 py-2 shadow-panel backdrop-blur lg:hidden"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "touch-target flex min-w-0 flex-1 flex-col items-center justify-center rounded-full px-1 py-2 text-[10px] font-semibold leading-tight text-muted-foreground transition sm:px-2 sm:text-[11px]",
              active && "bg-brand-green text-white",
            )}
          >
            <Icon className="mb-1 h-4 w-4" />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

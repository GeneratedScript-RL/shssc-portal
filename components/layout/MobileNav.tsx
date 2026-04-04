"use client";

import Link from "next/link";
import { Bell, CalendarDays, Home, MessageSquareText, ShieldCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/events", label: "Events", icon: CalendarDays },
  { href: "/forums", label: "Forums", icon: MessageSquareText },
  { href: "/transparency", label: "Reports", icon: ShieldCheck },
  { href: "/portal", label: "Portal", icon: Bell },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-40 flex w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 items-center justify-between rounded-full border border-brand-green/10 bg-white/95 px-2 py-2 shadow-panel backdrop-blur lg:hidden">
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "touch-target flex flex-1 flex-col items-center justify-center rounded-full px-2 py-2 text-[11px] font-semibold text-muted-foreground transition",
              active && "bg-brand-green text-white",
            )}
          >
            <Icon className="mb-1 h-4 w-4" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

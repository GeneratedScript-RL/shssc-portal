"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils/cn";
import { usePermissions } from "@/hooks/usePermissions";
import { AuthBootstrap } from "@/components/layout/AuthBootstrap";
import PrivacyNotice from "@/components/layout/PrivacyNotice";

const baseNavItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/events", label: "Events" },
  { href: "/vote", label: "Vote" },
  { href: "/legacy", label: "Legacy" },
  { href: "/forums", label: "Forums" },
  { href: "/transparency", label: "Transparency" },
  { href: "/portal", label: "Portal" },
];

function NavLinks({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  const { permissions, isSysadmin } = usePermissions();
  const navItems =
    isSysadmin || permissions.length
      ? [...baseNavItems, { href: "/admin/dashboard", label: "Admin" }]
      : baseNavItems;

  return (
    <nav
      className={cn(
        "flex items-center gap-1",
        mobile && "flex-col items-stretch gap-3",
      )}
      aria-label="Primary navigation"
    >
      {navItems.map((item) => {
        const active =
          item.href === "/admin/dashboard"
            ? pathname.startsWith("/admin")
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "touch-target rounded-full px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/12 hover:text-white",
              active && "bg-white/18 text-white",
              mobile && "border border-brand-green/10 bg-brand-yellow/15 text-brand-green hover:bg-brand-yellow/25",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function Navbar() {
  return (
    <>
      <AuthBootstrap />
      <PrivacyNotice />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-brand-green/95 backdrop-blur">
        <div className="container flex min-h-[5rem] items-center justify-between gap-3 sm:min-h-[5.5rem] sm:gap-4">
          <Link href="/" className="flex min-w-0 items-center gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-2">
              <Image
                src="/icon.png"
                alt="Senior High School Student Council emblem"
                width={56}
                height={56}
                className="h-14 w-14 rounded-xl object-cover"
                priority
              />
            </div>
            <div className="min-w-0 sm:hidden">
              <p className="truncate text-sm font-semibold text-white">SHSSC Portal</p>
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-yellow">
                SHSSC Portal
              </p>
              <p className="text-lg font-semibold text-white">Student Council Management System</p>
            </div>
          </Link>
          <div className="hidden lg:block">
            <NavLinks />
          </div>
          <div className="flex items-center gap-3 lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="border-white/20 bg-white/10 text-white hover:bg-white/20"
                  aria-label="Open navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="max-w-xs">
                <div className="mt-12 space-y-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-brand-orange">
                      Navigation
                    </p>
                    <p className="mt-2 text-lg font-semibold text-brand-green">
                      Explore the SHSSC Portal
                    </p>
                  </div>
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}

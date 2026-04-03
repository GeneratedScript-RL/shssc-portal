"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Vote", href: "/vote" },
  { label: "Transparency", href: "/transparency" },
  { label: "Officers", href: "/officers" },
  { label: "Legacy", href: "/legacy" },
  { label: "Recognition", href: "/recognition" },
  { label: "Forums", href: "/forums" },
  { label: "Ask", href: "/ask" },
  { label: "Portal", href: "/portal" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#2D7D32]">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white">
            <Image
              src="/icon.jpg"
              alt="Student Council Emblem"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-lg font-bold text-white hidden sm:block">
            SHSSC Portal
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                pathname === item.href
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-white/20">
          <nav className="flex flex-col p-4 gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
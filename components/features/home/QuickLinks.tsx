import Link from "next/link";
import { ArrowRight, CalendarDays, FileWarning, MessageSquareText, ShieldCheck, Vote } from "lucide-react";

const links = [
  {
    href: "/events",
    title: "Events",
    description: "Track council programs and upcoming deadlines.",
    icon: CalendarDays,
  },
  {
    href: "/portal",
    title: "Submit Concern",
    description: "Send concerns, complaints, and suggestions securely.",
    icon: FileWarning,
  },
  {
    href: "/vote",
    title: "Active Polls",
    description: "Participate in satisfaction polls and council votes.",
    icon: Vote,
  },
  {
    href: "/forums",
    title: "Forums",
    description: "Join student channels, bulletin updates, and discussions.",
    icon: MessageSquareText,
  },
  {
    href: "/transparency",
    title: "Transparency",
    description: "Read financial summaries, resolutions, and by-laws.",
    icon: ShieldCheck,
  },
];

export default function QuickLinks() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link key={link.href} href={link.href} className="forum-card flex min-h-[180px] flex-col">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-green/10 text-brand-green">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-brand-green">{link.title}</h3>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{link.description}</p>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-orange">
              Open <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

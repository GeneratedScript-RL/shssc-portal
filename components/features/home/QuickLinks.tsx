import Link from "next/link";
import { Calendar, MessageSquare, BarChart3, Users, FileText } from "lucide-react";

const quickLinks = [
  {
    label: "Events",
    href: "/events",
    icon: Calendar,
    description: "View upcoming events",
    color: "bg-blue-500",
  },
  {
    label: "Submit Concern",
    href: "/portal",
    icon: MessageSquare,
    description: "Send feedback or concerns",
    color: "bg-orange-500",
  },
  {
    label: "Active Polls",
    href: "/vote",
    icon: BarChart3,
    description: "Vote on current polls",
    color: "bg-purple-500",
  },
  {
    label: "Forums",
    href: "/forums",
    icon: Users,
    description: "Join the discussion",
    color: "bg-green-500",
  },
  {
    label: "Transparency",
    href: "/transparency",
    icon: FileText,
    description: "View financial reports",
    color: "bg-yellow-500",
  },
];

export default function QuickLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {quickLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 p-6 transition-all hover:border-[#2D7D32] hover:shadow-md hover:-translate-y-1"
        >
          <div className={`${link.color} rounded-xl p-3 text-white`}>
            <link.icon className="h-6 w-6" />
          </div>
          <div className="text-center">
            <span className="block font-semibold text-gray-900 group-hover:text-[#2D7D32]">
              {link.label}
            </span>
            <span className="block text-xs text-muted-foreground">
              {link.description}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
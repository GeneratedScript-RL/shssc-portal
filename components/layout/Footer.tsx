import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-brand-green/10 bg-white/80 py-6">
      <div className="container flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>Senior High School Student Council Portal. Built for students, officers, and committees.</p>
        <div className="flex gap-4">
          <Link href="/transparency" className="hover:text-brand-green">
            Transparency
          </Link>
          <Link href="/recognition" className="hover:text-brand-green">
            Recognition
          </Link>
          <Link href="/portal/tracker" className="hover:text-brand-green">
            Suggestion Tracker
          </Link>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-[#2D7D32] mb-4">SHSSC Portal</h3>
            <p className="text-sm text-muted-foreground">
              Senior High School Student Council Management System
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/events" className="hover:text-[#2D7D32]">Events</Link></li>
              <li><Link href="/vote" className="hover:text-[#2D7D32]">Vote</Link></li>
              <li><Link href="/forums" className="hover:text-[#2D7D32]">Forums</Link></li>
              <li><Link href="/portal" className="hover:text-[#2D7D32]">Portal</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/transparency" className="hover:text-[#2D7D32]">Transparency</Link></li>
              <li><Link href="/officers" className="hover:text-[#2D7D32]">Officers</Link></li>
              <li><Link href="/legacy" className="hover:text-[#2D7D32]">Legacy</Link></li>
              <li><Link href="/recognition" className="hover:text-[#2D7D32]">Recognition</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Have questions? Reach out through our forums or portal.
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          © 2026 SHSSC Portal. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
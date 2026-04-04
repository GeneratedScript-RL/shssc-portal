import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "@/app/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "SHSSC Portal",
  description: "Senior High School Student Council management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="portal-shell">
        <Navbar />
        <main className="pb-24 lg:pb-0">{children}</main>
        <Footer />
        <MobileNav />
        <Analytics />
      </body>
    </html>
  );
}

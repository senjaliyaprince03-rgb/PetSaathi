"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";

import { PetSaathiLogo } from "@/components/brand/logo";
import { AuthNav } from "@/components/marketing/auth-nav";
import { MobileNav } from "@/components/marketing/mobile-nav";

const NAV_LINKS = [
  { href: "/services", label: "Services" },
  { href: "/saathis", label: "Saathis" },
  { href: "/become-a-saathi", label: "Become a Saathi" },
  { href: "/safety", label: "Safety & Trust" },
  { href: "/societies", label: "Societies" },
  { href: "/membership", label: "Membership" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
  { href: "/contact", label: "Contact Us" },
];

export function MarketingHeader() {
  const pathname = usePathname();

  return (
    <header className="absolute inset-x-0 top-3 sm:top-4 z-50">
      <div className="container-shell">
        <div className="mx-auto flex min-h-[4rem] sm:min-h-[4.5rem] w-full max-w-container-max items-center justify-between rounded-full border border-white/70 bg-white/90 px-3.5 sm:px-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-2xl">
          <PetSaathiLogo />
          <nav aria-label="Primary navigation" className="hidden items-center gap-3 xl:gap-4 lg:flex">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(`${link.href}/`)) || (link.href === "/saathis" && pathname === "/caregivers");
              return (
                <Link
                  key={link.href}
                  href={link.href as Route}
                  className={`text-[0.82rem] transition whitespace-nowrap px-1 py-0.5 rounded-md ${
                    isActive
                      ? "font-bold text-[#E16649]"
                      : "font-semibold text-ink/80 hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2 sm:gap-3">
            <AuthNav />
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}

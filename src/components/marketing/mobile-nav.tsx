"use client";

import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Menu, X } from "lucide-react";
import { PetSaathiLogo } from "@/components/brand/logo";

export function MobileNav() {
  const links = [
    { href: "/services", label: "Services" },
    { href: "/caregivers", label: "Saathis" },
    { href: "/safety", label: "Safety & Trust" },
    { href: "/societies", label: "Societies" },
    { href: "/membership", label: "Membership" },
    { href: "/about", label: "About" },
    { href: "/journal", label: "Journal" },
    { href: "/contact", label: "Contact Us" },
  ];

  return (
    <details className="group lg:hidden">
      <summary 
        className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full border border-ink/10 bg-white/80 text-ink shadow-2xs transition hover:bg-ink/5 [&::-webkit-details-marker]:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </summary>

      {/* Full Screen Modal */}
      <div className="fixed inset-0 z-[99999] flex flex-col bg-[#FAF6F1] lg:hidden">
        {/* Top Header */}
        <div className="flex min-h-[4.5rem] shrink-0 items-center justify-between border-b border-ink/10 bg-white px-5 py-4 shadow-xs">
          <PetSaathiLogo />
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-ink/10 bg-surface text-ink shadow-soft transition hover:bg-ink/5"
            onClick={(e) => {
              const details = e.currentTarget.closest("details");
              if (details) details.removeAttribute("open");
            }}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Nav List */}
        <nav className="flex flex-1 flex-col justify-between overflow-y-auto bg-[#FAF6F1] px-6 py-6">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href as Route}
                  onClick={(e) => {
                    const details = e.currentTarget.closest("details");
                    if (details) details.removeAttribute("open");
                  }}
                  className="flex items-center justify-between py-1 font-display text-2xl font-bold tracking-tight text-ink transition hover:text-[#E16649]"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4 text-ink/30" />
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Bottom Actions */}
          <div className="mt-8 flex flex-col gap-3 border-t border-ink/10 pt-6">
            <Link
              href={"/book" as Route}
              className="w-full rounded-2xl bg-[#E16649] py-3.5 text-center text-sm font-bold text-white shadow-md hover:bg-[#d05538]"
            >
              Find Care & Book
            </Link>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <Link
                href={"/login" as Route}
                className="rounded-xl border border-ink/10 bg-white py-2.5 text-center text-xs font-bold text-ink transition-colors hover:bg-surface"
              >
                Sign In
              </Link>
              <Link
                href={"/become-a-saathi" as Route}
                className="rounded-xl border border-ink/10 bg-white py-2.5 text-center text-xs font-bold text-ink transition-colors hover:bg-surface"
              >
                Become a Saathi
              </Link>
            </div>
          </div>
        </nav>
      </div>
    </details>
  );
}

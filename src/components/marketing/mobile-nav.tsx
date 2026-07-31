"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { PetSaathiLogo } from "@/components/brand/logo";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const links = [
    { href: "/services", label: "Services" },
    { href: "/caregivers", label: "Saathis" },
    { href: "/safety", label: "Safety" },
    { href: "/societies", label: "Societies" },
    { href: "/membership", label: "Membership" },
    { href: "/journal", label: "Journal" },
  ];

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-ink/5"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-paper">
          <div className="flex min-h-[4.5rem] items-center justify-between px-4 py-2 sm:px-5 mt-3">
            <PetSaathiLogo />
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-paper text-ink shadow-soft transition hover:bg-ink/5 border border-ink/10"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-8">
            <ul className="flex flex-col gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href as Route}
                    className="font-display text-2xl font-semibold tracking-tight text-ink transition hover:text-coral"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-4 border-t border-ink/10 pt-8">
              <Link
                href={"/login" as Route}
                className="font-semibold text-ink transition hover:text-coral"
              >
                Sign in
              </Link>
              <Link
                href={"/become-a-saathi" as Route}
                className="font-semibold text-ink transition hover:text-coral"
              >
                Become a Saathi
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

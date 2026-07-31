"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { Menu, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { PetSaathiLogo } from "@/components/brand/logo";

interface PortalMobileNavProps {
  links: Array<{ icon: LucideIcon; label: string; href: string }>;
  mode: string;
}

export function PortalMobileNav({ links, mode }: PortalMobileNavProps) {
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

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-paper transition hover:bg-ink/5"
        onClick={() => setIsOpen(true)}
        aria-label="Open workspace menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-paper">
          <div className="flex min-h-20 items-center justify-between px-4 sm:px-5">
            <div className="flex items-center gap-3">
              <PetSaathiLogo />
              <span className="rounded-full bg-indigo/10 px-2.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider text-indigo">
                {mode}
              </span>
            </div>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-paper text-ink transition hover:bg-ink/5"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <nav className="flex flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6">
            <ul className="grid gap-2">
              {links.map(({ icon: NavIcon, label, href }) => {
                const isActive = pathname === href;
                return (
                  <li key={label}>
                    <Link
                      href={href as Route}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-base font-semibold transition",
                        isActive
                          ? "bg-ink text-paper shadow-lifted"
                          : "text-ink/60 hover:bg-indigo/[0.06] hover:text-indigo"
                      )}
                    >
                      <NavIcon className={cn("h-5 w-5", isActive ? "" : "text-ink/40")} />
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}

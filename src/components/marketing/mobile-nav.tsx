"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import { ArrowRight, Menu, X } from "lucide-react";
import { PetSaathiLogo } from "@/components/brand/logo";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { href: "/safety", label: "Safety & Trust" },
    { href: "/societies", label: "Societies" },
    { href: "/membership", label: "Membership" },
    { href: "/about", label: "About" },
    { href: "/journal", label: "Journal" },
    { href: "/contact", label: "Contact Us" },
  ];

  const modalContent = isOpen && mounted ? createPortal(
    <div className="fixed inset-0 z-[99999] flex flex-col bg-[#FAF6F1] md:hidden animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex min-h-[4.5rem] items-center justify-between px-5 py-4 border-b border-ink/10 bg-white shadow-xs shrink-0">
        <PetSaathiLogo />
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface text-ink shadow-soft transition hover:bg-ink/5 border border-ink/10"
          onClick={() => setIsOpen(false)}
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      {/* Nav List */}
      <nav className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-6 bg-[#FAF6F1]">
        <ul className="flex flex-col gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href as Route}
                className="font-display text-2xl font-bold tracking-tight text-ink transition hover:text-[#E16649] flex items-center justify-between py-1"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-ink/30" />
              </Link>
            </li>
          ))}
        </ul>
        
        {/* Bottom Actions */}
        <div className="mt-8 flex flex-col gap-3 border-t border-ink/10 pt-6">
          <Link
            href={"/book" as Route}
            className="w-full py-3.5 bg-[#E16649] hover:bg-[#d05538] text-white font-bold text-sm text-center rounded-2xl shadow-md"
          >
            Find Care & Book
          </Link>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <Link
              href={"/login" as Route}
              className="py-2.5 text-center font-bold text-xs rounded-xl bg-white border border-ink/10 text-ink hover:bg-surface transition-colors"
            >
              Sign In
            </Link>
            <Link
              href={"/become-a-saathi" as Route}
              className="py-2.5 text-center font-bold text-xs rounded-xl bg-white border border-ink/10 text-ink hover:bg-surface transition-colors"
            >
              Become a Saathi
            </Link>
          </div>
        </div>
      </nav>
    </div>,
    document.body
  ) : null;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-ink/5 border border-ink/10 bg-white/80 shadow-2xs"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <Menu className="h-5 w-5" />
      </button>

      {modalContent}
    </div>
  );
}

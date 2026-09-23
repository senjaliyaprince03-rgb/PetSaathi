"use client";

import Link from "next/link";
import type { Route } from "next";

import { PetSaathiLogo } from "@/components/brand/logo";
import { AuthNav } from "@/components/marketing/auth-nav";
import { MobileNav } from "@/components/marketing/mobile-nav";

export function MarketingHeader() {
  return (
    <header className="absolute inset-x-0 top-3 sm:top-4 z-50">
      <div className="container-shell">
        <div className="mx-auto flex min-h-[4rem] sm:min-h-[4.5rem] w-full max-w-container-max items-center justify-between rounded-full border border-white/70 bg-white/90 px-3.5 sm:px-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-2xl">
          <PetSaathiLogo />
          <nav aria-label="Primary navigation" className="hidden items-center gap-3.5 xl:gap-5 lg:flex">
            <Link href={"/services" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink whitespace-nowrap">Services</Link>
            <Link href={"/caregivers" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink whitespace-nowrap">Saathis</Link>
            <Link href={"/become-a-saathi" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink whitespace-nowrap">Become a Saathi</Link>
            <Link href={"/safety" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink whitespace-nowrap">Safety &amp; Trust</Link>
            <Link href={"/societies" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink whitespace-nowrap">Societies</Link>
            <Link href={"/membership" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink whitespace-nowrap">Membership</Link>
            <Link href={"/about" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink whitespace-nowrap">About</Link>
            <Link href={"/journal" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink whitespace-nowrap">Journal</Link>
            <Link href={"/contact" as Route} className="text-[0.82rem] font-semibold text-ink/80 transition hover:text-ink whitespace-nowrap">Contact Us</Link>
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

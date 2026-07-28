import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

import { PetSaathiLogo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <main className="relative min-h-screen bg-paper">
      <header className="absolute inset-x-0 top-0 z-40 py-5">
        <div className="container-shell">
          <div className="glass-panel flex min-h-[4.5rem] items-center justify-between rounded-full border border-paper/40 bg-paper/85 px-4 py-2 shadow-lifted backdrop-blur-md sm:px-5">
            <PetSaathiLogo />
            <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
              <Link href="/services" className="text-sm font-semibold text-ink/75 transition hover:text-indigo">Services</Link>
              <Link href={"/caregivers" as Route} className="text-sm font-semibold text-ink/75 transition hover:text-indigo">Saathis</Link>
              <Link href="/safety" className="text-sm font-semibold text-ink/75 transition hover:text-indigo">Safety</Link>
              <Link href="/societies" className="text-sm font-semibold text-ink/75 transition hover:text-indigo">Societies</Link>
              <Link href="/membership" className="text-sm font-semibold text-ink/75 transition hover:text-indigo">Membership</Link>
              <Link href="/journal" className="text-sm font-semibold text-ink/75 transition hover:text-indigo">Journal</Link>
            </nav>
            <Link href="/book" className={buttonVariants({ variant: "primary", size: "sm" })}>Find care</Link>
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-28 border-t border-paper/10 bg-[#2f2032] py-16 text-paper">
        <div className="container-shell flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <PetSaathiLogo inverted />
          </div>
          <div className="flex flex-wrap gap-7 text-xs font-bold tracking-wide text-paper/75">
            <Link href="/services" className="transition hover:text-saffron">Services</Link>
            <Link href="/caregivers" className="transition hover:text-saffron">Saathis</Link>
            <Link href="/about" className="transition hover:text-saffron">About</Link>
            <Link href="/contact" className="transition hover:text-saffron">Contact</Link>
            <Link href="/privacy" className="transition hover:text-saffron">Privacy</Link>
            <Link href="/terms" className="transition hover:text-saffron">Terms</Link>
          </div>
          <p className="text-xs font-medium text-paper/50">© {new Date().getFullYear()} PetSaathi · Care feels closer</p>
        </div>
      </footer>
    </main>
  );
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="container-shell pb-12 pt-28 text-center sm:pb-16 sm:pt-36">
      <p className="eyebrow justify-center">{eyebrow}</p>
      <h1 className="section-title mt-4 text-center">{title}</h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink/60">{description}</p>
    </section>
  );
}

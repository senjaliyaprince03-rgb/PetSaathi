import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

import { PetSaathiLogo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen">
      <header className="container-shell relative z-40 py-5">
        <div className="glass-panel flex min-h-[4.5rem] items-center justify-between rounded-full px-4 py-2 sm:px-5">
          <PetSaathiLogo />
          <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
            <Link href="/services" className="text-sm font-semibold text-ink/58 transition hover:text-indigo">Services</Link>
            <Link href={"/caregivers" as Route} className="text-sm font-semibold text-ink/58 transition hover:text-indigo">Saathis</Link>
            <Link href="/safety" className="text-sm font-semibold text-ink/58 transition hover:text-indigo">Safety</Link>
            <Link href="/societies" className="text-sm font-semibold text-ink/58 transition hover:text-indigo">Societies</Link>
            <Link href="/membership" className="text-sm font-semibold text-ink/58 transition hover:text-indigo">Membership</Link>
            <Link href="/journal" className="text-sm font-semibold text-ink/58 transition hover:text-indigo">Journal</Link>
          </nav>
          <Link href="/book" className={buttonVariants({ variant: "primary", size: "sm" })}>Find care</Link>
        </div>
      </header>
      {children}
      <footer className="mt-24 border-t border-indigo/10 bg-[#2f2032] py-12 text-paper">
        <div className="container-shell flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <PetSaathiLogo inverted />
          <div className="flex flex-wrap gap-5 text-xs font-semibold text-paper/70">
            <Link href="/about" className="hover:text-paper">About</Link>
            <Link href="/contact" className="hover:text-paper">Contact</Link>
            <Link href="/privacy" className="hover:text-paper">Privacy</Link>
            <Link href="/terms" className="hover:text-paper">Terms</Link>
          </div>
          <p className="text-xs text-paper/60">© {new Date().getFullYear()} PetSaathi · Care feels closer</p>
        </div>
      </footer>
    </main>
  );
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="container-shell pb-12 pt-16 text-center sm:pb-16 sm:pt-24">
      <p className="eyebrow justify-center">{eyebrow}</p>
      <h1 className="section-title mx-auto mt-5 max-w-[12ch]">{title}</h1>
      <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-ink/62">{description}</p>
    </section>
  );
}

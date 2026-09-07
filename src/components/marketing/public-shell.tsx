import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";

import { PetSaathiLogo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { MobileNav } from "@/components/marketing/mobile-nav";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-paper" suppressHydrationWarning>
      <header className="absolute inset-x-0 top-0 z-40 py-5">
        <div className="container-shell">
          <div className="glass-panel flex min-h-[4.5rem] items-center justify-between rounded-full border border-paper/40 bg-paper/85 px-4 py-2 shadow-lifted backdrop-blur-md sm:px-5">
            <PetSaathiLogo />
            <nav aria-label="Primary navigation" className="hidden items-center gap-6 md:flex">
              <Link href="/services" className="text-sm font-semibold text-ink/80 transition hover:text-indigo">Services</Link>
              <Link href={"/caregivers" as Route} className="text-sm font-semibold text-ink/80 transition hover:text-indigo">Saathis</Link>
              <Link href="/safety" className="text-sm font-semibold text-ink/80 transition hover:text-indigo">Safety</Link>
              <Link href="/societies" className="text-sm font-semibold text-ink/80 transition hover:text-indigo">Societies</Link>
              <Link href="/membership" className="text-sm font-semibold text-ink/80 transition hover:text-indigo">Membership</Link>
              <Link href="/journal" className="text-sm font-semibold text-ink/80 transition hover:text-indigo">Journal</Link>
            </nav>
            <div className="flex items-center gap-3">
              <Link href="/book" className={buttonVariants({ variant: "primary", size: "sm" })}>Find care</Link>
              <MobileNav />
            </div>
          </div>
        </div>
      </header>

      <main id="main-content">
        {children}
      </main>

      <footer className="mt-28 border-t border-white/10 bg-[#301F30] pb-28 pt-14 lg:pb-14">
        <div className="container-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <PetSaathiLogo inverted={true} />
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">India-focused, trust-first pet care built around careful handoffs and traceable service delivery.</p>
          </div>
          {[
            ["Explore", [
              ["Services", "/services"],
              ["Saathis", "/caregivers"],
              ["Membership", "/membership"],
              ["Cities", "/cities"]
            ]],
            ["Trust", [
              ["Safety", "/safety"],
              ["Privacy", "/privacy"],
              ["Terms", "/terms"]
            ]],
            ["PetSaathi", [
              ["About", "/about"],
              ["Journal", "/journal"],
              ["Careers", "/become-a-saathi"],
              ["Contact", "/contact"]
            ]]
          ].map(([title, links]) => (
            <div key={String(title)}>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">{String(title)}</p>
              <ul className="mt-5 grid gap-4">
                {(links as [string, Route][]).map(([label, href]) => (
                  <li key={href}>
                    <Link href={href} className="group flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="container-shell mt-16 flex flex-col gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <p className="text-xs font-medium text-white/80">© {new Date().getFullYear()} PetSaathi. All rights reserved.</p>
            <p className="text-xs font-medium text-white/80">Care feels closer.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function PageIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="container-shell pb-12 pt-28 text-center sm:pb-16 sm:pt-36">
      <p className="eyebrow justify-center">{eyebrow}</p>
      <h1 className="section-title mt-4 text-center">{title}</h1>
      <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-ink/80">{description}</p>
    </section>
  );
}

import type { ReactNode } from "react";

import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingFooter } from "@/components/marketing/marketing-footer";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-paper" suppressHydrationWarning>
      <MarketingHeader />

      <main id="main-content">
        {children}
      </main>

      <MarketingFooter />
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

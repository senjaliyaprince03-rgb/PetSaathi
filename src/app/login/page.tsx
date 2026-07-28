import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { BadgeCheck, HeartHandshake, ShieldCheck } from "lucide-react";

import { LoginPanel } from "@/components/forms/login-panel";
import { PublicShell } from "@/components/marketing/public-shell";

export const metadata: Metadata = { title: "Sign in", robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <PublicShell>
      <section className="container-shell pb-10 pt-8 sm:pb-20 sm:pt-14">
        <div className="grid overflow-hidden rounded-5xl border border-indigo/10 bg-paper shadow-soft lg:grid-cols-[1.06fr_0.94fr]">
          <div className="relative hidden min-h-[720px] overflow-hidden bg-indigo lg:block">
            <Image src="/images/login-pet-companion.png" alt="A pet parent sharing a calm moment with her golden retriever" fill priority sizes="(min-width: 1024px) 53vw, 0px" className="object-cover object-[center_25%]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2f2032]/90 via-[#2f2032]/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10 text-paper xl:p-14">
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-saffron">Private by design</p>
              <blockquote className="mt-5 max-w-[13ch] font-display text-4xl font-semibold leading-[1.04] tracking-[-0.045em] xl:text-5xl">“The comfort of home, even when you’re away.”</blockquote>
              <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-paper/75"><span className="flex items-center gap-2 rounded-full bg-paper/10 px-3 py-2 backdrop-blur"><ShieldCheck className="h-4 w-4 text-saffron" />Role-protected access</span><span className="flex items-center gap-2 rounded-full bg-paper/10 px-3 py-2 backdrop-blur"><BadgeCheck className="h-4 w-4 text-saffron" />Verified care network</span></div>
            </div>
          </div>
          <div className="relative flex min-h-[650px] items-center bg-gradient-to-br from-paper via-paper to-[#f5edfa] p-6 sm:p-10 xl:p-14">
            <div className="absolute right-8 top-8 hidden items-center gap-2 text-xs font-bold text-leaf sm:flex"><span className="status-dot" />Secure sign-in</div>
            <div className="w-full">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral/10 text-coral lg:hidden"><HeartHandshake className="h-5 w-5" /></span>
              <p className="eyebrow mt-6 lg:mt-0">Welcome to PetSaathi</p>
              <h1 className="mt-5 max-w-[10ch] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl">Care begins here.</h1>
              <p className="mt-5 max-w-md leading-7 text-ink/55">One secure sign-in for pet parents, Saathis and authorised operations teams.</p>
              <Suspense fallback={<div className="mt-8 h-[25rem] animate-pulse rounded-4xl bg-indigo/[0.06]" />}><LoginPanel /></Suspense>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

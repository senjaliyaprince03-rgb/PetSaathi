import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Building2, CalendarCheck, UsersRound } from "lucide-react";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "For societies" };

export default function SocietiesPage() {
  return <PublicShell><PageIntro eyebrow="care at community scale" title="More familiar faces. Less travel. Clearer access." description="A society partnership concentrates demand and creates an approved local operating rhythm. The individual booking still remains between PetSaathi, the resident and the assigned caregiver." /><section className="container-shell grid gap-5 md:grid-cols-3">{[[Building2,"Controlled access","Document local gate and caregiver-access procedures."],[UsersRound,"Approved local pool","Build continuity with a smaller society-aware caregiver group."],[CalendarCheck,"Shared service rhythm","Coordinate walking windows, resident interest and community events."]].map(([Icon,title,copy]) => { const C=Icon as typeof Building2; return <article key={String(title)} className="glass-panel rounded-5xl p-8"><C className="h-7 w-7 text-indigo"/><h2 className="mt-10 font-display text-3xl font-semibold">{String(title)}</h2><p className="mt-4 leading-7 text-ink/60">{String(copy)}</p></article>; })}</section><div className="container-shell mt-10 text-center"><Link href="/contact?topic=SOCIETY" className={buttonVariants({ variant:"accent", size:"lg" })}>Discuss a controlled pilot <ArrowRight className="h-5 w-5" /></Link></div></PublicShell>;
}

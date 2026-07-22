import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, MapPin, ShieldCheck, Sparkles } from "lucide-react";

import { PageIntro, PublicShell } from "@/components/marketing/public-shell";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = { title: "Find a trusted Saathi" };

const profileViews = [
  { image: "/images/sitter-woman-cinematic.png", label: "Home care", detail: "Routine-led companionship, feeding and careful handovers" },
  { image: "/images/sitter-man-cinematic.png", label: "Neighbourhood walks", detail: "Service-specific permissions with recorded milestones" },
  { image: "/images/sitter-park-cinematic.png", label: "Day care", detail: "Local capacity, pet fit and human-reviewed matching" }
];

export default function CaregiversPage() {
  return <PublicShell><PageIntro eyebrow="Assisted caregiver discovery" title="Meet the right Saathi—not just a long list." description="PetSaathi checks the service, locality, schedule and pet context before proposing a suitable caregiver for your approval." /><section className="container-shell"><div className="flex flex-wrap justify-center gap-2">{["Identity reviewed", "Service permissions", "Local availability", "Pet-fit context", "Human support"].map((item) => <span key={item} className="rounded-full border border-indigo/10 bg-paper/80 px-4 py-2 text-xs font-bold text-ink/55 shadow-sm">{item}</span>)}</div><div className="mt-8 grid gap-5 lg:grid-cols-3">{profileViews.map((item, index) => <article key={item.label} className="group overflow-hidden rounded-5xl border border-indigo/10 bg-paper shadow-lifted"><div className="relative aspect-[4/3] overflow-hidden"><Image src={item.image} alt="PetSaathi caregiver service setting" fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover transition duration-700 group-hover:scale-[1.03]" /><div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" /><span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-paper/90 px-3 py-2 text-xs font-bold text-leaf backdrop-blur"><ShieldCheck className="h-3.5 w-3.5" />Profile view {index + 1}</span></div><div className="p-6"><p className="text-[0.62rem] font-bold uppercase tracking-[0.18em] text-coral">What a proposal can include</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em]">{item.label}</h2><p className="mt-3 text-sm leading-6 text-ink/52">{item.detail}</p><div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold text-ink/48"><span className="flex items-center gap-1.5 rounded-full bg-indigo/[0.06] px-3 py-2"><BadgeCheck className="h-3.5 w-3.5 text-indigo" />Relevant checks</span><span className="flex items-center gap-1.5 rounded-full bg-coral/[0.06] px-3 py-2"><MapPin className="h-3.5 w-3.5 text-coral" />Local fit</span></div></div></article>)}</div><div className="luxury-grid mt-8 rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] to-[#fff0e8] p-8 text-center shadow-soft sm:p-12"><Sparkles className="mx-auto h-8 w-8 text-coral" /><h2 className="mx-auto mt-5 max-w-[14ch] font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">Your match stays private until it matters.</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-ink/52">Names, exact locations and private pet details are revealed only at the appropriate approval stage. You review the proposed Saathi before payment and confirmation.</p><Link href="/book" className={`${buttonVariants({ variant: "accent", size: "lg" })} mt-7`}>Start a care request</Link></div></section></PublicShell>;
}

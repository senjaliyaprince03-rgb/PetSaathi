import type { Route } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  BookHeart,
  BookOpen,
  Facebook,
  FileText,
  Info,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MapPin,
  PawPrint,
  ShieldCheck,
  Twitter,
  UserRoundCheck
} from "lucide-react";

import { PetSaathiLogo } from "@/components/brand/logo";
import { publicEnv } from "@/lib/env";

// Server component: the footer is fully static, so keeping it out of the
// client bundle removes its markup and icon imports from the hydration payload.
export function MarketingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#301F30] pb-28 pt-14 lg:pb-14">
      <div className="container-shell grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <PetSaathiLogo inverted={true} />
          <p className="mt-5 max-w-sm text-sm leading-7 text-white/80">India-focused, trust-first pet care built around careful handoffs and traceable service delivery.</p>
        </div>

        {([
          ["Explore", [
            ["Services", "/services", PawPrint],
            ["Saathis", "/caregivers", UserRoundCheck],
            ["Membership", "/membership", BadgeCheck],
            ["Locations", "/cities", MapPin]
          ]],
          ["Trust", [
            ["Safety", "/safety", ShieldCheck],
            ["Privacy", "/privacy", Lock],
            ["Terms", "/terms", FileText],
            ["Care Guides", "/journal", BookOpen]
          ]],
          ["PetSaathi", [
            ["About", "/about", Info],
            ["Journal", "/journal", BookHeart],
            ["Contact", "/contact", Mail]
          ]]
        ] as [string, [string, Route, React.ElementType<{ className?: string }>][]][]).map(([title, links]) => (
          <div key={title}>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/80">{title}</p>
            <ul className="mt-5 grid gap-4">
              {links.map(([label, href, Icon]) => (
                <li key={href}>
                  <Link href={href} className="group flex w-fit items-center gap-2 text-sm font-medium text-white/80 transition hover:text-white">
                    <Icon className="h-4 w-4 text-white/80 transition group-hover:text-saffron" />
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
        <div className="flex items-center gap-3">
          {([
            ["Twitter", publicEnv.NEXT_PUBLIC_SOCIAL_X_URL, "#000000", undefined],
            ["Instagram", publicEnv.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL, undefined, "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)"],
            ["Facebook", publicEnv.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL, "#1877F2", undefined],
            ["LinkedIn", publicEnv.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL, "#0A66C2", undefined]
          ] as [string, string | undefined, string | undefined, string | undefined][]).map(([label, href, background, backgroundImage]) => {
            if (!href) return null;
            const Icon = label === "Twitter" ? Twitter : label === "Instagram" ? Instagram : label === "Facebook" ? Facebook : Linkedin;
            return (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:opacity-80"
                style={backgroundImage ? { backgroundImage } : { background: background }}>
                <Icon className="h-4 w-4 text-white" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}

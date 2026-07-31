import Link from "next/link";
import type { Route } from "next";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Activity, ArrowUpRight, BadgeCheck, Bell, BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, Clock3, DollarSign, FileLock2, Flag, Handshake, Headphones, Heart, Home, Inbox, LogOut, MapPin, Megaphone, Menu, PawPrint, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, UserRound, Users, WalletCards } from "lucide-react";

import { PetSaathiLogo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { PortalMobileNav } from "@/components/portal/portal-mobile-nav";

type PortalMode = "customer" | "saathi" | "admin" | "society" | "operator";

const portalCopy: Record<PortalMode, { eyebrow: string; title: string; description: string; primary: string; href: Route }> = {
  customer: { eyebrow: "Pet parent home", title: "Good care starts with a calm plan.", description: "Bookings, pet passports and every reassuring update stay together in one private, beautifully simple place.", primary: "Plan new care", href: "/book" },
  saathi: { eyebrow: "Saathi mission control", title: "Care, beautifully organised.", description: "See today’s responsibilities, upcoming visits and the details that help every pet feel understood.", primary: "View assignments", href: "/saathi/assignments" },
  admin: { eyebrow: "Operations command", title: "Clarity for every critical decision.", description: "Matching, service health and safety queues are prioritised in a focused, privacy-aware command centre.", primary: "Open operations", href: "/admin/operations" },
  society: { eyebrow: "Society administration", title: "A kinder community for every resident pet.", description: "Resident access, community events and approved local care stay organised without turning society teams into medical or safety authorities.", primary: "View community", href: "/society" as Route },
  operator: { eyebrow: "Operator dashboard", title: "Local operations, scaled.", description: "Monitor city economics, trust and safety, and ensure operational excellence across your assigned territories.", primary: "View cities", href: "/operator" as Route }
};

const cards: Record<PortalMode, Array<{ label: string; value: string; hint: string; icon: LucideIcon; tone: string }>> = {
  customer: [
    { label: "Care in progress", value: "No active booking", hint: "Your next confirmed service appears here", icon: CalendarDays, tone: "bg-saffron/35 text-ink" },
    { label: "Pet passports", value: "Complete the essentials", hint: "Health, routine and emergency details", icon: PawPrint, tone: "bg-indigo/10 text-indigo" },
    { label: "Care stories", value: "Reports live here", hint: "Photos, milestones and sitter notes", icon: Heart, tone: "bg-coral/10 text-coral" }
  ],
  saathi: [
    { label: "Today’s plan", value: "No active assignment", hint: "Eligible offers will appear here", icon: Clock3, tone: "bg-saffron/35 text-ink" },
    { label: "Readiness", value: "Verification required", hint: "Checks are service-specific", icon: ShieldCheck, tone: "bg-indigo/10 text-indigo" },
    { label: "Care quality", value: "Build your care record", hint: "Completed reports grow trust", icon: Sparkles, tone: "bg-leaf/10 text-leaf" }
  ],
  admin: [
    { label: "Matching queue", value: "Queue connected", hint: "Prioritised by time and eligibility", icon: UserRound, tone: "bg-saffron/35 text-ink" },
    { label: "Service health", value: "No live incidents", hint: "Exceptions escalate by severity", icon: ShieldCheck, tone: "bg-leaf/10 text-leaf" },
    { label: "Payment events", value: "Webhook intake ready", hint: "Idempotent reconciliation status", icon: CheckCircle2, tone: "bg-indigo/10 text-indigo" }
  ],
  society: [
    { label: "Residents", value: "No residents yet", hint: "Verified member records", icon: Users, tone: "bg-indigo/10 text-indigo" },
    { label: "Saathi pool", value: "No approved pool", hint: "Society-scoped caregiver access", icon: PawPrint, tone: "bg-saffron/35 text-ink" },
    { label: "Community events", value: "No upcoming events", hint: "Pet-friendly community programming", icon: CalendarDays, tone: "bg-coral/10 text-coral" }
  ],
  operator: [
    { label: "Territories", value: "Active", hint: "Assigned local territories", icon: MapPin, tone: "bg-indigo/10 text-indigo" },
    { label: "City Health", value: "Monitoring", hint: "Operational metrics", icon: Activity, tone: "bg-leaf/10 text-leaf" },
    { label: "Economics", value: "Live", hint: "Financial performance", icon: DollarSign, tone: "bg-saffron/35 text-ink" }
  ]
};

const portalNavigation: Record<PortalMode, Array<{ icon: LucideIcon; label: string; href: Route }>> = {
  customer: [
    { icon: Home, label: "Overview", href: "/dashboard" },
    { icon: PawPrint, label: "My pets", href: "/pets" },
    { icon: CalendarDays, label: "Request care", href: "/book" },
    { icon: ClipboardCheck, label: "Care protocols", href: "/customer/protocols" as Route },
    { icon: Sparkles, label: "Loyalty & Rewards", href: "/customer/loyalty" as Route },
    { icon: WalletCards, label: "Service wallet", href: "/customer/wallet" as Route },
    { icon: Inbox, label: "Protocol inbox", href: "/customer/inbox" as Route },
    { icon: Handshake, label: "Refer a friend", href: "/customer/referrals" as Route },
    { icon: Handshake, label: "Partner services", href: "/partners" as Route },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Settings2, label: "Communication", href: "/settings/notifications" },
    { icon: Headphones, label: "Support", href: "/support" },
    { icon: Settings2, label: "Privacy requests", href: "/settings/privacy" },
    { icon: ShieldCheck, label: "Trust & safety", href: "/safety" }
  ],
  saathi: [
    { icon: Home, label: "Overview", href: "/saathi" },
    { icon: PawPrint, label: "Assignments", href: "/saathi/assignments" },
    { icon: Inbox, label: "Protocol inbox", href: "/saathi/inbox" as Route },
    { icon: WalletCards, label: "Earnings", href: "/saathi/earnings" as Route },
    { icon: CalendarDays, label: "Availability", href: "/saathi/availability" as Route },
    { icon: ClipboardCheck, label: "Report cards", href: "/saathi/reports" as Route },
    { icon: UserRound, label: "My profile", href: "/saathi/profile" as Route },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: Settings2, label: "Communication", href: "/settings/notifications" },
    { icon: Headphones, label: "Support", href: "/support" },
    { icon: ShieldCheck, label: "Safety guide", href: "/safety" }
  ],
  admin: [
    { icon: Home, label: "Overview", href: "/admin" },
    { icon: Clock3, label: "Service monitor", href: "/admin/operations" },
    { icon: UserRound, label: "Matching", href: "/admin/matching" },
    { icon: SlidersHorizontal, label: "Catalog", href: "/admin/catalog" },
    { icon: ClipboardCheck, label: "Reports", href: "/admin/reports" },
    { icon: Inbox, label: "Leads", href: "/admin/leads" },
    { icon: Handshake, label: "Partner queue", href: "/admin/partner-orders" as Route },
    { icon: WalletCards, label: "Finance", href: "/admin/finance" },
    { icon: ShieldCheck, label: "Safety queue", href: "/admin/safety" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: BadgeCheck, label: "Verification", href: "/admin/verification" },
    { icon: Flag, label: "Cities", href: "/admin/cities" as Route },
    { icon: FileLock2, label: "Privacy queue", href: "/admin/privacy" },
    { icon: BookOpen, label: "Content", href: "/admin/content" },
    { icon: Headphones, label: "Support", href: "/admin/support" }
  ],
  society: [
    { icon: Home, label: "Overview", href: "/society" as Route },
    { icon: Users, label: "Residents", href: "/society" as Route },
    { icon: PawPrint, label: "Saathi pool", href: "/society" as Route },
    { icon: Megaphone, label: "Events & notices", href: "/society" as Route },
    { icon: ShieldCheck, label: "Safety centre", href: "/safety" },
    { icon: Headphones, label: "Support", href: "/support" }
  ],
  operator: [
    { icon: Home, label: "Overview", href: "/operator" as Route },
    { icon: MapPin, label: "Territories", href: "/operator" as Route },
    { icon: Activity, label: "City health", href: "/operator" as Route },
    { icon: DollarSign, label: "Economics", href: "/operator" as Route },
    { icon: Settings2, label: "Settings", href: "/settings/notifications" as Route }
  ]
};

export function PortalShell({ mode, displayName, metrics, showSummaryCards = true, children }: { mode: PortalMode; displayName: string; metrics?: readonly [string, string, string]; showSummaryCards?: boolean; children?: ReactNode }) {
  const copy = portalCopy[mode];
  const firstName = displayName.trim().split(/\s+/)[0] || "there";

  return (
    <main className="min-h-screen bg-cream/70">
      <header className="sticky top-0 z-40 border-b border-indigo/10 bg-paper/80 backdrop-blur-2xl">
        <div className="container-shell flex min-h-20 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <PortalMobileNav links={portalNavigation[mode]} mode={mode} />
            <PetSaathiLogo />
          </div>
          <div className="flex items-center gap-2">
            <span className="mr-2 hidden text-right sm:block"><span className="block text-[0.6rem] font-bold uppercase tracking-[0.18em] text-ink/40">Signed in as</span><span className="mt-0.5 block text-sm font-bold">{displayName}</span></span>
            <Link href="/notifications" aria-label="Notifications" className="relative flex h-11 w-11 items-center justify-center rounded-full border border-indigo/10 bg-paper shadow-sm transition hover:-translate-y-0.5 hover:border-coral/35 hover:text-coral"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-coral" /></Link>
            <Link href="/api/auth/signout" aria-label="Sign out" className="flex h-11 w-11 items-center justify-center rounded-full border border-indigo/10 bg-paper shadow-sm transition hover:-translate-y-0.5 hover:text-coral"><LogOut className="h-[18px] w-[18px]" /></Link>
          </div>
        </div>
      </header>

      <div className="container-shell grid gap-6 py-6 lg:grid-cols-[16rem_minmax(0,1fr)] lg:py-9">
        <aside className="hidden rounded-4xl border border-indigo/10 bg-paper/80 p-3 shadow-lifted backdrop-blur-xl lg:flex lg:min-h-[calc(100vh-8.5rem)] lg:flex-col">
          <div className="rounded-3xl bg-indigo/[0.06] px-4 py-5">
            <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-indigo/60">{portalCopy[mode].eyebrow}</p>
            <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.03em]">Hello, {firstName}.</p>
          </div>
          <nav className="mt-3 grid gap-1" aria-label="Workspace navigation">{portalNavigation[mode].map(({ icon: NavIcon, label, href }, index) => <Link key={label} href={href} className={cn("group flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition", index === 0 ? "bg-ink text-paper shadow-lifted" : "text-ink/58 hover:bg-indigo/[0.06] hover:text-indigo")}><NavIcon className="h-4 w-4 transition group-hover:scale-110" />{label}</Link>)}</nav>
          <div className="mt-auto rounded-3xl border border-indigo/10 bg-gradient-to-br from-indigo/[0.08] to-coral/[0.08] p-4"><div className="flex items-center gap-2 text-xs font-bold text-leaf"><ShieldCheck className="h-4 w-4" />Protected workspace</div><p className="mt-2 text-xs leading-5 text-ink/48">Access remains limited by role and every sensitive action is traceable.</p></div>
        </aside>

        <section className="min-w-0">
          <nav className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden" aria-label="Mobile workspace navigation">{portalNavigation[mode].slice(0, 6).map(({ icon: NavIcon, label, href }, index) => <Link key={label} href={href} className={cn("flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold", index === 0 ? "border-ink bg-ink text-paper" : "border-indigo/10 bg-paper text-ink/60")}><NavIcon className="h-3.5 w-3.5" />{label}</Link>)}</nav>

          <div className="luxury-grid relative overflow-hidden rounded-5xl border border-indigo/10 bg-gradient-to-br from-[#f3eafa] via-paper to-[#fff1e8] p-7 shadow-soft sm:p-10 xl:p-12" data-motion="rise">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo/10 blur-3xl" />
            <div className="absolute -bottom-28 right-1/4 h-56 w-56 rounded-full bg-coral/10 blur-3xl" />
            <div className="relative max-w-3xl"><p className="eyebrow">{copy.eyebrow}</p><h1 className="mt-5 max-w-[13ch] font-display text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-ink sm:text-6xl xl:text-7xl">{copy.title}</h1><p className="mt-6 max-w-2xl text-base leading-7 text-ink/58 sm:text-lg">{copy.description}</p><Link href={copy.href} className={cn(buttonVariants({ variant: "accent" }), "mt-7")}>{copy.primary}<ArrowUpRight className="h-4 w-4" /></Link></div>
          </div>

          {showSummaryCards && <div className="mt-5 grid gap-4 md:grid-cols-3">{cards[mode].map(({ label, value, hint, icon: Icon, tone }, index) => <article key={label} className="group rounded-4xl border border-indigo/10 bg-paper/90 p-5 shadow-lifted transition duration-300 hover:-translate-y-1 hover:border-indigo/20 hover:shadow-soft sm:p-6"><div className="flex items-start justify-between"><span className={cn("flex h-12 w-12 items-center justify-center rounded-2xl", tone)}><Icon className="h-5 w-5" /></span><ArrowUpRight className="h-4 w-4 text-ink/20 transition group-hover:text-coral" /></div><p className="mt-7 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink/38">{label}</p><h2 className="mt-2 font-display text-2xl font-semibold leading-tight tracking-[-0.035em]">{metrics?.[index] ?? value}</h2><p className="mt-2 text-sm leading-6 text-ink/48">{hint}</p></article>)}</div>}

          <div className="mt-5 flex items-start gap-3 rounded-3xl border border-leaf/15 bg-leaf/[0.06] p-5"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-leaf" /><p className="text-sm leading-6 text-ink/58"><strong className="text-ink">Live and private.</strong> This workspace reads authenticated server data; genuine empty states remain visible until real records exist.</p></div>
          {children}
        </section>
      </div>
    </main>
  );
}

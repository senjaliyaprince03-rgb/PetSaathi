"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Route } from "next";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { PetSaathiLogo } from "@/components/brand/logo";
import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  DollarSign,
  FileLock2,
  Flag,
  Gift,
  GraduationCap,
  Handshake,
  Headphones,
  Heart,
  Home,
  Inbox,
  LayoutGrid,
  LogOut,
  MapPin,
  Megaphone,
  PawPrint,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  Sliders,
  SlidersHorizontal,
  Sparkles,
  Syringe,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { GlobalChatWidget } from "@/components/ai/GlobalChatWidget";
import { PetSaathiChatWidget } from "@/components/customer/PetSaathiChatWidget";
import { CustomerSidebar } from "@/components/portal/customer-sidebar";

type PortalMode = "customer" | "saathi" | "admin" | "society" | "operator";

const portalCopy: Record<
  PortalMode,
  {
    eyebrow: string;
    badge: string;
    title: string;
    description: string;
    primary: string;
    href: Route;
    secondary?: { label: string; href: Route };
  }
> = {
  customer: {
    eyebrow: "Parent Portal",
    badge: "Customer Hub",
    title: "Compassionate care, calmly orchestrated.",
    description:
      "Your pet passports, live walk telemetry, vetted Saathis, and immutable session receipts seamlessly united in one intelligent workspace.",
    primary: "Book Care Now",
    href: "/book",
    secondary: { label: "My Pet Passports", href: "/pets" },
  },
  saathi: {
    eyebrow: "Saathi Mission Control",
    badge: "Certified Caregiver",
    title: "Your daily care rhythm, perfected.",
    description:
      "Manage assigned visits, verify daily routines, submit verified session report cards, and track earnings with automated weekly payouts.",
    primary: "Active Assignments",
    href: "/saathi/assignments",
    secondary: { label: "Availability", href: "/saathi/availability" as Route },
  },
  admin: {
    eyebrow: "Operations Command Center",
    badge: "System Authority",
    title: "Total clarity for every operational pulse.",
    description:
      "Live matching algorithms, multi-city capacity controls, safety escalation queues, and audited telemetry logs across the platform.",
    primary: "Operations Queue",
    href: "/admin/operations",
    secondary: { label: "Matching Monitor", href: "/admin/matching" },
  },
  society: {
    eyebrow: "Residential Community Hub",
    badge: "Society Access",
    title: "A safer, happier society for every resident pet.",
    description:
      "Track registered community animals, manage resident gate permissions, and schedule community pet vaccination camps.",
    primary: "Community Directory",
    href: "/society" as Route,
    secondary: { label: "Gate Logs", href: "/society/gate-protocol" as Route },
  },
  operator: {
    eyebrow: "Regional Territory Control",
    badge: "Territory Operator",
    title: "Hyperlocal pet care ecosystems at scale.",
    description:
      "Monitor city economic performance, match velocity, safety SLAs, and caregiver capacity utilization in your zones.",
    primary: "City Operations",
    href: "/operator" as Route,
  },
};

const portalNavigation: Record<
  PortalMode,
  Array<{
    icon: LucideIcon;
    label: string;
    href: Route;
    badge?: string;
    section?: string;
  }>
> = {
  customer: [
    { icon: LayoutGrid, label: "Overview", href: "/dashboard", section: "Main Menu" },
    { icon: Clock3, label: "Care History", href: "/dashboard/history" as Route, section: "Main Menu" },
    { icon: PawPrint, label: "My Pets & Passports", href: "/pets", section: "Main Menu" },
    { icon: CalendarDays, label: "Book Care", href: "/book", section: "Main Menu" },
    { icon: WalletCards, label: "Service Wallet", href: "/customer/wallet" as Route, section: "Main Menu" },
    { icon: LayoutGrid, label: "All Services", href: "/customer/services" as Route, section: "Care Ecosystem" },
    { icon: Sparkles, label: "Care Passes", href: "/customer/subscriptions" as Route, section: "Care Ecosystem" },
    { icon: Gift, label: "Paws Rewards", href: "/customer/loyalty" as Route, section: "Care Ecosystem" },
    { icon: ClipboardCheck, label: "Care Protocols", href: "/customer/protocols" as Route, section: "Care Ecosystem" },
    { icon: Inbox, label: "Protocol Inbox", href: "/customer/inbox" as Route, section: "Care Ecosystem" },
    { icon: Handshake, label: "Refer a Friend", href: "/customer/referrals" as Route, section: "Care Ecosystem" },
    { icon: Settings2, label: "Account Settings", href: "/settings" as Route, section: "Safety & Settings" },
    { icon: ShieldCheck, label: "Trust & Safety", href: "/safety", section: "Safety & Settings" },
  ],
  saathi: [
    { icon: Home, label: "Overview", href: "/saathi", section: "Workplace" },
    { icon: PawPrint, label: "Assignments", href: "/saathi/assignments", section: "Workplace", badge: "Live" },
    { icon: CalendarDays, label: "Availability", href: "/saathi/availability" as Route, section: "Workplace" },
    { icon: Inbox, label: "Client Messages", href: "/saathi/inbox" as Route, section: "Workplace" },
    { icon: ClipboardCheck, label: "Report Cards", href: "/saathi/reports" as Route, section: "Performance" },
    { icon: WalletCards, label: "Earnings & Payouts", href: "/saathi/earnings" as Route, section: "Performance" },
    { icon: BadgeCheck, label: "Pro Membership", href: "/partners/membership" as Route, section: "Performance" },
    { icon: Activity, label: "Performance", href: "/saathi/performance" as Route, section: "Performance" },
    { icon: GraduationCap, label: "Saathi Academy", href: "/saathi/academy" as Route, section: "Performance" },
    { icon: UserRound, label: "My Profile", href: "/saathi/profile" as Route, section: "Account" },
    { icon: Bell, label: "Notifications", href: "/notifications", section: "Account" },
    { icon: Headphones, label: "Caregiver Support", href: "/support", section: "Account" },
    { icon: ShieldCheck, label: "Safety Protocols", href: "/safety", section: "Account" },
  ],
  admin: [
    { icon: Home, label: "Overview", href: "/admin", section: "Command" },
    { icon: Clock3, label: "Operations Monitor", href: "/admin/operations", section: "Command", badge: "Live" },
    { icon: UserRound, label: "Matching Engine", href: "/admin/matching", section: "Command" },
    { icon: ShieldCheck, label: "Safety Queue", href: "/admin/safety", section: "Risk & Trust", badge: "Alerts" },
    { icon: BadgeCheck, label: "Verification Review", href: "/admin/verification", section: "Risk & Trust" },
    { icon: FileLock2, label: "Privacy Compliance", href: "/admin/privacy", section: "Risk & Trust" },
    { icon: WalletCards, label: "Finance & Webhooks", href: "/admin/finance", section: "Commerce" },
    { icon: DollarSign, label: "Plan Versions", href: "/admin/plans" as Route, section: "Commerce" },
    { icon: SlidersHorizontal, label: "Service Catalog", href: "/admin/catalog", section: "Platform" },
    { icon: Flag, label: "City Expansion", href: "/admin/cities" as Route, section: "Platform" },
    { icon: Syringe, label: "Vaccination Camps", href: "/admin/vaccination-camps" as Route, section: "Platform" },
    { icon: Building2, label: "B2B Enterprise", href: "/admin/b2b" as Route, section: "Platform" },
    { icon: Handshake, label: "Partner Network", href: "/admin/partners" as Route, section: "Platform" },
    { icon: Sliders, label: "Feature Flags", href: "/admin/features" as Route, section: "Platform" },
    { icon: Inbox, label: "Onboarding Leads", href: "/admin/leads" as Route, section: "Auditing" },
    { icon: ClipboardCheck, label: "Care Reports", href: "/admin/reports", section: "Auditing" },
    { icon: BookOpen, label: "Content & Reviews", href: "/admin/content", section: "Auditing" },
    { icon: Headphones, label: "Support Cases", href: "/admin/support", section: "Auditing" },
  ],
  society: [
    { icon: Home, label: "Overview", href: "/society" as Route },
    { icon: Users, label: "Residents", href: "/society/residents" as Route },
    { icon: PawPrint, label: "Saathi Pool", href: "/society/saathi-pool" as Route },
    { icon: Megaphone, label: "Events & Camps", href: "/society/events" as Route },
    { icon: ShieldCheck, label: "Gate Protocol", href: "/society/gate-protocol" as Route },
    { icon: ShieldCheck, label: "Safety Center", href: "/safety" },
    { icon: Headphones, label: "Support", href: "/support" },
  ],
  operator: [
    { icon: Home, label: "Overview", href: "/operator" as Route },
    { icon: MapPin, label: "Territories", href: "/operator/territories" as Route },
    { icon: Activity, label: "City Health", href: "/operator/city-health" as Route },
    { icon: DollarSign, label: "Economics", href: "/operator/economics" as Route },
    { icon: Settings2, label: "Settings", href: "/settings/notifications" as Route },
  ],
};

export function PortalShell({
  mode,
  displayName,
  showGreeting = false,
  children,
}: {
  mode: PortalMode;
  displayName: string;
  metrics?: readonly [string, string, string];
  showSummaryCards?: boolean;
  showGreeting?: boolean;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const copy = portalCopy[mode];
  const firstName = displayName.trim().split(/\s+/)[0] || "there";
  const userInitials = displayName
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const links = portalNavigation[mode];

  // Group links by section
  const sections: Record<string, typeof links> = {};
  links.forEach((link) => {
    const sectionName = link.section || "Navigation";
    if (!sections[sectionName]) sections[sectionName] = [];
    sections[sectionName].push(link);
  });

  const isLinkActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/saathi") return pathname === "/saathi";
    if (href === "/admin") return pathname === "/admin";
    return pathname === href || pathname?.startsWith(href + "/");
  };

  // Determine contextual breadcrumb label
  const getBreadcrumbLabel = () => {
    if (pathname === "/pets" || pathname.startsWith("/pets/")) return "My Pets & Passports";
    if (pathname === "/dashboard/history") return "Care History";
    if (pathname === "/customer/services") return "All Services";
    if (pathname === "/customer/subscriptions") return "Care Passes";
    if (pathname === "/customer/loyalty") return "Paws Rewards";
    if (pathname === "/customer/protocols") return "Care Protocols";
    if (pathname === "/customer/inbox") return "Protocol Inbox";
    if (pathname === "/customer/referrals") return "Refer a Friend";
    if (pathname === "/customer/wallet") return "Service Wallet";
    if (pathname === "/settings" || pathname.startsWith("/settings/")) return "Account Settings";
    if (pathname === "/safety") return "Trust & Safety";
    if (pathname === "/support") return "Care Support";
    if (pathname === "/book") return "Book Care";
    return "Live Workspace";
  };

  return (
    <div className="bg-[#FAF6F1] font-body-md text-ink antialiased flex min-h-screen">
      {/* Desktop Fixed SideNavBar */}
      {mode === "customer" ? (
        <CustomerSidebar />
      ) : (
        <aside className="bg-white w-[280px] h-screen max-h-screen fixed left-0 top-0 bottom-0 border-r border-ink/10 hidden md:flex flex-col py-4 px-3.5 z-50 shadow-[4px_0px_24px_rgba(48,31,48,0.02)] select-none overflow-hidden justify-between">
          {/* Brand Header */}
          <div className="px-2 mb-3 shrink-0">
            <PetSaathiLogo href={copy.href} />
            <div className="mt-2 flex items-center justify-between px-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-ink/50">
                {copy.badge}
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Live Network
              </span>
            </div>
          </div>

          {/* Navigation Sections */}
          <div className="flex-1 space-y-3 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {Object.entries(sections).map(([sectionTitle, sectionLinks]) => (
              <div key={sectionTitle}>
                <span className="px-2 text-[9px] font-extrabold uppercase tracking-wider text-ink/40 mb-1 block">
                  {sectionTitle}
                </span>
                <nav className="space-y-0.5">
                  {sectionLinks.map(({ icon: NavIcon, label, href, badge }) => {
                    const active = isLinkActive(href);
                    return (
                      <Link
                        key={label}
                        href={href}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-150 text-xs font-medium border-l-4",
                          active
                            ? "text-indigo bg-indigo/10 border-indigo font-bold shadow-2xs"
                            : "text-ink/75 hover:text-ink hover:bg-ink/5 border-transparent"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <NavIcon className={cn("w-4 h-4 shrink-0", active ? "text-indigo" : "text-ink/60")} />
                          <span className="truncate">{label}</span>
                        </div>
                        {badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-coral/10 text-coral uppercase tracking-wider">
                            {badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Footer Guarantee Card & Sign Out */}
          <div className="shrink-0 pt-2.5 border-t border-ink/10 space-y-2">
            <div className="p-2.5 rounded-xl bg-[#432662]/5 border border-[#432662]/10 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-ink block leading-tight">₹50,000 Safety Cover</span>
                <span className="text-[9px] text-ink/60 block leading-tight mt-0.5">Active on every booking</span>
              </div>
            </div>

            <Link
              href={"/api/auth/signout" as Route}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 text-xs font-bold transition-all duration-150"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </Link>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <main className="w-full md:ml-[280px] min-h-screen pb-20 md:pb-0 flex flex-col">
        {/* TopAppBar */}
        <header className="bg-white/80 backdrop-blur-xl h-20 w-full sticky top-0 z-40 border-b border-ink/10 shadow-[0_4px_20px_rgba(48,31,48,0.03)] flex justify-between items-center px-4 sm:px-8">
          {/* Left: Mobile Brand / Desktop Breadcrumb */}
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold font-display text-indigo md:hidden">
              PetSaathi
            </h2>
            <div className="hidden md:flex items-center gap-2.5">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-ink/10 shadow-2xs hover:border-indigo/30 transition-colors">
                <MapPin className="w-3.5 h-3.5 text-[#E16649] shrink-0" />
                <span className="text-xs font-extrabold text-ink tracking-tight">
                  Indiranagar Care Hub
                </span>
                <span className="text-ink/20">|</span>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  12 Saathis Active Nearby
                </span>
              </div>
            </div>
          </div>

          {/* Center: Search / Command Pill (Desktop) */}
          <Link 
            href={"/customer/services" as any}
            className="hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-full bg-surface/80 hover:bg-surface border border-ink/10 hover:border-indigo/30 text-ink/60 hover:text-ink text-xs transition-all shadow-2xs group"
          >
            <Search className="w-4 h-4 text-indigo group-hover:scale-110 transition-transform" />
            <span>Search services, sitters, records...</span>
            <kbd className="text-[10px] bg-white border border-ink/15 rounded px-1.5 py-0.5 font-mono text-ink/50 shadow-2xs">⌘K</kbd>
          </Link>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* 24/7 Care Support Pill */}
            <Link
              href={"/support" as any}
              aria-label="24/7 Care Support"
              title="24/7 Care Support Desk"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-indigo bg-indigo/5 hover:bg-indigo/10 border border-indigo/15 hover:border-indigo/30 transition-all duration-200 shadow-2xs whitespace-nowrap"
            >
              <Headphones className="w-4 h-4" />
              <span>24/7 Care Support</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </Link>

            {/* Notifications Center */}
            <Link
              href="/notifications"
              aria-label="Notifications"
              title="Notifications & Alerts"
              className="w-10 h-10 rounded-xl bg-white hover:bg-surface border border-ink/10 hover:border-coral/40 text-ink/70 hover:text-coral transition-all duration-200 flex items-center justify-center relative shadow-2xs group"
            >
              <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-coral rounded-full ring-2 ring-white animate-pulse"></span>
            </Link>

            {/* Primary CTA */}
            <Link
              href={mode === "customer" ? ("/book" as any) : copy.href}
              className="bg-[#E16649] hover:bg-[#d05538] text-white text-xs sm:text-sm font-bold px-3.5 sm:px-5 py-2.5 rounded-xl transition-all duration-200 shadow-[0_4px_14px_rgba(225,102,73,0.3)] hover:shadow-[0_6px_20px_rgba(225,102,73,0.45)] hover:-translate-y-0.5 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-white" />
              <span>{mode === "customer" ? "Book Care" : copy.primary}</span>
            </Link>

            {/* User Profile Card */}
            <Link
              href={"/settings" as any}
              aria-label="Account Settings"
              title="Account Settings"
              className="flex items-center gap-2 p-1 sm:pr-2.5 rounded-xl bg-white hover:bg-surface border border-ink/10 hover:border-indigo/30 transition-all duration-200 shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo to-[#2A1540] text-white font-bold flex items-center justify-center text-xs shadow-inner">
                {userInitials || "PS"}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-ink group-hover:text-indigo block leading-none transition-colors">
                  {firstName}
                </span>
                <span className="text-[10px] font-semibold text-emerald-800 block mt-0.5 leading-none">
                  {mode === "customer" ? "Pet Parent" : mode === "saathi" ? "Certified Saathi" : mode === "admin" ? "Super Admin" : "Community"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-ink/40 group-hover:text-indigo hidden md:inline transition-colors" />
            </Link>
          </div>
        </header>

        <div className="max-w-[1440px] mx-auto p-4 sm:p-6 md:p-8 w-full flex-1">
          {/* Hero Header Greeting (Only for portals with showGreeting enabled) */}
          {showGreeting && (
            <div className="mb-6 p-6 sm:p-8 rounded-[28px] bg-white border border-ink/10 shadow-[0px_10px_30px_rgba(48,31,48,0.04)] flex flex-col md:flex-row items-center gap-6">
              <div className="w-14 h-14 bg-indigo/10 rounded-2xl flex items-center justify-center flex-shrink-0 text-indigo">
                <span className="material-symbols-outlined text-3xl">waving_hand</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-display text-ink tracking-tight">
                  Hey {firstName} 👋 {copy.title}
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-ink/70 leading-relaxed max-w-2xl">
                  {copy.description}
                </p>
              </div>
            </div>
          )}
          
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation Bar (Non-Customer Portals) */}
      {mode !== "customer" && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-md border-t border-ink/10 flex justify-around items-center h-16 z-50 px-2 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {links.slice(0, 5).map(({ icon: NavIcon, label, href }) => {
            const active = isLinkActive(href);
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full text-[10px] transition-colors",
                  active ? "text-indigo font-bold" : "text-ink/60 hover:text-ink font-medium"
                )}
              >
                <div className={cn("p-1 rounded-full mb-0.5", active && "bg-indigo/10 text-indigo")}>
                  <NavIcon className="w-5 h-5" />
                </div>
                <span className="truncate max-w-[64px]">{label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {mode === "customer" ? <PetSaathiChatWidget /> : <GlobalChatWidget />}
    </div>
  );
}

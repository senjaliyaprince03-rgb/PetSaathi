import type { Role } from "@prisma/client";
import type { Route } from "next";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BadgeCheck,
  BookOpen,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  DollarSign,
  FileLock2,
  Flag,
  Gift,
  GraduationCap,
  Handshake,
  Headphones,
  Home,
  Inbox,
  KeyRound,
  LayoutGrid,
  MapPin,
  Megaphone,
  PawPrint,
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

export type PortalMode = "customer" | "saathi" | "admin" | "society" | "operator" | "partner";

export interface PortalNavLink {
  icon: LucideIcon;
  label: string;
  href: Route;
  badge?: string;
  section?: string;
}

export const allAdminLinks: PortalNavLink[] = [
  // Super Admin / Governance
  { icon: Home, label: "Governance Overview", href: "/admin" as Route, section: "Governance" },
  { icon: KeyRound, label: "Roles & Permissions", href: "/admin/rbac" as Route, section: "Governance", badge: "Security" },
  { icon: Sliders, label: "Feature Flags", href: "/admin/features" as Route, section: "Governance" },
  { icon: FileLock2, label: "Privacy Compliance", href: "/admin/privacy" as Route, section: "Governance" },

  // Operations Admin
  { icon: Home, label: "Operations Command", href: "/admin" as Route, section: "Operations" },
  { icon: Clock3, label: "Operations Monitor", href: "/admin/operations" as Route, section: "Operations", badge: "Live" },
  { icon: UserRound, label: "Matching Engine", href: "/admin/matching" as Route, section: "Operations" },
  { icon: SlidersHorizontal, label: "Service Catalog", href: "/admin/catalog" as Route, section: "Operations" },
  { icon: Syringe, label: "Vaccination Camps", href: "/admin/vaccination-camps" as Route, section: "Operations" },
  { icon: Inbox, label: "Onboarding Leads", href: "/admin/leads" as Route, section: "Operations" },
  { icon: ClipboardCheck, label: "Care Reports", href: "/admin/reports" as Route, section: "Operations" },
  { icon: Headphones, label: "Support Cases", href: "/admin/support" as Route, section: "Operations" },

  // Safety Admin
  { icon: ShieldCheck, label: "Safety Queue", href: "/admin/safety" as Route, section: "Safety & Trust", badge: "Alerts" },

  // Verification Admin
  { icon: BadgeCheck, label: "Verification Review", href: "/admin/verification" as Route, section: "Verification" },

  // Finance Admin
  { icon: WalletCards, label: "Finance & Webhooks", href: "/admin/finance" as Route, section: "Finance" },
  { icon: DollarSign, label: "Plan Versions", href: "/admin/plans" as Route, section: "Finance" },
  { icon: FileLock2, label: "B2B Invoices", href: "/admin/b2b/invoices" as Route, section: "Finance" },
  { icon: Activity, label: "Investor Metrics", href: "/admin/reports/investor-metrics" as Route, section: "Finance" },

  // Content Admin
  { icon: BookOpen, label: "Content Studio", href: "/admin/content" as Route, section: "Editorial" },
  { icon: BookOpen, label: "Testimonials", href: "/admin/content/testimonials" as Route, section: "Editorial" },

  // Partner Manager
  { icon: Building2, label: "B2B Enterprise", href: "/admin/b2b" as Route, section: "Partnerships" },
  { icon: Handshake, label: "Partner Directory", href: "/admin/partners" as Route, section: "Partnerships" },
  { icon: Inbox, label: "Partner Orders", href: "/admin/partner-orders" as Route, section: "Partnerships" },

  // City Manager
  { icon: Flag, label: "City Network", href: "/admin/cities" as Route, section: "Territory" },
  { icon: Activity, label: "City Health", href: "/operator/city-health" as Route, section: "Territory" },
];

export const roleNavigationMap: Record<Role, string[]> = {
  SUPER_ADMIN: [
    "/admin",
    "/admin/rbac",
    "/admin/features",
    "/admin/privacy",
  ],
  OPERATIONS_ADMIN: [
    "/admin",
    "/admin/operations",
    "/admin/matching",
    "/admin/catalog",
    "/admin/cities",
    "/admin/vaccination-camps",
    "/admin/reports",
    "/admin/support",
    "/admin/leads",
  ],
  SAFETY_ADMIN: [
    "/admin/safety",
    "/admin/reports",
    "/admin/support",
  ],
  FINANCE_ADMIN: [
    "/admin/finance",
    "/admin/plans",
    "/admin/catalog",
    "/admin/b2b/invoices",
    "/admin/reports/investor-metrics",
  ],
  VERIFICATION_ADMIN: [
    "/admin/verification",
    "/admin/leads",
    "/admin/reports",
  ],
  CONTENT_ADMIN: [
    "/admin/content",
    "/admin/content/testimonials",
  ],
  PARTNER_MANAGER: [
    "/admin/b2b",
    "/admin/partners",
    "/admin/partner-orders",
  ],
  CITY_MANAGER: [
    "/admin/cities",
    "/operator/city-health",
  ],
  OPERATOR: [
    "/operator",
    "/operator/territories",
    "/operator/city-health",
    "/operator/economics",
  ],
  SOCIETY_MANAGER: [
    "/society",
    "/society/residents",
    "/society/saathi-pool",
    "/society/gate-protocol",
    "/society/events",
  ],
  SITTER: [
    "/saathi",
    "/saathi/assignments",
    "/saathi/availability",
    "/saathi/inbox",
    "/saathi/reports",
    "/saathi/earnings",
    "/saathi/performance",
    "/saathi/academy",
    "/saathi/profile",
  ],
  CUSTOMER: [
    "/dashboard",
    "/dashboard/history",
    "/pets",
    "/book",
    "/customer/wallet",
    "/customer/services",
    "/customer/subscriptions",
    "/customer/loyalty",
    "/customer/protocols",
  ],
};

export function getFilteredAdminLinks(roles?: readonly Role[]): PortalNavLink[] {
  if (!roles || roles.length === 0) {
    return allAdminLinks;
  }

  const allowedHrefs = new Set<string>();
  for (const role of roles) {
    const list = roleNavigationMap[role];
    if (list) {
      for (const href of list) {
        allowedHrefs.add(href);
      }
    }
  }

  // Deduplicate and filter
  const seen = new Set<string>();
  const filtered: PortalNavLink[] = [];

  for (const link of allAdminLinks) {
    if (allowedHrefs.has(link.href) && !seen.has(link.href)) {
      seen.add(link.href);
      // Custom label adjustment for Super Admin vs Operations Admin on overview
      if (link.href === "/admin") {
        if (roles.includes("SUPER_ADMIN") && !roles.includes("OPERATIONS_ADMIN")) {
          filtered.push({ ...link, label: "Governance Overview", section: "Governance" });
          continue;
        } else {
          filtered.push({ ...link, label: "Operations Command", section: "Operations" });
          continue;
        }
      }
      filtered.push(link);
    }
  }

  return filtered.length > 0 ? filtered : allAdminLinks;
}

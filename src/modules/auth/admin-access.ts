import type { Role } from "@prisma/client";

type AdminAccessRule = {
  prefix: string;
  roles: readonly Role[];
};

const dashboardRoles = [
  "OPERATIONS_ADMIN",
  "VERIFICATION_ADMIN",
  "SAFETY_ADMIN",
  "FINANCE_ADMIN",
  "CONTENT_ADMIN",
  "SUPER_ADMIN",
] as const satisfies readonly Role[];

const adminAccessRules = [
  {
    prefix: "/admin/operations/cities",
    roles: ["CITY_MANAGER", "OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/operations/community",
    roles: ["SOCIETY_MANAGER", "OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/operations/trust-safety",
    roles: ["SAFETY_ADMIN", "OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/operations/live",
    roles: ["OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/operations/queue",
    roles: ["OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/reports/investor-metrics",
    roles: ["FINANCE_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/b2b/invoices",
    roles: ["FINANCE_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/partner-orders",
    roles: ["PARTNER_MANAGER", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/verification",
    roles: ["VERIFICATION_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/operations",
    roles: ["OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/testimonials",
    roles: ["CONTENT_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/content",
    roles: ["CONTENT_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/partners",
    roles: ["PARTNER_MANAGER", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/b2b",
    roles: ["PARTNER_MANAGER", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/privacy",
    roles: ["SUPER_ADMIN"],
  },
  {
    prefix: "/admin/features",
    roles: ["SUPER_ADMIN"],
  },
  {
    prefix: "/admin/finance",
    roles: ["FINANCE_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/safety",
    roles: ["SAFETY_ADMIN", "OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/reports",
    roles: ["SAFETY_ADMIN", "OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/support",
    roles: ["SAFETY_ADMIN", "OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/matching",
    roles: ["OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/catalog",
    roles: ["FINANCE_ADMIN", "OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/cities",
    roles: ["OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
  {
    prefix: "/admin/leads",
    roles: ["OPERATIONS_ADMIN", "SUPER_ADMIN"],
  },
] as const satisfies readonly AdminAccessRule[];

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function normalizeAdminReturnTo(
  candidate: string | null,
  fallback = "/admin",
) {
  const safeFallback =
    /^\/admin(?:\/|\?|$)/.test(fallback) &&
    !fallback.startsWith("//") &&
    !/[\r\n]/.test(fallback)
      ? fallback
      : "/admin";
  if (
    !candidate ||
    candidate.length > 2_048 ||
    !/^\/admin(?:\/|\?|$)/.test(candidate) ||
    candidate.startsWith("//") ||
    /[\r\n]/.test(candidate)
  ) {
    return safeFallback;
  }

  return candidate;
}

export function adminRolesForPath(pathname: string): readonly Role[] | null {
  if (pathname === "/admin" || pathname === "/admin/") return dashboardRoles;
  const rule = adminAccessRules.find(({ prefix }) =>
    matchesPrefix(pathname, prefix),
  );
  return rule?.roles ?? null;
}

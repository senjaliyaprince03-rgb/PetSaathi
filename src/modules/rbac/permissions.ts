import type { Role as PrismaRole } from "@prisma/client";

export const roles = [
  "CUSTOMER",
  "SITTER",
  "OPERATIONS_ADMIN",
  "VERIFICATION_ADMIN",
  "SAFETY_ADMIN",
  "FINANCE_ADMIN",
  "CONTENT_ADMIN",
  "SOCIETY_MANAGER",
  "PARTNER_MANAGER",
  "CITY_MANAGER",
  "OPERATOR",
  "SUPER_ADMIN"
] as const satisfies readonly PrismaRole[];

export type Role = PrismaRole;

/**
 * Role rank/tier used for privilege escalation prevention.
 * A user cannot assign or manage a role equal to or higher than their highest rank,
 * except SUPER_ADMIN who has global authority.
 */
export const ROLE_HIERARCHY_RANK: Record<Role, number> = {
  SUPER_ADMIN: 100,
  OPERATIONS_ADMIN: 70,
  SAFETY_ADMIN: 70,
  FINANCE_ADMIN: 70,
  VERIFICATION_ADMIN: 60,
  CONTENT_ADMIN: 60,
  PARTNER_MANAGER: 60,
  CITY_MANAGER: 50,
  SOCIETY_MANAGER: 40,
  OPERATOR: 40,
  SITTER: 20,
  CUSTOMER: 10,
};

export const permissions = [
  // User Management
  "users:read:own",
  "users:write:own",
  "users:read:any",
  "users:write:any",
  "users:manage_roles",

  // Role & RBAC Governance
  "roles:read",
  "roles:assign",
  "roles:revoke",

  // Pet & Care Records
  "pet:read:own",
  "pet:write:own",
  "pet:read:any",
  "pet:write:any",
  "medical:read:own",
  "medical:write:own",
  "medical:read:any",
  "medical:write:any",

  // Booking & Service Operations
  "booking:read:own",
  "booking:create",
  "booking:cancel:own",
  "booking:operate",
  "booking:dispatch",
  "booking:override",

  // Assignment & Sitter Delivery
  "assignment:read:assigned",
  "assignment:accept:assigned",
  "service:update:assigned",
  "matching:decide",
  "matching:override",
  "verification:read",
  "verification:decide",

  // Safety & Trust
  "incident:read",
  "incident:operate",
  "incident:override",
  "safety:hold_manage",

  // Finance, Invoicing & Payouts
  "finance:read",
  "finance:operate",
  "finance:refund",
  "finance:payout",
  "b2b:invoicing",

  // B2B & Partners
  "b2b:read",
  "b2b:operate",
  "partner:operate",

  // Community & Societies
  "society:read",
  "society:operate",

  // Content & Editorial
  "content:read",
  "content:write",
  "content:publish",
  "content:operate",

  // Operator & Franchise Scopes
  "operator:read",
  "operator:operate",

  // System & Platform Administration
  "system:admin",
  "system:feature_flags",
  "system:audit_logs",
  "system:config"
] as const;

export type Permission = (typeof permissions)[number];

export const rolePermissions: Record<Role, readonly Permission[]> = {
  CUSTOMER: [
    "users:read:own",
    "users:write:own",
    "pet:read:own",
    "pet:write:own",
    "medical:read:own",
    "medical:write:own",
    "booking:read:own",
    "booking:create",
    "booking:cancel:own",
  ],

  SITTER: [
    "users:read:own",
    "users:write:own",
    "assignment:read:assigned",
    "assignment:accept:assigned",
    "service:update:assigned",
  ],

  OPERATIONS_ADMIN: [
    "users:read:any",
    "pet:read:any",
    "booking:operate",
    "booking:dispatch",
    "booking:override",
    "matching:decide",
    "matching:override",
    "verification:read",
    "incident:read",
    "operator:read",
    "operator:operate",
  ],

  VERIFICATION_ADMIN: [
    "users:read:any",
    "verification:read",
    "verification:decide",
  ],

  SAFETY_ADMIN: [
    "users:read:any",
    "pet:read:any",
    "medical:read:any",
    "incident:read",
    "incident:operate",
    "incident:override",
    "safety:hold_manage",
    "verification:read",
  ],

  FINANCE_ADMIN: [
    "users:read:any",
    "finance:read",
    "finance:operate",
    "finance:refund",
    "finance:payout",
    "b2b:invoicing",
  ],

  CONTENT_ADMIN: [
    "content:read",
    "content:write",
    "content:publish",
    "content:operate",
  ],

  SOCIETY_MANAGER: [
    "society:read",
    "society:operate",
    "booking:operate",
  ],

  PARTNER_MANAGER: [
    "users:read:any",
    "b2b:read",
    "b2b:operate",
    "partner:operate",
    "operator:read",
  ],

  CITY_MANAGER: [
    "users:read:any",
    "booking:operate",
    "matching:decide",
    "operator:read",
    "operator:operate",
  ],

  OPERATOR: [
    "booking:operate",
    "operator:read",
  ],

  SUPER_ADMIN: permissions,
};

/**
 * Basic pure function to check if a set of roles includes a permission.
 */
export function hasPermission(userRoles: readonly Role[], permission: Permission): boolean {
  if (userRoles.includes("SUPER_ADMIN")) return true;
  return userRoles.some((role) => rolePermissions[role]?.includes(permission) ?? false);
}

/**
 * Validate whether an actor role can manage (assign or revoke) a target role.
 * Super Admin can manage any role. Other roles cannot assign Super Admin
 * or roles higher or equal to their rank.
 */
export function canActorManageRole(actorRoles: readonly Role[], targetRole: Role): boolean {
  if (actorRoles.includes("SUPER_ADMIN")) return true;
  if (targetRole === "SUPER_ADMIN") return false;

  const actorMaxRank = Math.max(...actorRoles.map((r) => ROLE_HIERARCHY_RANK[r] ?? 0), 0);
  const targetRank = ROLE_HIERARCHY_RANK[targetRole] ?? 0;

  // Actor must strictly outrank the target role to grant or revoke it
  return actorMaxRank > targetRank;
}

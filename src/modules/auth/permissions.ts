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

export const permissions = [
  "pet:read:own",
  "pet:write:own",
  "booking:read:own",
  "booking:create",
  "assignment:read:assigned",
  "service:update:assigned",
  "booking:operate",
  "matching:decide",
  "verification:decide",
  "incident:operate",
  "finance:operate",
  "content:operate",
  "society:operate",
  "partner:operate",
  "system:admin"
] as const;

export type Permission = (typeof permissions)[number];

export const rolePermissions: Record<Role, readonly Permission[]> = {
  CUSTOMER: ["pet:read:own", "pet:write:own", "booking:read:own", "booking:create"],
  SITTER: ["assignment:read:assigned", "service:update:assigned"],
  OPERATIONS_ADMIN: ["booking:operate", "matching:decide"],
  VERIFICATION_ADMIN: ["verification:decide"],
  SAFETY_ADMIN: ["incident:operate"],
  FINANCE_ADMIN: ["finance:operate"],
  CONTENT_ADMIN: ["content:operate"],
  SOCIETY_MANAGER: ["society:operate"],
  PARTNER_MANAGER: ["partner:operate"],
  CITY_MANAGER: ["booking:operate", "matching:decide"],
  OPERATOR: ["booking:operate"],
  SUPER_ADMIN: permissions
};

export function hasPermission(userRoles: readonly Role[], permission: Permission) {
  return userRoles.some((role) => rolePermissions[role]?.includes(permission) ?? false);
}

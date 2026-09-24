import "server-only";

import { NextResponse } from "next/server";
import type { Role } from "@prisma/client";
import { prisma, isDatabaseConfigured } from "@/lib/db";
import { getCurrentIdentity, type AppIdentity } from "@/modules/auth/session";
import {
  permissions as allPermissionsList,
  rolePermissions,
  canActorManageRole,
  type Permission,
} from "./permissions";
import { resolveTerritoryScope } from "./territory-scope";
import { recordRbacAuditLog } from "./audit-logger";

export interface ScopeContext {
  ownerId?: string;
  cityId?: string;
  serviceZoneId?: string;
}

export type PermissionAuthorization =
  | {
      authorized: true;
      identity: AppIdentity;
      effectivePermissions: Set<string>;
    }
  | {
      authorized: false;
      response: NextResponse;
    };

/**
 * Resolve all effective permissions for a user:
 * Implicit permissions from their active roles + explicit grants from AdminPermission.
 */
export async function resolveUserPermissions(
  userId: string,
  roles: readonly Role[],
): Promise<Set<string>> {
  if (roles.includes("SUPER_ADMIN")) {
    return new Set(allPermissionsList);
  }

  const effective = new Set<string>();

  // 1. Gather role-based permissions
  for (const role of roles) {
    const perms = rolePermissions[role];
    if (perms) {
      for (const p of perms) {
        effective.add(p);
      }
    }
  }

  // 2. Query explicit grants from database if available
  if (isDatabaseConfigured()) {
    try {
      const customPerms = await prisma.adminPermission.findMany({
        where: {
          userId,
          status: "ACTIVE",
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        select: { permission: true },
      });

      for (const cp of customPerms) {
        effective.add(cp.permission);
      }
    } catch {
      // In tests or offline DB, role-based perms suffice
    }
  }

  return effective;
}

/**
 * Check whether an identity has permission to perform an action,
 * respecting resource ownership or territory scopes.
 */
export async function canUser(
  identity: AppIdentity,
  permission: Permission,
  scope?: ScopeContext,
): Promise<boolean> {
  // SUPER_ADMIN has global authority
  if (identity.roles.includes("SUPER_ADMIN")) {
    return true;
  }

  const effectivePermissions = await resolveUserPermissions(
    identity.id,
    identity.roles,
  );

  if (!effectivePermissions.has(permission)) {
    return false;
  }

  // IDOR / BOLA Resource ownership checks
  if (scope?.ownerId && permission.endsWith(":own")) {
    if (identity.id !== scope.ownerId) {
      return false;
    }
  }

  // Multi-tenancy Territory scoping for City Managers & Operators
  if ((scope?.cityId || scope?.serviceZoneId) && (identity.roles.includes("OPERATOR") || identity.roles.includes("CITY_MANAGER"))) {
    const territoryScope = await resolveTerritoryScope(identity.id, identity.roles);
    if (!territoryScope.unrestricted) {
      if (scope.cityId && !territoryScope.cityIds.includes(scope.cityId)) {
        return false;
      }
      if (scope.serviceZoneId && territoryScope.serviceZoneIds.length > 0 && !territoryScope.serviceZoneIds.includes(scope.serviceZoneId)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * API route authorization helper.
 * Verifies session and verifies that the current user has the required permission.
 */
export async function authorizePermission(
  permission: Permission,
  scope?: ScopeContext,
): Promise<PermissionAuthorization> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "unauthorized", message: "Authentication required" },
        { status: 401, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  const allowed = await canUser(identity, permission, scope);
  if (!allowed) {
    return {
      authorized: false,
      response: NextResponse.json(
        {
          error: "forbidden",
          message: `Missing required permission: ${permission}`,
        },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      ),
    };
  }

  const effectivePermissions = await resolveUserPermissions(
    identity.id,
    identity.roles,
  );

  return {
    authorized: true,
    identity,
    effectivePermissions,
  };
}

/**
 * Safely assign a role to a user.
 * Prevents privilege escalation: non-Super Admin cannot assign Super Admin,
 * and cannot assign a role higher or equal to their rank.
 */
export async function assignUserRole(params: {
  actorIdentity: AppIdentity;
  targetUserId: string;
  role: Role;
  reason?: string;
  requestId?: string;
  ipHash?: string;
}) {
  const { actorIdentity, targetUserId, role, reason, requestId, ipHash } = params;

  // Verify actor authority
  const hasAssignPerm =
    actorIdentity.roles.includes("SUPER_ADMIN") ||
    (await canUser(actorIdentity, "roles:assign"));

  if (!hasAssignPerm) {
    throw new Error("Actor does not have roles:assign permission");
  }

  if (!canActorManageRole(actorIdentity.roles, role)) {
    throw new Error(
      `Privilege escalation prevented: Actor cannot assign role '${role}'`,
    );
  }

  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  // Get current roles before
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { roles: true },
  });

  if (!user) {
    throw new Error(`Target user '${targetUserId}' not found`);
  }

  const existingRoles = user.roles.map((r) => r.role);
  if (existingRoles.includes(role)) {
    return { success: true, message: "User already has this role" };
  }

  // Upsert user role
  await prisma.userRole.upsert({
    where: {
      userId_role: {
        userId: targetUserId,
        role,
      },
    },
    create: {
      userId: targetUserId,
      role,
      grantedBy: actorIdentity.id,
    },
    update: {
      grantedBy: actorIdentity.id,
      grantedAt: new Date(),
    },
  });

  const primaryActorRole = actorIdentity.roles.includes("SUPER_ADMIN")
    ? "SUPER_ADMIN"
    : actorIdentity.roles[0];

  // Audit log
  await recordRbacAuditLog({
    actorId: actorIdentity.id,
    actorRole: primaryActorRole,
    action: "rbac.role_assigned",
    resourceType: "user",
    resourceId: targetUserId,
    before: { roles: existingRoles },
    after: { roles: [...existingRoles, role], assignedRole: role },
    reason: reason ?? "Admin role assignment",
    requestId,
    ipHash,
  });

  return { success: true, message: `Role ${role} assigned successfully` };
}

/**
 * Safely revoke a role from a user.
 * Prevents unauthorized revocation or privilege escalation.
 */
export async function revokeUserRole(params: {
  actorIdentity: AppIdentity;
  targetUserId: string;
  role: Role;
  reason?: string;
  requestId?: string;
  ipHash?: string;
}) {
  const { actorIdentity, targetUserId, role, reason, requestId, ipHash } = params;

  const hasRevokePerm =
    actorIdentity.roles.includes("SUPER_ADMIN") ||
    (await canUser(actorIdentity, "roles:revoke"));

  if (!hasRevokePerm) {
    throw new Error("Actor does not have roles:revoke permission");
  }

  if (!canActorManageRole(actorIdentity.roles, role)) {
    throw new Error(
      `Privilege escalation prevented: Actor cannot revoke role '${role}'`,
    );
  }

  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: { roles: true },
  });

  if (!user) {
    throw new Error(`Target user '${targetUserId}' not found`);
  }

  const existingRoles = user.roles.map((r) => r.role);
  if (!existingRoles.includes(role)) {
    return { success: true, message: "User does not have this role" };
  }

  await prisma.userRole.deleteMany({
    where: {
      userId: targetUserId,
      role,
    },
  });

  const primaryActorRole = actorIdentity.roles.includes("SUPER_ADMIN")
    ? "SUPER_ADMIN"
    : actorIdentity.roles[0];

  await recordRbacAuditLog({
    actorId: actorIdentity.id,
    actorRole: primaryActorRole,
    action: "rbac.role_revoked",
    resourceType: "user",
    resourceId: targetUserId,
    before: { roles: existingRoles },
    after: { roles: existingRoles.filter((r) => r !== role), revokedRole: role },
    reason: reason ?? "Admin role revocation",
    requestId,
    ipHash,
  });

  return { success: true, message: `Role ${role} revoked successfully` };
}

/**
 * Grant a custom permission override via AdminPermission.
 * Strictly limited to SUPER_ADMIN.
 */
export async function grantCustomPermission(params: {
  actorIdentity: AppIdentity;
  targetUserId: string;
  permission: string;
  reason: string;
  expiresAt?: Date | null;
  scope?: Record<string, unknown>;
  requestId?: string;
  ipHash?: string;
}) {
  const { actorIdentity, targetUserId, permission, reason, expiresAt, scope, requestId, ipHash } = params;

  if (!actorIdentity.roles.includes("SUPER_ADMIN")) {
    throw new Error("Only SUPER_ADMIN can grant explicit custom permissions");
  }

  if (!allPermissionsList.includes(permission as Permission)) {
    throw new Error(`Invalid permission: ${permission}`);
  }

  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  const record = await prisma.adminPermission.upsert({
    where: {
      userId_permission: {
        userId: targetUserId,
        permission,
      },
    },
    create: {
      userId: targetUserId,
      permission,
      status: "ACTIVE",
      grantedBy: actorIdentity.id,
      reason,
      expiresAt: expiresAt ?? null,
      scope: scope ? (scope as any) : undefined,
    },
    update: {
      status: "ACTIVE",
      grantedBy: actorIdentity.id,
      grantedAt: new Date(),
      expiresAt: expiresAt ?? null,
      revokedAt: null,
      reason,
      scope: scope ? (scope as any) : undefined,
    },
  });

  await recordRbacAuditLog({
    actorId: actorIdentity.id,
    actorRole: "SUPER_ADMIN",
    action: "rbac.custom_permission_granted",
    resourceType: "admin_permission",
    resourceId: record.id,
    after: { targetUserId, permission, reason, expiresAt },
    reason,
    requestId,
    ipHash,
  });

  return { success: true, record };
}

/**
 * Revoke a custom permission override.
 * Strictly limited to SUPER_ADMIN.
 */
export async function revokeCustomPermission(params: {
  actorIdentity: AppIdentity;
  targetUserId: string;
  permission: string;
  reason: string;
  requestId?: string;
  ipHash?: string;
}) {
  const { actorIdentity, targetUserId, permission, reason, requestId, ipHash } = params;

  if (!actorIdentity.roles.includes("SUPER_ADMIN")) {
    throw new Error("Only SUPER_ADMIN can revoke explicit custom permissions");
  }

  if (!isDatabaseConfigured()) {
    throw new Error("Database not configured");
  }

  await prisma.adminPermission.updateMany({
    where: {
      userId: targetUserId,
      permission,
      status: "ACTIVE",
    },
    data: {
      status: "ARCHIVED", // GateStatus enum
      revokedAt: new Date(),
      reason,
    },
  });

  await recordRbacAuditLog({
    actorId: actorIdentity.id,
    actorRole: "SUPER_ADMIN",
    action: "rbac.custom_permission_revoked",
    resourceType: "admin_permission",
    resourceId: `${targetUserId}:${permission}`,
    after: { targetUserId, permission, status: "ARCHIVED" },
    reason,
    requestId,
    ipHash,
  });

  return { success: true };
}

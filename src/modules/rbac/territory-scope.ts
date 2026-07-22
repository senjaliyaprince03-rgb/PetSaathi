/**
 * Territory-scoped RBAC utility.
 *
 * For OPERATOR-role users, this module resolves which cities and service zones
 * they are authorized to access, and provides Prisma-compatible where-clause
 * fragments to enforce data isolation at the query layer.
 *
 * Central admins (SUPER_ADMIN, OPERATIONS_ADMIN) bypass territory scoping.
 */

import { prisma } from "@/lib/db";
import type { Role } from "@prisma/client";

/* ─── Types ───────────────────────────────────────────────────── */

export interface TerritoryScope {
  /** If true, the user has unrestricted access (central admin). */
  unrestricted: boolean;
  /** Allowed city IDs (empty = none unless unrestricted). */
  cityIds: string[];
  /** Allowed service zone IDs (empty = city-level only). */
  serviceZoneIds: string[];
  /** Operator partner ID, if applicable. */
  operatingPartnerId: string | null;
}

/* ─── Roles that bypass territory isolation ────────────────── */

const CENTRAL_ROLES: Role[] = [
  "SUPER_ADMIN",
  "OPERATIONS_ADMIN",
  "FINANCE_ADMIN",
  "SAFETY_ADMIN",
  "VERIFICATION_ADMIN",
  "CONTENT_ADMIN",
];

/* ─── Core resolver ───────────────────────────────────────── */

/**
 * Resolve the territory scope for a given user.
 *
 * - Central admin roles → unrestricted.
 * - CITY_MANAGER role → scoped to cities they manage.
 * - OPERATOR role → scoped to territories assigned to their OperatingPartner.
 */
export async function resolveTerritoryScope(
  userId: string,
  roles: Role[],
): Promise<TerritoryScope> {
  // Central admins bypass
  if (roles.some((r) => CENTRAL_ROLES.includes(r))) {
    return {
      unrestricted: true,
      cityIds: [],
      serviceZoneIds: [],
      operatingPartnerId: null,
    };
  }

  const cityIds = new Set<string>();
  const serviceZoneIds = new Set<string>();
  let operatingPartnerId: string | null = null;

  // City Manager scoping
  if (roles.includes("CITY_MANAGER")) {
    const assignments = await prisma.cityManager.findMany({
      where: { userId, status: "ACTIVE" },
      select: { cityId: true },
    });
    for (const a of assignments) {
      cityIds.add(a.cityId);
    }
  }

  // Operator scoping
  if (roles.includes("OPERATOR")) {
    const partnerLinks = await prisma.operatingPartner.findMany({
      where: { contactPersonId: userId, status: { in: ["PILOT", "ACTIVE_OP"] } },
      select: {
        id: true,
        territories: {
          where: { isActive: true },
          select: { cityId: true, serviceZoneId: true },
        },
      },
    });

    for (const partner of partnerLinks) {
      operatingPartnerId = partner.id;
      for (const territory of partner.territories) {
        cityIds.add(territory.cityId);
        if (territory.serviceZoneId) {
          serviceZoneIds.add(territory.serviceZoneId);
        }
      }
    }
  }

  return {
    unrestricted: false,
    cityIds: Array.from(cityIds),
    serviceZoneIds: Array.from(serviceZoneIds),
    operatingPartnerId,
  };
}

/* ─── Prisma where-clause helpers ─────────────────────────── */

/**
 * Returns a Prisma-compatible filter fragment for a model
 * that has a `cityId` field. Use spread: `where: { ...scopeFilter, ... }`.
 */
export function cityWhereFilter(scope: TerritoryScope): Record<string, unknown> {
  if (scope.unrestricted) return {};
  if (scope.cityIds.length === 0) return { cityId: "__NO_ACCESS__" };
  return { cityId: { in: scope.cityIds } };
}

/**
 * Returns a filter for models with a `serviceZoneId` field.
 * Falls back to city-level filtering if no zone IDs are set.
 */
export function zoneWhereFilter(scope: TerritoryScope): Record<string, unknown> {
  if (scope.unrestricted) return {};
  if (scope.serviceZoneIds.length > 0) {
    return { serviceZoneId: { in: scope.serviceZoneIds } };
  }
  // Fallback: zone-level isolation not configured, restrict by city
  return { cityId: { in: scope.cityIds } };
}

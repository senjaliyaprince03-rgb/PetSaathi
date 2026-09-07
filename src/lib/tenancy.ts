/**
 * Multi-Tenant Franchise Isolation
 * Enforces city/territory-based access control for operating partners
 */

import "server-only";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export type TenantContext = {
  cityId: string;
  citySlug: string;
  operatorId?: string;
};

/**
 * Resolve tenant from hostname
 * Supports subdomain routing: pune.petsaathi.com → Pune tenant
 */
export async function resolveTenantFromHost(
  hostname: string
): Promise<TenantContext | null> {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "petsaathi.com";

  // Remove port if present
  const cleanHost = hostname.split(":")[0] ?? hostname;

  // Extract subdomain
  const subdomain = cleanHost.replace(`.${rootDomain}`, "");

  // Main domain or www - no tenant
  if (subdomain === cleanHost || subdomain === "www" || subdomain === "") {
    return null;
  }

  // Look up city by slug
  const city = await prisma.city.findUnique({
    where: { slug: subdomain },
    select: { id: true, slug: true }
  });

  if (!city) {
    return null;
  }

  return {
    cityId: city.id,
    citySlug: city.slug,
    operatorId: undefined // Set by operator auth context
  };
}

/**
 * Authorize tenant access for user
 * Throws if user doesn't have access to the tenant
 */
export async function authorizeTenantAccess(
  userId: string,
  cityId: string
): Promise<void> {
  // Check if user is SUPER_ADMIN (has access to all tenants)
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      roles: { select: { role: true } }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isSuperAdmin = user.roles.some(r => r.role === "SUPER_ADMIN");
  if (isSuperAdmin) {
    return; // SUPER_ADMIN can access all tenants
  }

  // Check if user is a city manager for this city
  const cityManager = await prisma.cityManager.findFirst({
    where: {
      userId,
      cityId,
      status: "ACTIVE"
    }
  });

  if (!cityManager) {
    throw new Error(`User does not have access to city ${cityId}`);
  }
}

/**
 * Get tenant context for request
 * Returns tenant if accessing via subdomain, null otherwise
 */
export async function getTenantContext(
  request: NextRequest
): Promise<TenantContext | null> {
  const hostname = request.headers.get("host") ?? "";
  return await resolveTenantFromHost(hostname);
}

/**
 * Create tenant-scoped query filter
 * Adds cityId filter for tenant-specific queries
 */
export function tenantScopedWhere<T extends Record<string, any>>(
  tenantContext: TenantContext | null,
  where: T
): T {
  if (!tenantContext) {
    return where;
  }

  // Add cityId filter for tenant isolation
  return {
    ...where,
    cityId: tenantContext.cityId
  } as T;
}

/**
 * Assert tenant ownership of a resource
 * Throws if resource doesn't belong to tenant
 */
export async function assertTenantOwnership(
  tenantContext: TenantContext,
  resourceCityId: string
): Promise<void> {
  if (resourceCityId !== tenantContext.cityId) {
    throw new Error("Resource does not belong to this tenant");
  }
}

/**
 * Get all cities accessible by user
 * Returns all cities for SUPER_ADMIN, managed cities for operators
 */
export async function getAccessibleCities(userId: string): Promise<string[]> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      roles: { select: { role: true } },
      managedCities: {
        where: { status: "ACTIVE" },
        select: { cityId: true }
      }
    }
  });

  if (!user) {
    return [];
  }

  const isSuperAdmin = user.roles.some(r => r.role === "SUPER_ADMIN");

  if (isSuperAdmin) {
    // SUPER_ADMIN can access all cities
    const cities = await prisma.city.findMany({
      select: { id: true }
    });
    return cities.map(c => c.id);
  }

  // Return managed cities only
  return user.managedCities.map(cm => cm.cityId);
}

/**
 * Create tenant-isolated Prisma client (for future enhancement)
 * Currently returns global client with manual filtering
 */
export function getTenantPrismaClient(
  tenantContext: TenantContext | null
) {
  // In production, this could return a Prisma client with automatic
  // row-level security or query interception
  // For now, return global client and rely on manual tenantScopedWhere
  return prisma;
}

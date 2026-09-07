/**
 * Centralized Authorization Helpers
 * Prevents IDOR vulnerabilities by enforcing ownership and access controls
 */

import "server-only";

import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";

export class UnauthorizedError extends Error {
  constructor(message: string = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  constructor(message: string = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export type AuthContext = {
  userId: string;
  roles: Role[];
  isAdmin: boolean;
  isSuperAdmin: boolean;
};

/**
 * Check if user has any of the specified roles
 */
export function hasRole(context: AuthContext, ...roles: Role[]): boolean {
  return roles.some(role => context.roles.includes(role));
}

/**
 * Check if user is any type of admin
 */
export function isAdmin(context: AuthContext): boolean {
  return context.isAdmin || context.isSuperAdmin || hasRole(
    context,
    "SUPER_ADMIN",
    "OPERATIONS_ADMIN",
    "VERIFICATION_ADMIN",
    "SAFETY_ADMIN",
    "FINANCE_ADMIN",
    "CONTENT_ADMIN"
  );
}

/**
 * Authorize booking access
 * Customer can access their own bookings
 * Assigned sitter can access their assignments
 * Admins can access all bookings
 */
export async function authorizeBookingAccess(
  bookingId: string,
  context: AuthContext
): Promise<void> {
  if (isAdmin(context)) return;

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    select: {
      customerId: true,
      assignments: {
        where: { status: { in: ["OFFERED", "ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE"] } },
        select: { sitterId: true }
      }
    }
  });

  if (!booking) throw new Error("Booking not found");

  // Check if user is the customer
  if (booking.customerId === context.userId) return;

  // Check if user is the assigned sitter
  const isAssignedSitter = booking.assignments.some(
    a => a.sitterId === context.userId
  );
  if (isAssignedSitter) return;

  throw new ForbiddenError("You do not have access to this booking");
}

/**
 * Authorize pet access
 * Only pet owner can access their pet
 * Admins can access all pets
 */
export async function authorizePetAccess(
  petId: string,
  context: AuthContext
): Promise<void> {
  if (isAdmin(context)) return;

  const pet = await prisma.pet.findUnique({
    where: { id: petId },
    select: { ownerId: true }
  });

  if (!pet) throw new Error("Pet not found");
  
  if (pet.ownerId !== context.userId) {
    throw new ForbiddenError("You do not have access to this pet");
  }
}

/**
 * Authorize upload access
 * Only uploader can access their upload
 * Admins can access all uploads
 */
export async function authorizeUploadAccess(
  uploadId: string,
  context: AuthContext
): Promise<void> {
  if (isAdmin(context)) return;

  const upload = await prisma.uploadObject.findUnique({
    where: { id: uploadId },
    select: { ownerId: true }
  });

  if (!upload) throw new Error("Upload not found");

  if (upload.ownerId !== context.userId) {
    throw new ForbiddenError("You do not have access to this upload");
  }
}

/**
 * Authorize sitter profile access
 * Sitter can access their own profile
 * Admins can access all sitter profiles
 */
export async function authorizeSitterAccess(
  sitterId: string,
  context: AuthContext
): Promise<void> {
  if (isAdmin(context)) return;

  const sitter = await prisma.sitterProfile.findUnique({
    where: { id: sitterId },
    select: { userId: true }
  });

  if (!sitter) throw new Error("Sitter not found");

  if (sitter.userId !== context.userId) {
    throw new ForbiddenError("You do not have access to this sitter profile");
  }
}

/**
 * Authorize society access
 * Society members can access their society
 * Admins can access all societies
 */
export async function authorizeSocietyAccess(
  societyId: string,
  context: AuthContext
): Promise<void> {
  if (isAdmin(context)) return;

  const membership = await prisma.societyMember.findFirst({
    where: {
      societyId,
      userId: context.userId,
      status: "ACTIVE"
    }
  });

  if (!membership) {
    throw new ForbiddenError("You do not have access to this society");
  }
}

/**
 * Authorize partner access
 * Partner managers can access their partners
 * Admins can access all partners
 */
export async function authorizePartnerAccess(
  partnerId: string,
  context: AuthContext
): Promise<void> {
  if (isAdmin(context) || hasRole(context, "PARTNER_MANAGER")) return;

  throw new ForbiddenError("You do not have access to this partner");
}

/**
 * Authorize organization access (B2B)
 * Organization owner can access their org
 * Programme managers can access assigned orgs
 * Admins can access all orgs
 */
export async function authorizeOrganizationAccess(
  organizationId: string,
  context: AuthContext
): Promise<void> {
  if (isAdmin(context)) return;

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: {
      accountOwnerId: true,
      programmes: {
        where: { accountManagerId: context.userId },
        select: { id: true }
      }
    }
  });

  if (!org) throw new Error("Organization not found");

  // Check if user is the account owner
  if (org.accountOwnerId === context.userId) return;

  // Check if user manages any programme for this org
  if (org.programmes.length > 0) return;

  throw new ForbiddenError("You do not have access to this organization");
}

/**
 * Authorize subscription access
 * User can access their own subscriptions
 * Admins can access all subscriptions
 */
export async function authorizeSubscriptionAccess(
  subscriptionId: string,
  context: AuthContext
): Promise<void> {
  if (isAdmin(context)) return;

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    select: { userId: true }
  });

  if (!subscription) throw new Error("Subscription not found");

  if (subscription.userId !== context.userId) {
    throw new ForbiddenError("You do not have access to this subscription");
  }
}

/**
 * Authorize incident access
 * Customer or assigned sitter can access incident
 * Safety admins can access all incidents
 */
export async function authorizeIncidentAccess(
  incidentId: string,
  context: AuthContext
): Promise<void> {
  if (isAdmin(context)) return;

  const incident = await prisma.incident.findUnique({
    where: { id: incidentId },
    select: {
      customerId: true,
      sitterId: true
    }
  });

  if (!incident) throw new Error("Incident not found");

  if (incident.customerId === context.userId || incident.sitterId === context.userId) {
    return;
  }

  throw new ForbiddenError("You do not have access to this incident");
}

/**
 * Authorize tracking session access
 * Customer or assigned sitter can access tracking
 * Admins can access all tracking
 */
export async function authorizeTrackingAccess(
  sessionId: string,
  context: AuthContext
): Promise<void> {
  if (isAdmin(context)) return;

  const session = await prisma.trackingSession.findUnique({
    where: { id: sessionId },
    include: {
      booking: {
        select: {
          customerId: true,
          assignments: {
            where: { status: "ACTIVE" },
            select: { sitterId: true }
          }
        }
      }
    }
  });

  if (!session) throw new Error("Tracking session not found");

  // Check if user is the customer
  if (session.booking.customerId === context.userId) return;

  // Check if user is the active sitter
  const isActiveSitter = session.booking.assignments.some(
    a => a.sitterId === context.userId
  );
  if (isActiveSitter) return;

  throw new ForbiddenError("You do not have access to this tracking session");
}

/**
 * Authorize tenant access (franchise isolation)
 * Operator can only access their assigned territory
 * SUPER_ADMIN can access all tenants
 */
export async function authorizeTenantAccess(
  cityId: string,
  context: AuthContext
): Promise<void> {
  if (context.isSuperAdmin || hasRole(context, "SUPER_ADMIN")) return;

  const cityManager = await prisma.cityManager.findFirst({
    where: {
      userId: context.userId,
      cityId,
      status: "ACTIVE"
    }
  });

  if (!cityManager) {
    throw new ForbiddenError("You do not have access to this city/territory");
  }
}

/**
 * Require specific role(s)
 */
export function requireRole(context: AuthContext, ...roles: Role[]): void {
  if (!hasRole(context, ...roles) && !context.isSuperAdmin) {
    throw new ForbiddenError(`Requires one of: ${roles.join(", ")}`);
  }
}

/**
 * Require admin access
 */
export function requireAdmin(context: AuthContext): void {
  if (!isAdmin(context)) {
    throw new ForbiddenError("Admin access required");
  }
}

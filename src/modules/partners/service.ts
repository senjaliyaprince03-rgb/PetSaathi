import { prisma } from "@/lib/db";
import type { VerificationStatus, ServiceCode } from "@prisma/client";
import { GateStatus } from "@prisma/client";

/**
 * Register a new partner
 */
export async function registerPartner(data: {
  slug: string;
  legalName: string;
  displayName: string;
  category: string;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: any;
}) {
  return await prisma.partner.create({
    data: {
      ...data,
      status: GateStatus.DRAFT,
    },
  });
}

/**
 * Update partner status and details
 */
export async function updatePartner(partnerId: string, data: {
  status?: GateStatus;
  legalName?: string;
  displayName?: string;
  contactEmail?: string;
  contactPhone?: string;
  metadata?: any;
}) {
  return await prisma.partner.update({
    where: { id: partnerId },
    data,
  });
}

/**
 * Add a location to a partner
 */
export async function addPartnerLocation(partnerId: string, data: {
  name: string;
  cityId?: string;
  address: any;
  coordinates?: any;
}) {
  return await prisma.partnerLocation.create({
    data: {
      partnerId,
      ...data,
      status: GateStatus.DRAFT,
    },
  });
}

/**
 * Add a service offering to a partner
 */
export async function addPartnerService(partnerId: string, data: {
  serviceCode: ServiceCode;
  terms?: any;
}) {
  return await prisma.partnerService.create({
    data: {
      partnerId,
      ...data,
      status: GateStatus.DRAFT,
    },
  });
}

/**
 * Record a verification check for a partner
 */
export async function recordPartnerVerification(partnerId: string, data: {
  type: string;
  status: VerificationStatus;
  evidenceRef?: string;
  verifiedBy?: string;
  expiresAt?: Date;
}) {
  return await prisma.$transaction(async (tx) => {
    const verification = await tx.partnerVerification.create({
      data: {
        partnerId,
        ...data,
        verifiedAt: data.status === "PASSED" ? new Date() : null,
      }
    });
    
    // Automatically make partner active if they pass their primary verification
    // This could be made more complex, but for now passing a verification is enough to become active
    if (data.status === "PASSED") {
      await tx.partner.update({
        where: { id: partnerId },
        data: { status: GateStatus.ACTIVE }
      });
    }

    return verification;
  });
}

import { prisma } from "@/lib/db";
import { GateStatus } from "@prisma/client";

/**
 * Register a new residential society for partnerships
 */
export async function registerSociety(data: {
  slug: string;
  name: string;
  city: string;
  locality: string;
  contactName?: string;
  contactPhone?: string;
}) {
  return await prisma.society.create({
    data: {
      ...data,
      status: "DRAFT",
    },
  });
}

/**
 * Add a user as a member/resident of a society
 */
export async function addSocietyMember(params: {
  societyId: string;
  userId: string;
  unitRef?: string;
}) {
  return await prisma.societyMember.upsert({
    where: {
      societyId_userId: {
        societyId: params.societyId,
        userId: params.userId,
      },
    },
    update: {
      unitRef: params.unitRef,
      status: "ACTIVE",
    },
    create: {
      societyId: params.societyId,
      userId: params.userId,
      unitRef: params.unitRef,
      status: "ACTIVE",
    },
  });
}

/**
 * Approve a sitter to operate in a specific society (adds them to the local sitter pool)
 */
export async function approveSitterForSociety(params: {
  societyId: string;
  sitterId: string;
  adminId: string;
  notes?: string;
}) {
  return await prisma.societySitterPool.upsert({
    where: {
      societyId_sitterId: {
        societyId: params.societyId,
        sitterId: params.sitterId,
      },
    },
    update: {
      status: GateStatus.ACTIVE,
      approvedBy: params.adminId,
      approvedAt: new Date(),
      notes: params.notes,
    },
    create: {
      societyId: params.societyId,
      sitterId: params.sitterId,
      status: GateStatus.ACTIVE,
      approvedBy: params.adminId,
      approvedAt: new Date(),
      notes: params.notes,
    },
  });
}

/**
 * Remove a sitter from a society pool
 */
export async function revokeSitterFromSociety(params: {
  societyId: string;
  sitterId: string;
}) {
  return await prisma.societySitterPool.update({
    where: {
      societyId_sitterId: {
        societyId: params.societyId,
        sitterId: params.sitterId,
      },
    },
    data: {
      status: GateStatus.CLOSED,
    },
  });
}

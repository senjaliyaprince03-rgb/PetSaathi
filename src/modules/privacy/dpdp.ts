/**
 * Privacy & DPDP Compliance Module
 *
 * Manages:
 * - Granular content consent (photo, testimonial, marketing, ads)
 * - Data Subject Requests (export, deletion, correction)
 * - Consent verification for marketing pipelines
 */

import { prisma } from "@/lib/db";
import type { ConsentPurpose, DataRequestType } from "@prisma/client";

/* ─── Consent Management ────────────────────────────────────── */

export async function grantConsent(params: {
  userId: string;
  purpose: ConsentPurpose;
  consentVersion: string;
  expiresAt?: Date;
  ipAddress?: string;
  userAgent?: string;
}) {
  // Revoke any existing active consent for same purpose first
  await prisma.contentConsentRecord.updateMany({
    where: {
      userId: params.userId,
      purpose: params.purpose,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
      revokedReason: "Superseded by new consent",
    },
  });

  return prisma.contentConsentRecord.create({
    data: {
      userId: params.userId,
      purpose: params.purpose,
      consentVersion: params.consentVersion,
      expiresAt: params.expiresAt,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    },
  });
}

export async function revokeConsent(params: {
  userId: string;
  purpose: ConsentPurpose;
  reason?: string;
}) {
  return prisma.contentConsentRecord.updateMany({
    where: {
      userId: params.userId,
      purpose: params.purpose,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
      revokedReason: params.reason ?? "User revoked",
    },
  });
}

/**
 * Check whether a user has active (non-revoked, non-expired) consent
 * for a given purpose. Use this before including user content in
 * marketing, ads, social features, or third-party sharing.
 */
export async function hasActiveConsent(
  userId: string,
  purpose: ConsentPurpose,
): Promise<boolean> {
  const record = await prisma.contentConsentRecord.findFirst({
    where: {
      userId,
      purpose,
      revokedAt: null,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    select: { id: true },
  });

  return record !== null;
}

export async function getUserConsents(userId: string) {
  return prisma.contentConsentRecord.findMany({
    where: { userId },
    orderBy: { grantedAt: "desc" },
  });
}

/* ─── Data Subject Requests (DSR) ────────────────────────── */

/**
 * File a Data Subject Request. DPDP mandates response within
 * a reasonable period; we default the due date to 30 days.
 */
export async function fileDataSubjectRequest(params: {
  userId: string;
  requestType: DataRequestType;
  description?: string;
}) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  return prisma.dataSubjectRequest.create({
    data: {
      userId: params.userId,
      requestType: params.requestType,
      description: params.description,
      dueDate,
    },
  });
}

export async function listPendingDSRs() {
  return prisma.dataSubjectRequest.findMany({
    where: {
      status: { in: ["PENDING_DSR", "IN_PROGRESS_DSR"] },
    },
    include: {
      user: { select: { displayName: true, email: true } },
    },
    orderBy: { dueDate: "asc" },
  });
}

export async function updateDSRStatus(params: {
  id: string;
  status: "IN_PROGRESS_DSR" | "COMPLETED_DSR" | "REJECTED_DSR";
  handledById: string;
  responseNotes?: string;
}) {
  return prisma.dataSubjectRequest.update({
    where: { id: params.id },
    data: {
      status: params.status,
      handledById: params.handledById,
      responseNotes: params.responseNotes,
      completedAt:
        params.status === "COMPLETED_DSR" || params.status === "REJECTED_DSR"
          ? new Date()
          : undefined,
    },
  });
}

/* ─── Data Retention ──────────────────────────────────────── */

export async function getRetentionPolicies() {
  return prisma.dataRetentionPolicy.findMany({
    where: { isActive: true },
    orderBy: { entityType: "asc" },
  });
}

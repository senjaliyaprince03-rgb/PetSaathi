import { randomUUID } from "node:crypto";

import type { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { consumeRateLimit } from "@/modules/security/rate-limit";
import { createUploadToken } from "@/modules/storage/gridfs";

const uploadSchema = z.object({ purpose: z.enum(["PET_PHOTO", "SITTER_EVIDENCE", "REPORT_MEDIA", "INCIDENT_EVIDENCE"]), resourceId: z.string().uuid(), mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]), sizeBytes: z.number().int().positive().max(15 * 1024 * 1024) });
const incidentRoles: Role[] = ["OPERATIONS_ADMIN", "SAFETY_ADMIN", "SUPER_ADMIN"];
const extensionByMime = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf" } as const;

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = uploadSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { purpose, resourceId, mimeType, sizeBytes } = parsed.data;

  if (purpose === "PET_PHOTO" && (mimeType === "application/pdf" || sizeBytes > 8 * 1024 * 1024)) return NextResponse.json({ error: "unsupported_pet_media" }, { status: 422 });
  const authorised = await authoriseUpload(identity.id, identity.roles, purpose, resourceId);
  if (!authorised) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const rate = await consumeRateLimit("upload-sign-user", identity.id, 30, 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });

  const objectPath = `${purpose.toLowerCase()}/${resourceId}/${randomUUID()}.${extensionByMime[mimeType]}`;

  const upload = await prisma.$transaction(async (tx) => {
    const created = await tx.uploadObject.create({ data: { ownerId: identity.id, purpose, resourceId, quarantinePath: objectPath, mimeType, sizeBytes } });
    await tx.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles[0], action: "upload.quarantine_url_issued", resourceType: purpose.toLowerCase(), resourceId, after: { uploadId: created.id, objectPath, mimeType, sizeBytes, bucket: "upload-quarantine" } } });
    return created;
  });
  const token = createUploadToken(upload.id);
  return NextResponse.json({ upload: { id: upload.id, bucket: "upload-quarantine", objectPath, signedUrl: `/api/uploads/${upload.id}?token=${encodeURIComponent(token)}`, token, mimeType, maxBytes: purpose === "PET_PHOTO" ? 8 * 1024 * 1024 : 15 * 1024 * 1024 }, scanStatus: "required" });
}

async function authoriseUpload(userId: string, roles: Role[], purpose: z.infer<typeof uploadSchema>["purpose"], resourceId: string) {
  if (purpose === "PET_PHOTO") return Boolean(await prisma.pet.findFirst({ where: { id: resourceId, ownerId: userId, active: true }, select: { id: true } }));
  if (purpose === "SITTER_EVIDENCE") return Boolean(await prisma.sitterProfile.findFirst({ where: { id: resourceId, userId }, select: { id: true } }));
  if (purpose === "REPORT_MEDIA") return Boolean(await prisma.bookingAssignment.findFirst({ where: { id: resourceId, sitter: { userId }, status: "ACTIVE", booking: { status: { in: ["IN_PROGRESS", "REPORT_PENDING"] } } }, select: { id: true } }));
  const incidentAdmin = roles.some((role) => incidentRoles.includes(role));
  return Boolean(await prisma.incident.findFirst({
    where: {
      id: resourceId,
      ...(incidentAdmin ? {} : { OR: [
          { customerId: userId },
          { booking: { assignments: { some: { sitter: { userId }, status: { in: ["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"] } } } } }
        ] })
    },
    select: { id: true }
  }));
}

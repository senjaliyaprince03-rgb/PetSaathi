import { timingSafeEqual } from "node:crypto";
import { writeFile, unlink } from "node:fs/promises";

import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { deleteGridFsObject, promoteGridFsObject, readGridFsObject } from "@/modules/storage/gridfs";
import NodeClam from "clamscan";

const scanSchema = z.object({
  uploadId: z.string().uuid(),
  verdict: z.enum(["CLEAN", "MALICIOUS", "UNSCANNABLE"]),
  detectedMime: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]).optional(),
  sha256: z.string().regex(/^[a-f0-9]{64}$/i).optional(),
  provider: z.string().trim().min(2).max(80),
  details: z.record(z.unknown()).optional(),
});

const destinationByPurpose: Record<string, string> = {
  PET_PHOTO: "pet-media",
  SITTER_EVIDENCE: "identity-evidence",
  REPORT_MEDIA: "care-reports",
  INCIDENT_EVIDENCE: "incident-evidence",
};

// Initialize ClamAV client (connects to ClamAV daemon via TCP)
async function getClamAVClient() {
  const clamscan = await new NodeClam().init({
    clamdscan: process.env.CLAMAV_HOST
      ? {
          host: process.env.CLAMAV_HOST ?? "localhost",
          port: Number(process.env.CLAMAV_PORT ?? 3310),
          timeout: 60000, // 60 second scan timeout
        }
      : undefined,
  });
  return clamscan;
}

async function scanFileWithClamAV(filePath: string): Promise<{ isInfected: boolean; viruses: string[] }> {
  const clamscan = await getClamAVClient();
  const result = await clamscan.isInfected(filePath);
  // clamscan.isInfected returns { file, isInfected: boolean|null, viruses: string[] }
  // isInfected can be true, false, or null (timeout/error)
  return { isInfected: result.isInfected === true, viruses: result.viruses ?? [] };
}

export async function POST(request: Request) {
  const secret = process.env.SCANNER_CALLBACK_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !token || !sameSecret(secret, token)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = scanSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_scan_result", issues: parsed.error.flatten() }, { status: 422 });
  const upload = await prisma.uploadObject.findUnique({ where: { id: parsed.data.uploadId } });
  if (!upload) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (upload.status === "PROMOTED" || upload.status === "REJECTED" || upload.status === "DELETED") return NextResponse.json({ accepted: true, duplicate: true, status: upload.status });
  const clean = parsed.data.verdict === "CLEAN" && parsed.data.detectedMime === upload.mimeType;
  const scanResult = { verdict: parsed.data.verdict, detectedMime: parsed.data.detectedMime, details: parsed.data.details } as Prisma.InputJsonValue;
  if (!clean) {
    await deleteGridFsObject(upload.id, "upload-quarantine");
    await prisma.uploadObject.update({ where: { id: upload.id }, data: { status: "REJECTED", scannerProvider: parsed.data.provider, scanResult, sha256: parsed.data.sha256, scannedAt: new Date() } });
    return NextResponse.json({ accepted: true, status: "REJECTED" });
  }
  const destinationBucket = destinationByPurpose[upload.purpose];
  if (!destinationBucket) return NextResponse.json({ error: "unsupported_purpose" }, { status: 422 });
  const destinationPath = upload.quarantinePath.replace(`${upload.purpose.toLowerCase()}/`, "");
  const promoted = await promoteGridFsObject({ uploadId: upload.id, fromBucket: "upload-quarantine", toBucket: destinationBucket, destinationPath, contentType: upload.mimeType });
  if (!promoted) return NextResponse.json({ error: "quarantine_object_unavailable" }, { status: 409 });
  await prisma.$transaction(async (tx) => {
    await tx.uploadObject.update({ where: { id: upload.id }, data: { status: "PROMOTED", destinationBucket, destinationPath, scannerProvider: parsed.data.provider, scanResult, sha256: parsed.data.sha256, scannedAt: new Date(), promotedAt: new Date() } });
    if (upload.purpose === "INCIDENT_EVIDENCE") {
      await tx.incidentEvidence.create({ data: { incidentId: upload.resourceId, uploadId: upload.id, evidenceType: "FILE_UPLOAD", status: "PROMOTED", collectedBy: upload.ownerId } });
      await tx.incidentEvent.create({ data: { incidentId: upload.resourceId, actorId: upload.ownerId, type: "EVIDENCE_PROMOTED", details: { uploadId: upload.id, mimeType: upload.mimeType, sha256: parsed.data.sha256 } } });
    }
    await tx.auditLog.create({ data: { actorId: upload.ownerId, action: "upload.scan_promoted", resourceType: upload.purpose.toLowerCase(), resourceId: upload.resourceId, after: { uploadId: upload.id, destinationBucket, destinationPath, sha256: parsed.data.sha256 } } });
  });
  return NextResponse.json({ accepted: true, status: "PROMOTED", destination: { bucket: destinationBucket, path: destinationPath } });
}

// Internal endpoint for triggering ClamAV scan on uploaded file
export async function PUT(request: Request) {
  const secret = process.env.CLAMAV_INTERNAL_SECRET ?? process.env.SCANNER_CALLBACK_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !token || !sameSecret(secret, token)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { uploadId } = await request.json().catch(() => null);
  if (!uploadId) return NextResponse.json({ error: "missing_uploadId" }, { status: 400 });

  const upload = await prisma.uploadObject.findUnique({ where: { id: uploadId } });
  if (!upload) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (upload.status !== "QUARANTINED") return NextResponse.json({ error: "invalid_status", status: upload.status }, { status: 409 });

  // Download file from quarantine to temp path for scanning
  const tempPath = `/tmp/${upload.id}`;
  const buffer = await readGridFsObject(upload.id, "upload-quarantine");
  if (!buffer) return NextResponse.json({ error: "quarantine_object_unavailable" }, { status: 404 });

  await writeFile(tempPath, buffer);

  try {
    const { isInfected, viruses } = await scanFileWithClamAV(tempPath);

    if (isInfected) {
      // Mark upload as rejected — do NOT expose to users
      await prisma.uploadObject.update({
        where: { id: uploadId },
        data: {
          status: "REJECTED",
          scanResult: `Virus detected: ${viruses.join(", ")}`,
          scannedAt: new Date(),
        },
      });
      console.error(`[ClamAV] VIRUS DETECTED in upload ${uploadId}: ${viruses.join(", ")}`);
      return NextResponse.json({ scanned: true, isInfected: true, viruses });
    } else {
      // Mark upload as clean — safe to promote
      await prisma.uploadObject.update({
        where: { id: uploadId },
        data: {
          status: "CLEAN",
          scanResult: "No threats detected",
          scannedAt: new Date(),
        },
      });
      return NextResponse.json({ scanned: true, isInfected: false });
    }
  } catch (error) {
    console.error(`[ClamAV] Scan failed for upload ${uploadId}:`, error);
    await prisma.uploadObject.update({
      where: { id: uploadId },
      data: {
        status: "REJECTED",
        scanResult: `Scan error: ${error instanceof Error ? error.message : "Unknown error"}`,
        scannedAt: new Date(),
      },
    });
    return NextResponse.json({ error: "scan_failed" }, { status: 500 });
  } finally {
    // Clean up temp file
    try { await unlink(tempPath); } catch {}
  }
}

function sameSecret(expected: string, received: string) { const expectedBytes = Buffer.from(expected); const receivedBytes = Buffer.from(received); return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes); }

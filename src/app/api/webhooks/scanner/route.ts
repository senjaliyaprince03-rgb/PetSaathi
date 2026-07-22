import { timingSafeEqual } from "node:crypto";

import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const scanSchema = z.object({ uploadId: z.string().uuid(), verdict: z.enum(["CLEAN", "MALICIOUS", "UNSCANNABLE"]), detectedMime: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]).optional(), sha256: z.string().regex(/^[a-f0-9]{64}$/i).optional(), provider: z.string().trim().min(2).max(80), details: z.record(z.unknown()).optional() });

const destinationByPurpose: Record<string, string> = { PET_PHOTO: "pet-media", SITTER_EVIDENCE: "identity-evidence", REPORT_MEDIA: "care-reports", INCIDENT_EVIDENCE: "incident-evidence" };

export async function POST(request: Request) {
  const secret = process.env.SCANNER_CALLBACK_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !token || !sameSecret(secret, token)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = scanSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_scan_result", issues: parsed.error.flatten() }, { status: 422 });
  const upload = await prisma.uploadObject.findUnique({ where: { id: parsed.data.uploadId } });
  if (!upload) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (upload.status === "PROMOTED" || upload.status === "REJECTED" || upload.status === "DELETED") return NextResponse.json({ accepted: true, duplicate: true, status: upload.status });
  const supabase = createSupabaseAdminClient();
  if (!supabase) return NextResponse.json({ error: "storage_not_configured" }, { status: 503 });
  const clean = parsed.data.verdict === "CLEAN" && parsed.data.detectedMime === upload.mimeType;
  const scanResult = { verdict: parsed.data.verdict, detectedMime: parsed.data.detectedMime, details: parsed.data.details } as Prisma.InputJsonValue;
  if (!clean) {
    await supabase.storage.from("upload-quarantine").remove([upload.quarantinePath]);
    await prisma.uploadObject.update({ where: { id: upload.id }, data: { status: "REJECTED", scannerProvider: parsed.data.provider, scanResult, sha256: parsed.data.sha256, scannedAt: new Date() } });
    return NextResponse.json({ accepted: true, status: "REJECTED" });
  }
  const destinationBucket = destinationByPurpose[upload.purpose];
  if (!destinationBucket) return NextResponse.json({ error: "unsupported_purpose" }, { status: 422 });
  const destinationPath = upload.quarantinePath.replace(`${upload.purpose.toLowerCase()}/`, "");
  const download = await supabase.storage.from("upload-quarantine").download(upload.quarantinePath);
  if (download.error || !download.data) return NextResponse.json({ error: "quarantine_object_unavailable" }, { status: 409 });
  const promoted = await supabase.storage.from(destinationBucket).upload(destinationPath, download.data, { contentType: upload.mimeType, upsert: false });
  if (promoted.error) return NextResponse.json({ error: "promotion_failed" }, { status: 502 });
  await supabase.storage.from("upload-quarantine").remove([upload.quarantinePath]);
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

function sameSecret(expected: string, received: string) { const expectedBytes = Buffer.from(expected); const receivedBytes = Buffer.from(received); return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes); }

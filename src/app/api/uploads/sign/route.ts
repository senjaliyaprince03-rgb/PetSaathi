import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { createUploadToken } from "@/modules/storage/gridfs";

export const dynamic = "force-dynamic";

const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

const signSchema = z.object({
  // Only incident evidence has an authorized caller today (admin safety
  // workflow). Extend alongside the scanner webhook's destinationByPurpose
  // map once other surfaces ship.
  purpose: z.literal("INCIDENT_EVIDENCE"),
  resourceId: z.string().min(1),
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf"]),
  sizeBytes: z.coerce.number().int().min(1).max(MAX_UPLOAD_BYTES),
});

const authorizedRoles = ["SAFETY_ADMIN", "OPERATIONS_ADMIN", "SUPER_ADMIN"] as const;

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!hasAnyRole(identity, authorizedRoles)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const parsed = signSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { purpose, resourceId, mimeType, sizeBytes } = parsed.data;
  const extension = mimeType === "application/pdf" ? "pdf" : mimeType.split("/")[1];
  const uploadId = randomUUID();

  const upload = await prisma.uploadObject.create({
    data: {
      id: uploadId,
      ownerId: identity.id,
      purpose,
      resourceId,
      quarantinePath: `${purpose.toLowerCase()}/${uploadId}.${extension}`,
      mimeType,
      sizeBytes,
      status: "QUARANTINED",
    },
    select: { id: true },
  });

  const token = createUploadToken(upload.id);
  // Relative URL on purpose: the browser PUTs the raw bytes back to this same
  // origin, where middleware enforces the 16 MB signed-upload payload limit
  // and /api/uploads/[id] verifies the HMAC token before touching GridFS.
  return NextResponse.json(
    {
      upload: {
        id: upload.id,
        signedUrl: `/api/uploads/${upload.id}?token=${encodeURIComponent(token)}`,
        expiresInseconds: 600,
      },
    },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { storeGridFsObject, verifyUploadToken } from "@/modules/storage/gridfs";

const paramsSchema = z.object({ id: z.string().uuid() });

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const parsedParams = paramsSchema.safeParse(await context.params);
  if (!parsedParams.success) return NextResponse.json({ error: "invalid_upload" }, { status: 422 });

  const token = new URL(request.url).searchParams.get("token");
  if (!verifyUploadToken(parsedParams.data.id, token)) {
    return NextResponse.json({ error: "invalid_or_expired_upload_token" }, { status: 401 });
  }

  const upload = await prisma.uploadObject.findUnique({ where: { id: parsedParams.data.id } });
  if (!upload || upload.status !== "QUARANTINED") {
    return NextResponse.json({ error: "upload_not_available" }, { status: 409 });
  }
  if (request.headers.get("content-type")?.split(";", 1)[0] !== upload.mimeType) {
    return NextResponse.json({ error: "content_type_mismatch" }, { status: 422 });
  }

  const bytes = Buffer.from(await request.arrayBuffer());
  if (bytes.byteLength !== upload.sizeBytes || bytes.byteLength > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "size_mismatch" }, { status: 422 });
  }

  try {
    await storeGridFsObject({
      uploadId: upload.id,
      bucket: "upload-quarantine",
      objectPath: upload.quarantinePath,
      contentType: upload.mimeType,
      bytes,
    });
    return NextResponse.json({ uploaded: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "upload_failed" }, { status: 409 });
  }
}

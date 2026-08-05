import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { deleteGridFsObject } from "@/modules/storage/gridfs";

export async function POST(request: Request) {
  return enforceUploadRetention(request);
}

export async function GET(request: Request) {
  return enforceUploadRetention(request);
}

async function enforceUploadRetention(request: Request) {
  const secret = process.env.CRON_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !token || !sameSecret(secret, token)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const cutoff = new Date(Date.now() - 24 * 60 * 60_000);
  const stale = await prisma.uploadObject.findMany({ where: { status: "QUARANTINED", createdAt: { lt: cutoff } }, orderBy: { createdAt: "asc" }, take: 100, select: { id: true, quarantinePath: true } });
  if (!stale.length) return NextResponse.json({ deleted: 0, cutoff });
  await Promise.all(stale.map(({ id }) => deleteGridFsObject(id, "upload-quarantine")));
  const deleted = await prisma.uploadObject.updateMany({ where: { id: { in: stale.map(({ id }) => id) }, status: "QUARANTINED" }, data: { status: "DELETED" } });
  return NextResponse.json({ deleted: deleted.count, cutoff });
}

function sameSecret(expected: string, received: string) { const expectedBytes = Buffer.from(expected); const receivedBytes = Buffer.from(received); return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes); }

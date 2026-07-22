import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { consumeRateLimit } from "@/modules/security/rate-limit";

const schema = z.object({ type: z.enum(["CORRECTION", "EXPORT", "DELETION"]), details: z.string().trim().min(20).max(2000) });

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const requests = await prisma.accountRequest.findMany({ where: { userId: identity.id }, orderBy: { requestedAt: "desc" }, take: 25, select: { id: true, reference: true, type: true, status: true, resolution: true, requestedAt: true, fulfilledAt: true } });
  return NextResponse.json({ requests }, { headers: { "Cache-Control": "private, no-store" } });
}

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const rate = await consumeRateLimit("account-request-user", identity.id, 3, 24 * 60 * 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "too_many_requests" }, { status: 429, headers: { "Retry-After": String(rate.retryAfterSeconds) } });
  const existing = await prisma.accountRequest.findFirst({ where: { userId: identity.id, type: parsed.data.type, status: { in: ["RECEIVED", "IDENTITY_VERIFIED", "IN_REVIEW", "APPROVED"] } } });
  if (existing) return NextResponse.json({ error: "request_already_open", reference: existing.reference }, { status: 409 });
  const created = await prisma.accountRequest.create({ data: { reference: `AR-${randomUUID().slice(0, 8).toUpperCase()}`, userId: identity.id, type: parsed.data.type, details: { request: parsed.data.details } } });
  return NextResponse.json({ request: { id: created.id, reference: created.reference, status: created.status } }, { status: 201 });
}

import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const schema = z.object({ reviewerName: z.string().trim().min(3).max(120), credentials: z.string().trim().min(5).max(300), scope: z.string().trim().min(10).max(500), verdict: z.enum(["APPROVED", "CHANGES_REQUIRED"]), notes: z.string().trim().min(20).max(2000) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["CONTENT_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const content = await prisma.contentEntry.findUnique({ where: { id }, select: { id: true } });
  if (!content) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const review = await prisma.expertReview.create({ data: { reviewerId: identity.id, ...parsed.data, entries: parsed.data.verdict === "APPROVED" ? { connect: { id } } : undefined } });
  return NextResponse.json({ review: { id: review.id, verdict: review.verdict } }, { status: 201 });
}

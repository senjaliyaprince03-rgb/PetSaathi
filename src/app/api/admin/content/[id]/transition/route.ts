import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { canTransitionContent } from "@/modules/content/state-machine";

const schema = z.object({ toState: z.enum(["DRAFT", "IN_REVIEW", "APPROVED", "PUBLISHED", "ARCHIVED"]), reason: z.string().trim().min(10).max(1000) });

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["CONTENT_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const content = await prisma.contentEntry.findUnique({ where: { id }, include: { expertReview: { select: { verdict: true } }, versions: { orderBy: { version: "desc" }, take: 1 } } });
  if (!content) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (!canTransitionContent(content.status, parsed.data.toState)) return NextResponse.json({ error: "invalid_content_transition" }, { status: 409 });
  const expertRequired = /health|medical|safety/i.test(content.type);
  if (parsed.data.toState === "PUBLISHED" && expertRequired && content.expertReview?.verdict !== "APPROVED") return NextResponse.json({ error: "approved_expert_review_required" }, { status: 409 });
  const latest = content.versions[0];
  await prisma.$transaction([
    prisma.contentEntry.update({ where: { id }, data: { status: parsed.data.toState, publishedAt: parsed.data.toState === "PUBLISHED" ? new Date() : parsed.data.toState === "DRAFT" ? null : undefined } }),
    ...(latest ? [prisma.contentVersion.create({ data: { contentId: id, version: latest.version + 1, title: content.title, excerpt: content.excerpt, body: content.body as Prisma.InputJsonValue, status: parsed.data.toState, authorId: identity.id } })] : []),
    prisma.auditLog.create({ data: { actorId: identity.id, actorRole: identity.roles[0], action: "content.transition", resourceType: "content", resourceId: id, before: { status: content.status }, after: { status: parsed.data.toState }, reason: parsed.data.reason } })
  ]);
  return NextResponse.json({ transitioned: true, status: parsed.data.toState });
}

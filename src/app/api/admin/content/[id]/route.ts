import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { createContentSchema } from "@/modules/content/input";

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["CONTENT_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = createContentSchema.omit({ slug: true }).safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const { id } = await context.params;
  const current = await prisma.contentEntry.findUnique({ where: { id }, select: { status: true, versions: { orderBy: { version: "desc" }, take: 1, select: { version: true } } } });
  if (!current) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (current.status !== "DRAFT") return NextResponse.json({ error: "only_drafts_are_editable" }, { status: 409 });
  const version = (current.versions[0]?.version ?? 0) + 1;
  await prisma.contentEntry.update({ where: { id }, data: { ...parsed.data, versions: { create: { version, title: parsed.data.title, excerpt: parsed.data.excerpt, body: parsed.data.body, status: "DRAFT", authorId: identity.id } } } });
  return NextResponse.json({ saved: true, version });
}

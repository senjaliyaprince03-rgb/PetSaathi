import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
import { createContentSchema } from "@/modules/content/input";

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["CONTENT_ADMIN", "SUPER_ADMIN"])) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const parsed = createContentSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  const content = await prisma.contentEntry.create({ data: { ...parsed.data, authorId: identity.id, status: "DRAFT", versions: { create: { version: 1, title: parsed.data.title, excerpt: parsed.data.excerpt, body: parsed.data.body, status: "DRAFT", authorId: identity.id } } } });
  return NextResponse.json({ content: { id: content.id, slug: content.slug, status: content.status } }, { status: 201 });
}

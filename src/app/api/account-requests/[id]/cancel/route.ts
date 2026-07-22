import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const updated = await prisma.accountRequest.updateMany({ where: { id, userId: identity.id, status: "RECEIVED" }, data: { status: "CANCELLED" } });
  if (!updated.count) return NextResponse.json({ error: "request_not_cancellable" }, { status: 409 });
  return NextResponse.json({ cancelled: true });
}

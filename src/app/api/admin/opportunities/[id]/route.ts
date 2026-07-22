import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.some((r) => ["PARTNER_MANAGER", "SUPER_ADMIN"].includes(r))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const body = await req.json();
  const updated = await prisma.b2bOpportunity.update({
    where: { id },
    data: {
      estimatedValue: body.estimatedValue,
      probability: body.probability,
      expectedCloseDate: body.expectedCloseDate ? new Date(body.expectedCloseDate) : undefined,
      leadSource: body.leadSource,
      nextAction: body.nextAction,
      nextActionAt: body.nextActionAt ? new Date(body.nextActionAt) : undefined,
      notes: body.notes,
    },
  });
  return NextResponse.json(updated);
}

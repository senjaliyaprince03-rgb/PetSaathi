import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

const inputSchema = z.object({
  visitorApprovalRequired: z.boolean(),
  sitterRegistrationRequired: z.boolean(),
  identityDocumentRequired: z.boolean(),
  approvedGates: z.string().transform(val => val.split(",").map(v => v.trim()).filter(Boolean)),
  petLiftRules: z.string().optional(),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["SOCIETY_MANAGER", "SUPER_ADMIN"])) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  // Get manager's society
  const membership = await prisma.societyMember.findFirst({
    where: { userId: identity.id },
  });

  if (!membership) {
    return NextResponse.json({ error: "not_linked_to_society" }, { status: 403 });
  }

  const parsed = inputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });
  }

  const data = parsed.data;

  const rule = await prisma.societyAccessRule.upsert({
    where: { societyId: membership.societyId },
    update: {
      visitorApprovalRequired: data.visitorApprovalRequired,
      sitterRegistrationRequired: data.sitterRegistrationRequired,
      identityDocumentRequired: data.identityDocumentRequired,
      approvedGates: data.approvedGates,
      petLiftRules: data.petLiftRules,
      lastVerifiedAt: new Date(),
    },
    create: {
      societyId: membership.societyId,
      visitorApprovalRequired: data.visitorApprovalRequired,
      sitterRegistrationRequired: data.sitterRegistrationRequired,
      identityDocumentRequired: data.identityDocumentRequired,
      approvedGates: data.approvedGates,
      petLiftRules: data.petLiftRules,
      lastVerifiedAt: new Date(),
    },
  });

  return NextResponse.json({ rule });
}

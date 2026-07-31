import { PrismaClient, OperatorStatus } from "@prisma/client";
import { ScaleError } from "./city-ops.service";

const prisma = new PrismaClient();

export async function onboardPartner(
  partnerId: string
) {
  const partner = await prisma.operatingPartner.findUnique({
    where: { id: partnerId }
  });

  if (!partner) {
    throw new ScaleError("not_found", "Operating Partner not found.");
  }

  if (partner.status !== OperatorStatus.PROSPECT_OP && partner.status !== OperatorStatus.ONBOARDING_OP) {
    throw new ScaleError("invalid_state", "Only PROSPECT or ONBOARDING partners can be made ACTIVE.");
  }

  return await prisma.operatingPartner.update({
    where: { id: partnerId },
    data: {
      status: OperatorStatus.ACTIVE_OP,
      onboardedAt: new Date()
    }
  });
}

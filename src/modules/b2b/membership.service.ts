import type { EligibilityMethod} from "@prisma/client";
import { PrismaClient, MemberVerificationStatus, ProgrammeStatus } from "@prisma/client";
import { B2bError } from "./contract.service";

const prisma = new PrismaClient();

export async function enrollMember(
  programmeId: string,
  customerId: string,
  verificationMethod: EligibilityMethod
) {
  const programme = await prisma.partnerProgramme.findUnique({
    where: { id: programmeId }
  });

  if (!programme) {
    throw new B2bError("not_found", "Partner programme not found.");
  }
  
  if (programme.status !== ProgrammeStatus.ACTIVE_PROGRAMME) {
    throw new B2bError("invalid_state", "Programme is not active.");
  }

  // Check if user already enrolled
  const existing = await prisma.programmeMembership.findFirst({
    where: { programmeId, customerId }
  });

  if (existing) {
    throw new B2bError("already_exists", "Member is already enrolled in this programme.");
  }

  return await prisma.programmeMembership.create({
    data: {
      programmeId,
      customerId,
      verificationMethod,
      verificationStatus: MemberVerificationStatus.PENDING_VERIFICATION
    }
  });
}

export async function verifyMembership(membershipId: string, verifiedAt: Date = new Date()) {
  const membership = await prisma.programmeMembership.findUnique({
    where: { id: membershipId }
  });

  if (!membership) {
    throw new B2bError("not_found", "Membership not found.");
  }

  return await prisma.programmeMembership.update({
    where: { id: membershipId },
    data: {
      verificationStatus: MemberVerificationStatus.VERIFIED,
      verifiedAt,
      // Typically eligibility expiry would be verifiedAt + some period, e.g., 1 year
      eligibilityExpiry: new Date(verifiedAt.getTime() + 365 * 24 * 60 * 60 * 1000)
    }
  });
}

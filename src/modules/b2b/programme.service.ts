import type { ProgrammeType, EligibilityMethod} from "@prisma/client";
import { PrismaClient, ProgrammeStatus } from "@prisma/client";
import { B2bError } from "./contract.service";

const prisma = new PrismaClient();

export async function createProgramme(
  organizationId: string,
  contractId: string | undefined,
  name: string,
  slug: string,
  programmeType: ProgrammeType,
  cityScope: string[],
  eligibilityMethod: EligibilityMethod,
  eligibilityDomain?: string,
  startDate?: Date,
  endDate?: Date
) {
  // Validate slug format? Just let unique constraint handle collision
  
  if (endDate && startDate && endDate <= startDate) {
    throw new B2bError("invalid_date_window", "End date must be after start date.");
  }

  return await prisma.partnerProgramme.create({
    data: {
      organizationId,
      contractId,
      name,
      slug,
      programmeType,
      cityScope,
      eligibilityMethod,
      eligibilityDomain,
      startDate,
      endDate,
      status: ProgrammeStatus.DRAFT_PROGRAMME
    }
  });
}

export async function activateProgramme(programmeId: string) {
  const programme = await prisma.partnerProgramme.findUnique({
    where: { id: programmeId }
  });

  if (!programme) {
    throw new B2bError("not_found", "Partner programme not found.");
  }

  if (programme.status !== ProgrammeStatus.DRAFT_PROGRAMME) {
    throw new B2bError("invalid_state", "Only draft programmes can be activated.");
  }

  return await prisma.partnerProgramme.update({
    where: { id: programmeId },
    data: {
      status: ProgrammeStatus.ACTIVE_PROGRAMME
    }
  });
}

export async function getProgrammeBySlug(slug: string) {
  const programme = await prisma.partnerProgramme.findUnique({
    where: { slug }
  });

  if (!programme) {
    throw new B2bError("not_found", "Partner programme not found.");
  }

  return programme;
}

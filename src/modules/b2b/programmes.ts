import { prisma } from "@/lib/db";
import type { 
  ProgrammeType, 
  EligibilityMethod, 
  ProgrammeStatus, 
  MemberVerificationStatus 
} from "@prisma/client";

export async function createProgramme(data: {
  organizationId: string;
  contractId?: string;
  name: string;
  slug: string;
  programmeType: ProgrammeType;
  cityScope?: string[];
  eligibilityMethod?: EligibilityMethod;
  eligibilityDomain?: string;
  startDate?: Date;
  endDate?: Date;
  accountManagerId?: string;
  metadata?: unknown;
}) {
  return await prisma.partnerProgramme.create({
    data: {
      ...data,
      metadata: data.metadata ? (data.metadata as unknown) : undefined,
      status: "DRAFT_PROGRAMME",
    },
  });
}

export async function activateProgramme(id: string) {
  const programme = await prisma.partnerProgramme.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!programme) {
    throw new Error("Programme not found");
  }

  if (programme.status !== "DRAFT_PROGRAMME" && programme.status !== "PAUSED_PROGRAMME") {
    throw new Error("Programme can only be activated from DRAFT or PAUSED status");
  }

  return await prisma.partnerProgramme.update({
    where: { id },
    data: { status: "ACTIVE_PROGRAMME" },
  });
}

export async function pauseProgramme(id: string) {
  const programme = await prisma.partnerProgramme.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!programme) {
    throw new Error("Programme not found");
  }

  if (programme.status !== "ACTIVE_PROGRAMME") {
    throw new Error("Programme can only be paused from ACTIVE status");
  }

  return await prisma.partnerProgramme.update({
    where: { id },
    data: { status: "PAUSED_PROGRAMME" },
  });
}

export async function getProgrammeBySlug(slug: string) {
  const programme = await prisma.partnerProgramme.findUnique({
    where: { slug },
    include: {
      organization: {
        select: {
          displayName: true,
          organizationType: true,
        },
      },
      _count: {
        select: {
          memberships: true,
        },
      },
    },
  });

  if (!programme) {
    throw new Error("Programme not found");
  }

  return programme;
}

export async function enrollMember(programmeId: string, customerId: string, verificationMethod?: EligibilityMethod) {
  const programme = await prisma.partnerProgramme.findUnique({
    where: { id: programmeId },
    select: { eligibilityMethod: true },
  });

  if (!programme) {
    throw new Error("Programme not found");
  }

  const isAccessOpen = programme.eligibilityMethod === "OPEN_ACCESS";

  return await prisma.programmeMembership.create({
    data: {
      programmeId,
      customerId,
      verificationMethod: verificationMethod || programme.eligibilityMethod,
      verificationStatus: isAccessOpen ? "VERIFIED" : "PENDING_VERIFICATION",
      verifiedAt: isAccessOpen ? new Date() : null,
      active: true,
    },
  });
}

export async function verifyMember(membershipId: string, verified: boolean) {
  const status: MemberVerificationStatus = verified ? "VERIFIED" : "REJECTED_VERIFICATION";
  const verifiedAt = verified ? new Date() : null;

  return await prisma.programmeMembership.update({
    where: { id: membershipId },
    data: {
      verificationStatus: status,
      verifiedAt,
    },
  });
}

export async function listProgrammeMembers(
  programmeId: string,
  filters?: { status?: MemberVerificationStatus; page?: number; pageSize?: number }
) {
  const page = filters?.page || 1;
  const pageSize = filters?.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const where: any = { programmeId };
  if (filters?.status) {
    where.verificationStatus = filters.status;
  }

  const [items, total] = await Promise.all([
    prisma.programmeMembership.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        customer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.programmeMembership.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function listProgrammes(
  filters: { organizationId?: string; status?: ProgrammeStatus; type?: ProgrammeType; page?: number; pageSize?: number }
) {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const where: any = {};
  if (filters.organizationId) {
    where.organizationId = filters.organizationId;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.type) {
    where.programmeType = filters.type;
  }

  const [items, total] = await Promise.all([
    prisma.partnerProgramme.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        organization: {
          select: {
            displayName: true,
          },
        },
        _count: {
          select: {
            memberships: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.partnerProgramme.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

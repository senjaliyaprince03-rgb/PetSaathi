import { prisma } from "@/lib/db";
import type { B2bOpportunity, OpportunityStage, ProgrammeType } from "@prisma/client";

export const STAGE_TRANSITIONS = {
  TARGET_ACCOUNT: ["CONTACT_IDENTIFIED", "DISQUALIFIED"],
  CONTACT_IDENTIFIED: ["CONTACTED", "DISQUALIFIED"],
  CONTACTED: ["DISCOVERY_SCHEDULED", "DISQUALIFIED", "LOST"],
  DISCOVERY_SCHEDULED: ["QUALIFIED", "DISQUALIFIED", "LOST"],
  QUALIFIED: ["SOLUTION_DESIGNED", "DISQUALIFIED", "LOST"],
  SOLUTION_DESIGNED: ["PROPOSAL_SENT", "LOST"],
  PROPOSAL_SENT: ["PILOT_NEGOTIATION", "COMMERCIAL_NEGOTIATION", "LOST"],
  PILOT_NEGOTIATION: ["PILOT_CONTRACTED", "LOST"],
  PILOT_CONTRACTED: ["PILOT_ACTIVE", "LOST"],
  PILOT_ACTIVE: ["PILOT_REVIEW", "LOST"],
  PILOT_REVIEW: ["COMMERCIAL_NEGOTIATION", "LOST"],
  COMMERCIAL_NEGOTIATION: ["PAID_CONTRACT", "LOST"],
  PAID_CONTRACT: ["ONBOARDING"],
  ONBOARDING: ["ACTIVE_ACCOUNT"],
  ACTIVE_ACCOUNT: ["RENEWAL", "PAUSED_OPP", "CHURNED_OPP"],
  RENEWAL: ["ACTIVE_ACCOUNT", "CHURNED_OPP"],
  DISQUALIFIED: [],
  LOST: [],
  PAUSED_OPP: [],
  CHURNED_OPP: [],
} as Record<OpportunityStage, OpportunityStage[]>;

export async function createOpportunity(data: {
  organizationId: string;
  programmeType: ProgrammeType;
  estimatedValue?: number;
  leadSource?: string;
  ownerId?: string;
  notes?: string;
}): Promise<B2bOpportunity> {
  return prisma.b2bOpportunity.create({
    data: {
      organizationId: data.organizationId,
      programmeType: data.programmeType,
      pipelineStage: "TARGET_ACCOUNT" as OpportunityStage,
      estimatedValue: data.estimatedValue,
      leadSource: data.leadSource,
      ownerId: data.ownerId,
      notes: data.notes,
    },
  });
}

export async function changeStage(
  id: string,
  newStage: OpportunityStage,
  meta?: {
    lossReason?: string;
    nextAction?: string;
    nextActionAt?: Date;
    notes?: string;
  }
): Promise<B2bOpportunity> {
  const opp = await prisma.b2bOpportunity.findUnique({ where: { id } });

  if (!opp) {
    throw new Error(`Opportunity with ID ${id} not found.`);
  }

  const validTransitions = STAGE_TRANSITIONS[opp.pipelineStage];
  if (!validTransitions.includes(newStage)) {
    throw new Error(`Invalid transition from ${opp.pipelineStage} to ${newStage}`);
  }

  return prisma.b2bOpportunity.update({
    where: { id },
    data: {
      pipelineStage: newStage,
      lossReason: meta?.lossReason,
      nextAction: meta?.nextAction,
      nextActionAt: meta?.nextActionAt,
      notes: meta?.notes,
    },
  });
}

export async function listOpportunities(filters: {
  organizationId?: string;
  stage?: OpportunityStage;
  ownerId?: string;
  programmeType?: ProgrammeType;
  page?: number;
  pageSize?: number;
}) {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const where = {
    ...(filters.organizationId && { organizationId: filters.organizationId }),
    ...(filters.stage && { pipelineStage: filters.stage }),
    ...(filters.ownerId && { ownerId: filters.ownerId }),
    ...(filters.programmeType && { programmeType: filters.programmeType }),
  };

  const [items, total] = await Promise.all([
    prisma.b2bOpportunity.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        organization: {
          select: { displayName: true, organizationType: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.b2bOpportunity.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function getPipelineSummary() {
  const groups = await prisma.b2bOpportunity.groupBy({
    by: ["pipelineStage"],
    _count: { _all: true },
    _sum: { estimatedValue: true },
  });

  return groups.map((g) => ({
    stage: g.pipelineStage,
    count: g._count._all,
    totalValue: g._sum.estimatedValue || 0,
  }));
}

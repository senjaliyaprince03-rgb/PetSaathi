import { GateStatus  } from "@prisma/client";

import { prisma } from "@/lib/db";

export class B2BError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "B2BError";
  }
}

export async function getSocietyDashboard(
  societyId: string,
  authorizedScope?: { societyIds?: string[] } | null
) {
  const whereClause: { id: string | { in: string[] } } = { id: societyId };
  if (authorizedScope?.societyIds) {
    if (!authorizedScope.societyIds.includes(societyId)) {
      throw new B2BError("society_not_found", "Society does not exist or access denied");
    }
    whereClause.id = { in: authorizedScope.societyIds };
  }

  const society = await prisma.society.findFirst({
    where: whereClause
  });

  if (!society) {
    throw new B2BError("society_not_found", "Society does not exist");
  }

  const memberCount = await prisma.societyMember.count({
    where: { societyId, status: "ACTIVE" }
  });

  const sitterPoolCount = await prisma.societySitterPool.count({
    where: { societyId, status: GateStatus.ACTIVE }
  });

  const upcomingEvents = await prisma.societyEvent.findMany({
    where: { 
      societyId,
      startsAt: { gte: new Date() }
    },
    orderBy: { startsAt: 'asc' },
    take: 5
  });

  return {
    society,
    stats: {
      memberCount,
      sitterPoolCount
    },
    upcomingEvents
  };
}

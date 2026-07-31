import { PrismaClient, GateStatus } from "@prisma/client";

const prisma = new PrismaClient();

export class B2BError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "B2BError";
  }
}

export async function getSocietyDashboard(societyId: string) {
  const society = await prisma.society.findUnique({
    where: { id: societyId }
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

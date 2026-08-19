import { PrismaClient, ServiceCode } from '@prisma/client';
const prisma = new PrismaClient();
const coreServiceCodes = [ServiceCode.DOG_WALK_30];

async function main() {
  const now = new Date();
  
  const p1 = await prisma.servicePrice.findMany({ where: { variantId: { equals: null } } });
  console.log("variantId: null ->", p1.length);

  const p2 = await prisma.servicePrice.findMany({ where: { OR: [{ expiresAt: { equals: null } }, { expiresAt: { gt: now } }] } });
  console.log("OR expiresAt ->", p2.length);

  const p3 = await prisma.servicePrice.findMany({ where: { serviceType: { active: true } } });
  console.log("serviceType: { active: true } ->", p3.length);

  const p4 = await prisma.servicePrice.findMany({ where: { serviceType: { code: { in: coreServiceCodes } } } });
  console.log("serviceType: { code: { in: coreServiceCodes } } ->", p4.length);
}

main().finally(() => prisma.$disconnect());

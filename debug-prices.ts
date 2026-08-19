import { PrismaClient, ServiceCode } from '@prisma/client';
const prisma = new PrismaClient();
const coreServiceCodes = [ServiceCode.DOG_WALK_30];

async function main() {
  const now = new Date();
  
  const p1 = await prisma.servicePrice.findMany({ 
    where: { 
      effectiveAt: { lte: now }
    } 
  });
  console.log("TEST 1 (effectiveAt only):", p1.length);

  const p2 = await prisma.servicePrice.findMany({ 
    where: { 
      variantId: null, 
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }], 
      serviceType: { active: true, code: { in: coreServiceCodes } } 
    } 
  });
  console.log("TEST 2 (All EXCEPT effectiveAt):", p2.length);

  const p3 = await prisma.servicePrice.findMany({ 
    where: { 
    } 
  });
  console.log("TEST 3 (No where clause):", p3.length);
}

main().finally(() => prisma.$disconnect());

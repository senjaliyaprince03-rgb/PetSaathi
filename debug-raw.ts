import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`SELECT id, variant_id, expires_at FROM service_prices`;
  console.log("RAW SQL:", JSON.stringify(result, null, 2));
}

main().finally(() => prisma.$disconnect());

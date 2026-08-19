import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({where: {email: 'customer@petsaathi.test'}, include: {roles: true}});
  console.log("Found user:", user);
  const dbSessions = await prisma.$runCommandRaw({
    find: "auth_sessions",
    filter: {}
  });
  console.dir(dbSessions.cursor.firstBatch, { depth: null });
  await prisma.$disconnect();
}
main().catch(console.error);

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: { roles: true, sitter: true },
  });
  console.log("USERS_LIST:", JSON.stringify(users.map(u => ({
    email: u.email,
    displayName: u.displayName,
    roles: u.roles.map(r => r.role),
    isSitter: !!u.sitter
  })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

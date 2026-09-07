import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const sitters = await prisma.sitterProfile.findMany({
    include: {
      user: true,
      permissions: { include: { serviceType: true } }
    }
  });

  console.log("SITTERS_DATA:", JSON.stringify(sitters.map(s => ({
    id: s.id,
    userId: s.userId,
    email: s.user?.email,
    displayName: s.user?.displayName,
    status: s.status,
    permissionsCount: s.permissions.length,
    permissions: s.permissions.map(p => ({
      service: p.serviceType?.code,
      status: p.status,
      riskLimit: p.riskLimit
    }))
  })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

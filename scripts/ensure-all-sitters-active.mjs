import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  const serviceTypes = await prisma.serviceType.findMany({ where: { active: true } });
  const sitters = await prisma.sitterProfile.findMany({ include: { user: true } });

  console.log(`Found ${sitters.length} sitters and ${serviceTypes.length} active service types.`);

  for (const sitter of sitters) {
    if (sitter.status !== "APPROVED") {
      await prisma.sitterProfile.update({
        where: { id: sitter.id },
        data: { status: "APPROVED" }
      });
    }

    for (const st of serviceTypes) {
      await prisma.sitterServicePermission.upsert({
        where: {
          sitterId_serviceTypeId: {
            sitterId: sitter.id,
            serviceTypeId: st.id
          }
        },
        update: {
          status: "ACTIVE",
          riskLimit: "RED",
          expiresAt: null
        },
        create: {
          sitterId: sitter.id,
          serviceTypeId: st.id,
          status: "ACTIVE",
          riskLimit: "RED",
          expiresAt: null
        }
      });
    }
  }

  console.log("ALL_SITTERS_ACTIVATED_WITH_FULL_PERMISSIONS");
}

main().catch(console.error).finally(() => prisma.$disconnect());

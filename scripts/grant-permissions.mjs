import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import pkg from "@prisma/client";
const { PrismaClient, PermissionStatus, RiskLevel } = pkg;

const prisma = new PrismaClient();

async function main() {
  // 1. Get all service types
  const serviceTypes = await prisma.serviceType.findMany({
    where: { active: true }
  });

  // 2. Grant all permissions to sitter@petsaathi.com
  const sitterUser = await prisma.user.findUnique({
    where: { email: "sitter@petsaathi.com" },
    include: { sitter: true }
  });

  if (sitterUser && sitterUser.sitter) {
    for (const st of serviceTypes) {
      await prisma.sitterServicePermission.upsert({
        where: {
          sitterId_serviceTypeId: {
            sitterId: sitterUser.sitter.id,
            serviceTypeId: st.id
          }
        },
        update: {
          status: "ACTIVE",
          riskLimit: "RED",
          expiresAt: null
        },
        create: {
          sitterId: sitterUser.sitter.id,
          serviceTypeId: st.id,
          status: "ACTIVE",
          riskLimit: "RED",
          expiresAt: null
        }
      });
    }
    console.log("GRANTED_ALL_PERMISSIONS_TO_SITTER");
  }

  // 3. Inspect the active booking
  const booking = await prisma.booking.findFirst({
    where: { reference: "PS-260827-38D2BC3D" },
    include: { assignments: true, pet: true, serviceType: true }
  });

  console.log("BOOKING_STATUS:", booking?.status, "ASSIGNMENTS:", booking?.assignments);
}

main().catch(console.error).finally(() => prisma.$disconnect());

import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { offerRankedAssignment } from "../src/modules/matching/offer-assignment.js";

const prisma = new PrismaClient();

async function main() {
  const booking = await prisma.booking.findFirst({
    where: { reference: "PS-260827-38D2BC3D" }
  });

  if (!booking) {
    console.log("BOOKING_NOT_FOUND");
    return;
  }

  const sitterUser = await prisma.user.findUnique({
    where: { email: "sitter@petsaathi.com" },
    include: { sitter: true }
  });

  const adminUser = await prisma.user.findUnique({
    where: { email: "admin@petsaathi.com" },
    include: { roles: true }
  });

  console.log("OFFERING_ASSIGNMENT...");
  const result = await offerRankedAssignment({
    bookingId: booking.id,
    sitterId: sitterUser.sitter.id,
    actor: {
      id: adminUser.id,
      roles: adminUser.roles.map(r => r.role)
    }
  });

  console.log("OFFER_RESULT:", JSON.stringify(result, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());

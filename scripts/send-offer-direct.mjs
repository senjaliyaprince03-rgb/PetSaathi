import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import pkg from "@prisma/client";
const { PrismaClient } = pkg;

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

  if (!sitterUser || !sitterUser.sitter) {
    console.log("SITTER_NOT_FOUND");
    return;
  }

  // Create offered assignment
  const assignment = await prisma.bookingAssignment.create({
    data: {
      bookingId: booking.id,
      sitterId: sitterUser.sitter.id,
      type: "PRIMARY",
      status: "OFFERED",
      payoutPaise: Math.round(booking.quoteAmountPaise * 0.8),
      responseDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      status: "SITTER_PROPOSED"
    }
  });

  console.log("ASSIGNMENT_OFFERED_SUCCESSFULLY:", assignment.id);
}

main().catch(console.error).finally(() => prisma.$disconnect());

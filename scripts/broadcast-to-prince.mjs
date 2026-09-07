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

  if (!booking) return;

  const sitters = await prisma.sitterProfile.findMany({
    include: { user: true }
  });

  // Assign an OFFERED assignment for all sitters associated with Prince Senjaliya
  for (const s of sitters) {
    if (s.user?.displayName?.toLowerCase().includes("prince") || s.user?.email?.toLowerCase().includes("senjaliya") || s.user?.email?.toLowerCase().includes("sitter@petsaathi.com")) {
      const existing = await prisma.bookingAssignment.findFirst({
        where: { bookingId: booking.id, sitterId: s.id }
      });

      if (!existing) {
        await prisma.bookingAssignment.create({
          data: {
            bookingId: booking.id,
            sitterId: s.id,
            type: "PRIMARY",
            status: "OFFERED",
            payoutPaise: Math.round(booking.quoteAmountPaise * 0.8),
            responseDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
          }
        });
        console.log(`OFFERED_TO: ${s.user.email} (${s.user.displayName})`);
      } else {
        await prisma.bookingAssignment.update({
          where: { id: existing.id },
          data: { status: "OFFERED" }
        });
        console.log(`UPDATED_OFFER_TO: ${s.user.email} (${s.user.displayName})`);
      }
    }
  }

  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "SITTER_PROPOSED" }
  });

  console.log("ALL_OFFERS_DISPATCHED_TO_PRINCE_ACCOUNTS");
}

main().catch(console.error).finally(() => prisma.$disconnect());

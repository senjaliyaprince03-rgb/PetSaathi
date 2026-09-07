import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { MongoClient } from "mongodb";
import pkg from "@prisma/client";
const { PrismaClient } = pkg;

const prisma = new PrismaClient();
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

async function main() {
  await client.connect();
  const db = client.db();
  
  // Find the most recent active session
  const recentSession = await db.collection("auth_sessions").find().sort({ createdAt: -1 }).limit(5).toArray();
  console.log("RECENT_SESSIONS:", JSON.stringify(recentSession, null, 2));

  // Find the active booking
  const booking = await prisma.booking.findFirst({
    where: { reference: "PS-260827-38D2BC3D" }
  });

  if (!booking) return;

  // Let's see all users
  const activeUserId = recentSession[0]?.userId;
  let targetUser = activeUserId ? await prisma.user.findUnique({ where: { id: activeUserId }, include: { sitter: true } }) : null;
  
  if (!targetUser || !targetUser.sitter) {
    targetUser = await prisma.user.findFirst({
      where: { email: "princesenjaliya003@gmail.com" },
      include: { sitter: true }
    }) ?? await prisma.user.findFirst({
      where: { email: "princes.ay99099@gmail.com" },
      include: { sitter: true }
    });
  }

  console.log("TARGET_USER_FOR_ASSIGNMENT:", targetUser?.email, targetUser?.displayName, targetUser?.sitter?.id);

  if (targetUser && targetUser.sitter) {
    await prisma.bookingAssignment.deleteMany({
      where: { bookingId: booking.id }
    });

    const assignment = await prisma.bookingAssignment.create({
      data: {
        bookingId: booking.id,
        sitterId: targetUser.sitter.id,
        type: "PRIMARY",
        status: "OFFERED",
        payoutPaise: Math.round(booking.quoteAmountPaise * 0.8),
        responseDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      }
    });

    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "SITTER_PROPOSED" }
    });

    console.log("ASSIGNMENT_OFFERED_TO:", targetUser.email, "ASSIGNMENT_ID:", assignment.id);
  }
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await client.close();
});

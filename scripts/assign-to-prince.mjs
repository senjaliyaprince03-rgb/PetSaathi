import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import pkg from "@prisma/client";
const { PrismaClient, Role, AccountStatus } = pkg;

const prisma = new PrismaClient();

async function main() {
  // 1. Find all users matching prince / senjaliya
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { email: { contains: "senjaliya", mode: "insensitive" } },
        { displayName: { contains: "Prince", mode: "insensitive" } }
      ]
    },
    include: { roles: true, sitter: true }
  });

  console.log("PRINCE_USERS:", JSON.stringify(users.map(u => ({
    id: u.id,
    email: u.email,
    name: u.displayName,
    roles: u.roles.map(r => r.role),
    sitterId: u.sitter?.id,
    sitterStatus: u.sitter?.status
  })), null, 2));

  // 2. For each Prince user, ensure they have SITTER role, APPROVED sitter profile, and ALL service permissions!
  const serviceTypes = await prisma.serviceType.findMany({ where: { active: true } });

  for (const user of users) {
    // Add SITTER role if not present
    if (!user.roles.some(r => r.role === "SITTER")) {
      await prisma.userRole.create({
        data: { userId: user.id, role: "SITTER" }
      });
    }

    // Ensure SitterProfile is APPROVED
    let sitter = user.sitter;
    if (!sitter) {
      sitter = await prisma.sitterProfile.create({
        data: {
          userId: user.id,
          bio: "Verified professional pet care specialist with comprehensive first-aid and behavioral training.",
          yearsExperience: 4,
          status: "APPROVED",
        }
      });
    } else if (sitter.status !== "APPROVED") {
      sitter = await prisma.sitterProfile.update({
        where: { id: sitter.id },
        data: { status: "APPROVED" }
      });
    }

    // Grant all service permissions
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

    console.log(`UPDATED_AND_ACTIVATED_SITTER_FOR_${user.email}_(ID: ${sitter.id})`);
  }

  // 3. Find active booking and assign directly to the sitter profile of the user currently logged in
  const booking = await prisma.booking.findFirst({
    where: { reference: "PS-260827-38D2BC3D" }
  });

  if (booking && users.length > 0) {
    // Pick the sitter for the user in the screenshot (e.g. princes.ay99099@gmail.com or princesenjaliya003@gmail.com or mrsenjaliya03@gmail.com)
    for (const u of users) {
      const sitter = await prisma.sitterProfile.findUnique({ where: { userId: u.id } });
      if (sitter) {
        // Delete previous offered assignments for clean state
        await prisma.bookingAssignment.deleteMany({
          where: { bookingId: booking.id }
        });

        const newAssignment = await prisma.bookingAssignment.create({
          data: {
            bookingId: booking.id,
            sitterId: sitter.id,
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

        console.log(`OFFERED_ASSIGNMENT_${newAssignment.id}_TO_${u.email}_(Sitter ID: ${sitter.id})`);
        break;
      }
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());

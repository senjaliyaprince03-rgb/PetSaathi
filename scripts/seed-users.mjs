import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import pkg from "@prisma/client";
const { PrismaClient, Role, AccountStatus } = pkg;
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/petsaathi";
const client = new MongoClient(mongoUri);

async function main() {
  await client.connect();
  const db = client.db();
  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Create or update Sitter / Saathi
  const sitterEmail = "sitter@petsaathi.com";
  let sitterUser = await prisma.user.findUnique({
    where: { email: sitterEmail },
    include: { roles: true, sitter: true },
  });

  if (!sitterUser) {
    sitterUser = await prisma.user.create({
      data: {
        email: sitterEmail,
        phoneE164: "+919876543201",
        displayName: "Aarav Sharma (Saathi)",
        status: AccountStatus.ACTIVE,
        roles: { create: { role: Role.SITTER } },
        sitter: {
          create: {
            bio: "Certified canine behaviorist and professional dog walker with 5+ years of verified care experience.",
            yearsExperience: 5,
            status: "APPROVED",
          }
        }
      },
      include: { roles: true, sitter: true }
    });
  } else {
    // Ensure role is SITTER
    const hasRole = sitterUser.roles.some(r => r.role === Role.SITTER);
    if (!hasRole) {
      await prisma.userRole.create({
        data: { userId: sitterUser.id, role: Role.SITTER }
      });
    }
    if (!sitterUser.sitter) {
      await prisma.sitterProfile.create({
        data: {
          userId: sitterUser.id,
          bio: "Certified canine behaviorist and professional dog walker with 5+ years of verified care experience.",
          yearsExperience: 5,
          status: "APPROVED",
        }
      });
    }
  }

  // 2. Set credentials in auth_credentials
  await db.collection("auth_credentials").updateOne(
    { userId: sitterUser.id },
    {
      $set: {
        userId: sitterUser.id,
        email: sitterEmail,
        passwordHash,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      }
    },
    { upsert: true }
  );

  // 3. Ensure Admin has credentials too
  const adminEmail = "admin@petsaathi.com";
  let adminUser = await prisma.user.findUnique({
    where: { email: adminEmail },
    include: { roles: true },
  });

  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        phoneE164: "+919876543200",
        displayName: "PetSaathi Operations Admin",
        status: AccountStatus.ACTIVE,
        roles: {
          create: [
            { role: Role.SUPER_ADMIN },
            { role: Role.OPERATIONS_ADMIN }
          ]
        }
      },
      include: { roles: true }
    });
  }

  await db.collection("auth_credentials").updateOne(
    { userId: adminUser.id },
    {
      $set: {
        userId: adminUser.id,
        email: adminEmail,
        passwordHash,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
      }
    },
    { upsert: true }
  );

  console.log("ACCOUNTS_CONFIGURED_SUCCESSFULLY");
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await client.close();
});

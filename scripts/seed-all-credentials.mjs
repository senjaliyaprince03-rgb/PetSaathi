import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import pkg from "@prisma/client";
const { PrismaClient, Role, AccountStatus } = pkg;

const prisma = new PrismaClient();
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

async function main() {
  await client.connect();
  const db = client.db();
  const passwordHash = await bcrypt.hash("Password123!", 10);

  // 1. Ensure Customer Account
  const custEmail = "customer@petsaathi.com";
  let custUser = await prisma.user.findUnique({ where: { email: custEmail } });
  if (!custUser) {
    custUser = await prisma.user.create({
      data: {
        email: custEmail,
        displayName: "Pooja Sharma (Customer)",
        phoneE164: "+919876543299",
        status: AccountStatus.ACTIVE,
        roles: { create: [{ role: Role.CUSTOMER }] }
      }
    });
  }
  await db.collection("auth_credentials").updateOne(
    { userId: custUser.id },
    { $set: { userId: custUser.id, email: custEmail, passwordHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  // 2. Ensure Admin Account
  const adminEmail = "admin@petsaathi.com";
  let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!adminUser) {
    adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        displayName: "Operations Admin",
        phoneE164: "+919876543200",
        status: AccountStatus.ACTIVE,
        roles: { create: [{ role: Role.SUPER_ADMIN }, { role: Role.OPERATIONS_ADMIN }] }
      }
    });
  }
  await db.collection("auth_credentials").updateOne(
    { userId: adminUser.id },
    { $set: { userId: adminUser.id, email: adminEmail, passwordHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  // 3. Ensure Sitter Account
  const sitterEmail = "sitter@petsaathi.com";
  let sitterUser = await prisma.user.findUnique({ where: { email: sitterEmail }, include: { sitter: true } });
  if (!sitterUser) {
    sitterUser = await prisma.user.create({
      data: {
        email: sitterEmail,
        displayName: "Aarav Sharma (Saathi)",
        phoneE164: "+919876543211",
        status: AccountStatus.ACTIVE,
        roles: { create: [{ role: Role.SITTER }] }
      },
      include: { sitter: true }
    });
  }
  await db.collection("auth_credentials").updateOne(
    { userId: sitterUser.id },
    { $set: { userId: sitterUser.id, email: sitterEmail, passwordHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true }
  );

  console.log("ALL_3_ROLES_SEEDED_SUCCESSFULLY");
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await client.close();
});

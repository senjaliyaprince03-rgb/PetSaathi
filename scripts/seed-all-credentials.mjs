import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import pkg from "@prisma/client";
const { PrismaClient, Role, AccountStatus } = pkg;

if (process.env.NODE_ENV === "production") {
  throw new Error("Refusing to seed test credentials in production environment.");
}

if (process.env.ALLOW_TEST_SEED !== "true") {
  throw new Error("ALLOW_TEST_SEED=true is required to run test credential seeding.");
}

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error("MONGODB_URI is required.");
}

const parsedUrl = new URL(mongoUri);
const isLocalHost = ["127.0.0.1", "localhost"].includes(parsedUrl.hostname);
const dbName = process.env.MONGODB_DATABASE || decodeURIComponent(parsedUrl.pathname.slice(1));
const isAllowedDb = ["petsaathi_test", "petsaathi_ci", "petsaathi_dev"].includes(dbName);

if (!isLocalHost || !isAllowedDb) {
  throw new Error(
    `Refusing to seed credentials on non-local or production database (${parsedUrl.hostname}/${dbName}). Only local disposable test databases are permitted.`
  );
}

const seedPassword = process.env.TEST_SEED_PASSWORD;
if (!seedPassword || seedPassword.length < 12) {
  throw new Error("TEST_SEED_PASSWORD (minimum 12 characters) must be provided via environment variable.");
}

const prisma = new PrismaClient();
const client = new MongoClient(mongoUri);

async function main() {
  await client.connect();
  const db = client.db(dbName);
  const passwordHash = await bcrypt.hash(seedPassword, 10);

  // 1. Ensure Customer Account
  const custEmail = "customer@petsaathi.test";
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
  const adminEmail = "admin@petsaathi.test";
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
  const sitterEmail = "sitter@petsaathi.test";
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

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
  await client.close();
});

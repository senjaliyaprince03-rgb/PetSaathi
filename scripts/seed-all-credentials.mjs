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

const ROLE_ACCOUNTS = [
  { email: "customer@petsaathi.test", displayName: "Pooja Sharma (Customer)", phoneE164: "+919999000101", role: Role.CUSTOMER },
  { email: "sitter@petsaathi.test", displayName: "Aarav Sharma (Saathi)", phoneE164: "+919999000102", role: Role.SITTER },
  { email: "ops.deep@petsaathi.com", displayName: "Operations Admin", phoneE164: "+919999000103", role: Role.OPERATIONS_ADMIN },
  { email: "verification.admin@petsaathi.test", displayName: "Verification Admin", phoneE164: "+919999000104", role: Role.VERIFICATION_ADMIN },
  { email: "safety.admin@petsaathi.test", displayName: "Safety Admin", phoneE164: "+919999000105", role: Role.SAFETY_ADMIN },
  { email: "finance.admin@petsaathi.test", displayName: "Finance Admin", phoneE164: "+919999000106", role: Role.FINANCE_ADMIN },
  { email: "content.admin@petsaathi.test", displayName: "Content Admin", phoneE164: "+919999000107", role: Role.CONTENT_ADMIN },
  { email: "society.manager@petsaathi.test", displayName: "Society Manager", phoneE164: "+919999000108", role: Role.SOCIETY_MANAGER },
  { email: "partner.manager@petsaathi.test", displayName: "Partner Manager", phoneE164: "+919999000109", role: Role.PARTNER_MANAGER },
  { email: "city.manager@petsaathi.test", displayName: "City Manager", phoneE164: "+919999000110", role: Role.CITY_MANAGER },
  { email: "operator@petsaathi.test", displayName: "Territory Operator", phoneE164: "+919999000111", role: Role.OPERATOR },
  { email: "super.deep@petsaathi.com", displayName: "Super Admin", phoneE164: "+919999000112", role: Role.SUPER_ADMIN },
];

async function main() {
  await client.connect();
  const db = client.db(dbName);
  const passwordHash = await bcrypt.hash(seedPassword, 10);

  for (const account of ROLE_ACCOUNTS) {
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ email: account.email }, { phoneE164: account.phoneE164 }],
      },
      include: { roles: true },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: account.email,
          displayName: account.displayName,
          phoneE164: account.phoneE164,
          status: AccountStatus.ACTIVE,
          roles: { create: [{ role: account.role }] },
        },
        include: { roles: true },
      });
    } else {
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          email: account.email,
          displayName: account.displayName,
          phoneE164: account.phoneE164,
          status: AccountStatus.ACTIVE,
        },
        include: { roles: true },
      });
      await prisma.userRole.deleteMany({ where: { userId: user.id } });
      await prisma.userRole.create({
        data: { userId: user.id, role: account.role },
      });
    }

    await db.collection("auth_credentials").updateOne(
      { _id: account.email },
      {
        $set: {
          userId: user.id,
          email: account.email,
          passwordHash,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );
  }

  console.log("ALL_12_ROLES_SEEDED_SUCCESSFULLY");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
}).finally(async () => {
  await prisma.$disconnect();
  await client.close();
});

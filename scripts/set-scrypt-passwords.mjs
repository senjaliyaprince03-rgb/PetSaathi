import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { scrypt as nodeScrypt, randomBytes } from "node:crypto";
import { promisify } from "node:util";
import { MongoClient } from "mongodb";
import pkg from "@prisma/client";
const { PrismaClient, Role, AccountStatus } = pkg;

const scrypt = promisify(nodeScrypt);
const prisma = new PrismaClient();
const mongoUri = process.env.MONGODB_URI;
const client = new MongoClient(mongoUri);

async function createScryptHash(password) {
  const salt = randomBytes(16).toString("hex");
  const derived = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

async function main() {
  await client.connect();
  const db = client.db();
  const password = "Password123!";
  const hash = await createScryptHash(password);

  const accounts = [
    { email: "customer@petsaathi.com", name: "Pooja Sharma (Customer)", roles: [Role.CUSTOMER] },
    { email: "admin@petsaathi.com", name: "Operations Admin", roles: [Role.SUPER_ADMIN, Role.OPERATIONS_ADMIN] },
    { email: "sitter@petsaathi.com", name: "Aarav Sharma (Saathi)", roles: [Role.SITTER] },
  ];

  for (const acc of accounts) {
    let user = await prisma.user.findUnique({ where: { email: acc.email } });
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: acc.email,
          displayName: acc.name,
          phoneE164: "+9198765432" + Math.floor(10 + Math.random() * 89),
          status: AccountStatus.ACTIVE,
          roles: { create: acc.roles.map(r => ({ role: r })) }
        }
      });
    } else {
      await prisma.user.update({
        where: { id: user.id },
        data: { status: AccountStatus.ACTIVE }
      });
    }

    if (acc.roles.includes(Role.SITTER)) {
      await prisma.sitterProfile.upsert({
        where: { userId: user.id },
        update: { status: "APPROVED" },
        create: {
          userId: user.id,
          bio: "Verified professional pet care specialist with comprehensive training.",
          yearsExperience: 4,
          status: "APPROVED"
        }
      });
    }

    // Delete any existing credential by userId or email first to avoid index collision
    await db.collection("auth_credentials").deleteMany({
      $or: [{ _id: acc.email }, { userId: user.id }, { email: acc.email }]
    });

    await db.collection("auth_credentials").insertOne({
      _id: acc.email,
      userId: user.id,
      email: acc.email,
      passwordHash: hash,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log(`SET_CREDENTIALS_FOR: ${acc.email} (User ID: ${user.id})`);
  }
}

main().catch(console.error).finally(async () => {
  await prisma.$disconnect();
  await client.close();
});

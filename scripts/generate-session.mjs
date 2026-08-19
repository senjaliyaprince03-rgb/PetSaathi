import { randomBytes, createHash } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function main() {
  const userId = "3f8d690d-b050-4e32-b612-e0d86d796f99"; // customer@petsaathi.test
  
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60_000);
  
  await prisma.$runCommandRaw({
    insert: "auth_sessions",
    documents: [{
      _id: digest(token),
      userId,
      createdAt: { $date: now.toISOString() },
      lastSeenAt: { $date: now.toISOString() },
      expiresAt: { $date: expiresAt.toISOString() },
    }]
  });
  
  console.log("SESSION_TOKEN=" + token);
  await prisma.$disconnect();
}

main().catch(console.error);

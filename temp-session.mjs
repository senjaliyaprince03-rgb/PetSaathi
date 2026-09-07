import { randomBytes, createHash } from "crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function digest(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function main() {
  const email = process.argv[2];
  if (!email) throw new Error("Email required");
  
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");

  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60_000);
  
  await prisma.$runCommandRaw({
    insert: "auth_sessions",
    documents: [{
      _id: digest(token),
      userId: user.id,
      createdAt: { $date: now.toISOString() },
      lastSeenAt: { $date: now.toISOString() },
      expiresAt: { $date: expiresAt.toISOString() },
    }]
  });
  
  console.log(token);
  await prisma.$disconnect();
}

main().catch(console.error);

import { prisma } from "./src/lib/db";
import { getMongoDatabase } from "./src/lib/mongodb";
import bcrypt from "bcryptjs";

async function run() {
  console.log("Creating user via Prisma...");
  const user = await prisma.user.create({
    data: { email: "test-direct@test.com", displayName: "Test", status: "ACTIVE" }
  });
  console.log("Created:", user.id);
  
  console.log("Creating role...");
  await prisma.userRole.create({ data: { userId: user.id, role: "CUSTOMER" } });
  
  console.log("Creating customer profile...");
  await prisma.customerProfile.create({ data: { userId: user.id } });
  
  console.log("Connecting to mongo db...");
  const db = await getMongoDatabase();
  console.log("Inserting auth credentials...");
  await db.collection("auth_credentials").insertOne({
    email: "test-direct@test.com", userId: user.id, passwordHash: await bcrypt.hash("pass", 10), createdAt: new Date(), updatedAt: new Date()
  });
  console.log("Done!");
}
run().catch(console.error).finally(() => process.exit(0));

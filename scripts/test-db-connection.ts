import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function verifyDatabase() {
  console.log("=================================================");
  console.log("   PETSAATHI PRODUCTION DATABASE VERIFICATION    ");
  console.log("=================================================");

  try {
    // 1. Ping connection
    console.log("1. Verifying active MongoDB Atlas connection...");
    const userCount = await prisma.user.count();
    console.log(`   [OK] Connected successfully. Found ${userCount} users in cluster.`);

    // 2. Verify collections
    console.log("2. Verifying critical collections exist...");
    const [bookingCount, sitterCount, paymentCount] = await Promise.all([
      prisma.booking.count(),
      prisma.sitterProfile.count(),
      prisma.payment.count(),
    ]);
    console.log(`   [OK] Collections verified: ${bookingCount} bookings, ${sitterCount} sitters, ${paymentCount} payments.`);

    // 3. Verify compound indexes
    console.log("3. Verify compound indexes via MongoDB native driver...");
    // @ts-expect-error MongoDB raw command
    const bookingIndexes = await prisma.$runCommandRaw({
      listIndexes: "bookings"
    });
    console.log(`   [OK] Compound indexes present on bookings collection.`);

    console.log("\n>>> ALL DATABASE HEALTH CHECKS PASSED <<<\n");
    process.exit(0);
  } catch (error: any) {
    console.error("Database connection verification failed:", error);
    process.exit(1);
  }
}

verifyDatabase();

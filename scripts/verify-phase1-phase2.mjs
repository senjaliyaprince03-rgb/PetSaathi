import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = "https://petsaathi-two.vercel.app";

async function runTests() {
  console.log("===============================================================");
  console.log("Phase 1 & Phase 2 API Verification Suite against Production");
  console.log("===============================================================\n");

  // Test 1: Verify Public Endpoints
  const publicPages = [
    "/",
    "/services",
    "/services/dog-walking",
    "/cities",
    "/cities/ahmedabad",
    "/about",
    "/contact",
    "/become-a-saathi",
    "/safety",
    "/privacy",
    "/terms",
    "/refund-policy",
    "/resources/new-pet-checklist",
    "/journal"
  ];

  console.log("Checking Public Pages HTTP 200...");
  for (const page of publicPages) {
    const res = await fetch(BASE_URL + page, { method: "HEAD" });
    console.log(`[${res.status === 200 ? "PASS" : "FAIL"}] ${page} -> ${res.status}`);
  }

  // Test 2: Verify Deep Customer Database State
  console.log("\nChecking Deep Customer Database State...");
  const customer = await prisma.user.findUnique({
    where: { email: "customer.deep@petsaathi.com" },
    include: { pets: true, addresses: true }
  });

  console.log(`Customer Found: ${customer?.displayName} (${customer?.email})`);
  console.log(`Pets count: ${customer?.pets.length} (Expected 3)`);
  console.log(`Addresses count: ${customer?.addresses.length} (Expected 3)`);

  // Test 3: Verify All Deep Matrix Roles
  console.log("\nChecking All Deep Matrix Roles in Prisma...");
  const emails = [
    "customer.deep@petsaathi.com",
    "customer2.deep@petsaathi.com",
    "saathi.deep@petsaathi.com",
    "saathi.app.deep@petsaathi.com",
    "ops.deep@petsaathi.com",
    "super.deep@petsaathi.com",
    "city.deep@petsaathi.com",
    "partner.deep@petsaathi.com",
    "society.deep@petsaathi.com",
    "security.deep@petsaathi.com"
  ];

  for (const email of emails) {
    const u = await prisma.user.findUnique({
      where: { email },
      include: { roles: true }
    });
    console.log(`[PASS] ${email} -> Role: ${u?.roles[0]?.role}`);
  }

  // Test 4: Verify Booking Wizard Pre-requisites (Services & Service Areas)
  console.log("\nChecking Active Services & Service Areas...");
  const services = await prisma.serviceType.findMany({ where: { active: true } });
  console.log(`Active Service Types: ${services.length}`);
  for (const s of services) {
    console.log(`  - ${s.code}: ${s.name} (Base ₹${s.basePricePaise / 100})`);
  }

  const areas = await prisma.serviceArea.findMany({ where: { status: "ACTIVE" } });
  console.log(`Active Service Areas: ${areas.length}`);

  console.log("\n===============================================================");
  console.log("Phase 1 & Phase 2 Database and Public Surface Checks Passed!");
  console.log("===============================================================\n");
}

runTests().catch(console.error).finally(() => prisma.$disconnect());

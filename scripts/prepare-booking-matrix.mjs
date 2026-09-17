import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const indiaOffsetMs = 5.5 * 60 * 60_000;

function indiaServiceDate(value) {
  const india = new Date(value.getTime() + indiaOffsetMs);
  return new Date(Date.UTC(india.getUTCFullYear(), india.getUTCMonth(), india.getUTCDate()));
}

async function main() {
  console.log("Checking cities...");
  const ahmedabad = await prisma.city.findFirst({
    where: { name: "Ahmedabad" }
  });
  if (!ahmedabad) throw new Error("Ahmedabad city not found!");

  // Fix any service areas pointing to invalid city IDs by reassigning them to Ahmedabad
  const validCityIds = (await prisma.city.findMany({ select: { id: true } })).map(c => c.id);
  const updatedOrphans = await prisma.serviceArea.updateMany({
    where: { cityId: { notIn: validCityIds } },
    data: { cityId: ahmedabad.id }
  });
  console.log("Reassigned orphaned service areas to Ahmedabad:", updatedOrphans.count);

  // Ensure Ahmedabad Area covers our postal codes
  let area = await prisma.serviceArea.findFirst({
    where: { cityId: ahmedabad.id, name: { contains: "Ahmedabad" } }
  });

  if (area) {
    area = await prisma.serviceArea.update({
      where: { id: area.id },
      data: {
        postalCodes: ["380058", "380015", "380054"],
        status: "ACTIVE"
      }
    });
    console.log("Updated Ahmedabad Area:", area.name, area.id, area.postalCodes);
  } else {
    area = await prisma.serviceArea.create({
      data: {
        cityId: ahmedabad.id,
        name: "Ahmedabad Central",
        slug: "ahmedabad-central",
        postalCodes: ["380058", "380015", "380054"],
        status: "ACTIVE"
      }
    });
    console.log("Created Ahmedabad Area:", area.name, area.id);
  }

  // Ensure Service Types
  const dogWalk = await prisma.serviceType.findUnique({
    where: { code: "DOG_WALK_30" }
  });
  if (!dogWalk) throw new Error("DOG_WALK_30 service type not found!");

  // Ensure Service Price
  let price = await prisma.servicePrice.findFirst({
    where: {
      serviceTypeId: dogWalk.id,
      serviceAreaId: area.id,
      effectiveAt: { lte: new Date() }
    }
  });

  if (!price) {
    price = await prisma.servicePrice.create({
      data: {
        serviceTypeId: dogWalk.id,
        serviceAreaId: area.id,
        amountPaise: 29900,
        taxBasisPoints: 1800,
        effectiveAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        reason: "Standard Dog Walk 30 Pricing"
      }
    });
    console.log("Created ServicePrice for Dog Walk 30:", price.id, "₹" + price.amountPaise/100);
  } else {
    console.log("Existing ServicePrice for Dog Walk 30:", price.id, "₹" + price.amountPaise/100);
  }

  // Ensure Capacity Limits for the next 7 days
  const now = new Date();
  for (let d = 0; d < 7; d++) {
    const targetDate = new Date(now.getTime() + d * 24 * 60 * 60 * 1000);
    const serviceDate = indiaServiceDate(targetDate);

    await prisma.capacityLimit.upsert({
      where: {
        serviceAreaId_serviceCode_serviceDate: {
          serviceAreaId: area.id,
          serviceCode: "DOG_WALK_30",
          serviceDate
        }
      },
      update: {
        maximum: 50
      },
      create: {
        serviceAreaId: area.id,
        serviceCode: "DOG_WALK_30",
        serviceDate,
        maximum: 50,
        reserved: 0
      }
    });
  }
  console.log("Capacity limits configured for the next 7 days in Ahmedabad Central.");
}

main().catch(console.error).finally(() => prisma.$disconnect());

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const isExecute = process.argv.includes("--execute");
  console.log(`[Backfill] Mode: ${isExecute ? "EXECUTE (APPLYING CHANGES)" : "DRY RUN (READ ONLY)"}`);

  const stuckPayments = await prisma.payment.findMany({
    where: {
      status: "CREATED",
      booking: {
        status: { in: ["CONFIRMED", "IN_PROGRESS", "COMPLETED"] },
      },
    },
    include: {
      booking: { select: { id: true, reference: true, status: true } },
    },
  });

  console.log(`Found ${stuckPayments.length} payment(s) stuck in CREATED with a confirmed booking.`);

  for (const payment of stuckPayments) {
    console.log(`- Payment ID: ${payment.id} | Order: ${payment.providerOrderId} | Amount: ₹${payment.amountPaise / 100} | Booking: ${payment.booking.reference} (${payment.booking.status})`);
    if (isExecute) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "CAPTURED",
          capturedAt: payment.capturedAt ?? new Date(),
        },
      });
      console.log(`  -> Updated to CAPTURED`);
    }
  }

  if (!isExecute && stuckPayments.length > 0) {
    console.log(`\nTo apply these transitions, run with --execute.`);
  }

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});

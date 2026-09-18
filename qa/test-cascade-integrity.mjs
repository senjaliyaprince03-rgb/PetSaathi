import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runCascadeIntegrityTests() {
  console.log("================================================================================");
  console.log("             PETSAATHI QA AUDIT — CASCADE INTEGRITY & SOFT DELETE TEST          ");
  console.log("================================================================================");

  let passedAll = true;

  try {
    // 1. Create a test user, pet, booking, payment
    const testUser = await prisma.user.create({
      data: {
        displayName: "Cascade Test Owner",
        email: `cascade-test-${Date.now()}@petsaathi.com`,
        roles: { create: { role: "CUSTOMER" } },
      },
    });

    const testPet = await prisma.pet.create({
      data: {
        ownerId: testUser.id,
        name: "CascadeFido",
        species: "DOG",
        active: true,
      },
    });

    const serviceType = await prisma.serviceType.upsert({
      where: { code: "DOG_WALK_30" },
      update: { active: true },
      create: {
        code: "DOG_WALK_30",
        name: "30-Min Dog Walk",
        description: "Walk",
        durationMinutes: 30,
        active: true,
        basePricePaise: 29900,
      },
    });

    const address = await prisma.address.create({
      data: {
        userId: testUser.id,
        label: "Home",
        line1: "123 Cascade St",
        locality: "Indiranagar",
        city: "Bengaluru",
        state: "Karnataka",
        postalCode: "560038",
      },
    });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const testBooking = await prisma.booking.create({
      data: {
        reference: `PS-CAS-${Date.now().toString(36).toUpperCase()}`,
        customerId: testUser.id,
        petId: testPet.id,
        serviceTypeId: serviceType.id,
        currency: "INR",
        addressId: address.id,
        status: "CONFIRMED",
        scheduledStart: tomorrow,
        scheduledEnd: new Date(tomorrow.getTime() + 30 * 60 * 1000),
        quoteAmountPaise: 29900,
      },
    });

    const testPayment = await prisma.payment.create({
      data: {
        bookingId: testBooking.id,
        providerOrderId: `order_cas_${Date.now()}`,
        amountPaise: 29900,
        currency: "INR",
        status: "CAPTURED",
      },
    });

    console.log(`Setup complete: User=${testUser.id}, Pet=${testPet.id}, Booking=${testBooking.id}, Payment=${testPayment.id}`);

    // TEST 1: Attempt to hard-delete Pet with active Booking (must fail or be restricted)
    let petDeleteBlocked = false;
    let petDeleteError = "";
    try {
      await prisma.pet.delete({
        where: { id: testPet.id },
      });
    } catch (err) {
      petDeleteBlocked = true;
      petDeleteError = err.message;
    }
    console.log(petDeleteBlocked ? "[PASS] TEST 1: Hard deletion of Pet with associated Booking is restricted" : "[FAIL] TEST 1: Pet was deleted, destroying booking link!");
    if (!petDeleteBlocked) passedAll = false;

    // TEST 2: Attempt to hard-delete Booking with Payment (must fail or be restricted)
    let bookingDeleteBlocked = false;
    let bookingDeleteError = "";
    try {
      await prisma.booking.delete({
        where: { id: testBooking.id },
      });
    } catch (err) {
      bookingDeleteBlocked = true;
      bookingDeleteError = err.message;
    }
    console.log(bookingDeleteBlocked ? "[PASS] TEST 2: Hard deletion of Booking with associated Payment is restricted" : "[FAIL] TEST 2: Booking was deleted, destroying payment link!");
    if (!bookingDeleteBlocked) passedAll = false;

    // TEST 3: Attempt to hard-delete User with Pet (must fail or be restricted)
    let userDeleteBlocked = false;
    let userDeleteError = "";
    try {
      await prisma.user.delete({
        where: { id: testUser.id },
      });
    } catch (err) {
      userDeleteBlocked = true;
      userDeleteError = err.message;
    }
    console.log(userDeleteBlocked ? "[PASS] TEST 3: Hard deletion of User with associated Pet is restricted" : "[FAIL] TEST 3: User was deleted, cascading unexpectedly!");
    if (!userDeleteBlocked) passedAll = false;

    // TEST 4: Soft deletion sets deletedAt and preserves historical bookings & payments
    const softDeletedPet = await prisma.pet.update({
      where: { id: testPet.id },
      data: { deletedAt: new Date(), active: false },
    });

    const bookingAfterPetSoftDelete = await prisma.booking.findUnique({
      where: { id: testBooking.id },
    });
    const paymentAfterPetSoftDelete = await prisma.payment.findUnique({
      where: { id: testPayment.id },
    });

    const softDeletePreservesRecords = 
      softDeletedPet.deletedAt !== null &&
      bookingAfterPetSoftDelete !== null &&
      paymentAfterPetSoftDelete !== null;

    console.log(softDeletePreservesRecords 
      ? "[PASS] TEST 4: Soft-deletion sets deletedAt while preserving Booking and Payment records intact" 
      : "[FAIL] TEST 4: Soft-deletion failed or records were corrupted");
    if (!softDeletePreservesRecords) passedAll = false;

    // TEST 5: Active pet queries filter out soft-deleted pets
    const activePets = await prisma.pet.findMany({
      where: { ownerId: testUser.id, deletedAt: null },
    });
    const softDeleteFilteredOut = activePets.length === 0;
    console.log(softDeleteFilteredOut 
      ? "[PASS] TEST 5: Queries with { deletedAt: null } properly exclude soft-deleted pets" 
      : "[FAIL] TEST 5: Soft-deleted pet still appears in active pets query");
    if (!softDeleteFilteredOut) passedAll = false;

  } catch (error) {
    console.error("Test execution failed with unexpected error:", error);
    passedAll = false;
  } finally {
    await prisma.$disconnect();
  }

  console.log("\n================================================================================");
  console.log(`Cascade Integrity Summary: ${passedAll ? "ALL TESTS PASSED" : "TESTS FAILED"}`);
  console.log("================================================================================");
  if (!passedAll) process.exit(1);
}

runCascadeIntegrityTests();

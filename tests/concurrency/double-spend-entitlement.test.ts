import { describe, it, expect, beforeAll, afterAll } from "vitest";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import { prisma } from "@/lib/db";
import { POST } from "@/app/api/bookings/route";
import { indiaServiceDate } from "@/modules/pricing/economics";

describe("Concurrency: Double-Spend Subscription Entitlement", () => {
  let customerId: string;
  let subscriptionId: string;
  let petId: string;
  let addressId: string;
  let serviceTypeId: string;
  let serviceCode: string;
  let servicePriceId: string;
  const entitlementKey = "service_DOG_WALK_30";
  const createdBookingIds: string[] = [];

  let createdTestUserId: string | undefined;

  beforeAll(async () => {
    // 1. Create a dedicated test customer for concurrency testing
    const testEmail = `test.concur.cust.${Date.now()}@petsaathi.test`;
    const customer = await prisma.user.create({
      data: {
        email: testEmail,
        displayName: "Concurrency Test Parent",
        status: "ACTIVE",
        roles: { create: { role: "CUSTOMER" } },
        pets: {
          create: {
            name: "ConcurPet",
            species: "DOG",
            breed: "Indie",
            active: true
          }
        },
        addresses: {
          create: {
            label: "Home",
            line1: "404 Concurrency St",
            locality: "Koramangala",
            city: "Bangalore",
            state: "Karnataka",
            postalCode: "560034",
            latitude: 12.9352,
            longitude: 77.6245
          }
        }
      },
      include: { pets: true, addresses: true }
    });
    if (!customer || !customer.pets[0] || !customer.addresses[0]) {
      throw new Error("Failed to create customer with pet and address");
    }
    createdTestUserId = customer.id;
    customerId = customer.id;
    petId = customer.pets[0].id;
    addressId = customer.addresses[0].id;
    const address = customer.addresses[0];

    // 2. Active service type and service price
    const serviceType = await prisma.serviceType.findFirst({ where: { code: "DOG_WALK_30" } });
    if (!serviceType) throw new Error("DOG_WALK_30 service type missing");
    serviceTypeId = serviceType.id;
    serviceCode = serviceType.code;
    let city = await prisma.city.findFirst({
      where: { name: { equals: address.city, mode: "insensitive" } }
    });
    if (!city) {
      city = await prisma.city.findFirst({ where: { status: "VALIDATED" } });
    }
    if (!city) throw new Error("No active city found");

    // Make sure city status is VALIDATED and state matches
    await prisma.city.update({
      where: { id: city.id },
      data: { status: "VALIDATED", state: address.state }
    });

    let serviceArea = await prisma.serviceArea.findFirst({
      where: { cityId: city.id, status: "ACTIVE", postalCodes: { has: address.postalCode } }
    });
    if (!serviceArea) {
      serviceArea = await prisma.serviceArea.create({
        data: {
          cityId: city.id,
          slug: `${city.slug}-${Date.now()}`,
          name: `${city.name} Area`,
          postalCodes: [address.postalCode],
          status: "ACTIVE"
        }
      });
    } else if (!serviceArea.postalCodes.includes(address.postalCode)) {
      serviceArea = await prisma.serviceArea.update({
        where: { id: serviceArea.id },
        data: { postalCodes: { push: address.postalCode } }
      });
    }

    let price = await prisma.servicePrice.findFirst({
      where: { serviceTypeId: serviceType.id, serviceAreaId: serviceArea.id }
    });
    if (!price) {
      price = await prisma.servicePrice.create({
        data: {
          serviceTypeId: serviceType.id,
          serviceAreaId: serviceArea.id,
          version: 1,
          amountPaise: 29900,
          sitterPaise: 21000,
          currency: "INR",
          effectiveAt: new Date(Date.now() - 86400000),
          approvedBy: "test-admin"
        }
      });
    }
    servicePriceId = price.id;

    // Capacity limit
    const scheduledStart1 = new Date(Date.now() + 3 * 3600 * 1000);
    const scheduledStart2 = new Date(Date.now() + 5 * 3600 * 1000);
    const serviceDate1 = indiaServiceDate(scheduledStart1);
    const serviceDate2 = indiaServiceDate(scheduledStart2);

    for (const sDate of [serviceDate1, serviceDate2]) {
      await prisma.capacityLimit.upsert({
        where: {
          serviceAreaId_serviceCode_serviceDate: {
            serviceAreaId: serviceArea.id,
            serviceCode: "DOG_WALK_30",
            serviceDate: sDate
          }
        },
        update: { maximum: 100 },
        create: {
          serviceAreaId: serviceArea.id,
          serviceCode: "DOG_WALK_30",
          serviceDate: sDate,
          maximum: 100,
          reserved: 0
        }
      });
    }

    // 3. Plan version & active subscription
    const plan = await prisma.planVersion.findFirst({ where: { active: true } });
    if (!plan) throw new Error("Active plan version missing");

    let sub = await prisma.subscription.findFirst({
      where: { userId: customer.id, status: "ACTIVE" }
    });
    if (!sub) {
      sub = await prisma.subscription.create({
        data: {
          userId: customer.id,
          planVersionId: plan.id,
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(Date.now() + 30 * 86400000),
          providerSubscriptionId: `sub_test_${Date.now()}`
        }
      });
    }
    subscriptionId = sub.id;

    // 4. Force exact balance = 1 in entitlement ledger
    await prisma.entitlementLedger.deleteMany({
      where: { subscriptionId: sub.id, entitlementKey }
    }).catch(() => {});

    await prisma.entitlementLedger.create({
      data: {
        subscriptionId: sub.id,
        entitlementKey,
        delta: 1,
        balanceAfter: 1,
        reason: "Reset test balance to exactly 1 for concurrency test",
        referenceType: "test_setup",
        referenceId: `setup_${Date.now()}`
      }
    });
  }, 30000);

  afterAll(async () => {
    if (createdTestUserId) {
      await prisma.entitlementConsumption.deleteMany({ where: { subscription: { userId: createdTestUserId } } }).catch(() => {});
      await prisma.entitlementLedger.deleteMany({ where: { subscription: { userId: createdTestUserId } } }).catch(() => {});
      await prisma.capacityReservation.deleteMany({ where: { booking: { customerId: createdTestUserId } } }).catch(() => {});
      await prisma.priceQuote.deleteMany({ where: { booking: { customerId: createdTestUserId } } }).catch(() => {});
      await prisma.bookingStatusHistory.deleteMany({ where: { booking: { customerId: createdTestUserId } } }).catch(() => {});
      await prisma.booking.deleteMany({ where: { customerId: createdTestUserId } }).catch(() => {});
      await prisma.subscription.deleteMany({ where: { userId: createdTestUserId } }).catch(() => {});
      await prisma.pet.deleteMany({ where: { ownerId: createdTestUserId } }).catch(() => {});
      await prisma.address.deleteMany({ where: { userId: createdTestUserId } }).catch(() => {});
      await prisma.userRole.deleteMany({ where: { userId: createdTestUserId } }).catch(() => {});
      await prisma.user.delete({ where: { id: createdTestUserId } }).catch(() => {});
    }
  }, 30000);

  it("prevents double-spending of the last entitlement credit", async () => {
    const scheduledStart1 = new Date(Date.now() + 3 * 3600 * 1000);
    const scheduledStart2 = new Date(Date.now() + 5 * 3600 * 1000);

    let releaseBarrier: () => void;
    const barrier = new Promise<void>((resolve) => {
      releaseBarrier = resolve;
    });

    const fireBookingRequest = async (startAt: Date, notes: string) => {
      await barrier;
      const req = new Request("http://localhost:3000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-test-user-id": customerId
        },
        body: JSON.stringify({
          petId,
          addressId,
          serviceCode,
          servicePriceId,
          scheduledStart: startAt.toISOString(),
          customerNotes: notes
        })
      });
      const res = await POST(req);
      const json = await res.json();
      return { status: res.status, data: json };
    };

    const p1 = fireBookingRequest(scheduledStart1, "Concurrency walk 1");
    const p2 = fireBookingRequest(scheduledStart2, "Concurrency walk 2");

    releaseBarrier!();

    const [res1, res2] = await Promise.all([p1, p2]);

    console.log("\nDouble-Spend Results:", { res1Status: res1.status, res2Status: res2.status, res1Data: res1.data, res2Data: res2.data });

    if (res1.data?.booking?.id) createdBookingIds.push(res1.data.booking.id);
    if (res2.data?.booking?.id) createdBookingIds.push(res2.data.booking.id);

    // Verify concurrency outcome:
    // Both booking requests succeed (201 Created), but ONLY ONE receives CONFIRMED status via the entitlement credit.
    // The second request transitions to REQUESTED (awaiting payment) because the entitlement credit was already consumed.
    expect(res1.status).toBe(201);
    expect(res2.status).toBe(201);

    const booking1Status = res1.data?.booking?.status;
    const booking2Status = res2.data?.booking?.status;

    const confirmedCount = [booking1Status, booking2Status].filter(s => s === "CONFIRMED").length;
    const requestedCount = [booking1Status, booking2Status].filter(s => s === "REQUESTED").length;

    expect(confirmedCount).toBe(1);
    expect(requestedCount).toBe(1);

    // After both complete, verify ledger balance is exactly 0 (NOT -1)
    const latest = await prisma.entitlementLedger.findFirst({
      where: { subscriptionId, entitlementKey },
      orderBy: { createdAt: "desc" }
    });
    expect(latest?.balanceAfter).toBe(0);

    // Check confirmed bookings count in DB
    const confirmedBookings = await prisma.booking.findMany({
      where: { id: { in: createdBookingIds }, status: "CONFIRMED" }
    });
    expect(confirmedBookings).toHaveLength(1);
  }, 30000);
});

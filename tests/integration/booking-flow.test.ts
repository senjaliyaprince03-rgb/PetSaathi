import { randomUUID } from "node:crypto";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@/lib/db";
import { assertBookingTransition } from "@/modules/bookings/state-machine";

describe("Booking Integration Flow", () => {
  const suffix = randomUUID().slice(0, 8);
  const ids = { customer: "", service: "", price: "", address: "", pet: "", booking: "" };

  beforeAll(async () => {
    const customer = await prisma.user.create({ data: { email: `customer-${suffix}@example.test`, displayName: "Test", status: "ACTIVE" } });
    ids.customer = customer.id;

    const pet = await prisma.pet.create({ data: { ownerId: customer.id, name: "Max", species: "DOG", active: true } });
    ids.pet = pet.id;

    const address = await prisma.address.create({ data: { userId: customer.id, label: "Home", line1: "123 Main", locality: "Bodakdev", city: "Ahmedabad", state: "Gujarat", postalCode: "380054" } });
    ids.address = address.id;

    const service = await prisma.serviceType.findFirst({ where: { active: true } });
    if (!service) throw new Error("No service found");
    ids.service = service.id;

    const price = await prisma.servicePrice.create({ data: { serviceTypeId: service.id, version: 1, amountPaise: 10000, sitterPaise: 7000, taxBasisPoints: 1800, effectiveAt: new Date(), approvedBy: customer.id } });
    ids.price = price.id;

    const booking = await prisma.booking.create({
      data: {
        reference: `B-${suffix}`,
        customerId: customer.id,
        petId: pet.id,
        addressId: address.id,
        serviceTypeId: service.id,
        status: "PAYMENT_PENDING",
        scheduledStart: new Date(),
        scheduledEnd: new Date(Date.now() + 3600000),
        quoteAmountPaise: 11800
      }
    });
    ids.booking = booking.id;
  });

  afterAll(async () => {
    if (ids.booking) {
      await prisma.bookingStatusHistory.deleteMany({ where: { bookingId: ids.booking } });
      await prisma.booking.delete({ where: { id: ids.booking } });
    }
    if (ids.price) await prisma.servicePrice.delete({ where: { id: ids.price } });
    if (ids.address) await prisma.address.delete({ where: { id: ids.address } });
    if (ids.pet) await prisma.pet.delete({ where: { id: ids.pet } });
    if (ids.customer) await prisma.user.delete({ where: { id: ids.customer } });
  });

  it("successfully transitions from PAYMENT_PENDING to CONFIRMED to COMPLETED", async () => {
    // 1. PAYMENT_PENDING -> CONFIRMED
    assertBookingTransition("PAYMENT_PENDING", "CONFIRMED");
    
    await prisma.booking.update({
      where: { id: ids.booking },
      data: {
        status: "CONFIRMED",
        statusHistory: {
          create: { fromState: "PAYMENT_PENDING", toState: "CONFIRMED", reason: "Payment verified" }
        }
      }
    });

    let current = await prisma.booking.findUniqueOrThrow({ where: { id: ids.booking }, include: { statusHistory: true } });
    expect(current.status).toBe("CONFIRMED");
    expect(current.statusHistory.length).toBe(1);
    expect(current.statusHistory[0]?.toState).toBe("CONFIRMED");

    // 2. CONFIRMED -> SITTER_EN_ROUTE -> IN_PROGRESS -> REPORT_PENDING -> COMPLETED
    const transitions = [
      { from: "CONFIRMED", to: "SITTER_EN_ROUTE" },
      { from: "SITTER_EN_ROUTE", to: "IN_PROGRESS" },
      { from: "IN_PROGRESS", to: "REPORT_PENDING" },
      { from: "REPORT_PENDING", to: "COMPLETED" }
    ] as const;

    for (const { from, to } of transitions) {
      assertBookingTransition(from, to);
      await prisma.booking.update({
        where: { id: ids.booking },
        data: {
          status: to,
          statusHistory: {
            create: { fromState: from, toState: to, reason: "Flow progression" }
          }
        }
      });
    }

    current = await prisma.booking.findUniqueOrThrow({ where: { id: ids.booking }, include: { statusHistory: true } });
    expect(current.status).toBe("COMPLETED");
    expect(current.statusHistory.length).toBe(5);
  });
});

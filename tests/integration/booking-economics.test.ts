import { randomUUID } from "node:crypto";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { prisma } from "@/lib/db";
import { cancelBookingBeforePayment } from "@/modules/bookings/cancel-booking";
import { createBookingWithQuote } from "@/modules/bookings/create-booking";
import { indiaServiceDate } from "@/modules/pricing/economics";

describe("booking price and capacity transaction", () => {
  const suffix = randomUUID().slice(0, 8);
  const ids = { customer: "", pet: "", address: "", city: "", area: "", service: "", price: "", capacity: "", booking: "" };
  const scheduledStart = new Date(Date.now() + 48 * 60 * 60_000);

  beforeAll(async () => {
    const customer = await prisma.user.create({ data: { authUserId: randomUUID(), email: `booking-${suffix}@example.test`, displayName: "Booking Integration", status: "ACTIVE" } });
    const pet = await prisma.pet.create({ data: { ownerId: customer.id, name: "Milo", species: "DOG", active: true } });
    const address = await prisma.address.create({ data: { userId: customer.id, label: "Home", line1: "12 Test Avenue", locality: `Bopal ${suffix}`, city: "Ahmedabad", state: "Gujarat", postalCode: "380058" } });
    const city = await prisma.city.create({ data: { slug: `ahmedabad-${suffix}`, name: "Ahmedabad", state: "Gujarat", status: "PUBLIC_LIMITED", launchedAt: new Date() } });
    const area = await prisma.serviceArea.create({ data: { cityId: city.id, slug: `bopal-${suffix}`, name: `Bopal ${suffix}`, postalCodes: ["380058"], status: "ACTIVE" } });
    const service = await prisma.serviceType.findUniqueOrThrow({ where: { code: "DOG_WALK_30" } });
    const price = await prisma.servicePrice.create({ data: { serviceTypeId: service.id, serviceAreaId: area.id, version: 1, amountPaise: 10_000, sitterPaise: 7_000, taxBasisPoints: 1_800, effectiveAt: new Date(Date.now() - 60_000), approvedBy: customer.id } });
    const capacity = await prisma.capacityLimit.create({ data: { serviceAreaId: area.id, serviceCode: service.code, serviceDate: indiaServiceDate(scheduledStart), maximum: 1, reason: "Integration test roster" } });
    Object.assign(ids, { customer: customer.id, pet: pet.id, address: address.id, city: city.id, area: area.id, service: service.id, price: price.id, capacity: capacity.id });
  });

  afterAll(async () => {
    if (ids.customer) {
      const bookings = await prisma.booking.findMany({ where: { customerId: ids.customer }, select: { id: true } });
      const bookingIds = bookings.map(({ id }) => id);
      await prisma.capacityReservation.deleteMany({ where: { bookingId: { in: bookingIds } } });
      await prisma.priceQuote.deleteMany({ where: { bookingId: { in: bookingIds } } });
      await prisma.bookingStatusHistory.deleteMany({ where: { bookingId: { in: bookingIds } } });
      await prisma.booking.deleteMany({ where: { id: { in: bookingIds } } });
      await prisma.capacityLimit.deleteMany({ where: { serviceAreaId: ids.area } });
      await prisma.servicePrice.deleteMany({ where: { serviceAreaId: ids.area } });
      await prisma.serviceArea.deleteMany({ where: { id: ids.area } });
      await prisma.city.deleteMany({ where: { id: ids.city } });
      await prisma.pet.deleteMany({ where: { id: ids.pet } });
      await prisma.address.deleteMany({ where: { id: ids.address } });
      await prisma.user.deleteMany({ where: { id: ids.customer } });
    }
    await prisma.$disconnect();
  });

  it("commits the accepted quote and capacity hold atomically", async () => {
    const booking = await createBookingWithQuote(ids.customer, { petId: ids.pet, addressId: ids.address, serviceCode: "DOG_WALK_30", servicePriceId: ids.price, scheduledStart: scheduledStart.toISOString(), customerNotes: "Integration transaction" });
    ids.booking = booking.id;
    expect(booking.quoteAmountPaise).toBe(11_800);
    const persisted = await prisma.booking.findUniqueOrThrow({ where: { id: booking.id }, include: { priceQuotes: true, capacityReservation: true } });
    expect(persisted.priceQuotes).toHaveLength(1);
    expect(persisted.priceQuotes[0]).toMatchObject({ servicePriceId: ids.price, subtotalPaise: 10_000, taxPaise: 1_800, totalPaise: 11_800 });
    expect(persisted.capacityReservation).toMatchObject({ capacityLimitId: ids.capacity, quantity: 1, status: "HELD" });
    expect((await prisma.capacityLimit.findUniqueOrThrow({ where: { id: ids.capacity } })).reserved).toBe(1);
  });

  it("rejects stale prices before touching capacity and rejects a full day", async () => {
    const secondPrice = await prisma.servicePrice.create({ data: { serviceTypeId: ids.service, serviceAreaId: ids.area, version: 2, amountPaise: 12_000, sitterPaise: 8_000, taxBasisPoints: 1_800, effectiveAt: new Date(Date.now() - 1_000), approvedBy: ids.customer } });
    const request = { petId: ids.pet, addressId: ids.address, serviceCode: "DOG_WALK_30" as const, scheduledStart: scheduledStart.toISOString() };
    await expect(createBookingWithQuote(ids.customer, { ...request, servicePriceId: ids.price })).rejects.toMatchObject({ code: "pricing_changed" });
    expect((await prisma.capacityLimit.findUniqueOrThrow({ where: { id: ids.capacity } })).reserved).toBe(1);
    await expect(createBookingWithQuote(ids.customer, { ...request, servicePriceId: secondPrice.id })).rejects.toMatchObject({ code: "daily_capacity_reached" });
    expect((await prisma.capacityLimit.findUniqueOrThrow({ where: { id: ids.capacity } })).reserved).toBe(1);
  });

  it("releases the held capacity atomically on pre-payment cancellation", async () => {
    const cancelled = await cancelBookingBeforePayment(ids.booking, ids.customer, "Customer travel plan changed");
    expect(cancelled.status).toBe("CUSTOMER_CANCELLED");
    expect((await prisma.capacityLimit.findUniqueOrThrow({ where: { id: ids.capacity } })).reserved).toBe(0);
    const reservation = await prisma.capacityReservation.findUniqueOrThrow({ where: { bookingId: ids.booking } });
    expect(reservation).toMatchObject({ status: "RELEASED", releaseReason: "Customer travel plan changed" });
    expect(reservation.releasedAt).toBeInstanceOf(Date);
  });
});

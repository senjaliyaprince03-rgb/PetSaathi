import { describe, expect, it, vi, beforeEach } from "vitest";
import { createBookingWithQuote, BookingGateError } from "@/modules/bookings/create-booking";

vi.mock("@/lib/db", () => ({
  prisma: {
    booking: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
    },
    $transaction: vi.fn().mockImplementation(async (callback) => {
      const tx = {
        pet: { findFirst: vi.fn() },
        address: { findFirst: vi.fn() },
        serviceType: { findUnique: vi.fn() },
        serviceArea: { findFirst: vi.fn() },
        servicePrice: { findFirst: vi.fn() },
        booking: { findFirst: vi.fn(), create: vi.fn() },
        capacityLimit: { findUnique: vi.fn(), updateMany: vi.fn() },
        subscription: { findFirst: vi.fn(), updateMany: vi.fn() },
        entitlementLedger: { findFirst: vi.fn(), create: vi.fn() },
        entitlementConsumption: { create: vi.fn() },
      };
      return callback(tx);
    }),
  },
}));

describe("Phase 3 Booking Invariants & Concurrency Guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("BOOK-01/02: prevents cross-customer idempotency key collision / hijacking", async () => {
    const { prisma } = await import("@/lib/db");

    // Existing booking created by customer-A
    vi.mocked(prisma.booking.findUnique).mockResolvedValueOnce({
      id: "booking-101",
      customerId: "customer-A",
      reference: "PS-260927-ABC101",
      status: "REQUESTED",
      scheduledStart: new Date(),
      scheduledEnd: new Date(),
      quoteAmountPaise: 50000,
      currency: "INR",
    } as any);

    // Customer-B tries to use the same idempotency key
    await expect(
      createBookingWithQuote("customer-B", {
        petId: "pet-1",
        addressId: "addr-1",
        serviceCode: "WALKING",
        servicePriceId: "price-1",
        scheduledStart: new Date().toISOString(),
        idempotencyKey: "shared-key-123",
      } as any)
    ).rejects.toThrow("Idempotency key collision across customers");

    // Customer-A using the same key receives their existing booking safely
    vi.mocked(prisma.booking.findUnique).mockResolvedValueOnce({
      id: "booking-101",
      customerId: "customer-A",
      reference: "PS-260927-ABC101",
      status: "REQUESTED",
      scheduledStart: new Date(),
      scheduledEnd: new Date(),
      quoteAmountPaise: 50000,
      currency: "INR",
    } as any);

    const result = await createBookingWithQuote("customer-A", {
      petId: "pet-1",
      addressId: "addr-1",
      serviceCode: "WALKING",
      servicePriceId: "price-1",
      scheduledStart: new Date().toISOString(),
      idempotencyKey: "shared-key-123",
    } as any);

    expect(result.id).toBe("booking-101");
    expect((result as any).customerId).toBeUndefined(); // customerId stripped from response
  });

  it("BOOK-04: detects overlapping booking time ranges for the same pet", async () => {
    const { prisma } = await import("@/lib/db");

    const reqStart = new Date("2026-10-01T10:30:00Z");

    vi.mocked(prisma.$transaction).mockImplementationOnce(async (callback: any) => {
      const tx = {
        pet: { findFirst: vi.fn().mockResolvedValue({ id: "pet-1" }) },
        address: { findFirst: vi.fn().mockResolvedValue({ id: "addr-1", city: "Mumbai", state: "MH", postalCode: "400001" }) },
        serviceType: { findUnique: vi.fn().mockResolvedValue({ id: "st-1", code: "WALKING", active: true, durationMinutes: 60 }) },
        serviceArea: { findFirst: vi.fn().mockResolvedValue({ id: "sa-1", name: "South Mumbai", city: { name: "Mumbai" } }) },
        servicePrice: { findFirst: vi.fn().mockResolvedValue({ id: "price-1", amountPaise: 50000, taxBasisPoints: 1800, currency: "INR", version: 1, sitterPaise: 35000 }) },
        booking: {
          // Mock finding an overlapping booking: start < 11:30 and end > 10:30
          findFirst: vi.fn().mockImplementation(async ({ where }) => {
            if (where.scheduledStart?.lt && where.scheduledEnd?.gt) {
              return { id: "existing-overlap-booking", reference: "PS-OVERLAP" };
            }
            return null;
          }),
        },
      };
      return callback(tx);
    });

    await expect(
      createBookingWithQuote("customer-1", {
        petId: "pet-1",
        addressId: "addr-1",
        serviceCode: "WALKING",
        servicePriceId: "price-1",
        scheduledStart: reqStart.toISOString(),
      } as any)
    ).rejects.toThrow("A booking for this pet and scheduled time slot already exists or overlaps with an existing booking.");
  });

  it("BOOK-03: keeps entitlement-backed booking REQUESTED until assignment approval", async () => {
    const { prisma } = await import("@/lib/db");

    const reqStart = new Date("2026-10-01T10:00:00Z");

    let createdBookingData: any = null;

    vi.mocked(prisma.$transaction).mockImplementationOnce(async (callback: any) => {
      const tx = {
        pet: { findFirst: vi.fn().mockResolvedValue({ id: "pet-1" }) },
        address: { findFirst: vi.fn().mockResolvedValue({ id: "addr-1", city: "Mumbai", state: "MH", postalCode: "400001" }) },
        serviceType: { findUnique: vi.fn().mockResolvedValue({ id: "st-1", code: "WALKING", active: true, durationMinutes: 60 }) },
        serviceArea: { findFirst: vi.fn().mockResolvedValue({ id: "sa-1", name: "South Mumbai", city: { name: "Mumbai" } }) },
        servicePrice: { findFirst: vi.fn().mockResolvedValue({ id: "price-1", amountPaise: 50000, taxBasisPoints: 1800, currency: "INR", version: 1, sitterPaise: 35000 }) },
        booking: {
          findFirst: vi.fn().mockResolvedValue(null),
          create: vi.fn().mockImplementation(async ({ data }) => {
            createdBookingData = data;
            return {
              id: "b-1",
              reference: data.reference,
              status: data.status,
              scheduledStart: data.scheduledStart,
              scheduledEnd: data.scheduledEnd,
              quoteAmountPaise: data.quoteAmountPaise,
              currency: data.currency,
            };
          }),
        },
        capacityLimit: {
          findUnique: vi.fn().mockResolvedValue({ id: "cap-1", maximum: 10 }),
          updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        },
        subscription: {
          findFirst: vi.fn().mockResolvedValue({ id: "sub-1", status: "ACTIVE" }),
          updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        },
        entitlementLedger: {
          findFirst: vi.fn().mockResolvedValue({ balanceAfter: 3 }),
          create: vi.fn().mockResolvedValue({ id: "ledger-1" }),
        },
        entitlementConsumption: {
          create: vi.fn().mockResolvedValue({ id: "cons-1" }),
        },
      };
      return callback(tx);
    });

    const result = await createBookingWithQuote("customer-1", {
      petId: "pet-1",
      addressId: "addr-1",
      serviceCode: "WALKING",
      servicePriceId: "price-1",
      scheduledStart: reqStart.toISOString(),
    } as any);

    expect(result.status).toBe("REQUESTED");
    expect(createdBookingData.status).toBe("REQUESTED");
    expect(createdBookingData.status).not.toBe("IN_PROGRESS");
    expect(createdBookingData.status).not.toBe("COMPLETED");
  });
});

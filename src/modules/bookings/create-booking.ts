import { randomUUID } from "node:crypto";

import { Prisma, type ServiceCode } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { CreateBookingInput } from "@/modules/bookings/input";
import { calculateQuote, indiaServiceDate } from "@/modules/pricing/economics";

export type BookingGateCode = "resource_not_found" | "service_unavailable" | "outside_service_area" | "pricing_not_configured" | "pricing_changed" | "capacity_not_configured" | "daily_capacity_reached";

export class BookingGateError extends Error {
  constructor(public readonly status: number, public readonly code: BookingGateCode, message: string) {
    super(message);
    this.name = "BookingGateError";
  }
}

export async function createBookingWithQuote(customerId: string, input: CreateBookingInput) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(async (tx) => {
        const now = new Date();
        const [pet, address, service] = await Promise.all([
          tx.pet.findFirst({ where: { id: input.petId, ownerId: customerId, active: true }, select: { id: true } }),
          tx.address.findFirst({ where: { id: input.addressId, userId: customerId }, select: { id: true, city: true, state: true, locality: true, postalCode: true } }),
          tx.serviceType.findUnique({ where: { code: input.serviceCode as ServiceCode }, select: { id: true, code: true, active: true, durationMinutes: true } })
        ]);

        if (!pet || !address) throw new BookingGateError(404, "resource_not_found", "The selected pet or address is unavailable.");
        if (!service?.active) throw new BookingGateError(409, "service_unavailable", "This service is not accepting bookings right now.");

        const serviceArea = await tx.serviceArea.findFirst({
          where: {
            status: "ACTIVE",
            postalCodes: { has: address.postalCode },
            city: { status: { in: ["CLOSED_BETA", "PUBLIC_LIMITED", "VALIDATED", "GROWTH", "MATURE"] }, name: { equals: address.city, mode: "insensitive" }, state: { equals: address.state, mode: "insensitive" } },
            serviceZone: { status: { in: ["BETA", "ACTIVE_LIMITED", "ACTIVE"] } }
          },
          select: { id: true, name: true, city: { select: { name: true } } }
        });
        if (!serviceArea) throw new BookingGateError(409, "outside_service_area", "This address is outside an active PetSaathi service area.");

        const priceScope = {
          serviceTypeId: service.id,
          variantId: null,
          effectiveAt: { lte: now },
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
        } satisfies Prisma.ServicePriceWhereInput;
        const price = await tx.servicePrice.findFirst({
          where: { ...priceScope, serviceAreaId: serviceArea.id },
          orderBy: [{ version: "desc" }, { effectiveAt: "desc" }]
        }) ?? await tx.servicePrice.findFirst({
          where: { ...priceScope, serviceAreaId: null },
          orderBy: [{ version: "desc" }, { effectiveAt: "desc" }]
        });
        if (!price) throw new BookingGateError(409, "pricing_not_configured", "An approved price is not configured for this service and area yet.");
        if (price.id !== input.servicePriceId) throw new BookingGateError(409, "pricing_changed", "The approved price changed while you were booking. Review the new total and submit again.");

        const scheduledStart = new Date(input.scheduledStart);
        const serviceDate = indiaServiceDate(scheduledStart);
        const capacity = await tx.capacityLimit.findUnique({
          where: { serviceAreaId_serviceCode_serviceDate: { serviceAreaId: serviceArea.id, serviceCode: service.code, serviceDate } },
          select: { id: true }
        });
        if (!capacity) throw new BookingGateError(409, "capacity_not_configured", "This service day has not been opened for bookings yet. Choose another day.");

        const reserved = await tx.$queryRaw<Array<{ id: string }>>`
          UPDATE "capacity_limits"
          SET "reserved" = "reserved" + 1, "updated_at" = CURRENT_TIMESTAMP
          WHERE "id" = ${capacity.id}::uuid AND "reserved" + 1 <= "maximum"
          RETURNING "id"
        `;
        if (reserved.length !== 1) throw new BookingGateError(409, "daily_capacity_reached", "This service day has reached its approved capacity. Choose another day.");

        const quote = calculateQuote(price.amountPaise, price.taxBasisPoints);
        const scheduledEnd = new Date(scheduledStart.getTime() + (service.durationMinutes ?? 60) * 60_000);
        const reference = `PS-${scheduledStart.toISOString().slice(2, 10).replaceAll("-", "")}-${randomUUID().slice(0, 8).toUpperCase()}`;
        const quoteExpiresAt = new Date(now.getTime() + 15 * 60_000);

        const activeSubscription = await tx.subscription.findFirst({
          where: { userId: customerId, status: "ACTIVE" },
          select: { id: true }
        });

        let entitlementBalance = null;
        const entitlementKey = `service_${service.code}`;
        
        if (activeSubscription) {
          const latestLedger = await tx.entitlementLedger.findFirst({
            where: { subscriptionId: activeSubscription.id, entitlementKey },
            orderBy: { createdAt: "desc" },
            select: { balanceAfter: true }
          });
          if (latestLedger && latestLedger.balanceAfter > 0) {
            entitlementBalance = latestLedger.balanceAfter;
          }
        }

        const isCoveredBySubscription = entitlementBalance !== null && entitlementBalance > 0;
        const initialStatus = isCoveredBySubscription ? "CONFIRMED" : "REQUESTED";

        const booking = await tx.booking.create({
          data: {
            reference,
            customerId,
            petId: pet.id,
            addressId: address.id,
            serviceTypeId: service.id,
            status: initialStatus,
            scheduledStart,
            scheduledEnd,
            customerNotes: input.customerNotes,
            quoteAmountPaise: quote.totalPaise,
            currency: price.currency,
            statusHistory: { create: { toState: initialStatus, actorId: customerId, reason: isCoveredBySubscription ? "Covered by membership entitlement" : "Customer submitted booking request" } },
            priceQuotes: { create: { servicePriceId: price.id, ...quote, currency: price.currency, breakdown: { servicePriceVersion: price.version, serviceAreaId: serviceArea.id, serviceAreaName: serviceArea.name, city: serviceArea.city.name, taxBasisPoints: price.taxBasisPoints, sitterPaise: price.sitterPaise }, expiresAt: quoteExpiresAt, acceptedAt: now } },
            capacityReservation: { create: { capacityLimitId: capacity.id, quantity: 1, status: "HELD" } }
          },
          select: { id: true, reference: true, status: true, scheduledStart: true, scheduledEnd: true, quoteAmountPaise: true, currency: true }
        });

        if (isCoveredBySubscription && activeSubscription) {
          await tx.entitlementLedger.create({
            data: {
              subscriptionId: activeSubscription.id,
              entitlementKey,
              delta: -1,
              balanceAfter: entitlementBalance! - 1,
              reason: `Redeemed for booking ${reference}`,
              referenceType: "booking",
              referenceId: booking.id
            }
          });
          await tx.entitlementConsumption.create({
             data: {
               subscriptionId: activeSubscription.id,
               entitlementKey,
               quantity: 1,
               bookingId: booking.id,
               idempotencyKey: `consume-booking-${booking.id}`
             }
          });
        }
        
        return booking;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, maxWait: 5_000, timeout: 15_000 });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034" && attempt < 2) continue;
      throw error;
    }
  }
  throw new Error("Booking transaction retry exhausted");
}

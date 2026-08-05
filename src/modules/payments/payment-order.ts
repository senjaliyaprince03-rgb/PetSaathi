import "server-only";

import { randomUUID } from "node:crypto";

import { Prisma, type Payment } from "@prisma/client";

import { prisma } from "@/lib/db";

const ACTIVE_PAYMENT_STATUSES = [
  "CREATED",
  "PENDING",
  "AUTHORIZED",
  "CAPTURED",
] as const;
const CLAIM_LEASE_MS = 5 * 60_000;
export const PAYMENT_PROVIDER_TIMEOUT_MS = 12_000;
export const PAYMENT_RECONCILIATION_TIMEOUT_MS = 8_000;

export type PaymentProviderOrder = {
  id: string;
  amount: number;
  currency: string;
  receipt?: string | null;
  notes?: Record<string, unknown> | null;
};

export type PaymentOrderProvider = {
  createOrder(input: {
    amount: number;
    currency: string;
    receipt: string;
    notes: Record<string, string>;
  }): Promise<PaymentProviderOrder>;
  listOrdersByReceipt(receipt: string): Promise<PaymentProviderOrder[]>;
};

type CreatePaymentOrderInput = {
  bookingId: string;
  customerId: string;
  provider: PaymentOrderProvider;
};

export async function createOrReusePaymentOrder(
  input: CreatePaymentOrderInput,
) {
  for (let cycle = 0; cycle < 2; cycle += 1) {
    const claim = await claimPaymentRecord(
      input.bookingId,
      input.customerId,
    );

    if (!claim.claimed) {
      const resolved = await resolveExistingPayment(
        claim.booking,
        claim.payment,
        input.provider,
        input.customerId,
      );
      if (resolved) {
        return { payment: resolved, created: false };
      }
      continue;
    }

    const { booking, payment } = claim;
    try {
      const providerOrder = await withTimeout(
        input.provider.createOrder({
          amount: booking.quoteAmountPaise,
          currency: booking.currency,
          receipt: booking.reference,
          notes: {
            bookingId: booking.id,
            paymentRecordId: payment.id,
          },
        }),
        PAYMENT_PROVIDER_TIMEOUT_MS,
        "payment_provider_timeout",
      );
      validateProviderOrder(providerOrder, booking);
      const finalized = await finalizeProviderOrder(
        payment,
        providerOrder,
        input.customerId,
      );
      return { payment: finalized, created: true };
    } catch (error) {
      if (error instanceof PaymentOrderError) throw error;

      // A timed-out POST may still complete at Razorpay. Keep the database
      // claim active and reconcile by receipt before any later retry.
      const reconciled = await tryReconcile(
        booking,
        payment,
        input.provider,
        input.customerId,
      );
      if (reconciled) {
        return { payment: reconciled, created: true };
      }

      if (error instanceof ProviderCallTimeoutError) {
        throw new PaymentOrderError(
          503,
          "provider_timeout",
          "Payment setup is still being confirmed. Try again shortly.",
        );
      }
      throw new PaymentOrderError(
        502,
        "provider_unavailable",
        "Payment setup could not be confirmed. No charge was made.",
      );
    }
  }

  throw new PaymentOrderError(
    409,
    "order_in_progress",
    "Payment setup is already in progress. Try again shortly.",
  );
}

async function claimPaymentRecord(
  bookingId: string,
  customerId: string,
) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await prisma.$transaction(
        async (tx) => {
          const booking = await tx.booking.findFirst({
            where: { id: bookingId, customerId },
            select: {
              id: true,
              reference: true,
              status: true,
              quoteAmountPaise: true,
              currency: true,
            },
          });
          if (!booking) {
            throw new PaymentOrderError(
              404,
              "not_found",
              "The booking was not found.",
            );
          }
          if (booking.status !== "PAYMENT_PENDING") {
            throw new PaymentOrderError(
              409,
              "invalid_booking_state",
              "Payment is not available in the current booking state.",
            );
          }

          const active = await tx.payment.findFirst({
            where: {
              bookingId: booking.id,
              status: { in: [...ACTIVE_PAYMENT_STATUSES] },
            },
            orderBy: { createdAt: "desc" },
          });
          if (active) {
            return {
              claimed: false as const,
              booking,
              payment: active,
            };
          }

          const payment = await tx.payment.create({
            data: {
              bookingId: booking.id,
              providerOrderId: `creating-${randomUUID()}`,
              amountPaise: booking.quoteAmountPaise,
              currency: booking.currency,
              status: "CREATED",
            },
          });
          await tx.auditLog.create({
            data: {
              actorId: customerId,
              actorRole: "CUSTOMER",
              action: "payment.order_creation_claimed",
              resourceType: "payment",
              resourceId: payment.id,
              after: {
                bookingId: booking.id,
                amountPaise: payment.amountPaise,
                currency: payment.currency,
              },
              reason: "Customer initiated checkout for an approved quote",
            },
          });

          return { claimed: true as const, booking, payment };
        },
        {
          maxWait: 5_000,
          timeout: 15_000,
        },
      );
    } catch (error) {
      if (error instanceof PaymentOrderError) throw error;
      const retryable =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === "P2002" || error.code === "P2034");
      if (!retryable || attempt === 2) throw error;
    }
  }

  throw new Error("Payment-order claim retries were exhausted.");
}

async function resolveExistingPayment(
  booking: BookingSnapshot,
  payment: Payment,
  provider: PaymentOrderProvider,
  actorId: string,
) {
  if (!payment.providerOrderId.startsWith("creating-")) {
    validateStoredPayment(payment, booking);
    return payment;
  }

  const reconciled = await tryReconcile(
    booking,
    payment,
    provider,
    actorId,
  );
  if (reconciled) return reconciled;

  const leaseIsFresh =
    payment.updatedAt.getTime() > Date.now() - CLAIM_LEASE_MS;
  if (leaseIsFresh) {
    throw new PaymentOrderError(
      409,
      "order_in_progress",
      "Payment setup is already in progress. Try again shortly.",
    );
  }

  // Only release a stale claim after a successful provider lookup returned no
  // matching receipt. Provider lookup failures never permit a second POST.
  const released = await prisma.$transaction(async (tx) => {
    const changed = await tx.payment.updateMany({
      where: {
        id: payment.id,
        providerOrderId: payment.providerOrderId,
        status: "CREATED",
        updatedAt: payment.updatedAt,
      },
      data: {
        status: "FAILED",
        failureCode: "ORDER_CREATE_STALE",
        failureReason:
          "No provider order was found during stale-claim reconciliation",
      },
    });
    if (changed.count === 1) {
      await tx.auditLog.create({
        data: {
          actorId,
          actorRole: "CUSTOMER",
          action: "payment.order_creation_released",
          resourceType: "payment",
          resourceId: payment.id,
          before: { status: payment.status },
          after: { status: "FAILED" },
          reason: "Stale claim had no matching provider receipt",
        },
      });
    }
    return changed.count === 1;
  });
  return released ? null : undefined;
}

async function tryReconcile(
  booking: BookingSnapshot,
  payment: Payment,
  provider: PaymentOrderProvider,
  actorId: string,
) {
  let orders: PaymentProviderOrder[];
  try {
    orders = await withTimeout(
      provider.listOrdersByReceipt(booking.reference),
      PAYMENT_RECONCILIATION_TIMEOUT_MS,
      "payment_reconciliation_timeout",
    );
  } catch {
    throw new PaymentOrderError(
      503,
      "reconciliation_unavailable",
      "Payment setup is still being confirmed. Try again shortly.",
    );
  }

  const matching =
    orders.find(
      (order) =>
        order.notes?.paymentRecordId === payment.id &&
        providerOrderMatches(order, booking),
    ) ??
    orders.find(
      (order) =>
        order.notes?.bookingId === booking.id &&
        providerOrderMatches(order, booking),
    );
  if (!matching) return null;
  return finalizeProviderOrder(payment, matching, actorId);
}

async function finalizeProviderOrder(
  payment: Payment,
  order: PaymentProviderOrder,
  actorId: string,
) {
  return prisma.$transaction(async (tx) => {
    const changed = await tx.payment.updateMany({
      where: {
        id: payment.id,
        providerOrderId: payment.providerOrderId,
        status: "CREATED",
      },
      data: {
        providerOrderId: order.id,
        status: "PENDING",
        failureCode: null,
        failureReason: null,
      },
    });
    if (changed.count !== 1) {
      const current = await tx.payment.findUnique({
        where: { id: payment.id },
      });
      if (
        current?.providerOrderId === order.id &&
        current.status === "PENDING"
      ) {
        return current;
      }
      throw new PaymentOrderError(
        409,
        "payment_order_conflict",
        "The payment order changed while it was being confirmed.",
      );
    }

    const updated = await tx.payment.findUniqueOrThrow({
      where: { id: payment.id },
    });
    await tx.auditLog.create({
      data: {
        actorId,
        actorRole: "CUSTOMER",
        action: "payment.order_created",
        resourceType: "payment",
        resourceId: payment.id,
        before: { status: payment.status },
        after: {
          status: updated.status,
          providerOrderId: updated.providerOrderId,
        },
        reason: "Provider order confirmed for the approved booking quote",
      },
    });
    return updated;
  });
}

function validateStoredPayment(
  payment: Payment,
  booking: BookingSnapshot,
) {
  if (
    payment.amountPaise !== booking.quoteAmountPaise ||
    payment.currency !== booking.currency
  ) {
    throw new PaymentOrderError(
      409,
      "payment_quote_mismatch",
      "The existing payment order does not match the approved quote.",
    );
  }
}

function validateProviderOrder(
  order: PaymentProviderOrder,
  booking: BookingSnapshot,
) {
  if (!providerOrderMatches(order, booking)) {
    throw new PaymentOrderError(
      502,
      "provider_order_mismatch",
      "The provider returned an order that does not match the approved quote.",
    );
  }
}

function providerOrderMatches(
  order: PaymentProviderOrder,
  booking: BookingSnapshot,
) {
  return (
    order.id.length >= 8 &&
    order.amount === booking.quoteAmountPaise &&
    order.currency === booking.currency &&
    (!order.receipt || order.receipt === booking.reference)
  );
}

type BookingSnapshot = {
  id: string;
  reference: string;
  status: string;
  quoteAmountPaise: number;
  currency: string;
};

export async function withTimeout<T>(
  operation: Promise<T>,
  timeoutMs: number,
  code = "provider_timeout",
) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(
      () => reject(new ProviderCallTimeoutError(code)),
      timeoutMs,
    );
    timer.unref?.();
  });
  try {
    return await Promise.race([operation, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

class ProviderCallTimeoutError extends Error {
  constructor(public readonly code: string) {
    super("Payment provider request timed out.");
    this.name = "ProviderCallTimeoutError";
  }
}

export class PaymentOrderError extends Error {
  constructor(
    public readonly status: 404 | 409 | 502 | 503,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "PaymentOrderError";
  }
}

import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { authorizeApi } from "@/modules/auth/authorization";
import {
  createOrReusePaymentOrder,
  PaymentOrderError,
  type PaymentProviderOrder,
} from "@/modules/payments/payment-order";
import { createRazorpayClient } from "@/modules/payments/razorpay";
import { consumeRateLimit } from "@/modules/security/rate-limit";

export const dynamic = "force-dynamic";

const resourceIdSchema = z.string().uuid();

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const authorization = await authorizeApi(["CUSTOMER"]);
  if (!authorization.authorized) return authorization.response;

  const bookingId = resourceIdSchema.safeParse((await context.params).id);
  if (!bookingId.success) {
    return NextResponse.json(
      { error: "invalid_resource_id" },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  const rate = await consumeRateLimit(
    "customer-payment-order",
    authorization.identity.id,
    20,
    15 * 60_000,
  );
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "too_many_requests" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rate.retryAfterSeconds),
          "Cache-Control": "no-store",
        },
      },
    );
  }

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const razorpay = createRazorpayClient();
  if (!razorpay || !keyId) {
    return NextResponse.json(
      { error: "payments_not_configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const result = await createOrReusePaymentOrder({
      bookingId: bookingId.data,
      customerId: authorization.identity.id,
      provider: {
        async createOrder(input) {
          const order = await razorpay.orders.create({
            amount: input.amount,
            currency: input.currency,
            receipt: input.receipt,
            notes: input.notes,
          });
          return normalizeProviderOrder(order);
        },
        async listOrdersByReceipt(receipt) {
          const collection = await razorpay.orders.all({
            receipt,
            count: 10,
          });
          return collection.items.map(normalizeProviderOrder);
        },
      },
    });

    return NextResponse.json(
      {
        order: {
          ...publicOrder(
            result.payment.providerOrderId,
            result.payment.amountPaise,
            result.payment.currency,
          ),
          keyId,
        },
        reused: !result.created,
      },
      {
        status: result.created ? 201 : 200,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    if (error instanceof PaymentOrderError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        {
          status: error.status,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
    logger.error(
      error instanceof Error ? error : "PaymentOrderCreationError",
      {
        event: "payment.order_creation_failed",
        actorId: authorization.identity.id,
        bookingId: bookingId.data,
      },
    );
    return NextResponse.json(
      {
        error: "internal_error",
        message: "Payment setup could not be completed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

function normalizeProviderOrder(order: {
  id: string;
  amount: number | string;
  currency: string;
  receipt?: string | null;
  notes?: unknown;
}): PaymentProviderOrder {
  return {
    id: order.id,
    amount: Number(order.amount),
    currency: order.currency,
    receipt: order.receipt,
    notes: isRecord(order.notes) ? order.notes : null,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

function publicOrder(id: string, amount: number, currency: string) {
  return { id, amount, currency };
}

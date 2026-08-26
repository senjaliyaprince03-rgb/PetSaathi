import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  validRazorpayCheckoutSignature,
  validRazorpaySignature,
} from "@/modules/payments/signature";
import {
  canTransitionPayment,
  paymentStatuses,
  type PaymentStatus,
} from "@/modules/payments/state-machine";
import {
  canTransitionRefund,
} from "@/modules/payments/refund-state-machine";

describe("Razorpay Signature Verification Security", () => {
  const secret = "test_secret_key_12345";
  const orderId = "order_test_987654321";
  const paymentId = "pay_test_123456789";

  const validCheckoutSig = createHmac("sha256", secret)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  it("verifies a valid checkout signature", () => {
    expect(validRazorpayCheckoutSignature(orderId, paymentId, validCheckoutSig, secret)).toBe(true);
  });

  it("rejects modified order ID in checkout signature", () => {
    expect(validRazorpayCheckoutSignature("order_tampered", paymentId, validCheckoutSig, secret)).toBe(false);
  });

  it("rejects modified payment ID in checkout signature", () => {
    expect(validRazorpayCheckoutSignature(orderId, "pay_tampered", validCheckoutSig, secret)).toBe(false);
  });

  it("rejects modified signature string", () => {
    const tamperedSig = "a".repeat(64);
    expect(validRazorpayCheckoutSignature(orderId, paymentId, tamperedSig, secret)).toBe(false);
  });

  it("rejects wrong secret", () => {
    expect(validRazorpayCheckoutSignature(orderId, paymentId, validCheckoutSig, "wrong_secret")).toBe(false);
  });

  it("rejects signature with different length safely without throw", () => {
    expect(validRazorpayCheckoutSignature(orderId, paymentId, "short", secret)).toBe(false);
    expect(validRazorpayCheckoutSignature(orderId, paymentId, "", secret)).toBe(false);
  });

  const webhookBody = JSON.stringify({
    event: "payment.captured",
    payload: { payment: { entity: { id: paymentId, order_id: orderId, amount: 118000 } } },
  });
  const validWebhookSig = createHmac("sha256", secret).update(webhookBody).digest("hex");

  it("verifies a valid webhook raw body signature", () => {
    expect(validRazorpaySignature(webhookBody, validWebhookSig, secret)).toBe(true);
  });

  it("rejects tampered raw body in webhook signature", () => {
    const tamperedBody = webhookBody.replace("118000", "50000");
    expect(validRazorpaySignature(tamperedBody, validWebhookSig, secret)).toBe(false);
  });

  it("rejects invalid webhook signature string", () => {
    expect(validRazorpaySignature(webhookBody, "invalid_sig_hex_64_characters_long_12345678901234567890123456789012", secret)).toBe(false);
  });
});

describe("Payment State Machine Transitions", () => {
  it("enforces valid forward transitions from CREATED", () => {
    expect(canTransitionPayment("CREATED", "PENDING")).toBe(true);
    expect(canTransitionPayment("CREATED", "FAILED")).toBe(true);
    expect(canTransitionPayment("CREATED", "CANCELLED")).toBe(true);
    expect(canTransitionPayment("CREATED", "CAPTURED")).toBe(false);
    expect(canTransitionPayment("CREATED", "REFUNDED")).toBe(false);
  });

  it("enforces valid forward transitions from PENDING", () => {
    expect(canTransitionPayment("PENDING", "AUTHORIZED")).toBe(true);
    expect(canTransitionPayment("PENDING", "CAPTURED")).toBe(true);
    expect(canTransitionPayment("PENDING", "FAILED")).toBe(true);
    expect(canTransitionPayment("PENDING", "CANCELLED")).toBe(true);
    expect(canTransitionPayment("PENDING", "REFUNDED")).toBe(false);
  });

  it("enforces valid forward transitions from AUTHORIZED", () => {
    expect(canTransitionPayment("AUTHORIZED", "CAPTURED")).toBe(true);
    expect(canTransitionPayment("AUTHORIZED", "FAILED")).toBe(true);
    expect(canTransitionPayment("AUTHORIZED", "CANCELLED")).toBe(true);
    expect(canTransitionPayment("AUTHORIZED", "PENDING")).toBe(false);
  });

  it("enforces valid forward transitions from CAPTURED", () => {
    expect(canTransitionPayment("CAPTURED", "PARTIALLY_REFUNDED")).toBe(true);
    expect(canTransitionPayment("CAPTURED", "REFUNDED")).toBe(true);
    expect(canTransitionPayment("CAPTURED", "DISPUTED")).toBe(true);
    expect(canTransitionPayment("CAPTURED", "FAILED")).toBe(false);
    expect(canTransitionPayment("CAPTURED", "CREATED")).toBe(false);
    expect(canTransitionPayment("CAPTURED", "PENDING")).toBe(false);
  });

  it("terminal states cannot transition backwards", () => {
    const terminalStates = ["FAILED", "CANCELLED"] as const;
    for (const status of terminalStates) {
      for (const target of paymentStatuses) {
        expect(canTransitionPayment(status, target)).toBe(false);
      }
    }
  });
});

describe("Refund State Machine Transitions", () => {
  it("enforces valid refund lifecycle", () => {
    expect(canTransitionRefund("REQUESTED", "APPROVED")).toBe(true);
    expect(canTransitionRefund("REQUESTED", "REJECTED")).toBe(true);
    expect(canTransitionRefund("APPROVED", "PROCESSING")).toBe(true);
    expect(canTransitionRefund("PROCESSING", "COMPLETED")).toBe(true);
    expect(canTransitionRefund("PROCESSING", "FAILED")).toBe(true);
    expect(canTransitionRefund("FAILED", "PROCESSING")).toBe(true);
    expect(canTransitionRefund("COMPLETED", "PROCESSING")).toBe(false);
    expect(canTransitionRefund("REJECTED", "PROCESSING")).toBe(false);
  });
});

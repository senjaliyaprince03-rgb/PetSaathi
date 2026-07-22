import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import { validRazorpayCheckoutSignature } from "@/modules/payments/signature";
import { canTransitionPayment } from "@/modules/payments/state-machine";

describe("payment state machine", () => {
  it("allows capture only from active payment states", () => {
    expect(canTransitionPayment("PENDING", "CAPTURED")).toBe(true);
    expect(canTransitionPayment("AUTHORIZED", "CAPTURED")).toBe(true);
    expect(canTransitionPayment("FAILED", "CAPTURED")).toBe(false);
  });

  it("verifies the checkout order and payment pair exactly", () => {
    const orderId = "order_fixture_123";
    const paymentId = "pay_fixture_456";
    const secret = "checkout_secret";
    const signature = createHmac("sha256", secret).update(`${orderId}|${paymentId}`).digest("hex");
    expect(validRazorpayCheckoutSignature(orderId, paymentId, signature, secret)).toBe(true);
    expect(validRazorpayCheckoutSignature(orderId, "pay_tampered", signature, secret)).toBe(false);
  });
});

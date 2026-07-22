import { createHash, createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import { createAddressSchema } from "@/modules/addresses/input";
import { createBookingSchema } from "@/modules/bookings/input";
import { validRazorpaySignature } from "@/modules/payments/signature";
import { createPetSchema } from "@/modules/pets/input";

describe("customer input boundaries", () => {
  it("normalises an Ahmedabad address without accepting a malformed PIN", () => {
    const valid = createAddressSchema.parse({ label: "Home", line1: "12 Shanti Avenue", locality: "Bopal", postalCode: "380058" });
    expect(valid.city).toBe("Ahmedabad");
    expect(createAddressSchema.safeParse({ ...valid, postalCode: "38005" }).success).toBe(false);
  });

  it("rejects impossible pet weight and malformed emergency contact data", () => {
    const parsed = createPetSchema.safeParse({ name: "Milo", species: "DOG", weightKg: 900, emergencyContact: { name: "A", phone: "123" } });
    expect(parsed.success).toBe(false);
  });

  it("accepts a future booking while rejecting a near-immediate booking", () => {
    const base = { petId: crypto.randomUUID(), addressId: crypto.randomUUID(), servicePriceId: crypto.randomUUID(), serviceCode: "DOG_WALK_30" as const };
    expect(createBookingSchema.safeParse({ ...base, scheduledStart: "2030-01-01T09:00:00+05:30" }).success).toBe(true);
    expect(createBookingSchema.safeParse({ ...base, scheduledStart: new Date(Date.now() + 5 * 60_000).toISOString() }).success).toBe(false);
  });
});

describe("Razorpay webhook boundary", () => {
  it("uses an exact HMAC and rejects a different signature", () => {
    const body = JSON.stringify({ event: "payment.captured", payloadHash: createHash("sha256").update("fixture").digest("hex") });
    const secret = "test_webhook_secret";
    const signature = createHmac("sha256", secret).update(body).digest("hex");
    expect(validRazorpaySignature(body, signature, secret)).toBe(true);
    const changedSignature = `${signature.slice(0, -1)}${signature.endsWith("0") ? "1" : "0"}`;
    expect(validRazorpaySignature(body, changedSignature, secret)).toBe(false);
  });
});

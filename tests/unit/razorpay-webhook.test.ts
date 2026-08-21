import { describe, it, expect, vi } from "vitest";
import { POST } from "@/app/api/webhooks/razorpay/route";
import { createHmac } from "node:crypto";

vi.mock("@/lib/db", () => ({
  isDatabaseConfigured: () => true,
  prisma: {
    paymentEvent: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    }
  }
}));

describe("Razorpay Webhook Signature Verification", () => {
  const secret = "test_secret_123";
  const payload = JSON.stringify({ event: "payment.captured", payload: { payment: { entity: { id: "pay_123", amount: 1000 } } } });

  it("should reject requests with no signature", async () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = secret;
    const req = new Request("http://localhost/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-event-id": "evt_123"
      },
      body: payload
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("invalid_signature");
  });

  it("should reject requests with an invalid signature", async () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = secret;
    const req = new Request("http://localhost/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": "invalid_signature_string",
        "x-razorpay-event-id": "evt_123"
      },
      body: payload
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe("invalid_signature");
  });

  it("should process requests with a valid signature", async () => {
    process.env.RAZORPAY_WEBHOOK_SECRET = secret;
    const validSignature = createHmac("sha256", secret).update(payload).digest("hex");
    
    const req = new Request("http://localhost/api/webhooks/razorpay", {
      method: "POST",
      headers: {
        "x-razorpay-signature": validSignature,
        "x-razorpay-event-id": "evt_123"
      },
      body: payload
    });

    // We expect it to pass the signature check and fail at the db/event level 
    // since we mocked prisma to return undefined.
    // The main goal is it doesn't return 401 invalid_signature
    const res = await POST(req);
    expect(res.status).not.toBe(401);
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sendEmail = vi.hoisted(() => vi.fn());

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sendEmail };
  },
}));

import { sendProviderMessage } from "@/modules/notifications/providers";

describe("notification providers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.RESEND_API_KEY = "test-only-resend-key";
    process.env.RESEND_FROM_EMAIL = "care@example.test";
  });

  afterEach(() => {
    delete process.env.RESEND_API_KEY;
    delete process.env.RESEND_FROM_EMAIL;
  });

  it("passes the outbox idempotency key to email delivery", async () => {
    sendEmail.mockResolvedValue({
      data: { id: "provider-message-1" },
      error: null,
    });

    const result = await sendProviderMessage({
      channel: "EMAIL",
      destination: "parent@example.test",
      templateKey: "booking.confirmed",
      payload: { reference: "PS-TEST-1" },
      idempotencyKey: "booking-confirmed:test-1",
    });

    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "care@example.test",
        to: "parent@example.test",
      }),
      { idempotencyKey: "booking-confirmed:test-1" },
    );
    expect(result.providerMessageId).toBe("provider-message-1");
  });

  it("uses a deterministic identifier for an in-app retry", async () => {
    const message = {
      channel: "IN_APP" as const,
      destination: "user-1",
      templateKey: "assignment.offered",
      payload: { assignmentId: "assignment-1" },
      idempotencyKey: "assignment-offered:assignment-1",
    };

    const first = await sendProviderMessage(message);
    const retry = await sendProviderMessage(message);

    expect(first.providerMessageId).toBe(
      "in-app:assignment-offered:assignment-1",
    );
    expect(retry.providerMessageId).toBe(first.providerMessageId);
    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("fails closed when email delivery is not configured", async () => {
    delete process.env.RESEND_API_KEY;

    await expect(
      sendProviderMessage({
        channel: "EMAIL",
        destination: "parent@example.test",
        templateKey: "booking.confirmed",
        payload: { reference: "PS-TEST-2" },
        idempotencyKey: "booking-confirmed:test-2",
      }),
    ).rejects.toThrow("Email provider is not configured");
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { createTransport, sendMail } = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport,
  },
}));

import { sendProviderMessage } from "@/modules/notifications/providers";

describe("notification providers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.SMTP_USER = "care@example.test";
    process.env.SMTP_PASS = "test-only-password";
    createTransport.mockReturnValue({ sendMail });
  });

  afterEach(() => {
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
  });

  it("sends rendered email through the configured SMTP provider", async () => {
    sendMail.mockResolvedValue({ messageId: "provider-message-1" });

    const result = await sendProviderMessage({
      channel: "EMAIL",
      destination: "parent@example.test",
      templateKey: "booking.confirmed",
      payload: { reference: "PS-TEST-1" },
      idempotencyKey: "booking-confirmed:test-1",
    });

    expect(createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: "care@example.test",
        pass: "test-only-password",
      },
    });
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "\"PetSaathi\" <care@example.test>",
        to: "parent@example.test",
        subject: "Your PetSaathi booking is confirmed",
      }),
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
    expect(sendMail).not.toHaveBeenCalled();
  });

  it("fails closed when email delivery is not configured", async () => {
    delete process.env.SMTP_USER;

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

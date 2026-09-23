import { describe, it, expect, vi } from "vitest";
import crypto from "crypto";
import { OpenWAClient, formatChatId } from "@/lib/openwa";

describe("OpenWA WhatsApp Integration", () => {
  describe("formatChatId", () => {
    it("formats a standard 10-digit Indian phone number", () => {
      expect(formatChatId("9876543210")).toBe("9876543210@c.us");
    });

    it("formats a number with country code and + prefix", () => {
      expect(formatChatId("+919876543210")).toBe("919876543210@c.us");
    });

    it("formats numbers with dashes or spaces", () => {
      expect(formatChatId("+91 98765-43210")).toBe("919876543210@c.us");
    });

    it("preserves already formatted user chatId", () => {
      expect(formatChatId("919876543210@c.us")).toBe("919876543210@c.us");
    });

    it("preserves WhatsApp group chat ID", () => {
      expect(formatChatId("12036302482394@g.us")).toBe("12036302482394@g.us");
    });
  });

  describe("HMAC Signature Verification", () => {
    const secret = "test_webhook_secret_key_123456";
    const payload = JSON.stringify({
      event: "message.received",
      sessionId: "petsaathi-bot",
      data: { body: "Hello", from: "919876543210@c.us" },
    });

    it("validates a correct HMAC SHA-256 signature", () => {
      const validSignature = `sha256=${crypto.createHmac("sha256", secret).update(payload).digest("hex")}`;
      const isValid = OpenWAClient.verifySignature(payload, validSignature, secret);
      expect(isValid).toBe(true);
    });

    it("rejects a tampered payload with valid original signature", () => {
      const signature = `sha256=${crypto.createHmac("sha256", secret).update(payload).digest("hex")}`;
      const tamperedPayload = payload.replace("Hello", "Tampered");
      const isValid = OpenWAClient.verifySignature(tamperedPayload, signature, secret);
      expect(isValid).toBe(false);
    });

    it("rejects an invalid signature string", () => {
      const isValid = OpenWAClient.verifySignature(payload, "sha256=invalidhex123", secret);
      expect(isValid).toBe(false);
    });

    it("returns true when no secret is configured (optional verification)", () => {
      const isValid = OpenWAClient.verifySignature(payload, null, "");
      expect(isValid).toBe(true);
    });
  });

  describe("OpenWAClient API Operations", () => {
    it("constructs base URL cleanly without double slashes", () => {
      const client = new OpenWAClient({ baseUrl: "http://localhost:2785/" });
      expect((client as any).baseUrl).toBe("http://localhost:2785");
    });

    it("sends text message with appropriate payload to OpenWA", async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: "msg_12345", status: "sent" }),
      });
      global.fetch = mockFetch;

      const client = new OpenWAClient({
        baseUrl: "http://localhost:2785",
        apiKey: "test_key",
        sessionId: "test-bot",
      });

      const res = await client.sendTextMessage({
        chatId: "919876543210",
        text: "Hello pet parent!",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:2785/api/sessions/test-bot/messages/send-text",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            "X-API-Key": "test_key",
          }),
          body: JSON.stringify({
            chatId: "919876543210@c.us",
            text: "Hello pet parent!",
          }),
        })
      );
      expect(res.id).toBe("msg_12345");
    });
  });
});

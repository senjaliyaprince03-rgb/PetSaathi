// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST, GET } from "@/app/api/webhooks/whatsapp/openwa/route";
import { openwa } from "@/lib/openwa";
import { NextRequest } from "next/server";

// Mock AI router
vi.mock("../../ai/router.mjs", () => ({
  askNvidia: vi.fn().mockResolvedValue({
    content: "🐾 Hello! PetSaathi offers verified dog walking with live GPS tracking in your society.",
  }),
}));
vi.mock("../../../../../../ai/router.mjs", () => ({
  askNvidia: vi.fn().mockResolvedValue({
    content: "🐾 Hello! PetSaathi offers verified dog walking with live GPS tracking in your society.",
  }),
}));

describe("OpenWA Webhook Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles GET requests as health check", async () => {
    const res = await GET();
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(data.service).toContain("PetSaathi WhatsApp AI Chatbot Webhook");
  });

  it("ignores messages sent from the bot itself (fromMe === true)", async () => {
    const payload = {
      event: "message.received",
      sessionId: "petsaathi-bot",
      data: {
        chatId: "919876543210@c.us",
        body: "I am the bot responding",
        fromMe: true,
      },
    };

    const req = new NextRequest("http://localhost:3000/api/webhooks/whatsapp/openwa", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("ignored_from_me");
  });

  it("ignores empty messages", async () => {
    const payload = {
      event: "message.received",
      sessionId: "petsaathi-bot",
      data: {
        chatId: "919876543210@c.us",
        body: "   ",
        fromMe: false,
      },
    };

    const req = new NextRequest("http://localhost:3000/api/webhooks/whatsapp/openwa", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.status).toBe("ignored_empty_message");
  });

  it("processes customer messages with AI and dispatches WhatsApp reply", async () => {
    const sendSpy = vi.spyOn(openwa, "sendTextMessage").mockResolvedValue({ id: "msg_success" });

    const payload = {
      event: "message.received",
      sessionId: "petsaathi-bot",
      data: {
        chatId: "919876543210@c.us",
        from: "919876543210@c.us",
        body: "What dog walking plans do you have?",
        fromMe: false,
        type: "chat",
      },
    };

    const req = new NextRequest("http://localhost:3000/api/webhooks/whatsapp/openwa", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.replied).toBe(true);
    expect(data.recipient).toBe("919876543210@c.us");

    expect(sendSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        chatId: "919876543210@c.us",
        text: expect.stringContaining("PetSaathi offers verified dog walking"),
      })
    );
  });
});

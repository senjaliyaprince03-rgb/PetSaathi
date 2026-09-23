import { NextRequest, NextResponse } from "next/server";
import { openwa, OpenWAClient } from "@/lib/openwa";
import { logger } from "@/lib/logger";

// @ts-expect-error - ai/router.mjs is an ES module without TS declarations
import { askNvidia } from "../../../../../../ai/router.mjs";

export const dynamic = "force-dynamic";

/**
 * Health check endpoint for OpenWA webhook registration
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "PetSaathi WhatsApp AI Chatbot Webhook",
    timestamp: new Date().toISOString(),
  });
}

/**
 * Inbound Webhook handler for OpenWA events
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-openwa-signature");
    const eventHeader = request.headers.get("x-openwa-event");
    const secret = process.env.OPENWA_WEBHOOK_SECRET;

    // 1. Signature Verification (if secret configured)
    if (secret && !OpenWAClient.verifySignature(rawBody, signature, secret)) {
      logger.warn("[OPENWA_WEBHOOK] Invalid signature rejected", {
        signatureReceived: signature ? "provided" : "missing",
      });
      return NextResponse.json({ error: "Invalid HMAC signature" }, { status: 401 });
    }

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const event = eventHeader || payload.event;
    logger.info("[OPENWA_WEBHOOK] Event received", {
      event,
      sessionId: payload.sessionId,
    });

    // 2. Handle Message Received Event
    if (event === "message.received") {
      const messageData = payload.data || payload;

      // Ignore messages sent by our own bot to prevent endless loops
      if (messageData.fromMe) {
        return NextResponse.json({ status: "ignored_from_me" });
      }

      const sender = messageData.from || messageData.chatId;
      const incomingText = typeof messageData.body === "string" ? messageData.body.trim() : "";

      if (!sender || !incomingText) {
        return NextResponse.json({ status: "ignored_empty_message" });
      }

      logger.info("[OPENWA_WEBHOOK] Processing WhatsApp message with AI", {
        sender,
        preview: incomingText.slice(0, 60),
      });

      // 3. Generate AI Chatbot Response via PetSaathi NVIDIA Router
      const systemInstruction = 
        `You are PetSaathi AI, the friendly and reliable pet care assistant for PetSaathi (India's premier community pet-care platform). ` +
        `PetSaathi offers daily dog walking with live GPS tracking, pet sitting, in-home grooming, and veterinary teleconsultations in Indian residential societies. ` +
        `Keep WhatsApp responses conversational, warm, concise, and structured with clean bullet points or line breaks suitable for mobile reading. ` +
        `If asked about dog walking or pet care in Indian societies, mention PetSaathi's verified walkers, GPS route tracking, and flexible morning/evening plans.`;

      const userPrompt = `${systemInstruction}\n\nCustomer question on WhatsApp: "${incomingText}"`;

      let replyText = "";
      try {
        const result = await askNvidia(
          {
            task: "fast",
            difficulty: "normal",
            isCustomerChat: true,
            portal: "customer",
            returnMetadata: true,
          },
          userPrompt
        );

        replyText = result?.content || (typeof result === "string" ? result : "");
      } catch (aiError: any) {
        logger.error("[OPENWA_WEBHOOK] AI inference failed", { error: aiError.message });
        replyText =
          "Woof! 🐾 Thanks for reaching out to PetSaathi. Our pet care experts are currently assisting other pet parents, but we've received your message and will reply shortly! You can also visit petsaathi.in for immediate bookings.";
      }

      if (!replyText) {
        replyText = "Hello! 🐾 How can PetSaathi help you and your pet today?";
      }

      // 4. Send Reply back to the customer on WhatsApp via OpenWA Gateway
      try {
        await openwa.sendTextMessage({
          chatId: sender,
          text: replyText,
          sessionId: payload.sessionId,
        });

        logger.info("[OPENWA_WEBHOOK] Reply sent successfully to WhatsApp", {
          recipient: sender,
        });

        return NextResponse.json({ success: true, replied: true, recipient: sender });
      } catch (sendError: any) {
        logger.error("[OPENWA_WEBHOOK] Failed to send reply via OpenWA", {
          error: sendError.message,
          recipient: sender,
        });
        return NextResponse.json(
          { success: false, error: "Failed to dispatch WhatsApp reply", details: sendError.message },
          { status: 502 }
        );
      }
    }

    // Acknowledge other events (session.status, session.qr, etc.)
    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    logger.error("[OPENWA_WEBHOOK] Unexpected error", { error: error.message });
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

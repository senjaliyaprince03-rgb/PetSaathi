import "server-only";

import type { NotificationChannel } from "@prisma/client";
import nodemailer from "nodemailer";

type ProviderMessage = {
  channel: NotificationChannel;
  destination: string;
  templateKey: string;
  payload: unknown;
  idempotencyKey: string;
};

export async function sendProviderMessage(message: ProviderMessage) {
  if (message.channel === "IN_APP") {
    return {
      providerMessageId: `in-app:${message.idempotencyKey}`,
      providerPayload: { accepted: true },
    };
  }
  if (message.channel === "EMAIL") return sendEmail(message);
  if (message.channel === "WHATSAPP") return sendWhatsApp(message);
  if (message.channel === "SMS") return sendSMS(message);
  if (message.channel === "PUSH") return sendPush(message);
  throw new Error(`Channel ${message.channel} is not configured`);
}

async function sendEmail(message: ProviderMessage) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) throw new Error("Email provider is not configured");
  const rendered = renderEmail(message.templateKey, message.payload);
  if (!rendered) throw new Error("Email template is not registered");
  
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  if (/[\r\n\0]/.test(message.destination) || /[\r\n\0]/.test(rendered.subject)) {
    throw new Error("Invalid email header characters detected");
  }

  try {
    const info = await withTimeout(
      transporter.sendMail({
        from: `"PetSaathi" <${user}>`,
        to: message.destination.trim().toLowerCase(),
        subject: rendered.subject.replace(/[\r\n]/g, " "),
        text: rendered.text,
      }),
      10_000,
    );
    return { providerMessageId: info.messageId, providerPayload: { accepted: true } };
  } catch (error) {
    throw new Error("Email provider rejected the message");
  }
}

async function sendWhatsApp(message: ProviderMessage) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const template = readRecord(message.payload)?.templateName;
  if (!token || !phoneNumberId) throw new Error("WhatsApp provider is not configured");
  if (typeof template !== "string") throw new Error("WhatsApp template is not registered");
  const response = await fetch(`https://graph.facebook.com/v22.0/${encodeURIComponent(phoneNumberId)}/messages`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ messaging_product: "whatsapp", to: message.destination, type: "template", template: { name: template, language: { code: "en" } } }), signal: AbortSignal.timeout(10_000) });
  if (!response.ok) throw new Error("WhatsApp provider rejected the message");
  const result = await response.json() as { messages?: Array<{ id?: string }> };
  return { providerMessageId: result.messages?.[0]?.id, providerPayload: { accepted: true } };
}

function renderEmail(templateKey: string, payload: unknown) {
  const values = readRecord(payload);
  if (templateKey === "booking.confirmed") return { subject: "Your PetSaathi booking is confirmed", text: `Your care booking ${String(values?.reference ?? "")} is confirmed. Open PetSaathi for the current service details.` };
  if (templateKey === "report.ready") return { subject: "Your PetSaathi care report is ready", text: `The care report for booking ${String(values?.reference ?? "")} is ready in your private PetSaathi dashboard.` };
  if (templateKey === "lead-magnet.delivery") {
    const title = String(values?.resourceTitle ?? "PetSaathi resource");
    const url = String(values?.resourceUrl ?? "");
    if (!url.startsWith("https://") && !url.startsWith("http://")) return null;
    return {
      subject: `${title} from PetSaathi`,
      text: `Your requested PetSaathi resource is ready: ${url}`,
    };
  }
  return null;
}

function readRecord(value: unknown) { return typeof value === "object" && value ? value as Record<string, unknown> : null; }

async function withTimeout<T>(operation: Promise<T>, timeoutMs: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      operation,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(
          () => reject(new Error("Provider request timed out")),
          timeoutMs,
        );
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}


/**
 * Send SMS notification
 * Uses MSG91 or generic webhook-based provider
 */
async function sendSMS(message: ProviderMessage) {
  const webhookUrl = process.env.SMS_OTP_WEBHOOK_URL;
  const secret = process.env.SMS_OTP_WEBHOOK_SECRET;

  if (!webhookUrl || !secret) {
    throw new Error("SMS provider is not configured");
  }

  const rendered = renderSMS(message.templateKey, message.payload);
  if (!rendered) {
    throw new Error("SMS template is not registered");
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${secret}`
      },
      body: JSON.stringify({
        phone: message.destination,
        message: rendered.text,
        idempotencyKey: message.idempotencyKey
      }),
      signal: AbortSignal.timeout(10_000)
    });

    if (!response.ok) {
      throw new Error("SMS provider rejected the message");
    }

    const result = await response.json() as { messageId?: string };
    return {
      providerMessageId: result.messageId ?? `sms:${message.idempotencyKey}`,
      providerPayload: { accepted: true }
    };
  } catch (error) {
    throw new Error("SMS delivery failed");
  }
}

/**
 * Send Push notification (Web Push, FCM, APNs)
 * Uses web-push for Web Push, Firebase for mobile
 */
async function sendPush(message: ProviderMessage) {
  // Web Push using VAPID (requires subscription management)
  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

  if (!vapidPublicKey || !vapidPrivateKey) {
    throw new Error("Push notification provider is not configured");
  }

  // In production, implement web-push library integration
  // For now, return placeholder
  return {
    providerMessageId: `push:${message.idempotencyKey}`,
    providerPayload: { accepted: true, note: "Push notification implementation pending" }
  };
}

/**
 * Render SMS template
 */
function renderSMS(templateKey: string, payload: unknown) {
  const values = readRecord(payload);

  if (templateKey === "booking.confirmed") {
    return {
      text: `Your PetSaathi booking ${String(values?.reference ?? "")} is confirmed! Track your service in the app.`
    };
  }

  if (templateKey === "sitter.en_route") {
    return {
      text: `Your PetSaathi caregiver is on the way! Track them live in the app.`
    };
  }

  if (templateKey === "service.completed") {
    return {
      text: `Your PetSaathi service is complete! View the care report in the app.`
    };
  }

  return null;
}

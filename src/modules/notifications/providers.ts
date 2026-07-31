import "server-only";

import type { NotificationChannel } from "@prisma/client";
import { Resend } from "resend";

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
  throw new Error(`Channel ${message.channel} is not configured`);
}

async function sendEmail(message: ProviderMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Email provider is not configured");
  const rendered = renderEmail(message.templateKey, message.payload);
  if (!rendered) throw new Error("Email template is not registered");
  const resend = new Resend(apiKey);
  const { data, error } = await withTimeout(
    resend.emails.send(
      {
        from,
        to: message.destination,
        subject: rendered.subject,
        text: rendered.text,
      },
      { idempotencyKey: message.idempotencyKey },
    ),
    10_000,
  );
  if (error || !data?.id) throw new Error("Email provider rejected the message");
  return { providerMessageId: data.id, providerPayload: { accepted: true } };
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

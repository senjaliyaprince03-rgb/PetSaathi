// src/lib/whatsapp.ts
// Sends WhatsApp messages via Meta Cloud API

const WHATSAPP_API_URL = `https://graph.facebook.com/v22.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

interface WhatsAppTextMessage {
  to: string; // E.164 format: +919876543210
  text: string;
}

interface WhatsAppTemplateMessage {
  to: string;
  templateName: string;
  languageCode: string;
  components?: object[];
}

export async function sendWhatsAppText({ to, text }: WhatsAppTextMessage) {
  const token = process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error("WhatsApp provider credentials are not configured");
  }

  const response = await fetch(WHATSAPP_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "text",
      text: { body: text, preview_url: false },
    }),
  });

  return response.json();
}

export async function sendWhatsAppTemplate({
  to,
  templateName,
  languageCode,
  components,
}: WhatsAppTemplateMessage) {
  const token = process.env.WHATSAPP_API_TOKEN || process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    throw new Error("WhatsApp provider credentials are not configured");
  }

  // Meta requires pre-approved templates for transactional messages
  const response = await fetch(WHATSAPP_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "template",
      template: {
        name: templateName,
        language: { code: languageCode },
        components,
      },
    }),
  });

  return response.json();
}

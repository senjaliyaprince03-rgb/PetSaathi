/**
 * PetSaathi Email Client
 * Singleton wrapper around Resend API with graceful fallback.
 * 
 * Dev mode (no API key or test key): logs to console, does NOT fail.
 * Production mode (real API key): sends via Resend.
 */

import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const FROM_NAME = process.env.RESEND_FROM_NAME ?? "PetSaathi";

// Singleton client
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!RESEND_API_KEY) return null;
  if (!resendClient) {
    resendClient = new Resend(RESEND_API_KEY);
  }
  return resendClient;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send a transactional email.
 * NEVER throws — always returns { success, error? }.
 * Always logs to console in development.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, text, replyTo } = options;
  const isDev = process.env.NODE_ENV !== "production";
  const client = getResendClient();

  if (isDev) {
    console.log(`[EMAIL] To: ${to} | Subject: ${subject}`);
  }

  // No client configured -> dev fallback, return success so OTP flow isn't blocked
  if (!client) {
    console.warn(`[EMAIL] No RESEND_API_KEY configured. Email NOT sent to ${to}. Subject: "${subject}"`);
    return { success: true, messageId: "dev-no-send" };
  }

  try {
    const result = await client.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      ...(text && { text }),
      ...(replyTo && { reply_to: replyTo }),
    });

    if (result.error) {
      console.error(`[EMAIL] Resend error for ${to}:`, result.error);
      return { success: false, error: result.error.message };
    }

    console.log(`[EMAIL] Sent to ${to} | ID: ${result.data?.id}`);
    return { success: true, messageId: result.data?.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown email error";
    console.error(`[EMAIL] Exception sending to ${to}:`, message);
    return { success: false, error: message };
  }
}

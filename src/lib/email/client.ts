/**
 * PetSaathi Email Client
 * Primary: Resend API (when RESEND_API_KEY is configured and RESEND_DISABLED !== "true").
 * Secondary Fallback: Gmail SMTP (when SMTP_USER and SMTP_PASS are configured).
 * Fails closed ({ success: false }) when no provider is configured or all configured providers fail.
 */

import { Resend } from "resend";
import nodemailer from "nodemailer";

let resendClient: Resend | null = null;
let cachedApiKey: string | null = null;

export function getResendClient(): Resend | null {
  if (process.env.RESEND_DISABLED === "true") return null;
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!resendClient || cachedApiKey !== apiKey) {
    resendClient = new Resend(apiKey);
    cachedApiKey = apiKey;
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
  provider?: "resend" | "smtp";
  error?: string;
}

/**
 * Send a transactional email via Resend (primary) or Gmail SMTP (fallback).
 * NEVER throws — always returns { success, messageId?, provider?, error? }.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const { to, subject, html, text, replyTo } = options;

  if (/[\r\n\0]/.test(to) || /[\r\n\0]/.test(subject)) {
    return {
      success: false,
      error: "Invalid email header characters detected",
    };
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  const fromName = process.env.RESEND_FROM_NAME ?? "PetSaathi";
  let lastError: string | undefined;

  // 1. Primary Provider: Resend
  const client = getResendClient();
  if (client) {
    try {
      const result = await client.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to,
        subject,
        html,
        ...(text && { text }),
        ...(replyTo && { reply_to: replyTo }),
      });

      if (!result.error && result.data?.id) {
        return {
          success: true,
          messageId: result.data.id,
          provider: "resend",
        };
      }

      lastError = result.error?.message || "Resend provider rejected the message";
      console.warn(`[EMAIL] Resend delivery failed (${lastError}); checking SMTP fallback.`);
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown Resend error";
      console.warn(`[EMAIL] Resend exception (${lastError}); checking SMTP fallback.`);
    }
  }

  // 2. Secondary Provider: Gmail SMTP Fallback
  const smtpUser = process.env.SMTP_USER?.trim();
  const smtpPass = process.env.SMTP_PASS?.trim();

  if (smtpUser && smtpPass && process.env.SMTP_DISABLED !== "true") {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPass },
    });

    try {
      const info = await new Promise<{ messageId?: string }>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("SMTP send timeout")), 15_000);
        transporter
          .sendMail({
            from: `"${fromName}" <${smtpUser}>`,
            to: to.trim().toLowerCase(),
            ...(replyTo && { replyTo }),
            subject,
            text,
            html,
          })
          .then((res) => {
            clearTimeout(timeout);
            resolve(res);
          })
          .catch((err) => {
            clearTimeout(timeout);
            reject(err);
          });
      });

      return {
        success: true,
        messageId: info.messageId,
        provider: "smtp",
      };
    } catch (smtpErr) {
      const smtpMessage = smtpErr instanceof Error ? smtpErr.message : "Unknown SMTP error";
      lastError = lastError ? `Resend: ${lastError}; SMTP: ${smtpMessage}` : smtpMessage;
      console.error(`[EMAIL] SMTP fallback failed:`, smtpMessage);
    }
  }

  return {
    success: false,
    error: lastError || "No email provider configured (RESEND_API_KEY or SMTP_USER/SMTP_PASS required)",
  };
}


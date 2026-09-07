import { prisma } from "@/lib/db";
import { sendEmail } from "./client";
import { renderEmailToHtml, renderEmailToText } from "./render";
import { EMAIL_SUBJECTS } from "./subjects";
import BookingConfirmationEmail, {
  BookingConfirmationEmailProps,
} from "./templates/booking-confirmation";
import WelcomeEmail, { WelcomeEmailProps } from "./templates/welcome";
import React from "react";

export type EmailEventType =
  | "WELCOME"
  | "BOOKING_CONFIRMED"
  | "BOOKING_CANCELLED"
  | "PAYMENT_RECEIPT"
  | "SAATHI_APPLICATION_RECEIVED";

export async function dispatchTransactionalEmail(
  userId: string | null,
  userEmail: string,
  eventType: EmailEventType,
  payload: Record<string, unknown>
): Promise<void> {
  const normalizedTo = userEmail.trim().toLowerCase();

  // 1. Check CommunicationPreference if userId is present
  if (userId) {
    try {
      const pref = await prisma.communicationPreference.findUnique({
        where: {
          userId_channel_purpose: {
            userId,
            channel: "EMAIL",
            purpose: eventType,
          },
        },
      });

      if (pref && !pref.enabled) {
        console.log(`[EMAIL] User ${userId} opted out of ${eventType} emails`);
        return;
      }
    } catch (err) {
      // Don't block email delivery if preference lookup fails
      console.warn("[EMAIL] Failed to check communication preferences:", err);
    }
  }

  // 2. Render appropriate template
  let subject = "PetSaathi Notification";
  let html = "";
  let text = "";

  if (eventType === "WELCOME") {
    subject =
      payload.userType === "saathi"
        ? EMAIL_SUBJECTS.WELCOME_SAATHI
        : EMAIL_SUBJECTS.WELCOME_CUSTOMER;

    const props: WelcomeEmailProps = {
      recipientName: String(payload.recipientName || "Pet Parent"),
      userType: payload.userType === "saathi" ? "saathi" : "customer",
      dashboardUrl: String(
        payload.dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL || "https://petsaathi.in"}/dashboard`
      ),
    };

    html = await renderEmailToHtml(React.createElement(WelcomeEmail, props));
    text = await renderEmailToText(React.createElement(WelcomeEmail, props));
  } else if (eventType === "BOOKING_CONFIRMED") {
    subject = EMAIL_SUBJECTS.BOOKING_CONFIRMED;

    const props: BookingConfirmationEmailProps = {
      customerName: String(payload.customerName || "Pet Parent"),
      petName: String(payload.petName || "Pet"),
      serviceName: String(payload.serviceName || "Pet Care Service"),
      bookingId: String(payload.bookingId || ""),
      bookingDate: String(payload.bookingDate || ""),
      bookingTime: String(payload.bookingTime || ""),
      saathiName: payload.saathiName ? String(payload.saathiName) : undefined,
      amount: String(payload.amount || "₹0"),
      dashboardUrl: String(
        payload.dashboardUrl || `${process.env.NEXT_PUBLIC_APP_URL || "https://petsaathi.in"}/dashboard`
      ),
    };

    html = await renderEmailToHtml(React.createElement(BookingConfirmationEmail, props));
    text = await renderEmailToText(React.createElement(BookingConfirmationEmail, props));
  } else if (eventType === "PAYMENT_RECEIPT") {
    subject = EMAIL_SUBJECTS.PAYMENT_RECEIPT;
    html = `<div style="font-family: sans-serif; padding: 20px;"><h2>🧾 PetSaathi Payment Receipt</h2><p>Hi ${payload.customerName || "Pet Parent"},</p><p>We received your payment of <strong>${payload.amount}</strong> for booking ${payload.bookingId}.</p><p>Payment ID: ${payload.paymentId}</p><p><a href="${payload.dashboardUrl}">View Details in Dashboard</a></p></div>`;
    text = `PetSaathi Payment Receipt\n\nAmount: ${payload.amount}\nBooking: ${payload.bookingId}\nPayment ID: ${payload.paymentId}`;
  } else if (eventType === "SAATHI_APPLICATION_RECEIVED") {
    subject = EMAIL_SUBJECTS.SAATHI_APPLICATION;
    html = `<div style="font-family: sans-serif; padding: 20px;"><h2>📋 Application Received</h2><p>Hi ${payload.applicantName || "Caregiver"},</p><p>Thank you for applying to become a PetSaathi caregiver! Our verification team is reviewing your profile.</p></div>`;
    text = `PetSaathi Application Received\n\nHi ${payload.applicantName},\nThank you for applying to PetSaathi! We will be in touch shortly.`;
  }

  // 3. Send email via client
  const emailResult = await sendEmail({
    to: normalizedTo,
    subject,
    html,
    text,
  });

  // 4. Record in NotificationOutbox for permanent audit trail
  try {
    const idempotencyKey = `email:${eventType.toLowerCase()}:${Date.now()}:${Math.random().toString(36).slice(2, 7)}`;
    await prisma.notificationOutbox.create({
      data: {
        userId: userId || undefined,
        channel: "EMAIL",
        templateKey: eventType.toLowerCase(),
        destination: normalizedTo,
        payload: {
          ...payload,
          subject,
          messageId: emailResult.messageId,
        },
        status: emailResult.success ? "SENT" : "FAILED",
        idempotencyKey,
        sentAt: emailResult.success ? new Date() : undefined,
        lastError: emailResult.error || undefined,
      },
    });
  } catch (outboxError) {
    console.error("[EMAIL] Outbox write failed:", outboxError);
  }
}

import { logger } from "@/lib/logger";

export async function sendBookingConfirmationEmail(bookingId: string, customerEmail: string) {
  // In a real implementation, this would use Resend or another provider
  // e.g. await resend.emails.send({ ... })
  logger.info(`Booking confirmation sent to ${customerEmail} for booking ${bookingId}`, {
    event: "email.booking_confirmation_sent",
    bookingId,
    customerEmail
  });
}

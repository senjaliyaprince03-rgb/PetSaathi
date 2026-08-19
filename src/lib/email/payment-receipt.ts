import { logger } from "@/lib/logger";

export async function sendPaymentReceiptEmail(paymentId: string, customerEmail: string) {
  // In a real implementation, this would use Resend or another provider
  logger.info(`Payment receipt sent to ${customerEmail} for payment ${paymentId}`, {
    event: "email.payment_receipt_sent",
    paymentId,
    customerEmail
  });
}

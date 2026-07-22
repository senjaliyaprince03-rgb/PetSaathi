import { prisma } from "@/lib/db";

/**
 * Queues a testimonial request after a booking is completed.
 * In production this would send an email or WhatsApp message.
 * For now it logs the intent for the operations team to act on manually.
 */
export async function triggerTestimonialRequest(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { customer: true, pet: true, serviceType: true },
  });

  if (!booking) {
    console.warn("[Automation] Booking not found for testimonial trigger:", bookingId);
    return;
  }

  console.log("[Automation] Testimonial request queued", {
    bookingId,
    customerEmail: booking.customer.email,
    customerName: booking.customer.displayName,
    petName: booking.pet.name,
    service: booking.serviceType.name,
  });
}

/**
 * Delivers the downloadable resource for a lead magnet request.
 * In production this would email the file or generate a signed download URL.
 * For now it generates a placeholder URL and logs the delivery.
 */
export async function deliverLeadMagnetResource(requestId: string): Promise<{ downloadUrl: string }> {
  const request = await prisma.leadMagnetRequest.findUnique({
    where: { id: requestId },
    include: { contact: true },
  });

  if (!request) {
    throw new Error(`LeadMagnetRequest not found: ${requestId}`);
  }

  const downloadUrl = `/downloads/lead-magnets/${request.magnetSlug}.pdf`;

  console.log("[Automation] Resource delivery", {
    requestId,
    magnetSlug: request.magnetSlug,
    contactEmail: request.contact.email,
    downloadUrl,
  });

  return { downloadUrl };
}

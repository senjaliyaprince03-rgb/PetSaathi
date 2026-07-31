import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import {
  getLeadMagnetResource,
  type LeadMagnetSlug,
} from "@/modules/marketing/resources";

/**
 * Queues an idempotent in-app testimonial request after a booking closes.
 */
export async function triggerTestimonialRequest(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { customer: true, pet: true, serviceType: true },
  });

  if (!booking) {
    logger.warn("testimonial_request.booking_not_found", { bookingId });
    return;
  }

  await prisma.notificationOutbox.upsert({
    where: { idempotencyKey: `testimonial-request:${booking.id}` },
    update: {},
    create: {
      userId: booking.customerId,
      channel: "IN_APP",
      templateKey: "testimonial.request",
      destination: booking.customerId,
      payload: {
        bookingId: booking.id,
        bookingReference: booking.reference,
        petName: booking.pet.name,
        serviceName: booking.serviceType.name,
      },
      idempotencyKey: `testimonial-request:${booking.id}`,
    },
  });
}

/**
 * Queues an idempotent email containing the real resource URL.
 */
export async function deliverLeadMagnetResource(
  requestId: string,
  slug: LeadMagnetSlug,
): Promise<{ downloadUrl: string }> {
  const request = await prisma.leadMagnetRequest.findUnique({
    where: { id: requestId },
    include: { contact: true },
  });

  if (!request) {
    throw new Error(`LeadMagnetRequest not found: ${requestId}`);
  }
  if (request.magnetSlug !== slug) {
    throw new Error("Lead magnet request does not match the requested resource");
  }
  if (!request.contact.email) {
    throw new Error("An email address is required to deliver this resource");
  }

  const resource = getLeadMagnetResource(slug);

  await prisma.notificationOutbox.upsert({
    where: { idempotencyKey: `lead-magnet:${request.id}` },
    update: {},
    create: {
      channel: "EMAIL",
      templateKey: "lead-magnet.delivery",
      destination: request.contact.email,
      payload: {
        requestId: request.id,
        resourceTitle: resource.title,
        resourceUrl: resource.url,
      },
      idempotencyKey: `lead-magnet:${request.id}`,
    },
  });

  return { downloadUrl: resource.url };
}

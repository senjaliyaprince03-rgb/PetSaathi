import { PrismaClient, ContentStatus } from "@prisma/client";
import { ContentError } from "./cms.service";

const prisma = new PrismaClient();

export async function recordConsent(
  userId: string,
  scope: string,
  evidenceRef: string
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new ContentError("user_not_found", "User not found.");
  }

  return await prisma.testimonialConsent.create({
    data: {
      userId,
      scope,
      evidenceRef,
      grantedAt: new Date()
    }
  });
}

export async function publishTestimonial(
  consentId: string,
  displayName: string,
  quote: string,
  context?: string,
  city?: string,
  bookingId?: string
) {
  const consent = await prisma.testimonialConsent.findUnique({ where: { id: consentId } });
  if (!consent) {
    throw new ContentError("consent_not_found", "Testimonial consent record not found.");
  }

  // Ensure it's not withdrawn or expired
  if (consent.withdrawnAt || (consent.expiresAt && consent.expiresAt < new Date())) {
    throw new ContentError("consent_invalid", "Consent is withdrawn or expired.");
  }

  return await prisma.testimonial.create({
    data: {
      consentId,
      userId: consent.userId,
      bookingId,
      displayName,
      quote,
      context,
      city,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });
}

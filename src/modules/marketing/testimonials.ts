import "server-only";

import { createHash } from "node:crypto";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db";
import type { AppIdentity } from "@/modules/auth/session";

export const testimonialConsentScopes = [
  "TEXT_ONLY",
  "FIRST_NAME_CITY",
] as const;
export type TestimonialConsentScope =
  (typeof testimonialConsentScopes)[number];

const testimonialConsentPolicyVersion = "testimonial-publication-v1";

export interface TestimonialSubmission {
  bookingId: string;
  story: string;
  rating: number;
  consentLevel: TestimonialConsentScope;
}

export async function submitTestimonial(
  data: TestimonialSubmission,
  identity: AppIdentity,
) {
  try {
    return await prisma.$transaction(
      async (tx) => {
        const booking = await tx.booking.findFirst({
          where: {
            id: data.bookingId,
            customerId: identity.id,
            status: { in: ["COMPLETED", "CLOSED"] },
          },
          select: {
            id: true,
            address: { select: { city: true } },
          },
        });
        if (!booking) {
          throw new TestimonialSubmissionError(
            404,
            "booking_not_found",
            "The completed booking does not exist.",
          );
        }

        const existing = await tx.testimonial.findUnique({
          where: { bookingId: booking.id },
          select: { id: true },
        });
        if (existing) {
          throw new TestimonialSubmissionError(
            409,
            "testimonial_already_submitted",
            "A testimonial has already been submitted for this booking.",
          );
        }

        const now = new Date();
        const evidenceRef = testimonialConsentEvidence({
          userId: identity.id,
          bookingId: booking.id,
          quote: data.story,
          scope: data.consentLevel,
        });
        const consent = await tx.testimonialConsent.create({
          data: {
            userId: identity.id,
            scope: data.consentLevel,
            evidenceRef,
            grantedAt: now,
          },
        });
        const displayName =
          data.consentLevel === "FIRST_NAME_CITY"
            ? identity.displayName.trim().split(/\s+/)[0] || "Pet parent"
            : "Verified pet parent";
        const testimonial = await tx.testimonial.create({
          data: {
            userId: identity.id,
            bookingId: booking.id,
            displayName,
            quote: data.story,
            context: `${data.rating}/5 verified customer rating`,
            city:
              data.consentLevel === "FIRST_NAME_CITY"
                ? booking.address.city
                : null,
            status: "IN_REVIEW",
            consentId: consent.id,
          },
        });

        await tx.auditLog.create({
          data: {
            actorId: identity.id,
            actorRole: "CUSTOMER",
            action: "testimonial.submitted",
            resourceType: "testimonial",
            resourceId: testimonial.id,
            after: {
              consentId: consent.id,
              consentLevel: data.consentLevel,
              consentPolicyVersion: testimonialConsentPolicyVersion,
              rating: data.rating,
              bookingId: booking.id,
              status: testimonial.status,
            },
            reason:
              "Customer submitted one booking-bound testimonial for moderation",
          },
        });

        return testimonial;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        maxWait: 5_000,
        timeout: 15_000,
      },
    );
  } catch (error) {
    if (error instanceof TestimonialSubmissionError) throw error;
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new TestimonialSubmissionError(
        409,
        "testimonial_already_submitted",
        "A testimonial has already been submitted for this booking.",
      );
    }
    throw error;
  }
}

export function hasBoundTestimonialConsent(input: {
  userId: string | null;
  bookingId: string | null;
  quote: string;
  consent: {
    userId: string;
    scope: string;
    evidenceRef: string;
    grantedAt: Date;
    withdrawnAt: Date | null;
    expiresAt: Date | null;
  } | null;
  booking?: {
    customerId: string;
    status: string;
  } | null;
  now?: Date;
}) {
  const now = input.now ?? new Date();
  if (
    !input.userId ||
    !input.bookingId ||
    !input.consent ||
    !isTestimonialConsentScope(input.consent.scope) ||
    input.consent.userId !== input.userId ||
    input.consent.grantedAt > now ||
    input.consent.withdrawnAt !== null ||
    (input.consent.expiresAt !== null && input.consent.expiresAt <= now)
  ) {
    return false;
  }
  if (
    input.booking &&
    (input.booking.customerId !== input.userId ||
      !["COMPLETED", "CLOSED"].includes(input.booking.status))
  ) {
    return false;
  }

  return (
    input.consent.evidenceRef ===
    testimonialConsentEvidence({
      userId: input.userId,
      bookingId: input.bookingId,
      quote: input.quote,
      scope: input.consent.scope,
    })
  );
}

export function testimonialConsentEvidence(input: {
  userId: string;
  bookingId: string;
  quote: string;
  scope: TestimonialConsentScope;
}) {
  const digest = createHash("sha256")
    .update(
      JSON.stringify({
        policyVersion: testimonialConsentPolicyVersion,
        userId: input.userId,
        bookingId: input.bookingId,
        quote: input.quote,
        scope: input.scope,
      }),
      "utf8",
    )
    .digest("hex");
  return `web:${testimonialConsentPolicyVersion}:${digest}`;
}

function isTestimonialConsentScope(
  value: string,
): value is TestimonialConsentScope {
  return testimonialConsentScopes.includes(value as TestimonialConsentScope);
}

export class TestimonialSubmissionError extends Error {
  constructor(
    public readonly status: 404 | 409,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "TestimonialSubmissionError";
  }
}

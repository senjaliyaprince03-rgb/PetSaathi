import { NextResponse } from "next/server";
import { z } from "zod";
import { isDatabaseConfigured, prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { authorizeApi } from "@/modules/auth/authorization";
import {
  hasBoundTestimonialConsent,
  submitTestimonial,
  TestimonialSubmissionError,
} from "@/modules/marketing/testimonials";
import { consumeRateLimit, requestIp } from "@/modules/security/rate-limit";

const schema = z.object({
  story: z.string().trim().min(10, "Story is too short").max(2_000),
  rating: z.number().int().min(1).max(5),
  consentLevel: z.enum(["TEXT_ONLY", "FIRST_NAME_CITY"]),
  bookingId: z.string().uuid(),
}).strict();

export async function GET(request: Request) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json(
      { stories: [], enabled: false },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const ip = requestIp(request);
    const { allowed, retryAfterSeconds } = await consumeRateLimit(
      "public_testimonials_get",
      ip,
      60,
      60_000,
    );
    if (!allowed) {
      return NextResponse.json(
        { error: "too_many_requests" },
        {
          status: 429,
          headers: {
            "Retry-After": retryAfterSeconds.toString(),
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const flag = await prisma.featureFlag.findUnique({
      where: { key: "public_testimonials" },
      select: { enabled: true },
    });
    if (!flag?.enabled) {
      return NextResponse.json(
        { stories: [], enabled: false },
        { headers: { "Cache-Control": "no-store" } },
      );
    }

    const now = new Date();
    const candidates = await prisma.testimonial.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
        userId: { not: null },
        bookingId: { not: null },
        consent: {
          grantedAt: { lte: now },
          withdrawnAt: null,
          OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
        },
      },
      orderBy: { publishedAt: "desc" },
      take: 32,
      select: {
        id: true,
        userId: true,
        bookingId: true,
        displayName: true,
        quote: true,
        context: true,
        city: true,
        consent: true,
        booking: {
          select: {
            customerId: true,
            status: true,
          },
        },
      },
    });
    const stories = candidates
      .filter((candidate) =>
        hasBoundTestimonialConsent({
          userId: candidate.userId,
          bookingId: candidate.bookingId,
          quote: candidate.quote,
          consent: candidate.consent,
          booking: candidate.booking,
          now,
        }),
      )
      .slice(0, 8)
      .map((candidate) => {
        const canShareIdentity =
          candidate.consent?.scope === "FIRST_NAME_CITY";
        return {
          id: candidate.id,
          displayName: canShareIdentity
            ? candidate.displayName
            : "Verified pet parent",
          quote: candidate.quote,
          context: candidate.context,
          city: canShareIdentity ? candidate.city : null,
        };
      });

    return NextResponse.json(
      { stories, enabled: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    logger.exception("testimonial.public_feed_failed", error);
    return NextResponse.json(
      { stories: [], enabled: false, degraded: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(request: Request) {
  const authorization = await authorizeApi(["CUSTOMER"]);
  if (!authorization.authorized) return authorization.response;

  try {
    const ip = requestIp(request);
    const [identityRate, ipRate] = await Promise.all([
      consumeRateLimit(
        "public_testimonials_identity",
        authorization.identity.id,
        5,
        60 * 60_000,
      ),
      consumeRateLimit("public_testimonials_ip", ip, 20, 60 * 60_000),
    ]);
    if (!identityRate.allowed || !ipRate.allowed) {
      return NextResponse.json(
        { error: "too_many_requests" },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.max(
                identityRate.retryAfterSeconds,
                ipRate.retryAfterSeconds,
              ),
            ),
            "Cache-Control": "no-store",
          },
        },
      );
    }

    const parsed = schema.safeParse(
      await request.json().catch(() => null),
    );
    
    if (!parsed.success) {
      return NextResponse.json(
        { error: "VALIDATION_ERROR", issues: parsed.error.flatten() },
        { status: 422, headers: { "Cache-Control": "no-store" } }
      );
    }

    const testimonial = await submitTestimonial(
      parsed.data,
      authorization.identity,
    );
    return NextResponse.json(
      { id: testimonial.id, status: testimonial.status },
      { status: 201, headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof TestimonialSubmissionError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        {
          status: error.status,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
    logger.exception("testimonial.submission_failed", error, {
      actorId: authorization.identity.id,
    });
    return NextResponse.json(
      { error: "INTERNAL_ERROR" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

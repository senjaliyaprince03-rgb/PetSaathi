import { prisma } from "../db";

/**
 * PetSaathi Custom Business Metrics Engine (Task 4.2)
 * Computes, aggregates, and exposes the 9 core SLA and operational metrics.
 */

export interface BusinessMetricsSnapshot {
  timestamp: string;
  bookingsCreatedLastHour: number;
  completedVsCancelledRatio: number;
  totalCompletedBookings: number;
  totalCancelledBookings: number;
  paymentSuccessRatePercent: number;
  paymentFailuresLastHour: number;
  chatbotQueriesLastHour: number;
  chatbotFallbackRatePercent: number;
  avgWalkDurationMinutes: number;
  avgSitterAcceptanceTimeSeconds: number;
  avgGpsPointsPerWalk: number;
}

// In-memory counter store for transient rolling window metrics (chatbot, webhooks)
interface MetricCounterState {
  chatbotQueries: number[];
  chatbotFallbacks: number[];
  webhookSuccesses: number[];
  webhookFailures: number[];
}

const metricsState: MetricCounterState = {
  chatbotQueries: [],
  chatbotFallbacks: [],
  webhookSuccesses: [],
  webhookFailures: [],
};

export function recordChatbotInteraction(wasFallback: boolean): void {
  const now = Date.now();
  metricsState.chatbotQueries.push(now);
  if (wasFallback) {
    metricsState.chatbotFallbacks.push(now);
  }
}

export function recordPaymentWebhookMetric(success: boolean): void {
  const now = Date.now();
  if (success) {
    metricsState.webhookSuccesses.push(now);
  } else {
    metricsState.webhookFailures.push(now);
  }
}

function pruneOldEntries(timestamps: number[], maxAgeMs: number): number[] {
  const cutoff = Date.now() - maxAgeMs;
  return timestamps.filter((t) => t >= cutoff);
}

/**
 * Computes the complete snapshot of all 9 business metrics across MongoDB and runtime telemetry.
 */
export async function computeBusinessMetricsSnapshot(): Promise<BusinessMetricsSnapshot> {
  const oneHourAgo = new Date(Date.now() - 3600000);
  const oneHourMs = 3600000;

  // Prune rolling window buffers
  metricsState.chatbotQueries = pruneOldEntries(metricsState.chatbotQueries, oneHourMs);
  metricsState.chatbotFallbacks = pruneOldEntries(metricsState.chatbotFallbacks, oneHourMs);
  metricsState.webhookSuccesses = pruneOldEntries(metricsState.webhookSuccesses, oneHourMs);
  metricsState.webhookFailures = pruneOldEntries(metricsState.webhookFailures, oneHourMs);

  // 1. Bookings created per hour
  let bookingsCreatedLastHour = 0;
  let completedCount = 0;
  let cancelledCount = 0;
  let avgWalkDurationMinutes = 30.0;
  let avgSitterAcceptanceTimeSeconds = 45.0;
  let avgGpsPointsPerWalk = 0;

  try {
    bookingsCreatedLastHour = await prisma.booking.count({
      where: { createdAt: { gte: oneHourAgo } },
    });

    // 2. Bookings completed vs. cancelled ratio
    completedCount = await prisma.booking.count({
      where: { status: "COMPLETED" },
    });
    cancelledCount = await prisma.booking.count({
      where: {
        status: {
          in: ["CUSTOMER_CANCELLED", "SITTER_CANCELLED", "DECLINED"],
        },
      },
    });

    // 7. Average walk duration (from TrackingSessions with endedAt)
    const recentSessions = await prisma.trackingSession.findMany({
      where: {
        endedAt: { not: null },
      },
      select: { startedAt: true, endedAt: true, id: true },
      take: 50,
    });

    let totalDurationMinutes = 0;
    for (const s of recentSessions) {
      if (s.endedAt) {
        totalDurationMinutes += (s.endedAt.getTime() - s.startedAt.getTime()) / 60000;
      }
    }
    avgWalkDurationMinutes =
      recentSessions.length === 0 ? 30.0 : Number((totalDurationMinutes / recentSessions.length).toFixed(1));

    // 8. Sitter acceptance time (offeredAt -> acceptedAt from BookingAssignment)
    const acceptedAssignments = await prisma.bookingAssignment.findMany({
      where: {
        status: "ACCEPTED",
        respondedAt: { not: null },
      },
      select: { offeredAt: true, respondedAt: true },
      take: 50,
    });

    let totalAcceptanceSeconds = 0;
    for (const a of acceptedAssignments) {
      if (a.respondedAt) {
        totalAcceptanceSeconds += (a.respondedAt.getTime() - a.offeredAt.getTime()) / 1000;
      }
    }
    avgSitterAcceptanceTimeSeconds =
      acceptedAssignments.length === 0
        ? 45.0
        : Number((totalAcceptanceSeconds / acceptedAssignments.length).toFixed(1));

    // 9. GPS points recorded per walk
    const totalPoints = await prisma.trackingPoint.count();
    const totalSessions = await prisma.trackingSession.count();
    avgGpsPointsPerWalk =
      totalSessions === 0 ? 0 : Number((totalPoints / totalSessions).toFixed(1));
  } catch (error) {
    logger.warn("business_metrics_database_query_degraded", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  const completedVsCancelledRatio =
    cancelledCount === 0 ? (completedCount > 0 ? completedCount : 1.0) : Number((completedCount / cancelledCount).toFixed(2));

  // 3 & 4. Payment webhook success rate and failures
  const recentSuccesses = metricsState.webhookSuccesses.length;
  const recentFailures = metricsState.webhookFailures.length;
  const totalPayments = recentSuccesses + recentFailures;
  const paymentSuccessRatePercent =
    totalPayments === 0 ? 100.0 : Number(((recentSuccesses / totalPayments) * 100).toFixed(1));
  const paymentFailuresLastHour = recentFailures;

  // 5 & 6. Chatbot query volume and fallback rate
  const chatbotQueriesLastHour = metricsState.chatbotQueries.length;
  const chatbotFallbacksLastHour = metricsState.chatbotFallbacks.length;
  const chatbotFallbackRatePercent =
    chatbotQueriesLastHour === 0
      ? 0.0
      : Number(((chatbotFallbacksLastHour / chatbotQueriesLastHour) * 100).toFixed(1));

  return {
    timestamp: new Date().toISOString(),
    bookingsCreatedLastHour,
    completedVsCancelledRatio,
    totalCompletedBookings: completedCount,
    totalCancelledBookings: cancelledCount,
    paymentSuccessRatePercent,
    paymentFailuresLastHour,
    chatbotQueriesLastHour,
    chatbotFallbackRatePercent,
    avgWalkDurationMinutes,
    avgSitterAcceptanceTimeSeconds,
    avgGpsPointsPerWalk,
  };
}

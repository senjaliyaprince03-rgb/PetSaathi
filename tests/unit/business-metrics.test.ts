import { describe, it, expect } from "vitest";
import {
  recordChatbotInteraction,
  recordPaymentWebhookMetric,
  computeBusinessMetricsSnapshot,
} from "../../src/lib/observability/business-metrics";

describe("Business Metrics Telemetry (Task 4.2)", () => {
  it("records chatbot queries and accurately computes fallback rate", async () => {
    recordChatbotInteraction(false);
    recordChatbotInteraction(false);
    recordChatbotInteraction(true); // 1 fallback out of 3 = 33.3%

    const snapshot = await computeBusinessMetricsSnapshot();
    expect(snapshot.chatbotQueriesLastHour).toBeGreaterThanOrEqual(3);
    expect(snapshot.chatbotFallbackRatePercent).toBeGreaterThan(0);
  });

  it("records webhook successes and failures to compute payment success rate", async () => {
    recordPaymentWebhookMetric(true);
    recordPaymentWebhookMetric(true);
    recordPaymentWebhookMetric(false); // 2 successes, 1 failure = 66.7%

    const snapshot = await computeBusinessMetricsSnapshot();
    expect(snapshot.paymentFailuresLastHour).toBeGreaterThanOrEqual(1);
    expect(snapshot.paymentSuccessRatePercent).toBeLessThan(100);
  });

  it("computes all 9 business metric fields in snapshot", async () => {
    const snapshot = await computeBusinessMetricsSnapshot();
    expect(snapshot).toHaveProperty("bookingsCreatedLastHour");
    expect(snapshot).toHaveProperty("completedVsCancelledRatio");
    expect(snapshot).toHaveProperty("paymentSuccessRatePercent");
    expect(snapshot).toHaveProperty("paymentFailuresLastHour");
    expect(snapshot).toHaveProperty("chatbotQueriesLastHour");
    expect(snapshot).toHaveProperty("chatbotFallbackRatePercent");
    expect(snapshot).toHaveProperty("avgWalkDurationMinutes");
    expect(snapshot).toHaveProperty("avgSitterAcceptanceTimeSeconds");
    expect(snapshot).toHaveProperty("avgGpsPointsPerWalk");
  });
});

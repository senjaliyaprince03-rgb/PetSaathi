import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { logger } from "../../../lib/observability/logger";

export const dynamic = "force-dynamic";

/**
 * PetSaathi Production Readiness Health Check (Task 4.4)
 * Returns status, database connectivity, uptime, and version.
 */
export async function GET() {
  const startTime = Date.now();
  let dbStatus: "connected" | "disconnected" = "disconnected";
  let pingLatencyMs = -1;

  try {
    const pingStart = Date.now();
    // Query a single lightweight record to verify active DB connection
    await prisma.serviceType.findFirst({
      select: { id: true },
    });
    pingLatencyMs = Date.now() - pingStart;
    dbStatus = "connected";
  } catch (error) {
    logger.error("health_check_db_ping_failed", {
      error: error instanceof Error ? error : new Error(String(error)),
    });
  }

  const isHealthy = dbStatus === "connected";
  const durationMs = Date.now() - startTime;

  const healthPayload = {
    status: isHealthy ? "ok" : "degraded",
    db: dbStatus,
    uptime: Math.floor(process.uptime()),
    version: process.env.npm_package_version || "0.1.0",
    timestamp: new Date().toISOString(),
    metrics: {
      dbPingLatencyMs: pingLatencyMs,
      totalCheckLatencyMs: durationMs,
    },
  };

  return NextResponse.json(healthPayload, {
    status: isHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}

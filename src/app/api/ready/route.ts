import { NextResponse } from "next/server";

import { probeReadiness, readinessIsAcceptable } from "@/lib/readiness";

export const dynamic = "force-dynamic";

export async function GET() {
  const isProd = process.env.NODE_ENV === "production";
  const dependencies = await probeReadiness();
  const ready = readinessIsAcceptable(dependencies, isProd);

  return NextResponse.json(
    {
      status: ready ? (isProd ? "ready" : "degraded") : "not_ready",
      service: "petsaathi-web",
      timestamp: new Date().toISOString(),
      dependencies,
    },
    {
      status: ready ? 200 : 503,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export const dynamic = "force-dynamic";

class SentryExampleAPIError extends Error {
  constructor(message: string | undefined) {
    super(message);
    this.name = "SentryExampleAPIError";
  }
}

// A test API route to verify Sentry backend error monitoring
export function GET() {
  Sentry.logger.info("Sentry example API called");
  try {
    throw new SentryExampleAPIError(
      "This error is raised on the backend called by the example page.",
    );
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Sentry test error",
        sentryReported: true,
      },
      { status: 500 },
    );
  }
}


/**
 * Request ID Middleware for Next.js
 * 
 * Assigns a unique request ID to every API request for distributed tracing.
 * Request ID is propagated through:
 * - Response headers (X-Request-ID)
 * - Log context
 * - Error responses
 */

import { NextRequest, NextResponse } from "next/server";
import { generateRequestId } from "@/lib/logger";

export function requestIdMiddleware(request: NextRequest): NextResponse | null {
  // Extract or generate request ID
  const requestId = request.headers.get("x-request-id") || generateRequestId();

  // Create response with request ID header
  const response = NextResponse.next();
  response.headers.set("X-Request-ID", requestId);

  // Attach request ID to request object for use in API routes
  // Note: Next.js middleware cannot modify request object directly
  // API routes should extract request ID from headers

  return response;
}

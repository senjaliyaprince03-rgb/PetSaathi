import { NextResponse } from "next/server";

type JsonHeaders = Record<string, string>;

const INFRA_ERROR_NAMES = new Set([
  "PrismaClientInitializationError",
  "PrismaClientRustPanicError",
  "MongoServerSelectionError",
  "MongoNetworkError",
  "MongoNetworkTimeoutError",
  "MongoTopologyClosedError",
  "MongoSystemError",
  "MongoWriteConcernError",
]);

const INFRA_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "EHOSTUNREACH",
  "ENETUNREACH",
]);

/**
 * Detects infrastructure-level failures (database/network) so route handlers can
 * return a retryable 503 instead of a generic 500. Never matches validation or
 * auth errors, and never leaks internals into responses.
 */
export function isInfrastructureError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const named = error as { name?: string; code?: unknown; cause?: unknown; message?: string };
  if (named.name && INFRA_ERROR_NAMES.has(named.name)) return true;
  if (typeof named.code === "string" && INFRA_ERROR_CODES.has(named.code)) return true;
  if (named.cause && isInfrastructureError(named.cause)) return true;
  return /querySrv|ECONNREFUSED|ENOTFOUND|ETIMEDOUT|server selection|topology closed/i.test(named.message ?? "");
}

type ErrorOptions = {
  issues?: unknown;
  headers?: JsonHeaders;
  retryable?: boolean;
};

/** Single error envelope for all API routes: { error, message, retryable?, issues? }. */
export function jsonError(code: string, message: string, status: number, options: ErrorOptions = {}) {
  const body: Record<string, unknown> = { error: code, message };
  if (options.retryable) body.retryable = true;
  if (options.issues) body.issues = options.issues;
  return NextResponse.json(body, { status, headers: options.headers });
}

/** Infrastructure/database unavailable. Retryable, never leaks internals. */
export function serviceUnavailable(message = "We're temporarily unable to complete this request. Please try again in a moment.", retryAfterSeconds = 30) {
  return jsonError("SERVICE_UNAVAILABLE", message, 503, {
    retryable: true,
    headers: { "Retry-After": String(retryAfterSeconds) },
  });
}

/** Unexpected server error. Safe generic message, no internals. */
export function internalError(message = "Something went wrong on our side. Please try again.") {
  return jsonError("INTERNAL_ERROR", message, 500);
}

/**
 * Classifies a caught error and returns the correct response:
 * infrastructure failures become retryable 503s; anything else becomes a
 * generic 500. Both paths log server-side and never leak internals.
 */
export function errorResponseForCaughtError(
  error: unknown,
  logger: { exception: (event: string, error: unknown, context?: Record<string, unknown>) => void },
  event: string,
  context?: Record<string, unknown>,
) {
  logger.exception(event, error, context);
  if (isInfrastructureError(error)) return serviceUnavailable();
  return internalError();
}

/**
 * Cron Job Authentication
 * 
 * Prevents unauthorized access to scheduled job endpoints.
 * 
 * Security model:
 * 1. All /api/jobs/* routes require CRON_SECRET header
 * 2. Secret must match environment variable
 * 3. Requests without valid secret are rejected with 401
 * 
 * Usage:
 * ```typescript
 * import { authenticateCronRequest } from '@/lib/cron-auth';
 * 
 * export async function GET(request: Request) {
 *   const authResult = authenticateCronRequest(request);
 *   if (!authResult.authorized) {
 *     return new Response(authResult.message, { status: 401 });
 *   }
 *   
 *   // Execute cron job logic
 * }
 * ```
 */

export interface CronAuthResult {
  authorized: boolean;
  message?: string;
}

/**
 * Authenticates cron job requests using CRON_SECRET header
 */
export function authenticateCronRequest(request: Request): CronAuthResult {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("[Cron Auth] CRON_SECRET not configured. Rejecting all cron requests.");
    return {
      authorized: false,
      message: "Cron job authentication not configured",
    };
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return {
      authorized: false,
      message: "Missing Authorization header",
    };
  }

  // Support both "Bearer <secret>" and raw secret
  const providedSecret = authHeader.startsWith("Bearer ")
    ? authHeader.substring(7)
    : authHeader;

  if (providedSecret !== cronSecret) {
    return {
      authorized: false,
      message: "Invalid cron secret",
    };
  }

  return { authorized: true };
}

/**
 * Higher-order function to wrap cron job handlers with authentication
 */
export function withCronAuth<T extends (...args: any[]) => any>(
  handler: T
): (...args: Parameters<T>) => ReturnType<T> | Response {
  return ((...args: Parameters<T>) => {
    const request = args[0] as Request;

    const authResult = authenticateCronRequest(request);
    if (!authResult.authorized) {
      return new Response(
        JSON.stringify({ error: authResult.message }),
        { 
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return handler(...args);
  }) as any;
}

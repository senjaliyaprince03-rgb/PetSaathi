import * as Sentry from "@sentry/nextjs";

/**
 * PetSaathi Sentry User Context & Instrumentation (Task 4.1)
 * Enriches error traces with user, role, and society context while honoring DPDP privacy rules.
 */

export interface SentryUserContext {
  userId: string;
  role?: string;
  societyId?: string;
  ipAddress?: string;
}

/**
 * Enriches current Sentry scope with authenticated user metadata.
 * Strips PII (email, phone, name) to conform with India DPDP Act.
 */
export function setSentryUserContext(user: SentryUserContext | null): void {
  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: user.userId,
    ip_address: user.ipAddress ? "{{private}}" : undefined,
  });

  Sentry.setTags({
    user_role: user.role ?? "UNKNOWN",
    society_id: user.societyId ?? "NONE",
  });
}

/**
 * Captures an error with custom operation tags and breadcrumb metadata.
 */
export function captureAppError(
  error: unknown,
  context: {
    service: string;
    action: string;
    extra?: Record<string, any>;
  }
): string {
  return Sentry.captureException(error, {
    tags: {
      service: context.service,
      action: context.action,
    },
    extra: context.extra,
  });
}

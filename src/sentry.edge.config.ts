import * as Sentry from "@sentry/nextjs";

import { isSentryEnabled } from "@/lib/public-config";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const enabled = isSentryEnabled(dsn, process.env.VERCEL_ENV ?? process.env.NODE_ENV);

Sentry.init({
  dsn: enabled ? dsn : undefined,
  enabled,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0,
  sendDefaultPii: false,
  beforeSend(event) {
    if (event.request) {
      event.request = {
        method: event.request.method,
        url: event.request.url,
      };
    }
    if (event.user) {
      event.user = event.user.id ? { id: event.user.id } : undefined;
    }
    return event;
  },
});

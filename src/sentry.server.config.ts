import * as Sentry from "@sentry/nextjs";

import { isSentryEnabled } from "@/lib/public-config";

const dsn =
  process.env.SENTRY_DSN ??
  process.env.NEXT_PUBLIC_SENTRY_DSN ??
  "https://96a995215329a1ab5351a88c0fa5a729@o4511980811190272.ingest.us.sentry.io/4511980956418048";

Sentry.init({
  dsn,
  enabled: true,
  environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development",
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  tracesSampleRate: 1.0,
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

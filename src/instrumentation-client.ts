// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a user loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

import { isSentryEnabled } from "@/lib/public-config";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const enabled = isSentryEnabled(dsn, process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV);

Sentry.init({
  dsn: enabled ? dsn : undefined,
  enabled,
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
  integrations: [Sentry.replayIntegration()],
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

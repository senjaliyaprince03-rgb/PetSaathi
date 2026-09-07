import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN || "https://96a995215329a1ab5351a88c0fa5a729@o4511980811190272.ingest.us.sentry.io/4511980956418048",
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.2 : 1.0,
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.npm_package_version || "0.1.0",
  environment: process.env.NODE_ENV || "development",
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
});

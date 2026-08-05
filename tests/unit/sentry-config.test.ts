import { describe, expect, it } from "vitest";

import { isSentryEnabled } from "../../src/lib/public-config";

describe("isSentryEnabled", () => {
  it("disables Sentry in development by default", () => {
    expect(isSentryEnabled("https://public@o0.ingest.sentry.io/1", "development")).toBe(false);
  });

  it("enables Sentry in development when explicitly opted in", () => {
    process.env.NEXT_PUBLIC_SENTRY_ENABLE = "true";
    expect(isSentryEnabled("https://public@o0.ingest.sentry.io/1", "development")).toBe(true);
    delete process.env.NEXT_PUBLIC_SENTRY_ENABLE;
  });

  it("enables Sentry in production when the DSN is valid", () => {
    expect(isSentryEnabled("https://public@o0.ingest.sentry.io/1", "production")).toBe(true);
  });
});

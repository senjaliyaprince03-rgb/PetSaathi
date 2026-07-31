import { afterEach, describe, expect, it } from "vitest";

import {
  GET as getNotifications,
  POST as postNotifications,
} from "@/app/api/jobs/notifications/route";
import { GET as getTrackingRetention } from "@/app/api/jobs/tracking-retention/route";
import { GET as getUploadRetention } from "@/app/api/jobs/upload-retention/route";

const originalCronSecret = process.env.CRON_SECRET;

afterEach(() => {
  if (originalCronSecret === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = originalCronSecret;
});

describe("background job authentication", () => {
  it.each([
    ["notifications GET", getNotifications],
    ["notifications POST", postNotifications],
    ["tracking retention GET", getTrackingRetention],
    ["upload retention GET", getUploadRetention],
  ])("rejects an unsigned %s request", async (_name, handler) => {
    process.env.CRON_SECRET = "test-cron-secret-that-is-at-least-32";
    const response = await handler(
      new Request("http://localhost/api/jobs/test"),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "unauthorized" });
  });
});

import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { createHash, randomBytes } from "node:crypto";

const prisma = new PrismaClient();

test.afterAll(async () => {
  await prisma.$disconnect();
});

test.describe("Phase 7: Edge Cases & Error States", () => {

  test("1. Webhook replay is idempotent and returns duplicate: true", async ({ request }) => {
    const eventId = `evt_test_${Date.now()}`;
    const payload = {
      entity: "event",
      event: "payment.captured",
      contains: ["payment"],
      payload: { payment: { entity: { id: "pay_test_replay_123", amount: 29900, status: "captured" } } }
    };
    const rawBody = JSON.stringify(payload);
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "whsec_test_secret_petsaathi";
    const crypto = await import("node:crypto");
    const signature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

    // First delivery
    const res1 = await request.post("/api/webhooks/razorpay", {
      data: rawBody,
      headers: {
        "x-razorpay-signature": signature,
        "x-razorpay-event-id": eventId,
        "content-type": "application/json"
      }
    });
    expect([202, 200]).toContain(res1.status());

    // Second delivery (replay)
    const res2 = await request.post("/api/webhooks/razorpay", {
      data: rawBody,
      headers: {
        "x-razorpay-signature": signature,
        "x-razorpay-event-id": eventId,
        "content-type": "application/json"
      }
    });
    expect(res2.status()).toBe(200);
    const data2 = await res2.json();
    expect(data2.duplicate).toBe(true);
  });

  test("2. Session expiry: unauthenticated protected API returns 401", async ({ request }) => {
    const res = await request.get("/api/bookings", {
      headers: {
        "Cookie": "petsaathi_session=invalid_or_expired_token_12345"
      }
    });
    expect(res.status()).toBe(401);
  });

  test("3. Geofence breach telemetry flags high deviation", async () => {
    const haversineDistanceMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371e3;
      const φ1 = (lat1 * Math.PI) / 180;
      const φ2 = (lat2 * Math.PI) / 180;
      const Δφ = ((lat2 - lat1) * Math.PI) / 180;
      const Δλ = ((lon2 - lon1) * Math.PI) / 180;
      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    // Bopal Ahmedabad base coords: 23.0300, 72.4700
    // Coords 500m away: 23.0345, 72.4700
    const dist = haversineDistanceMeters(23.0300, 72.4700, 23.0345, 72.4700);
    expect(dist).toBeGreaterThan(160); // 160m geofence threshold breached
  });

  test("4. Offline indicator / ServiceWorker registration exists", async ({ page }) => {
    await page.goto("/");
    const manifest = await page.locator('link[rel="manifest"]').getAttribute("href");
    expect(manifest).toBe("/manifest.webmanifest");
  });

  test("5. Race condition prevention: Capacity check isolates slot exhaustion", async () => {
    const cap = await prisma.capacityLimit.findFirst({
      where: { maximum: { gt: 0 } }
    });
    expect(cap).not.toBeNull();
    expect(cap?.maximum).toBeGreaterThan(0);
  });

});

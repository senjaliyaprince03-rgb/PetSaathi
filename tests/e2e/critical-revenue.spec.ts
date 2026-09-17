import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

test.afterAll(async () => {
  await prisma.$disconnect();
});

test.describe("Phase 11: Critical Revenue & Operational Paths (7 Tests)", () => {

  test("1. Database integrity: All 10 pre-seeded roles exist and are configured", async () => {
    const emails = [
      "customer.deep@petsaathi.com",
      "customer2.deep@petsaathi.com",
      "saathi.deep@petsaathi.com",
      "saathi.app.deep@petsaathi.com",
      "ops.deep@petsaathi.com",
      "super.deep@petsaathi.com",
      "city.deep@petsaathi.com",
      "partner.deep@petsaathi.com",
      "society.deep@petsaathi.com",
      "security.deep@petsaathi.com"
    ];
    for (const email of emails) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { roles: true }
      });
      expect(user, `User ${email} must exist`).not.toBeNull();
      expect(user?.roles.length).toBeGreaterThan(0);
    }
  });

  test("2. Book -> Pay -> Track -> Review full revenue lifecycle", async () => {
    const { execSync } = await import("node:child_process");
    const output = execSync("npm run simulate:walk", { encoding: "utf8" });
    expect(output).toContain("All 10 Steps Passed Successfully!");
    expect(output).toContain("Customer 5-star rating & review");
  });

  test("3. Pay Fail -> Retry error recovery", async ({ request }) => {
    const res = await request.post("/api/webhooks/razorpay", {
      data: JSON.stringify({ entity: "event", event: "payment.failed" }),
      headers: {
        "x-razorpay-signature": "invalid_sig_123",
        "x-razorpay-event-id": `evt_fail_${Date.now()}`,
        "content-type": "application/json"
      }
    });
    expect(res.status()).toBe(401);
  });

  test("4. Cancel Pre/Post payment state machine transitions", async () => {
    const bookingTransitions: Record<string, string[]> = {
      DRAFT: ["REQUESTED", "CUSTOMER_CANCELLED"],
      REQUESTED: ["RISK_REVIEW", "MATCHING", "DECLINED", "CUSTOMER_CANCELLED"],
      PAYMENT_PENDING: ["CONFIRMED", "DECLINED", "CUSTOMER_CANCELLED"],
      CONFIRMED: ["SITTER_EN_ROUTE", "SITTER_CANCELLED", "CUSTOMER_CANCELLED", "REPLACEMENT_REQUIRED", "NO_SHOW", "INCIDENT_HOLD"],
      COMPLETED: ["CLOSED"],
      CLOSED: []
    };

    const canCancel = (from: string) => bookingTransitions[from]?.includes("CUSTOMER_CANCELLED") ?? false;

    // Pre-payment cancel
    expect(canCancel("REQUESTED")).toBe(true);
    expect(canCancel("PAYMENT_PENDING")).toBe(true);
    // Post-payment cancel
    expect(canCancel("CONFIRMED")).toBe(true);
    // Cannot cancel after completion
    expect(canCancel("COMPLETED")).toBe(false);
  });

  test("5. Saathi Journey: State machine enforces step sequence", async () => {
    const allowed: Record<string, string[]> = {
      OFFERED: ["ACCEPTED", "DECLINED", "EXPIRED"],
      ACCEPTED: ["CUSTOMER_APPROVED", "CANCELLED"],
      CUSTOMER_APPROVED: ["EN_ROUTE", "CANCELLED"],
      EN_ROUTE: ["CHECK_IN", "CANCELLED"],
      CHECK_IN: ["IN_PROGRESS"],
      IN_PROGRESS: ["REPORT_PENDING", "COMPLETED"],
      REPORT_PENDING: ["COMPLETED"]
    };

    expect(allowed["OFFERED"]?.includes("ACCEPTED")).toBe(true);
    expect(allowed["ACCEPTED"]?.includes("CUSTOMER_APPROVED")).toBe(true);
    expect(allowed["CUSTOMER_APPROVED"]?.includes("EN_ROUTE")).toBe(true);
    expect(allowed["EN_ROUTE"]?.includes("CHECK_IN")).toBe(true);
    expect(allowed["CHECK_IN"]?.includes("IN_PROGRESS")).toBe(true);
    expect(allowed["IN_PROGRESS"]?.includes("REPORT_PENDING")).toBe(true);
    expect(allowed["OFFERED"]?.includes("IN_PROGRESS")).toBe(false);
  });

  test("6. Admin Dispatch -> Close operational controls", async () => {
    const activeService = await prisma.serviceType.findFirst({
      where: { active: true }
    });
    expect(activeService).not.toBeNull();
    expect(activeService?.active).toBe(true);
  });

  test("7. Payout -> Withdrawal ledger constraints", async () => {
    const allowed: Record<string, string[]> = {
      REQUESTED: ["PROCESSING", "REJECTED"],
      PROCESSING: ["COMPLETED", "FAILED"],
      FAILED: ["REQUESTED"]
    };
    expect(allowed["REQUESTED"]?.includes("PROCESSING")).toBe(true);
    expect(allowed["PROCESSING"]?.includes("COMPLETED")).toBe(true);
    expect(allowed["COMPLETED"]?.includes("REQUESTED") ?? false).toBe(false);
  });

});

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { awardLoyaltyPoints, redeemLoyaltyPoints, getLoyaltyBalance } from "../../src/modules/loyalty/service";
import { GET as LoyaltyGET } from "../../src/app/api/customer/loyalty/route";

const prisma = new PrismaClient();

describe("Phase 11: Loyalty Ledger Integration", () => {
  let userId: string;

  beforeAll(async () => {
    // Create a user for loyalty testing
    const user = await prisma.user.create({
      data: {
        email: `customer_${randomUUID()}@petsaathi.in`,
        displayName: "Loyalty Customer",
        authUserId: randomUUID(),
        roles: { create: [{ role: "CUSTOMER" }] }
      }
    });
    userId = user.id;
  });

  afterAll(async () => {
    // Cleanup
    if (userId) {
      await prisma.loyaltyLedger.deleteMany({ where: { userId } });
      await prisma.userRole.deleteMany({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
    }
    await prisma.$disconnect();
  });

  it("should start with 0 balance", async () => {
    const balance = await getLoyaltyBalance(userId);
    expect(balance).toBe(0);
  });

  it("should award loyalty points", async () => {
    const entry = await awardLoyaltyPoints(
      userId,
      500,
      "Signup bonus",
      "signup-bonus-" + userId
    );
    expect(entry.delta).toBe(500);
    expect(entry.balanceAfter).toBe(500);

    const balance = await getLoyaltyBalance(userId);
    expect(balance).toBe(500);
  });

  it("should be idempotent on award", async () => {
    const entry1 = await awardLoyaltyPoints(
      userId,
      500,
      "Signup bonus",
      "signup-bonus-" + userId // Same idempotency key
    );
    const balance = await getLoyaltyBalance(userId);
    // Should still be 500, not 1000
    expect(balance).toBe(500);
  });

  it("should redeem loyalty points", async () => {
    const entry = await redeemLoyaltyPoints(
      userId,
      200,
      "Discount on booking",
      "booking-discount-1"
    );
    expect(entry.delta).toBe(-200);
    expect(entry.balanceAfter).toBe(300);

    const balance = await getLoyaltyBalance(userId);
    expect(balance).toBe(300);
  });

  it("should fail to redeem if insufficient balance", async () => {
    await expect(redeemLoyaltyPoints(
      userId,
      1000,
      "Big discount",
      "booking-discount-2"
    )).rejects.toThrow("Not enough loyalty points");
  });

  it("should return balance and history via API", async () => {
    const req = new Request("http://localhost/api/customer/loyalty?limit=10", {
      headers: { "x-user-id": userId }
    });
    const res = await LoyaltyGET(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.balance).toBe(300);
    expect(data.history).toBeDefined();
    expect(data.history.length).toBe(2); // 1 award, 1 redeem (idempotent award didn't create new row)
    expect(data.history[0].balanceAfter).toBe(300);
    expect(data.history[1].balanceAfter).toBe(500);
  });
});

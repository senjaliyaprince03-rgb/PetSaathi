import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient, CityLaunchStage, OperatorStatus } from "@prisma/client";
import { assignCityManager, recordCityHealthScore } from "../../src/modules/scale/city-ops.service";
import { recordSafetyAudit } from "../../src/modules/scale/safety.service";
import { onboardPartner } from "../../src/modules/scale/franchise.service";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

describe("Phase 14: Scale, Funding, Franchise Integration", () => {
  let cityId: string;
  let managerId: string;
  let sitterId: string;
  let auditorId: string;
  let partnerId: string;

  beforeAll(async () => {
    // Set up a City
    cityId = randomUUID();
    await prisma.city.create({
      data: {
        id: cityId,
        slug: `scale-city-${Date.now()}`,
        name: "Scale City",
        state: "Maharashtra",
        status: CityLaunchStage.PUBLIC_LIMITED
      }
    });

    // Setup Users
    managerId = randomUUID();
    await prisma.user.create({
      data: {
        id: managerId,
        email: `manager-${Date.now()}@petsaathi.in`,
        phoneE164: `+9199${Math.floor(10000000 + Math.random() * 90000000)}`,
        displayName: "Manager",
        authUserId: randomUUID()
      }
    });

    sitterId = randomUUID();
    await prisma.user.create({
      data: {
        id: sitterId,
        email: `sitter-${Date.now()}@petsaathi.in`,
        phoneE164: `+9199${Math.floor(10000000 + Math.random() * 90000000)}`,
        displayName: "Sitter",
        authUserId: randomUUID()
      }
    });

    auditorId = randomUUID();
    await prisma.user.create({
      data: {
        id: auditorId,
        email: `auditor-${Date.now()}@petsaathi.in`,
        phoneE164: `+9199${Math.floor(10000000 + Math.random() * 90000000)}`,
        displayName: "Auditor",
        authUserId: randomUUID()
      }
    });

    // Setup Contact Person for Partner
    const contactId = randomUUID();
    await prisma.user.create({
      data: {
        id: contactId,
        email: `contact-${Date.now()}@petsaathi.in`,
        phoneE164: `+9199${Math.floor(10000000 + Math.random() * 90000000)}`,
        displayName: "Contact",
        authUserId: randomUUID()
      }
    });

    partnerId = randomUUID();
    await prisma.operatingPartner.create({
      data: {
        id: partnerId,
        legalName: "Scale Partner LLC",
        displayName: "Scale Partner",
        contactPersonId: contactId,
        email: "contact@scalepartner.in",
        status: OperatorStatus.PROSPECT_OP
      }
    });
  });

  afterAll(async () => {
    // Cleanup
    await prisma.operatingPartner.deleteMany({ where: { id: partnerId } });
    await prisma.safetyAudit.deleteMany({ where: { sitterId } });
    await prisma.cityHealthScore.deleteMany({ where: { cityId } });
    await prisma.cityManager.deleteMany({ where: { cityId } });
    await prisma.city.deleteMany({ where: { id: cityId } });
    await prisma.user.deleteMany({
      where: { id: { in: [managerId, sitterId, auditorId] } }
    });
  });

  it("should assign a city manager", async () => {
    const manager = await assignCityManager(cityId, managerId);
    expect(manager.userId).toBe(managerId);
    expect(manager.cityId).toBe(cityId);
  });

  it("should record a monthly city health score", async () => {
    const health = await recordCityHealthScore(
      cityId,
      new Date(),
      85,
      90,
      80,
      88,
      82
    );
    expect(health.overallScore).toBe(85);
    expect(health.safetyScore).toBe(90);
  });

  it("should perform an independent safety audit and flag required actions", async () => {
    const audit = await recordSafetyAudit(
      sitterId,
      auditorId,
      new Date(),
      65, // Below 70 triggers actionRequired
      "Failed to secure pet gates."
    );
    expect(audit.score).toBe(65);
    expect(audit.passed).toBe(false);
    expect(audit.actionRequired).toBe(true);
  });

  it("should transition an operating partner from prospect to active", async () => {
    const activePartner = await onboardPartner(partnerId);
    expect(activePartner.status).toBe(OperatorStatus.ACTIVE_OP);
    expect(activePartner.onboardedAt).not.toBeNull();
  });
});

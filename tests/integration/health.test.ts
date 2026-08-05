import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import { randomUUID } from "crypto";
import { addHealthEvent, getHealthTimeline } from "../../src/modules/health/service";
import { GET as HealthGET, POST as HealthPOST } from "../../src/app/api/customer/pets/[id]/health/route";

const prisma = new PrismaClient();

describe("Phase 11: Pet Health Timeline Integration", () => {
  let userId: string;
  let householdId: string;
  let id: string;

  beforeAll(async () => {
    // Create user, household, pet
    const user = await prisma.user.create({
      data: {
        email: `health_customer_${randomUUID()}@petsaathi.in`,
        displayName: "Health Customer",
        roles: { create: [{ role: "CUSTOMER" }] }
      }
    });
    userId = user.id;

    const profile = await prisma.customerProfile.create({
      data: { userId }
    });

    const pet = await prisma.pet.create({
      data: {
        ownerId: userId,
        name: "Max",
        species: "DOG",
        breed: "Golden Retriever",
        birthDate: new Date("2020-01-01"),
        sex: "MALE",
        weightKg: 30
      }
    });
    id = pet.id;
  });

  afterAll(async () => {
    // Cleanup
    if (id) {
      await prisma.petHealthEvent.deleteMany({ where: { petId: id } });
      await prisma.pet.delete({ where: { id: id } });
    }
    if (userId) {
      await prisma.customerProfile.delete({ where: { userId } });
      await prisma.userRole.deleteMany({ where: { userId } });
      await prisma.user.delete({ where: { id: userId } });
    }
    await prisma.$disconnect();
  });

  it("should add a health event", async () => {
    const event = await addHealthEvent(
      id,
      userId,
      "VACCINATION",
      "Rabies Vaccine",
      new Date("2026-07-20T10:00:00Z"),
      "VET",
      { batchNo: "12345" }
    );
    expect(event.eventType).toBe("VACCINATION");
    expect(event.summary).toBe("Rabies Vaccine");
    expect(event.source).toBe("VET");
  });

  it("should fetch timeline in descending order", async () => {
    await addHealthEvent(
      id,
      userId,
      "VET_VISIT",
      "Annual Checkup",
      new Date("2026-07-25T10:00:00Z")
    );

    const timeline = await getHealthTimeline(id);
    expect(timeline.length).toBe(2);
    // Should be descending by occurredAt
    expect(timeline[0]!.eventType).toBe("VET_VISIT");
    expect(timeline[1]!.eventType).toBe("VACCINATION");
  });

  it("should POST and GET via API", async () => {
    // POST
    const reqBody = {
      eventType: "MEDICATION",
      summary: "Tick Prevention",
      occurredAt: "2026-07-28T09:00:00Z",
      source: "USER"
    };
    const postReq = new Request(`http://localhost/api/customer/pets/${id}/health`, {
      method: "POST",
      headers: { "x-user-id": userId, "content-type": "application/json" },
      body: JSON.stringify(reqBody)
    });

    const postRes = await HealthPOST(postReq as any, { params: Promise.resolve({ id }) });
    expect(postRes.status).toBe(201);

    // GET
    const getReq = new Request(`http://localhost/api/customer/pets/${id}/health?limit=10`, {
      headers: { "x-user-id": userId }
    });
    const getRes = await HealthGET(getReq as any, { params: Promise.resolve({ id }) });
    expect(getRes.status).toBe(200);

    const data = await getRes.json();
    expect(data.timeline.length).toBe(3);
    expect(data.timeline[0].eventType).toBe("MEDICATION");
  });
});

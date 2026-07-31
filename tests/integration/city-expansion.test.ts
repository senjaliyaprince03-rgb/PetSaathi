import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { prisma } from "@/lib/db";
import { NextRequest } from "next/server";
import { POST as CityPOST } from "@/app/api/admin/cities/route";
import { POST as LaunchPOST } from "@/app/api/admin/cities/[id]/launch/route";
import { POST as ManagerPOST } from "@/app/api/admin/cities/[id]/managers/route";
import { POST as ServiceConfigPOST } from "@/app/api/admin/cities/[id]/services/route";
import { randomUUID } from "node:crypto";
import { CityLaunchStage, ServiceStatus } from "@prisma/client";

vi.mock("@/modules/auth/server", () => ({
  getAdminSession: vi.fn().mockResolvedValue("admin-123"),
}));

describe("Phase 10: Multi-City Expansion Integration", () => {
  let managerId: string;
  let serviceTypeId: string;

  beforeEach(async () => {
    const user = await prisma.user.create({
      data: {
        email: `manager_${randomUUID()}@petsaathi.in`,
        displayName: "City Manager",
        roles: { create: [{ role: "CITY_MANAGER" }] },
        authUserId: randomUUID()
      }
    });
    managerId = user.id;

    const serviceType = await prisma.serviceType.upsert({
      where: { code: "DOG_WALK_30" },
      update: {},
      create: {
        code: "DOG_WALK_30",
        name: "Dog Walking",
        description: "Professional dog walking",
        basePricePaise: 50000,
      }
    });
    serviceTypeId = serviceType.id;
  });

  afterEach(async () => {
    await prisma.cityManager.deleteMany();
    await prisma.cityServiceConfiguration.deleteMany();
    await prisma.cityPage.deleteMany();
  await prisma.city.deleteMany();
    await prisma.user.delete({ where: { id: managerId } });
  });

  it("should create a city, enforce launch gates, and launch successfully when criteria are met", async () => {
    // 1. Create a City
    const cityReq = new NextRequest("http://localhost/api/admin/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Mumbai",
        slug: "mumbai",
        state: "Maharashtra"
      })
    });
    const res = await CityPOST(cityReq);
    expect(res.status).toBe(201);
    const city = await res.json();
    expect(city.status).toBe(CityLaunchStage.RESEARCH);

    // 2. Try to launch without a manager or services (Should fail)
    let launchReq = new NextRequest(`http://localhost/api/admin/cities/${city.id}/launch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetStage: "PUBLIC_LIMITED" })
    });
    let launchRes = await LaunchPOST(launchReq as any, { params: Promise.resolve({ id: city.id }) } as any);
    expect(launchRes.status).toBe(422); // Unprocessable Entity
    let launchError = await launchRes.json();
    expect(launchError.error).toBe("missing_manager");

    // 3. Assign a City Manager
    const managerReq = new NextRequest(`http://localhost/api/admin/cities/${city.id}/managers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: managerId })
    });
    const managerRes = await ManagerPOST(managerReq as any, { params: Promise.resolve({ id: city.id }) } as any);
    expect(managerRes.status).toBe(201);

    // 4. Try to launch without services (Should fail)
    launchReq = new NextRequest(`http://localhost/api/admin/cities/${city.id}/launch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetStage: "PUBLIC_LIMITED" })
    });
    launchRes = await LaunchPOST(launchReq as any, { params: Promise.resolve({ id: city.id }) } as any);
    expect(launchRes.status).toBe(422);
    launchError = await launchRes.json();
    expect(launchError.error).toBe("missing_services");

    // 5. Configure a service for the city
    const serviceReq = new NextRequest(`http://localhost/api/admin/cities/${city.id}/services`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceTypeId,
        status: "ACTIVE",
        bookingMode: "ON_DEMAND"
      })
    });
    const serviceRes = await ServiceConfigPOST(serviceReq as any, { params: Promise.resolve({ id: city.id }) } as any);
    if (serviceRes.status !== 201) {
      console.log(await serviceRes.text());
    }
    expect(serviceRes.status).toBe(201);

    // 6. Launch again (Should succeed now)
    launchReq = new NextRequest(`http://localhost/api/admin/cities/${city.id}/launch`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetStage: "PUBLIC_LIMITED" })
    });
    launchRes = await LaunchPOST(launchReq as any, { params: Promise.resolve({ id: city.id }) } as any);
    expect(launchRes.status).toBe(200);

    const updatedCity = await launchRes.json();
    expect(updatedCity.status).toBe("PUBLIC_LIMITED");
    expect(updatedCity.launchedAt).not.toBeNull();
  });
});

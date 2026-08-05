import type { Role } from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import PetHealthRecordsPage from "@/app/(portal)/pets/[id]/records/page";
import { prisma } from "@/lib/db";
import type { AppIdentity } from "@/modules/auth/session";
import { randomUUID } from "node:crypto";
import { notFound, redirect } from "next/navigation";

vi.mock("@/modules/auth/session", () => {
  return {
    getCurrentIdentity: vi.fn(),
    hasAnyRole: vi.fn(),
  };
});

vi.mock("next/navigation", () => {
  return {
    redirect: vi.fn(() => { throw new Error("NEXT_REDIRECT"); }),
    notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }),
  };
});

import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

describe("Pet Records Page Security", () => {
  const ids: { ownerId: string, otherId: string, staffId: string, petId: string } = { ownerId: randomUUID(), otherId: randomUUID(), staffId: randomUUID(), petId: "" };

  function identity(id: string, roles: Role[]): AppIdentity {
    return {
      id,
      displayName: "Integration Identity",
      status: "ACTIVE",
      roles
    };
  }
  
  beforeEach(async () => {
    vi.clearAllMocks();
    
    // We only need ownerId to match the auth context for Pet record. 
    // We do not strictly need the user object, but Prisma requires it for relations.
    const owner = await prisma.user.create({
      data: { 
        email: `owner-${randomUUID()}@example.test`,
        displayName: "Owner Name",
        status: "ACTIVE" 
      }
    });
    ids.ownerId = owner.id;
    
    const pet = await prisma.pet.create({
      data: {
        ownerId: owner.id,
        name: "TestPet",
        species: "DOG",
        active: true,
      }
    });
    ids.petId = pet.id;
  });

  afterEach(async () => {
    await prisma.auditLog.deleteMany({
      where: { resourceType: "pet", resourceId: ids.petId },
    });
    await prisma.petHealthEvent.deleteMany({ where: { petId: ids.petId } });
    await prisma.pet.deleteMany({ where: { id: ids.petId } });
    await prisma.user.deleteMany({ where: { id: ids.ownerId } });
  });

  it("redirects to login for anonymous user", async () => {
    vi.mocked(getCurrentIdentity).mockResolvedValue(null);
    
    await expect(PetHealthRecordsPage({ params: Promise.resolve({ id: ids.petId }) })).rejects.toThrow("NEXT_REDIRECT");
    expect(redirect).toHaveBeenCalledWith(
      `/login?returnTo=${encodeURIComponent(`/pets/${ids.petId}/records`)}`,
    );
  });

  it("returns not found for another customer", async () => {
    vi.mocked(getCurrentIdentity).mockResolvedValue(identity(ids.otherId, ["CUSTOMER"]));
    vi.mocked(hasAnyRole).mockReturnValue(false);
    
    await expect(PetHealthRecordsPage({ params: Promise.resolve({ id: ids.petId }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("returns not found for nonexistent pet", async () => {
    vi.mocked(getCurrentIdentity).mockResolvedValue(identity(ids.ownerId, ["CUSTOMER"]));
    vi.mocked(hasAnyRole).mockReturnValue(false);
    
    await expect(PetHealthRecordsPage({ params: Promise.resolve({ id: randomUUID() }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(notFound).toHaveBeenCalled();
  });

  it("renders page for owner", async () => {
    vi.mocked(getCurrentIdentity).mockResolvedValue(identity(ids.ownerId, ["CUSTOMER"]));
    vi.mocked(hasAnyRole).mockReturnValue(false);
    
    const page = await PetHealthRecordsPage({ params: Promise.resolve({ id: ids.petId }) });
    expect(redirect).not.toHaveBeenCalled();
    expect(page).toBeDefined();
  });

  it("renders page for approved staff", async () => {
    vi.mocked(getCurrentIdentity).mockResolvedValue(identity(ids.staffId, ["SAFETY_ADMIN"]));
    vi.mocked(hasAnyRole).mockReturnValue(true);
    
    const page = await PetHealthRecordsPage({ params: Promise.resolve({ id: ids.petId }) });
    expect(redirect).not.toHaveBeenCalled();
    expect(page).toBeDefined();
    const audit = await prisma.auditLog.findFirst({
      where: {
        action: "pet.health_records_viewed",
        resourceType: "pet",
        resourceId: ids.petId,
        actorId: ids.staffId,
      },
    });
    expect(audit).toBeTruthy();
  });
});


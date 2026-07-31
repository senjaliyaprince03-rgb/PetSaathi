import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class HealthError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "HealthError";
  }
}

export async function addHealthEvent(
  petId: string,
  createdBy: string,
  eventType: string,
  summary: string,
  occurredAt: Date,
  source: string = "USER",
  details?: Prisma.InputJsonValue,
  providerRef?: string
) {
  // Ensure pet exists
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new HealthError("pet_not_found", "Pet does not exist");
  }

  return await prisma.petHealthEvent.create({
    data: {
      petId,
      eventType,
      summary,
      occurredAt,
      source,
      createdBy,
      details,
      providerRef
    }
  });
}

export async function getHealthTimeline(petId: string, limit = 50) {
  // Ensure pet exists
  const pet = await prisma.pet.findUnique({ where: { id: petId } });
  if (!pet) {
    throw new HealthError("pet_not_found", "Pet does not exist");
  }

  return await prisma.petHealthEvent.findMany({
    where: { petId },
    orderBy: { occurredAt: 'desc' },
    take: limit
  });
}

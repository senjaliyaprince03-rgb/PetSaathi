import "server-only";

import { prisma } from "@/lib/db";

export async function ownedPet(petId: string, ownerId: string) {
  return prisma.pet.findFirst({ where: { id: petId, ownerId, active: true, deletedAt: null }, select: { id: true, name: true } });
}

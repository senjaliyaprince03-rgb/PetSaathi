import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ScaleError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "ScaleError";
  }
}

export async function assignCityManager(cityId: string, userId: string) {
  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city) throw new ScaleError("not_found", "City not found.");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ScaleError("not_found", "User not found.");

  return await prisma.cityManager.create({
    data: {
      cityId,
      userId,
      status: "ACTIVE"
    }
  });
}

export async function recordCityHealthScore(
  cityId: string,
  periodDate: Date,
  overallScore: number,
  safetyScore: number,
  supplyScore: number,
  demandScore: number,
  operationsScore: number
) {
  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city) throw new ScaleError("not_found", "City not found.");

  return await prisma.cityHealthScore.create({
    data: {
      cityId,
      periodDate,
      overallScore,
      safetyScore,
      supplyScore,
      demandScore,
      operationsScore
    }
  });
}

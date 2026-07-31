import { prisma } from "@/lib/db";
import type { ServiceStatus } from "@prisma/client";
import { CityLaunchStage } from "@prisma/client";

export class CityConfigurationError extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
}

/**
 * Creates a new city in RESEARCH stage.
 */
export async function createCity(data: { name: string; slug: string; state: string; timezone?: string }) {
  return await prisma.city.create({
    data: {
      name: data.name,
      slug: data.slug,
      state: data.state,
      timezone: data.timezone ?? "Asia/Kolkata",
      status: CityLaunchStage.RESEARCH,
    }
  });
}

/**
 * Assigns a manager to a city. 
 * This is a required step before launching a city.
 */
export async function assignCityManager(cityId: string, userId: string) {
  return await prisma.$transaction(async (tx) => {
    // Check if the user is already a manager somewhere else
    const existingManager = await tx.cityManager.findFirst({
      where: { userId, status: "ACTIVE" }
    });
    
    if (existingManager) {
      if (existingManager.cityId === cityId) return existingManager; // Already managing this city
      throw new CityConfigurationError("user_already_managing", "User is already actively managing another city.");
    }

    return await tx.cityManager.create({
      data: {
        cityId,
        userId,
        status: "ACTIVE",
      }
    });
  });
}

/**
 * Attempts to launch a city (move stage to LIVE).
 * Implements strict launch gates.
 */
export async function updateCityLaunchStage(cityId: string, targetStage: CityLaunchStage) {
  return await prisma.$transaction(async (tx) => {
    const city = await tx.city.findUnique({
      where: { id: cityId },
      include: {
        cityServiceConfigs: true
      }
    });

    if (!city) throw new CityConfigurationError("city_not_found", "City not found");

    if (targetStage === CityLaunchStage.PUBLIC_LIMITED) {
      // Gate 1: Must have an active City Manager
      const activeManager = await tx.cityManager.findFirst({
        where: { cityId, status: "ACTIVE" }
      });
      if (!activeManager) {
        throw new CityConfigurationError("missing_manager", "Cannot launch a city without an active City Manager.");
      }

      // Gate 2: Must have at least one service configured and ACTIVE
      const hasEnabledService = city.cityServiceConfigs.some(config => config.status === "ACTIVE");
      if (!hasEnabledService) {
        throw new CityConfigurationError("missing_services", "Cannot launch a city without any active services.");
      }
    }

    return await tx.city.update({
      where: { id: cityId },
      data: {
        status: targetStage,
        launchedAt: targetStage === CityLaunchStage.PUBLIC_LIMITED && city.status !== CityLaunchStage.PUBLIC_LIMITED ? new Date() : city.launchedAt
      }
    });
  });
}

/**
 * Configures service details for a city.
 */
export async function configureCityService(data: {
  cityId: string;
  serviceTypeId: string;
  status: ServiceStatus;
  bookingMode?: string;
  minimumNoticeMinutes?: number;
  maximumAdvanceDays?: number;
}) {
  const existingConfig = await prisma.cityServiceConfiguration.findFirst({
    where: { cityId: data.cityId, serviceTypeId: data.serviceTypeId }
  });

  if (existingConfig) {
    return await prisma.cityServiceConfiguration.update({
      where: { id: existingConfig.id },
      data: {
        status: data.status,
        bookingMode: data.bookingMode,
        minimumNoticeMinutes: data.minimumNoticeMinutes,
        maximumAdvanceDays: data.maximumAdvanceDays,
      }
    });
  } else {
    return await prisma.cityServiceConfiguration.create({
      data: {
        cityId: data.cityId,
        serviceTypeId: data.serviceTypeId,
        status: data.status,
        bookingMode: data.bookingMode,
        minimumNoticeMinutes: data.minimumNoticeMinutes,
        maximumAdvanceDays: data.maximumAdvanceDays,
      }
    });
  }
}

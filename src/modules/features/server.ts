import "server-only";

import { isDatabaseConfigured, prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function isFeatureEnabled(key: string) {
  if (!isDatabaseConfigured()) return false;
  try {
    const flag = await prisma.featureFlag.findUnique({ where: { key }, select: { enabled: true } });
    return flag?.enabled === true;
  } catch (error) {
    // Public pages remain available when an optional flag cannot be read during a database outage.
    logger.warn("feature_flag_unavailable", {
      key,
      error: error instanceof Error ? error.message : "unknown_error",
    });
    return false;
  }
}

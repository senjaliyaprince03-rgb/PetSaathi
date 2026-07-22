import "server-only";

import { isDatabaseConfigured, prisma } from "@/lib/db";

export async function isFeatureEnabled(key: string) {
  if (!isDatabaseConfigured()) return false;
  const flag = await prisma.featureFlag.findUnique({ where: { key }, select: { enabled: true } });
  return flag?.enabled === true;
}

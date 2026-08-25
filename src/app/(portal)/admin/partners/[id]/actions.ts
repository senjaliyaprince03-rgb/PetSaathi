"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";

export async function setPartnerStatus(partnerId: string, status: "ACTIVE" | "PAUSED") {
  const identity = await getCurrentIdentity();
  if (!identity || !hasAnyRole(identity, ["OPERATIONS_ADMIN", "SUPER_ADMIN"])) {
    return { ok: false as const, error: "forbidden" };
  }

  try {
    const partner = await prisma.partner.findUnique({ where: { id: partnerId }, select: { id: true } });
    if (!partner) return { ok: false as const, error: "not_found" };
    await prisma.partner.update({ where: { id: partnerId }, data: { status } });
  } catch {
    return { ok: false as const, error: "update_failed" };
  }

  revalidatePath(`/admin/partners/${partnerId}`);
  revalidatePath("/admin/partners");
  return { ok: true as const };
}

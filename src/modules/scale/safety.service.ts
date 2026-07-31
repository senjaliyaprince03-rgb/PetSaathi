import { PrismaClient } from "@prisma/client";
import { ScaleError } from "./city-ops.service";

const prisma = new PrismaClient();

export async function recordSafetyAudit(
  sitterId: string,
  auditorId: string,
  auditDate: Date,
  score: number,
  notes?: string
) {
  const sitter = await prisma.user.findUnique({ where: { id: sitterId } });
  if (!sitter) throw new ScaleError("not_found", "Sitter not found.");

  const auditor = await prisma.user.findUnique({ where: { id: auditorId } });
  if (!auditor) throw new ScaleError("not_found", "Auditor not found.");

  const passed = score >= 80;
  const actionRequired = score < 70; // Hard gate for trust & safety

  return await prisma.safetyAudit.create({
    data: {
      sitterId,
      auditorId,
      auditDate,
      score,
      passed,
      actionRequired,
      notes
    }
  });
}

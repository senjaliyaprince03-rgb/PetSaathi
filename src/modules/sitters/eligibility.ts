import type { PermissionStatus, RiskLevel, SitterStatus } from "@prisma/client";

const riskRank: Record<RiskLevel, number> = { GREEN: 0, YELLOW: 1, RED: 2, UNASSESSED: 3 };

export type EligibilityInput = {
  sitterStatus: SitterStatus;
  permissionStatus: PermissionStatus;
  permissionExpiresAt: Date | null;
  riskLimit: RiskLevel;
  petRisk: RiskLevel;
  hasScheduleConflict: boolean;
  hasActiveHold: boolean;
  now?: Date;
};

export function sitterEligibility(input: EligibilityInput) {
  const reasons: string[] = [];
  const now = input.now ?? new Date();
  if (input.sitterStatus !== "APPROVED") reasons.push("sitter_not_approved");
  if (input.permissionStatus !== "ACTIVE") reasons.push("service_permission_inactive");
  if (input.permissionExpiresAt && input.permissionExpiresAt <= now) reasons.push("service_permission_expired");
  if (input.petRisk === "UNASSESSED") reasons.push("pet_risk_unassessed");
  if (input.petRisk === "RED") reasons.push("pet_risk_not_supported");
  if (riskRank[input.petRisk] > riskRank[input.riskLimit]) reasons.push("risk_exceeds_permission");
  if (input.hasScheduleConflict) reasons.push("schedule_conflict");
  if (input.hasActiveHold) reasons.push("active_safety_hold");
  return { eligible: reasons.length === 0, reasons };
}

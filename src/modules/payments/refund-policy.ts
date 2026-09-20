/**
 * Shared PetSaathi Refund and Cancellation Policy Engine
 * Single source of truth for /refund-policy page, /api/payments/refund, and booking cancellations.
 */

export type RefundTier =
  | "MORE_THAN_24_HOURS"
  | "BETWEEN_4_AND_24_HOURS"
  | "LESS_THAN_4_HOURS"
  | "DURING_SERVICE"
  | "AFTER_SERVICE"
  | "CAREGIVER_CANCELLED";

export interface RefundPolicyTierConfig {
  code: RefundTier;
  label: string;
  badge: string;
  refundPercentage: number;
  description: string;
  apologyCreditPaise: number;
}

export const APOLOGY_CREDIT_PAISE = 25000; // ₹250 apology wallet credit when caregiver cancels

export const PUBLISHED_REFUND_TIERS: Record<RefundTier, RefundPolicyTierConfig> = {
  MORE_THAN_24_HOURS: {
    code: "MORE_THAN_24_HOURS",
    label: "> 24 Hours Notice",
    badge: "100% Refund",
    refundPercentage: 100,
    description: "Cancel anytime at least 24 hours prior to service start for a full 100% refund with zero cancellation fee.",
    apologyCreditPaise: 0,
  },
  BETWEEN_4_AND_24_HOURS: {
    code: "BETWEEN_4_AND_24_HOURS",
    label: "4 – 24 Hours Notice",
    badge: "50% Refund",
    refundPercentage: 50,
    description: "50% refund returned to your source account. 50% is disbursed to the caregiver to compensate for reserved schedule time.",
    apologyCreditPaise: 0,
  },
  LESS_THAN_4_HOURS: {
    code: "LESS_THAN_4_HOURS",
    label: "< 4 Hours Notice",
    badge: "No Refund",
    refundPercentage: 0,
    description: "Cancellations within 4 hours are non-refundable as the caregiver has already mobilized and committed their schedule.",
    apologyCreditPaise: 0,
  },
  DURING_SERVICE: {
    code: "DURING_SERVICE",
    label: "During Service",
    badge: "No Refund",
    refundPercentage: 0,
    description: "Service has already commenced; cancellations during service are non-refundable.",
    apologyCreditPaise: 0,
  },
  AFTER_SERVICE: {
    code: "AFTER_SERVICE",
    label: "After Service",
    badge: "No Refund",
    refundPercentage: 0,
    description: "Service window has ended; standard cancellations are not eligible for automated refund.",
    apologyCreditPaise: 0,
  },
  CAREGIVER_CANCELLED: {
    code: "CAREGIVER_CANCELLED",
    label: "Caregiver Cancellation",
    badge: "100% Refund + ₹250 Credit",
    refundPercentage: 100,
    description: "Guaranteed 100% immediate refund to original payment method plus ₹250 wallet apology credit.",
    apologyCreditPaise: APOLOGY_CREDIT_PAISE,
  },
};

export interface RefundCalculationResult {
  tier: RefundTier;
  label: string;
  refundPercentage: number;
  refundAmountPaise: number;
  apologyCreditPaise: number;
  diffHours: number;
  diffSeconds: number;
  isEligible: boolean;
  explanation: string;
}

export function calculateRefundTier({
  scheduledStart,
  scheduledEnd,
  cancelledBy,
  amountPaise,
  now = new Date(),
}: {
  scheduledStart: Date | string;
  scheduledEnd?: Date | string | null;
  cancelledBy: "CUSTOMER" | "SITTER" | "OPERATIONS_ADMIN";
  amountPaise: number;
  now?: Date;
}): RefundCalculationResult {
  const startDate = typeof scheduledStart === "string" ? new Date(scheduledStart) : scheduledStart;
  const endDate = scheduledEnd ? (typeof scheduledEnd === "string" ? new Date(scheduledEnd) : scheduledEnd) : null;
  const nowDate = typeof now === "string" ? new Date(now) : now;

  // 1. Caregiver cancellation: 100% refund + ₹250 apology credit
  if (cancelledBy === "SITTER") {
    const tierConfig = PUBLISHED_REFUND_TIERS.CAREGIVER_CANCELLED;
    return {
      tier: "CAREGIVER_CANCELLED",
      label: tierConfig.label,
      refundPercentage: tierConfig.refundPercentage,
      refundAmountPaise: amountPaise,
      apologyCreditPaise: tierConfig.apologyCreditPaise,
      diffHours: (startDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60),
      diffSeconds: Math.floor((startDate.getTime() - nowDate.getTime()) / 1000),
      isEligible: true,
      explanation: tierConfig.description,
    };
  }

  // 2. Customer or Admin cancellation: time-based tiers
  const diffMs = startDate.getTime() - nowDate.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffHours = diffMs / (1000 * 60 * 60);

  // If service has already started
  if (diffMs <= 0) {
    const isDuring = endDate ? nowDate.getTime() <= endDate.getTime() : false;
    const tier = isDuring ? "DURING_SERVICE" : "AFTER_SERVICE";
    const tierConfig = PUBLISHED_REFUND_TIERS[tier];
    return {
      tier,
      label: tierConfig.label,
      refundPercentage: 0,
      refundAmountPaise: 0,
      apologyCreditPaise: 0,
      diffHours,
      diffSeconds,
      isEligible: false,
      explanation: tierConfig.description,
    };
  }

  // Tier 1: > 24 hours (strictly greater than 24 hours, i.e. diffMs > 24 * 3600 * 1000)
  if (diffMs > 24 * 60 * 60 * 1000) {
    const tierConfig = PUBLISHED_REFUND_TIERS.MORE_THAN_24_HOURS;
    return {
      tier: "MORE_THAN_24_HOURS",
      label: tierConfig.label,
      refundPercentage: 100,
      refundAmountPaise: amountPaise,
      apologyCreditPaise: 0,
      diffHours,
      diffSeconds,
      isEligible: true,
      explanation: tierConfig.description,
    };
  }

  // Tier 2: 4 to 24 hours (4 * 3600 * 1000 <= diffMs <= 24 * 3600 * 1000)
  if (diffMs >= 4 * 60 * 60 * 1000) {
    const tierConfig = PUBLISHED_REFUND_TIERS.BETWEEN_4_AND_24_HOURS;
    // Round in integer paise, never float
    const refundAmountPaise = Math.round(amountPaise * 0.5);
    return {
      tier: "BETWEEN_4_AND_24_HOURS",
      label: tierConfig.label,
      refundPercentage: 50,
      refundAmountPaise,
      apologyCreditPaise: 0,
      diffHours,
      diffSeconds,
      isEligible: true,
      explanation: tierConfig.description,
    };
  }

  // Tier 3: < 4 hours (diffMs < 4 * 3600 * 1000)
  const tierConfig = PUBLISHED_REFUND_TIERS.LESS_THAN_4_HOURS;
  return {
    tier: "LESS_THAN_4_HOURS",
    label: tierConfig.label,
    refundPercentage: 0,
    refundAmountPaise: 0,
    apologyCreditPaise: 0,
    diffHours,
    diffSeconds,
    isEligible: false,
    explanation: tierConfig.description,
  };
}

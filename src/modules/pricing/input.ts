import { z } from "zod";

export const serviceCodeSchema = z.enum([
  "DOG_WALK_30",
  "DOG_WALK_60",
  "HOME_VISIT",
  "HOME_SITTING_60",
  "TRAVEL_SITTING",
  "BOARDING_BETA",
  "GROOMING_HOME",
  "VET_SUPPORT",
  "TRAINING_ASSESSMENT",
  "PET_TAXI"
]);

export const createServiceAreaSchema = z.object({
  cityName: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  localityName: z.string().trim().min(2).max(100),
  postalCodes: z.array(z.string().trim().regex(/^\d{6}$/)).min(1).max(50),
  status: z.enum(["DRAFT", "ACTIVE"]),
  cityStatus: z.enum(["RESEARCH", "WAITLIST", "SUPPLY_BUILD", "CLOSED_BETA", "PUBLIC_LIMITED", "VALIDATED", "GROWTH", "MATURE", "PAUSED", "EXITED"]).optional().default("RESEARCH"),
  reason: z.string().trim().min(5).max(500)
});

export const createServicePriceSchema = z.object({
  serviceCode: serviceCodeSchema,
  serviceAreaId: z.string().uuid().nullable().optional(),
  amountPaise: z.number().int().min(0).max(100_000_000),
  sitterPaise: z.number().int().min(0).max(100_000_000),
  taxBasisPoints: z.number().int().min(0).max(10_000),
  effectiveAt: z.string().datetime({ offset: true }),
  expiresAt: z.string().datetime({ offset: true }).nullable().optional(),
  reason: z.string().trim().min(5).max(500)
}).superRefine((value, context) => {
  if (value.sitterPaise > value.amountPaise) context.addIssue({ code: z.ZodIssueCode.custom, path: ["sitterPaise"], message: "Saathi amount cannot exceed the customer subtotal" });
  if (value.expiresAt && new Date(value.expiresAt) <= new Date(value.effectiveAt)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["expiresAt"], message: "Expiry must be after the effective time" });
});

export const upsertCapacityLimitSchema = z.object({
  serviceAreaId: z.string().uuid(),
  serviceCode: serviceCodeSchema,
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  maximum: z.number().int().min(0).max(10_000),
  reason: z.string().trim().min(5).max(500)
});

export const createReconciliationRunSchema = z.object({
  provider: z.literal("razorpay"),
  periodStart: z.string().datetime({ offset: true }),
  periodEnd: z.string().datetime({ offset: true })
}).superRefine((value, context) => {
  if (new Date(value.periodEnd) <= new Date(value.periodStart)) context.addIssue({ code: z.ZodIssueCode.custom, path: ["periodEnd"], message: "Period end must be after period start" });
});

export const completeReconciliationRunSchema = z.object({
  capturedPaise: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  refundedPaise: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  paidOutPaise: z.number().int().min(0).max(Number.MAX_SAFE_INTEGER),
  note: z.string().trim().min(5).max(1_000)
});

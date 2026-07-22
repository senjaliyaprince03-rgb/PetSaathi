import { z } from "zod";

const optionalDate = z.string().date().optional();

export const careInstructionSchema = z.object({
  feedingRoutine: z.string().trim().min(5).max(1500),
  walkRoutine: z.string().trim().max(1500).optional(),
  behaviour: z.string().trim().max(1500).optional(),
  handoverNotes: z.string().trim().max(1500).optional()
});

export const medicationSchema = z.object({
  name: z.string().trim().min(2).max(160),
  dosage: z.string().trim().min(2).max(240),
  schedule: z.string().trim().min(2).max(500),
  administration: z.string().trim().max(500).optional(),
  prescribedBy: z.string().trim().max(240).optional(),
  startsAt: optionalDate,
  endsAt: optionalDate,
  notes: z.string().trim().max(1000).optional()
}).superRefine(({ startsAt, endsAt }, context) => {
  if (startsAt && endsAt && endsAt <= startsAt) context.addIssue({ code: z.ZodIssueCode.custom, path: ["endsAt"], message: "End date must be after the start date" });
});

export const vaccinationSchema = z.object({
  vaccine: z.string().trim().min(2).max(200),
  administeredAt: z.string().date(),
  nextDueAt: optionalDate,
  clinic: z.string().trim().max(240).optional(),
  evidenceRef: z.string().trim().max(500).optional()
}).superRefine(({ administeredAt, nextDueAt }, context) => {
  if (nextDueAt && nextDueAt <= administeredAt) context.addIssue({ code: z.ZodIssueCode.custom, path: ["nextDueAt"], message: "Next due date must be later" });
});

export const healthEventSchema = z.object({
  eventType: z.enum(["VET_VISIT", "ILLNESS", "INJURY", "WEIGHT", "DIET_CHANGE", "BEHAVIOUR", "OTHER"]),
  occurredAt: z.string().datetime(),
  summary: z.string().trim().min(5).max(500),
  details: z.string().trim().max(3000).optional(),
  providerRef: z.string().trim().max(500).optional()
});

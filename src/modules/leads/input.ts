import { z } from "zod";

export const leadInputSchema = z.object({
  type: z.enum(["GENERAL", "BOOKING_HELP", "SITTER_INTEREST", "SOCIETY", "PARTNER", "SAFETY"]),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254).optional().or(z.literal("")),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/).optional().or(z.literal("")),
  organisationName: z.string().trim().max(160).optional().or(z.literal("")),
  locality: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().min(20).max(2000),
  consentToContact: z.literal(true)
}).superRefine(({ email, phone, type, organisationName }, context) => {
  if (!email && !phone) context.addIssue({ code: z.ZodIssueCode.custom, path: ["email"], message: "Email or mobile is required" });
  if (type === "SOCIETY" && !organisationName) context.addIssue({ code: z.ZodIssueCode.custom, path: ["organisationName"], message: "Society name is required" });
});

import { z } from "zod";

export const createAddressSchema = z.object({
  label: z.string().trim().min(2).max(40),
  line1: z.string().trim().min(5).max(180),
  line2: z.string().trim().max(180).optional(),
  landmark: z.string().trim().max(120).optional(),
  locality: z.string().trim().min(2).max(100),
  city: z.string().trim().min(2).max(100).default("Ahmedabad"),
  state: z.string().trim().min(2).max(100).default("Gujarat"),
  postalCode: z.string().regex(/^\d{6}$/, "Enter a valid six-digit PIN code"),
  accessNotes: z.string().trim().max(500).optional()
});

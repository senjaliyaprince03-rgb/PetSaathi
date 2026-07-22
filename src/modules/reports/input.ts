import { z } from "zod";

export const bookingReportSchema = z.object({
  summary: z.string().trim().min(20).max(2000),
  food: z.string().trim().max(500).optional(),
  water: z.string().trim().max(500).optional(),
  toilet: z.string().trim().max(500).optional(),
  activity: z.string().trim().max(700).optional(),
  behaviour: z.string().trim().max(700).optional(),
  medication: z.string().trim().max(700).optional(),
  concernFlag: z.boolean().default(false)
});

export type BookingReportInput = z.infer<typeof bookingReportSchema>;

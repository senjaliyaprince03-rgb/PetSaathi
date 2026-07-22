import { z } from "zod";

export const createBookingSchema = z.object({
  petId: z.string().uuid(),
  serviceCode: z.enum(["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60"]),
  servicePriceId: z.string().uuid(),
  addressId: z.string().uuid(),
  scheduledStart: z.string().datetime({ offset: true }),
  customerNotes: z.string().trim().max(800).optional()
}).superRefine(({ scheduledStart }, context) => {
  if (new Date(scheduledStart).getTime() < Date.now() + 30 * 60 * 1000) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduledStart"], message: "Start time must be at least 30 minutes from now" });
  }
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

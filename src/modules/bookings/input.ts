import { z } from "zod";

export const createBookingSchema = z.object({
  petId: z.string().min(1, "Choose a pet"),
  serviceCode: z.enum(["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60", "GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT", "PET_TAXI"]),
  servicePriceId: z.string().min(1, "Price is required"),
  addressId: z.string().min(1, "Choose an address"),
  scheduledStart: z.string().datetime({ offset: true }),
  customerNotes: z.string().trim().max(800).optional()
}).superRefine(({ scheduledStart }, context) => {
  if (new Date(scheduledStart).getTime() < Date.now() + 30 * 60 * 1000) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduledStart"], message: "Start time must be at least 30 minutes from now" });
  }
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

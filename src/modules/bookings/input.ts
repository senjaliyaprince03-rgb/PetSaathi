import { z } from "zod";
import { sanitizeFreeText } from "@/lib/sanitize-text";

export const createBookingSchema = z.object({
  petId: z.string().min(1, "Choose a pet"),
  serviceCode: z.enum(["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60", "GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT", "PET_TAXI"]),
  servicePriceId: z.string().min(1, "Price is required"),
  addressId: z.string().min(1, "Choose an address"),
  scheduledStart: z.string().datetime({ offset: true }),
  customerNotes: z.string().trim().max(800).transform(sanitizeFreeText).optional(),
  idempotencyKey: z.string().min(8).max(128).optional()
}).superRefine(({ scheduledStart }, context) => {
  const startDate = new Date(scheduledStart);
  if (startDate.getTime() < Date.now() + 30 * 60 * 1000) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["scheduledStart"], message: "Start time must be at least 30 minutes from now" });
  }

  // Check IST service hours (06:00 to 21:00)
  const istFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    hourCycle: "h23",
  });
  const istHour = parseInt(istFormatter.format(startDate), 10);
  if (istHour < 6 || istHour >= 21) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["scheduledStart"],
      message: "Scheduled start must be within active service hours (06:00 to 21:00 IST)"
    });
  }
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;

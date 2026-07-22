import { z } from "zod";

export const sitterApplicationSchema = z.object({
  locality: z.string().trim().min(2).max(100),
  yearsExperience: z.coerce.number().int().min(0).max(60),
  services: z.array(z.enum(["DOG_WALK_30", "DOG_WALK_60", "HOME_VISIT", "HOME_SITTING_60", "BOARDING_BETA", "GROOMING_HOME", "VET_SUPPORT", "TRAINING_ASSESSMENT"])).min(1).max(5),
  motivation: z.string().trim().min(80).max(2500)
});

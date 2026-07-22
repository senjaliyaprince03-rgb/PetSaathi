import { z } from "zod";

const optionalText = z.string().trim().max(240).optional();

export const createPetSchema = z.object({
  name: z.string().trim().min(2).max(80),
  species: z.enum(["DOG", "CAT", "OTHER"]),
  breed: optionalText,
  sex: z.enum(["FEMALE", "MALE", "UNKNOWN"]).optional(),
  birthDate: z.string().date().optional(),
  weightKg: z.coerce.number().positive().max(150).optional(),
  sterilised: z.boolean().optional(),
  medical: z.object({
    allergies: z.string().trim().max(1000).optional(),
    conditions: z.string().trim().max(1000).optional(),
    medications: z.string().trim().max(1000).optional(),
    veterinarianName: optionalText,
    veterinarianPhone: z.string().regex(/^\+?[1-9]\d{7,14}$/).optional()
  }).optional(),
  emergencyContact: z.object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().regex(/^\+?[1-9]\d{7,14}$/),
    relation: optionalText
  }).optional()
});

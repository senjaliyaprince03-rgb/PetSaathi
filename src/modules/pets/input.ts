import { z } from "zod";

import {
  hasAnyDefinedField,
  optionalDateField,
  optionalNumberField,
  optionalPhoneField,
  optionalTextField,
  petSexSchema,
  petSpeciesSchema,
} from "@/modules/pets/input-utils";

export const createPetSchema = z.object({
  name: z.string().trim().min(2).max(80),
  species: petSpeciesSchema,
  breed: optionalTextField(240),
  sex: petSexSchema.optional(),
  birthDate: optionalDateField(),
  weightKg: optionalNumberField(150),
  sterilised: z.boolean().optional(),
  medical: z.object({
    allergies: optionalTextField(1000),
    conditions: optionalTextField(1000),
    medications: optionalTextField(1000),
    veterinarianName: optionalTextField(120),
    veterinarianPhone: optionalPhoneField(),
    emergencyClinicName: optionalTextField(120),
    emergencyClinicPhone: optionalPhoneField()
  }).optional(),
  emergencyContact: z.object({
    name: optionalTextField(120),
    phone: optionalPhoneField(),
    relation: optionalTextField(120)
  }).optional()
}).superRefine((values, context) => {
  if (values.medical && (values.medical.veterinarianName || values.medical.veterinarianPhone)) {
    if (!values.medical.veterinarianName) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["medical", "veterinarianName"], message: "Add the veterinarian name" });
    }
    if (!values.medical.veterinarianPhone) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["medical", "veterinarianPhone"], message: "Add the veterinarian phone" });
    }
  }

  if (values.medical && (values.medical.emergencyClinicName || values.medical.emergencyClinicPhone)) {
    if (!values.medical.emergencyClinicName) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["medical", "emergencyClinicName"], message: "Add the emergency clinic name" });
    }
    if (!values.medical.emergencyClinicPhone) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["medical", "emergencyClinicPhone"], message: "Add the emergency clinic phone" });
    }
  }

  if (values.emergencyContact && hasAnyDefinedField(values.emergencyContact)) {
    if (!values.emergencyContact.name) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["emergencyContact", "name"], message: "Add an emergency contact name" });
    }
    if (!values.emergencyContact.phone) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["emergencyContact", "phone"], message: "Add an emergency contact phone" });
    }
  }
});

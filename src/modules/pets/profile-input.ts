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

export const petProfileFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your pet's name").max(80),
  species: petSpeciesSchema,
  breed: optionalTextField(240),
  sex: petSexSchema.optional(),
  birthDate: optionalDateField(),
  weightKg: optionalNumberField(150),
  sterilised: z.boolean().optional(),
  allergies: optionalTextField(1000),
  conditions: optionalTextField(1000),
  medications: optionalTextField(1000),
  veterinarianName: optionalTextField(120),
  veterinarianPhone: optionalPhoneField(),
  emergencyClinicName: optionalTextField(120),
  emergencyClinicPhone: optionalPhoneField(),
  emergencyName: optionalTextField(120),
  emergencyRelation: optionalTextField(120),
  emergencyPhone: optionalPhoneField(),
}).superRefine((values, context) => {
  if (values.veterinarianName || values.veterinarianPhone) {
    if (!values.veterinarianName) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["veterinarianName"], message: "Add the veterinarian name" });
    }
    if (!values.veterinarianPhone) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["veterinarianPhone"], message: "Add the veterinarian phone" });
    }
  }

  if (values.emergencyClinicName || values.emergencyClinicPhone) {
    if (!values.emergencyClinicName) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["emergencyClinicName"], message: "Add the emergency clinic name" });
    }
    if (!values.emergencyClinicPhone) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["emergencyClinicPhone"], message: "Add the emergency clinic phone" });
    }
  }

  if (hasAnyDefinedField({
    emergencyName: values.emergencyName,
    emergencyRelation: values.emergencyRelation,
    emergencyPhone: values.emergencyPhone,
  })) {
    if (!values.emergencyName) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["emergencyName"], message: "Add an emergency contact name" });
    }
    if (!values.emergencyPhone) {
      context.addIssue({ code: z.ZodIssueCode.custom, path: ["emergencyPhone"], message: "Add an emergency contact phone" });
    }
  }
});

export type PetProfileFormValues = z.infer<typeof petProfileFormSchema>;

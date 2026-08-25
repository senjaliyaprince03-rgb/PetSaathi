import { z } from "zod";

export const petSpeciesSchema = z.enum(["DOG", "CAT", "RABBIT", "BIRD", "FISH", "TURTLE", "RAT", "OTHER"]);
export const petSexSchema = z.enum(["FEMALE", "MALE", "UNKNOWN"]);

const phonePattern = /^\+?[1-9]\d{7,14}$/;

function blankToUndefined(value: unknown) {
  if (value === null) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length ? trimmed : undefined;
  }

  return value;
}

function normalizePhone(value: unknown) {
  if (value === null) return undefined;

  if (typeof value === "string") {
    const normalized = value.replace(/[\s().-]/g, "").trim();
    return normalized.length ? normalized : undefined;
  }

  return value;
}

function normalizeNumber(value: unknown) {
  if (value === null) return undefined;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed.length) return undefined;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : value;
  }

  return value;
}

export function optionalTextField(maxLength: number) {
  return z.preprocess(blankToUndefined, z.string().trim().max(maxLength).optional());
}

export function optionalDateField() {
  return z.preprocess(blankToUndefined, z.string().date().optional());
}

export function optionalNumberField(max = 150) {
  return z.preprocess(normalizeNumber, z.number().positive().max(max).optional());
}

export function optionalPhoneField() {
  return z.preprocess(normalizePhone, z.string().regex(phonePattern, "Enter a valid phone number").optional());
}

export function compactDefinedFields<T extends Record<string, unknown>>(value: T | null | undefined) {
  if (!value) return undefined;

  const entries = Object.entries(value).filter(([, field]) => field !== undefined && field !== null && field !== "");
  if (!entries.length) return undefined;

  return Object.fromEntries(entries) as Partial<T>;
}

export function normalizeEmergencyContactFields(
  value: Partial<{ name: string; phone: string; relation?: string }> | null | undefined,
) {
  if (!value?.name || !value.phone) return undefined;

  return {
    name: value.name,
    phone: value.phone,
    relation: value.relation,
  };
}

export function hasAnyDefinedField(value: Record<string, unknown> | null | undefined) {
  if (!value) return false;

  return Object.values(value).some((field) => field !== undefined && field !== null && field !== "");
}

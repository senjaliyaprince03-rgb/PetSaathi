import { z } from "zod";

/**
 * PetSaathi Domain-Level Validation Library (Task 3.3)
 * Strict, hardened schema validators enforced across API routes and data mutations.
 */

// ── 1. Phone & Email (Indian Context) ──────────────────────────────────────────

/**
 * Strict Indian E.164 phone number:
 * Must start with +91 followed by valid telecom operator prefix (6-9) and 9 digits.
 */
export const IndianPhoneSchema = z
  .string()
  .trim()
  .regex(/^\+91[6-9]\d{9}$/, {
    message: "Invalid Indian mobile number. Format must be +91XXXXXXXXXX starting with 6, 7, 8, or 9.",
  });

/**
 * RFC 5322 compliant, lowercase-normalized email validator.
 */
export const RfcEmailSchema = z
  .string()
  .trim()
  .email({ message: "Invalid email address format." })
  .toLowerCase()
  .max(254, { message: "Email exceeds maximum RFC length of 254 characters." });

// ── 2. GPS & Geolocation ──────────────────────────────────────────────────────

export const GpsCoordinatesSchema = z.object({
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90 degrees")
    .max(90, "Latitude must be between -90 and 90 degrees"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180 degrees")
    .max(180, "Longitude must be between -180 and 180 degrees"),
  accuracyM: z.number().positive().max(1000).optional(),
  recordedAt: z.coerce.date().default(() => new Date()),
});

// ── 3. Booking Timestamps ─────────────────────────────────────────────────────

export const BookingScheduleSchema = z
  .object({
    scheduledStart: z.coerce.date(),
    scheduledEnd: z.coerce.date(),
  })
  .refine((data) => data.scheduledEnd.getTime() > data.scheduledStart.getTime(), {
    message: "Booking scheduledEnd must be strictly after scheduledStart.",
    path: ["scheduledEnd"],
  })
  .refine(
    (data) => {
      const durationMs = data.scheduledEnd.getTime() - data.scheduledStart.getTime();
      const minDurationMs = 15 * 60 * 1000; // 15 mins
      const maxDurationMs = 24 * 60 * 60 * 1000; // 24 hours
      return durationMs >= minDurationMs && durationMs <= maxDurationMs;
    },
    {
      message: "Walk/Sitting duration must be between 15 minutes and 24 hours.",
      path: ["scheduledEnd"],
    }
  );

// ── 4. Financial Amounts (Paise) ──────────────────────────────────────────────

/**
 * Payment amounts in Indian Paise:
 * - Positive integer (> 0 paise)
 * - Minimum charge: ₹10 (1,000 paise)
 * - Maximum cap: ₹50,000 (5,000,000 paise) to prevent fat-finger or runaway billing
 */
export const PaymentAmountPaiseSchema = z
  .number()
  .int("Amount must be an integer in paise")
  .min(1000, "Minimum transaction amount is ₹10 (1000 paise)")
  .max(5000000, "Amount exceeds maximum permitted single transaction cap of ₹50,000");

// ── 5. Pet Physical Characteristics ───────────────────────────────────────────

export const PetWeightKgSchema = z
  .number()
  .positive("Pet weight must be a positive number")
  .min(0.2, "Minimum recordable pet weight is 0.2 kg")
  .max(120, "Maximum recordable pet weight is 120 kg");

// ── 6. Domain Enums ───────────────────────────────────────────────────────────

export const BookingStatusEnum = z.enum([
  "DRAFT",
  "REQUESTED",
  "RISK_REVIEW",
  "MATCHING",
  "SITTER_PROPOSED",
  "CUSTOMER_APPROVAL_PENDING",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "SITTER_EN_ROUTE",
  "IN_PROGRESS",
  "REPORT_PENDING",
  "COMPLETED",
  "CLOSED",
  "DECLINED",
  "CUSTOMER_CANCELLED",
  "SITTER_CANCELLED",
  "REPLACEMENT_REQUIRED",
  "NO_SHOW",
  "INCIDENT_HOLD",
]);

export const PaymentStatusEnum = z.enum([
  "CREATED",
  "PENDING",
  "AUTHORIZED",
  "CAPTURED",
  "FAILED",
  "CANCELLED",
  "PARTIALLY_REFUNDED",
  "REFUNDED",
  "DISPUTED",
]);

export const SitterStatusEnum = z.enum([
  "APPLICANT",
  "UNDER_REVIEW",
  "TRAINING",
  "APPROVED",
  "PAUSED",
  "SUSPENDED",
  "REJECTED",
]);

import { describe, it, expect } from "vitest";
import {
  IndianPhoneSchema,
  RfcEmailSchema,
  GpsCoordinatesSchema,
  BookingScheduleSchema,
  PaymentAmountPaiseSchema,
  PetWeightKgSchema,
  BookingStatusEnum,
} from "../../src/lib/validation/domain-validators";

describe("Domain Validation Hardening (Task 3.3)", () => {
  describe("IndianPhoneSchema", () => {
    it("accepts valid Indian E.164 phone numbers", () => {
      expect(IndianPhoneSchema.parse("+919876543210")).toBe("+919876543210");
      expect(IndianPhoneSchema.parse("+916123456789")).toBe("+916123456789");
      expect(IndianPhoneSchema.parse("  +917987654321  ")).toBe("+917987654321");
    });

    it("rejects invalid phone formats and non-Indian prefixes", () => {
      expect(() => IndianPhoneSchema.parse("9876543210")).toThrow();
      expect(() => IndianPhoneSchema.parse("+915123456789")).toThrow(); // Starts with 5
      expect(() => IndianPhoneSchema.parse("+14155552671")).toThrow(); // US prefix
      expect(() => IndianPhoneSchema.parse("+91987654321")).toThrow(); // Only 9 digits
    });
  });

  describe("RfcEmailSchema", () => {
    it("normalizes and accepts valid emails", () => {
      expect(RfcEmailSchema.parse("User.Name@PetSaathi.in")).toBe("user.name@petsaathi.in");
    });

    it("rejects malformed email addresses", () => {
      expect(() => RfcEmailSchema.parse("not-an-email")).toThrow();
      expect(() => RfcEmailSchema.parse("@missing-local.com")).toThrow();
    });
  });

  describe("GpsCoordinatesSchema", () => {
    it("accepts valid GPS coordinates in India", () => {
      const coords = GpsCoordinatesSchema.parse({
        latitude: 23.0225,
        longitude: 72.5714,
        accuracyM: 5.2,
      });
      expect(coords.latitude).toBe(23.0225);
      expect(coords.longitude).toBe(72.5714);
    });

    it("rejects out-of-bounds coordinates", () => {
      expect(() => GpsCoordinatesSchema.parse({ latitude: 95.0, longitude: 72.0 })).toThrow();
      expect(() => GpsCoordinatesSchema.parse({ latitude: 23.0, longitude: -185.0 })).toThrow();
    });
  });

  describe("BookingScheduleSchema", () => {
    it("accepts valid future booking windows", () => {
      const start = new Date("2026-10-01T10:00:00Z");
      const end = new Date("2026-10-01T11:00:00Z");
      const result = BookingScheduleSchema.parse({
        scheduledStart: start,
        scheduledEnd: end,
      });
      expect(result.scheduledEnd.getTime()).toBeGreaterThan(result.scheduledStart.getTime());
    });

    it("rejects inverted timestamps (end before start)", () => {
      const start = new Date("2026-10-01T11:00:00Z");
      const end = new Date("2026-10-01T10:00:00Z");
      expect(() =>
        BookingScheduleSchema.parse({
          scheduledStart: start,
          scheduledEnd: end,
        })
      ).toThrow(/scheduledEnd must be strictly after/);
    });

    it("rejects walks under 15 minutes or over 24 hours", () => {
      const start = new Date("2026-10-01T10:00:00Z");
      const shortEnd = new Date("2026-10-01T10:05:00Z"); // 5 mins
      expect(() =>
        BookingScheduleSchema.parse({
          scheduledStart: start,
          scheduledEnd: shortEnd,
        })
      ).toThrow(/between 15 minutes and 24 hours/);
    });
  });

  describe("PaymentAmountPaiseSchema", () => {
    it("accepts valid booking prices", () => {
      expect(PaymentAmountPaiseSchema.parse(29900)).toBe(29900); // ₹299
      expect(PaymentAmountPaiseSchema.parse(1000)).toBe(1000);   // ₹10 min
    });

    it("rejects negative numbers, zero, and amounts exceeding cap", () => {
      expect(() => PaymentAmountPaiseSchema.parse(-100)).toThrow();
      expect(() => PaymentAmountPaiseSchema.parse(0)).toThrow();
      expect(() => PaymentAmountPaiseSchema.parse(6000000)).toThrow(/maximum permitted single transaction cap/); // ₹60,000
    });
  });

  describe("PetWeightKgSchema", () => {
    it("accepts normal pet weights", () => {
      expect(PetWeightKgSchema.parse(28.5)).toBe(28.5); // Labrador
      expect(PetWeightKgSchema.parse(3.2)).toBe(3.2);   // Chihuahua/Shih Tzu
    });

    it("rejects absurd pet weights", () => {
      expect(() => PetWeightKgSchema.parse(-5)).toThrow();
      expect(() => PetWeightKgSchema.parse(150)).toThrow();
    });
  });

  describe("BookingStatusEnum", () => {
    it("validates known state machine statuses", () => {
      expect(BookingStatusEnum.parse("CONFIRMED")).toBe("CONFIRMED");
      expect(BookingStatusEnum.parse("IN_PROGRESS")).toBe("IN_PROGRESS");
      expect(() => BookingStatusEnum.parse("SOME_RANDOM_STATE")).toThrow();
    });
  });
});

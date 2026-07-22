import { describe, expect, it } from "vitest";

import { assertBookingTransition, canTransitionBooking } from "@/modules/bookings/state-machine";

describe("booking state machine", () => {
  it("permits the normal paid-service path", () => {
    expect(canTransitionBooking("PAYMENT_PENDING", "CONFIRMED")).toBe(true);
    expect(canTransitionBooking("CONFIRMED", "SITTER_EN_ROUTE")).toBe(true);
    expect(canTransitionBooking("REPORT_PENDING", "COMPLETED")).toBe(true);
  });

  it("rejects client-side shortcuts around payment and reports", () => {
    expect(canTransitionBooking("REQUESTED", "CONFIRMED")).toBe(false);
    expect(canTransitionBooking("IN_PROGRESS", "COMPLETED")).toBe(false);
  });

  it("throws for invalid mutations", () => {
    expect(() => assertBookingTransition("DRAFT", "COMPLETED")).toThrow("Invalid booking transition");
  });

  it("supports paid replacement approval and recoverable no-show handling", () => {
    expect(canTransitionBooking("CONFIRMED", "NO_SHOW")).toBe(true);
    expect(canTransitionBooking("NO_SHOW", "REPLACEMENT_REQUIRED")).toBe(true);
    expect(canTransitionBooking("SITTER_PROPOSED", "REPLACEMENT_REQUIRED")).toBe(true);
    expect(canTransitionBooking("CUSTOMER_APPROVAL_PENDING", "CONFIRMED")).toBe(true);
  });
});

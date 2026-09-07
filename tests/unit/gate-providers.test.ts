import { describe, expect, it } from "vitest";

import {
  type GateApprovalRequest,
  type GateNotification,
  MockGateProvider,
} from "@/modules/societies/gate-providers";

describe("Mock Gate Provider - WhatsApp", () => {
  const provider = new MockGateProvider("WHATSAPP");

  const mockRequest: GateApprovalRequest = {
    entry: {
      sitterId: "sitter-123",
      sitterName: "Priya Sharma",
      sitterPhone: "+919876543210",
      customerId: "customer-456",
      customerName: "Rahul Verma",
      customerUnit: "A-501",
      bookingId: "booking-789",
      bookingReference: "BK-2024-001",
      serviceType: "Dog Walking",
      scheduledStart: new Date("2024-06-15T10:00:00Z"),
      scheduledEnd: new Date("2024-06-15T11:00:00Z"),
      purpose: "Pet care service",
    },
    societyId: "society-123",
    societyName: "Green Valley Apartments",
    requestedAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  it("requests approval successfully", async () => {
    const result = await provider.requestApproval(mockRequest);

    expect(result.success).toBe(true);
    expect(result.status).toBe("APPROVED");
    expect(result.approvalId).toBeDefined();
    expect(result.approvalId).toContain("mock-whatsapp");
  });

  it("checks approval status", async () => {
    const approvalId = "mock-approval-123";
    const result = await provider.checkApprovalStatus(approvalId);

    expect(result.success).toBe(true);
    expect(result.status).toBe("APPROVED");
    expect(result.approvalId).toBe(approvalId);
  });

  it("sends notifications", async () => {
    const notification: GateNotification = {
      societyId: "society-123",
      recipientPhone: "+919876543210",
      message: "Sitter is on the way for your pet care service.",
      metadata: { bookingId: "booking-789" },
    };

    const result = await provider.sendNotification(notification);

    expect(result.success).toBe(true);
    expect(result.messageId).toBeDefined();
  });

  it("is always available", async () => {
    const available = await provider.isAvailable();
    expect(available).toBe(true);
  });
});

describe("Mock Gate Provider - MyGate", () => {
  const provider = new MockGateProvider("MYGATE");

  const mockRequest: GateApprovalRequest = {
    entry: {
      sitterId: "sitter-456",
      sitterName: "Amit Kumar",
      sitterPhone: "+919123456789",
      customerId: "customer-789",
      customerName: "Sneha Reddy",
      customerUnit: "B-302",
      bookingId: "booking-101",
      bookingReference: "BK-2024-002",
      serviceType: "Pet Sitting",
      scheduledStart: new Date("2024-06-16T14:00:00Z"),
      scheduledEnd: new Date("2024-06-16T18:00:00Z"),
      purpose: "Pet care service",
    },
    societyId: "society-456",
    societyName: "Maple Heights",
    requestedAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  it("handles MyGate approval flow", async () => {
    const result = await provider.requestApproval(mockRequest);

    expect(result.success).toBe(true);
    expect(result.status).toBe("APPROVED");
    expect(result.approvalId).toContain("mock-mygate");
  });
});

describe("Mock Gate Provider - NoBroker", () => {
  const provider = new MockGateProvider("NOBROKER");

  const mockRequest: GateApprovalRequest = {
    entry: {
      sitterId: "sitter-789",
      sitterName: "Neha Patel",
      sitterPhone: "+919998887776",
      customerId: "customer-101",
      customerName: "Vivek Singh",
      customerUnit: "C-205",
      bookingId: "booking-202",
      bookingReference: "BK-2024-003",
      serviceType: "Dog Grooming",
      scheduledStart: new Date("2024-06-17T09:00:00Z"),
      scheduledEnd: new Date("2024-06-17T10:30:00Z"),
      purpose: "Pet grooming service",
    },
    societyId: "society-789",
    societyName: "Sunrise Residency",
    requestedAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };

  it("handles NoBroker approval flow", async () => {
    const result = await provider.requestApproval(mockRequest);

    expect(result.success).toBe(true);
    expect(result.status).toBe("APPROVED");
    expect(result.approvalId).toContain("mock-nobroker");
  });
});

describe("Gate Provider Factory", () => {
  it("returns mock provider by default", async () => {
    const { getGateProvider } = await import("@/modules/societies/gate-providers");
    
    const provider = getGateProvider("WHATSAPP");
    expect(provider.name).toBe("mock-gate");
    expect(provider.type).toBe("WHATSAPP");
  });
});

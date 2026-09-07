import { describe, expect, it } from "vitest";

import {
  type DispatchRequest,
  type PartnerOrderDispatch,
  MockDispatchProvider,
} from "@/modules/partners/dispatch-providers";

describe("Mock Dispatch Provider - Email", () => {
  const provider = new MockDispatchProvider("EMAIL");

  const mockDispatch: PartnerOrderDispatch = {
    orderId: "order-123",
    orderReference: "PS-240615-ABC123",
    partnerId: "partner-456",
    partnerName: "Happy Paws Veterinary Clinic",
    serviceCode: "VET_CONSULT",
    customerId: "customer-789",
    customerName: "Amit Sharma",
    customerPhone: "+919876543210",
    customerEmail: "amit@example.com",
    petId: "pet-101",
    petName: "Bruno",
    petSpecies: "Dog",
    petBreed: "Golden Retriever",
    scheduledAt: new Date("2024-06-20T10:00:00Z"),
    instructions: "Bruno has been limping on his front left paw since yesterday.",
    estimatedAmountPaise: 50000,
  };

  const mockRequest: DispatchRequest = {
    method: "EMAIL",
    dispatch: mockDispatch,
    destination: "clinic@happypaws.com",
  };

  it("dispatches order successfully", async () => {
    const result = await provider.dispatch(mockRequest);

    expect(result.success).toBe(true);
    expect(result.status).toBe("DELIVERED");
    expect(result.dispatchId).toBeDefined();
    expect(result.dispatchId).toContain("mock-email");
  });

  it("handles failed dispatches", async () => {
    const failRequest: DispatchRequest = {
      ...mockRequest,
      destination: "fail@example.com",
    };

    const result = await provider.dispatch(failRequest);

    expect(result.success).toBe(false);
    expect(result.status).toBe("FAILED");
    expect(result.shouldRetry).toBe(true);
  });

  it("checks dispatch status", async () => {
    const status = await provider.checkStatus({
      dispatchId: "mock-dispatch-123",
      method: "EMAIL",
    });

    expect(status).toBeDefined();
    expect(status?.status).toBe("ACKNOWLEDGED");
    expect(status?.dispatchId).toBe("mock-dispatch-123");
  });

  it("is always available", async () => {
    const available = await provider.isAvailable();
    expect(available).toBe(true);
  });
});

describe("Mock Dispatch Provider - WhatsApp", () => {
  const provider = new MockDispatchProvider("WHATSAPP");

  const mockDispatch: PartnerOrderDispatch = {
    orderId: "order-456",
    orderReference: "PS-240616-DEF456",
    partnerId: "partner-789",
    partnerName: "Furry Friends Grooming",
    serviceCode: "GROOMING_FULL",
    customerId: "customer-101",
    customerName: "Priya Patel",
    customerPhone: "+919123456789",
    customerEmail: "priya@example.com",
    petId: "pet-202",
    petName: "Simba",
    petSpecies: "Cat",
    petBreed: "Persian",
    scheduledAt: new Date("2024-06-21T14:00:00Z"),
    instructions: "Please use hypoallergenic shampoo.",
    estimatedAmountPaise: 120000,
  };

  const mockRequest: DispatchRequest = {
    method: "WHATSAPP",
    dispatch: mockDispatch,
    destination: "+919998887776",
  };

  it("dispatches via WhatsApp successfully", async () => {
    const result = await provider.dispatch(mockRequest);

    expect(result.success).toBe(true);
    expect(result.status).toBe("DELIVERED");
    expect(result.dispatchId).toContain("mock-whatsapp");
  });
});

describe("Mock Dispatch Provider - Webhook", () => {
  const provider = new MockDispatchProvider("WEBHOOK");

  const mockDispatch: PartnerOrderDispatch = {
    orderId: "order-789",
    orderReference: "PS-240617-GHI789",
    partnerId: "partner-101",
    partnerName: "K9 Training Academy",
    serviceCode: "TRAINING_BASIC",
    customerId: "customer-202",
    customerName: "Ravi Kumar",
    customerPhone: "+919876501234",
    customerEmail: "ravi@example.com",
    petId: "pet-303",
    petName: "Max",
    petSpecies: "Dog",
    petBreed: "German Shepherd",
    scheduledAt: new Date("2024-06-22T16:00:00Z"),
    instructions: "First training session for a 6-month-old puppy.",
    estimatedAmountPaise: 200000,
  };

  const mockRequest: DispatchRequest = {
    method: "WEBHOOK",
    dispatch: mockDispatch,
    destination: "https://api.k9academy.com/webhooks/petsaathi",
  };

  it("dispatches via webhook successfully", async () => {
    const result = await provider.dispatch(mockRequest);

    expect(result.success).toBe(true);
    expect(result.status).toBe("DELIVERED");
    expect(result.dispatchId).toContain("mock-webhook");
  });
});

describe("Dispatch Provider Factory", () => {
  it("returns mock provider by default", async () => {
    const { getDispatchProvider } = await import("@/modules/partners/dispatch-providers");
    
    const provider = getDispatchProvider("EMAIL");
    expect(provider.name).toBe("mock-dispatch");
    expect(provider.method).toBe("EMAIL");
  });

  it("supports all dispatch methods", async () => {
    const { getDispatchProvider } = await import("@/modules/partners/dispatch-providers");
    
    expect(() => getDispatchProvider("EMAIL")).not.toThrow();
    expect(() => getDispatchProvider("WHATSAPP")).not.toThrow();
    expect(() => getDispatchProvider("WEBHOOK")).not.toThrow();
    expect(() => getDispatchProvider("MANUAL")).not.toThrow();
  });
});

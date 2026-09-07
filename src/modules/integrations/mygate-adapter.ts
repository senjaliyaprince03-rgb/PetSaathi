/**
 * MyGate Integration Adapter
 * 
 * MyGate is India's leading gated community management platform.
 * Used for verifying Saathi entry into residential societies and registering visits.
 * 
 * Adapter Pattern:
 * - Real: Connects to MyGate API (requires partnership credentials)
 * - Mock: Returns synthetic access approval for development
 * 
 * Security: Never bypass society entry rules. Always verify approval status.
 */

export interface MyGateVisitorRegistration {
  societyId: string;
  visitorName: string;
  visitorPhone: string;
  visitorIdProof: string; // Document ID
  purposeOfVisit: string;
  flatNumber: string;
  expectedArrivalTime: Date;
  requestId: string; // Idempotency key
}

export interface MyGateRegistrationResult {
  approved: boolean;
  accessCode?: string; // OTP or QR code for gate entry
  societyId: string;
  flatNumber: string;
  validUntil?: Date;
  errorCode?: string;
  errorMessage?: string;
}

export interface MyGateAccessValidation {
  societyId: string;
  accessCode: string;
  visitorPhone: string;
}

export interface MyGateValidationResult {
  valid: boolean;
  visitorName: string;
  flatNumber: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface MyGateAdapter {
  registerVisitor(registration: MyGateVisitorRegistration): Promise<MyGateRegistrationResult>;
  validateAccess(validation: MyGateAccessValidation): Promise<MyGateValidationResult>;
}

/**
 * Real MyGate adapter (requires partnership credentials)
 */
export class RealMyGateAdapter implements MyGateAdapter {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.MYGATE_API_KEY || "";
    this.baseUrl = process.env.MYGATE_BASE_URL || "https://api.mygate.com/v1";

    if (!this.apiKey) {
      console.warn("[MyGate] Missing API key. Adapter will fail at runtime unless credentials are provided.");
    }
  }

  async registerVisitor(registration: MyGateVisitorRegistration): Promise<MyGateRegistrationResult> {
    if (!this.apiKey) {
      throw new Error("[MyGate] Missing API key. Cannot register visitor.");
    }

    const response = await fetch(`${this.baseUrl}/visitor/register`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        society_id: registration.societyId,
        visitor_name: registration.visitorName,
        visitor_phone: registration.visitorPhone,
        visitor_id_proof: registration.visitorIdProof,
        purpose: registration.purposeOfVisit,
        flat_number: registration.flatNumber,
        expected_arrival: registration.expectedArrivalTime.toISOString(),
        request_id: registration.requestId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        approved: false,
        societyId: registration.societyId,
        flatNumber: registration.flatNumber,
        errorCode: `HTTP_${response.status}`,
        errorMessage: error,
      };
    }

    const data = await response.json();

    return {
      approved: data.approved === true,
      accessCode: data.access_code,
      societyId: registration.societyId,
      flatNumber: registration.flatNumber,
      validUntil: data.valid_until ? new Date(data.valid_until) : undefined,
    };
  }

  async validateAccess(validation: MyGateAccessValidation): Promise<MyGateValidationResult> {
    if (!this.apiKey) {
      throw new Error("[MyGate] Missing API key. Cannot validate access.");
    }

    const response = await fetch(`${this.baseUrl}/visitor/validate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        society_id: validation.societyId,
        access_code: validation.accessCode,
        visitor_phone: validation.visitorPhone,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        valid: false,
        visitorName: "",
        flatNumber: "",
        errorCode: `HTTP_${response.status}`,
        errorMessage: error,
      };
    }

    const data = await response.json();

    return {
      valid: data.valid === true,
      visitorName: data.visitor_name || "",
      flatNumber: data.flat_number || "",
    };
  }
}

/**
 * Mock MyGate adapter for development and testing
 */
export class MockMyGateAdapter implements MyGateAdapter {
  async registerVisitor(registration: MyGateVisitorRegistration): Promise<MyGateRegistrationResult> {
    await sleep(300);

    // Mock approval logic: succeeds if flat number is provided
    const approved = !!registration.flatNumber;

    return {
      approved,
      accessCode: approved ? generateMockAccessCode() : undefined,
      societyId: registration.societyId,
      flatNumber: registration.flatNumber,
      validUntil: approved ? new Date(Date.now() + 4 * 60 * 60 * 1000) : undefined, // 4 hours
      errorCode: approved ? undefined : "FLAT_NOT_FOUND",
      errorMessage: approved ? undefined : "Flat number not found in society (mock)",
    };
  }

  async validateAccess(validation: MyGateAccessValidation): Promise<MyGateValidationResult> {
    await sleep(200);

    // Mock validation: succeeds if access code starts with "MG"
    const valid = validation.accessCode.startsWith("MG");

    return {
      valid,
      visitorName: valid ? "Mock Visitor" : "",
      flatNumber: valid ? "A-101" : "",
      errorCode: valid ? undefined : "INVALID_ACCESS_CODE",
      errorMessage: valid ? undefined : "Access code not found or expired (mock)",
    };
  }
}

/**
 * Factory function to get the appropriate MyGate adapter
 */
export function getMyGateAdapter(): MyGateAdapter {
  const useMock = process.env.MYGATE_USE_MOCK === "true" || !process.env.MYGATE_API_KEY;

  if (useMock) {
    console.log("[MyGate] Using MockMyGateAdapter (no credentials configured)");
    return new MockMyGateAdapter();
  }

  return new RealMyGateAdapter();
}

// Helper functions

function generateMockAccessCode(): string {
  return `MG${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

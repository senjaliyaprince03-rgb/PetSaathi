/**
 * DigiLocker Integration Adapter
 * 
 * DigiLocker is India's government digital document repository.
 * Used for verifying Aadhaar, PAN, Driving License, and other identity documents.
 * 
 * Adapter Pattern:
 * - Real: Connects to DigiLocker API (requires credentials)
 * - Mock: Returns synthetic verification results for development
 * 
 * Security: Never store fetched documents permanently. Verify and discard.
 */

export type DigiLockerDocumentType = 
  | "AADHAAR"
  | "PAN"
  | "DRIVING_LICENSE"
  | "VOTER_ID"
  | "PASSPORT";

export interface DigiLockerVerificationRequest {
  documentType: DigiLockerDocumentType;
  documentNumber: string;
  consentToken: string; // User must grant consent via OAuth flow
  requestId: string; // Idempotency key
}

export interface DigiLockerVerificationResult {
  verified: boolean;
  documentType: DigiLockerDocumentType;
  documentNumber: string; // Masked (e.g., "XXXX1234")
  holderName: string;
  issueDate?: string;
  expiryDate?: string;
  errorCode?: string;
  errorMessage?: string;
}

export interface DigiLockerAdapter {
  verifyDocument(request: DigiLockerVerificationRequest): Promise<DigiLockerVerificationResult>;
  getAuthorizationUrl(redirectUri: string, state: string): string;
  exchangeCodeForToken(code: string, redirectUri: string): Promise<string>;
}

/**
 * Real DigiLocker adapter (requires API credentials and OAuth setup)
 */
export class RealDigiLockerAdapter implements DigiLockerAdapter {
  private clientId: string;
  private clientSecret: string;
  private baseUrl: string;

  constructor() {
    this.clientId = process.env.DIGILOCKER_CLIENT_ID || "";
    this.clientSecret = process.env.DIGILOCKER_CLIENT_SECRET || "";
    this.baseUrl = process.env.DIGILOCKER_BASE_URL || "https://api.digitallocker.gov.in";

    if (!this.clientId || !this.clientSecret) {
      console.warn("[DigiLocker] Missing credentials. Adapter will fail at runtime unless credentials are provided.");
    }
  }

  getAuthorizationUrl(redirectUri: string, state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      state,
    });
    return `${this.baseUrl}/public/oauth2/1/authorize?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("[DigiLocker] Missing credentials. Cannot exchange authorization code.");
    }

    const response = await fetch(`${this.baseUrl}/public/oauth2/1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: this.clientId,
        client_secret: this.clientSecret,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`[DigiLocker] Token exchange failed: ${error}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  async verifyDocument(request: DigiLockerVerificationRequest): Promise<DigiLockerVerificationResult> {
    if (!this.clientId || !this.clientSecret) {
      throw new Error("[DigiLocker] Missing credentials. Cannot verify document.");
    }

    // DigiLocker verification API endpoint (adjust based on actual API documentation)
    const response = await fetch(`${this.baseUrl}/public/oauth2/3/files/issued`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${request.consentToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        document_type: request.documentType,
        document_number: request.documentNumber,
        request_id: request.requestId,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        verified: false,
        documentType: request.documentType,
        documentNumber: maskDocumentNumber(request.documentNumber),
        holderName: "",
        errorCode: `HTTP_${response.status}`,
        errorMessage: error,
      };
    }

    const data = await response.json();

    return {
      verified: data.verified === true,
      documentType: request.documentType,
      documentNumber: maskDocumentNumber(data.document_number || request.documentNumber),
      holderName: data.holder_name || "",
      issueDate: data.issue_date,
      expiryDate: data.expiry_date,
    };
  }
}

/**
 * Mock DigiLocker adapter for development and testing
 */
export class MockDigiLockerAdapter implements DigiLockerAdapter {
  getAuthorizationUrl(redirectUri: string, state: string): string {
    return `https://mock-digilocker.example.com/authorize?redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  }

  async exchangeCodeForToken(code: string, redirectUri: string): Promise<string> {
    await sleep(200); // Simulate network delay
    return `mock_access_token_${code}`;
  }

  async verifyDocument(request: DigiLockerVerificationRequest): Promise<DigiLockerVerificationResult> {
    await sleep(300); // Simulate API latency

    // Mock verification logic: succeeds if document number length >= 8
    const verified = request.documentNumber.length >= 8;

    return {
      verified,
      documentType: request.documentType,
      documentNumber: maskDocumentNumber(request.documentNumber),
      holderName: verified ? "Mock User Name" : "",
      issueDate: verified ? "2020-01-01" : undefined,
      expiryDate: verified && request.documentType === "DRIVING_LICENSE" ? "2030-01-01" : undefined,
      errorCode: verified ? undefined : "INVALID_DOCUMENT",
      errorMessage: verified ? undefined : "Document verification failed (mock)",
    };
  }
}

/**
 * Factory function to get the appropriate DigiLocker adapter
 */
export function getDigiLockerAdapter(): DigiLockerAdapter {
  const useMock = process.env.DIGILOCKER_USE_MOCK === "true" || !process.env.DIGILOCKER_CLIENT_ID;
  
  if (useMock) {
    console.log("[DigiLocker] Using MockDigiLockerAdapter (no credentials configured)");
    return new MockDigiLockerAdapter();
  }

  return new RealDigiLockerAdapter();
}

// Helper functions

function maskDocumentNumber(documentNumber: string): string {
  if (documentNumber.length <= 4) return documentNumber;
  return "X".repeat(documentNumber.length - 4) + documentNumber.slice(-4);
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

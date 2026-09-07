/**
 * ClearTax e-Invoice Integration Adapter
 * 
 * ClearTax is an Indian GST compliance platform.
 * Used for generating GST-compliant invoices and obtaining IRN (Invoice Reference Number).
 * 
 * Adapter Pattern:
 * - Real: Connects to ClearTax API (requires credentials)
 * - Mock: Returns synthetic IRN for development
 * 
 * Security: Never expose GST credentials. Always validate invoice amounts server-side.
 */

export interface GSTInvoiceRequest {
  invoiceNumber: string;
  invoiceDate: Date;
  supplierGSTIN: string;
  supplierName: string;
  supplierAddress: string;
  buyerGSTIN?: string; // Optional for B2C
  buyerName: string;
  buyerAddress: string;
  lineItems: Array<{
    description: string;
    hsnCode: string;
    quantity: number;
    unitPrice: number;
    taxRate: number; // GST rate (e.g., 18 for 18%)
  }>;
  requestId: string; // Idempotency key
}

export interface GSTInvoiceResult {
  success: boolean;
  irn?: string; // Invoice Reference Number (mandatory for B2B invoices > ₹50L)
  qrCode?: string; // Base64 encoded QR code
  ackNo?: string; // Acknowledgement number from GST portal
  ackDate?: Date;
  errorCode?: string;
  errorMessage?: string;
}

export interface ClearTaxAdapter {
  generateInvoice(request: GSTInvoiceRequest): Promise<GSTInvoiceResult>;
  cancelInvoice(irn: string, reason: string): Promise<{ success: boolean; errorMessage?: string }>;
}

/**
 * Real ClearTax adapter (requires API credentials)
 */
export class RealClearTaxAdapter implements ClearTaxAdapter {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CLEARTAX_API_KEY || "";
    this.baseUrl = process.env.CLEARTAX_BASE_URL || "https://einvoicing.internal.cleartax.co/v2";

    if (!this.apiKey) {
      console.warn("[ClearTax] Missing API key. Adapter will fail at runtime unless credentials are provided.");
    }
  }

  async generateInvoice(request: GSTInvoiceRequest): Promise<GSTInvoiceResult> {
    if (!this.apiKey) {
      throw new Error("[ClearTax] Missing API key. Cannot generate invoice.");
    }

    // Calculate totals
    const lineItems = request.lineItems.map(item => {
      const taxableValue = item.quantity * item.unitPrice;
      const taxAmount = (taxableValue * item.taxRate) / 100;
      return {
        ...item,
        taxableValue,
        taxAmount,
        totalValue: taxableValue + taxAmount,
      };
    });

    const totalTaxableValue = lineItems.reduce((sum, item) => sum + item.taxableValue, 0);
    const totalTaxAmount = lineItems.reduce((sum, item) => sum + item.taxAmount, 0);
    const totalInvoiceValue = totalTaxableValue + totalTaxAmount;

    const payload = {
      version: "1.1",
      tranDtls: {
        taxSch: "GST",
        supTyp: request.buyerGSTIN ? "B2B" : "B2C",
        regRev: "N",
        igstOnIntra: "N",
      },
      docDtls: {
        typ: "INV",
        no: request.invoiceNumber,
        dt: formatDate(request.invoiceDate),
      },
      sellerDtls: {
        gstin: request.supplierGSTIN,
        lglNm: request.supplierName,
        addr1: request.supplierAddress,
      },
      buyerDtls: {
        gstin: request.buyerGSTIN || undefined,
        lglNm: request.buyerName,
        addr1: request.buyerAddress,
        pos: "27", // Karnataka (adjust based on buyer location)
      },
      itemList: lineItems.map((item, idx) => ({
        slNo: (idx + 1).toString(),
        prdDesc: item.description,
        hsnCd: item.hsnCode,
        qty: item.quantity,
        unit: "NOS",
        unitPrice: item.unitPrice,
        totAmt: item.taxableValue,
        gstRt: item.taxRate,
        igstAmt: 0, // Adjust based on intra-state/inter-state
        cgstAmt: item.taxAmount / 2,
        sgstAmt: item.taxAmount / 2,
        totItemVal: item.totalValue,
      })),
      valDtls: {
        assVal: totalTaxableValue,
        cgstVal: totalTaxAmount / 2,
        sgstVal: totalTaxAmount / 2,
        igstVal: 0,
        totInvVal: totalInvoiceValue,
      },
      request_id: request.requestId,
    };

    const response = await fetch(`${this.baseUrl}/eInvoice/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Cleartax-Auth-Token": this.apiKey,
        "gstin": request.supplierGSTIN,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        errorCode: `HTTP_${response.status}`,
        errorMessage: error,
      };
    }

    const data = await response.json();

    if (data.error) {
      return {
        success: false,
        errorCode: data.error.error_code,
        errorMessage: data.error.error_message,
      };
    }

    return {
      success: true,
      irn: data.govt_response?.Irn,
      qrCode: data.govt_response?.SignedQRCode,
      ackNo: data.govt_response?.AckNo,
      ackDate: data.govt_response?.AckDt ? new Date(data.govt_response.AckDt) : undefined,
    };
  }

  async cancelInvoice(irn: string, reason: string): Promise<{ success: boolean; errorMessage?: string }> {
    if (!this.apiKey) {
      throw new Error("[ClearTax] Missing API key. Cannot cancel invoice.");
    }

    const response = await fetch(`${this.baseUrl}/eInvoice/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Cleartax-Auth-Token": this.apiKey,
      },
      body: JSON.stringify({
        irn,
        cnlRsn: reason.substring(0, 100), // Max 100 chars
        cnlRem: reason,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        errorMessage: error,
      };
    }

    const data = await response.json();

    if (data.error) {
      return {
        success: false,
        errorMessage: data.error.error_message,
      };
    }

    return { success: true };
  }
}

/**
 * Mock ClearTax adapter for development and testing
 */
export class MockClearTaxAdapter implements ClearTaxAdapter {
  async generateInvoice(request: GSTInvoiceRequest): Promise<GSTInvoiceResult> {
    await sleep(400);

    // Mock IRN generation
    const irn = generateMockIRN(request.invoiceNumber);

    return {
      success: true,
      irn,
      qrCode: generateMockQRCode(irn),
      ackNo: `ACK${Math.random().toString().substring(2, 14)}`,
      ackDate: new Date(),
    };
  }

  async cancelInvoice(irn: string, reason: string): Promise<{ success: boolean; errorMessage?: string }> {
    await sleep(300);
    return { success: true };
  }
}

/**
 * Factory function to get the appropriate ClearTax adapter
 */
export function getClearTaxAdapter(): ClearTaxAdapter {
  const useMock = process.env.CLEARTAX_USE_MOCK === "true" || !process.env.CLEARTAX_API_KEY;

  if (useMock) {
    console.log("[ClearTax] Using MockClearTaxAdapter (no credentials configured)");
    return new MockClearTaxAdapter();
  }

  return new RealClearTaxAdapter();
}

// Helper functions

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function generateMockIRN(invoiceNumber: string): string {
  // IRN format: 64 alphanumeric characters
  const hash = Buffer.from(`${invoiceNumber}-${Date.now()}`).toString("base64").replace(/[^a-zA-Z0-9]/g, "");
  return hash.substring(0, 64).padEnd(64, "0");
}

function generateMockQRCode(irn: string): string {
  // Return base64 encoded mock QR code
  return Buffer.from(`QR:${irn}`).toString("base64");
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

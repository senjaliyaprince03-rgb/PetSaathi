// src/lib/einvoice.ts
// Generates GST e-Invoice IRN via ClearTax API

interface EInvoicePayload {
  invoiceId: string;
  sellerGstin: string;
  buyerGstin: string;
  invoiceNumber: string;
  invoiceDate: string; // YYYY-MM-DD
  totalAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  sacCode: string; // 998399 for pet care services
  lineItems: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

export async function generateIRN(payload: EInvoicePayload): Promise<{
  irn: string;
  qrCode: string;
  signedInvoice: string;
}> {
  // If ClearTax API key is not configured or in mock mode, return mock IRN data
  if (!process.env.CLEARTAX_API_KEY || process.env.CLEARTAX_USE_MOCK === "true") {
    const mockHash = Buffer.from(`${payload.invoiceNumber}:${payload.invoiceDate}`).toString("hex").padEnd(64, "0").slice(0, 64);
    return {
      irn: mockHash,
      qrCode: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text y="50">IRN-${payload.invoiceNumber}</text></svg>`,
      signedInvoice: `SIGNED_INVOICE_${payload.invoiceNumber}`,
    };
  }

  const response = await fetch(
    `${process.env.CLEARTAX_BASE_URL || "https://einvoicing.internal.cleartax.co"}/v2/einvoice/generate`,
    {
      method: "POST",
      headers: {
        "x-cleartax-auth-token": process.env.CLEARTAX_API_KEY,
        "Content-Type": "application/json",
        gstin: process.env.CLEARTAX_GSTIN || payload.sellerGstin,
      },
      body: JSON.stringify({
        Version: "1.1",
        TranDtls: {
          TaxSch: "GST",
          SupTyp: "B2B",
          RegRev: "N",
          IgstOnIntra: "N",
        },
        DocDtls: {
          Typ: "INV",
          No: payload.invoiceNumber,
          Dt: payload.invoiceDate,
        },
        SellerDtls: {
          Gstin: payload.sellerGstin,
        },
        BuyerDtls: {
          Gstin: payload.buyerGstin,
        },
        ValDtls: {
          AssVal: payload.totalAmount - payload.cgst - payload.sgst - payload.igst,
          CgstVal: payload.cgst,
          SgstVal: payload.sgst,
          IgstVal: payload.igst,
          TotInvVal: payload.totalAmount,
        },
        ItemList: payload.lineItems.map((item, i) => ({
          SlNo: String(i + 1),
          IsServc: "Y",
          HsnCd: payload.sacCode,
          Desc: item.description,
          Qty: item.quantity,
          UnitPrice: item.rate,
          TotAmt: item.amount,
        })),
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`ClearTax IRN generation failed: ${err}`);
  }

  const data = await response.json();
  return {
    irn: data.Irn,
    qrCode: data.QRCode,
    signedInvoice: data.SignedInvoice,
  };
}

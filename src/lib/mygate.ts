// src/lib/mygate.ts
// MyGate Visitor Management API integration

const MYGATE_API_BASE = process.env.MYGATE_API_BASE || "https://api.mygate.co.in/v2";

interface VisitorRegistration {
  societyGateId: string; // stored in Society.externalGateId or geofence metadata
  visitorName: string;
  visitorPhone: string;
  visitorPhotoUrl?: string;
  purposeOfVisit: string;
  scheduledEntryTime: Date;
  scheduledExitTime: Date;
  unitNumber: string; // customer's apartment number
}

export async function registerMygateVisitor(
  data: VisitorRegistration
): Promise<{ visitorId: string; qrCode: string }> {
  // If MyGate API token is not configured or in mock mode, return mock visitor credentials
  if (!process.env.MYGATE_API_TOKEN || process.env.MYGATE_USE_MOCK === "true") {
    const mockId = `mygate_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    return {
      visitorId: mockId,
      qrCode: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text y="50">VISITOR-${mockId}</text></svg>`,
    };
  }

  const response = await fetch(`${MYGATE_API_BASE}/visitors/pre-approve`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MYGATE_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      society_gate_id: data.societyGateId,
      visitor_name: data.visitorName,
      visitor_mobile: data.visitorPhone,
      visitor_photo: data.visitorPhotoUrl,
      purpose: data.purposeOfVisit,
      expected_arrival: data.scheduledEntryTime.toISOString(),
      expected_departure: data.scheduledExitTime.toISOString(),
      flat_number: data.unitNumber,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`MyGate registration failed: ${err}`);
  }

  const result = await response.json();
  return {
    visitorId: result.visitor_id || result.id,
    qrCode: result.qr_code || result.qrCode,
  };
}

export type GateProviderType = "WHATSAPP" | "MYGATE" | "NOBROKER" | "CUSTOM";

export interface GateApprovalEntry {
  sitterId: string;
  sitterName: string;
  sitterPhone: string;
  customerId: string;
  customerName: string;
  customerUnit: string;
  bookingId: string;
  bookingReference: string;
  serviceType: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  purpose: string;
}

export interface GateApprovalRequest {
  entry: GateApprovalEntry;
  societyId: string;
  societyName: string;
  requestedAt: Date;
  expiresAt: Date;
}

export interface GateApprovalResult {
  success: boolean;
  status: "APPROVED" | "PENDING" | "REJECTED";
  approvalId?: string;
  accessCode?: string;
  error?: string;
}

export interface GateNotification {
  societyId: string;
  recipientPhone: string;
  message: string;
  metadata?: Record<string, any>;
}

export interface GateNotificationResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface IGateProvider {
  name: string;
  type: GateProviderType;
  requestApproval(request: GateApprovalRequest): Promise<GateApprovalResult>;
  checkApprovalStatus(approvalId: string): Promise<GateApprovalResult>;
  sendNotification(notification: GateNotification): Promise<GateNotificationResult>;
  isAvailable(): Promise<boolean>;
}

export class MockGateProvider implements IGateProvider {
  name = "mock-gate";
  type: GateProviderType;

  constructor(type: GateProviderType = "WHATSAPP") {
    this.type = type;
  }

  async requestApproval(request: GateApprovalRequest): Promise<GateApprovalResult> {
    const approvalId = `mock-${this.type.toLowerCase()}-${Date.now()}`;
    return {
      success: true,
      status: "APPROVED",
      approvalId,
      accessCode: `PASS-${Math.floor(1000 + Math.random() * 9000)}`,
    };
  }

  async checkApprovalStatus(approvalId: string): Promise<GateApprovalResult> {
    return {
      success: true,
      status: "APPROVED",
      approvalId,
    };
  }

  async sendNotification(notification: GateNotification): Promise<GateNotificationResult> {
    return {
      success: true,
      messageId: `msg-${Date.now()}`,
    };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

export function getGateProvider(type: GateProviderType = "WHATSAPP"): IGateProvider {
  return new MockGateProvider(type);
}

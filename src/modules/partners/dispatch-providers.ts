/**
 * Partner Service Dispatch Provider Abstractions
 * 
 * Provides clean interfaces for dispatching service orders to partner providers:
 * - Veterinary clinics
 * - Grooming salons
 * - Training centers
 * - Pet hotels
 * 
 * Supports multiple dispatch methods:
 * - Email dispatch (for partners without API integration)
 * - WhatsApp Business API (for partners preferring WhatsApp)
 * - Partner API webhooks (for partners with technical integration)
 */

import "server-only";

import { logger } from "@/lib/logger";

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export type DispatchMethod = "EMAIL" | "WHATSAPP" | "WEBHOOK" | "MANUAL";

export interface PartnerOrderDispatch {
  orderId: string;
  orderReference: string;
  partnerId: string;
  partnerName: string;
  serviceCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  petId?: string;
  petName?: string;
  petSpecies?: string;
  petBreed?: string;
  scheduledAt?: Date;
  instructions?: string;
  estimatedAmountPaise?: number;
  metadata?: Record<string, unknown>;
}

export interface DispatchRequest {
  method: DispatchMethod;
  dispatch: PartnerOrderDispatch;
  destination: string; // Email, phone, or webhook URL
  retryAttempt?: number;
}

export interface DispatchResponse {
  success: boolean;
  dispatchId?: string;
  status: "SENT" | "DELIVERED" | "FAILED" | "PENDING";
  error?: string;
  shouldRetry?: boolean;
  partnerResponse?: Record<string, unknown>;
}

export interface DispatchStatusCheck {
  dispatchId: string;
  method: DispatchMethod;
}

export interface DispatchStatus {
  dispatchId: string;
  status: "SENT" | "DELIVERED" | "ACKNOWLEDGED" | "ACCEPTED" | "REJECTED" | "FAILED";
  acknowledgedAt?: Date;
  respondedAt?: Date;
  partnerNote?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// DISPATCH PROVIDER INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

export interface DispatchProvider {
  readonly name: string;
  readonly method: DispatchMethod;
  
  /**
   * Dispatch order to partner
   */
  dispatch(request: DispatchRequest): Promise<DispatchResponse>;
  
  /**
   * Check dispatch status
   */
  checkStatus(check: DispatchStatusCheck): Promise<DispatchStatus | null>;
  
  /**
   * Check if provider is available
   */
  isAvailable(): Promise<boolean>;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DISPATCH PROVIDER (Development/Testing)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Mock Dispatch Provider
 * 
 * Used for development and testing. Does NOT send real dispatches.
 * Never use in production.
 */
export class MockDispatchProvider implements DispatchProvider {
  readonly name = "mock-dispatch";
  readonly method: DispatchMethod;

  constructor(method: DispatchMethod) {
    this.method = method;
  }

  async dispatch(request: DispatchRequest): Promise<DispatchResponse> {
    logger.warn("[MOCK_DISPATCH] Using mock provider - no real dispatch sent", {
      method: this.method,
      orderId: request.dispatch.orderId,
      orderReference: request.dispatch.orderReference,
      destination: request.destination.slice(0, 20) + "...",
    });

    await new Promise(resolve => setTimeout(resolve, 100));

    // Mock patterns for testing
    if (request.destination.includes("fail") || request.destination.includes("error")) {
      return {
        success: false,
        status: "FAILED",
        error: "Mock dispatch failure",
        shouldRetry: true,
      };
    }

    return {
      success: true,
      dispatchId: `mock-${this.method.toLowerCase()}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
      status: "DELIVERED",
    };
  }

  async checkStatus(check: DispatchStatusCheck): Promise<DispatchStatus | null> {
    // Mock: all dispatches are acknowledged
    return {
      dispatchId: check.dispatchId,
      status: "ACKNOWLEDGED",
      acknowledgedAt: new Date(Date.now() - 60_000), // 1 minute ago
    };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// EMAIL DISPATCH PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Email Dispatch Provider
 * 
 * Sends order dispatch via email to partner contact.
 * Uses configured SMTP server (same as notification system).
 * 
 * Environment Variables:
 * - SMTP_USER: SMTP username
 * - SMTP_PASS: SMTP password
 */
export class EmailDispatchProvider implements DispatchProvider {
  readonly name = "email-dispatch";
  readonly method = "EMAIL" as const;

  private smtpUser: string;
  private smtpPass: string;

  constructor() {
    this.smtpUser = process.env.SMTP_USER || "";
    this.smtpPass = process.env.SMTP_PASS || "";
  }

  async dispatch(request: DispatchRequest): Promise<DispatchResponse> {
    if (!this.smtpUser || !this.smtpPass) {
      logger.error("[EMAIL_DISPATCH] SMTP not configured", {
        orderId: request.dispatch.orderId,
      });
      return {
        success: false,
        status: "FAILED",
        error: "BLOCKED_EXTERNAL_EMAIL_UNAVAILABLE",
        shouldRetry: false,
      };
    }

    try {
      const nodemailer = await import("nodemailer");
      const transporter = nodemailer.default.createTransport({
        service: "gmail",
        auth: { user: this.smtpUser, pass: this.smtpPass },
      });

      const emailContent = this.formatDispatchEmail(request.dispatch);

      const info = await transporter.sendMail({
        from: `"PetSaathi Partner Services" <${this.smtpUser}>`,
        to: request.destination,
        subject: `New Service Request: ${request.dispatch.orderReference}`,
        text: emailContent.text,
        html: emailContent.html,
      });

      logger.info("[EMAIL_DISPATCH] Order dispatched", {
        messageId: info.messageId,
        orderId: request.dispatch.orderId,
        partner: request.dispatch.partnerName,
      });

      return {
        success: true,
        dispatchId: info.messageId || `email-${Date.now()}`,
        status: "SENT",
      };
    } catch (error) {
      logger.exception("[EMAIL_DISPATCH] Dispatch failed", error as Error, {
        orderId: request.dispatch.orderId,
      });

      return {
        success: false,
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
        shouldRetry: true,
      };
    }
  }

  async checkStatus(check: DispatchStatusCheck): Promise<DispatchStatus | null> {
    // Email doesn't provide delivery confirmation
    // Status would need to be updated manually or via partner response webhook
    return {
      dispatchId: check.dispatchId,
      status: "SENT",
    };
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.smtpUser && this.smtpPass);
  }

  private formatDispatchEmail(dispatch: PartnerOrderDispatch): { text: string; html: string } {
    const scheduledTime = dispatch.scheduledAt
      ? dispatch.scheduledAt.toLocaleString("en-IN", {
          dateStyle: "full",
          timeStyle: "short",
        })
      : "Not yet scheduled";

    const amount = dispatch.estimatedAmountPaise
      ? `₹${(dispatch.estimatedAmountPaise / 100).toFixed(2)}`
      : "To be determined";

    const text = `New Service Request from PetSaathi

Order Reference: ${dispatch.orderReference}
Service: ${dispatch.serviceCode}
Scheduled: ${scheduledTime}
Estimated Amount: ${amount}

Customer Details:
Name: ${dispatch.customerName}
Phone: ${dispatch.customerPhone}
Email: ${dispatch.customerEmail}

${dispatch.petName ? `Pet Details:
Name: ${dispatch.petName}
Species: ${dispatch.petSpecies || "N/A"}
Breed: ${dispatch.petBreed || "N/A"}
` : ""}
${dispatch.instructions ? `Special Instructions:
${dispatch.instructions}
` : ""}
Please confirm receipt of this order and respond with your availability.

To update order status, log in to your PetSaathi Partner Portal.

Thank you,
PetSaathi Team`;

    const html = `<!DOCTYPE html>
<html>
<head>
<style>
body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
.container { max-width: 600px; margin: 0 auto; padding: 20px; }
.header { background-color: #4CAF50; color: white; padding: 20px; text-align: center; }
.content { padding: 20px; background-color: #f9f9f9; }
.section { margin-bottom: 20px; }
.label { font-weight: bold; color: #555; }
.value { color: #333; }
.footer { text-align: center; padding: 20px; color: #777; font-size: 12px; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>New Service Request</h1>
    <p>Order #${dispatch.orderReference}</p>
  </div>
  <div class="content">
    <div class="section">
      <p class="label">Service:</p>
      <p class="value">${dispatch.serviceCode}</p>
    </div>
    <div class="section">
      <p class="label">Scheduled:</p>
      <p class="value">${scheduledTime}</p>
    </div>
    <div class="section">
      <p class="label">Estimated Amount:</p>
      <p class="value">${amount}</p>
    </div>
    <div class="section">
      <h3>Customer Details</h3>
      <p><span class="label">Name:</span> ${dispatch.customerName}</p>
      <p><span class="label">Phone:</span> ${dispatch.customerPhone}</p>
      <p><span class="label">Email:</span> ${dispatch.customerEmail}</p>
    </div>
    ${dispatch.petName ? `<div class="section">
      <h3>Pet Details</h3>
      <p><span class="label">Name:</span> ${dispatch.petName}</p>
      <p><span class="label">Species:</span> ${dispatch.petSpecies || "N/A"}</p>
      <p><span class="label">Breed:</span> ${dispatch.petBreed || "N/A"}</p>
    </div>` : ""}
    ${dispatch.instructions ? `<div class="section">
      <h3>Special Instructions</h3>
      <p>${dispatch.instructions}</p>
    </div>` : ""}
  </div>
  <div class="footer">
    <p>Please confirm receipt and respond with your availability.</p>
    <p>Log in to your PetSaathi Partner Portal to manage this order.</p>
  </div>
</div>
</body>
</html>`;

    return { text, html };
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// WHATSAPP DISPATCH PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * WhatsApp Business Dispatch Provider
 * 
 * Sends order dispatch via WhatsApp Business API to partner contact.
 * 
 * Environment Variables:
 * - WHATSAPP_ACCESS_TOKEN: Meta Graph API access token
 * - WHATSAPP_PHONE_NUMBER_ID: WhatsApp Business phone number ID
 */
export class WhatsAppDispatchProvider implements DispatchProvider {
  readonly name = "whatsapp-dispatch";
  readonly method = "WHATSAPP" as const;

  private accessToken: string;
  private phoneNumberId: string;

  constructor() {
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN || "";
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || "";
  }

  async dispatch(request: DispatchRequest): Promise<DispatchResponse> {
    if (!this.accessToken || !this.phoneNumberId) {
      logger.error("[WHATSAPP_DISPATCH] Provider not configured", {
        orderId: request.dispatch.orderId,
      });
      return {
        success: false,
        status: "FAILED",
        error: "BLOCKED_EXTERNAL_WHATSAPP_UNAVAILABLE",
        shouldRetry: false,
      };
    }

    try {
      const message = this.formatDispatchMessage(request.dispatch);

      const response = await fetch(
        `https://graph.facebook.com/v22.0/${this.phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: request.destination,
            type: "text",
            text: { body: message },
          }),
          signal: AbortSignal.timeout(10_000),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error("[WHATSAPP_DISPATCH] API error", {
          status: response.status,
          error: errorData,
          orderId: request.dispatch.orderId,
        });

        return {
          success: false,
          status: "FAILED",
          error: `WhatsApp API error: ${response.status}`,
          shouldRetry: response.status >= 500,
        };
      }

      const result = await response.json() as { messages?: Array<{ id?: string }> };
      const messageId = result.messages?.[0]?.id;

      logger.info("[WHATSAPP_DISPATCH] Order dispatched", {
        messageId,
        orderId: request.dispatch.orderId,
        partner: request.dispatch.partnerName,
      });

      return {
        success: true,
        dispatchId: messageId || `whatsapp-${Date.now()}`,
        status: "SENT",
      };
    } catch (error) {
      logger.exception("[WHATSAPP_DISPATCH] Dispatch failed", error as Error, {
        orderId: request.dispatch.orderId,
      });

      return {
        success: false,
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
        shouldRetry: true,
      };
    }
  }

  async checkStatus(check: DispatchStatusCheck): Promise<DispatchStatus | null> {
    // WhatsApp status would be tracked via webhook callbacks
    return {
      dispatchId: check.dispatchId,
      status: "SENT",
    };
  }

  async isAvailable(): Promise<boolean> {
    return !!(this.accessToken && this.phoneNumberId);
  }

  private formatDispatchMessage(dispatch: PartnerOrderDispatch): string {
    const scheduledTime = dispatch.scheduledAt
      ? dispatch.scheduledAt.toLocaleString("en-IN", {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Not yet scheduled";

    const amount = dispatch.estimatedAmountPaise
      ? `₹${(dispatch.estimatedAmountPaise / 100).toFixed(2)}`
      : "TBD";

    return `🐾 *New PetSaathi Service Request*

*Order:* #${dispatch.orderReference}
*Service:* ${dispatch.serviceCode}
*Scheduled:* ${scheduledTime}
*Amount:* ${amount}

*Customer*
${dispatch.customerName}
${dispatch.customerPhone}

${dispatch.petName ? `*Pet*
${dispatch.petName} (${dispatch.petSpecies})
${dispatch.petBreed || ""}
` : ""}
${dispatch.instructions ? `*Instructions*
${dispatch.instructions}
` : ""}
Please confirm receipt and availability.
Log in to Partner Portal to manage this order.`;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// WEBHOOK DISPATCH PROVIDER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Webhook Dispatch Provider
 * 
 * Sends order dispatch to partner's webhook endpoint (for partners with API integration).
 * 
 * Environment Variables:
 * - PARTNER_WEBHOOK_SECRET: Shared secret for HMAC signature verification
 */
export class WebhookDispatchProvider implements DispatchProvider {
  readonly name = "webhook-dispatch";
  readonly method = "WEBHOOK" as const;

  private webhookSecret: string;

  constructor() {
    this.webhookSecret = process.env.PARTNER_WEBHOOK_SECRET || "";
  }

  async dispatch(request: DispatchRequest): Promise<DispatchResponse> {
    if (!this.webhookSecret) {
      logger.warn("[WEBHOOK_DISPATCH] No webhook secret configured");
    }

    try {
      const payload = {
        event: "partner_order.dispatched",
        timestamp: new Date().toISOString(),
        data: {
          orderId: request.dispatch.orderId,
          orderReference: request.dispatch.orderReference,
          partnerId: request.dispatch.partnerId,
          serviceCode: request.dispatch.serviceCode,
          customer: {
            id: request.dispatch.customerId,
            name: request.dispatch.customerName,
            phone: request.dispatch.customerPhone,
            email: request.dispatch.customerEmail,
          },
          pet: request.dispatch.petId ? {
            id: request.dispatch.petId,
            name: request.dispatch.petName,
            species: request.dispatch.petSpecies,
            breed: request.dispatch.petBreed,
          } : null,
          scheduledAt: request.dispatch.scheduledAt?.toISOString(),
          instructions: request.dispatch.instructions,
          estimatedAmountPaise: request.dispatch.estimatedAmountPaise,
          metadata: request.dispatch.metadata,
        },
      };

      // Generate HMAC signature if secret is available
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "PetSaathi-Dispatch/1.0",
      };

      if (this.webhookSecret) {
        const crypto = await import("node:crypto");
        const signature = crypto
          .createHmac("sha256", this.webhookSecret)
          .update(JSON.stringify(payload))
          .digest("hex");
        headers["X-PetSaathi-Signature"] = signature;
      }

      const response = await fetch(request.destination, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30_000),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        logger.error("[WEBHOOK_DISPATCH] Partner webhook error", {
          status: response.status,
          error: errorText,
          orderId: request.dispatch.orderId,
          webhookUrl: request.destination,
        });

        return {
          success: false,
          status: "FAILED",
          error: `Partner webhook error: ${response.status}`,
          shouldRetry: response.status >= 500,
        };
      }

      const result = await response.json().catch(() => ({})) as Record<string, unknown>;

      logger.info("[WEBHOOK_DISPATCH] Order dispatched via webhook", {
        orderId: request.dispatch.orderId,
        partner: request.dispatch.partnerName,
        webhookUrl: request.destination,
      });

      return {
        success: true,
        dispatchId: `webhook-${request.dispatch.orderId}`,
        status: "DELIVERED",
        partnerResponse: result,
      };
    } catch (error) {
      logger.exception("[WEBHOOK_DISPATCH] Dispatch failed", error as Error, {
        orderId: request.dispatch.orderId,
        webhookUrl: request.destination,
      });

      return {
        success: false,
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
        shouldRetry: true,
      };
    }
  }

  async checkStatus(check: DispatchStatusCheck): Promise<DispatchStatus | null> {
    // Webhook status would be tracked via partner response callback
    return {
      dispatchId: check.dispatchId,
      status: "DELIVERED",
    };
  }

  async isAvailable(): Promise<boolean> {
    return true; // Webhook dispatch is always available
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROVIDER FACTORY
// ═══════════════════════════════════════════════════════════════════════════

export function getDispatchProvider(method: DispatchMethod): DispatchProvider {
  const providerMode = process.env.PARTNER_DISPATCH_PROVIDER || "mock";

  if (providerMode === "mock") {
    return new MockDispatchProvider(method);
  }

  switch (method) {
    case "EMAIL":
      return new EmailDispatchProvider();
    case "WHATSAPP":
      return new WhatsAppDispatchProvider();
    case "WEBHOOK":
      return new WebhookDispatchProvider();
    case "MANUAL":
      // Manual dispatch doesn't need a provider
      return new MockDispatchProvider("MANUAL");
    default:
      throw new Error(`Unsupported dispatch method: ${method}`);
  }
}

/**
 * Dispatch partner order using configured method
 */
export async function dispatchPartnerOrder(
  request: DispatchRequest
): Promise<DispatchResponse> {
  const provider = getDispatchProvider(request.method);

  const available = await provider.isAvailable();
  if (!available) {
    logger.warn("[DISPATCH] Provider unavailable", {
      method: request.method,
      orderId: request.dispatch.orderId,
    });
    return {
      success: false,
      status: "FAILED",
      error: `${request.method} dispatch provider not configured`,
      shouldRetry: false,
    };
  }

  return provider.dispatch(request);
}

// src/lib/openwa.ts
/**
 * OpenWA Gateway Client for PetSaathi
 * Connects PetSaathi to the self-hosted OpenWA WhatsApp Gateway (rmyndharis/OpenWA)
 * Supports WhatsApp automation, AI chatbot interactions, session management, and webhooks.
 */

import crypto from "crypto";
import { logger } from "./logger";

export interface OpenWASession {
  id: string;
  name: string;
  status: "created" | "initializing" | "qr_ready" | "authenticating" | "ready" | "disconnected" | "action_required" | "failed";
  engine?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface OpenWASendTextOptions {
  chatId: string;
  text: string;
  sessionId?: string;
  replyTo?: string;
}

export interface OpenWASendMediaOptions {
  chatId: string;
  url?: string;
  base64?: string;
  mimetype?: string;
  filename?: string;
  caption?: string;
  sessionId?: string;
}

export interface OpenWAWebhookConfig {
  url: string;
  events?: string[];
  secret?: string;
  sessionId?: string;
}

/**
 * Normalizes a phone number or raw chatId into standard WhatsApp ID (e.g., 919876543210@c.us)
 */
export function formatChatId(recipient: string): string {
  if (recipient.includes("@c.us") || recipient.includes("@g.us") || recipient.includes("@lid")) {
    return recipient;
  }
  // Strip '+', spaces, dashes, parentheses
  const cleaned = recipient.replace(/[^0-9]/g, "");
  return `${cleaned}@c.us`;
}

export class OpenWAClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultSessionId: string;

  constructor(options?: { baseUrl?: string; apiKey?: string; sessionId?: string }) {
    const rawBase = options?.baseUrl || process.env.OPENWA_BASE_URL || "http://localhost:2785";
    // Strip trailing slash if present
    this.baseUrl = rawBase.replace(/\/+$/, "");
    this.apiKey = options?.apiKey || process.env.OPENWA_API_KEY || process.env.API_MASTER_KEY || "petsaathi_secret_openwa_key_2026";
    this.defaultSessionId = options?.sessionId || process.env.OPENWA_SESSION_ID || "petsaathi-bot";
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Bypass-Tunnel-Reminder": "true",
      "ngrok-skip-browser-warning": "true",
    };
    if (this.apiKey) {
      headers["X-API-Key"] = this.apiKey;
    }
    return headers;
  }

  /**
   * Checks gateway health
   */
  async getHealth(): Promise<{ status: string; uptime?: number; [key: string]: unknown }> {
    const res = await fetch(`${this.baseUrl}/api/health`, {
      headers: this.getHeaders(),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`OpenWA Health check failed: HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Lists all sessions on OpenWA
   */
  async listSessions(): Promise<OpenWASession[]> {
    const res = await fetch(`${this.baseUrl}/api/sessions`, {
      headers: this.getHeaders(),
      cache: "no-store",
    });
    if (!res.ok) {
      throw new Error(`Failed to list OpenWA sessions: HTTP ${res.status}`);
    }
    return res.json();
  }

  /**
   * Finds a session by name or ID
   */
  async findSession(nameOrId: string): Promise<OpenWASession | null> {
    try {
      const sessions = await this.listSessions();
      return sessions.find((s) => s.name === nameOrId || s.id === nameOrId) || null;
    } catch {
      return null;
    }
  }

  /**
   * Creates a new session if not present
   */
  async createSession(name: string): Promise<OpenWASession> {
    const existing = await this.findSession(name);
    if (existing) {
      return existing;
    }

    const res = await fetch(`${this.baseUrl}/api/sessions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ name }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to create OpenWA session '${name}': HTTP ${res.status} - ${err}`);
    }

    return res.json();
  }

  /**
   * Starts a session engine
   */
  async startSession(sessionId?: string): Promise<{ success: boolean; message?: string }> {
    const target = sessionId || this.defaultSessionId;
    const res = await fetch(`${this.baseUrl}/api/sessions/${target}/start`, {
      method: "POST",
      headers: this.getHeaders(),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to start OpenWA session '${target}': HTTP ${res.status} - ${err}`);
    }

    return res.json();
  }

  /**
   * Retrieves current session status and details
   */
  async getSessionStatus(sessionId?: string): Promise<{ status: string; [key: string]: unknown }> {
    const target = sessionId || this.defaultSessionId;
    const res = await fetch(`${this.baseUrl}/api/sessions/${target}`, {
      headers: this.getHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to get OpenWA session status '${target}': HTTP ${res.status}`);
    }

    return res.json();
  }

  /**
   * Fetches QR code for session linking
   */
  async getQrCode(sessionId?: string): Promise<{ qr?: string; [key: string]: unknown }> {
    const target = sessionId || this.defaultSessionId;
    const res = await fetch(`${this.baseUrl}/api/sessions/${target}/qr`, {
      headers: this.getHeaders(),
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to get QR code for OpenWA session '${target}': HTTP ${res.status}`);
    }

    return res.json();
  }

  /**
   * Configures / Registers webhook on OpenWA for incoming events
   */
  async registerWebhook(config: OpenWAWebhookConfig): Promise<any> {
    const sessionId = config.sessionId || this.defaultSessionId;
    const payload = {
      url: config.url,
      events: config.events || ["message.received", "session.status"],
      ...(config.secret ? { secret: config.secret } : {}),
    };

    const res = await fetch(`${this.baseUrl}/api/sessions/${sessionId}/webhooks`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Failed to register webhook on OpenWA session '${sessionId}': HTTP ${res.status} - ${err}`);
    }

    return res.json();
  }

  /**
   * Sends a plain text message via OpenWA
   */
  async sendTextMessage({ chatId, text, sessionId, replyTo }: OpenWASendTextOptions): Promise<any> {
    const targetSession = sessionId || this.defaultSessionId;
    const targetChat = formatChatId(chatId);

    const body: Record<string, unknown> = {
      chatId: targetChat,
      text,
    };
    if (replyTo) {
      body.quotedMessageId = replyTo;
    }

    const res = await fetch(`${this.baseUrl}/api/sessions/${targetSession}/messages/send-text`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      logger.error("[OPENWA_CLIENT] Send text failed", {
        chatId: targetChat,
        sessionId: targetSession,
        status: res.status,
        error: errText,
      });
      throw new Error(`OpenWA send-text failed: HTTP ${res.status} - ${errText}`);
    }

    return res.json();
  }

  /**
   * Sends a media message via OpenWA
   */
  async sendMediaMessage({
    chatId,
    url,
    base64,
    mimetype,
    filename,
    caption,
    sessionId,
  }: OpenWASendMediaOptions): Promise<any> {
    const targetSession = sessionId || this.defaultSessionId;
    const targetChat = formatChatId(chatId);

    const body: Record<string, unknown> = {
      chatId: targetChat,
      caption,
      filename,
    };
    if (url) {
      body.url = url;
    } else if (base64) {
      body.base64 = base64;
      body.mimetype = mimetype;
    } else {
      throw new Error("sendMediaMessage requires either 'url' or 'base64'");
    }

    const res = await fetch(`${this.baseUrl}/api/sessions/${targetSession}/messages/send-image`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`OpenWA send-media failed: HTTP ${res.status} - ${errText}`);
    }

    return res.json();
  }

  /**
   * Verifies HMAC-SHA256 signature sent by OpenWA in X-OpenWA-Signature header
   */
  static verifySignature(rawPayload: string, signatureHeader: string | null, secret: string): boolean {
    if (!secret) return true; // If no secret configured, skip
    if (!signatureHeader) return false;

    try {
      const expected = `sha256=${crypto.createHmac("sha256", secret).update(rawPayload).digest("hex")}`;
      return crypto.timingSafeEqual(Buffer.from(signatureHeader), Buffer.from(expected));
    } catch {
      return false;
    }
  }
}

// Default singleton instance
export const openwa = new OpenWAClient();

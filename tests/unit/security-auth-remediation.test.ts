import { describe, it, expect, vi, beforeEach } from "vitest";

describe("PHASE 1: Authentication Security & Invariants", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("AUTH-01: Demo Account Provisioning Invariant", () => {
    it("should never execute demo provisioning during login in production", async () => {
      const originalNodeEnv = process.env.NODE_ENV;
      (process.env as any).NODE_ENV = "production";
      try {
        const { ensureDemoAccount } = await import("@/modules/auth/mongodb-auth");
        // Calling ensureDemoAccount directly or via login in production must be rejected/prohibited
        await expect(ensureDemoAccount("customer.live@petsaathi.com", "CUSTOMER")).rejects.toThrow(
          /production/i
        );
      } finally {
        (process.env as any).NODE_ENV = originalNodeEnv;
      }
    });
  });

  describe("AUTH-02: Suspended/Deactivated User Reactivation Invariant", () => {
    it("prohibits reactivation of SUSPENDED user via ensureUser / OTP / Google", async () => {
      const { checkAccountStatusAllowed } = await import("@/modules/auth/mongodb-auth");
      const prohibitedStatuses = ["SUSPENDED", "DISABLED", "DEACTIVATED", "BLOCKED"];
      for (const status of prohibitedStatuses) {
        expect(() => checkAccountStatusAllowed(status as any)).toThrow(
          new RegExp(`ACCOUNT_${status}`)
        );
      }
      expect(() => checkAccountStatusAllowed("ACTIVE")).not.toThrow();
      expect(() => checkAccountStatusAllowed("PENDING")).not.toThrow();
    });
  });

  describe("AUTH-03: Google OAuth State & Open Redirect Protection", () => {
    it("sanitizes returnTo destination against open redirects", async () => {
      const { sanitizeReturnUrl } = await import("@/modules/auth/oauth-state");
      expect(sanitizeReturnUrl("https://malicious.com")).toBe("/dashboard");
      expect(sanitizeReturnUrl("//evil.com")).toBe("/dashboard");
      expect(sanitizeReturnUrl("/\\evil.com")).toBe("/dashboard");
      expect(sanitizeReturnUrl("/settings/privacy")).toBe("/settings/privacy");
      expect(sanitizeReturnUrl(null)).toBe("/dashboard");
    });

    it("creates cryptographically signed state token that rejects tampering", async () => {
      const { createOAuthState, verifyOAuthState } = await import("@/modules/auth/oauth-state");
      const { stateToken, nonce } = createOAuthState("CUSTOMER", "/dashboard");
      
      // Valid verification with matching cookie nonce
      const verified = verifyOAuthState(stateToken, nonce);
      expect(verified).not.toBeNull();
      expect(verified?.role).toBe("CUSTOMER");
      expect(verified?.returnTo).toBe("/dashboard");

      // Tampered state token must fail
      const tampered = stateToken.slice(0, -4) + "XXXX";
      expect(verifyOAuthState(tampered, nonce)).toBeNull();

      // Mismatched nonce must fail
      expect(verifyOAuthState(stateToken, "wrong_nonce")).toBeNull();
    });
  });
});

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
    }, 15000);
  });

  describe("AUTH-02: Suspended/Deactivated User Reactivation Invariant", () => {
    it("prohibits reactivation of SUSPENDED or DEACTIVATED user via ensureUser / OTP / Google", async () => {
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

  describe("AUTH-03: Google OAuth State, Nonce, Role Clamping & Open Redirect Protection", () => {
    it("sanitizes returnTo destination against external URLs, javascript:/data: URIs, and CRLF", async () => {
      const { sanitizeReturnUrl } = await import("@/modules/auth/oauth-state");
      expect(sanitizeReturnUrl("https://malicious.com")).toBe("/dashboard");
      expect(sanitizeReturnUrl("http://attacker.example/phish")).toBe("/dashboard");
      expect(sanitizeReturnUrl("//evil.com")).toBe("/dashboard");
      expect(sanitizeReturnUrl("/\\evil.com")).toBe("/dashboard");
      expect(sanitizeReturnUrl("javascript:alert(1)")).toBe("/dashboard");
      expect(sanitizeReturnUrl("data:text/html,<script>alert(1)</script>")).toBe("/dashboard");
      expect(sanitizeReturnUrl("/dashboard\r\nSet-Cookie: evil=1")).toBe("/dashboard");
      expect(sanitizeReturnUrl("/dashboard\nLocation: https://evil.com")).toBe("/dashboard");
      expect(sanitizeReturnUrl("/settings/privacy")).toBe("/settings/privacy");
      expect(sanitizeReturnUrl(null)).toBe("/dashboard");
      expect(sanitizeReturnUrl(undefined)).toBe("/dashboard");
    });

    it("enforces signed state token verification and rejects tampered, missing, expired, or wrong/missing nonce states", async () => {
      const { createOAuthState, verifyOAuthState } = await import("@/modules/auth/oauth-state");
      const { stateToken, nonce } = createOAuthState("CUSTOMER", "/dashboard");

      // Valid verification with matching cookie nonce
      const verified = verifyOAuthState(stateToken, nonce);
      expect(verified).not.toBeNull();
      expect(verified?.role).toBe("CUSTOMER");
      expect(verified?.returnTo).toBe("/dashboard");

      // 1. Tampered state token must fail
      const tampered = stateToken.slice(0, -4) + "XXXX";
      expect(verifyOAuthState(tampered, nonce)).toBeNull();

      // 2. Missing state token must fail
      expect(verifyOAuthState("", nonce)).toBeNull();

      // 3. Wrong nonce must fail
      expect(verifyOAuthState(stateToken, "wrong_nonce")).toBeNull();

      // 4. Missing nonce must fail
      expect(verifyOAuthState(stateToken, null)).toBeNull();
      expect(verifyOAuthState(stateToken, undefined)).toBeNull();
      expect(verifyOAuthState(stateToken, "")).toBeNull();

      // 5. Expired state token (>10 minutes old) must fail
      const nowSpy = vi.spyOn(Date, "now");
      const baseTime = 1_700_000_000_000;
      nowSpy.mockReturnValue(baseTime);
      const { stateToken: timedToken, nonce: timedNonce } = createOAuthState("SITTER", "/portal/sitter");
      // Advance 10 minutes + 1 second
      nowSpy.mockReturnValue(baseTime + 10 * 60 * 1000 + 1000);
      expect(verifyOAuthState(timedToken, timedNonce)).toBeNull();
      nowSpy.mockRestore();
    });

    it("clamps SUPER_ADMIN, OPERATIONS_ADMIN, and arbitrary roles to CUSTOMER in both OAuth state and self-service auth", async () => {
      const { createOAuthState, verifyOAuthState } = await import("@/modules/auth/oauth-state");
      const { sanitizeSelfServiceRole } = await import("@/modules/auth/mongodb-auth");

      const superAdminAttempt = createOAuthState("SUPER_ADMIN", "/admin");
      const verifiedSuper = verifyOAuthState(superAdminAttempt.stateToken, superAdminAttempt.nonce);
      expect(verifiedSuper?.role).toBe("CUSTOMER");

      const opsAdminAttempt = createOAuthState("OPERATIONS_ADMIN", "/admin");
      const verifiedOps = verifyOAuthState(opsAdminAttempt.stateToken, opsAdminAttempt.nonce);
      expect(verifiedOps?.role).toBe("CUSTOMER");

      const sitterAttempt = createOAuthState("SITTER", "/portal/sitter");
      const verifiedSitter = verifyOAuthState(sitterAttempt.stateToken, sitterAttempt.nonce);
      expect(verifiedSitter?.role).toBe("SITTER");

      expect(sanitizeSelfServiceRole("SUPER_ADMIN")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("OPERATIONS_ADMIN")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("FINANCE_ADMIN")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("SAFETY_ADMIN")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("VERIFICATION_ADMIN")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("CONTENT_ADMIN")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("CITY_MANAGER")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("PARTNER_MANAGER")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("SOCIETY_MANAGER")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("OPERATOR")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("CUSTOMER")).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole("SITTER")).toBe("SITTER");
      expect(sanitizeSelfServiceRole(undefined)).toBe("CUSTOMER");
      expect(sanitizeSelfServiceRole(null)).toBe("CUSTOMER");
    });

    it("rejects CRLF injection in email OTP requests", async () => {
      const { requestEmailOtp } = await import("@/modules/auth/mongodb-auth");
      await expect(requestEmailOtp("victim@example.com\r\nBcc: attacker@evil.com")).rejects.toThrow(
        /Invalid email format/i
      );
      await expect(requestEmailOtp("victim@example.com\r\n")).rejects.toThrow(
        /Invalid email format/i
      );
    });
  });
});


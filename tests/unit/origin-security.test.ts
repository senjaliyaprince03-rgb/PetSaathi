import { afterEach, describe, expect, it, vi } from "vitest";

import { isTrustedBrowserMutation } from "@/modules/security/origin";

function headersWith(entries: Record<string, string>): Headers {
  return new Headers(entries);
}

function withProduction() {
  vi.stubEnv("NODE_ENV", "production");
}

function withDevelopment() {
  vi.stubEnv("NODE_ENV", "development");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("browser mutation origin checks", () => {
  it("accepts same-host mutations and read requests", () => {
    withProduction();
    expect(isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "https://petsaathi.in")).toBe(true);
    expect(isTrustedBrowserMutation("GET", "https://petsaathi.in/api/pets", null)).toBe(true);
  });

  it("rejects missing, malformed and cross-site mutation origins", () => {
    withProduction();
    expect(isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", null)).toBe(false);
    expect(isTrustedBrowserMutation("PATCH", "https://petsaathi.in/api/pets", "not-a-url")).toBe(false);
    expect(isTrustedBrowserMutation("DELETE", "https://petsaathi.in/api/pets", "https://attacker.example")).toBe(false);
    expect(isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "http://petsaathi.in")).toBe(false);
    expect(isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "https://petsaathi.in.attacker.example")).toBe(false);
  });

  it("accepts localhost aliases on the same development port", () => {
    withDevelopment();
    expect(
      isTrustedBrowserMutation(
        "POST",
        "http://localhost:3110/api/pets",
        "http://127.0.0.1:3110",
      ),
    ).toBe(true);
    expect(
      isTrustedBrowserMutation(
        "POST",
        "http://localhost:3110/api/pets",
        "http://127.0.0.1:3111",
      ),
    ).toBe(false);
  });

  it("rejects loopback aliases in production", () => {
    withProduction();
    expect(
      isTrustedBrowserMutation(
        "POST",
        "http://localhost:3110/api/pets",
        "http://127.0.0.1:3110",
      ),
    ).toBe(false);
  });

  it("accepts the real Host header when request.url is rewritten by middleware", () => {
    withProduction();
    expect(
      isTrustedBrowserMutation(
        "POST",
        "http://localhost:3110/api/auth/password/signin",
        "http://127.0.0.1:3110",
        headersWith({ host: "127.0.0.1:3110" }),
      ),
    ).toBe(true);
  });

  it("accepts proxy-forwarded host and protocol only behind TRUST_PROXY_HEADERS", () => {
    withProduction();
    const args = [
      "POST",
      "http://internal-upstream:3000/api/bookings",
      "https://petsaathi.in",
      headersWith({ "x-forwarded-host": "petsaathi.in", "x-forwarded-proto": "https" }),
    ] as const;
    expect(isTrustedBrowserMutation(...args)).toBe(false);
    vi.stubEnv("TRUST_PROXY_HEADERS", "1");
    expect(isTrustedBrowserMutation(...args)).toBe(true);
  });

  it("rejects forged forwarded headers that do not match Origin", () => {
    withProduction();
    expect(
      isTrustedBrowserMutation(
        "POST",
        "http://internal-upstream:3000/api/bookings",
        "https://attacker.example",
        headersWith({ "x-forwarded-host": "attacker.example", "x-forwarded-proto": "https" }),
      ),
    ).toBe(false);
    vi.stubEnv("TRUST_PROXY_HEADERS", "1");
    expect(
      isTrustedBrowserMutation(
        "POST",
        "http://internal-upstream:3000/api/bookings",
        "https://attacker.example",
        headersWith({ "x-forwarded-host": "attacker.example", "x-forwarded-proto": "https" }),
      ),
    ).toBe(true);
  });

  it("accepts configured TRUSTED_ORIGINS entries and rejects others", () => {
    withProduction();
    vi.stubEnv("TRUSTED_ORIGINS", "https://preview.petsaathi.in, https://staging.petsaathi.in/");
    expect(
      isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "https://preview.petsaathi.in"),
    ).toBe(true);
    expect(
      isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "https://staging.petsaathi.in"),
    ).toBe(true);
    expect(
      isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "https://evil.petsaathi.in"),
    ).toBe(false);
  });

  it("ignores malformed TRUSTED_ORIGINS entries without crashing", () => {
    withProduction();
    vi.stubEnv("TRUSTED_ORIGINS", "not-a-url, https://valid.example");
    expect(
      isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "https://valid.example"),
    ).toBe(true);
    expect(
      isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "https://petsaathi.in"),
    ).toBe(true);
  });
});

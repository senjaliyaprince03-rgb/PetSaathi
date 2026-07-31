import { describe, expect, it } from "vitest";

import { isTrustedBrowserMutation } from "@/modules/security/origin";

describe("browser mutation origin checks", () => {
  it("accepts same-host mutations and read requests", () => {
    expect(isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "https://petsaathi.in")).toBe(true);
    expect(isTrustedBrowserMutation("GET", "https://petsaathi.in/api/pets", null)).toBe(true);
  });

  it("rejects missing, malformed and cross-site mutation origins", () => {
    expect(isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", null)).toBe(false);
    expect(isTrustedBrowserMutation("PATCH", "https://petsaathi.in/api/pets", "not-a-url")).toBe(false);
    expect(isTrustedBrowserMutation("DELETE", "https://petsaathi.in/api/pets", "https://attacker.example")).toBe(false);
    expect(isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "http://petsaathi.in")).toBe(false);
    expect(isTrustedBrowserMutation("POST", "https://petsaathi.in/api/pets", "https://petsaathi.in.attacker.example")).toBe(false);
  });

  it("accepts localhost aliases on the same development port", () => {
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
});

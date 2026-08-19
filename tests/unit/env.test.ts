import { afterEach, describe, expect, it } from "vitest";

import { readServerEnv } from "@/lib/env";

const originalNodeEnv = process.env.NODE_ENV;
const originalFixedOtp = process.env.AUTH_DEV_FIXED_OTP;
const mutableEnv = process.env as Record<string, string | undefined>;

afterEach(() => {
  if (originalNodeEnv === undefined) delete mutableEnv.NODE_ENV;
  else mutableEnv.NODE_ENV = originalNodeEnv;

  if (originalFixedOtp === undefined) delete mutableEnv.AUTH_DEV_FIXED_OTP;
  else mutableEnv.AUTH_DEV_FIXED_OTP = originalFixedOtp;
});

describe("server environment validation", () => {
  it("rejects the development OTP when running in production", () => {
    mutableEnv.NODE_ENV = "production";
    mutableEnv.AUTH_DEV_FIXED_OTP = "123456";

    expect(() => readServerEnv()).toThrow(/AUTH_DEV_FIXED_OTP/);
  });

  it("allows the fixed OTP only in development", () => {
    mutableEnv.NODE_ENV = "development";
    mutableEnv.AUTH_DEV_FIXED_OTP = "123456";

    expect(readServerEnv().AUTH_DEV_FIXED_OTP).toBe("123456");
  });
});

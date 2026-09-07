import { z } from "zod";

const serverSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().default(3000),
  DATABASE_URL: z.string().optional(),
  MONGODB_URI: z.string().regex(/^mongodb(?:\+srv)?:\/\//).optional(),
  MONGODB_PRISMA_URI: z.string().regex(/^mongodb:\/\//).optional(),
  MONGODB_DATABASE: z.string().regex(/^[A-Za-z0-9_-]+$/).optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  AUTH_SESSION_DAYS: z.coerce.number().int().min(1).max(90).default(30),
  AUTH_DEV_FIXED_OTP: z.string().regex(/^\d{6}$/).optional(),
  UPLOAD_SIGNING_SECRET: z.string().min(32).optional(),
  SMS_OTP_WEBHOOK_URL: z.string().url().optional(),
  SMS_OTP_WEBHOOK_SECRET: z.string().min(32).optional(),
  RAZORPAY_KEY_SECRET: z.string().min(1).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1).optional(),
  NVIDIA_API_KEY: z.string().min(1).optional(),
  NVIDIA_BASE_URL: z.string().url().default("https://integrate.api.nvidia.com/v1"),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  RESEND_REQUEST_TIMEOUT_MS: z.coerce.number().int().min(1_000).max(30_000).default(8_000),
  WHATSAPP_ACCESS_TOKEN: z.string().min(1).optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(1).optional(),
  WHATSAPP_BUSINESS_ACCOUNT_ID: z.string().min(1).optional(),
  CRON_SECRET: z.string().min(32).optional(),
  SCANNER_CALLBACK_SECRET: z.string().min(32).optional(),
  TRACKING_RETENTION_DAYS: z.coerce.number().int().min(1).max(365).default(30),
  SENTRY_AUTH_TOKEN: z.string().min(1).optional(),
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().min(1).optional(),
  SENTRY_PROJECT: z.string().min(1).optional(),
  REQUIRED_SITTER_VERIFICATIONS: z.string().min(1).optional(),
  REQUIRED_SITTER_TRAINING_MODULES: z.string().min(1).optional()
}).superRefine((values, context) => {
  // Fail closed if a development-only OTP leaks into a production process.
  if (values.NODE_ENV === "production" && values.AUTH_DEV_FIXED_OTP) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["AUTH_DEV_FIXED_OTP"],
      message: "AUTH_DEV_FIXED_OTP must be absent when NODE_ENV is production.",
    });
  }
  // A loopback public URL in production silently poisons sitemap, robots,
  // canonical tags and JSON-LD. Warn loudly instead of failing startup so
  // local production-mode testing still works.
  if (values.NODE_ENV === "production" && process.env.NEXT_PUBLIC_APP_URL && /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/.test(process.env.NEXT_PUBLIC_APP_URL)) {
    console.warn(
      "[env] NEXT_PUBLIC_APP_URL points at a loopback address in production. " +
        "Sitemap, robots, canonical tags and JSON-LD will reference this URL. " +
        "Set the real deployment origin before public release.",
    );
  }
});

const publicSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://127.0.0.1:3110"),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_MAP_PROVIDER: z.enum(["mappls", "google", "disabled", "openstreetmap", "mapbox"]).default("disabled"),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().min(1).optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SOCIAL_X_URL: z.string().url().optional(),
  NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL: z.string().url().optional(),
  NEXT_PUBLIC_SOCIAL_FACEBOOK_URL: z.string().url().optional(),
  NEXT_PUBLIC_SOCIAL_LINKEDIN_URL: z.string().url().optional()
});

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  NEXT_PUBLIC_MAP_PROVIDER: process.env.NEXT_PUBLIC_MAP_PROVIDER,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  NEXT_PUBLIC_SOCIAL_X_URL: process.env.NEXT_PUBLIC_SOCIAL_X_URL,
  NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL,
  NEXT_PUBLIC_SOCIAL_FACEBOOK_URL: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK_URL,
  NEXT_PUBLIC_SOCIAL_LINKEDIN_URL: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN_URL
});

export function readServerEnv() {
  return serverSchema.parse(process.env);
}

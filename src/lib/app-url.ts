import { publicEnv } from "@/lib/env";

export function getCanonicalBaseUrl(): string {
  const envUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    publicEnv.NEXT_PUBLIC_APP_URL;

  if (process.env.NODE_ENV === "production" && envUrl && envUrl.includes("petsaathi.vercel.app")) {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL;
    }
    return "https://petsaathi-blue.vercel.app";
  }

  if (envUrl && !envUrl.startsWith("http://127.0.0.1") && !envUrl.startsWith("http://localhost")) {
    return envUrl.replace(/\/+$/, "");
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return "https://" + process.env.VERCEL_PROJECT_PRODUCTION_URL;
  }

  if (process.env.VERCEL_URL) {
    return "https://" + process.env.VERCEL_URL;
  }

  return (envUrl || "https://petsaathi-blue.vercel.app").replace(/\/+$/, "");
}

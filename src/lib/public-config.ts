export function hasUsableSentryDsn(dsn: string | undefined) {
  return Boolean(dsn && !dsn.includes("your-dsn@") && !dsn.includes("example"));
}

export function isSentryEnabled(
  dsn: string | undefined,
  environment: string | undefined = process.env.NODE_ENV,
) {
  if (!hasUsableSentryDsn(dsn)) {
    return false;
  }

  const normalizedEnvironment = (environment ?? "development").toLowerCase();
  const isLocalEnvironment = ["development", "test", "local"].includes(normalizedEnvironment);
  const explicitOptIn =
    process.env.NEXT_PUBLIC_SENTRY_ENABLE === "true" || process.env.SENTRY_ENABLE === "true";

  return !isLocalEnvironment || explicitOptIn;
}

export function hasUsableAnalyticsId(value: string | undefined) {
  const normalized = value?.trim();
  return Boolean(
    normalized &&
      /^G-[A-Z0-9]+$/i.test(normalized) &&
      !/(placeholder|your[_ -]?value|12345abcd)/i.test(normalized),
  );
}

export function hasUsableGoogleClientId(value: string | undefined) {
  const normalized = value?.trim();
  return Boolean(
    normalized &&
      /^[0-9]+-[a-z0-9_-]+\.apps\.googleusercontent\.com$/i.test(normalized) &&
      !normalized.toLowerCase().includes("placeholder"),
  );
}

export function getAppBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl && envUrl.trim().length > 0) {
    let url = envUrl.trim().replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }
    return url;
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (vercelUrl && vercelUrl.trim().length > 0) {
    return `https://${vercelUrl.trim().replace(/\/+$/, "")}`;
  }

  return "http://localhost:3000";
}

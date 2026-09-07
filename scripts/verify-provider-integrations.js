/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("node:path");

const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true, quiet: true });

const checks = [];
const timeoutMs = Number(process.env.PROVIDER_DOCTOR_TIMEOUT_MS ?? 10_000);

// Providers listed here are provisioned with credentials but NOT wired into
// application code yet. Transactional/auth email actually goes through Gmail
// SMTP (nodemailer) — see src/modules/auth/mongodb-auth.ts and
// src/modules/notifications/providers.ts. The src/lib/email/* files are
// logging stubs with "In a real implementation" comments referencing Resend.
// Invalid credentials for an unwired provider must not block the doctor, but
// they are surfaced loudly so nobody mistakes them for healthy.
const OPTIONAL_UNWIRED_PROVIDERS = new Set(["resend"]);

function isPlaceholder(value) {
  return !value || /(?:example|placeholder|your[_ -]?|xxx|generate_a_random)/i.test(value);
}

function push(name, status, detail, metadata = {}) {
  checks.push({ name, status, detail, ...metadata });
}

function redactError(error) {
  const message = error instanceof Error ? error.message : String(error);
  return message
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/Basic\s+[A-Za-z0-9._~+/=-]+/gi, "Basic [REDACTED]")
    .slice(0, 400);
}

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function safeResponseDetail(response) {
  const text = await response.text().catch(() => "");
  if (!text) return `HTTP ${response.status}`;
  return `HTTP ${response.status}: ${text
    .replace(/["']?(?:key|token|secret|authorization)["']?\s*:\s*["'][^"']+["']/gi, '"credential":"[REDACTED]"')
    .slice(0, 240)}`;
}

async function checkResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim();
  const optional = OPTIONAL_UNWIRED_PROVIDERS.has("resend");
  const note = optional
    ? " Resend is not imported by application code (email uses SMTP_USER/SMTP_PASS via nodemailer), so this is reported as a warning, not a blocker."
    : "";
  if (isPlaceholder(apiKey) || isPlaceholder(fromEmail)) {
    push("resend", optional ? "skipped" : "failed", `RESEND_API_KEY and RESEND_FROM_EMAIL must be real production or sandbox values.${note}`);
    return;
  }
  if (fromEmail.toLowerCase().endsWith("@resend.dev")) {
    push("resend", optional ? "warning" : "failed", `RESEND_FROM_EMAIL uses Resend's shared test sender; configure a verified custom sender domain.${note}`);
    return;
  }

  try {
    const response = await fetchWithTimeout("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) {
      push("resend", optional ? "warning" : "failed", `Resend domain check returned ${await safeResponseDetail(response)}.${note}`);
      return;
    }
    const body = await response.json();
    const domains = Array.isArray(body?.data) ? body.data : [];
    const senderDomain = fromEmail.split("@").pop()?.toLowerCase();
    const matchingDomain = domains.find((domain) => String(domain.name).toLowerCase() === senderDomain);
    if (!matchingDomain) {
      push("resend", optional ? "warning" : "failed", `No Resend domain matches RESEND_FROM_EMAIL domain ${senderDomain}.${note}`);
      return;
    }
    const status = String(matchingDomain.status ?? "").toLowerCase();
    if (status && status !== "verified") {
      push("resend", optional ? "warning" : "failed", `Resend domain ${senderDomain} is not verified; current status is ${status}.${note}`);
      return;
    }
    push("resend", "passed", `Verified sender domain ${senderDomain} is visible to the API key.`);
  } catch (error) {
    push("resend", optional ? "warning" : "failed", `Resend verification failed: ${redactError(error)}${note}`);
  }
}

async function checkSmtpEmail() {
  // This is the delivery path actually used by auth OTP emails and
  // notification messages. Presence-only check: real delivery can only be
  // exercised by the live OTP flow.
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  if (isPlaceholder(user) || isPlaceholder(pass)) {
    push("smtp-email", "failed", "SMTP_USER and SMTP_PASS must be configured — auth OTP and notification emails are delivered through this provider.");
    return;
  }
  push("smtp-email", "passed", `SMTP credentials configured for sender identity ${user.replace(/^(.).*(@.*)$/, "$1***$2")} (delivery exercised by the live OTP flow).`);
}

async function checkSentry() {
  const token = process.env.SENTRY_AUTH_TOKEN?.trim();
  const org = process.env.SENTRY_ORG?.trim();
  const project = process.env.SENTRY_PROJECT?.trim();
  const baseUrl = process.env.SENTRY_BASE_URL?.trim() || "https://sentry.io";
  if (isPlaceholder(token) || isPlaceholder(org) || isPlaceholder(project)) {
    push("sentry", "failed", "SENTRY_AUTH_TOKEN, SENTRY_ORG, and SENTRY_PROJECT must be configured.");
    return;
  }

  const url = new URL(`/api/0/projects/${encodeURIComponent(org)}/${encodeURIComponent(project)}/issues/`, baseUrl);
  url.searchParams.set("statsPeriod", "24h");
  url.searchParams.set("environment", process.env.SENTRY_ENVIRONMENT?.trim() || "prod");
  url.searchParams.set("query", "is:unresolved");
  url.searchParams.set("per_page", "1");

  try {
    const response = await fetchWithTimeout(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) {
      push("sentry", "failed", `Sentry issue check returned ${await safeResponseDetail(response)}.`);
      return;
    }
    push("sentry", "passed", `Read access confirmed for ${org}/${project}.`);
  } catch (error) {
    push("sentry", "failed", `Sentry verification failed: ${redactError(error)}`);
  }
}

async function checkRazorpay() {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (isPlaceholder(keyId) || isPlaceholder(keySecret) || isPlaceholder(webhookSecret)) {
    push("razorpay", "failed", "Razorpay key ID, key secret, and webhook secret must be configured.");
    return;
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetchWithTimeout("https://api.razorpay.com/v1/orders?count=1", {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!response.ok) {
      push("razorpay", "failed", `Razorpay orders read check returned ${await safeResponseDetail(response)}.`);
      return;
    }
    push("razorpay", "passed", "Razorpay Orders API read access confirmed.");
  } catch (error) {
    push("razorpay", "failed", `Razorpay verification failed: ${redactError(error)}`);
  }
}

async function checkNvidia() {
  const apiKey = process.env.NVIDIA_API_KEY?.trim();
  const baseUrl = process.env.NVIDIA_BASE_URL?.trim() || "https://integrate.api.nvidia.com/v1";
  if (isPlaceholder(apiKey)) {
    push("nvidia", "failed", "NVIDIA_API_KEY must be configured.");
    return;
  }

  try {
    const response = await fetchWithTimeout(`${baseUrl.replace(/\/$/, "")}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!response.ok) {
      push("nvidia", "failed", `NVIDIA model-list check returned ${await safeResponseDetail(response)}.`);
      return;
    }
    const body = await response.json();
    const count = Array.isArray(body?.data) ? body.data.length : 0;
    push("nvidia", "passed", `NVIDIA model discovery returned ${count} models.`);
  } catch (error) {
    push("nvidia", "failed", `NVIDIA verification failed: ${redactError(error)}`);
  }
}

async function main() {
  await Promise.all([checkResend(), checkSmtpEmail(), checkSentry(), checkRazorpay(), checkNvidia()]);
  const failures = checks.filter((check) => check.status === "failed");
  console.log(JSON.stringify({
    status: failures.length === 0 ? "ok" : "failed",
    checks,
  }, null, 2));
  if (failures.length > 0) process.exitCode = 1;
}

main().catch((error) => {
  console.error(JSON.stringify({ status: "failed", error: redactError(error) }));
  process.exitCode = 1;
});

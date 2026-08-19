/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("node:path");

const dotenv = require("dotenv");
const { MongoClient } = require("mongodb");
const dns = require("node:dns");

try { dns.setServers(["8.8.8.8", "8.8.4.4"]); } catch (e) {}

dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), ".env.local"), override: true, quiet: true });

const productionCheck = process.argv.includes("--production");
const failures = [];
const warnings = [];

function requireValue(name, minimumLength = 1) {
  const value = process.env[name]?.trim();
  if (!value || value.length < minimumLength) {
    failures.push(`${name} is missing or shorter than ${minimumLength} characters.`);
  }
  return value;
}

function isPlaceholderValue(value) {
  return /(?:your[_ -]?domain|example\.com|placeholder)/i.test(value);
}

async function verify() {
  const uri = requireValue("MONGODB_URI");
  const databaseName = requireValue("MONGODB_DATABASE");
  requireValue("AUTH_SECRET", 32);
  requireValue("UPLOAD_SIGNING_SECRET", 32);

  if (!uri || !databaseName) return;

  let client;
  try {
    // MongoClient accepts both Atlas SRV URIs and direct multi-host seed lists.
    client = new MongoClient(uri, {
      appName: "PetSaathiSetupVerifier",
      serverSelectionTimeoutMS: 8_000,
      connectTimeoutMS: 8_000,
    });
  } catch {
    failures.push("MONGODB_URI is not a valid MongoDB connection string.");
    return;
  }

  const uriDatabase = client.options.dbName?.trim() ?? "";
  if (!uriDatabase) failures.push("MONGODB_URI must include the database path.");
  if (uriDatabase && uriDatabase !== databaseName) {
    failures.push("MONGODB_URI database path does not match MONGODB_DATABASE.");
  }

  const developmentOtp = process.env.AUTH_DEV_FIXED_OTP?.trim();
  if (developmentOtp && !/^\d{6}$/.test(developmentOtp)) {
    failures.push("AUTH_DEV_FIXED_OTP must contain exactly six digits.");
  }

  const resendKey = process.env.RESEND_API_KEY?.trim();
  const resendFrom = process.env.RESEND_FROM_EMAIL?.trim();
  const placeholderResendKey = Boolean(resendKey && /(?:your[_ -]?actual|placeholder|example|xxx)/i.test(resendKey));
  const placeholderSender = Boolean(resendFrom && isPlaceholderValue(resendFrom));
  if (!resendKey || !resendFrom) {
    warnings.push("Email OTP delivery is not configured; localhost requires AUTH_DEV_FIXED_OTP.");
  } else if (placeholderResendKey) {
    warnings.push("RESEND_API_KEY is a placeholder and cannot be used for production email.");
  } else if (resendFrom.toLowerCase().endsWith("@resend.dev")) {
    warnings.push("RESEND_FROM_EMAIL uses Resend's shared test sender and cannot serve arbitrary production users.");
  } else if (placeholderSender) {
    warnings.push("RESEND_FROM_EMAIL is a placeholder and cannot be used for production email.");
  }

  if (productionCheck) {
    const publicUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
    if (!publicUrl?.startsWith("https://")) failures.push("Production NEXT_PUBLIC_APP_URL must use HTTPS.");
    if (developmentOtp) failures.push("AUTH_DEV_FIXED_OTP must be absent from production secrets.");
    if (!resendKey || placeholderResendKey || !resendFrom || resendFrom.toLowerCase().endsWith("@resend.dev") || placeholderSender) {
      failures.push("Production email OTP requires a verified custom Resend sender domain.");
    }
  }

  try {
    await client.connect();
    const database = client.db(databaseName);
    await database.command({ ping: 1 });

    const collectionNames = new Set(
      (await database.listCollections({}, { nameOnly: true }).toArray()).map(({ name }) => name),
    );
    const requiredCollections = [
      "users",
      "user_roles",
      "customer_profiles",
      "auth_credentials",
      "auth_challenges",
      "auth_sessions",
    ];
    for (const collection of requiredCollections) {
      if (!collectionNames.has(collection)) failures.push(`Required collection ${collection} is missing.`);
    }

    const requiredIndexes = [
      ["auth_challenges", "auth_challenges_ttl"],
      ["auth_sessions", "auth_sessions_ttl"],
      ["auth_credentials", "auth_credentials_user"],
    ];
    for (const [collection, indexName] of requiredIndexes) {
      if (!collectionNames.has(collection)) continue;
      const indexes = await database.collection(collection).indexes();
      if (!indexes.some(({ name }) => name === indexName)) {
        failures.push(`Required index ${collection}.${indexName} is missing.`);
      }
    }
  } catch (error) {
    failures.push(`MongoDB verification failed: ${error instanceof Error ? error.message : "unknown error"}`);
  } finally {
    await client.close();
  }
}

verify()
  .then(() => {
    console.log(JSON.stringify({
      status: failures.length === 0 ? "ok" : "failed",
      mode: productionCheck ? "production" : "development",
      checks: {
        mongodb: failures.some((message) => message.startsWith("MongoDB")) ? "failed" : "passed",
        authConfiguration: failures.some((message) => message.includes("AUTH_")) ? "failed" : "passed",
      },
      warnings,
      failures,
    }, null, 2));
    if (failures.length > 0) process.exitCode = 1;
  })
  .catch((error) => {
    console.error(JSON.stringify({ status: "failed", error: error instanceof Error ? error.message : "unknown error" }));
    process.exitCode = 1;
  });

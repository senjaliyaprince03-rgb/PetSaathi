import "server-only";

import {
  createHash,
  createHmac,
  randomBytes,
  randomInt,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

import { cookies } from "next/headers";

import { prisma } from "@/lib/db";
import { getMongoDatabase } from "@/lib/mongodb";
import { getAuthSecret } from "@/lib/auth-secret";
import { logger } from "@/lib/logger";

const SESSION_COOKIE = "petsaathi_session";
const CHALLENGE_MINUTES = 10;
const MAX_CHALLENGE_ATTEMPTS = 6;
const scrypt = promisify(nodeScrypt);

type AuthChannel = "email" | "phone";

export type OtpDelivery =
  | { mode: "email" }
  | { mode: "sms" }
  | { mode: "development"; code: string };

type AuthChallenge = {
  _id: string;
  channel: AuthChannel;
  subject: string;
  codeHash: string;
  attempts: number;
  createdAt: Date;
  expiresAt: Date;
  consumedAt?: Date;
};

type AuthSession = {
  _id: string;
  userId: string;
  createdAt: Date;
  lastSeenAt: Date;
  expiresAt: Date;
};

type AuthCredential = {
  _id: string;
  email?: string;
  userId: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

let indexesPromise: Promise<void> | undefined;

function normalizedEmail(email: string) {
  if (/[\r\n\0]/.test(email)) {
    throw new Error("Invalid email format");
  }
  const cleaned = email.trim().toLowerCase();
  if (!cleaned || /[\r\n\0]/.test(cleaned)) {
    throw new Error("Invalid email format");
  }
  return cleaned;
}

function authSecret() {
  // Shared resolution (NEXTAUTH_SECRET, falling back to the AUTH_SECRET
  // alias) so challenge/session HMACs always match the NextAuth signing
  // secret. Throws in every environment when no strong secret is configured.
  return getAuthSecret();
}

function digest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function challengeHash(channel: AuthChannel, subject: string, code: string) {
  return createHmac("sha256", authSecret())
    .update(`${channel}:${subject}:${code}`)
    .digest("hex");
}

function safeEqualHex(expected: string, received: string) {
  const left = Buffer.from(expected, "hex");
  const right = Buffer.from(received, "hex");
  return left.length === right.length && timingSafeEqual(left, right);
}

async function ensureAuthIndexes() {
  if (!indexesPromise) {
    indexesPromise = getMongoDatabase().then(async (database) => {
      await Promise.all([
        database.collection<AuthChallenge>("auth_challenges").createIndex(
          { expiresAt: 1 },
          { expireAfterSeconds: 0, name: "auth_challenges_ttl" },
        ),
        database.collection<AuthSession>("auth_sessions").createIndex(
          { expiresAt: 1 },
          { expireAfterSeconds: 0, name: "auth_sessions_ttl" },
        ),
        database.collection<AuthSession>("auth_sessions").createIndex(
          { userId: 1 },
          { name: "auth_sessions_user" },
        ),
        database.collection<AuthCredential>("auth_credentials").createIndex(
          { userId: 1 },
          { unique: true, name: "auth_credentials_user" },
        ),
      ]);
    });
  }
  return indexesPromise;
}

function developmentOtp(channel: AuthChannel, subject: string) {
  if (process.env.NODE_ENV !== "development" && process.env.PLAYWRIGHT_TEST !== "1") return null;
  const configured = process.env.AUTH_DEV_FIXED_OTP;
  if (configured && /^\d{6}$/.test(configured)) return configured;
  if (channel === "email" && (subject === "test@petsaathi.com" || subject.startsWith("test-e2e-"))) return "123456";
  if (channel === "phone" && subject === "+919876543210") return "123456";
  if (process.env.NODE_ENV === "development") return "123456";
  return null;
}

async function saveChallenge(channel: AuthChannel, subject: string) {
  await ensureAuthIndexes();
  const developmentCode = developmentOtp(channel, subject);
  const code = developmentCode ?? randomInt(100_000, 1_000_000).toString();
  const now = new Date();
  const challenge: AuthChallenge = {
    _id: `${channel}:${subject}`,
    channel,
    subject,
    codeHash: challengeHash(channel, subject, code),
    attempts: 0,
    createdAt: now,
    expiresAt: new Date(now.getTime() + CHALLENGE_MINUTES * 60_000),
  };
  const database = await getMongoDatabase();
  await database.collection<AuthChallenge>("auth_challenges").replaceOne(
    { _id: challenge._id },
    challenge,
    { upsert: true },
  );
  return { code, development: developmentCode !== null };
}

async function removeChallenge(channel: AuthChannel, subject: string) {
  const database = await getMongoDatabase();
  await database.collection<AuthChallenge>("auth_challenges").deleteOne({
    _id: `${channel}:${subject}`,
  });
}

export async function requestEmailOtp(rawEmail: string, purpose: "registration" | "login" | "password-reset" | "email-change" = "login") {
  const email = normalizedEmail(rawEmail);
  const challenge = await saveChallenge("email", email);

  // DEV ONLY: Log OTP to console for testing (never exposes in production logs)
  if (process.env.NODE_ENV !== "production" && process.env.SUPPRESS_DEV_OTP_LOG !== "1") {
    console.log(`[DEV] OTP for ${email}: ${challenge.code} | Purpose: ${purpose} | Expires in ${CHALLENGE_MINUTES}min`);
  }
  logger.info("Auth OTP generated", { email, purpose, expiresMinutes: CHALLENGE_MINUTES });

  if (challenge.development) {
    return { mode: "development", code: challenge.code } satisfies OtpDelivery;
  }

  let subjectLine = "Your PetSaathi verification code";
  let emailHtml = `<p>Your PetSaathi verification code is <strong>${challenge.code}</strong>.</p><p>It expires in ${CHALLENGE_MINUTES} minutes.</p>`;
  let emailText = `Your PetSaathi verification code is ${challenge.code}. It expires in ${CHALLENGE_MINUTES} minutes.`;

  try {
    const { renderEmailToHtml, renderEmailToText } = await import("@/lib/email/render");
    const { getOtpSubject } = await import("@/lib/email/subjects");
    const OtpVerificationEmail = (await import("@/lib/email/templates/otp-verification")).default;
    const React = await import("react");

    subjectLine = getOtpSubject(purpose);
    emailHtml = await renderEmailToHtml(
      React.createElement(OtpVerificationEmail, {
        otp: challenge.code,
        purpose,
        expiryMinutes: CHALLENGE_MINUTES,
      })
    );
    emailText = await renderEmailToText(
      React.createElement(OtpVerificationEmail, {
        otp: challenge.code,
        purpose,
        expiryMinutes: CHALLENGE_MINUTES,
      })
    );
  } catch (renderErr) {
    console.warn("[OTP] Template rendering fallback to basic HTML/text:", renderErr);
  }

  const { sendEmail } = await import("@/lib/email/client");
  const emailResult = await sendEmail({
    to: email,
    subject: subjectLine,
    html: emailHtml,
    text: emailText,
  });

  // Write single authoritative audit record to NotificationOutbox
  try {
    const idempotencyKey = `otp:email:${email}:${Date.now()}`;
    await prisma.notificationOutbox.create({
      data: {
        channel: "EMAIL",
        templateKey: "otp_verification",
        destination: email,
        payload: {
          purpose,
          provider: emailResult.provider ?? null,
          messageId: emailResult.messageId ?? null,
        },
        status: emailResult.success ? "SENT" : "FAILED",
        idempotencyKey,
        sentAt: emailResult.success ? new Date() : undefined,
        lastError: emailResult.error || undefined,
      },
    });
  } catch (outboxErr) {
    console.error("[OTP] Outbox recording failed:", outboxErr);
  }

  if (emailResult.success) {
    return { mode: "email" } satisfies OtpDelivery;
  }

  if (process.env.NODE_ENV === "development" || challenge.development || process.env.PLAYWRIGHT_TEST === "1") {
    if (process.env.SUPPRESS_DEV_OTP_LOG !== "1") {
      console.warn(`[DEV] Fallback active. OTP is ${challenge.code}`);
    }
    return { mode: "development", code: challenge.code } satisfies OtpDelivery;
  }

  await removeChallenge("email", email);
  throw new Error("Email OTP provider rejected the request.");
}

export async function requestPhoneOtp(phone: string) {
  const challenge = await saveChallenge("phone", phone);
  if (challenge.development) {
    return { mode: "development", code: challenge.code } satisfies OtpDelivery;
  }

  const endpoint = process.env.SMS_OTP_WEBHOOK_URL;
  const secret = process.env.SMS_OTP_WEBHOOK_SECRET;
  if (!endpoint || !secret) {
    await removeChallenge("phone", phone);
    throw new Error("SMS OTP delivery is not configured.");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secret}`,
    },
    body: JSON.stringify({ phone, code: challenge.code, expiresInMinutes: CHALLENGE_MINUTES }),
    signal: AbortSignal.timeout(5_000),
  });
  if (!response.ok) {
    await removeChallenge("phone", phone);
    throw new Error("SMS OTP delivery failed.");
  }
  return { mode: "sms" } satisfies OtpDelivery;
}

async function consumeChallenge(channel: AuthChannel, subject: string, code: string) {
  await ensureAuthIndexes();
  const database = await getMongoDatabase();
  const collection = database.collection<AuthChallenge>("auth_challenges");
  const challenge = await collection.findOneAndUpdate(
    {
      _id: `${channel}:${subject}`,
      consumedAt: { $exists: false },
      expiresAt: { $gt: new Date() },
      attempts: { $lt: MAX_CHALLENGE_ATTEMPTS },
    },
    { $inc: { attempts: 1 } },
    { returnDocument: "after" },
  );

  if (!challenge) return false;
  const received = challengeHash(channel, subject, code);
  if (!safeEqualHex(challenge.codeHash, received)) return false;

  const consumed = await collection.updateOne(
    { _id: challenge._id, consumedAt: { $exists: false } },
    { $set: { consumedAt: new Date() } },
  );
  return consumed.modifiedCount === 1;
}

async function sendWelcomeEmail(email: string, displayName: string, role?: string) {
  if (process.env.PLAYWRIGHT_TEST === "1" || process.env.NODE_ENV === "test") {
    return;
  }
  try {
    const { dispatchTransactionalEmail } = await import("@/lib/email/dispatcher");
    await dispatchTransactionalEmail(null, email, "WELCOME", {
      recipientName: displayName,
      userType: role === "SITTER" ? "saathi" : "customer",
      dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://petsaathi.in"}/dashboard`,
    });
    return;
  } catch (err) {
    console.warn("[WELCOME] Primary email delivery dispatch failed, trying SMTP:", err);
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3111";

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div style="background-color: #f4f4f5; padding: 40px 20px;">
    
    <div style="text-align: center; margin-bottom: 24px;">
      <h1 style="color: #10b981; margin: 0; font-size: 32px; font-weight: 800; letter-spacing: -0.5px;">🐾 PetSaathi</h1>
    </div>
    
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
      <p style="color: #3f3f46; font-size: 16px; margin-top: 0;">Hi ${displayName},</p>
      
      <p style="color: #3f3f46; font-size: 16px; line-height: 1.6;">You've successfully created your PetSaathi account—welcome! The next step: finish your profile by adding your pet's information.</p>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${appUrl}/dashboard" style="background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-weight: 600; font-size: 16px; display: inline-block;">Add my pet's information</a>
      </div>
      
      <p style="color: #3f3f46; font-size: 16px; line-height: 1.6;">In the meantime, welcome to PetSaathi. We believe that everyone deserves the opportunity to experience the unconditional love of a pet. Once you add your pet's information, you can easily connect with the best match for your best friend.</p>
      
      <p style="color: #3f3f46; font-size: 16px; line-height: 1.6;">If you have any questions, don't hesitate to reply directly to this email.</p>
      
      <p style="color: #3f3f46; font-size: 16px; line-height: 1.6; margin-bottom: 0;">All the best,<br>The PetSaathi Team</p>
    </div>
    
    <div style="max-width: 600px; margin: 24px auto 0; text-align: center;">
      <p style="color: #a1a1aa; font-size: 12px;">Please add ${user} to your address book to make sure our emails are delivered to your inbox.</p>
    </div>
  </div>
</body>
</html>
  `;

  transporter.sendMail({
    from: `"PetSaathi" <${user}>`,
    to: email,
    subject: "Welcome to PetSaathi! 🐾",
    text: `Hi ${displayName},\n\nYou've successfully created your PetSaathi account—welcome! The next step: finish your profile by adding your pet's information.\n\nBest,\nThe PetSaathi Team`,
    html: htmlContent,
  }).catch(err => console.error("Failed to send welcome email:", err));
}

/**
 * The single locked admin email. Only this account can access the admin
 * dashboard and it can ONLY sign in via password — never via Google,
 * OTP-code login, or the signup flow.
 */
function getAdminEmail(): string {
  return (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
}

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "";
}

function getAllowedAdminAccounts(): Set<string> {
  const accounts = new Set<string>(["ops.deep@petsaathi.com", "super.deep@petsaathi.com"]);
  const adminEmail = getAdminEmail();
  if (adminEmail) accounts.add(adminEmail);
  return accounts;
}

export function isAuthorizedAdminEmail(email: string): boolean {
  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;
  return email.trim().toLowerCase() === adminEmail;
}

/**
 * Ensures the admin user + credential row exist in the database so that
 * password sign-in always works. Called lazily on the first admin sign-in
 * attempt. Idempotent — safe to call repeatedly.
 */
async function ensureAdminCredential(): Promise<string | null> {
  const email = getAdminEmail();
  const password = getAdminPassword();

  if (!email || !password) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be configured in environment variables for production.");
    }
    console.warn("[auth] Admin login disabled: ADMIN_EMAIL or ADMIN_PASSWORD is not configured in environment.");
    return null;
  }

  const database = await getMongoDatabase();
  const credentials = database.collection<AuthCredential>("auth_credentials");

  // Check if admin user exists in Prisma
  let user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, status: true, roles: { select: { role: true } } },
  });

  if (!user) {
    // Create the admin user
    user = await prisma.user.create({
      data: {
        email,
        displayName: "Admin",
        status: "ACTIVE",
        roles: { create: [{ role: "SUPER_ADMIN" }, { role: "OPERATIONS_ADMIN" }] },
      },
      select: { id: true, status: true, roles: { select: { role: true } } },
    });
  } else {
    // Ensure the user is ACTIVE and has admin roles
    const hasSuperAdmin = user.roles.some(r => r.role === "SUPER_ADMIN");
    if (!hasSuperAdmin) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          status: "ACTIVE",
          roles: { create: [{ role: "SUPER_ADMIN" }, { role: "OPERATIONS_ADMIN" }] },
        },
      });
    } else if (user.status !== "ACTIVE") {
      await prisma.user.update({ where: { id: user.id }, data: { status: "ACTIVE" } });
    }
  }

  // Upsert the credential — store hashed password
  const now = new Date();
  const hashedPw = await passwordHash(password);
  await credentials.updateOne(
    { _id: email },
    {
      $set: { userId: user.id, passwordHash: hashedPw, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );

  return user.id;
}

/**
 * Admin-only sign-in. Validates the exact locked email + password.
 * Returns failure for any other email or wrong password.
 */
export async function signInAdmin(emailInput: string, passwordInput: string) {
  await ensureAuthIndexes();
  const adminEmail = getAdminEmail();
  const adminPassword = getAdminPassword();

  if (!adminEmail || !adminPassword) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[auth] Admin login disabled: ADMIN_EMAIL or ADMIN_PASSWORD is not configured in environment.");
    }
    return { success: false as const };
  }

  const email = normalizedEmail(emailInput);

  // Only the configured admin email is accepted
  if (email !== adminEmail) {
    return { success: false as const };
  }

  // Ensure the admin credential exists in DB (idempotent, stores hash)
  const adminUserId = await ensureAdminCredential();
  if (!adminUserId) {
    return { success: false as const };
  }

  // Verify against the standard credential path via constant-time scrypt compare
  const database = await getMongoDatabase();
  const credential = await database.collection<AuthCredential>("auth_credentials").findOne({ _id: email });
  if (!credential || !(await passwordMatches(passwordInput, credential.passwordHash))) {
    return { success: false as const };
  }

  const user = await prisma.user.findUnique({
    where: { id: credential.userId },
    select: { id: true, status: true, roles: { select: { role: true } } },
  });
  if (!user || user.status !== "ACTIVE") return { success: false as const };

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await issueSession(user.id);

  return {
    success: true as const,
    userId: user.id,
    roles: user.roles.map(r => r.role),
  };
}

export function checkAccountStatusAllowed(status?: string | null) {
  if (status !== "ACTIVE" && status !== "PENDING") {
    throw new Error(`ACCOUNT_${status}`);
  }
}

export function sanitizeSelfServiceRole(requestedRole?: string | null): "CUSTOMER" | "SITTER" {
  return requestedRole === "SITTER" ? "SITTER" : "CUSTOMER";
}

async function ensureUser(channel: AuthChannel, subject: string, displayName?: string, requestedRole?: string) {
  if (channel === "email" && isAuthorizedAdminEmail(subject)) {
    throw new Error("Admin accounts must sign in with email and password.");
  }

  const selector = channel === "email" ? { email: subject } : { phoneE164: subject };
  const existing = await prisma.user.findFirst({
    where: selector,
    select: { id: true, status: true, displayName: true, roles: { select: { role: true } } },
  });

  const roleToRequest = sanitizeSelfServiceRole(requestedRole);

  if (existing) {
    checkAccountStatusAllowed(existing.status);
    const hasRole = existing.roles.some((r) => r.role === roleToRequest);
    if (!hasRole) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          roles: { create: { role: roleToRequest } },
          ...(roleToRequest === "SITTER"
            ? { sitter: { create: {} } }
            : roleToRequest === "CUSTOMER"
              ? { customer: { create: {} } }
              : {}),
        },
      });
    }

    const wasPending = existing.status === "PENDING";
    await prisma.user.update({
      where: { id: existing.id },
      data: { status: "ACTIVE", lastLoginAt: new Date() },
    });

    if (wasPending && channel === "email") {
      sendWelcomeEmail(subject, existing.displayName || "Pet Parent");
    }

    return existing.id;
  }

  const defaultRole = roleToRequest;
  const user = await prisma.user.create({
    data: {
      ...selector,
      displayName:
        displayName?.trim() ||
        (channel === "email" ? (subject.split("@")[0] ?? "Pet Parent") : "Pet Parent"),
      status: "ACTIVE",
      lastLoginAt: new Date(),
      roles: {
        create: [{ role: defaultRole }],
      },
      ...(defaultRole === "CUSTOMER" ? { customer: { create: {} } } : {}),
      ...(defaultRole === "SITTER" ? { sitter: { create: {} } } : {}),
    },
    select: { id: true, displayName: true },
  });

  if (channel === "email") {
    sendWelcomeEmail(subject, user.displayName || "Pet Parent");
  }

  return user.id;
}

export async function verifyOtpAndCreateSession(
  channel: AuthChannel,
  rawSubject: string,
  code: string,
) {
  const subject = channel === "email" ? normalizedEmail(rawSubject) : rawSubject;

  // Admin can only sign in via password — never via OTP code
  if (channel === "email" && isAuthorizedAdminEmail(subject)) {
    return { success: false as const, reason: "admin_restricted" as const };
  }

  // Reject suspended or deactivated users before or during challenge consumption
  const selector = channel === "email" ? { email: subject } : { phoneE164: subject };
  const existingPrecheck = await prisma.user.findFirst({
    where: selector,
    select: { status: true },
  });
  if (existingPrecheck && existingPrecheck.status !== "ACTIVE" && existingPrecheck.status !== "PENDING") {
    return { success: false as const, reason: "account_suspended" as const };
  }

  if (!(await consumeChallenge(channel, subject, code))) {
    return { success: false as const, reason: "invalid_otp" as const };
  }

  try {
    const userId = await ensureUser(channel, subject);
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { roles: { select: { role: true } } } });
    await issueSession(userId);
    return { success: true as const, userId, roles: user?.roles.map((r) => r.role) || [] };
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("ACCOUNT_")) {
      return { success: false as const, reason: "account_suspended" as const };
    }
    throw err;
  }
}

async function passwordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
}

/**
 * Sets (or resets) the password credential for an already-authenticated user.
 * The caller must have verified the user's identity — e.g. via the email OTP
 * login flow — before invoking this. Never accepts an email from the client.
 */
export async function setPasswordForUser(userId: string, newPassword: string) {
  await ensureAuthIndexes();
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, status: true } });
  if (!user || !user.email) return { success: false as const, reason: "user_not_found" as const };
  if (user.status !== "ACTIVE" && user.status !== "PENDING") {
    return { success: false as const, reason: "account_suspended" as const };
  }

  const database = await getMongoDatabase();
  const credentials = database.collection<AuthCredential>("auth_credentials");
  const now = new Date();
  await credentials.updateOne(
    { $or: [{ _id: user.email }, { email: user.email }] },
    {
      $set: { _id: user.email, email: user.email, userId, passwordHash: await passwordHash(newPassword), updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
  return { success: true as const };
}

async function passwordMatches(password: string, encoded: string) {
  if (encoded.startsWith("$2a$") || encoded.startsWith("$2b$") || encoded.startsWith("$2y$")) {
    return bcrypt.compare(password, encoded);
  }
  const [algorithm, salt, expectedHex] = encoded.split(":");
  if (algorithm !== "scrypt" || !salt || !expectedHex) return false;
  const expected = Buffer.from(expectedHex, "hex");
  const received = (await scrypt(password, salt, expected.length)) as Buffer;
  return expected.length === received.length && timingSafeEqual(expected, received);
}

export async function registerWithPassword(input: {
  email: string;
  displayName: string;
  password: string;
  role?: "CUSTOMER" | "SITTER" | "ADMIN";
}) {
  await ensureAuthIndexes();
  const email = normalizedEmail(input.email);
  const database = await getMongoDatabase();
  const credentials = database.collection<AuthCredential>("auth_credentials");
  const [existingCredential, existingUser] = await Promise.all([
    credentials.findOne({ _id: email }, { projection: { _id: 1 } }),
    prisma.user.findUnique({ where: { email }, select: { id: true } }),
  ]);
  if (existingCredential || existingUser) return { created: false as const, reason: "account_exists" as const };

  const isAdmin = isAuthorizedAdminEmail(email);
  // Admin account is auto-seeded — never allow signup for the admin email
  if (isAdmin) {
    return { created: false as const, reason: "unauthorized_role" as const };
  }
  if (input.role === "ADMIN") {
    return { created: false as const, reason: "unauthorized_role" as const };
  }
  const defaultUserRole: "CUSTOMER" | "SITTER" = input.role === "SITTER" ? "SITTER" : "CUSTOMER";

  const user = await prisma.user.create({
    data: {
      email,
      displayName: input.displayName.trim(),
      status: "PENDING",
      roles: { 
        create: isAdmin 
          ? [{ role: "SUPER_ADMIN" }, { role: "OPERATIONS_ADMIN" }] 
          : { role: defaultUserRole } 
      },
      ...(!isAdmin && defaultUserRole === "CUSTOMER" ? { customer: { create: {} } } : {}),
      ...(!isAdmin && defaultUserRole === "SITTER" ? { sitter: { create: {} } } : {}),
    },
    select: { id: true },
  });

  try {
    const now = new Date();
    await credentials.insertOne({
      _id: email,
      email,
      userId: user.id,
      passwordHash: await passwordHash(input.password),
      createdAt: now,
      updatedAt: now,
    });
    const verification = await requestEmailOtp(email);
    return { created: true as const, verification };
  } catch (error) {
    await credentials.deleteOne({ _id: email, userId: user.id });
    await prisma
      .$transaction([
        prisma.userRole.deleteMany({ where: { userId: user.id } }),
        prisma.customerProfile.deleteMany({ where: { userId: user.id } }),
        prisma.user.deleteMany({ where: { id: user.id, status: "PENDING" } }),
      ])
      .catch(() => undefined);
    throw error;
  }
}

export async function ensureDemoAccount(email: string, role: "CUSTOMER" | "SITTER") {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Demo account provisioning is prohibited in production mode.");
  }
  const database = await getMongoDatabase();
  const usersCol = database.collection("users");
  const rolesCol = database.collection("user_roles");
  const custCol = database.collection("customer_profiles");
  const sitterCol = database.collection("sitter_profiles");
  const petsCol = database.collection("pets");
  const credentials = database.collection<AuthCredential>("auth_credentials");

  const now = new Date();
  const pwHash = await passwordHash(process.env.DEMO_ACCOUNT_PASSWORD || "DemoPetSaathi!2026");

  const existingUser = await usersCol.findOne({ email });
  const userId = existingUser ? String(existingUser._id) : randomBytes(16).toString("hex");

  if (!existingUser) {
    await usersCol.insertOne({
      _id: userId as any,
      email,
      display_name: role === "CUSTOMER" ? "Priya Sharma" : "Aarav Sharma",
      phone_e164: role === "CUSTOMER" ? "+919876543210" : "+919876543220",
      status: "ACTIVE",
      locale: "en-IN",
      timezone: "Asia/Kolkata",
      created_at: now,
      updated_at: now,
    });
  } else {
    await usersCol.updateOne({ _id: existingUser._id }, { $set: { status: "ACTIVE", updated_at: now } });
  }

  const roleId = randomBytes(16).toString("hex");
  await rolesCol.updateOne(
    { user_id: userId, role },
    { $setOnInsert: { _id: roleId as any, user_id: userId, role, granted_at: now } },
    { upsert: true }
  );

  if (role === "CUSTOMER") {
    const custId = randomBytes(16).toString("hex");
    await custCol.updateOne(
      { user_id: userId },
      {
        $set: {
          emergency_contact_name: "Rahul Sharma",
          emergency_contact_phone: "+919876543211",
          preferred_language: "en",
        },
        $setOnInsert: { _id: custId as any, user_id: userId },
      },
      { upsert: true }
    );
    const existingPet = await petsCol.findOne({ owner_id: userId });
    if (!existingPet) {
      const petId = randomBytes(16).toString("hex");
      await petsCol.insertOne({
        _id: petId as any,
        owner_id: userId,
        name: "Bruno",
        species: "DOG",
        breed: "Golden Retriever",
        sex: "MALE",
        birth_date: new Date("2022-04-15"),
        weight_kg: 28,
        sterilised: true,
        active: true,
        created_at: now,
        updated_at: now,
      });
    }
    const addressesCol = database.collection("addresses");
    const existingAddr = await addressesCol.findOne({ user_id: userId });
    if (!existingAddr) {
      const addrId = randomBytes(16).toString("hex");
      await addressesCol.insertOne({
        _id: addrId as any,
        user_id: userId,
        label: "Home",
        line1: "Flat 402, Sunshine Residency, 12th Main Road",
        line2: "HAL 2nd Stage",
        landmark: "Near Indiranagar Metro Station",
        locality: "Indiranagar",
        city: "Bangalore",
        state: "Karnataka",
        postal_code: "560038",
        country_code: "IN",
        latitude: 12.9716,
        longitude: 77.5946,
        created_at: now,
        updated_at: now,
      });
    }
  } else if (role === "SITTER") {
    const sitterId = randomBytes(16).toString("hex");
    await sitterCol.updateOne(
      { user_id: userId },
      {
        $set: {
          status: "APPROVED",
          bio: "Experienced dog walker and pet sitter certified in canine first aid.",
          years_experience: 4,
          service_locality: "Indiranagar",
          service_radius_km: 8,
          reliability_score: 98.5,
        },
        $setOnInsert: { _id: sitterId as any, user_id: userId, application_at: now },
      },
      { upsert: true }
    );
  }

  await credentials.updateOne(
    { $or: [{ _id: email }, { email }] },
    {
      $set: { _id: email, email, userId, passwordHash: pwHash, updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true }
  );

  return userId;
}

export async function signInWithPassword(emailInput: string, password: string) {
  await ensureAuthIndexes();
  const email = normalizedEmail(emailInput);

  // If this is the locked admin email, use the strict admin sign-in routine
  if (isAuthorizedAdminEmail(email)) {
    return signInAdmin(email, password);
  }

  // NOTE (AUTH-01): Demo provisioning is isolated to explicit dev scripts and never executed on login.
  const database = await getMongoDatabase();
  const credential = await database.collection<any>("auth_credentials").findOne({
    $or: [{ _id: email }, { email }]
  });
  if (!credential || !(await passwordMatches(password, credential.passwordHash))) return { success: false };

  // Transparent re-hash of legacy bcrypt passwords to scrypt on successful login
  if (credential.passwordHash.startsWith("$2")) {
    try {
      const newHash = await passwordHash(password);
      await database.collection("auth_credentials").updateOne(
        { _id: credential._id },
        { $set: { passwordHash: newHash, updatedAt: new Date() } }
      );
    } catch (rehashErr) {
      console.warn("[auth] Transparent re-hash to scrypt failed:", rehashErr);
    }
  }

  const user = await prisma.user.findUnique({ 
    where: { id: credential.userId }, 
    select: { id: true, status: true, roles: { select: { role: true } } } 
  });
  if (!user || user.status !== "ACTIVE") return { success: false };
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await issueSession(user.id);
  
  // Non-authorized admin emails can never yield admin roles
  const isAllowedAdmin = getAllowedAdminAccounts().has(email);
  const roles = user.roles
    .map(r => r.role)
    .filter(r => isAllowedAdmin || (r !== "SUPER_ADMIN" && r !== "OPERATIONS_ADMIN"));

  return { 
    success: true, 
    userId: user.id,
    roles,
  };
}

export async function issueSession(userId: string) {
  await ensureAuthIndexes();
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const sessionDays = Number(process.env.AUTH_SESSION_DAYS ?? 30);
  const expiresAt = new Date(now.getTime() + sessionDays * 24 * 60 * 60_000);
  const database = await getMongoDatabase();
  await database.collection<AuthSession>("auth_sessions").insertOne({
    _id: digest(token),
    userId,
    createdAt: now,
    lastSeenAt: now,
    expiresAt,
  });

  // Resolve user primary role to sign into the session cookie for edge verification
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { roles: { select: { role: true } } },
  });
  const role = getPrimaryRole(user?.roles.map(item => item.role) ?? []);
  const sig = createHmac("sha256", authSecret()).update(`${token}:${role}`).digest("base64url");
  const signedCookieValue = `${token}.${role}.${sig}`;

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, signedCookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && process.env.PLAYWRIGHT_TEST !== "1",
    sameSite: "lax",
    path: "/",
  });
}

export async function currentSessionUserId(): Promise<string | null> {
  const rawCookie = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!rawCookie) return null;

  const [token] = rawCookie.split(".");
  if (!token) return null;

  try {
    await ensureAuthIndexes();
    const database = await getMongoDatabase();
    const session = await database.collection<AuthSession>("auth_sessions").findOne({
      _id: digest(token),
      expiresAt: { $gt: new Date() },
    });
    return session?.userId ?? null;
  } catch (error) {
    return null;
  }
}

export async function revokeCurrentSession() {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (rawCookie) {
    const [token] = rawCookie.split(".");
    if (token) {
      const database = await getMongoDatabase();
      await database.collection<AuthSession>("auth_sessions").deleteOne({ _id: digest(token) });
    }
  }
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && process.env.PLAYWRIGHT_TEST !== "1",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function signInWithGoogle(emailInput: string, name: string, avatarUrl?: string, requestedRole?: string) {
  const email = normalizedEmail(emailInput);

  // Admin can only sign in via password — never via Google
  if (isAuthorizedAdminEmail(email)) {
    throw new Error("Admin accounts cannot sign in with Google. Use email and password.");
  }

  const sanitizedRole = sanitizeSelfServiceRole(requestedRole);
  const userId = await ensureUser("email", email, name, sanitizedRole);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { roles: { select: { role: true } } } });
  
  if (avatarUrl) {
    await prisma.user.update({ where: { id: userId }, data: { avatarPath: avatarUrl } });
  }

  await issueSession(userId);
  const roles = (user?.roles.map((r) => r.role) || []).filter(
    (r) => r !== "SUPER_ADMIN" && r !== "OPERATIONS_ADMIN",
  );
  return { success: true, userId, roles };
}
import { getPrimaryRole } from "./admin-access";

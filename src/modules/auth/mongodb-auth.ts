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
  userId: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

let indexesPromise: Promise<void> | undefined;

function normalizedEmail(email: string) {
  return email.trim().toLowerCase();
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

export async function requestEmailOtp(rawEmail: string) {
  const email = normalizedEmail(rawEmail);
  const challenge = await saveChallenge("email", email);
  if (challenge.development) {
    return { mode: "development", code: challenge.code } satisfies OtpDelivery;
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  
  if (process.env.NODE_ENV === "development") {
    logger.info("Dev Login OTP generated", { email, code: challenge.code });
  }

  if (!user || !pass) {
    if (process.env.NODE_ENV === "development") {
      return { mode: "development", code: challenge.code } satisfies OtpDelivery;
    }
    await removeChallenge("email", email);
    throw new Error("Email OTP delivery (SMTP) is not configured.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  try {
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error("Timeout")), 15_000);
      transporter.sendMail({
        from: `"PetSaathi" <${user}>`,
        to: email,
        subject: "Your PetSaathi verification code",
        text: `Your PetSaathi verification code is ${challenge.code}. It expires in ${CHALLENGE_MINUTES} minutes.`,
        html: `<p>Your PetSaathi verification code is <strong>${challenge.code}</strong>.</p><p>It expires in ${CHALLENGE_MINUTES} minutes.</p>`,
      }).then((info) => {
        clearTimeout(timeout);
        resolve(info);
      }).catch((err) => {
        clearTimeout(timeout);
        reject(err);
      });
    });
    return { mode: "email" } satisfies OtpDelivery;
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[DEV] Email failed to send via SMTP. OTP is ${challenge.code}`);
      return { mode: "development", code: challenge.code } satisfies OtpDelivery;
    }
    await removeChallenge("email", email);
    throw new Error("Email OTP provider rejected the request.");
  }
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

async function sendWelcomeEmail(email: string, displayName: string) {
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

const AUTHORIZED_ADMIN_EMAILS = new Set([
  "mrsenjaliya532@gmail.com",
  "admin@petsaathi.com",
]);

export function isAuthorizedAdminEmail(email: string): boolean {
  return AUTHORIZED_ADMIN_EMAILS.has(email.trim().toLowerCase());
}

async function ensureUser(channel: AuthChannel, subject: string, displayName?: string, requestedRole?: string) {
  const selector = channel === "email" ? { email: subject } : { phoneE164: subject };
  const existing = await prisma.user.findFirst({ where: selector, select: { id: true, status: true, displayName: true, roles: { select: { role: true } } } });
  
  const isAdmin = channel === "email" && isAuthorizedAdminEmail(subject);
  const roleToRequest = isAdmin ? "SUPER_ADMIN" : requestedRole === "SITTER" ? "SITTER" : "CUSTOMER";
  
  if (existing) {
    if (!isAdmin && roleToRequest) {
      const hasRole = existing.roles.some(r => r.role === roleToRequest);
      if (!hasRole) {
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            roles: { create: { role: roleToRequest } },
            ...(roleToRequest === "SITTER" ? { sitter: { create: {} } } : roleToRequest === "CUSTOMER" ? { customer: { create: {} } } : {})
          }
        });
      }
    } else if (isAdmin) {
      const hasAdmin = existing.roles.some(r => r.role === "SUPER_ADMIN");
      if (!hasAdmin) {
        await prisma.user.update({
          where: { id: existing.id },
          data: {
            roles: { create: [{ role: "SUPER_ADMIN" }, { role: "OPERATIONS_ADMIN" }] }
          }
        });
      }
    }
    
    const wasPending = existing.status === "PENDING";
    await prisma.user.update({ where: { id: existing.id }, data: { status: "ACTIVE", lastLoginAt: new Date() } });
    
    if (wasPending && channel === "email") {
      sendWelcomeEmail(subject, existing.displayName || "Pet Parent");
    }
    
    return existing.id;
  }

  const defaultRole = roleToRequest || "CUSTOMER";
  const user = await prisma.user.create({
    data: {
      ...selector,
      displayName:
        displayName?.trim() ||
        (channel === "email" ? (subject.split("@")[0] ?? "Pet Parent") : "Pet Parent"),
      status: "ACTIVE",
      lastLoginAt: new Date(),
      roles: { 
        create: isAdmin 
          ? [{ role: "SUPER_ADMIN" }, { role: "OPERATIONS_ADMIN" }] 
          : [{ role: defaultRole }] 
      },
      ...(!isAdmin && defaultRole === "CUSTOMER" ? { customer: { create: {} } } : {}),
      ...(!isAdmin && defaultRole === "SITTER" ? { sitter: { create: {} } } : {})
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
  if (!(await consumeChallenge(channel, subject, code))) return { success: false };
  const userId = await ensureUser(channel, subject);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { roles: { select: { role: true } } } });
  await issueSession(userId);
  return { success: true, roles: user?.roles.map(r => r.role) || [] };
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
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return { success: false as const, reason: "user_not_found" as const };

  const database = await getMongoDatabase();
  const credentials = database.collection<AuthCredential>("auth_credentials");
  const now = new Date();
  if (!user.email) return { success: false as const, reason: "user_not_found" as const };
  await credentials.updateOne(
    { _id: user.email },
    {
      $set: { userId, passwordHash: await passwordHash(newPassword), updatedAt: now },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
  return { success: true as const };
}

async function passwordMatches(password: string, encoded: string) {
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
  if (input.role === "ADMIN" && !isAdmin) {
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

export async function signInWithPassword(emailInput: string, password: string) {
  await ensureAuthIndexes();
  const email = normalizedEmail(emailInput);
  const database = await getMongoDatabase();
  const credential = await database.collection<AuthCredential>("auth_credentials").findOne({ _id: email });
  if (!credential || !(await passwordMatches(password, credential.passwordHash))) return { success: false };

  const user = await prisma.user.findUnique({ 
    where: { id: credential.userId }, 
    select: { id: true, status: true, roles: { select: { role: true } } } 
  });
  if (!user || user.status !== "ACTIVE") return { success: false };
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await issueSession(user.id);
  
  return { 
    success: true, 
    roles: user.roles.map(r => r.role)
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

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" && process.env.PLAYWRIGHT_TEST !== "1",
    sameSite: "lax",
    path: "/",
  });
}

export async function currentSessionUserId(): Promise<string | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
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
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    const database = await getMongoDatabase();
    await database.collection<AuthSession>("auth_sessions").deleteOne({ _id: digest(token) });
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
  const userId = await ensureUser("email", email, name, requestedRole);
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { roles: { select: { role: true } } } });
  
  if (avatarUrl) {
    await prisma.user.update({ where: { id: userId }, data: { avatarPath: avatarUrl } });
  }

  await issueSession(userId);
  return { success: true, roles: user?.roles.map(r => r.role) || [] };
}

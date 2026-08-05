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

import { cookies } from "next/headers";

import { prisma } from "@/lib/db";
import { getMongoDatabase } from "@/lib/mongodb";

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
  const configured = process.env.AUTH_SECRET;
  if (configured && configured.length >= 32) return configured;
  if (process.env.NODE_ENV !== "production") {
    return "petsaathi-local-development-secret-change-before-production";
  }
  throw new Error("AUTH_SECRET must contain at least 32 characters in production.");
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
  if (process.env.NODE_ENV !== "development") return null;
  const configured = process.env.AUTH_DEV_FIXED_OTP;
  if (configured && /^\d{6}$/.test(configured)) return configured;
  if (channel === "email" && subject === "test@petsaathi.com") return "123456";
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

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    await removeChallenge("email", email);
    throw new Error("Email OTP delivery is not configured.");
  }

  const timeoutValue = Number(process.env.RESEND_REQUEST_TIMEOUT_MS ?? 8_000);
  const timeoutMs = Number.isFinite(timeoutValue)
    ? Math.min(30_000, Math.max(1_000, timeoutValue))
    : 8_000;

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `petsaathi-otp-${digest(`${email}:${challenge.code}`)}`,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Your PetSaathi verification code",
        text: `Your PetSaathi verification code is ${challenge.code}. It expires in ${CHALLENGE_MINUTES} minutes.`,
        html: `<p>Your PetSaathi verification code is <strong>${challenge.code}</strong>.</p><p>It expires in ${CHALLENGE_MINUTES} minutes.</p>`,
      }),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    await removeChallenge("email", email);
    throw new Error("Email OTP provider request failed or timed out.");
  }

  if (!response.ok) {
    await removeChallenge("email", email);
    throw new Error(`Email OTP provider rejected the request with status ${response.status}.`);
  }

  return { mode: "email" } satisfies OtpDelivery;
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

async function ensureUser(channel: AuthChannel, subject: string, displayName?: string) {
  const selector = channel === "email" ? { email: subject } : { phoneE164: subject };
  const existing = await prisma.user.findFirst({ where: selector, select: { id: true } });
  if (existing) {
    await prisma.user.update({ where: { id: existing.id }, data: { status: "ACTIVE", lastLoginAt: new Date() } });
    return existing.id;
  }

  const user = await prisma.user.create({
    data: {
      ...selector,
      displayName:
        displayName?.trim() ||
        (channel === "email" ? (subject.split("@")[0] ?? "Pet Parent") : "Pet Parent"),
      status: "ACTIVE",
      lastLoginAt: new Date(),
      roles: { create: { role: "CUSTOMER" } },
      customer: { create: {} },
    },
    select: { id: true },
  });
  return user.id;
}

export async function verifyOtpAndCreateSession(
  channel: AuthChannel,
  rawSubject: string,
  code: string,
) {
  const subject = channel === "email" ? normalizedEmail(rawSubject) : rawSubject;
  if (!(await consumeChallenge(channel, subject, code))) return false;
  const userId = await ensureUser(channel, subject);
  await issueSession(userId);
  return true;
}

async function passwordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  return `scrypt:${salt}:${derived.toString("hex")}`;
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

  const user = await prisma.user.create({
    data: {
      email,
      displayName: input.displayName.trim(),
      status: "PENDING",
      roles: { create: { role: "CUSTOMER" } },
      customer: { create: {} },
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
  if (!credential || !(await passwordMatches(password, credential.passwordHash))) return false;

  const user = await prisma.user.findUnique({ where: { id: credential.userId }, select: { id: true, status: true } });
  if (!user || user.status !== "ACTIVE") return false;
  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await issueSession(user.id);
  return true;
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function currentSessionUserId() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  await ensureAuthIndexes();
  const database = await getMongoDatabase();
  const session = await database.collection<AuthSession>("auth_sessions").findOne({
    _id: digest(token),
    expiresAt: { $gt: new Date() },
  });
  return session?.userId ?? null;
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
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function signInWithGoogle(emailInput: string, name: string, avatarUrl?: string) {
  const email = normalizedEmail(emailInput);
  const userId = await ensureUser("email", email, name);
  
  if (avatarUrl) {
    await prisma.user.update({ where: { id: userId }, data: { avatarPath: avatarUrl } });
  }

  await issueSession(userId);
  return true;
}

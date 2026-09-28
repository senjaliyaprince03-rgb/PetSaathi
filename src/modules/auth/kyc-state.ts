import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getMongoDatabase } from "@/lib/mongodb";

export const KYC_STATE_COOKIE = "digilocker_state";
const digest = (value: string) => createHash("sha256").update(value).digest("hex");

export async function createKycState(userId: string, sitterId: string) {
  const state = randomBytes(32).toString("base64url");
  const db = await getMongoDatabase();
  await db.collection("oauth_states").insertOne({ _id: digest(state) as any, userId, sitterId, purpose: "DIGILOCKER", expiresAt: new Date(Date.now() + 600_000) });
  return state;
}

export async function consumeKycState(state: string | null, cookie: string | undefined, userId: string, sitterId: string) {
  if (!state || !cookie || state.length !== cookie.length || !/^[A-Za-z0-9_-]{43}$/.test(state)) return false;
  if (!timingSafeEqual(Buffer.from(state), Buffer.from(cookie))) return false;
  const db = await getMongoDatabase();
  // Atomic deletion makes concurrent callbacks and replay single-use.
  return Boolean(await db.collection("oauth_states").findOneAndDelete({ _id: digest(state) as any, userId, sitterId, purpose: "DIGILOCKER", expiresAt: { $gt: new Date() } }));
}

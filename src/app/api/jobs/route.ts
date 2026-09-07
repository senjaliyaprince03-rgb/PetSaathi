import { timingSafeEqual } from "node:crypto";
import { NextResponse } from 'next/server';

function validateCronRequest(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !token) return false;
  const expectedBytes = Buffer.from(secret);
  const receivedBytes = Buffer.from(token);
  return expectedBytes.length === receivedBytes.length && timingSafeEqual(expectedBytes, receivedBytes);
}

export async function GET(request: Request) {
  if (!validateCronRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ success: true, data: [] });
}

export async function POST(request: Request) {
  if (!validateCronRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ success: true, data: {} });
}

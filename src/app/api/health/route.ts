import { NextResponse } from "next/server";

import { isDatabaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "petsaathi-web",
    timestamp: new Date().toISOString(),
    dependencies: {
      database: isDatabaseConfigured() ? "configured" : "not_configured",
      auth: process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "configured" : "not_configured",
      payments: process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_WEBHOOK_SECRET ? "configured" : "not_configured"
    }
  }, { headers: { "Cache-Control": "no-store" } });
}

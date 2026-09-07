import { NextResponse } from "next/server";
import { getHealthTimeline, addHealthEvent } from "@/modules/health/service";

import { getCurrentIdentity } from "@/modules/auth/session";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const isStaff = identity.roles.some((r) => ["SUPER_ADMIN", "OPERATIONS_ADMIN", "SITTER"].includes(r));
    const timeline = await getHealthTimeline((await params).id, limit, isStaff ? undefined : identity.id);
    return NextResponse.json({ timeline }, { status: 200 });
  } catch (error: any) {
    if (error.code === "pet_not_found") {
      return NextResponse.json({ error: "not_found", message: error.message }, { status: 404 });
    }
    if (error.code === "forbidden") {
      return NextResponse.json({ error: "forbidden", message: error.message }, { status: 403 });
    }
    console.error("Error in GET health API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const identity = await getCurrentIdentity();
    if (!identity) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { eventType, summary, occurredAt, source, details, providerRef } = body;

    if (!eventType || !summary || !occurredAt) {
      return NextResponse.json({ error: "bad_request", message: "Missing required fields" }, { status: 400 });
    }

    const isStaff = identity.roles.some((r) => ["SUPER_ADMIN", "OPERATIONS_ADMIN", "SITTER"].includes(r));
    const event = await addHealthEvent(
      (await params).id,
      identity.id,
      eventType,
      summary,
      new Date(occurredAt),
      source || "USER",
      details,
      providerRef,
      isStaff ? undefined : identity.id
    );

    return NextResponse.json({ event }, { status: 201 });
  } catch (error: any) {
    if (error.code === "pet_not_found") {
      return NextResponse.json({ error: "not_found", message: error.message }, { status: 404 });
    }
    if (error.code === "forbidden") {
      return NextResponse.json({ error: "forbidden", message: error.message }, { status: 403 });
    }
    console.error("Error in POST health API:", error);
    return NextResponse.json(
      { error: "internal_error", message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

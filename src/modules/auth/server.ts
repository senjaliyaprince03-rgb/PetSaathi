import { NextResponse } from "next/server";
import { getCurrentIdentity } from "./session";

export class UnauthorizedError extends Error {
  readonly status = 401;
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export function handleAuthError(error: unknown): NextResponse | null {
  if (
    error instanceof UnauthorizedError ||
    (error instanceof Error && (error.message === "Unauthorized" || error.name === "UnauthorizedError"))
  ) {
    return NextResponse.json(
      { error: "unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    );
  }
  if (
    error instanceof ForbiddenError ||
    (error instanceof Error && (error.message === "Forbidden" || error.name === "ForbiddenError"))
  ) {
    return NextResponse.json(
      { error: "forbidden" },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }
  return null;
}

export async function getAdminSession(): Promise<string> {
  const identity = await getCurrentIdentity();
  if (!identity) {
    throw new UnauthorizedError("Unauthorized");
  }
  
  // Basic check for admin role
  const isAdmin = identity.roles.some(role => 
    ["OPERATIONS_ADMIN", "VERIFICATION_ADMIN", "SAFETY_ADMIN", "FINANCE_ADMIN", "CONTENT_ADMIN", "SUPER_ADMIN", "CITY_MANAGER"].includes(role)
  );

  if (!isAdmin) {
    throw new ForbiddenError("Forbidden");
  }

  return identity.id;
}


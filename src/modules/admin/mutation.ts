import "server-only";

import { NextResponse } from "next/server";
import { z } from "zod";

export const adminResourceIdSchema = z.string().uuid();

export class AdminMutationError extends Error {
  constructor(
    public readonly status: 404 | 409,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "AdminMutationError";
  }
}

export function adminMutationErrorResponse(error: unknown) {
  if (!(error instanceof AdminMutationError)) return null;
  return NextResponse.json(
    { error: error.code, message: error.message },
    {
      status: error.status,
      headers: { "Cache-Control": "no-store" },
    },
  );
}

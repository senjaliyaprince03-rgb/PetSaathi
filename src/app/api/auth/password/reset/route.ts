import { NextResponse } from "next/server";
import { z } from "zod";

import { setPasswordForUser } from "@/modules/auth/mongodb-auth";
import { getCurrentIdentity } from "@/modules/auth/session";
import { jsonError } from "@/lib/api-error";

// Same policy as signup so reset passwords cannot be weaker than new ones.
const resetSchema = z.object({
  password: z.string()
    .min(10, "Password must be at least 10 characters long")
    .max(128, "Password must not exceed 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
});

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity) return jsonError("unauthorized", "Verify your email code first, then set a new password.", 401);

  const parsed = resetSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return jsonError("invalid_password", "Please check the highlighted fields and try again.", 422, {
      issues: parsed.error.flatten(),
    });
  }

  const result = await setPasswordForUser(identity.id, parsed.data.password);
  if (!result.success) return jsonError("user_not_found", "Account not found.", 404);

  return NextResponse.json({ updated: true });
}

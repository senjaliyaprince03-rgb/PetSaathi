import { NextResponse } from "next/server";
import { registerWithPassword } from "@/modules/auth/mongodb-auth";
import { registerSchema } from "@/lib/validators/auth";
import { errorResponseForCaughtError, jsonError } from "@/lib/api-error";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    
    if (!parsed.success) {
      return jsonError("VALIDATION_ERROR", "Please check the highlighted fields and try again.", 422, {
        issues: parsed.error.format(),
      });
    }

    const { email, password, name, role } = parsed.data;

    // Delegate to canonical registration service (AUTH-04: Single registration lifecycle)
    const result = await registerWithPassword({
      email,
      password,
      displayName: name,
      role: role === "SITTER" ? "SITTER" : "CUSTOMER",
    });

    if (!result.created) {
      if (result.reason === "unauthorized_role") {
        return jsonError("unauthorized_role", "Admin registration is restricted to authorized administrator accounts.", 403);
      }
      return jsonError("account_exists", "An account with this email already exists.", 409);
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        created: true,
        requiresVerification: true,
        ...(result.verification.mode === "development" ? { developmentOtp: result.verification.code } : {}),
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return errorResponseForCaughtError(error, logger, "auth.register_failed");
  }
}

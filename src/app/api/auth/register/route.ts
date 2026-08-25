import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getMongoDatabase } from "@/lib/mongodb";
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
    const normalizedEmail = email.toLowerCase().trim();

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return jsonError("account_exists", "An account with this email already exists.", 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User (avoid nested creates for local MongoDB standalone support)
    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        displayName: name,
        status: "ACTIVE", 
      }
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        role: role === "SITTER" ? "SITTER" : "CUSTOMER"
      }
    });

    if (role === "SITTER") {
      await prisma.sitterProfile.create({ data: { userId: user.id, status: "APPLICANT" } });
      
      // Trigger Admin Email Notification for new Employee Request (mocked for now)
      console.log(`[EMAIL to Admin] New Employee (Sitter) Request from ${name} (${normalizedEmail}) - Pending Approval.`);
    } else {
      await prisma.customerProfile.create({ data: { userId: user.id } });
    }

    // Save credentials in the native mongo collection for NextAuth compatibility
    const db = await getMongoDatabase();
    await db.collection("auth_credentials").insertOne({
      email: normalizedEmail,
      userId: user.id,
      passwordHash: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json(
      { message: "User registered successfully", userId: user.id },
      { status: 201 }
    );
  } catch (error: unknown) {
    return errorResponseForCaughtError(error, logger, "auth.register_failed");
  }
}

/**
 * Auth Context Extraction
 * Provides authenticated user context for authorization checks
 */

import "server-only";

import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { currentSessionUserId } from "@/modules/auth/mongodb-auth";
import { UnauthorizedError, type AuthContext } from "@/lib/authorization";

/**
 * Get authenticated user context from request
 * Throws UnauthorizedError if not authenticated
 */
export async function getAuthContext(request?: NextRequest): Promise<AuthContext> {
  const userId = await currentSessionUserId();
  
  if (!userId) {
    throw new UnauthorizedError("Authentication required");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      roles: { select: { role: true } }
    }
  });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  const roles = user.roles.map(r => r.role);
  const isSuperAdmin = roles.includes("SUPER_ADMIN");
  const isAdmin = isSuperAdmin || roles.some(r => 
    r.includes("ADMIN") || r === "OPERATIONS_ADMIN"
  );

  return {
    userId: user.id,
    roles,
    isAdmin,
    isSuperAdmin
  };
}

/**
 * Get auth context or return null if not authenticated
 */
export async function getAuthContextOptional(request?: NextRequest): Promise<AuthContext | null> {
  try {
    return await getAuthContext(request);
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      return null;
    }
    throw error;
  }
}

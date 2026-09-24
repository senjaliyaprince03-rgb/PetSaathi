import "server-only";

import { prisma, isDatabaseConfigured } from "@/lib/db";
import type { Role, Prisma } from "@prisma/client";

export interface CreateAuditLogParams {
  actorId?: string | null;
  actorRole?: Role | null;
  action: string;
  resourceType: string;
  resourceId: string;
  before?: Prisma.InputJsonValue;
  after?: Prisma.InputJsonValue;
  reason?: string | null;
  ipHash?: string | null;
  requestId?: string | null;
}

export interface QueryAuditLogsParams {
  limit?: number;
  offset?: number;
  resourceType?: string;
  actorId?: string;
  action?: string;
}

/**
 * Record an immutable audit log entry for any sensitive governance, security,
 * or operational state change.
 */
export async function recordRbacAuditLog(params: CreateAuditLogParams) {
  if (!isDatabaseConfigured()) {
    console.info("[RBAC-AUDIT] (DB unconfigured)", JSON.stringify(params));
    return null;
  }

  try {
    return await prisma.auditLog.create({
      data: {
        actorId: params.actorId ?? null,
        actorRole: params.actorRole ?? null,
        action: params.action,
        resourceType: params.resourceType,
        resourceId: params.resourceId,
        before: params.before,
        after: params.after,
        reason: params.reason ?? null,
        ipHash: params.ipHash ?? null,
        requestId: params.requestId ?? null,
      },
    });
  } catch (error) {
    console.error("[RBAC-AUDIT-ERROR] Failed to record audit log:", error);
    return null;
  }
}

/**
 * Query audit logs with pagination and filtering for Super Admin / Compliance officers.
 */
export async function getRecentAuditLogs(params: QueryAuditLogsParams = {}) {
  const limit = Math.min(Math.max(params.limit ?? 25, 1), 100);
  const offset = Math.max(params.offset ?? 0, 0);

  if (!isDatabaseConfigured()) {
    return { logs: [], total: 0, limit, offset };
  }

  const where: Prisma.AuditLogWhereInput = {};
  if (params.resourceType) where.resourceType = params.resourceType;
  if (params.actorId) where.actorId = params.actorId;
  if (params.action) where.action = { contains: params.action };

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return { logs, total, limit, offset };
}

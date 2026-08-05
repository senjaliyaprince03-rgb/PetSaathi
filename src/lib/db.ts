import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  const mongoUri = boundedMongoUri();
  return new PrismaClient({
    ...(mongoUri ? { datasourceUrl: mongoUri } : {}),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  }).$extends({
    query: {
      incident: {
        async update({ args, query }) {
          const data = args.data as Record<string, unknown>;
          const status = readSetValue(data.status);
          if (
            status === "CLOSED" &&
            (!readSetValue(data.closedAt) || !readSetValue(data.closedBy))
          ) {
            throw new Error("incidents_closure_metadata_check");
          }
          return query(args);
        },
      },
      correctiveAction: {
        async update({ args, query }) {
          const data = args.data as Record<string, unknown>;
          if (readSetValue(data.completedAt) && !readSetValue(data.evidence)) {
            throw new Error("corrective_actions_completion_evidence_check");
          }
          return query(args);
        },
      },
    },
  });
}

function boundedMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) return undefined;
  if (/serverSelectionTimeoutMS=/i.test(uri)) return uri;
  const separator = uri.includes("?") ? "&" : "?";
  // Keep public routes responsive during Atlas outages while preserving normal retry behavior.
  return `${uri}${separator}serverSelectionTimeoutMS=5000&connectTimeoutMS=5000`;
}

function readSetValue(value: unknown) {
  if (
    value &&
    typeof value === "object" &&
    "set" in value
  ) {
    return (value as { set: unknown }).set;
  }
  return value;
}

type AppPrismaClient = ReturnType<typeof createPrismaClient>;
const prismaGlobal = globalThis as unknown as { prisma?: AppPrismaClient };

// Keep Prisma's standard public type so transaction helpers accept the client;
// the query extension still runs at runtime for direct and transactional writes.
export const prisma = (prismaGlobal.prisma ?? createPrismaClient()) as unknown as PrismaClient;

if (process.env.NODE_ENV !== "production") {
  prismaGlobal.prisma = prisma as unknown as AppPrismaClient;
}

export function isDatabaseConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

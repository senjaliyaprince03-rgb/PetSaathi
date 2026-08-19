import "server-only";

import dns from "node:dns";
import { GridFSBucket, MongoClient, type Db } from "mongodb";

// Work around the Windows resolver returning ECONNREFUSED for Atlas SRV records;
// MONGODB_DNS_SERVERS lets managed networks provide their own resolvers.
export function configureMongoDns() {
  if (process.platform !== "win32" && !process.env.MONGODB_DNS_SERVERS) return;
  const configuredServers = process.env.MONGODB_DNS_SERVERS
    ?.split(",")
    .map((server) => server.trim())
    .filter(Boolean);
  const servers = configuredServers?.length
    ? configuredServers
    : ["8.8.8.8", "8.8.4.4"];
  try {
    dns.setServers(servers);
  } catch {
    // Ignore if the runtime does not permit changing DNS servers.
  }
}

configureMongoDns();

type MongoGlobal = {
  clientPromise?: Promise<MongoClient>;
  databasePromise?: Promise<Db>;
};

const mongoGlobal = globalThis as typeof globalThis & { __petsaathiMongo?: MongoGlobal };
const cache = mongoGlobal.__petsaathiMongo ?? {};

if (process.env.NODE_ENV !== "production") mongoGlobal.__petsaathiMongo = cache;

function mongoUri() {
  const uri = process.env.MONGODB_PRISMA_URI?.trim() || process.env.MONGODB_URI?.trim();
  if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri)) {
    throw new Error("MONGODB_URI is not configured with a MongoDB connection string.");
  }
  return uri;
}

export function mongoConnectionTimeoutMs() {
  const configured = Number(process.env.MONGODB_TIMEOUT_MS ?? 2_500);
  return Number.isFinite(configured)
    ? Math.min(10_000, Math.max(1_000, configured))
    : 2_500;
}

function databaseName(uri: string) {
  const configured = process.env.MONGODB_DATABASE?.trim();
  if (configured) return configured;

  const pathname = new URL(uri).pathname.replace(/^\//, "");
  if (!pathname) {
    throw new Error("MONGODB_DATABASE is required when MONGODB_URI has no database path.");
  }
  return decodeURIComponent(pathname);
}

export function getMongoClient() {
  if (!cache.clientPromise) {
    const uri = mongoUri();
    cache.clientPromise = new MongoClient(uri, {
      appName: "PetSaathi",
      maxPoolSize: 20,
      minPoolSize: 0,
      serverSelectionTimeoutMS: mongoConnectionTimeoutMs(),
    }).connect();
  }
  return cache.clientPromise;
}

export function getMongoDatabase() {
  if (!cache.databasePromise) {
    const uri = mongoUri();
    cache.databasePromise = getMongoClient().then((client) => client.db(databaseName(uri)));
  }
  return cache.databasePromise;
}

export async function getGridFsBucket() {
  return new GridFSBucket(await getMongoDatabase(), { bucketName: "petsaathi_files" });
}

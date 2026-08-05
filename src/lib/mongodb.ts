import "server-only";

import { GridFSBucket, MongoClient, type Db } from "mongodb";

type MongoGlobal = {
  clientPromise?: Promise<MongoClient>;
  databasePromise?: Promise<Db>;
};

const mongoGlobal = globalThis as typeof globalThis & { __petsaathiMongo?: MongoGlobal };
const cache = mongoGlobal.__petsaathiMongo ?? {};

if (process.env.NODE_ENV !== "production") mongoGlobal.__petsaathiMongo = cache;

function mongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri)) {
    throw new Error("MONGODB_URI is not configured with a MongoDB connection string.");
  }
  return uri;
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
      serverSelectionTimeoutMS: 5_000,
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

import { getMongoDatabase } from "./mongodb";

export async function checkIdempotency(key: string): Promise<boolean> {
  const db = await getMongoDatabase();
  const collection = db.collection("idempotency");
  
  // Ensure indexes exist (safe to call multiple times)
  await collection.createIndex({ key: 1 }, { unique: true });
  await collection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 86400 });

  try {
    await collection.insertOne({
      key,
      createdAt: new Date(),
    });
    return true; // First time this key is used
  } catch (error: any) {
    if (error.code === 11000) {
      // Duplicate key error
      return false;
    }
    throw error;
  }
}

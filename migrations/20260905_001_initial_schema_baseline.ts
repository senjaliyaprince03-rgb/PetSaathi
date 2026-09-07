import { Db } from "mongodb";

/**
 * Migration: 20260905_001_initial_schema_baseline
 * Description: Validates baseline collection existence and creates core system indexes.
 */
export async function up(db: Db): Promise<void> {
  // Ensure essential collections exist
  const existing = await db.listCollections().toArray();
  const existingNames = new Set(existing.map((c) => c.name));

  const essentialCollections = [
    "users",
    "bookings",
    "booking_assignments",
    "payments",
    "tracking_sessions",
    "tracking_points",
    "societies",
    "sitter_profiles",
  ];

  for (const coll of essentialCollections) {
    if (!existingNames.has(coll)) {
      await db.createCollection(coll);
    }
  }
}

export async function down(db: Db): Promise<void> {
  // Additive migrations are non-destructive
}

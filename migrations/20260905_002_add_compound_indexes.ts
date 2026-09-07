import { Db } from "mongodb";

/**
 * Migration: 20260905_002_add_compound_indexes
 * Description: Ensures compound indexes for high-throughput queries are applied.
 */
export async function up(db: Db): Promise<void> {
  const indexesToEnsure: Array<{
    collection: string;
    name: string;
    key: Record<string, 1 | -1>;
  }> = [
    {
      collection: "bookings",
      name: "bookings_status_created_at_idx",
      key: { status: 1, created_at: -1 },
    },
    {
      collection: "bookings",
      name: "bookings_customer_id_status_idx",
      key: { customer_id: 1, status: 1 },
    },
    {
      collection: "booking_assignments",
      name: "booking_assignments_sitter_id_status_idx",
      key: { sitter_id: 1, status: 1 },
    },
    {
      collection: "tracking_sessions",
      name: "tracking_sessions_booking_id_idx",
      key: { booking_id: 1 },
    },
    {
      collection: "tracking_points",
      name: "tracking_points_session_id_recorded_at_idx",
      key: { session_id: 1, recorded_at: 1 },
    },
    {
      collection: "society_sitter_pools",
      name: "society_sitter_pools_society_id_status_idx",
      key: { society_id: 1, status: 1 },
    },
    {
      collection: "societies",
      name: "societies_city_locality_status_idx",
      key: { city: 1, locality: 1, status: 1 },
    },
  ];

  for (const { collection, name, key } of indexesToEnsure) {
    const coll = db.collection(collection);
    const existing = await coll.listIndexes().toArray();
    if (!existing.some((idx) => idx.name === name)) {
      await coll.createIndex(key, { name, background: true });
    }
  }
}

export async function down(db: Db): Promise<void> {
  // Additive migrations are non-destructive
}

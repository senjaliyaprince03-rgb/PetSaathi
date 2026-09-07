import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");

function getDbName(uriStr: string): string {
  if (process.env.MONGODB_DATABASE) return process.env.MONGODB_DATABASE;
  const url = new URL(uriStr);
  return decodeURIComponent(url.pathname.replace(/^\//, ""));
}

async function verifyQueryPlans() {
  console.log("🔍 [Task 3.1] Verifying MongoDB Query Plans & IXSCAN usage...\n");
  const client = new MongoClient(uri!);
  await client.connect();
  const db = client.db(getDbName(uri!));

  const checks = [
    {
      name: "Bookings by Status & CreatedAt",
      collection: "bookings",
      filter: { status: "CONFIRMED", created_at: { $gte: new Date(Date.now() - 86400000) } },
    },
    {
      name: "Bookings by Customer & Status",
      collection: "bookings",
      filter: { customer_id: "sample_cust", status: "CONFIRMED" },
    },
    {
      name: "Booking Assignments by Sitter & Status",
      collection: "booking_assignments",
      filter: { sitter_id: "sample_sitter", status: "ACCEPTED" },
    },
    {
      name: "Tracking Sessions by BookingId",
      collection: "tracking_sessions",
      filter: { booking_id: "sample_booking" },
    },
    {
      name: "Tracking Points by Session & Timestamp",
      collection: "tracking_points",
      filter: { session_id: "sample_session", recorded_at: { $gte: new Date(Date.now() - 3600000) } },
    },
    {
      name: "Societies by City, Locality & Status",
      collection: "societies",
      filter: { city: "Ahmedabad", locality: "Prahlad Nagar", status: "ACTIVE" },
    },
  ];

  let allIxScan = true;

  for (const check of checks) {
    const coll = db.collection(check.collection);
    const explain: any = await coll.find(check.filter).explain("executionStats");
    const executionStages = explain.executionStats?.executionStages;
    
    // Check if stage or inputStage is IXSCAN
    const stageUsed = executionStages?.stage === "IXSCAN" 
      ? "IXSCAN" 
      : (executionStages?.inputStage?.stage || executionStages?.stage || "UNKNOWN");

    const indexName = executionStages?.indexName || executionStages?.inputStage?.indexName || "N/A";

    console.log(`Query: ${check.name.padEnd(45)} Stage: ${stageUsed.padEnd(10)} Index: ${indexName}`);
    if (stageUsed === "COLLSCAN") {
      allIxScan = false;
    }
  }

  await client.close();

  if (allIxScan) {
    console.log("\n✅ All audited query patterns leverage IXSCAN index scans!");
  } else {
    console.warn("\n⚠️ Some queries fell back to COLLSCAN; inspect index definitions.");
  }
}

verifyQueryPlans().catch((err) => {
  console.error("Index explain check failed:", err);
  process.exit(1);
});

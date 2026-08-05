// eslint-disable-next-line @typescript-eslint/no-require-imports
require("dotenv").config();
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { MongoClient } = require("mongodb");

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required to apply MongoDB indexes.");

const partialUniqueIndexes = [
  ["users", "users_email_key", { email: 1 }, { email: { $type: "string" } }],
  ["users", "users_phone_e164_key", { phone_e164: 1 }, { phone_e164: { $type: "string" } }],
  ["payments", "payments_provider_payment_id_key", { provider_payment_id: 1 }, { provider_payment_id: { $type: "string" } }],
  ["refunds", "refunds_provider_refund_id_key", { provider_refund_id: 1 }, { provider_refund_id: { $type: "string" } }],
  ["upload_objects", "upload_objects_destination_path_key", { destination_path: 1 }, { destination_path: { $type: "string" } }],
  ["plan_versions", "plan_versions_provider_plan_id_key", { provider_plan_id: 1 }, { provider_plan_id: { $type: "string" } }],
  ["subscriptions", "subscriptions_provider_subscription_id_key", { provider_subscription_id: 1 }, { provider_subscription_id: { $type: "string" } }],
  ["referrals", "referrals_referred_id_key", { referred_id: 1 }, { referred_id: { $type: "string" } }],
  ["testimonials", "testimonials_booking_id_key", { booking_id: 1 }, { booking_id: { $type: "string" } }],
  ["testimonials", "testimonials_consent_id_key", { consent_id: 1 }, { consent_id: { $type: "string" } }],
  ["incident_notifications", "incident_notifications_notification_id_key", { notification_id: 1 }, { notification_id: { $type: "string" } }],
  ["subscription_events", "subscription_events_provider_event_id_key", { provider_event_id: 1 }, { provider_event_id: { $type: "string" } }],
  ["authors", "authors_user_id_key", { user_id: 1 }, { user_id: { $type: "string" } }],
  ["contacts", "contacts_email_key", { email: 1 }, { email: { $type: "string" } }],
  ["contacts", "contacts_phone_e164_key", { phone_e164: 1 }, { phone_e164: { $type: "string" } }],
  ["benefit_ledger_entries", "benefit_ledger_entries_idempotency_key_key", { idempotency_key: 1 }, { idempotency_key: { $type: "string" } }],
  [
    "booking_assignments",
    "booking_assignments_one_active_per_booking",
    { booking_id: 1 },
    {
      type: { $in: ["PRIMARY", "REPLACEMENT"] },
      status: { $in: ["OFFERED", "ACCEPTED", "CUSTOMER_APPROVED", "ACTIVE"] },
    },
  ],
];

const collectionValidators = [
  [
    "incidents",
    {
      $comment: "incidents_closure_metadata_check",
      $expr: {
        $or: [
          { $ne: ["$status", "CLOSED"] },
          {
            $and: [
              { $eq: [{ $type: "$resolved_at" }, "date"] },
              { $eq: [{ $type: "$closed_at" }, "date"] },
              { $eq: [{ $type: "$closed_by" }, "string"] },
            ],
          },
        ],
      },
    },
  ],
  [
    "corrective_actions",
    {
      $comment: "corrective_actions_completion_evidence_check",
      $expr: {
        $or: [
          { $ne: [{ $type: "$completed_at" }, "date"] },
          { $eq: [{ $type: "$evidence" }, "object"] },
        ],
      },
    },
  ],
];

function databaseName() {
  const configured = process.env.MONGODB_DATABASE?.trim();
  if (configured) return configured;
  const pathname = new URL(uri).pathname.replace(/^\//, "");
  if (!pathname) throw new Error("MONGODB_DATABASE is required when MONGODB_URI has no database path.");
  return decodeURIComponent(pathname);
}

async function main() {
  const client = new MongoClient(uri, { appName: "PetSaathi index manager" });
  try {
    await client.connect();
    const database = client.db(databaseName());
    for (const [collectionName, name, key, partialFilterExpression] of partialUniqueIndexes) {
      const collection = database.collection(collectionName);
      const indexes = await collection.listIndexes().toArray();
      if (indexes.some((index) => index.name === name)) await collection.dropIndex(name);
      await collection.createIndex(key, { name, unique: true, partialFilterExpression });
    }
    for (const [collectionName, validator] of collectionValidators) {
      await database.command({
        collMod: collectionName,
        validator,
        validationLevel: "strict",
        validationAction: "error",
      });
    }
    console.log(
      `Applied ${partialUniqueIndexes.length} partial unique indexes and ${collectionValidators.length} collection validators.`,
    );
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error(`MongoDB index setup failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
});

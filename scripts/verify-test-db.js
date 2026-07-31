// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require("node:fs");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("node:path");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const DEFAULT_TEST_DATABASE_URL =
  "postgresql://petsaathi_test:test_password@127.0.0.1:55432/petsaathi_test";
const databaseUrl = process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL ?? DEFAULT_TEST_DATABASE_URL;

function assertDisposableDatabase(rawUrl) {
  const url = new URL(rawUrl);
  const localHost = url.hostname === "127.0.0.1" || url.hostname === "localhost";
  const testDatabase = url.pathname === "/petsaathi_test" || url.pathname === "/petsaathi_ci";

  if (!["postgres:", "postgresql:"].includes(url.protocol) || !localHost || !testDatabase) {
    throw new Error(
      "Refusing database verification: use a local disposable petsaathi_test or petsaathi_ci database."
    );
  }
}

const rlsRequiredTables = [
  "service_zones",
  "payment_mandates",
  "city_service_configurations",
  "zone_service_configurations",
  "service_credits",
  "service_credit_transactions",
  "match_scores",
  "health_timeline_events",
  "contacts",
  "lead_magnet_requests",
  "community_groups",
  "community_memberships",
  "organizations",
  "organization_contacts",
  "b2b_opportunities",
  "b2b_contracts",
  "partner_programmes",
  "programme_memberships",
  "programme_verification_tokens",
  "benefit_wallets",
  "benefit_ledger_entries",
  "promotion_codes",
  "enterprise_invoices",
  "city_financial_records",
  "city_health_scores",
  "city_managers",
  "provider_suspensions",
  "safety_audits",
  "operating_partners",
  "territories",
  "content_consent_records",
  "data_subject_requests",
  "data_retention_policies"
];

async function main() {
  assertDisposableDatabase(databaseUrl);
  const prisma = new PrismaClient({ datasourceUrl: databaseUrl });

  try {
    const migrationDirectories = fs
      .readdirSync(path.resolve("prisma/migrations"), { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name);

    const appliedMigrations = await prisma.$queryRawUnsafe(
      'SELECT migration_name FROM "_prisma_migrations" WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL'
    );
    const appliedNames = new Set(appliedMigrations.map((row) => row.migration_name));
    const missingMigrations = migrationDirectories.filter((name) => !appliedNames.has(name));
    if (missingMigrations.length > 0 || appliedNames.size !== migrationDirectories.length) {
      throw new Error(
        `Migration mismatch: expected ${migrationDirectories.length}, applied ${appliedNames.size}, missing ${missingMigrations.join(", ")}`
      );
    }

    const rlsRows = await prisma.$queryRawUnsafe(
      `SELECT c.relname AS table_name, c.relrowsecurity AS enabled
       FROM pg_class c
       JOIN pg_namespace n ON n.oid = c.relnamespace
       WHERE n.nspname = 'public' AND c.relkind = 'r'`
    );
    const rlsByTable = new Map(rlsRows.map((row) => [row.table_name, row.enabled]));
    const missingRls = rlsRequiredTables.filter((table) => rlsByTable.get(table) !== true);
    if (missingRls.length > 0) {
      throw new Error(`RLS is not enabled for: ${missingRls.join(", ")}`);
    }

    const tokenConstraints = await prisma.$queryRawUnsafe(
      `SELECT conname
       FROM pg_constraint
       WHERE conrelid = 'public.programme_verification_tokens'::regclass`
    );
    const constraintNames = new Set(tokenConstraints.map((row) => row.conname));
    const requiredConstraints = [
      "programme_verification_tokens_attempt_count_check",
      "programme_verification_tokens_max_attempts_check",
      "programme_verification_tokens_programme_id_fkey",
      "programme_verification_tokens_membership_id_fkey",
      "programme_verification_tokens_issued_by_fkey"
    ];
    const missingConstraints = requiredConstraints.filter((name) => !constraintNames.has(name));
    if (missingConstraints.length > 0) {
      throw new Error(`Verification-token constraints missing: ${missingConstraints.join(", ")}`);
    }

    console.log(
      `Database verification passed: ${appliedNames.size} migrations, ${rlsRequiredTables.length} RLS tables, ${requiredConstraints.length} token constraints.`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Database verification failed: ${message}`);
  process.exitCode = 1;
});

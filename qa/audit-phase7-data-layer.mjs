import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function auditDataLayer() {
  console.log("================================================================================");
  console.log("               PETSAATHI QA AUDIT — PHASE 7: DATA LAYER AUDIT                   ");
  console.log("================================================================================");

  const schemaContent = fs.readFileSync("prisma/schema.prisma", "utf8");

  // ---------------------------------------------------------------------------
  // 1. Schema & Index Audit
  // ---------------------------------------------------------------------------
  console.log("\n--- 1. Schema Model & Index Audit ---");

  // Parse models and their fields/indexes
  const modelBlocks = schemaContent.split(/model\s+/).slice(1);
  const unindexedForeignKeys = [];
  const floatMonetaryFields = [];
  const cascadeAudit = [];

  for (const block of modelBlocks) {
    const lines = block.split("\n");
    const modelName = lines[0].trim().split(/\s+/)[0];
    const fieldLines = lines.slice(1);

    const indexes = [];
    const fields = [];

    for (const rawLine of fieldLines) {
      const line = rawLine.trim();
      if (line.startsWith("@@index")) {
        indexes.push(line);
      } else if (line.startsWith("@@unique") || line.startsWith("@@id")) {
        indexes.push(line);
      } else if (line && !line.startsWith("//") && !line.startsWith("}")) {
        const parts = line.split(/\s+/);
        if (parts.length >= 2) {
          const fieldName = parts[0];
          const fieldType = parts[1];
          const attributes = parts.slice(2).join(" ");
          fields.push({ fieldName, fieldType, attributes });

          // Check for float money fields
          if (
            (fieldName.toLowerCase().includes("price") ||
              fieldName.toLowerCase().includes("amount") ||
              fieldName.toLowerCase().includes("fee")) &&
            !fieldName.endsWith("Paise") &&
            fieldType.toLowerCase() === "float"
          ) {
            floatMonetaryFields.push({ model: modelName, field: fieldName, type: fieldType });
          }

          // Check relations for onDelete behavior
          if (attributes.includes("@relation(")) {
            const hasOnDelete = attributes.includes("onDelete:");
            const onDeleteType = hasOnDelete ? attributes.match(/onDelete:\s*([A-Za-z]+)/)?.[1] : "None (Default Restrict/NoAction)";
            cascadeAudit.push({ model: modelName, field: fieldName, onDelete: onDeleteType });
          }
        }
      }
    }

    // Identify foreign keys (*Id) that are NOT indexed
    for (const f of fields) {
      if (
        f.fieldName.endsWith("Id") &&
        f.fieldName !== "id" &&
        !f.attributes.includes("@id") &&
        !f.attributes.includes("@unique")
      ) {
        const isIndexed = indexes.some((idx) => idx.includes(f.fieldName));
        if (!isIndexed) {
          unindexedForeignKeys.push({ model: modelName, field: f.fieldName });
        }
      }
    }
  }

  console.log(`Audited ${modelBlocks.length} models in prisma/schema.prisma`);
  console.log(`Unindexed foreign key / relation fields found: ${unindexedForeignKeys.length}`);
  if (unindexedForeignKeys.length > 0) {
    console.log("Sample unindexed foreign keys (first 10):", unindexedForeignKeys.slice(0, 10));
  }

  console.log(`Float monetary fields found: ${floatMonetaryFields.length}`);
  if (floatMonetaryFields.length > 0) {
    console.log("Float monetary fields:", floatMonetaryFields);
  }

  const defaultDeleteRelations = cascadeAudit.filter((c) => c.onDelete.startsWith("None"));
  console.log(`Relations lacking explicit onDelete cascade/setNull: ${defaultDeleteRelations.length} / ${cascadeAudit.length}`);

  // ---------------------------------------------------------------------------
  // 2. Unbounded Queries Audit (findMany without take)
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Unbounded Queries (findMany without take) ---");

  function getFiles(dir, exts = [".ts", ".tsx", ".mjs"]) {
    let files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const fullPath = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== "node_modules" && e.name !== ".next" && e.name !== "coverage") {
          files = files.concat(getFiles(fullPath, exts));
        }
      } else if (exts.some((ext) => e.name.endsWith(ext))) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const srcFiles = getFiles("src");
  const unboundedQueries = [];
  const nPlusOnePatterns = [];

  for (const file of srcFiles) {
    const code = fs.readFileSync(file, "utf8");
    const lines = code.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes(".findMany(") && !line.includes("//")) {
        // Collect statement across lines until matching closing parenthesis
        let statement = "";
        for (let j = i; j < Math.min(lines.length, i + 25); j++) {
          statement += lines[j] + " ";
          if (lines[j].includes("});") || lines[j].includes("})") || lines[j].includes("findMany()")) break;
        }

        if (!statement.includes("take:") && !statement.includes("take :")) {
          const relPath = path.relative(process.cwd(), file);
          unboundedQueries.push({ file: relPath, line: i + 1, snippet: line.trim() });
        }
      }

      // Check for N+1 query patterns: findUnique/findFirst/findMany inside loops
      if (
        (line.includes("for (") || line.includes(".map(") || line.includes(".forEach(")) &&
        !line.includes("//")
      ) {
        for (let k = i + 1; k < Math.min(lines.length, i + 15); k++) {
          if (
            (lines[k].includes("prisma.") || lines[k].includes("tx.")) &&
            (lines[k].includes(".findUnique") || lines[k].includes(".findFirst") || lines[k].includes(".findMany"))
          ) {
            const relPath = path.relative(process.cwd(), file);
            nPlusOnePatterns.push({
              file: relPath,
              loopLine: i + 1,
              queryLine: k + 1,
              snippet: lines[k].trim(),
            });
            break;
          }
        }
      }
    }
  }

  console.log(`Scanned ${srcFiles.length} source files.`);
  console.log(`Unbounded findMany queries detected: ${unboundedQueries.length}`);
  console.log("Sample unbounded queries (first 10):", unboundedQueries.slice(0, 10));

  console.log(`\nPotential N+1 loop query patterns detected: ${nPlusOnePatterns.length}`);
  console.log("Sample N+1 patterns (first 10):", nPlusOnePatterns.slice(0, 10));

  // ---------------------------------------------------------------------------
  // 3. Timezone & Date Boundary Audit
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Timezone & Date Boundary Audit ---");
  const timezoneBugs = [];

  for (const file of srcFiles) {
    const code = fs.readFileSync(file, "utf8");
    const lines = code.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // Check for ISO string split date extraction without timezone offset
      if (
        (line.includes("toISOString().split('T')[0]") || line.includes('toISOString().split("T")[0]')) &&
        !line.includes("utc") &&
        !line.includes("india")
      ) {
        const relPath = path.relative(process.cwd(), file);
        timezoneBugs.push({ file: relPath, line: i + 1, snippet: line.trim() });
      }
    }
  }
  console.log(`Timezone naive toISOString date-splitting locations: ${timezoneBugs.length}`);
  console.log("Timezone matches:", timezoneBugs);

  // ---------------------------------------------------------------------------
  // 4. Orphan Cascading & Deletion Integrity
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Orphan Cascading & Deletion Integrity Verification ---");

  // Check if deleting a customer user deletes or orphans bookings/payments
  // Inspect Prisma schema definitions for User relations
  const userModelSection = schemaContent.split(/model\s+User\s+{/)[1]?.split(/}\s*model/)[0] || "";
  const bookingRelation = userModelSection.match(/bookings\s+Booking\[\]/);
  const paymentRelation = userModelSection.match(/payments\s+Payment\[\]/);
  const petRelation = userModelSection.match(/pets\s+Pet\[\]/);

  console.log("User -> Bookings relation defined:", !!bookingRelation);
  console.log("User -> Pets relation defined:", !!petRelation);

  // Check Booking model for customer relation onDelete
  const bookingModelSection = schemaContent.split(/model\s+Booking\s+{/)[1]?.split(/}\s*model/)[0] || "";
  const customerOnDelete = bookingModelSection.match(/customer\s+User\s+@relation\([^)]+\)/)?.[0];
  console.log("Booking.customer relation definition:", customerOnDelete);

  // Check Pet model for owner relation onDelete
  const petModelSection = schemaContent.split(/model\s+Pet\s+{/)[1]?.split(/}\s*model/)[0] || "";
  const petOwnerOnDelete = petModelSection.match(/owner\s+User\s+@relation\([^)]+\)/)?.[0];
  console.log("Pet.owner relation definition:", petOwnerOnDelete);

  // ---------------------------------------------------------------------------
  // 5. PII Audit
  // ---------------------------------------------------------------------------
  console.log("\n--- 5. Sensitive Data & PII Exposure Audit ---");
  const piiFieldsInSchema = [];
  for (const block of modelBlocks) {
    const lines = block.split("\n");
    const modelName = lines[0].trim().split(/\s+/)[0];
    for (const rawLine of lines.slice(1)) {
      const line = rawLine.trim();
      if (
        (line.toLowerCase().includes("aadhaar") ||
          line.toLowerCase().includes("pan") ||
          line.toLowerCase().includes("passport") ||
          line.toLowerCase().includes("bankaccount") ||
          line.toLowerCase().includes("accountnumber")) &&
        !line.startsWith("//") &&
        !line.startsWith("@@")
      ) {
        piiFieldsInSchema.push({ model: modelName, field: line });
      }
    }
  }
  console.log("PII / Sensitive identifier fields in schema:", piiFieldsInSchema);

  console.log("================================================================================");
}

auditDataLayer()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });

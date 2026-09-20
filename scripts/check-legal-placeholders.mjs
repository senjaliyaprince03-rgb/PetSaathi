import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const LEGAL_FILES = [
  "src/app/terms/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/refund-policy/page.tsx",
];

export function checkLegalPlaceholders() {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    process.env.FAIL_ON_LEGAL_PLACEHOLDERS === "true";

  const uncompleted = [];

  for (const relPath of LEGAL_FILES) {
    const fullPath = path.join(projectRoot, relPath);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, "utf8");
    const matches = content.match(/\[TO BE COMPLETED:[^\]]+\]/g);
    if (matches && matches.length > 0) {
      uncompleted.push({
        file: relPath,
        tokens: [...new Set(matches)],
      });
    }
  }

  if (uncompleted.length > 0) {
    console.log("\n================================================================================");
    console.log("             STATUTORY & LEGAL DISCLOSURES AUDIT (BUG-034 / BUG-035)            ");
    console.log("================================================================================");
    console.log(`Found ${uncompleted.reduce((acc, u) => acc + u.tokens.length, 0)} uncompleted statutory placeholder token(s):`);
    for (const u of uncompleted) {
      console.log(`\n  File: ${u.file}`);
      u.tokens.forEach((t) => console.log(`    - ${t}`));
    }
    console.log("\nRefer to qa/NEEDS_FROM_OWNER.md for the complete list of required statutory inputs.");

    if (isProduction) {
      console.error(
        "\n[FATAL] Production build rejected: Statutory placeholders are still present in legal pages.",
      );
      console.error(
        "Under Consumer Protection (E-Commerce) Rules 2020 and DPDP Act 2023, live deployments must furnish real corporate & grievance officer details.",
      );
      process.exit(1);
    } else {
      console.warn(
        "\n[NOTICE] Non-production build allowed with placeholder warnings. Production builds (VERCEL_ENV=production or FAIL_ON_LEGAL_PLACEHOLDERS=true) will enforce hard failure.\n",
      );
    }
  } else {
    console.log("✔ All statutory and legal disclosures in legal pages are complete.");
  }
}

// Run directly if called as a script
if (process.argv[1] && process.argv[1].endsWith("check-legal-placeholders.mjs")) {
  checkLegalPlaceholders();
}

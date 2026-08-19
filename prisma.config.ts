import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
import path from "node:path";
import { preparePrismaEnvironment } from "./scripts/prepare-prisma-uri.mjs";

// Keep Prisma CLI aligned with the app/doctor while preserving an explicit CI/test URI.
dotenv.config({ path: path.resolve(process.cwd(), ".env"), quiet: true });
dotenv.config({
  path: path.resolve(process.cwd(), ".env.local"),
  // Never replace MONGODB_URI supplied by the disposable integration-test runner.
  override: false,
  quiet: true,
});

// Let Windows Prisma commands use the same direct Atlas fallback as app startup.
await preparePrismaEnvironment(process.env);
if (process.env.MONGODB_PRISMA_URI) {
  process.env.MONGODB_URI = process.env.MONGODB_PRISMA_URI;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: "node prisma/seed.mjs"
  }
});

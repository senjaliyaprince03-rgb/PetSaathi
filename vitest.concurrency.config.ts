import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./tests/server-only.ts", import.meta.url))
    }
  },
  test: {
    include: ["tests/concurrency/**/*.test.ts"],
    environment: "node",
    pool: "forks",
    poolOptions: {
      forks: { singleFork: true }
    },
    env: {
      NODE_ENV: "test",
      MONGODB_URI: "mongodb://127.0.0.1:47017/petsaathi_test?replicaSet=rs0&directConnection=true",
      MONGODB_DATABASE: "petsaathi_test"
    },
    testTimeout: 30000
  }
});

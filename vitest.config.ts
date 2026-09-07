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
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx", "tests/concurrency/**/*.test.ts"],
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    env: {
      NODE_ENV: "test",
      MONGODB_URI: "mongodb://127.0.0.1:27017/petsaathi_test",
      MONGODB_DATABASE: "petsaathi_test"
    },
    coverage: {
      provider: "v8",
      all: true,
      reporter: ["text", "json", "html"],
      include: ["src/modules/**/*.ts"],
      thresholds: {
        lines: 10,
        functions: 55,
        branches: 65,
        statements: 10
      }
    }
  }
});

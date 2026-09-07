import { describe, it, expect, vi } from "vitest";
import { logger } from "../../src/lib/observability/logger";
import { GET } from "../../src/app/api/health/route";

describe("Logging & Health Check (Task 4.4)", () => {
  describe("StructuredLogger", () => {
    it("emits structured JSON logs with all required metadata fields", () => {
      const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});

      const entry = logger.info("booking_payment_captured", {
        requestId: "req-12345",
        userId: "user-67890",
        durationMs: 42,
        metadata: { amountPaise: 29900 },
      });

      expect(entry.service).toBe("petsaathi-api");
      expect(entry.level).toBe("INFO");
      expect(entry.action).toBe("booking_payment_captured");
      expect(entry.requestId).toBe("req-12345");
      expect(entry.userId).toBe("user-67890");
      expect(entry.durationMs).toBe(42);
      expect(entry).toHaveProperty("timestamp");

      consoleSpy.mockRestore();
    });

    it("captures error stacks properly on error logs", () => {
      const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

      const err = new Error("Database timeout");
      const entry = logger.error("transaction_rollback", {
        error: err,
        durationMs: 150,
      });

      expect(entry.level).toBe("ERROR");
      expect(entry.error?.message).toBe("Database timeout");
      expect(entry.error?.name).toBe("Error");

      errorSpy.mockRestore();
    });
  });

  describe("/api/health endpoint", () => {
    it("returns status 200 with ok status, db connected, and uptime", async () => {
      const response = await GET();
      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.status).toBe("ok");
      expect(json.db).toBe("connected");
      expect(json.uptime).toBeGreaterThanOrEqual(0);
      expect(json.version).toBeDefined();
      expect(json.timestamp).toBeDefined();
    });
  });
});

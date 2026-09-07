import { vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { assertSafeDatabase } from "@/lib/db";

// Ensure tests always run with NODE_ENV=test
(process.env as Record<string, string | undefined>).NODE_ENV = "test";

// Enforce that any configured database in the test environment targets a safe, disposable database
assertSafeDatabase();

vi.mock('@sentry/nextjs', () => ({ init: vi.fn(), captureException: vi.fn(), setUser: vi.fn(), captureMessage: vi.fn() }));

export interface MemoryRateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export interface MemoryRateLimiter {
  limit: (identifier: string) => Promise<MemoryRateLimitResult>;
}

const MAX_TRACKED_KEYS = 10_000;

/**
 * Bounded in-memory fixed-window rate limiter for environments without a
 * shared store (edge middleware without Upstash). Never allow-all: it keeps
 * abuse protection active per instance. Evicts expired keys once the key
 * budget is exceeded so memory stays bounded.
 */
export function createMemoryRateLimiter(
  limit: number,
  windowMs: number,
  options: { onFirstUseWarn?: string } = {},
): MemoryRateLimiter {
  const hits = new Map<string, { count: number; reset: number }>();
  let warned = false;

  return {
    async limit(identifier: string): Promise<MemoryRateLimitResult> {
      if (options.onFirstUseWarn && !warned) {
        warned = true;
        if (process.env.NODE_ENV === "production") {
          console.warn(options.onFirstUseWarn);
        }
      }

      const now = Date.now();
      if (hits.size >= MAX_TRACKED_KEYS) {
        let scanned = 0;
        let evicted = 0;
        for (const [key, entry] of hits) {
          scanned += 1;
          if (entry.reset <= now) {
            hits.delete(key);
            evicted += 1;
          }
          if (evicted >= MAX_TRACKED_KEYS / 2 || scanned >= MAX_TRACKED_KEYS / 2) break;
        }
        // Nothing expired (e.g. frozen clocks): drop the oldest half — Map
        // preserves insertion order, so these are the least-recently added.
        if (hits.size >= MAX_TRACKED_KEYS) {
          let toDelete = Math.floor(hits.size / 2);
          for (const key of hits.keys()) {
            if (toDelete-- <= 0) break;
            hits.delete(key);
          }
        }
      }

      const entry = hits.get(identifier);
      if (!entry || entry.reset <= now) {
        hits.set(identifier, { count: 1, reset: now + windowMs });
        return { success: true, limit, remaining: limit - 1, reset: now + windowMs };
      }

      entry.count += 1;
      return {
        success: entry.count <= limit,
        limit,
        remaining: Math.max(0, limit - entry.count),
        reset: entry.reset,
      };
    },
  };
}

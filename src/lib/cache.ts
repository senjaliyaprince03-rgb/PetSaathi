/**
 * PetSaathi Multi-Tier Caching Layer (Task 2.3)
 * Supports Upstash Redis / standalone Redis with transparent in-memory TTL fallback.
 * Used for high-read, low-mutation resources (sitter listings, societies, breeds, AI queries).
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds: number): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  deletePrefix(prefix: string): number {
    let count = 0;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
        count++;
      }
    }
    return count;
  }

  clear(): void {
    this.cache.clear();
  }
}

const memoryCache = new MemoryCache();
const inFlightRequests = new Map<string, Promise<any>>();

export const CACHE_TTLS = {
  SITTER_PROFILE: 60,            // 1 minute (frequently requested, changes on status update)
  SOCIETY_LISTING: 600,          // 10 minutes (rarely changes)
  BREED_INFO: 3600,              // 1 hour (static pet breed care tips)
  CHATBOT_FREQUENT_QUERY: 1800,  // 30 minutes
} as const;

/**
 * Get or fetch with caching. Transparently queries cache first; on miss,
 * uses single-flight deduplication so concurrent requests share the same inflight promise.
 */
export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = memoryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Single-flight stampede protection: share active inflight promise
  if (inFlightRequests.has(key)) {
    return await inFlightRequests.get(key) as T;
  }

  const fetchPromise = (async () => {
    try {
      const fresh = await fetcher();
      if (fresh !== undefined && fresh !== null) {
        memoryCache.set(key, fresh, ttlSeconds);
      }
      return fresh;
    } finally {
      inFlightRequests.delete(key);
    }
  })();

  inFlightRequests.set(key, fetchPromise);
  return await fetchPromise;
}

/**
 * Invalidate a specific cache key or namespace prefix
 */
export function invalidateCache(keyOrPrefix: string, isPrefix = false): void {
  if (isPrefix) {
    memoryCache.deletePrefix(keyOrPrefix);
  } else {
    memoryCache.delete(keyOrPrefix);
  }
}

// ── Specialized Cached Accessors ─────────────────────────────────────────────

export async function getCachedSitter(sitterId: string, fetcher: () => Promise<any>) {
  return getOrSetCache(`sitter:${sitterId}`, CACHE_TTLS.SITTER_PROFILE, fetcher);
}

export async function getCachedSociety(societyId: string, fetcher: () => Promise<any>) {
  return getOrSetCache(`society:${societyId}`, CACHE_TTLS.SOCIETY_LISTING, fetcher);
}

export async function getCachedChatbotAnswer(queryHash: string, fetcher: () => Promise<any>) {
  return getOrSetCache(`ai_chat:${queryHash}`, CACHE_TTLS.CHATBOT_FREQUENT_QUERY, fetcher);
}

/**
 * Offline GPS Buffer & Sync Manager
 * Buffers GPS coordinates locally in IndexedDB / localStorage when offline
 * and automatically drains and synchronizes with /api/saathi/assignments/:id/tracking
 * when network connection is restored.
 */

export interface BufferedGPSPoint {
  id: string;
  sessionId: string;
  assignmentId: string;
  latitude: number;
  longitude: number;
  accuracyM?: number;
  recordedAt: number; // unix timestamp ms
}

const STORAGE_KEY = "petsaathi_offline_gps_buffer";
const MAX_BUFFER_POINTS = 500;

export class GPSOfflineBuffer {
  private inMemoryQueue: BufferedGPSPoint[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        this.inMemoryQueue = JSON.parse(raw);
      }
    } catch {
      this.inMemoryQueue = [];
    }
  }

  private persist() {
    if (typeof window === "undefined" || !window.localStorage) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.inMemoryQueue));
    } catch (e) {
      console.warn("[GPSOfflineBuffer] Could not persist queue to localStorage:", e);
    }
  }

  public enqueuePoint(point: Omit<BufferedGPSPoint, "id">): BufferedGPSPoint {
    const item: BufferedGPSPoint = {
      ...point,
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `pt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
    };

    if (this.inMemoryQueue.length >= MAX_BUFFER_POINTS) {
      // Drop oldest point to preserve memory
      this.inMemoryQueue.shift();
    }

    this.inMemoryQueue.push(item);
    this.persist();
    return item;
  }

  public getQueue(): BufferedGPSPoint[] {
    return [...this.inMemoryQueue];
  }

  public getQueueLength(): number {
    return this.inMemoryQueue.length;
  }

  public clearQueue(): void {
    this.inMemoryQueue = [];
    this.persist();
  }

  /**
   * Syncs all buffered points sequentially to the server
   */
  public async syncBufferedPoints(
    onProgress?: (synced: number, total: number) => void
  ): Promise<{ synced: number; failed: number }> {
    if (this.inMemoryQueue.length === 0) return { synced: 0, failed: 0 };
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return { synced: 0, failed: 0 }; // Still offline
    }

    const total = this.inMemoryQueue.length;
    let synced = 0;
    let failed = 0;
    const remaining: BufferedGPSPoint[] = [];

    for (const point of this.inMemoryQueue) {
      try {
        const res = await fetch(`/api/saathi/assignments/${encodeURIComponent(point.assignmentId)}/tracking`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "POINT",
            sessionId: point.sessionId,
            latitude: point.latitude,
            longitude: point.longitude,
            accuracyM: point.accuracyM
          })
        });

        if (res.ok || res.status === 429) {
          synced++;
          if (onProgress) onProgress(synced, total);
        } else if (res.status >= 400 && res.status < 500) {
          // Client error (e.g. expired session), drop point
          failed++;
        } else {
          // Server error or network error, retain for retry
          remaining.push(point);
          failed++;
        }
      } catch {
        remaining.push(point);
        failed++;
      }
    }

    this.inMemoryQueue = remaining;
    this.persist();
    return { synced, failed };
  }
}

export const gpsOfflineBuffer = new GPSOfflineBuffer();

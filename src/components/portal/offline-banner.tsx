"use client";

import React, { useCallback, useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { gpsOfflineBuffer } from "@/lib/offline/gps-buffer";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [bufferedCount, setBufferedCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await gpsOfflineBuffer.syncBufferedPoints();
      setBufferedCount(gpsOfflineBuffer.getQueueLength());
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateOnlineStatus = () => {
      const offline = !navigator.onLine;
      setIsOffline(offline);
      setBufferedCount(gpsOfflineBuffer.getQueueLength());

      if (!offline && gpsOfflineBuffer.getQueueLength() > 0) {
        // Auto-sync when coming back online
        handleSync();
      }
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    updateOnlineStatus();

    const interval = setInterval(() => {
      setBufferedCount(gpsOfflineBuffer.getQueueLength());
    }, 5000);

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
      clearInterval(interval);
    };
  }, [handleSync]);

  if (!isOffline && bufferedCount === 0) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-600 text-white px-4 py-2.5 text-sm font-medium shadow-md flex items-center justify-between transition-all"
    >
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 shrink-0 animate-pulse" />
        <span>
          {isOffline
            ? "You are currently offline. Actions and GPS coordinates are buffered locally."
            : `Network restored. ${bufferedCount} offline coordinate(s) ready to sync.`}
        </span>
      </div>

      {!isOffline && bufferedCount > 0 && (
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="ml-4 px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
          {isSyncing ? "Syncing..." : "Sync Now"}
        </button>
      )}
    </div>
  );
}

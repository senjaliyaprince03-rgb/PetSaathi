/**
 * Malware Scanner Adapter
 * Provides interface for scanning uploaded files for viruses/malware
 */

import "server-only";

export type ScanResult = {
  status: "CLEAN" | "INFECTED" | "ERROR";
  details?: string;
  detectedThreats?: string[];
  scannerProvider?: string;
};

/**
 * Scanner adapter interface
 * Implementations can use ClamAV, VirusTotal, or other scanning services
 */
export interface ScannerAdapter {
  /**
   * Scan a file for malware
   * @param filePath Path to file on local filesystem or temp storage
   * @returns Scan result with status
   */
  scan(filePath: string): Promise<ScanResult>;

  /**
   * Check if scanner is available/healthy
   */
  isAvailable(): Promise<boolean>;
}

/**
 * ClamAV Scanner Adapter
 * Requires ClamAV daemon running (clamav-daemon)
 */
export class ClamAVAdapter implements ScannerAdapter {
  private host: string;
  private port: number;

  constructor(
    host: string = process.env.CLAMAV_HOST ?? "localhost",
    port: number = Number(process.env.CLAMAV_PORT ?? 3310)
  ) {
    this.host = host;
    this.port = port;
  }

  async scan(filePath: string): Promise<ScanResult> {
    try {
      // In production, use clamscan library or direct TCP connection
      // For now, return a placeholder indicating ClamAV integration needed
      throw new Error("ClamAV integration requires clamscan library");
    } catch (error) {
      console.error("[ClamAV] Scan error:", error);
      return {
        status: "ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
        scannerProvider: "clamav"
      };
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Ping ClamAV daemon
      // In production, establish TCP connection to check availability
      return false; // Not implemented yet
    } catch {
      return false;
    }
  }
}

/**
 * Mock Scanner Adapter for Development/Testing
 * Always returns CLEAN unless filename contains "virus" or "malware"
 */
export class MockScannerAdapter implements ScannerAdapter {
  async scan(filePath: string): Promise<ScanResult> {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const fileName = filePath.toLowerCase();
    
    // Simulate malware detection for test files
    if (fileName.includes("virus") || fileName.includes("malware") || fileName.includes("eicar")) {
      return {
        status: "INFECTED",
        details: "Mock virus detected (test mode)",
        detectedThreats: ["Test.EICAR"],
        scannerProvider: "mock"
      };
    }

    return {
      status: "CLEAN",
      details: "No threats detected (test mode)",
      scannerProvider: "mock"
    };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

/**
 * Manual Scanner Adapter (Admin Review)
 * Files are marked as pending until admin manually reviews
 */
export class ManualScannerAdapter implements ScannerAdapter {
  async scan(filePath: string): Promise<ScanResult> {
    // Manual review required - return ERROR to keep in pending state
    return {
      status: "ERROR",
      details: "Manual admin review required",
      scannerProvider: "manual"
    };
  }

  async isAvailable(): Promise<boolean> {
    return true;
  }
}

/**
 * Get configured scanner adapter
 * Returns appropriate scanner based on environment configuration
 */
export function getScannerAdapter(): ScannerAdapter {
  const mode = process.env.SCANNER_MODE;

  if (mode === "clamav" || process.env.CLAMAV_HOST) {
    return new ClamAVAdapter();
  }

  if (mode === "manual") {
    return new ManualScannerAdapter();
  }

  // Default to mock scanner in development
  if (process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test") {
    return new MockScannerAdapter();
  }

  // Production without ClamAV configured - use manual review
  console.warn("[Scanner] No scanner configured, using manual review mode");
  return new ManualScannerAdapter();
}

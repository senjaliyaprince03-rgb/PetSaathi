/**
 * GPS Tracking Validation
 * Validates coordinates, timestamps, and detects impossible movements
 */

import "server-only";

/**
 * Geographic bounds for India
 * Latitude: 8°N to 37°N
 * Longitude: 68°E to 97°E
 */
const INDIA_BOUNDS = {
  minLat: 8,
  maxLat: 37,
  minLon: 68,
  maxLon: 97
};

/**
 * Maximum realistic speed for pet care services (in km/h)
 * Allows for driving but detects teleportation/spoofing
 */
const MAX_REALISTIC_SPEED_KMH = 120;

/**
 * Maximum age for GPS points (in milliseconds)
 * Reject points older than 5 minutes to prevent replay attacks
 */
const MAX_POINT_AGE_MS = 5 * 60 * 1000;

/**
 * Validate GPS coordinates are within India bounds
 */
export function validateCoordinates(latitude: number, longitude: number): void {
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Invalid coordinates: must be finite numbers");
  }

  if (latitude < INDIA_BOUNDS.minLat || latitude > INDIA_BOUNDS.maxLat) {
    throw new Error(
      `Latitude ${latitude} is outside India bounds (${INDIA_BOUNDS.minLat}°N to ${INDIA_BOUNDS.maxLat}°N)`
    );
  }

  if (longitude < INDIA_BOUNDS.minLon || longitude > INDIA_BOUNDS.maxLon) {
    throw new Error(
      `Longitude ${longitude} is outside India bounds (${INDIA_BOUNDS.minLon}°E to ${INDIA_BOUNDS.maxLon}°E)`
    );
  }
}

/**
 * Calculate distance between two GPS points using Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Calculate speed between two GPS points
 * Returns speed in km/h
 */
export function calculateSpeed(
  lat1: number,
  lon1: number,
  timestamp1: Date,
  lat2: number,
  lon2: number,
  timestamp2: Date
): number {
  const distanceMeters = calculateDistance(lat1, lon1, lat2, lon2);
  const timeDiffMs = timestamp2.getTime() - timestamp1.getTime();
  const timeDiffHours = timeDiffMs / (1000 * 60 * 60);

  if (timeDiffHours === 0) return 0;

  const distanceKm = distanceMeters / 1000;
  return distanceKm / timeDiffHours;
}

/**
 * Detect impossible speed (teleportation/spoofing)
 */
export function detectImpossibleSpeed(
  previousPoint: { latitude: number; longitude: number; recordedAt: Date },
  currentPoint: { latitude: number; longitude: number; recordedAt: Date }
): { impossible: boolean; speedKmh: number } {
  const speedKmh = calculateSpeed(
    previousPoint.latitude,
    previousPoint.longitude,
    previousPoint.recordedAt,
    currentPoint.latitude,
    currentPoint.longitude,
    currentPoint.recordedAt
  );

  return {
    impossible: speedKmh > MAX_REALISTIC_SPEED_KMH,
    speedKmh
  };
}

/**
 * Validate GPS timestamp is not stale
 */
export function validateTimestamp(recordedAt: Date): void {
  const now = new Date();
  const age = now.getTime() - recordedAt.getTime();

  if (age > MAX_POINT_AGE_MS) {
    throw new Error(
      `GPS point is too old: ${Math.floor(age / 1000)}s (max ${MAX_POINT_AGE_MS / 1000}s)`
    );
  }

  if (age < 0) {
    throw new Error("GPS point timestamp is in the future");
  }
}

/**
 * Validate GPS accuracy is reasonable
 */
export function validateAccuracy(accuracyM: number | null | undefined): void {
  if (accuracyM !== null && accuracyM !== undefined) {
    if (accuracyM < 0) {
      throw new Error("Accuracy must be non-negative");
    }

    if (accuracyM > 1000) {
      throw new Error("Accuracy is too low (>1000m) for reliable tracking");
    }
  }
}

/**
 * Comprehensive GPS point validation
 */
export function validateGPSPoint(point: {
  latitude: number;
  longitude: number;
  recordedAt: Date;
  accuracyM?: number | null;
}): void {
  validateCoordinates(point.latitude, point.longitude);
  validateTimestamp(point.recordedAt);
  validateAccuracy(point.accuracyM);
}

/**
 * Check if a point is a duplicate (same location and time)
 */
export function isDuplicatePoint(
  previousPoint: { latitude: number; longitude: number; recordedAt: Date },
  currentPoint: { latitude: number; longitude: number; recordedAt: Date }
): boolean {
  // Check if timestamps are within 1 second
  const timeDiff = Math.abs(
    currentPoint.recordedAt.getTime() - previousPoint.recordedAt.getTime()
  );
  if (timeDiff > 1000) return false;

  // Check if coordinates are within 1 meter
  const distance = calculateDistance(
    previousPoint.latitude,
    previousPoint.longitude,
    currentPoint.latitude,
    currentPoint.longitude
  );
  return distance < 1;
}

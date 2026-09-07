// mobile/tasks/gps-tracking.ts
// Background GPS tracking task for React Native / Expo

export const TRACKING_TASK = "PETSAATHI_GPS_TRACKING";

interface LocationCoordinate {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  timestamp: number;
}

export async function sendTrackingPing(
  apiBaseUrl: string,
  assignmentId: string,
  authToken: string,
  coord: LocationCoordinate
) {
  try {
    const response = await fetch(
      `${apiBaseUrl}/api/saathi/assignments/${assignmentId}/tracking`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          latitude: coord.latitude,
          longitude: coord.longitude,
          accuracy: coord.accuracy,
          speed: coord.speed,
          timestamp: coord.timestamp,
        }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error("[GPS Task] Failed to send coordinate:", error);
    return false;
  }
}

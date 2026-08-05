export type MapProvider = "disabled" | "openstreetmap" | "google" | "mapbox";

export const MAP_PROVIDER = 
  (process.env.NEXT_PUBLIC_MAP_PROVIDER as MapProvider) ?? "disabled";

export const MAP_CONFIG = {
  // Default center — India (adjust for PetSaathi)
  defaultCenter: { lat: 20.5937, lng: 78.9629 },
  defaultZoom: 5,
};

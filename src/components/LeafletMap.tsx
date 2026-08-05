"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css"; // import Leaflet styles

interface Props {
  lat: number;
  lng: number;
  zoom: number;
  markers: { lat: number; lng: number; label?: string }[];
}

export default function LeafletMap({ lat, lng, zoom, markers }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamic import to avoid SSR issues with Leaflet
    import("leaflet").then((L) => {
      // Prevent double initialization in React StrictMode
      if (!mapRef.current || (mapRef.current as any)._leaflet_id) return;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Initialize map
      const map = L.map(mapRef.current).setView([lat, lng], zoom);
      mapInstanceRef.current = map;

      // Add OpenStreetMap tiles (completely free)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      // Add markers (e.g. pet sitter locations)
      markers.forEach(({ lat, lng, label }) => {
        const marker = L.marker([lat, lng]).addTo(map);
        if (label) marker.bindPopup(label); // show name on click
      });
    });

    // Cleanup on unmount
    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
    };
  }, [lat, lng, zoom, markers]);

  return <div ref={mapRef} className="w-full h-64 rounded-lg z-0" />;
}

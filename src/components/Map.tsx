"use client";

import { useEffect, useState } from "react";
import { MAP_PROVIDER, MAP_CONFIG } from "@/lib/map-config";
import dynamic from "next/dynamic";

// Map provider components
const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface MapProps {
  lat?: number;
  lng?: number;
  zoom?: number;
  markers?: { lat: number; lng: number; label?: string }[];
}

export default function Map({
  lat = MAP_CONFIG.defaultCenter.lat,
  lng = MAP_CONFIG.defaultCenter.lng,
  zoom = MAP_CONFIG.defaultZoom,
  markers = [],
}: MapProps) {

  // Maps are disabled — show placeholder
  if (MAP_PROVIDER === "disabled") {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
        Map not available
      </div>
    );
  }

  // OpenStreetMap via Leaflet
  if (MAP_PROVIDER === "openstreetmap") {
    return <LeafletMap lat={lat} lng={lng} zoom={zoom} markers={markers} />;
  }

  return null;
}

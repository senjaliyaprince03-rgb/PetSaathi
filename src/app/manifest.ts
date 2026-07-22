import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PetSaathi",
    short_name: "PetSaathi",
    description: "Managed local pet care with structured service proof and human support.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf1",
    theme_color: "#f4b134",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icons/icon-512.svg", sizes: "512x512", type: "image/svg+xml" }
    ]
  };
}

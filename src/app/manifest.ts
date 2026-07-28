import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PetSaathi",
    short_name: "PetSaathi",
    description: "Managed local pet care with structured service proof and human support.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffdf8",
    theme_color: "#5b3d7a",
    orientation: "portrait-primary",
    icons: [
      { src: "/icons/petsaathi-favicon-v2.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/petsaathi-app-icon-v2.png", sizes: "512x512", type: "image/png" }
    ]
  };
}

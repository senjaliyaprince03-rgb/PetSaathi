import type { MetadataRoute } from "next";

import { publicEnv } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Every middleware-protected portal prefix. Public marketing pages stay
      // crawlable. NOTE: the Saathi portal lives at /saathi/ (not /sitter/).
      disallow: [
        "/admin/",
        "/addresses",
        "/bookings",
        "/customer/",
        "/dashboard",
        "/notifications",
        "/operator/",
        "/partners/",
        "/pets",
        "/saathi/",
        "/settings/",
        "/society/",
        "/support",
        "/api/"
      ]
    },
    sitemap: `${publicEnv.NEXT_PUBLIC_APP_URL}/sitemap.xml`
  };
}

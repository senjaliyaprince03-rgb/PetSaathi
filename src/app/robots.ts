import type { MetadataRoute } from "next";

import { getCanonicalBaseUrl } from "@/lib/app-url";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getCanonicalBaseUrl();
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
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

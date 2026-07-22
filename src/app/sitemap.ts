import type { MetadataRoute } from "next";

import { publicEnv } from "@/lib/env";
import { isDatabaseConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = publicEnv.NEXT_PUBLIC_APP_URL;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    "", "/services", "/safety", "/about", "/become-a-saathi", "/societies", "/journal"
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  if (!isDatabaseConfigured()) return staticPages;

  // Dynamic city pages
  const cities = await prisma.city.findMany({
    where: { status: { notIn: ["RESEARCH", "EXITED"] } },
    select: {
      slug: true,
      updatedAt: true,
      cityServiceConfigs: {
        where: { status: { in: ["ACTIVE", "ACTIVE_LIMITED", "MANUAL_BETA"] } },
        select: { serviceType: { select: { code: true } } },
      },
    },
  });

  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/cities/${city.slug}`,
    lastModified: city.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const cityServicePages: MetadataRoute.Sitemap = cities.flatMap((city) =>
    city.cityServiceConfigs.map((config) => ({
      url: `${baseUrl}/cities/${city.slug}/${config.serviceType.code.toLowerCase().replaceAll("_", "-")}`,
      lastModified: city.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }))
  );

  // Dynamic journal pages
  const articles = await prisma.contentEntry.findMany({
    where: { status: "PUBLISHED" },
    select: { slug: true, updatedAt: true },
  });

  const journalPages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/journal/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...cityPages, ...cityServicePages, ...journalPages];
}

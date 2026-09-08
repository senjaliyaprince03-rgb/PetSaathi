import type { MetadataRoute } from "next";

import { publicEnv } from "@/lib/env";
import { getCanonicalBaseUrl } from "@/lib/app-url";
import { isDatabaseConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// Exclude test/seed data from the public sitemap (test-city, test-pricing-city,
// c-1786528… auto-generated seed IDs, etc.). Search engines must never see them.
const isProductionSlug = (slug: string): boolean =>
  !slug.startsWith("test-") && !/^c-\d+$/.test(slug);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getCanonicalBaseUrl();

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

  const cityPages: MetadataRoute.Sitemap = cities
    .filter((city) => isProductionSlug(city.slug))
    .map((city) => ({
      url: `${baseUrl}/cities/${city.slug}`,
      lastModified: city.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

  const cityServicePages: MetadataRoute.Sitemap = cities
    .filter((city) => isProductionSlug(city.slug))
    .flatMap((city) =>
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

  const journalPages: MetadataRoute.Sitemap = articles
    .filter((article) => isProductionSlug(article.slug))
    .map((article) => ({
      url: `${baseUrl}/journal/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

  return [...staticPages, ...cityPages, ...cityServicePages, ...journalPages];
}

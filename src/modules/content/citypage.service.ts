import { PrismaClient, ContentStatus } from "@prisma/client";
import { ContentError } from "./cms.service";

const prisma = new PrismaClient();

export async function createCityPage(
  cityId: string,
  contentEntryId: string,
  pageType: string
) {
  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city) {
    throw new ContentError("city_not_found", "City not found.");
  }

  const entry = await prisma.contentEntry.findUnique({ where: { id: contentEntryId } });
  if (!entry) {
    throw new ContentError("entry_not_found", "Content entry not found.");
  }

  return await prisma.cityPage.create({
    data: {
      cityId,
      contentEntryId,
      pageType,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });
}

export async function getCityPages(cityId: string) {
  return await prisma.cityPage.findMany({
    where: {
      cityId,
      status: ContentStatus.PUBLISHED
    },
    include: {
      contentEntry: true
    }
  });
}

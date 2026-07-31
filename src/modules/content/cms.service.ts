import type { Prisma, ServiceCode } from "@prisma/client";
import { PrismaClient, ContentStatus } from "@prisma/client";

const prisma = new PrismaClient();

export class ContentError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "ContentError";
  }
}

export async function createContentEntry(data: {
  slug: string;
  type: string;
  title: string;
  primaryJob: string;
  body: Prisma.InputJsonValue;
  authorId: string;
  excerpt?: string;
  city?: string;
  serviceCode?: ServiceCode;
}) {
  const existing = await prisma.contentEntry.findUnique({ where: { slug: data.slug } });
  if (existing) {
    throw new ContentError("slug_exists", "Content with this slug already exists.");
  }

  // Author existence check
  const author = await prisma.author.findUnique({ where: { id: data.authorId } });
  if (!author) {
    throw new ContentError("author_not_found", "Author does not exist.");
  }

  return await prisma.contentEntry.create({
    data: {
      slug: data.slug,
      type: data.type,
      title: data.title,
      primaryJob: data.primaryJob,
      body: data.body,
      authorId: data.authorId,
      excerpt: data.excerpt,
      city: data.city,
      serviceCode: data.serviceCode,
      status: ContentStatus.DRAFT,
      versions: {
        create: {
          version: 1,
          title: data.title,
          excerpt: data.excerpt,
          body: data.body,
          status: ContentStatus.DRAFT,
          authorId: data.authorId
        }
      }
    }
  });
}

export async function publishContent(entryId: string, publishedBy: string) {
  const entry = await prisma.contentEntry.findUnique({ where: { id: entryId } });
  if (!entry) {
    throw new ContentError("entry_not_found", "Content entry not found.");
  }

  return await prisma.contentEntry.update({
    where: { id: entryId },
    data: {
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date()
    }
  });
}

export async function getContent(slug: string, requirePublished: boolean = true) {
  const entry = await prisma.contentEntry.findUnique({
    where: { slug },
    include: {
      expertReview: true,
      versions: { orderBy: { version: "desc" }, take: 1 }
    }
  });

  if (!entry) {
    throw new ContentError("entry_not_found", "Content entry not found.");
  }

  if (requirePublished && entry.status !== ContentStatus.PUBLISHED) {
    throw new ContentError("not_published", "This content is not yet published.");
  }

  return entry;
}

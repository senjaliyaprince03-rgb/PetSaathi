import { PrismaClient } from "@prisma/client";
import { ContentError } from "./cms.service";

const prisma = new PrismaClient();

export async function attachExpertReview(
  entryId: string,
  reviewerId: string,
  reviewerName: string,
  credentials: string,
  scope: string,
  verdict: string,
  notes: string
) {
  const entry = await prisma.contentEntry.findUnique({ where: { id: entryId } });
  if (!entry) {
    throw new ContentError("entry_not_found", "Content entry not found.");
  }

  // In a real application, we might look up the reviewer in a `users` or `experts` table.
  // For now, we trust the incoming reviewer ID / Name because it's an admin endpoint.

  return await prisma.expertReview.create({
    data: {
      reviewerId,
      reviewerName,
      credentials,
      scope,
      verdict,
      notes,
      entries: {
        connect: { id: entryId }
      }
    }
  });
}

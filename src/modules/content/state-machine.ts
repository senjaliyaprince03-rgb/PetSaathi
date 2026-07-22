import type { ContentStatus } from "@prisma/client";

export const contentTransitions: Record<ContentStatus, readonly ContentStatus[]> = {
  DRAFT: ["IN_REVIEW"],
  IN_REVIEW: ["DRAFT", "APPROVED"],
  APPROVED: ["DRAFT", "PUBLISHED"],
  PUBLISHED: ["ARCHIVED"],
  ARCHIVED: ["DRAFT"]
};

export function canTransitionContent(from: ContentStatus, to: ContentStatus) { return contentTransitions[from].includes(to); }

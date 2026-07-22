import { prisma } from "@/lib/db";
import { upsertContact, type ContactUpsertParams } from "./crm";

/**
 * Handles a request to join a community group.
 * Finds the group by slug, creates/updates the contact, and inserts a PENDING membership.
 */
export async function requestCommunityJoin(groupSlug: string, contactParams: ContactUpsertParams) {
  const group = await prisma.communityGroup.findUnique({
    where: { slug: groupSlug },
  });

  if (!group || !group.active) {
    throw new Error("Community group not found or inactive");
  }

  const contact = await upsertContact(contactParams);

  // Upsert membership to avoid unique constraint errors if they already applied
  return prisma.communityMembership.upsert({
    where: {
      groupId_contactId: {
        groupId: group.id,
        contactId: contact.id,
      },
    },
    update: {}, // Do nothing if it already exists, leaving status as is
    create: {
      groupId: group.id,
      contactId: contact.id,
      status: "PENDING",
    },
  });
}

import { prisma } from "@/lib/db";
import type { Prisma, LeadType } from "@prisma/client";

export interface ContactUpsertParams {
  email?: string;
  phoneE164?: string;
  firstName?: string;
  lastName?: string;
  source?: string;
}

/**
 * Finds an existing contact by email or phone, or creates a new one.
 */
export async function upsertContact(params: ContactUpsertParams) {
  if (!params.email && !params.phoneE164) {
    throw new Error("Must provide at least email or phoneE164 to upsert contact");
  }

  const OR: Prisma.ContactWhereInput[] = [];
  if (params.email) OR.push({ email: params.email });
  if (params.phoneE164) OR.push({ phoneE164: params.phoneE164 });

  let contact = await prisma.contact.findFirst({
    where: { OR },
  });

  if (contact) {
    // Update missing fields
    const dataToUpdate: Prisma.ContactUpdateInput = {};
    if (params.email && !contact.email) dataToUpdate.email = params.email;
    if (params.phoneE164 && !contact.phoneE164) dataToUpdate.phoneE164 = params.phoneE164;
    if (params.firstName && !contact.firstName) dataToUpdate.firstName = params.firstName;
    if (params.lastName && !contact.lastName) dataToUpdate.lastName = params.lastName;

    if (Object.keys(dataToUpdate).length > 0) {
      contact = await prisma.contact.update({
        where: { id: contact.id },
        data: dataToUpdate,
      });
    }
    return contact;
  }

  // Create new
  return prisma.contact.create({
    data: {
      email: params.email,
      phoneE164: params.phoneE164,
      firstName: params.firstName,
      lastName: params.lastName,
      source: params.source ?? "ORGANIC",
    },
  });
}

/**
 * Records a lead magnet download for a contact.
 */
export async function recordLeadMagnetRequest(contactId: string, magnetSlug: string, metadata?: unknown) {
  return prisma.leadMagnetRequest.create({
    data: {
      contactId,
      magnetSlug,
      metadata: metadata ? (metadata as Prisma.InputJsonValue) : undefined,
    },
  });
}

/**
 * Submits a general enquiry lead (creates contact, then adds Lead record).
 */
export async function submitEnquiry(params: ContactUpsertParams & { type: LeadType; notes?: string }) {
  const contact = await upsertContact({
    email: params.email,
    phoneE164: params.phoneE164,
    firstName: params.firstName,
    lastName: params.lastName,
    source: params.source,
  });

  return prisma.lead.create({
    data: {
      type: params.type,
      status: "NEW",
      source: params.source ?? "WEBSITE",
      name: params.firstName ? `${params.firstName} ${params.lastName || ""}`.trim() : "Unknown",
      email: contact.email,
      phoneE164: contact.phoneE164,
      message: params.notes || "No message provided",
      consentToContact: true,
      metadata: {
        contactId: contact.id,
      },
    },
  });
}

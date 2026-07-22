import { prisma } from "@/lib/db";
import { upsertContact, type ContactUpsertParams } from "./crm";


export interface TestimonialSubmission {
  contact: ContactUpsertParams;
  bookingId?: string;
  story: string;
  rating: number;
  consentLevel: "TEXT_ONLY" | "FIRST_NAME_CITY" | "PET_PHOTO" | "FULL_MARKETING";
}

export async function submitTestimonial(data: TestimonialSubmission) {
  const contact = await upsertContact(data.contact);

  return prisma.testimonial.create({
    data: {
      displayName: contact.firstName ? `${contact.firstName} ${contact.lastName || ""}`.trim() : "Anonymous",
      quote: data.story,
      status: "DRAFT",
    },
  });
}

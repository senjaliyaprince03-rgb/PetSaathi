import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient, ContentStatus, ServiceCode, CityLaunchStage } from "@prisma/client";
import { randomUUID } from "crypto";
import { createContentEntry, publishContent, getContent } from "../../src/modules/content/cms.service";
import { attachExpertReview } from "../../src/modules/content/expert.service";
import { createCityPage, getCityPages } from "../../src/modules/content/citypage.service";
import { recordConsent, publishTestimonial } from "../../src/modules/content/testimonial.service";

const prisma = new PrismaClient();

describe("Phase 12: Content, SEO, Testimonials Integration", () => {
  let adminId: string;
  let authorId: string;
  let cityId: string;
  let customerId: string;
  let entryId: string;

  beforeAll(async () => {
    // Admin user
    const admin = await prisma.user.create({
      data: {
        email: `admin_${randomUUID()}@petsaathi.in`,
        displayName: "Content Admin",
        roles: { create: [{ role: "CONTENT_ADMIN" }] }
      }
    });
    adminId = admin.id;

    // Customer user
    const customer = await prisma.user.create({
      data: {
        email: `customer_${randomUUID()}@petsaathi.in`,
        displayName: "Happy Customer",
        roles: { create: [{ role: "CUSTOMER" }] }
      }
    });
    customerId = customer.id;

    // Author
    const author = await prisma.author.create({
      data: {
        slug: `test-author-${randomUUID()}`,
        displayName: "Test Author",
        bio: "An experienced pet care writer",
      }
    });
    authorId = author.id;

    // City
    const city = await prisma.city.create({
      data: {
        slug: `bopal-${randomUUID()}`,
        name: "Bopal",
        state: "Gujarat",
        status: CityLaunchStage.PUBLIC_LIMITED
      }
    });
    cityId = city.id;
  });

  afterAll(async () => {
    // Cleanup
    await prisma.testimonial.deleteMany({ where: { userId: customerId } });
    await prisma.testimonialConsent.deleteMany({ where: { userId: customerId } });
    
    if (entryId) {
      await prisma.cityPage.deleteMany({ where: { contentEntryId: entryId } });
      await prisma.contentVersion.deleteMany({ where: { contentId: entryId } });
      await prisma.contentEntry.delete({ where: { id: entryId } });
      await prisma.expertReview.deleteMany({
        where: { entries: { none: {} } } // Delete orphaned reviews
      });
    }
    
    if (cityId) {
      await prisma.cityPage.deleteMany({ where: { cityId } });
      await prisma.city.delete({ where: { id: cityId } });
    }
    
    if (authorId) {
      await prisma.author.delete({ where: { id: authorId } });
    }
    
    if (adminId) {
      await prisma.userRole.deleteMany({ where: { userId: adminId } });
      await prisma.user.delete({ where: { id: adminId } });
    }
    if (customerId) {
      await prisma.booking.deleteMany({ where: { customerId } });
      await prisma.pet.deleteMany({ where: { ownerId: customerId } });
      await prisma.address.deleteMany({ where: { userId: customerId } });
      
      await prisma.userRole.deleteMany({ where: { userId: customerId } });
      await prisma.user.delete({ where: { id: customerId } });
    }
    
    await prisma.$disconnect();
  });

  it("should create and publish a content entry", async () => {
    const entry = await createContentEntry({
      slug: `dog-walking-bopal-${randomUUID()}`,
      type: "SERVICE_PAGE",
      title: "Dog Walking in Bopal",
      primaryJob: "Provide reliable dog walking",
      authorId,
      body: { content: "We offer the best dog walking services." },
      serviceCode: ServiceCode.DOG_WALK_30
    });
    entryId = entry.id;

    expect(entry.status).toBe(ContentStatus.DRAFT);
    expect(entry.serviceCode).toBe(ServiceCode.DOG_WALK_30);

    const published = await publishContent(entry.id, adminId);
    expect(published.status).toBe(ContentStatus.PUBLISHED);

    const fetched = await getContent(entry.slug);
    expect(fetched.id).toBe(entry.id);
  });

  it("should attach an expert review", async () => {
    const review = await attachExpertReview(
      entryId,
      randomUUID(), // Mock reviewer ID
      "Dr. Smith",
      "DVM, PhD",
      "Medical Accuracy",
      "APPROVED",
      "Content is medically sound."
    );

    expect(review.reviewerName).toBe("Dr. Smith");
    expect(review.verdict).toBe("APPROVED");
  });

  it("should verify expert review on fetched content", async () => {
    // getContent takes slug
    const entry = await prisma.contentEntry.findUnique({ where: { id: entryId } });
    const fetched = await getContent(entry!.slug);
    
    expect(fetched.expertReview).toBeDefined();
    expect(fetched.expertReview!.reviewerName).toBe("Dr. Smith");
  });

  it("should create a city page for SEO", async () => {
    const cityPage = await createCityPage(cityId, entryId, "LOCAL_SERVICE");
    expect(cityPage.status).toBe(ContentStatus.PUBLISHED);

    const pages = await getCityPages(cityId);
    expect(pages.length).toBeGreaterThan(0);
    expect(pages[0]!.contentEntry.title).toBe("Dog Walking in Bopal");
  });

  it("should record consent and publish a testimonial", async () => {
    // Create prerequisites for booking
    const serviceType = await prisma.serviceType.upsert({
      where: { code: ServiceCode.DOG_WALK_30 },
      update: {},
      create: {
        code: ServiceCode.DOG_WALK_30,
        name: "Dog Walk 30m",
        description: "30 min walk",
        basePricePaise: 10000
      }
    });
    
    const pet = await prisma.pet.create({
      data: {
        ownerId: customerId,
        name: "Buddy",
        species: "DOG"
      }
    });

    const address = await prisma.address.create({
      data: {
        userId: customerId,
        label: "Home",
        line1: "123 Street",
        locality: "Downtown",
        city: "Ahmedabad",
        state: "Gujarat",
        postalCode: "380015"
      }
    });

    // Create a mock booking for the testimonial provenance
    const booking = await prisma.booking.create({
      data: {
        customerId: customerId,
        petId: pet.id,
        serviceTypeId: serviceType.id,
        addressId: address.id,
        status: "COMPLETED",
        scheduledStart: new Date(),
        scheduledEnd: new Date(Date.now() + 3600000), // +1 hour
        quoteAmountPaise: 10000,
        reference: `BKG-${randomUUID().substring(0,8)}`
      }
    });

    const consent = await recordConsent(
      customerId,
      "FIRST_NAME_CITY",
      "https://storage.petsaathi.in/evidence/consent.pdf"
    );

    expect(consent.scope).toBe("FIRST_NAME_CITY");

    const testimonial = await publishTestimonial(
      consent.id,
      "Happy Customer",
      "My dog loves this service!",
      "Regular walking customer",
      "Ahmedabad",
      booking.id
    );

    expect(testimonial.status).toBe(ContentStatus.PUBLISHED);
    expect(testimonial.quote).toContain("loves this service");
  });
});

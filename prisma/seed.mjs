import { AccountStatus, PrismaClient, Role, ServiceCode } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding MongoDB reference data...");

  const customer = await prisma.user.upsert({
    where: { email: "customer@petsaathi.test" },
    update: {},
    create: {
      email: "customer@petsaathi.test",
      phoneE164: "+919876543210",
      displayName: "Test Customer",
      status: AccountStatus.ACTIVE,
      roles: { create: { role: Role.CUSTOMER } },
      customer: { create: {} },
    },
  });

  const sitter = await prisma.user.upsert({
    where: { email: "sitter@petsaathi.test" },
    update: {},
    create: {
      email: "sitter@petsaathi.test",
      phoneE164: "+919876543211",
      displayName: "Test Sitter",
      status: AccountStatus.ACTIVE,
      roles: { create: { role: Role.SITTER } },
      sitter: {
        create: {
          bio: "I love all pets.",
          yearsExperience: 5,
          status: "APPROVED",
        },
      },
    },
  });

  const serviceTypes = [
    {
      code: ServiceCode.DOG_WALK_30,
      name: "30-minute dog walk",
      description: "A supervised 30-minute neighbourhood dog walk.",
      durationMinutes: 30,
      basePricePaise: 0,
      active: true,
      requiresManualMatch: true,
      requiresProperty: false,
    },
    {
      code: ServiceCode.DOG_WALK_60,
      name: "60-minute dog walk",
      description: "A supervised 60-minute neighbourhood dog walk.",
      durationMinutes: 60,
      basePricePaise: 0,
      active: true,
      requiresManualMatch: true,
      requiresProperty: false,
    },
    {
      code: ServiceCode.HOME_VISIT,
      name: "Home visit",
      description: "A scheduled visit for feeding, medication, and pet care.",
      durationMinutes: 45,
      basePricePaise: 0,
      active: true,
      requiresManualMatch: true,
      requiresProperty: false,
    },
    {
      code: ServiceCode.HOME_SITTING_60,
      name: "60-minute home sitting",
      description: "One hour of supervised care in the pet's home.",
      durationMinutes: 60,
      basePricePaise: 0,
      active: true,
      requiresManualMatch: true,
      requiresProperty: false,
    },
    {
      code: ServiceCode.TRAVEL_SITTING,
      name: "Travel sitting",
      description: "Extended in-home care while the pet parent travels.",
      durationMinutes: 720,
      basePricePaise: 0,
      active: false,
      requiresManualMatch: true,
      requiresProperty: true,
    },
    {
      code: ServiceCode.BOARDING_BETA,
      name: "Boarding beta",
      description: "Controlled boarding pilot with verified properties.",
      durationMinutes: 720,
      basePricePaise: 0,
      active: false,
      requiresManualMatch: true,
      requiresProperty: true,
    },
    {
      code: ServiceCode.GROOMING_HOME,
      name: "At-home grooming",
      description: "Partner-delivered grooming at the pet's home.",
      durationMinutes: 90,
      basePricePaise: 0,
      active: false,
      requiresManualMatch: true,
      requiresProperty: false,
    },
    {
      code: ServiceCode.VET_SUPPORT,
      name: "Veterinary support",
      description: "Controlled veterinary assistance request.",
      durationMinutes: 60,
      basePricePaise: 0,
      active: false,
      requiresManualMatch: true,
      requiresProperty: false,
    },
    {
      code: ServiceCode.TRAINING_ASSESSMENT,
      name: "Training assessment",
      description: "Initial partner-delivered behaviour and training assessment.",
      durationMinutes: 60,
      basePricePaise: 0,
      active: false,
      requiresManualMatch: true,
      requiresProperty: false,
    },
    {
      code: ServiceCode.PET_TAXI,
      name: "Pet taxi",
      description: "Controlled pet transportation request.",
      durationMinutes: 60,
      basePricePaise: 0,
      active: false,
      requiresManualMatch: true,
      requiresProperty: false,
    },
  ];

  await Promise.all(
    serviceTypes.map(({ code, ...configuration }) =>
      prisma.serviceType.upsert({
        where: { code },
        update: configuration,
        create: { code, ...configuration },
      }),
    ),
  );

  const editor = await prisma.user.upsert({
    where: { email: "editorial@petsaathi.test" },
    update: {},
    create: {
      email: "editorial@petsaathi.test",
      phoneE164: "+919876543212",
      displayName: "PetSaathi Editorial",
      status: AccountStatus.ACTIVE,
      roles: { create: { role: Role.CONTENT_ADMIN } },
    },
  });

  const reviewers = [
    {
      reviewerId: "seed-dr-anjali-mehra",
      reviewerName: "Dr. Anjali Mehra",
      credentials: "BVSc & AH, Small-Animal Practice",
      scope: "General dog and cat care",
      verdict: "APPROVED",
      notes: "Reviewed structure, safety guidance and India-local recommendations.",
    },
    {
      reviewerId: "seed-dr-rohan-iyer",
      reviewerName: "Dr. Rohan Iyer",
      credentials: "MVSc, Preventive Veterinary Medicine",
      scope: "Preventive care and seasonal safety",
      verdict: "APPROVED",
      notes: "Verified seasonal risks, hydration guidance and clinic-referral triggers.",
    },
  ];

  async function ensureExpertReview(review) {
    const existing = await prisma.expertReview.findFirst({ where: { reviewerName: review.reviewerName } });
    if (existing) return existing;
    return prisma.expertReview.create({ data: review });
  }

  const generalReview = ensureExpertReview(reviewers[0]);
  const preventiveReview = ensureExpertReview(reviewers[1]);

  const journalGuides = [
    {
      slug: "choosing-safe-dog-walker",
      type: "CARE_GUIDE",
      title: "How to Choose a Safe Dog Walker in Your Neighbourhood",
      excerpt: "A structured checklist for evaluating walkers: identity checks, leash handling, route planning and the handover details that keep your dog safe.",
      city: null,
      reviewKey: "general",
      publishedDaysAgo: 21,
      body: [
        { type: "heading", text: "Start with verifiable identity" },
        { type: "paragraph", text: "A trustworthy walker should willingly share a government photo ID and a verified phone number before the first walk. If someone avoids sharing identity documents, treat it as a signal to pause." },
        { type: "heading", text: "Watch how they handle your dog" },
        { type: "list", items: [
          "They ask about your dog's temperament, triggers and medical needs before the walk.",
          "They confirm leash type and harness fit instead of replacing your equipment silently.",
          "They agree on a route and duration in advance rather than deciding on the street.",
        ] },
        { type: "heading", text: "Insist on structured handovers" },
        { type: "paragraph", text: "Every walk should begin and end with a short handover note: what happened, how your dog behaved, and anything unusual. Consistent notes are the easiest way to build trust with any local caregiver." },
        { type: "paragraph", text: "This guide is general education, not a certification of any individual walker. Always meet new walkers in person before handing over keys or unsupervised access." },
      ],
    },
    {
      slug: "new-puppy-first-30-days-india",
      type: "CHECKLIST",
      title: "The First 30 Days With a New Puppy: An India Checklist",
      excerpt: "Vaccination windows, heat-safe playtimes, socialisation milestones and paperwork - a week-by-week structure for the critical first month together.",
      city: null,
      reviewKey: "preventive",
      publishedDaysAgo: 18,
      body: [
        { type: "heading", text: "Week 1: Settle and observe" },
        { type: "list", items: [
          "Book a vet visit within the first 72 hours for a baseline health check.",
          "Confirm the vaccination status you were given and schedule pending doses.",
          "Keep handling gentle and give the puppy one quiet sleep space.",
        ] },
        { type: "heading", text: "Weeks 2 to 3: Safe exposure" },
        { type: "paragraph", text: "Short, positive exposures build confidence: car rides, household sounds, handled paws and ears. Avoid public ground contact until your vet confirms vaccine coverage is adequate." },
        { type: "heading", text: "Week 4: Routines that last" },
        { type: "list", items: [
          "Fixed feeding times and a consistent toilet spot.",
          "Five-minute training sessions twice daily.",
          "Heat-aware walks: early morning or late evening in most Indian cities.",
        ] },
        { type: "paragraph", text: "Every puppy develops at a different pace. Use this checklist as structure, not as a pass-or-fail test, and defer to your veterinarian for medical decisions." },
      ],
    },
    {
      slug: "monsoon-paw-skin-care",
      type: "CARE_GUIDE",
      title: "Monsoon Paw and Skin Care Basics for City Dogs",
      excerpt: "Fungal hotspots, post-walk drying routines and paw checks that prevent the most common monsoon season problems before they need a clinic visit.",
      city: "Mumbai",
      reviewKey: "preventive",
      publishedDaysAgo: 12,
      body: [
        { type: "heading", text: "Dry after every wet walk" },
        { type: "paragraph", text: "Moisture trapped between toe pads is the leading trigger for monsoon fungal infections. A clean towel dedicated to your dog, used for two minutes after each walk, prevents most cases." },
        { type: "heading", text: "Check these spots weekly" },
        { type: "list", items: [
          "Between toe pads for redness, licking or odour.",
          "Ear folds and armpits where moisture lingers longest.",
          "Under the collar for contact irritation.",
        ] },
        { type: "heading", text: "When to involve a vet" },
        { type: "paragraph", text: "Persistent scratching, spreading redness or a yeasty smell lasting more than two days warrants a clinic visit. Home care supports treatment; it does not replace diagnosis." },
      ],
    },
    {
      slug: "summer-heat-safety-dogs",
      type: "CARE_GUIDE",
      title: "Summer Heat Safety: Walking Dogs Through Indian Summers",
      excerpt: "Pavement temperature tests, hydration timing and breed-specific risk signs every pet parent should know before April temperatures arrive.",
      city: "Delhi",
      reviewKey: "preventive",
      publishedDaysAgo: 8,
      body: [
        { type: "heading", text: "The seven-second pavement test" },
        { type: "paragraph", text: "Press the back of your hand against the road surface for seven seconds. If you cannot hold it comfortably, the pavement can burn paw pads - reschedule the walk." },
        { type: "heading", text: "Restructure the day" },
        { type: "list", items: [
          "Walks before 8 AM or after 7 PM through peak summer.",
          "Water available at rest points, not only at home.",
          "Short-nosed breeds (Pugs, Bulldogs, Shih Tzus) need earlier evening walks and shorter routes.",
        ] },
        { type: "heading", text: "Know the emergency signs" },
        { type: "paragraph", text: "Heavy drooling, staggering, gums turning bright red or grey, or collapse are heatstroke emergencies: move the dog to shade, offer small sips of water, wet the belly and paws, and reach a vet immediately." },
      ],
    },
    {
      slug: "what-to-expect-home-visit",
      type: "SERVICE_GUIDE",
      title: "What Actually Happens During a PetSaathi Home Visit",
      excerpt: "A transparent walkthrough of a standard visit: gate protocol, feeding and medication routines, live updates and how handover notes protect everyone.",
      city: null,
      reviewKey: "general",
      publishedDaysAgo: 5,
      body: [
        { type: "heading", text: "Before the doorbell" },
        { type: "paragraph", text: "Your Saathi reviews care instructions in advance and confirms society gate clearance when required. Access details stay limited to the assigned caregiver for the booked window." },
        { type: "heading", text: "During the visit" },
        { type: "list", items: [
          "Feeding exactly per your written routine, including medication timing.",
          "Litter tray or walking break as specified for your pet.",
          "A timestamped update with photos sent through the platform.",
        ] },
        { type: "heading", text: "The closing handover" },
        { type: "paragraph", text: "The visit ends with a short summary note: appetite, mood, anything unusual. If something seems off medically, we flag it clearly so you can decide on a vet visit with full information." },
      ],
    },
    {
      slug: "prepare-home-for-boarding",
      type: "SERVICE_GUIDE",
      title: "Preparing Your Home for Boarding: A Practical Guide",
      excerpt: "From securing balconies to writing the perfect care sheet - how to set up a calm, safe boarding experience in your own home.",
      city: "Bengaluru",
      reviewKey: "general",
      publishedDaysAgo: 2,
      body: [
        { type: "heading", text: "Secure the environment" },
        { type: "list", items: [
          "Close and lock balcony gates; screen open windows.",
          "Remove toxic plants and accessible wires from pet-height zones.",
          "Store medicines and human snacks out of reach.",
        ] },
        { type: "heading", text: "Write a real care sheet" },
        { type: "paragraph", text: "One page beats ten messages: feeding quantities, walk times, vet contact, calming cues, off-limit rooms. Your Saathi follows the sheet first and asks second." },
        { type: "heading", text: "Plan the goodbye" },
        { type: "paragraph", text: "Short, calm departures reduce separation stress. Hand over the routine, leave as planned, and trust the updates - extended dramatic goodbyes transfer anxiety to your pet." },
      ],
    },
  ];

  for (const guide of journalGuides) {
    const data = {
      slug: guide.slug,
      type: guide.type,
      title: guide.title,
      excerpt: guide.excerpt,
      body: guide.body,
      status: "PUBLISHED",
      primaryJob: "editorial-journal-guide",
      city: guide.city ?? null,
      authorId: editor.id,
      expertReviewId: (guide.reviewKey === "preventive" ? await preventiveReview : await generalReview).id,
      publishedAt: new Date(Date.now() - guide.publishedDaysAgo * 24 * 60 * 60 * 1000),
    };

    const existing = await prisma.contentEntry.findUnique({ where: { slug: guide.slug } });
    if (existing) {
      await prisma.contentEntry.update({ where: { slug: guide.slug }, data: { ...data, versions: undefined } });
      continue;
    }

    await prisma.contentEntry.create({
      data: {
        ...data,
        versions: {
          create: {
            version: 1,
            title: data.title,
            excerpt: data.excerpt,
            body: data.body,
            status: "DRAFT",
            authorId: editor.id,
          },
        },
      },
    });
  }

  const sitterProPlan = await prisma.planVersion.findUnique({
    where: { planKey_version: { planKey: "sitter-pro-monthly", version: 1 } },
  });

  if (!sitterProPlan) {
    await prisma.planVersion.create({
      data: {
        planKey: "sitter-pro-monthly",
        version: 1,
        name: "Sitter Pro",
        audience: "SITTER",
        pricePaise: 49900,
        billingInterval: "MONTHLY",
        totalBillingCycles: 12,
        entitlements: { zeroCommission: true, priorityRanking: true, advancedAnalytics: true, directMessaging: true },
        active: true,
      },
    });
  }

  console.log("Seed completed successfully.", {
    customerId: customer.id,
    sitterId: sitter.id,
    serviceTypes: serviceTypes.length,
    journalGuides: journalGuides.length,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

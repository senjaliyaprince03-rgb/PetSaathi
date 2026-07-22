import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// basePricePaise is retained only for backwards-compatible schema reads. It is
// deliberately zero: approved immutable service_prices are authoritative and
// the seed must never invent commercial terms.
const services = [
  { code: "DOG_WALK_30", name: "30-minute dog walk", description: "A focused local walk with structured start, completion and report events.", durationMinutes: 30, active: true, requiresManualMatch: true, requiresProperty: false, basePricePaise: 0 },
  { code: "DOG_WALK_60", name: "60-minute dog walk", description: "A longer local walk for pets who need more time to explore and settle.", durationMinutes: 60, active: true, requiresManualMatch: true, requiresProperty: false, basePricePaise: 0 },
  { code: "HOME_VISIT", name: "Home visit", description: "Food, water, play and a reassuring check-in at the pet's home.", durationMinutes: 45, active: true, requiresManualMatch: true, requiresProperty: false, basePricePaise: 0 },
  { code: "HOME_SITTING_60", name: "One-hour home sitting", description: "Calm company and routine support in the pet's familiar environment.", durationMinutes: 60, active: true, requiresManualMatch: true, requiresProperty: false, basePricePaise: 0 },
  { code: "TRAVEL_SITTING", name: "Travel sitting", description: "Extended care during pet-parent travel.", durationMinutes: null, active: false, requiresManualMatch: true, requiresProperty: false, basePricePaise: 0 },
  { code: "BOARDING_BETA", name: "Boarding beta", description: "Controlled boarding for assessed hosts and compatible pets.", durationMinutes: null, active: false, requiresManualMatch: true, requiresProperty: true, basePricePaise: 0 },
  { code: "GROOMING_HOME", name: "At-home grooming", description: "Partner-delivered grooming at home.", durationMinutes: 90, active: false, requiresManualMatch: true, requiresProperty: false, basePricePaise: 0 },
  { code: "VET_SUPPORT", name: "Veterinary support", description: "Non-emergency coordination with approved veterinary partners.", durationMinutes: 60, active: false, requiresManualMatch: true, requiresProperty: false, basePricePaise: 0 },
  { code: "TRAINING_ASSESSMENT", name: "Training assessment", description: "Behaviour and training intake with an approved specialist.", durationMinutes: 60, active: false, requiresManualMatch: true, requiresProperty: false, basePricePaise: 0 },
  { code: "PET_TAXI", name: "Pet taxi", description: "Controlled pet transport with handover evidence.", durationMinutes: 60, active: false, requiresManualMatch: true, requiresProperty: false, basePricePaise: 0 }
];

const flags = [
  ["boarding_beta", false, "Controlled boarding pilot"],
  ["live_walk_tracking", false, "Consent-bound live tracking during active walks"],
  ["society_portal", false, "Residential society pilot workspace"],
  ["subscriptions", false, "PetSaathi plan enrolment and entitlements"],
  ["partner_marketplace", false, "Approved grooming, veterinary and training partners"],
  ["travel_sitting", false, "Extended travel care workflow"],
  ["multi_city", false, "City launch configuration and delegated local operations"],
  ["loyalty_referrals", false, "Ledger-backed loyalty and consent-aware referrals"],
  ["society_events", false, "Approved residential society calendars and alerts"],
  ["public_testimonials", false, "Consent-bound customer stories"],
  ["enterprise_accounts", false, "Contract-backed enterprise entitlements and reporting"],
  ["advanced_pet_health", false, "Longitudinal pet health timeline and specialist integrations"]
];

async function main() {
  for (const service of services) {
    await prisma.serviceType.upsert({ where: { code: service.code }, update: service, create: service });
  }

  for (const [key, enabled, description] of flags) {
    await prisma.featureFlag.upsert({ where: { key }, update: { description }, create: { key, enabled, description } });
  }

  const trainingModules = [
    { slug: "care-foundations", title: "PetSaathi care foundations", version: 1, passingScore: 80 },
    { slug: "safe-handovers", title: "Safe handovers and home access", version: 1, passingScore: 85 },
    { slug: "incident-response", title: "Incident recognition and response", version: 1, passingScore: 85 },
    { slug: "dog-walking-control", title: "Controlled dog walking", version: 1, passingScore: 85 }
  ];
  for (const module of trainingModules) {
    await prisma.trainingModule.upsert({ where: { slug: module.slug }, update: module, create: module });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });

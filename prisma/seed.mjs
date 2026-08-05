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

  console.log("Seed completed successfully.", {
    customerId: customer.id,
    sitterId: sitter.id,
    serviceTypes: serviceTypes.length,
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

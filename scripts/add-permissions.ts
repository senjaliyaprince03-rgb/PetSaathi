import { PrismaClient, ServiceCode, PermissionStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function addPermissions() {
  const sitterUser = await prisma.user.findUnique({
    where: { email: "sitter@petsaathi.test" },
    include: {
      sitter: true
    }
  });

  const service = await prisma.serviceType.findUnique({
    where: { code: ServiceCode.DOG_WALK_30 }
  });

  if (sitterUser?.sitter && service) {
    await prisma.sitterServicePermission.upsert({
      where: {
        sitterId_serviceTypeId: {
          sitterId: sitterUser.sitter.id,
          serviceTypeId: service.id
        }
      },
      update: {
        status: "ACTIVE"
      },
      create: {
        sitterId: sitterUser.sitter.id,
        serviceTypeId: service.id,
        status: "ACTIVE"
      }
    });
    console.log("Granted DOG_WALK_30 permission to test sitter.");
  } else {
    console.log("Could not find test sitter or service type.");
  }
}

addPermissions().catch(console.error).finally(() => prisma.$disconnect());

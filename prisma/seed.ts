import { PrismaClient, Role, AccountStatus } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding local database...')

  const customerAuthId = randomUUID()
  const sitterAuthId = randomUUID()

  // 1. Create a Customer
  const customer = await prisma.user.upsert({
    where: { email: 'customer@petsaathi.test' },
    update: {},
    create: {
      authUserId: customerAuthId,
      email: 'customer@petsaathi.test',
      phoneE164: '+919876543210',
      displayName: 'Test Customer',
      status: AccountStatus.ACTIVE,
      roles: {
        create: {
          role: Role.CUSTOMER
        }
      },
      customer: {
        create: {}
      }
    }
  })

  // 2. Create a Sitter
  const sitter = await prisma.user.upsert({
    where: { email: 'sitter@petsaathi.test' },
    update: {},
    create: {
      authUserId: sitterAuthId,
      email: 'sitter@petsaathi.test',
      phoneE164: '+919876543211',
      displayName: 'Test Sitter',
      status: AccountStatus.ACTIVE,
      roles: {
        create: {
          role: Role.SITTER
        }
      },
      sitter: {
        create: {
          bio: 'I love all pets.',
          yearsExperience: 5,
          status: 'APPROVED'
        }
      }
    }
  })

  console.log('Seed completed successfully.')
  console.log({ customerId: customer.id, sitterId: sitter.id })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

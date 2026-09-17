import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import pkg from "@prisma/client";
const { PrismaClient, PermissionStatus, RiskLevel, Role } = pkg;

const prisma = new PrismaClient();

async function main() {
  // 1. Get all service types
  const serviceTypes = await prisma.serviceType.findMany({
    where: { active: true }
  });

  // 2. Grant all permissions to sitter@petsaathi.com
  const sitterUser = await prisma.user.findUnique({
    where: { email: "sitter@petsaathi.com" },
    include: { sitter: true }
  });

  if (sitterUser && sitterUser.sitter) {
    for (const st of serviceTypes) {
      await prisma.sitterServicePermission.upsert({
        where: {
          sitterId_serviceTypeId: {
            sitterId: sitterUser.sitter.id,
            serviceTypeId: st.id
          }
        },
        update: {
          status: "ACTIVE",
          riskLimit: "RED",
          expiresAt: null
        },
        create: {
          sitterId: sitterUser.sitter.id,
          serviceTypeId: st.id,
          status: "ACTIVE",
          riskLimit: "RED",
          expiresAt: null
        }
      });
    }
    console.log("GRANTED_ALL_PERMISSIONS_TO_SITTER");
  }

  // 3. Grant all roles to ops.admin@petsaathi.com
  const opsAdmin = await prisma.user.findUnique({
    where: { email: "ops.admin@petsaathi.com" }
  });
  if (opsAdmin) {
    const roles = [
      Role.SUPER_ADMIN,
      Role.FINANCE_ADMIN,
      Role.SAFETY_ADMIN,
      Role.CONTENT_ADMIN,
      Role.VERIFICATION_ADMIN,
      Role.CITY_MANAGER,
      Role.PARTNER_MANAGER,
      Role.SOCIETY_MANAGER
    ];
    for (const r of roles) {
      await prisma.userRole.create({
        data: { userId: opsAdmin.id, role: r }
      }).catch(() => null);
    }
    console.log("GRANTED_ALL_ROLES_TO_OPS_ADMIN");
  }

  // 5. Seed Phase 0 Deep Test Accounts
  const bcrypt = (await import("bcryptjs")).default;
  const { MongoClient } = await import("mongodb");
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();

  const deepHash = await bcrypt.hash("DeepTest@123", 10);
  const deepAccounts = [
    { email: "customer.deep@petsaathi.com", name: "Deep Customer Primary", role: Role.CUSTOMER },
    { email: "customer2.deep@petsaathi.com", name: "Deep Customer Secondary", role: Role.CUSTOMER },
    { email: "saathi.deep@petsaathi.com", name: "Deep Approved Saathi", role: Role.SITTER, isSitter: true, sitterStatus: "APPROVED" },
    { email: "saathi.app.deep@petsaathi.com", name: "Deep Applicant Saathi", role: Role.SITTER, isSitter: true, sitterStatus: "APPLICANT" },
    { email: "ops.deep@petsaathi.com", name: "Deep Ops Admin", role: Role.OPERATIONS_ADMIN },
    { email: "super.deep@petsaathi.com", name: "Deep Super Admin", role: Role.SUPER_ADMIN },
    { email: "city.deep@petsaathi.com", name: "Deep City Manager", role: Role.CITY_MANAGER },
    { email: "partner.deep@petsaathi.com", name: "Deep Partner Manager", role: Role.PARTNER_MANAGER },
    { email: "society.deep@petsaathi.com", name: "Deep Society Manager", role: Role.SOCIETY_MANAGER },
    { email: "security.deep@petsaathi.com", name: "Deep Society Security", role: Role.SOCIETY_MANAGER }
  ];

  let deepSociety = await prisma.society.findFirst({ where: { status: "ACTIVE" } });

  for (const acc of deepAccounts) {
    let u = await prisma.user.findUnique({ where: { email: acc.email } });
    if (!u) {
      u = await prisma.user.create({
        data: {
          email: acc.email,
          displayName: acc.name,
          status: "ACTIVE"
        }
      });
    } else {
      await prisma.user.update({
        where: { id: u.id },
        data: { status: "ACTIVE", displayName: acc.name }
      });
    }

    await prisma.userRole.deleteMany({ where: { userId: u.id } });
    await prisma.userRole.create({
      data: { userId: u.id, role: acc.role }
    });

    if (acc.isSitter) {
      const existingProfile = await prisma.sitterProfile.findUnique({ where: { userId: u.id } });
      if (!existingProfile) {
        await prisma.sitterProfile.create({
          data: {
            userId: u.id,
            status: acc.sitterStatus,
            bio: "Certified caregiver for Deep Testing",
            yearsExperience: 4,
            serviceRadiusKm: 10
          }
        });
      } else {
        await prisma.sitterProfile.update({
          where: { userId: u.id },
          data: { status: acc.sitterStatus }
        });
      }
    }

    if (acc.role === Role.SOCIETY_MANAGER && deepSociety) {
      const existingMember = await prisma.societyMember.findFirst({
        where: { societyId: deepSociety.id, userId: u.id }
      });
      if (!existingMember) {
        await prisma.societyMember.create({
          data: { societyId: deepSociety.id, userId: u.id, unitRef: "Villa 101", status: "VERIFIED" }
        });
      }
    }

    // Generate both scrypt format for /api/auth/password/signin and bcrypt for NextAuth
    const crypto = await import("node:crypto");
    const util = await import("node:util");
    const scryptAsync = util.promisify(crypto.scrypt);
    const salt = crypto.randomBytes(16).toString("hex");
    const derived = await scryptAsync("DeepTest@123", salt, 64);
    const scryptHash = `scrypt:${salt}:${derived.toString("hex")}`;

    await db.collection("auth_credentials").deleteMany({
      $or: [{ _id: acc.email }, { email: acc.email }, { userId: u.id }]
    });

    await db.collection("auth_credentials").insertOne({
      _id: acc.email,
      userId: u.id,
      email: acc.email,
      passwordHash: scryptHash,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("INITIALIZED_DEEP_ACCOUNT:", acc.email, "->", acc.role);
  }

  // Seed 3 Pets and 3 Addresses for customer.deep@petsaathi.com
  const primaryCustomer = await prisma.user.findUnique({ where: { email: "customer.deep@petsaathi.com" } });
  if (primaryCustomer) {
    const petsData = [
      { name: "Bruno", species: "DOG", breed: "Golden Retriever" },
      { name: "Whiskers", species: "CAT", breed: "Persian" },
      { name: "Budgie", species: "OTHER", breed: "Parakeet" }
    ];
    for (const p of petsData) {
      const existing = await prisma.pet.findFirst({ where: { ownerId: primaryCustomer.id, name: p.name } });
      if (!existing) {
        await prisma.pet.create({
          data: { ownerId: primaryCustomer.id, name: p.name, species: p.species, breed: p.breed, active: true }
        });
      }
    }

    const addressesData = [
      { label: "Society Home", line1: "Tower B - Flat 402, Iscon Platinum", locality: "Bopal", city: "Ahmedabad", state: "Gujarat", postalCode: "380058", isDefault: true },
      { label: "Standalone Villa", line1: "Villa 12, Gulmohar Enclave", locality: "Satellite", city: "Ahmedabad", state: "Gujarat", postalCode: "380015", isDefault: false },
      { label: "Tech Office", line1: "6th Floor, Pinnacle Business Park", locality: "Prahlad Nagar", city: "Ahmedabad", state: "Gujarat", postalCode: "380051", isDefault: false }
    ];
    for (const a of addressesData) {
      const existing = await prisma.address.findFirst({ where: { user: { id: primaryCustomer.id }, label: a.label } });
      if (!existing) {
        await prisma.address.create({
          data: {
            user: { connect: { id: primaryCustomer.id } },
            label: a.label,
            line1: a.line1,
            locality: a.locality,
            city: a.city,
            state: a.state,
            postalCode: a.postalCode
          }
        });
      }
    }
    console.log("SEEDED_PETS_AND_ADDRESSES_FOR_CUSTOMER_DEEP");
  }

  const { encode } = await import("next-auth/jwt");
  const secret = (process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET).trim();
  const deepCust = await prisma.user.findUnique({ where: { email: "customer.deep@petsaathi.com" } });
  if (deepCust) {
    const custToken = await encode({
      token: { id: deepCust.id, email: deepCust.email, name: deepCust.displayName, role: "CUSTOMER" },
      secret
    });
    console.log("DEEP_CUSTOMER_TOKEN:", custToken);
  }

  const deepSaathi = await prisma.user.findUnique({ where: { email: "saathi.deep@petsaathi.com" } });
  if (deepSaathi) {
    const saathiToken = await encode({
      token: { id: deepSaathi.id, email: deepSaathi.email, name: deepSaathi.displayName, role: "SITTER" },
      secret
    });
    console.log("DEEP_SAATHI_TOKEN:", saathiToken);
  }

  await client.close();
}

main().catch(console.error).finally(() => prisma.$disconnect());

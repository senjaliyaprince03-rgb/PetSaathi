import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import pkg from "@prisma/client";
const {
  PrismaClient,
  Role,
  AccountStatus,
  SitterStatus,
  ServiceCode,
  BookingStatus,
  AssignmentType,
  AssignmentStatus,
  PaymentStatus,
  VerificationStatus,
  RiskLevel,
  ReportReviewStatus,
  OrganizationType,
  OrgStatus,
  ProgrammeType,
  ProgrammeStatus,
  EligibilityMethod,
  MemberVerificationStatus,
  WalletStatus,
  BenefitEntryType,
  CityLaunchStage,
  ZoneLaunchStage,
  GateStatus,
  PermissionStatus
} = pkg;

const prisma = new PrismaClient();
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/petsaathi";
const client = new MongoClient(mongoUri);

const isReset = process.argv.includes("--reset");

async function main() {
  console.log(`\n🐾 [PetSaathi] Starting Rich Demo Data Seeder (Mode: ${isReset ? "RESET + SEED" : "UPSERT SEED"})...\n`);

  await client.connect();
  const db = client.db();
  const passwordHash = await bcrypt.hash("Password123!", 10);

  if (isReset) {
    console.log("🧹 Reset flag detected. Cleaning up demo data collections...");
    const collectionsToClean = [
      "benefit_ledger_entries",
      "benefit_wallets",
      "programme_memberships",
      "partner_programmes",
      "b2b_contracts",
      "b2b_opportunities",
      "organization_contacts",
      "organizations",
      "report_media",
      "booking_reports",
      "reviews",
      "tracking_points",
      "tracking_sessions",
      "service_events",
      "booking_status_history",
      "booking_assignments",
      "payments",
      "bookings",
      "availability_rules",
      "sitter_verifications",
      "training_attempts",
      "sitter_service_permissions",
      "vaccinations",
      "pet_risk_assessments",
      "pet_emergency_contacts",
      "pet_medical_profiles",
      "pets",
      "society_access_rules",
      "societies",
      "service_zones",
      "cities",
    ];

    for (const col of collectionsToClean) {
      try {
        await db.collection(col).deleteMany({});
      } catch (e) {
        // ignore if not exists
      }
    }
    console.log("✨ Collections cleaned.\n");
  }

  // Ensure default service types exist
  const baseServiceTypes = [
    { code: ServiceCode.DOG_WALK_30, name: "30-minute Dog Walk", durationMinutes: 30, basePricePaise: 29900 },
    { code: ServiceCode.DOG_WALK_60, name: "60-minute Dog Walk", durationMinutes: 60, basePricePaise: 49900 },
    { code: ServiceCode.HOME_VISIT, name: "Home Visit (Cats/Dogs)", durationMinutes: 45, basePricePaise: 39900 },
    { code: ServiceCode.HOME_SITTING_60, name: "60-minute Home Sitting", durationMinutes: 60, basePricePaise: 44900 },
  ];

  const serviceTypeMap = {};
  for (const st of baseServiceTypes) {
    const upserted = await prisma.serviceType.upsert({
      where: { code: st.code },
      update: { name: st.name, durationMinutes: st.durationMinutes, basePricePaise: st.basePricePaise, active: true },
      create: { code: st.code, name: st.name, description: st.name, durationMinutes: st.durationMinutes, basePricePaise: st.basePricePaise, active: true },
    });
    serviceTypeMap[st.code] = upserted.id;
  }

  // Training Module
  const trainingModule = await prisma.trainingModule.upsert({
    where: { slug: "saathi-academy-standard-v1" },
    update: {},
    create: {
      slug: "saathi-academy-standard-v1",
      title: "PetSaathi Certified Walker Academy (Gold Standard)",
      version: 1,
      passingScore: 85,
      active: true,
    }
  });

  // 1. CITIES & ZONES (Ahmedabad, Pune, Bangalore)
  console.log("🏙️  Seeding 3 Cities and Local Service Zones...");
  const citiesData = [
    {
      slug: "ahmedabad",
      name: "Ahmedabad",
      state: "Gujarat",
      zones: [
        { slug: "bopal", name: "Bopal", centroid: { lat: 23.0336, lng: 72.4635 } },
        { slug: "ambli", name: "Ambli", centroid: { lat: 23.0422, lng: 72.4826 } },
        { slug: "prahlad-nagar", name: "Prahlad Nagar", centroid: { lat: 23.0124, lng: 72.5089 } }
      ]
    },
    {
      slug: "pune",
      name: "Pune",
      state: "Maharashtra",
      zones: [
        { slug: "koregaon-park", name: "Koregaon Park", centroid: { lat: 18.5362, lng: 73.8940 } },
        { slug: "baner", name: "Baner", centroid: { lat: 18.5590, lng: 73.7868 } }
      ]
    },
    {
      slug: "bangalore",
      name: "Bangalore",
      state: "Karnataka",
      zones: [
        { slug: "indiranagar", name: "Indiranagar", centroid: { lat: 12.9784, lng: 77.6408 } },
        { slug: "hsr-layout", name: "HSR Layout", centroid: { lat: 12.9121, lng: 77.6446 } }
      ]
    }
  ];

  const cityMap = {};
  for (const c of citiesData) {
    const city = await prisma.city.upsert({
      where: { slug: c.slug },
      update: { name: c.name, state: c.state, status: CityLaunchStage.VALIDATED },
      create: { slug: c.slug, name: c.name, state: c.state, status: CityLaunchStage.VALIDATED },
    });
    cityMap[c.slug] = city;

    for (const z of c.zones) {
      await prisma.serviceZone.upsert({
        where: { cityId_slug: { cityId: city.id, slug: z.slug } },
        update: { name: z.name, status: ZoneLaunchStage.ACTIVE, centroid: z.centroid },
        create: { cityId: city.id, slug: z.slug, name: z.name, status: ZoneLaunchStage.ACTIVE, centroid: z.centroid },
      });
    }
  }

  // 2. 10 GATED SOCIETIES WITH GEOFENCE METADATA & RWA RULES
  console.log("🏢 Seeding 10 Gated Societies with geofence & RWA protocols...");
  const societiesData = [
    { slug: "ahd-iscon-platinum", name: "Iscon Platinum", city: "Ahmedabad", locality: "Bopal", lat: 23.0352, lng: 72.4678, radius: 250, rwa: "Rajesh Patel", phone: "+919825011001", gates: ["Gate 1 (Main SG Highway)", "Gate 3 (Rear Service)"], liftRule: "Use Service Lift Only for Dogs above 15kg" },
    { slug: "ahd-aarohi-crest", name: "Aarohi Crest", city: "Ahmedabad", locality: "Ambli", lat: 23.0441, lng: 72.4845, radius: 220, rwa: "Bhavin Shah", phone: "+919825011002", gates: ["Gate 2 (Ambli Road)"], liftRule: "All lifts pet friendly if leashed" },
    { slug: "ahd-safal-parivesh", name: "Safal Parivesh", city: "Ahmedabad", locality: "Prahlad Nagar", lat: 23.0135, lng: 72.5098, radius: 200, rwa: "Kirit Mehta", phone: "+919825011003", gates: ["North Gate", "South Gate"], liftRule: "Passenger lifts allowed with muzzle" },
    { slug: "ahd-goyal-intercity", name: "Goyal Intercity", city: "Ahmedabad", locality: "Ambli", lat: 23.0410, lng: 72.4812, radius: 300, rwa: "Dharmesh Soni", phone: "+919825011004", gates: ["Main Gate"], liftRule: "Tower A & B Lift 2 reserved for pets" },
    { slug: "pun-geras-songbirds", name: "Gera's Songbirds", city: "Pune", locality: "Baner", lat: 18.5582, lng: 73.7845, radius: 350, rwa: "Anand Deshmukh", phone: "+919822011005", gates: ["Clubhouse Gate", "Main Arch Gate"], liftRule: "Service elevator designated for dog walking" },
    { slug: "pun-panchshil-waterfront", name: "Waterfront by Panchshil", city: "Pune", locality: "Koregaon Park", lat: 18.5375, lng: 73.8962, radius: 180, rwa: "Sunita Kulkarni", phone: "+919822011006", gates: ["North Gate (River Road)"], liftRule: "All lifts permitted with certified Saathi" },
    { slug: "pun-rohan-kritika", name: "Rohan Kritika", city: "Pune", locality: "Baner", lat: 18.5610, lng: 73.7889, radius: 240, rwa: "Vikram Joshi", phone: "+919822011007", gates: ["Gate 1"], liftRule: "Dedicated service lift, leash mandatory" },
    { slug: "blr-adwaitha-serenity", name: "Adarsh Palm Retreat", city: "Bangalore", locality: "HSR Layout", lat: 12.9142, lng: 77.6481, radius: 450, rwa: "Karthik Narayanan", phone: "+919845011008", gates: ["East Gate", "West Gate (Pedestrian)"], liftRule: "Pet passes mandatory at Security kiosk" },
    { slug: "blr-purva-vantage", name: "Purva Vantage", city: "Bangalore", locality: "Indiranagar", lat: 12.9792, lng: 77.6432, radius: 210, rwa: "Gita Ramaswamy", phone: "+919845011009", gates: ["Main Boulevard Gate"], liftRule: "Lift 1 & 3 allowed; waste bag verification required" },
    { slug: "blr-sobha-hibiscus", name: "Sobha Hibiscus", city: "Bangalore", locality: "HSR Layout", lat: 12.9098, lng: 77.6415, radius: 280, rwa: "Suresh Babu", phone: "+919845011010", gates: ["Gate 1", "Gate 2"], liftRule: "Use rear garden path for dog exits" }
  ];

  const societyMap = {};
  for (const s of societiesData) {
    const society = await prisma.society.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        city: s.city,
        locality: s.locality,
        status: "ACTIVE",
        contactName: s.rwa,
        contactPhone: s.phone,
        securityContact: s.phone,
        geofence: {
          type: "Circle",
          center: { latitude: s.lat, longitude: s.lng },
          radiusMeters: s.radius,
        }
      },
      create: {
        slug: s.slug,
        name: s.name,
        city: s.city,
        locality: s.locality,
        status: "ACTIVE",
        contactName: s.rwa,
        contactPhone: s.phone,
        securityContact: s.phone,
        geofence: {
          type: "Circle",
          center: { latitude: s.lat, longitude: s.lng },
          radiusMeters: s.radius,
        }
      }
    });

    await prisma.societyAccessRule.upsert({
      where: { societyId: society.id },
      update: {
        visitorApprovalRequired: true,
        sitterRegistrationRequired: true,
        identityDocumentRequired: true,
        petLiftRules: s.liftRule,
        approvedGates: s.gates,
        emergencyEntryProcess: "Security fast-tracks PetSaathi badge with OTP validation",
      },
      create: {
        societyId: society.id,
        visitorApprovalRequired: true,
        sitterRegistrationRequired: true,
        identityDocumentRequired: true,
        petLiftRules: s.liftRule,
        approvedGates: s.gates,
        emergencyEntryProcess: "Security fast-tracks PetSaathi badge with OTP validation",
      }
    });

    societyMap[s.slug] = society;
  }

  // Helper to ensure user without unique collision on email or phoneE164
  async function ensureUser({ email, displayName, phoneE164, roles, customer = false, sitter = null }) {
    let existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          ...(phoneE164 ? [{ phoneE164 }] : [])
        ]
      },
      include: { roles: true, customer: true, sitter: true }
    });

    if (existing) {
      // update email/displayName if needed
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          email,
          displayName,
          status: AccountStatus.ACTIVE,
        }
      });
      // ensure roles
      for (const role of roles) {
        if (!existing.roles.some(r => r.role === role)) {
          await prisma.userRole.create({ data: { userId: existing.id, role } });
        }
      }
      return existing;
    }

    return prisma.user.create({
      data: {
        email,
        displayName,
        phoneE164,
        status: AccountStatus.ACTIVE,
        roles: { create: roles.map(r => ({ role: r })) },
        ...(customer ? { customer: { create: typeof customer === "object" ? customer : {} } } : {}),
        ...(sitter ? { sitter: { create: sitter } } : {}),
      },
      include: { roles: true, customer: true, sitter: true }
    });
  }

  // 3. ADMIN USERS (3 admins with different permission scopes)
  console.log("👮 Seeding 3 Admin Users with distinct scopes...");
  const adminsData = [
    { email: "superadmin@petsaathi.com", name: "Devansh Patel (Super Admin)", phone: "+919876543200", roles: [Role.SUPER_ADMIN, Role.OPERATIONS_ADMIN], scope: "GLOBAL_SYSTEM" },
    { email: "ops.admin@petsaathi.com", name: "Priya Nair (Operations Admin)", phone: "+919876543288", roles: [Role.OPERATIONS_ADMIN], scope: "OPS_AND_MATCHING" },
    { email: "safety.admin@petsaathi.com", name: "Dr. Vikram Sethi (Safety & Verification Admin)", phone: "+919876543287", roles: [Role.SAFETY_ADMIN, Role.VERIFICATION_ADMIN], scope: "SAFETY_AND_AUDITS" }
  ];

  for (const adm of adminsData) {
    const admin = await ensureUser({
      email: adm.email,
      displayName: adm.name,
      phoneE164: adm.phone,
      roles: adm.roles,
    });
    await db.collection("auth_credentials").updateOne(
      { userId: admin.id },
      { $set: { userId: admin.id, email: adm.email, passwordHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }

  // Also ensure standard test accounts
  const stdAccounts = [
    { email: "customer@petsaathi.com", name: "Pooja Sharma (Customer)", phone: "+919876543299", roles: [Role.CUSTOMER], customer: true },
    { email: "admin@petsaathi.com", name: "PetSaathi Core Admin", phone: "+919876543290", roles: [Role.SUPER_ADMIN, Role.OPERATIONS_ADMIN] },
    { email: "sitter@petsaathi.com", name: "Aarav Sharma (Saathi)", phone: "+919876543211", roles: [Role.SITTER], sitter: { bio: "Senior walker", yearsExperience: 5, status: SitterStatus.APPROVED } },
  ];
  for (const sa of stdAccounts) {
    const u = await ensureUser(sa);
    await db.collection("auth_credentials").updateOne(
      { userId: u.id },
      { $set: { userId: u.id, email: sa.email, passwordHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );
  }

  // 4. 10 SAATHIS (Walkers with Academy records, badges, slots, radius, ratings)
  console.log("🚶 Seeding 10 Verified Saathis (Walkers)...");
  const saathisData = [
    { email: "aarav.saathi@petsaathi.test", name: "Aarav Sharma", phone: "+919825100001", city: "Ahmedabad", locality: "Bopal", exp: 4, bio: "Certified pet handler with Canine First Aid qualification. Loves Indies and Labs.", score: 4.95, radius: 6.0 },
    { email: "neha.saathi@petsaathi.test", name: "Neha Joshi", phone: "+919825100002", city: "Ahmedabad", locality: "Ambli", exp: 3, bio: "Former vet assistant, gentle walker specialized in anxious puppies and small breeds.", score: 4.88, radius: 5.5 },
    { email: "chirag.saathi@petsaathi.test", name: "Chirag Trivedi", phone: "+919825100003", city: "Ahmedabad", locality: "Prahlad Nagar", exp: 5, bio: "Marathon runner and large-breed handler (Hounds, Retrievers, Rottweilers).", score: 4.92, radius: 7.0 },
    { email: "tanvi.saathi@petsaathi.test", name: "Tanvi Kulkarni", phone: "+919822100004", city: "Pune", locality: "Koregaon Park", exp: 4, bio: "Experienced cat sitter and dog walker. Certified in feline stress handling.", score: 4.90, radius: 5.0 },
    { email: "rohit.saathi@petsaathi.test", name: "Rohit Deshmukh", phone: "+919822100005", city: "Pune", locality: "Baner", exp: 6, bio: "Senior walker with police verification and K9 agility training background.", score: 4.97, radius: 8.0 },
    { email: "manish.saathi@petsaathi.test", name: "Manish Gaikwad", phone: "+919822100006", city: "Pune", locality: "Baner", exp: 2, bio: "Enthusiastic young Saathi with high energy for playful Beagles & Indies.", score: 4.82, radius: 4.5 },
    { email: "kavita.saathi@petsaathi.test", name: "Kavita Hegde", phone: "+919845100007", city: "Bangalore", locality: "Indiranagar", exp: 5, bio: "Bengaluru rescue volunteer with 6+ years animal rehabilitation experience.", score: 4.98, radius: 6.5 },
    { email: "arjun.saathi@petsaathi.test", name: "Arjun Reddy", phone: "+919845100008", city: "Bangalore", locality: "HSR Layout", exp: 3, bio: "Techie turned canine caregiver. Punctual, disciplined, equipped with GPS tracker.", score: 4.89, radius: 5.0 },
    { email: "deepa.saathi@petsaathi.test", name: "Deepa Menon", phone: "+919845100009", city: "Bangalore", locality: "Indiranagar", exp: 4, bio: "Patient trainer with specialized expertise in elderly dog care and arthritis walks.", score: 4.93, radius: 6.0 },
    { email: "sanjay.saathi@petsaathi.test", name: "Sanjay Rao", phone: "+919845100010", city: "Bangalore", locality: "HSR Layout", exp: 7, bio: "Master trainer & canine communication consultant. Handles reactive dogs safely.", score: 4.99, radius: 8.5 }
  ];

  const saathiProfiles = [];
  for (const s of saathisData) {
    const u = await ensureUser({
      email: s.email,
      displayName: s.name,
      phoneE164: s.phone,
      roles: [Role.SITTER],
      sitter: {
        bio: s.bio,
        yearsExperience: s.exp,
        status: SitterStatus.APPROVED,
        serviceLocality: `${s.city} (${s.locality})`,
        serviceRadiusKm: s.radius,
        reliabilityScore: s.score,
      }
    });

    await db.collection("auth_credentials").updateOne(
      { userId: u.id },
      { $set: { userId: u.id, email: s.email, passwordHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    const sitterId = u.sitter.id;
    saathiProfiles.push({ ...s, sitterId, userId: u.id });

    // Academy Training Record
    await prisma.trainingAttempt.create({
      data: {
        sitterId,
        moduleId: trainingModule.id,
        score: Math.floor(88 + Math.random() * 12),
        passed: true,
        attemptedAt: new Date(Date.now() - 30 * 86400000),
      }
    });

    // 3 Verified Badges
    const badges = [
      { type: "POLICE_VERIFICATION", label: "Police Cleared Background Check" },
      { type: "PET_FIRST_AID", label: "Certified Pet First Aid & CPR" },
      { type: "CANINE_COMMUNICATION", label: "Canine Body Language & Stress Signals" },
    ];
    for (const b of badges) {
      await prisma.sitterVerification.create({
        data: {
          sitterId,
          type: b.type,
          publicLabel: b.label,
          status: VerificationStatus.PASSED,
          checkedAt: new Date(Date.now() - 25 * 86400000),
          provider: "PetSaathi Academy Board",
        }
      });
    }

    // Permissions for services
    for (const code of [ServiceCode.DOG_WALK_30, ServiceCode.DOG_WALK_60, ServiceCode.HOME_VISIT]) {
      await prisma.sitterServicePermission.upsert({
        where: { sitterId_serviceTypeId: { sitterId, serviceTypeId: serviceTypeMap[code] } },
        update: { status: PermissionStatus.ACTIVE, riskLimit: RiskLevel.GREEN },
        create: { sitterId, serviceTypeId: serviceTypeMap[code], status: PermissionStatus.ACTIVE, riskLimit: RiskLevel.GREEN },
      });
    }

    // Weekly availability slots (Mon-Sun, morning 06:00-10:00 & evening 16:30-20:30)
    for (let day = 0; day <= 6; day++) {
      await prisma.availabilityRule.createMany({
        data: [
          { sitterId, weekday: day, startTime: "06:00", endTime: "10:00", timezone: "Asia/Kolkata", active: true },
          { sitterId, weekday: day, startTime: "16:30", endTime: "20:30", timezone: "Asia/Kolkata", active: true },
        ]
      });
    }
  }

  // 5. CUSTOMERS & 15 REALISTIC PETS
  console.log("🐶 Seeding Customers & 15 Indian-market Pets (Labrador, Shih Tzu, Indie, etc.)...");
  const petsData = [
    { name: "Bruno", species: "DOG", breed: "Labrador Retriever", sex: "Male", weight: 31.5, ageMonths: 48, city: "Ahmedabad", locality: "Bopal", vax: "7-in-1 DHPPiL", notes: "Friendly, gentle giant. Loves splashing water." },
    { name: "Simba", species: "DOG", breed: "Golden Retriever", sex: "Male", weight: 29.0, ageMonths: 36, city: "Ahmedabad", locality: "Ambli", vax: "Anti-Rabies + Corona", notes: "Excitable around balls. Very food motivated." },
    { name: "Coco", species: "DOG", breed: "Shih Tzu", sex: "Female", weight: 6.2, ageMonths: 24, city: "Ahmedabad", locality: "Prahlad Nagar", vax: "DHPPiL Booster", notes: "Needs heat protection. Walks strictly before 8 AM." },
    { name: "Sheru", species: "DOG", breed: "Indian Pariah (Indie)", sex: "Male", weight: 19.5, ageMonths: 40, city: "Ahmedabad", locality: "Bopal", vax: "Nobivac Rabies", notes: "Rescued indie. Very street-smart, dislikes horn noise." },
    { name: "Bella", species: "DOG", breed: "Beagle", sex: "Female", weight: 11.8, ageMonths: 18, city: "Pune", locality: "Koregaon Park", vax: "Canine Parvovirus + 7-in-1", notes: "Curious scent tracker. Keep harness firmly latched." },
    { name: "Leo", species: "DOG", breed: "Pug", sex: "Male", weight: 8.5, ageMonths: 30, city: "Pune", locality: "Baner", vax: "DHPPiL annual", notes: "Brachycephalic. Prone to wheezing in hot afternoons." },
    { name: "Lucy", species: "CAT", breed: "Persian Cat", sex: "Female", weight: 4.1, ageMonths: 28, city: "Pune", locality: "Koregaon Park", vax: "Tricat Trio (FVRCP)", notes: "Indoor only. Daily brush required to avoid hairballs." },
    { name: "Milo", species: "CAT", breed: "Indian Street Cat (Indie)", sex: "Male", weight: 4.6, ageMonths: 15, city: "Pune", locality: "Baner", vax: "Rabies + FVRCP", notes: "Active climber. Loves feather wand play." },
    { name: "Max", species: "DOG", breed: "Labrador Retriever", sex: "Male", weight: 34.0, ageMonths: 60, city: "Bangalore", locality: "Indiranagar", vax: "Nobivac DHPPiL", notes: "Mild arthritis in rear left leg. Moderate pace walks." },
    { name: "Daisy", species: "DOG", breed: "Golden Retriever", sex: "Female", weight: 27.5, ageMonths: 20, city: "Bangalore", locality: "HSR Layout", vax: "Anti-Rabies Certificate", notes: "Super energetic. Loves meeting children in parks." },
    { name: "Rocky", species: "DOG", breed: "Indian Pariah (Indie)", sex: "Male", weight: 21.0, ageMonths: 32, city: "Bangalore", locality: "Indiranagar", vax: "Rabies & 7-in-1 combo", notes: "Extremely agile, loyal and intelligent." },
    { name: "Chloe", species: "DOG", breed: "Shih Tzu", sex: "Female", weight: 5.8, ageMonths: 14, city: "Bangalore", locality: "HSR Layout", vax: "Puppy series complete", notes: "Picky eater, takes treats only from owner." },
    { name: "Oscar", species: "DOG", breed: "Beagle", sex: "Male", weight: 12.5, ageMonths: 42, city: "Bangalore", locality: "Indiranagar", vax: "Nobivac Rabies", notes: "Baying vocalist when seeing cats. Calm on leash." },
    { name: "Zoe", species: "CAT", breed: "Persian Cat", sex: "Female", weight: 3.9, ageMonths: 22, city: "Ahmedabad", locality: "Ambli", vax: "FVRCP Quad", notes: "Shy around strangers for first 10 minutes." },
    { name: "Kulfi", species: "DOG", breed: "Indian Pariah (Indie)", sex: "Female", weight: 18.0, ageMonths: 26, city: "Pune", locality: "Baner", vax: "Anti-Rabies booster", notes: "Playful indie with high stamina. Loves running." }
  ];

  const petEntities = [];
  const customerEntities = [];

  for (let i = 0; i < petsData.length; i++) {
    const p = petsData[i];
    const customerEmail = `parent.${p.name.toLowerCase()}@petsaathi.test`;
    const user = await ensureUser({
      email: customerEmail,
      displayName: `${p.name}'s Parent`,
      phoneE164: `+9198330000${(i + 10).toString().padStart(2, "0")}`,
      roles: [Role.CUSTOMER],
      customer: { preferredLanguage: "en", emergencyContactName: "Family Hotline", emergencyContactPhone: "+919820099999" }
    });

    await db.collection("auth_credentials").updateOne(
      { userId: user.id },
      { $set: { userId: user.id, email: customerEmail, passwordHash, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
      { upsert: true }
    );

    customerEntities.push(user);

    // Address
    const addr = await prisma.address.create({
      data: {
        userId: user.id,
        label: "Home Apartment",
        line1: `Flat ${101 + i}, Tower B`,
        locality: p.locality,
        city: p.city,
        state: p.city === "Ahmedabad" ? "Gujarat" : p.city === "Pune" ? "Maharashtra" : "Karnataka",
        postalCode: p.city === "Ahmedabad" ? "380058" : p.city === "Pune" ? "411001" : "560038",
        countryCode: "IN",
        latitude: p.city === "Ahmedabad" ? 23.035 : p.city === "Pune" ? 18.55 : 12.97,
        longitude: p.city === "Ahmedabad" ? 72.48 : p.city === "Pune" ? 73.85 : 77.64,
      }
    });

    // Pet record
    const pet = await prisma.pet.create({
      data: {
        ownerId: user.id,
        name: p.name,
        species: p.species,
        breed: p.breed,
        sex: p.sex,
        weightKg: p.weight,
        sterilised: true,
        active: true,
        photoPath: `/photos/pets/${p.name.toLowerCase()}.jpg`,
      }
    });

    // Medical profile & notes
    await prisma.petMedicalProfile.create({
      data: {
        petId: pet.id,
        allergies: "None reported",
        conditions: p.notes,
        veterinarianName: "Dr. Anjali Mehra, VetCare",
        veterinarianPhone: "+919876500000",
        emergencyClinicName: "24/7 City Emergency Pet Clinic",
        emergencyClinicPhone: "+919876500001"
      }
    });

    // Vaccination
    await prisma.vaccination.create({
      data: {
        petId: pet.id,
        vaccine: p.vax,
        administeredAt: new Date(Date.now() - 120 * 86400000),
        nextDueAt: new Date(Date.now() + 245 * 86400000),
        clinic: "VetCare India Centre",
        verifiedAt: new Date(),
      }
    });

    // Risk Assessment
    await prisma.petRiskAssessment.create({
      data: {
        petId: pet.id,
        serviceCode: ServiceCode.DOG_WALK_30,
        suggestedLevel: RiskLevel.GREEN,
        finalLevel: RiskLevel.GREEN,
        factorSnapshot: { breedGroup: p.breed, temperament: "Friendly", biteHistory: false },
      }
    });

    petEntities.push({ pet, user, address: addr, city: p.city, locality: p.locality });
  }

  // 6. 20 BOOKINGS ACROSS ALL STATUSES WITH GPS BREADCRUMBS & END-OF-SERVICE REPORTS
  console.log("📅 Seeding 20 Bookings with realistic GPS breadcrumbs & Reports...");
  const bookingStatuses = [
    BookingStatus.REQUESTED,
    BookingStatus.MATCHING,
    BookingStatus.SITTER_PROPOSED,
    BookingStatus.CUSTOMER_APPROVAL_PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.SITTER_EN_ROUTE,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
    BookingStatus.COMPLETED,
    BookingStatus.COMPLETED,
    BookingStatus.COMPLETED,
    BookingStatus.COMPLETED,
    BookingStatus.CUSTOMER_CANCELLED,
    BookingStatus.CONFIRMED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
    BookingStatus.COMPLETED,
    BookingStatus.MATCHING,
    BookingStatus.CONFIRMED,
    BookingStatus.COMPLETED,
  ];

  let bookingIndex = 0;
  for (const bStatus of bookingStatuses) {
    bookingIndex++;
    const petRef = petEntities[bookingIndex % petEntities.length];
    const saathiRef = saathiProfiles[bookingIndex % saathiProfiles.length];

    const scheduledStart = new Date(Date.now() + (bookingIndex % 5 - 2) * 86400000);
    const scheduledEnd = new Date(scheduledStart.getTime() + 30 * 60000);

    const booking = await prisma.booking.create({
      data: {
        reference: `BK-DEMO-${1000 + bookingIndex}`,
        customerId: petRef.user.id,
        petId: petRef.pet.id,
        serviceTypeId: serviceTypeMap[ServiceCode.DOG_WALK_30],
        addressId: petRef.address.id,
        status: bStatus,
        scheduledStart,
        scheduledEnd,
        quoteAmountPaise: 29900,
        currency: "INR",
        customerNotes: "Please keep on a 6-ft leash and carry fresh water.",
      }
    });

    // Assignment for relevant statuses
    if (bStatus !== BookingStatus.REQUESTED && bStatus !== BookingStatus.MATCHING) {
      let asgnStatus = AssignmentStatus.ACCEPTED;
      if (bStatus === BookingStatus.SITTER_PROPOSED) asgnStatus = AssignmentStatus.OFFERED;
      if (bStatus === BookingStatus.CUSTOMER_APPROVAL_PENDING) asgnStatus = AssignmentStatus.ACCEPTED;
      if (bStatus === BookingStatus.IN_PROGRESS || bStatus === BookingStatus.SITTER_EN_ROUTE) asgnStatus = AssignmentStatus.ACTIVE;
      if (bStatus === BookingStatus.COMPLETED) asgnStatus = AssignmentStatus.COMPLETED;
      if (bStatus === BookingStatus.CUSTOMER_CANCELLED) asgnStatus = AssignmentStatus.CANCELLED;

      await prisma.bookingAssignment.create({
        data: {
          bookingId: booking.id,
          sitterId: saathiRef.sitterId,
          type: AssignmentType.PRIMARY,
          status: asgnStatus,
          payoutPaise: 21000,
          respondedAt: new Date(),
        }
      });
    }

    // Payment for confirmed/completed/in-progress
    if ([BookingStatus.CONFIRMED, BookingStatus.SITTER_EN_ROUTE, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED].includes(bStatus)) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          provider: "razorpay",
          providerOrderId: `order_demo_${booking.id.slice(0, 8)}_${bookingIndex}`,
          providerPaymentId: `pay_demo_${booking.id.slice(0, 8)}_${bookingIndex}`,
          amountPaise: 29900,
          currency: "INR",
          status: PaymentStatus.CAPTURED,
          signatureVerified: true,
          capturedAt: new Date(),
        }
      });
    }

    // GPS Breadcrumbs (30-40 points) and End-of-Service Report for COMPLETED bookings
    if (bStatus === BookingStatus.COMPLETED || bStatus === BookingStatus.IN_PROGRESS) {
      const session = await prisma.trackingSession.create({
        data: {
          bookingId: booking.id,
          startedAt: new Date(scheduledStart.getTime() - 15 * 60000),
          endedAt: bStatus === BookingStatus.COMPLETED ? scheduledEnd : null,
          expiresAt: new Date(scheduledEnd.getTime() + 120 * 60000),
          consentBasis: "BOOKING_TERMS",
          status: bStatus === BookingStatus.COMPLETED ? "COMPLETED" : "ACTIVE",
          distanceM: 1420,
        }
      });

      // Generate 35 points with realistic lat/lng drift around center
      const centerLat = petRef.address.latitude || 23.035;
      const centerLng = petRef.address.longitude || 72.480;
      const points = [];
      for (let pt = 0; pt < 35; pt++) {
        const driftLat = (Math.sin(pt / 5) * 0.0015) + (Math.random() * 0.0002);
        const driftLng = (Math.cos(pt / 5) * 0.0015) + (Math.random() * 0.0002);
        points.push({
          sessionId: session.id,
          latitude: Number((centerLat + driftLat).toFixed(6)),
          longitude: Number((centerLng + driftLng).toFixed(6)),
          accuracyM: 4.5,
          recordedAt: new Date(scheduledStart.getTime() + pt * 45000),
        });
      }
      await prisma.trackingPoint.createMany({ data: points });

      // If COMPLETED, add End of Service Report & Review
      if (bStatus === BookingStatus.COMPLETED) {
        const report = await prisma.bookingReport.create({
          data: {
            bookingId: booking.id,
            submittedBy: saathiRef.userId,
            version: 1,
            reviewStatus: ReportReviewStatus.APPROVED,
            concernFlag: false,
            fields: {
              peeCount: 2,
              pooCount: 1,
              waterConsumedMl: 250,
              energyLevel: "Happy & Energetic",
              careNotes: "Super sweet dog! Enjoyed the shaded park trail, stayed away from street dogs, drank water willingly.",
              peeLocations: [
                { lat: centerLat + 0.0004, lng: centerLng + 0.0005, time: "10m in" },
                { lat: centerLat + 0.0009, lng: centerLng + 0.0008, time: "22m in" }
              ],
              pooLocations: [
                { lat: centerLat + 0.0006, lng: centerLng + 0.0007, time: "15m in", baggedAndDisposed: true }
              ]
            }
          }
        });

        await prisma.reportMedia.create({
          data: {
            reportId: report.id,
            objectPath: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop",
            mediaType: "IMAGE_JPEG",
            capturedAt: new Date(),
          }
        });

        await prisma.review.create({
          data: {
            bookingId: booking.id,
            customerId: petRef.user.id,
            rating: 5,
            body: "Aarav was absolutely fantastic! Sent live updates, on-time handover, and my dog returned very relaxed and hydrated.",
            public: true,
          }
        });
      }
    }
  }

  // 7. 5 CORPORATE B2B ORGANIZATIONS WITH EMPLOYEE BENEFIT ALLOCATIONS
  console.log("🏢 Seeding 5 Corporate B2B Organizations & Benefit Wallets...");
  const corporateData = [
    { name: "Infosys Bangalore", legal: "Infosys Limited", cityId: cityMap["bangalore"].id, employees: 200, domain: "infosys.com", monthlyCredits: 4 },
    { name: "TCS Pune", legal: "Tata Consultancy Services Ltd", cityId: cityMap["pune"].id, employees: 150, domain: "tcs.com", monthlyCredits: 3 },
    { name: "Adani Enterprises Ahmedabad", legal: "Adani Enterprises Ltd", cityId: cityMap["ahmedabad"].id, employees: 120, domain: "adani.com", monthlyCredits: 4 },
    { name: "Wipro Sarjapur", legal: "Wipro Technologies Ltd", cityId: cityMap["bangalore"].id, employees: 80, domain: "wipro.com", monthlyCredits: 2 },
    { name: "Tech Mahindra Pune", legal: "Tech Mahindra Limited", cityId: cityMap["pune"].id, employees: 95, domain: "techmahindra.com", monthlyCredits: 3 },
  ];

  for (let cIdx = 0; cIdx < corporateData.length; cIdx++) {
    const corp = corporateData[cIdx];
    const org = await prisma.organization.create({
      data: {
        legalName: corp.legal,
        displayName: corp.name,
        organizationType: OrganizationType.CORPORATE,
        primaryCityId: corp.cityId,
        status: OrgStatus.ACTIVE,
        gstin: `27AAACW${1000 + cIdx}A1Z${cIdx}`,
        notes: "Premium corporate pet-wellness employee perk partner.",
      }
    });

    await prisma.organizationContact.create({
      data: {
        organizationId: org.id,
        name: `HR Benefits Lead (${corp.name.split(" ")[0]})`,
        email: `benefits@${corp.domain}`,
        phone: `+9198110000${(cIdx + 1).toString().padStart(2, "0")}`,
        title: "Head of People & Benefits",
        isDecisionMaker: true,
      }
    });

    const programme = await prisma.partnerProgramme.create({
      data: {
        organizationId: org.id,
        name: `${corp.name} Employee Pet Wellness`,
        slug: `perk-${corp.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
        programmeType: ProgrammeType.CORPORATE_WALLET,
        eligibilityMethod: EligibilityMethod.DOMAIN_EMAIL,
        eligibilityDomain: corp.domain,
        status: ProgrammeStatus.ACTIVE_PROGRAMME,
        startDate: new Date(Date.now() - 60 * 86400000),
      }
    });

    // Attach 2 customer employees with benefit wallets
    for (let emp = 0; emp < 2; emp++) {
      const empUser = customerEntities[(cIdx * 2 + emp) % customerEntities.length];
      const membership = await prisma.programmeMembership.create({
        data: {
          programmeId: programme.id,
          customerId: empUser.id,
          verificationMethod: EligibilityMethod.DOMAIN_EMAIL,
          verificationStatus: MemberVerificationStatus.VERIFIED,
          verifiedAt: new Date(),
          active: true,
        }
      });

      const wallet = await prisma.benefitWallet.create({
        data: {
          programmeMembershipId: membership.id,
          status: WalletStatus.ACTIVE_WALLET,
        }
      });

      // Credit issued
      await prisma.benefitLedgerEntry.create({
        data: {
          walletId: wallet.id,
          entryType: BenefitEntryType.CREDIT_ISSUED,
          amountPaise: corp.monthlyCredits * 50000,
          balanceAfter: corp.monthlyCredits * 50000,
          reference: "Monthly Corporate Allocation",
        }
      });

      // Usage tracked (1 walk redeemed)
      await prisma.benefitLedgerEntry.create({
        data: {
          walletId: wallet.id,
          entryType: BenefitEntryType.CREDIT_REDEEMED,
          amountPaise: 49900,
          balanceAfter: (corp.monthlyCredits * 50000) - 49900,
          reference: "Redeemed for 60-min Dog Walk",
        }
      });
    }
  }

  // Summary Table
  console.log("\n═══════════════════════════════════════════════════════════════");
  console.log("             PETSAATHI RICH DEMO DATA SEEDED                ");
  console.log("═══════════════════════════════════════════════════════════════");

  const [
    cityCount,
    zoneCount,
    societyCount,
    petCount,
    saathiCount,
    bookingCount,
    reportCount,
    orgCount,
    userCount
  ] = await Promise.all([
    prisma.city.count(),
    prisma.serviceZone.count(),
    prisma.society.count(),
    prisma.pet.count(),
    prisma.sitterProfile.count(),
    prisma.booking.count(),
    prisma.bookingReport.count(),
    prisma.organization.count(),
    prisma.user.count(),
  ]);

  const summary = [
    { Entity: "Cities", Count: cityCount, Details: "Ahmedabad, Pune, Bangalore" },
    { Entity: "Service Zones", Count: zoneCount, Details: "Bopal, Ambli, Koregaon Park, Indiranagar, etc." },
    { Entity: "Gated Societies", Count: societyCount, Details: "Geofences, RWA contacts, Gate protocols, Lifts" },
    { Entity: "Indian Pets", Count: petCount, Details: "Labradors, Shih Tzus, Indies, Goldens, Persians" },
    { Entity: "Verified Saathis", Count: saathiCount, Details: "Academy passed, 3 badges, availability slots" },
    { Entity: "Demo Bookings", Count: bookingCount, Details: "REQUESTED, MATCHING, IN_PROGRESS, COMPLETED" },
    { Entity: "Service Reports", Count: reportCount, Details: "GPS breadcrumbs, Pee/Poo markers, Photos" },
    { Entity: "B2B Corporates", Count: orgCount, Details: "Infosys, TCS, Adani, Wipro, Tech Mahindra" },
    { Entity: "Total Users", Count: userCount, Details: "Customers, Saathis, Admins (Password: Password123!)" },
  ];

  console.table(summary);
  console.log("✅ Phase 1 Rich Demo Seeding Completed Successfully!\n");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await client.close();
  });

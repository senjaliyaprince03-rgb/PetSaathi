import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient, ProgrammeType, ContractStatus, ProgrammeStatus, EligibilityMethod, MemberVerificationStatus, OrganizationType } from "@prisma/client";
import { createContract, activateContract } from "../../src/modules/b2b/contract.service";
import { createProgramme, activateProgramme, getProgrammeBySlug } from "../../src/modules/b2b/programme.service";
import { enrollMember, verifyMembership } from "../../src/modules/b2b/membership.service";
import { randomUUID } from "crypto";

const prisma = new PrismaClient();

describe("Phase 13: B2B & Enterprise Partnership Integration", () => {
  let customerId: string;
  let organizationId: string;
  let contractId: string;
  let programmeId: string;
  let membershipId: string;

  beforeAll(async () => {
    // 1. Set up a user (employee)
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: `employee-${Date.now()}@acmecorp.in`,
        phoneE164: `+9199${Math.floor(10000000 + Math.random() * 90000000)}`,
        displayName: "Acme Employee",
      }
    });
    customerId = user.id;

    // 2. We need an organization. Let's create one.
    organizationId = randomUUID();
    await prisma.organization.create({
      data: {
        id: organizationId,
        legalName: "Acme Corp Ltd",
        displayName: "Acme Corp",
        organizationType: OrganizationType.CORPORATE
      }
    });
  });

  afterAll(async () => {
    // Cleanup
    if (membershipId) {
      await prisma.programmeMembership.deleteMany({ where: { id: membershipId } });
    }
    if (programmeId) {
      await prisma.partnerProgramme.deleteMany({ where: { id: programmeId } });
    }
    if (contractId) {
      await prisma.b2bContract.deleteMany({ where: { id: contractId } });
    }
    if (customerId) {
      await prisma.user.deleteMany({ where: { id: customerId } });
    }
    if (organizationId) {
      await prisma.organization.deleteMany({ where: { id: organizationId } });
    }
  });

  it("should create and activate a B2bContract", async () => {

    const startDate = new Date();
    const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

    const contract = await createContract(
      organizationId,
      ProgrammeType.CORPORATE_ACCESS,
      startDate,
      endDate,
      500000
    );
    contractId = contract.id;
    
    expect(contract.status).toBe(ContractStatus.DRAFT_CONTRACT);
    expect(contract.organizationId).toBe(organizationId);

    const activeContract = await activateContract(contractId);
    expect(activeContract.status).toBe(ContractStatus.ACTIVE_CONTRACT);
  });

  it("should create and activate a PartnerProgramme", async () => {
    const slug = `acme-corp-${Date.now()}`;
    const programme = await createProgramme(
      organizationId,
      contractId,
      "Acme Corp Pet Benefits",
      slug,
      ProgrammeType.CORPORATE_ACCESS,
      ["Ahmedabad"],
      EligibilityMethod.DOMAIN_EMAIL,
      "acmecorp.in",
      new Date(),
      new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    );
    programmeId = programme.id;

    expect(programme.status).toBe(ProgrammeStatus.DRAFT_PROGRAMME);
    expect(programme.slug).toBe(slug);

    const activeProgramme = await activateProgramme(programmeId);
    expect(activeProgramme.status).toBe(ProgrammeStatus.ACTIVE_PROGRAMME);

    const fetched = await getProgrammeBySlug(slug);
    expect(fetched.id).toBe(programmeId);
  });

  it("should enroll and verify a member in the programme", async () => {
    const membership = await enrollMember(
      programmeId,
      customerId,
      EligibilityMethod.DOMAIN_EMAIL
    );
    membershipId = membership.id;

    expect(membership.verificationStatus).toBe(MemberVerificationStatus.PENDING_VERIFICATION);
    expect(membership.programmeId).toBe(programmeId);
    expect(membership.customerId).toBe(customerId);

    const verified = await verifyMembership(membershipId);
    expect(verified.verificationStatus).toBe(MemberVerificationStatus.VERIFIED);
    expect(verified.verifiedAt).not.toBeNull();
  });
});

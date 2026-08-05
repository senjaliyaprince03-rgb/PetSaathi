import "server-only";

import {
  Prisma,
  type EligibilityMethod,
  type ProgrammeType,
  type Role,
} from "@prisma/client";

import { prisma } from "@/lib/db";
import {
  hasValidProgrammeDateWindow,
  isEligibilityMethodImplemented,
} from "@/modules/b2b/programme-policy";

const programmeAdminRoles = ["PARTNER_MANAGER", "SUPER_ADMIN"] as const;
const contractRequiredProgrammeTypes = new Set<ProgrammeType>([
  "CORPORATE_ACCESS",
  "CORPORATE_MANAGED",
  "CORPORATE_WALLET",
]);

type ProgrammeAdminActor = {
  id: string;
  roles: Role[];
  requestId?: string | null;
};

export type CreateProgrammeInput = {
  organizationId: string;
  contractId?: string;
  name: string;
  slug: string;
  programmeType: ProgrammeType;
  cityScope: string[];
  eligibilityMethod: EligibilityMethod;
  eligibilityDomain?: string;
  startDate?: Date;
  endDate?: Date;
  accountManagerId?: string;
  supportTier?: string;
  metadata?: Record<string, unknown>;
};

export type UpdateProgrammeInput = {
  name?: string;
  cityScope?: string[];
  eligibilityDomain?: string | null;
  supportTier?: string | null;
  startDate?: Date | null;
  endDate?: Date | null;
  accountManagerId?: string | null;
  metadata?: Record<string, unknown>;
};

export async function createProgramme(
  input: CreateProgrammeInput,
  actor: ProgrammeAdminActor,
) {
  const actorRole = requireProgrammeAdmin(actor);
  assertDateWindow(input.startDate ?? null, input.endDate ?? null);

  try {
    return await prisma.$transaction(
      async (tx) => {
        await validateReferences(tx, {
          organizationId: input.organizationId,
          contractId: input.contractId ?? null,
          accountManagerId: input.accountManagerId ?? null,
          requireActiveOrganization: false,
          requireActiveContract: false,
        });

        const programme = await tx.partnerProgramme.create({
          data: {
            organizationId: input.organizationId,
            contractId: input.contractId,
            name: input.name,
            slug: input.slug,
            programmeType: input.programmeType,
            cityScope: input.cityScope,
            eligibilityMethod: input.eligibilityMethod,
            eligibilityDomain: input.eligibilityDomain,
            startDate: input.startDate,
            endDate: input.endDate,
            accountManagerId: input.accountManagerId,
            supportTier: input.supportTier,
            metadata: input.metadata
              ? (input.metadata as Prisma.InputJsonValue)
              : undefined,
            status: "DRAFT_PROGRAMME",
          },
        });

        await tx.auditLog.create({
          data: {
            actorId: actor.id,
            actorRole,
            action: "partner_programme.created",
            resourceType: "partner_programme",
            resourceId: programme.id,
            after: programmeAuditSnapshot(programme),
            reason: "Partner programme draft created",
            requestId: actor.requestId,
          },
        });

        return programme;
      },
      serializableTransaction,
    );
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ProgrammeAdminError(
        409,
        "programme_conflict",
        "A programme with this slug already exists.",
      );
    }
    throw error;
  }
}

export async function updateProgramme(
  id: string,
  input: UpdateProgrammeInput,
  actor: ProgrammeAdminActor,
) {
  const actorRole = requireProgrammeAdmin(actor);

  return prisma.$transaction(
    async (tx) => {
      const previous = await tx.partnerProgramme.findUnique({
        where: { id },
      });
      if (!previous) {
        throw new ProgrammeAdminError(
          404,
          "programme_not_found",
          "The programme does not exist.",
        );
      }
      if (
        previous.status === "ACTIVE_PROGRAMME" &&
        (input.startDate !== undefined || input.endDate !== undefined)
      ) {
        throw new ProgrammeAdminError(
          409,
          "pause_required",
          "Pause the programme before changing its availability window.",
        );
      }

      const nextStart =
        input.startDate === undefined ? previous.startDate : input.startDate;
      const nextEnd =
        input.endDate === undefined ? previous.endDate : input.endDate;
      assertDateWindow(nextStart, nextEnd);

      if (input.accountManagerId) {
        await validateActiveAccountManager(tx, input.accountManagerId);
      }

      const changed = await tx.partnerProgramme.updateMany({
        where: { id, updatedAt: previous.updatedAt },
        data: {
          name: input.name,
          cityScope: input.cityScope,
          eligibilityDomain: input.eligibilityDomain,
          supportTier: input.supportTier,
          startDate: input.startDate,
          endDate: input.endDate,
          accountManagerId: input.accountManagerId,
          metadata: input.metadata
            ? (input.metadata as Prisma.InputJsonValue)
            : undefined,
        },
      });
      if (changed.count !== 1) {
        throw new ProgrammeAdminError(
          409,
          "programme_update_conflict",
          "The programme was changed by another administrator.",
        );
      }

      const updated = await tx.partnerProgramme.findUniqueOrThrow({
        where: { id },
      });
      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          actorRole,
          action: "partner_programme.updated",
          resourceType: "partner_programme",
          resourceId: id,
          before: programmeAuditSnapshot(previous),
          after: programmeAuditSnapshot(updated),
          reason: "Partner programme settings updated",
          requestId: actor.requestId,
        },
      });

      return updated;
    },
    serializableTransaction,
  );
}

export async function activateProgramme(
  id: string,
  actor: ProgrammeAdminActor,
) {
  const actorRole = requireProgrammeAdmin(actor);

  return prisma.$transaction(
    async (tx) => {
      const previous = await tx.partnerProgramme.findUnique({
        where: { id },
        include: {
          organization: { select: { status: true } },
          contract: {
            select: {
              organizationId: true,
              contractType: true,
              status: true,
              startDate: true,
              endDate: true,
            },
          },
        },
      });
      if (!previous) {
        throw new ProgrammeAdminError(
          404,
          "programme_not_found",
          "The programme does not exist.",
        );
      }
      if (
        previous.status !== "DRAFT_PROGRAMME" &&
        previous.status !== "PAUSED_PROGRAMME"
      ) {
        throw new ProgrammeAdminError(
          409,
          "invalid_programme_transition",
          "Only draft or paused programmes can be activated.",
        );
      }

      assertActivationReady(previous, new Date());

      const changed = await tx.partnerProgramme.updateMany({
        where: {
          id,
          status: previous.status,
          updatedAt: previous.updatedAt,
        },
        data: { status: "ACTIVE_PROGRAMME" },
      });
      if (changed.count !== 1) {
        throw new ProgrammeAdminError(
          409,
          "programme_transition_conflict",
          "The programme was changed by another administrator.",
        );
      }

      const updated = await tx.partnerProgramme.findUniqueOrThrow({
        where: { id },
      });
      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          actorRole,
          action: "partner_programme.activated",
          resourceType: "partner_programme",
          resourceId: id,
          before: { status: previous.status },
          after: { status: updated.status },
          reason: "Programme activation gates passed",
          requestId: actor.requestId,
        },
      });

      return updated;
    },
    serializableTransaction,
  );
}

export async function pauseProgramme(
  id: string,
  actor: ProgrammeAdminActor,
) {
  const actorRole = requireProgrammeAdmin(actor);

  return prisma.$transaction(
    async (tx) => {
      const previous = await tx.partnerProgramme.findUnique({
        where: { id },
      });
      if (!previous) {
        throw new ProgrammeAdminError(
          404,
          "programme_not_found",
          "The programme does not exist.",
        );
      }
      if (previous.status !== "ACTIVE_PROGRAMME") {
        throw new ProgrammeAdminError(
          409,
          "invalid_programme_transition",
          "Only active programmes can be paused.",
        );
      }

      const changed = await tx.partnerProgramme.updateMany({
        where: {
          id,
          status: "ACTIVE_PROGRAMME",
          updatedAt: previous.updatedAt,
        },
        data: { status: "PAUSED_PROGRAMME" },
      });
      if (changed.count !== 1) {
        throw new ProgrammeAdminError(
          409,
          "programme_transition_conflict",
          "The programme was changed by another administrator.",
        );
      }

      const updated = await tx.partnerProgramme.findUniqueOrThrow({
        where: { id },
      });
      await tx.auditLog.create({
        data: {
          actorId: actor.id,
          actorRole,
          action: "partner_programme.paused",
          resourceType: "partner_programme",
          resourceId: id,
          before: { status: previous.status },
          after: { status: updated.status },
          reason: "Programme paused by an authorized partner administrator",
          requestId: actor.requestId,
        },
      });

      return updated;
    },
    serializableTransaction,
  );
}

function assertActivationReady(
  programme: {
    organizationId: string;
    contractId: string | null;
    programmeType: ProgrammeType;
    cityScope: string[];
    eligibilityMethod: EligibilityMethod;
    startDate: Date | null;
    endDate: Date | null;
    organization: { status: string };
    contract: {
      organizationId: string;
      contractType: ProgrammeType;
      status: string;
      startDate: Date;
      endDate: Date | null;
    } | null;
  },
  now: Date,
) {
  assertDateWindow(programme.startDate, programme.endDate);
  if (programme.organization.status !== "ACTIVE") {
    throw new ProgrammeAdminError(
      409,
      "organization_not_active",
      "The organization must be active before its programme can be activated.",
    );
  }
  if (programme.cityScope.length === 0) {
    throw new ProgrammeAdminError(
      409,
      "city_scope_required",
      "At least one programme city is required.",
    );
  }
  if (!isEligibilityMethodImplemented(programme.eligibilityMethod)) {
    throw new ProgrammeAdminError(
      409,
      "eligibility_method_not_implemented",
      "This eligibility method is not available for production activation.",
    );
  }
  if (programme.endDate && programme.endDate <= now) {
    throw new ProgrammeAdminError(
      409,
      "programme_window_expired",
      "The programme end date must be in the future.",
    );
  }
  if (
    contractRequiredProgrammeTypes.has(programme.programmeType) &&
    !programme.contract
  ) {
    throw new ProgrammeAdminError(
      409,
      "active_contract_required",
      "This programme type requires a current active contract.",
    );
  }
  if (!programme.contract) return;
  if (programme.contract.organizationId !== programme.organizationId) {
    throw new ProgrammeAdminError(
      409,
      "contract_organization_mismatch",
      "The selected contract belongs to a different organization.",
    );
  }
  if (programme.contract.contractType !== programme.programmeType) {
    throw new ProgrammeAdminError(
      409,
      "contract_type_mismatch",
      "The selected contract does not cover this programme type.",
    );
  }
  if (
    programme.contract.status !== "ACTIVE_CONTRACT" ||
    programme.contract.startDate > now ||
    (programme.contract.endDate && programme.contract.endDate <= now)
  ) {
    throw new ProgrammeAdminError(
      409,
      "active_contract_required",
      "The selected contract is not currently active.",
    );
  }
  if (
    programme.startDate &&
    programme.startDate < programme.contract.startDate
  ) {
    throw new ProgrammeAdminError(
      409,
      "programme_outside_contract_window",
      "The programme cannot start before its contract.",
    );
  }
  if (
    programme.contract.endDate &&
    (!programme.endDate || programme.endDate > programme.contract.endDate)
  ) {
    throw new ProgrammeAdminError(
      409,
      "programme_outside_contract_window",
      "The programme must end within its contract window.",
    );
  }
}

async function validateReferences(
  tx: Prisma.TransactionClient,
  input: {
    organizationId: string;
    contractId: string | null;
    accountManagerId: string | null;
    requireActiveOrganization: boolean;
    requireActiveContract: boolean;
  },
) {
  const organization = await tx.organization.findUnique({
    where: { id: input.organizationId },
    select: { status: true },
  });
  if (!organization) {
    throw new ProgrammeAdminError(
      404,
      "organization_not_found",
      "The organization does not exist.",
    );
  }
  if (input.requireActiveOrganization && organization.status !== "ACTIVE") {
    throw new ProgrammeAdminError(
      409,
      "organization_not_active",
      "The organization is not active.",
    );
  }

  if (input.contractId) {
    const contract = await tx.b2bContract.findUnique({
      where: { id: input.contractId },
      select: { organizationId: true, status: true },
    });
    if (!contract) {
      throw new ProgrammeAdminError(
        404,
        "contract_not_found",
        "The contract does not exist.",
      );
    }
    if (contract.organizationId !== input.organizationId) {
      throw new ProgrammeAdminError(
        409,
        "contract_organization_mismatch",
        "The selected contract belongs to a different organization.",
      );
    }
    if (
      input.requireActiveContract &&
      contract.status !== "ACTIVE_CONTRACT"
    ) {
      throw new ProgrammeAdminError(
        409,
        "active_contract_required",
        "The selected contract is not active.",
      );
    }
  }

  if (input.accountManagerId) {
    await validateActiveAccountManager(tx, input.accountManagerId);
  }
}

async function validateActiveAccountManager(
  tx: Prisma.TransactionClient,
  accountManagerId: string,
) {
  const accountManager = await tx.user.findUnique({
    where: { id: accountManagerId },
    select: { status: true },
  });
  if (!accountManager || accountManager.status !== "ACTIVE") {
    throw new ProgrammeAdminError(
      409,
      "account_manager_not_active",
      "The account manager must be an active user.",
    );
  }
}

function assertDateWindow(startDate: Date | null, endDate: Date | null) {
  if (!hasValidProgrammeDateWindow({ startDate, endDate })) {
    throw new ProgrammeAdminError(
      409,
      "invalid_programme_window",
      "The programme end date must be after its start date.",
    );
  }
}

function requireProgrammeAdmin(actor: ProgrammeAdminActor) {
  const role = programmeAdminRoles.find((candidate) =>
    actor.roles.includes(candidate),
  );
  if (!role) {
    throw new ProgrammeAdminError(
      403,
      "forbidden",
      "Partner-management authority is required.",
    );
  }
  return role;
}

function programmeAuditSnapshot(programme: {
  organizationId: string;
  contractId: string | null;
  name: string;
  slug: string;
  programmeType: ProgrammeType;
  cityScope: string[];
  eligibilityMethod: EligibilityMethod;
  eligibilityDomain: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  supportTier: string | null;
  accountManagerId: string | null;
}) {
  return {
    organizationId: programme.organizationId,
    contractId: programme.contractId,
    name: programme.name,
    slug: programme.slug,
    programmeType: programme.programmeType,
    cityScope: programme.cityScope,
    eligibilityMethod: programme.eligibilityMethod,
    eligibilityDomain: programme.eligibilityDomain,
    startDate: programme.startDate?.toISOString() ?? null,
    endDate: programme.endDate?.toISOString() ?? null,
    status: programme.status,
    supportTier: programme.supportTier,
    accountManagerId: programme.accountManagerId,
  };
}

const serializableTransaction = {
  maxWait: 5_000,
  timeout: 15_000,
} as const;

export class ProgrammeAdminError extends Error {
  constructor(
    public readonly status: 403 | 404 | 409,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ProgrammeAdminError";
  }
}

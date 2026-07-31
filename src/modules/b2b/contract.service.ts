import type { ProgrammeType} from "@prisma/client";
import { PrismaClient, ContractStatus } from "@prisma/client";

const prisma = new PrismaClient();

export class B2bError extends Error {
  constructor(public code: string, message: string) {
    super(message);
    this.name = "B2bError";
  }
}

export async function createContract(
  organizationId: string,
  contractType: ProgrammeType,
  startDate: Date,
  endDate?: Date,
  contractedValue?: number
) {
  // Validate that endDate > startDate if provided
  if (endDate && endDate <= startDate) {
    throw new B2bError("invalid_date_window", "End date must be after start date.");
  }

  // Ensure an organization doesn't have an overlapping active contract?
  // Wait, the unique constraint is on id, organizationId in the DB.
  
  return await prisma.b2bContract.create({
    data: {
      organizationId,
      contractType,
      startDate,
      endDate,
      contractedValue,
      status: ContractStatus.DRAFT_CONTRACT
    }
  });
}

export async function activateContract(contractId: string) {
  const contract = await prisma.b2bContract.findUnique({
    where: { id: contractId }
  });

  if (!contract) {
    throw new B2bError("not_found", "Contract not found.");
  }

  if (contract.status !== ContractStatus.DRAFT_CONTRACT) {
    throw new B2bError("invalid_state", "Only draft contracts can be activated.");
  }

  return await prisma.b2bContract.update({
    where: { id: contractId },
    data: {
      status: ContractStatus.ACTIVE_CONTRACT
    }
  });
}

export async function getContracts(organizationId?: string) {
  return await prisma.b2bContract.findMany({
    where: organizationId ? { organizationId } : undefined,
    orderBy: { createdAt: "desc" }
  });
}

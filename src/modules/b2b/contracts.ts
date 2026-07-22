import { prisma } from "@/lib/db"
import type { ContractStatus, ProgrammeType, Prisma } from "@prisma/client"

export async function createContract(data: {
  organizationId: string
  opportunityId?: string
  contractType: ProgrammeType
  startDate: Date
  endDate?: Date
  renewalDate?: Date
  billingFrequency?: string
  contractedValue?: number
  paymentTermsDays?: number
  notes?: string
}) {
  return prisma.b2bContract.create({
    data: {
      ...data,
      status: "DRAFT_CONTRACT",
    },
  })
}

export async function activateContract(id: string) {
  const contract = await prisma.b2bContract.findUnique({ where: { id } })
  
  if (!contract) {
    throw new Error("Contract not found")
  }
  
  if (contract.status !== "DRAFT_CONTRACT") {
    throw new Error("Only draft contracts can be activated")
  }

  return prisma.b2bContract.update({
    where: { id },
    data: { status: "ACTIVE_CONTRACT" },
  })
}

export async function renewContract(id: string, data: { newEndDate: Date; newRenewalDate?: Date; contractedValue?: number }) {
  return prisma.$transaction(async (tx) => {
    const oldContract = await tx.b2bContract.findUnique({
      where: { id },
    })
    
    if (!oldContract) {
      throw new Error("Contract not found")
    }

    await tx.b2bContract.update({
      where: { id },
      data: { status: "RENEWED" },
    })

    const newContract = await tx.b2bContract.create({
      data: {
        organizationId: oldContract.organizationId,
        opportunityId: oldContract.opportunityId,
        contractType: oldContract.contractType,
        startDate: oldContract.endDate || new Date(),
        endDate: data.newEndDate,
        renewalDate: data.newRenewalDate,
        billingFrequency: oldContract.billingFrequency,
        contractedValue: data.contractedValue ?? oldContract.contractedValue,
        currency: oldContract.currency,
        paymentTermsDays: oldContract.paymentTermsDays,
        notes: `Renewed from contract ${oldContract.id}`,
        status: "ACTIVE_CONTRACT",
      },
    })

    return newContract
  })
}

export async function terminateContract(id: string, reason?: string) {
  const contract = await prisma.b2bContract.findUnique({ where: { id } })
  
  if (!contract) {
    throw new Error("Contract not found")
  }

  if (contract.status === "TERMINATED") {
    throw new Error("Contract is already terminated")
  }

  const updatedNotes = reason 
    ? (contract.notes ? `${contract.notes}\nTermination reason: ${reason}` : `Termination reason: ${reason}`) 
    : contract.notes;

  return prisma.b2bContract.update({
    where: { id },
    data: {
      status: "TERMINATED",
      notes: updatedNotes,
    },
  })
}

export async function getContract(id: string) {
  return prisma.b2bContract.findUnique({
    where: { id },
    include: {
      organization: {
        select: {
          displayName: true,
        },
      },
      programmes: {
        select: {
          id: true,
          name: true,
          status: true,
        },
      },
    },
  })
}

export async function listContracts(filters: {
  organizationId?: string
  status?: ContractStatus
  page?: number
  pageSize?: number
}) {
  const page = filters.page || 1
  const pageSize = filters.pageSize || 10
  const skip = (page - 1) * pageSize

  const where: Prisma.B2bContractWhereInput = {
    ...(filters.organizationId && { organizationId: filters.organizationId }),
    ...(filters.status && { status: filters.status }),
  }

  const [items, total] = await Promise.all([
    prisma.b2bContract.findMany({
      where,
      skip,
      take: pageSize,
      include: {
        organization: {
          select: { displayName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.b2bContract.count({ where }),
  ])

  return {
    items,
    total,
    page,
    pageSize,
  }
}

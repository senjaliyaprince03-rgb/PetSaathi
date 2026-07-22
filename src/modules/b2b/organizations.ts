import { prisma } from "@/lib/db";
import type { OrganizationType, OrgStatus, OrgContactRole, Prisma } from "@prisma/client";

export async function createOrganization(data: {
  legalName: string;
  displayName: string;
  organizationType: OrganizationType;
  website?: string;
  primaryCityId?: string;
  gstin?: string;
  billingAddressId?: string;
  accountOwnerId?: string;
  notes?: string;
}) {
  return prisma.organization.create({
    data: {
      ...data,
      status: "PROSPECT",
    },
  });
}

export async function updateOrganization(
  id: string,
  data: Partial<{
    displayName: string;
    website: string;
    gstin: string;
    billingAddressId: string;
    status: OrgStatus;
    accountOwnerId: string;
    notes: string;
  }>
) {
  return prisma.organization.update({
    where: { id },
    data,
  });
}

export async function getOrganization(id: string) {
  return prisma.organization.findUnique({
    where: { id },
    include: {
      contacts: true,
      _count: {
        select: {
          programmes: true,
          opportunities: true,
          contracts: true,
        },
      },
    },
  });
}

export async function listOrganizations(filters: {
  type?: OrganizationType;
  status?: OrgStatus;
  cityId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}) {
  const page = filters.page || 1;
  const pageSize = filters.pageSize || 10;
  const skip = (page - 1) * pageSize;

  const where: Prisma.OrganizationWhereInput = {};

  if (filters.type) {
    where.organizationType = filters.type;
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.cityId) {
    where.primaryCityId = filters.cityId;
  }
  if (filters.search) {
    where.OR = [
      { legalName: { contains: filters.search, mode: "insensitive" } },
      { displayName: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.organization.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    }),
    prisma.organization.count({ where }),
  ]);

  return { items, total, page, pageSize };
}

export async function addContact(
  organizationId: string,
  data: {
    name: string;
    title?: string;
    department?: string;
    email?: string;
    phone?: string;
    roleType?: OrgContactRole;
    isDecisionMaker?: boolean;
  }
) {
  return prisma.organizationContact.create({
    data: {
      organizationId,
      ...data,
    },
  });
}

export async function updateContact(
  id: string,
  data: Partial<{
    name: string;
    title: string;
    department: string;
    email: string;
    phone: string;
    roleType: OrgContactRole;
    isDecisionMaker: boolean;
    active: boolean;
  }>
) {
  return prisma.organizationContact.update({
    where: { id },
    data,
  });
}

export async function listContacts(organizationId: string) {
  return prisma.organizationContact.findMany({
    where: { organizationId },
    orderBy: [
      { isDecisionMaker: "desc" },
      { name: "asc" },
    ],
  });
}

/* eslint-disable */
import { prisma } from "@/lib/db";

export async function createPromotionCode(data: {
  programmeId?: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  maximumDiscount?: number;
  minimumOrder?: number;
  totalUsageLimit?: number;
  perMemberLimit?: number;
  serviceScope?: string[];
  cityScope?: string[];
  validFrom: Date;
  validUntil: Date;
}) {
  return prisma.promotionCode.create({
    data: {
      ...data,
      active: true,
      perMemberLimit: data.perMemberLimit ?? 1,
    }
  });
}

export async function validateCode(
  code: string,
  context: {
    orderAmountPaise: number;
    serviceCode?: string;
    cityId?: string;
    customerId: string;
  }
): Promise<{ valid: boolean; discountPaise: number; reason?: string }> {
  const promotion = await prisma.promotionCode.findUnique({
    where: { code }
  });

  if (!promotion) {
    return { valid: false, discountPaise: 0, reason: "Invalid code" };
  }

  if (!promotion.active) {
    return { valid: false, discountPaise: 0, reason: "Code is not active" };
  }

  const now = new Date();
  if (now < promotion.validFrom || now > promotion.validUntil) {
    return { valid: false, discountPaise: 0, reason: "Code is expired or not yet valid" };
  }

  if (promotion.minimumOrder && context.orderAmountPaise < promotion.minimumOrder) {
    return { valid: false, discountPaise: 0, reason: "Minimum order amount not met" };
  }

  if (promotion.serviceScope && promotion.serviceScope.length > 0 && context.serviceCode) {
    if (!promotion.serviceScope.includes(context.serviceCode)) {
      return { valid: false, discountPaise: 0, reason: "Code not applicable for this service" };
    }
  }

  if (promotion.cityScope && promotion.cityScope.length > 0 && context.cityId) {
    if (!promotion.cityScope.includes(context.cityId)) {
      return { valid: false, discountPaise: 0, reason: "Code not applicable in this city" };
    }
  }

  if (promotion.totalUsageLimit !== null) {
    const totalUsage = await (prisma as any).benefitLedgerEntry.count({
      where: { reference: code }
    });
    if (totalUsage >= promotion.totalUsageLimit) {
      return { valid: false, discountPaise: 0, reason: "Total usage limit reached" };
    }
  }

  if (promotion.perMemberLimit !== null) {
    const memberUsage = await (prisma as any).benefitLedgerEntry.count({
      where: { reference: code, customerId: context.customerId }
    });
    if (memberUsage >= promotion.perMemberLimit) {
      return { valid: false, discountPaise: 0, reason: "Per member usage limit reached" };
    }
  }

  let discountPaise = 0;
  if (promotion.discountType === 'PERCENTAGE') {
    discountPaise = Math.floor((context.orderAmountPaise * promotion.discountValue) / 10000);
    if (promotion.maximumDiscount !== null && discountPaise > promotion.maximumDiscount) {
      discountPaise = promotion.maximumDiscount;
    }
  } else if (promotion.discountType === 'FIXED') {
    discountPaise = promotion.discountValue;
  }

  if (discountPaise > context.orderAmountPaise) {
    discountPaise = context.orderAmountPaise;
  }

  return { valid: true, discountPaise };
}

export async function deactivateCode(id: string) {
  return prisma.promotionCode.update({
    where: { id },
    data: { active: false }
  });
}

export async function listCodes(filters: {
  programmeId?: string;
  active?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<{ items: unknown[]; total: number }> {
  const { page = 1, pageSize = 20, programmeId, active } = filters;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const where: Record<string, unknown> = {};
  if (programmeId !== undefined) where.programmeId = programmeId;
  if (active !== undefined) where.active = active;

  const [items, total] = await Promise.all([
    prisma.promotionCode.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.promotionCode.count({ where })
  ]);

  return { items, total };
}

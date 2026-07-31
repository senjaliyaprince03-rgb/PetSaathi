import "server-only";

import { prisma } from "@/lib/db";
import {
  averageResolutionHours,
  percentage,
} from "@/modules/b2b/reporting-metrics";

type ProgrammeSummary = {
  name: string;
  organizationId: string;
  status: string;
};

export interface CorporateReport {
  programme: ProgrammeSummary & { startDate: Date };
  enrollment: {
    eligible: number;
    verified: number;
    active: number;
    enrollmentRate: number;
  };
  bookings: {
    total: number;
    completed: number;
    completionRate: number;
    averageRating: number;
  };
  credits: {
    issued: number;
    redeemed: number;
    expired: number;
    balance: number;
  };
  complaints: {
    total: number;
    resolved: number;
    avgResolutionHours: number;
  };
  generatedAt: Date;
}

export interface SocietyReport {
  programme: ProgrammeSummary;
  households: {
    registered: number;
    active: number;
  };
  services: {
    bookingsByType: { serviceType: string; count: number }[];
    totalBookings: number;
    completionRate: number;
  };
  capacity: {
    activeSitters: number;
  };
  generatedAt: Date;
}

export interface BrandReport {
  programme: ProgrammeSummary;
  reach: {
    membersReached: number;
    landingPageViews: number;
  };
  redemptions: {
    codesIssued: number;
    codesRedeemed: number;
    totalDiscountPaise: number;
  };
  generatedAt: Date;
}

const verifiedMemberFilter = (programmeId: string) => ({
  programmeId,
  verificationStatus: "VERIFIED" as const,
});

const activeVerifiedMemberFilter = (programmeId: string) => ({
  ...verifiedMemberFilter(programmeId),
  active: true,
});

const bookingForProgrammeMembers = (programmeId: string) => ({
  customer: {
    programmeMemberships: {
      some: activeVerifiedMemberFilter(programmeId),
    },
  },
});

export async function generateCorporateReport(
  programmeId: string,
): Promise<CorporateReport> {
  const memberBookings = bookingForProgrammeMembers(programmeId);
  const [
    programme,
    eligible,
    verified,
    active,
    totalBookings,
    completedBookings,
    reviewStats,
    issuedCredits,
    redeemedCredits,
    expiredCredits,
    complaints,
  ] = await Promise.all([
    prisma.partnerProgramme.findUniqueOrThrow({ where: { id: programmeId } }),
    prisma.programmeMembership.count({ where: { programmeId } }),
    prisma.programmeMembership.count({
      where: verifiedMemberFilter(programmeId),
    }),
    prisma.programmeMembership.count({
      where: activeVerifiedMemberFilter(programmeId),
    }),
    prisma.booking.count({ where: memberBookings }),
    prisma.booking.count({
      where: { ...memberBookings, status: "COMPLETED" },
    }),
    prisma.review.aggregate({
      where: { booking: memberBookings },
      _avg: { rating: true },
    }),
    prisma.benefitLedgerEntry.aggregate({
      where: {
        wallet: { membership: { programmeId } },
        entryType: "CREDIT_ISSUED",
      },
      _sum: { amountPaise: true },
    }),
    prisma.benefitLedgerEntry.aggregate({
      where: {
        wallet: { membership: { programmeId } },
        entryType: "CREDIT_REDEEMED",
      },
      _sum: { amountPaise: true },
    }),
    prisma.benefitLedgerEntry.aggregate({
      where: {
        wallet: { membership: { programmeId } },
        entryType: "CREDIT_EXPIRED",
      },
      _sum: { amountPaise: true },
    }),
    prisma.complaint.findMany({
      where: {
        customer: {
          programmeMemberships: {
            some: activeVerifiedMemberFilter(programmeId),
          },
        },
      },
      select: { createdAt: true, resolvedAt: true },
    }),
  ]);

  const issued = issuedCredits._sum.amountPaise ?? 0;
  const redeemed = redeemedCredits._sum.amountPaise ?? 0;
  const expired = expiredCredits._sum.amountPaise ?? 0;
  const resolved = complaints.filter((complaint) => complaint.resolvedAt);

  return {
    programme: {
      name: programme.name,
      organizationId: programme.organizationId,
      status: programme.status,
      startDate: programme.startDate ?? programme.createdAt,
    },
    enrollment: {
      eligible,
      verified,
      active,
      enrollmentRate: percentage(verified, eligible),
    },
    bookings: {
      total: totalBookings,
      completed: completedBookings,
      completionRate: percentage(completedBookings, totalBookings),
      averageRating: reviewStats._avg.rating ?? 0,
    },
    credits: {
      issued,
      redeemed,
      expired,
      balance: issued - redeemed - expired,
    },
    complaints: {
      total: complaints.length,
      resolved: resolved.length,
      avgResolutionHours: averageResolutionHours(complaints),
    },
    generatedAt: new Date(),
  };
}

export async function generateSocietyReport(
  programmeId: string,
): Promise<SocietyReport> {
  const memberBookings = bookingForProgrammeMembers(programmeId);
  const [
    programme,
    registered,
    active,
    totalBookings,
    completedBookings,
    groupedBookings,
    activeSitterAssignments,
  ] = await Promise.all([
    prisma.partnerProgramme.findUniqueOrThrow({ where: { id: programmeId } }),
    prisma.programmeMembership.count({ where: { programmeId } }),
    prisma.programmeMembership.count({
      where: activeVerifiedMemberFilter(programmeId),
    }),
    prisma.booking.count({ where: memberBookings }),
    prisma.booking.count({
      where: { ...memberBookings, status: "COMPLETED" },
    }),
    prisma.booking.groupBy({
      by: ["serviceTypeId"],
      where: memberBookings,
      _count: { _all: true },
    }),
    prisma.bookingAssignment.findMany({
      where: {
        booking: memberBookings,
        sitter: { status: "APPROVED" },
      },
      select: { sitterId: true },
      distinct: ["sitterId"],
    }),
  ]);

  const serviceTypes = await prisma.serviceType.findMany({
    where: {
      id: { in: groupedBookings.map((group) => group.serviceTypeId) },
    },
    select: { id: true, name: true },
  });
  const serviceNames = new Map(
    serviceTypes.map((service) => [service.id, service.name]),
  );

  return {
    programme: {
      name: programme.name,
      organizationId: programme.organizationId,
      status: programme.status,
    },
    households: { registered, active },
    services: {
      bookingsByType: groupedBookings
        .map((group) => ({
          serviceType:
            serviceNames.get(group.serviceTypeId) ?? group.serviceTypeId,
          count: group._count._all,
        }))
        .sort(
          (left, right) =>
            right.count - left.count ||
            left.serviceType.localeCompare(right.serviceType),
        ),
      totalBookings,
      completionRate: percentage(completedBookings, totalBookings),
    },
    capacity: { activeSitters: activeSitterAssignments.length },
    generatedAt: new Date(),
  };
}

export async function generateBrandReport(
  programmeId: string,
): Promise<BrandReport> {
  const [programme, membersReached, promotionCodes, landingPageViews] =
    await Promise.all([
      prisma.partnerProgramme.findUniqueOrThrow({ where: { id: programmeId } }),
      prisma.programmeMembership.count({ where: { programmeId } }),
      prisma.promotionCode.findMany({
        where: { programmeId },
        select: { code: true },
      }),
      prisma.auditLog.count({
        where: {
          resourceType: "partner_programme",
          resourceId: programmeId,
          action: "partner_programme.page_view",
        },
      }),
    ]);

  const codes = promotionCodes.map((promotion) => promotion.code);
  const redemptionWhere = {
    entryType: "CREDIT_REDEEMED" as const,
    reference: { in: codes },
    wallet: { membership: { programmeId } },
  };
  const [codesRedeemed, totalDiscount] = codes.length
    ? await Promise.all([
        prisma.benefitLedgerEntry.count({ where: redemptionWhere }),
        prisma.benefitLedgerEntry.aggregate({
          where: redemptionWhere,
          _sum: { amountPaise: true },
        }),
      ])
    : [0, { _sum: { amountPaise: null } }];

  return {
    programme: {
      name: programme.name,
      organizationId: programme.organizationId,
      status: programme.status,
    },
    reach: { membersReached, landingPageViews },
    redemptions: {
      codesIssued: promotionCodes.length,
      codesRedeemed,
      totalDiscountPaise: totalDiscount._sum.amountPaise ?? 0,
    },
    generatedAt: new Date(),
  };
}

export async function recordProgrammePageView(programmeId: string) {
  await prisma.auditLog.create({
    data: {
      action: "partner_programme.page_view",
      resourceType: "partner_programme",
      resourceId: programmeId,
      after: { source: "public_benefits_page" },
    },
  });
}

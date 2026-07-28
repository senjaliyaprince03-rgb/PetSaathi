/* eslint-disable */
// @ts-nocheck
import { prisma } from "@/lib/db";

export interface CorporateReport {
  programme: {
    name: string;
    organizationId: string;
    status: string;
    startDate: Date;
  };
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
  programme: {
    name: string;
    organizationId: string;
    status: string;
  };
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
  programme: {
    name: string;
    organizationId: string;
    status: string;
  };
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

export async function generateCorporateReport(programmeId: string): Promise<CorporateReport> {
  const programme = await prisma.partnerProgramme.findUniqueOrThrow({
    where: { id: programmeId },
  });

  const eligible = await prisma.programmeMembership.count({
    where: { programmeId },
  });
  
  const verified = await prisma.programmeMembership.count({
    where: { programmeId, verificationStatus: 'VERIFIED' },
  });

  const active = await prisma.programmeMembership.count({
    where: { programmeId, active: true },
  });

  const totalBookings = await prisma.booking.count({
    where: {
      customer: {
        programmeMemberships: {
          some: { programmeId, verificationStatus: 'VERIFIED' }
        }
      }
    }
  });

  const completedBookings = await prisma.booking.count({
    where: {
      status: 'COMPLETED',
      customer: {
        programmeMemberships: {
          some: { programmeId, verificationStatus: 'VERIFIED' }
        }
      }
    }
  });

  const reviewStats = await prisma.review.aggregate({
    where: {
      booking: {
        customer: {
          programmeMemberships: {
            some: { programmeId, verificationStatus: 'VERIFIED' }
          }
        }
      }
    },
    _avg: {
      rating: true
    }
  });

  const issuedCredits = await prisma.benefitLedgerEntry.aggregate({
    where: { programmeId, type: 'ISSUED' },
    _sum: { amountPaise: true }
  });
  const redeemedCredits = await prisma.benefitLedgerEntry.aggregate({
    where: { programmeId, type: 'REDEEMED' },
    _sum: { amountPaise: true }
  });
  const expiredCredits = await prisma.benefitLedgerEntry.aggregate({
    where: { programmeId, type: 'EXPIRED' },
    _sum: { amountPaise: true }
  });

  const totalComplaints = await prisma.complaint.count({
    where: { programmeId }
  });
  const resolvedComplaints = await prisma.complaint.count({
    where: { programmeId, status: 'RESOLVED' }
  });

  const enrollmentRate = eligible > 0 ? (verified / eligible) * 100 : 0;
  const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;
  const averageRating = reviewStats._avg.rating || 0;

  const issued = issuedCredits._sum.amountPaise || 0;
  const redeemed = redeemedCredits._sum.amountPaise || 0;
  const expired = expiredCredits._sum.amountPaise || 0;
  const balance = issued - redeemed - expired;

  return {
    programme: {
      name: programme.name,
      organizationId: programme.organizationName,
      status: programme.status,
      startDate: programme.createdAt,
    },
    enrollment: {
      eligible,
      verified,
      active,
      enrollmentRate,
    },
    bookings: {
      total: totalBookings,
      completed: completedBookings,
      completionRate,
      averageRating,
    },
    credits: {
      issued,
      redeemed,
      expired,
      balance,
    },
    complaints: {
      total: totalComplaints,
      resolved: resolvedComplaints,
      avgResolutionHours: 0, // Placeholder
    },
    generatedAt: new Date(),
  };
}

export async function generateSocietyReport(programmeId: string): Promise<SocietyReport> {
  const programme = await prisma.partnerProgramme.findUniqueOrThrow({
    where: { id: programmeId },
  });

  const registered = await prisma.user.count({
    where: { programmeId }
  });
  const active = await prisma.user.count({
    where: { programmeId, status: 'ACTIVE' }
  });

  const totalBookings = await prisma.booking.count({
    where: { programmeId }
  });
  const completedBookings = await prisma.booking.count({
    where: { programmeId, status: 'COMPLETED' }
  });
  
  const completionRate = totalBookings > 0 ? (completedBookings / totalBookings) * 100 : 0;

  const activeSitters = await prisma.user.count({
    where: { programmeId, status: 'ACTIVE' }
  });

  return {
    programme: {
      name: programme.name,
      organizationId: programme.organizationName,
      status: programme.status,
    },
    households: {
      registered,
      active,
    },
    services: {
      bookingsByType: [], // Placeholder, can be aggregated using group by
      totalBookings,
      completionRate,
    },
    capacity: {
      activeSitters,
    },
    generatedAt: new Date(),
  };
}

export async function generateBrandReport(programmeId: string): Promise<BrandReport> {
  const programme = await prisma.partnerProgramme.findUniqueOrThrow({
    where: { id: programmeId },
  });

  const membersReached = await prisma.programmeMembership.count({
    where: { programmeId }
  });

  const codesIssued = await prisma.promotionCode.count({
    where: { programmeId }
  });
  const codesRedeemed = await prisma.promotionCode.count({
    where: { programmeId, status: 'REDEEMED' }
  });
  const totalDiscount = await prisma.promotionCode.aggregate({
    where: { programmeId, status: 'REDEEMED' },
    _sum: { discountPaise: true }
  });

  return {
    programme: {
      name: programme.name,
      organizationId: programme.organizationName,
      status: programme.status,
    },
    reach: {
      membersReached,
      landingPageViews: 0, // For MVP, landingPageViews can be 0
    },
    redemptions: {
      codesIssued,
      codesRedeemed,
      totalDiscountPaise: totalDiscount._sum.discountPaise || 0,
    },
    generatedAt: new Date(),
  };
}

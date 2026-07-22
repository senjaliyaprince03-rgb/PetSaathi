/**
 * Investor Metrics Extraction Module
 *
 * Generates the real-time KPI matrix required for the investor data room.
 * Covers: Scale, Economics, Demand, Supply, Safety, and Retention.
 */

import { prisma } from "@/lib/db";

export interface InvestorMetrics {
  generatedAt: string;
  scale: ScaleMetrics;
  economics: EconomicsMetrics;
  demand: DemandMetrics;
  safety: SafetyMetrics;
  retention: RetentionMetrics;
}

interface ScaleMetrics {
  totalCities: number;
  activeCities: number;
  totalServiceZones: number;
  totalRegisteredUsers: number;
  totalActiveSitters: number;
  totalBookingsAllTime: number;
}

interface EconomicsMetrics {
  latestMonthGbvPaise: bigint;
  latestMonthNetRevenuePaise: bigint;
  latestMonthCm1Paise: bigint;
  latestMonthCm2Paise: bigint;
  averageCacPaise: number;
  averageOrderValuePaise: number;
}

interface DemandMetrics {
  totalPets: number;
  bookingsLast30Days: number;
  bookingsLast90Days: number;
  subscriptionCount: number;
}

interface SafetyMetrics {
  totalIncidents: number;
  unresolvedCritical: number;
  activeSuspensions: number;
  averageHealthScore: number;
}

interface RetentionMetrics {
  totalReviews: number;
  averageRating: number;
}

export async function generateInvestorMetrics(): Promise<InvestorMetrics> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

  // ── Scale ──────────────────────────────────────────────────
  const [
    totalCities,
    activeCities,
    totalServiceZones,
    totalRegisteredUsers,
    totalActiveSitters,
    totalBookingsAllTime,
  ] = await Promise.all([
    prisma.city.count(),
    prisma.city.count({
      where: { status: { in: ["VALIDATED", "GROWTH", "MATURE"] } },
    }),
    prisma.serviceZone.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    prisma.user.count({
      where: {
        roles: { some: { role: "SITTER" } },
      },
    }),
    prisma.booking.count(),
  ]);

  // ── Economics ──────────────────────────────────────────────
  const latestFinancials = await prisma.cityFinancialRecord.findMany({
    orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
    take: 50, // all cities, latest month
  });

  // Group by period to find the latest month
  let latestGbv = BigInt(0);
  let latestRevenue = BigInt(0);
  let latestCm1 = BigInt(0);
  let latestCm2 = BigInt(0);
  let totalCac = 0;
  let cacCount = 0;

  if (latestFinancials.length > 0) {
    const latest = latestFinancials[0];
    if (latest) {
      const topMonth = latest.periodMonth;
      const topYear = latest.periodYear;
      const thisMonthRecords = latestFinancials.filter(
        (r) => r.periodMonth === topMonth && r.periodYear === topYear,
      );

      for (const r of thisMonthRecords) {
        latestGbv += r.gbvPaise;
        latestRevenue += r.netRevenuePaise;
        latestCm1 += r.cm1Paise;
        latestCm2 += r.cm2Paise;
        if (r.blendedCacPaise > 0) {
          totalCac += r.blendedCacPaise;
          cacCount++;
        }
      }
    }
  }

  const aovResult = await prisma.booking.aggregate({
    _avg: { quoteAmountPaise: true },
    where: { status: "COMPLETED" },
  });

  // ── Demand ─────────────────────────────────────────────────
  const [totalPets, bookingsLast30, bookingsLast90, subscriptionCount] =
    await Promise.all([
      prisma.pet.count(),
      prisma.booking.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),
      prisma.booking.count({
        where: { createdAt: { gte: ninetyDaysAgo } },
      }),
      prisma.subscription.count({
        where: { status: "ACTIVE" },
      }),
    ]);

  // ── Safety ─────────────────────────────────────────────────
  const [totalIncidents, unresolvedCritical, activeSuspensions] =
    await Promise.all([
      prisma.incident.count(),
      prisma.incident.count({
        where: {
          severity: "CRITICAL",
          status: { not: "CLOSED" },
        },
      }),
      prisma.providerSuspension.count({
        where: {
          liftedAt: null,
          OR: [
            { expiresAt: { gt: now } },
            { expiresAt: null },
          ],
        },
      }),
    ]);

  const healthAgg = await prisma.cityHealthScore.aggregate({
    _avg: { overallScore: true },
  });

  // ── Retention ──────────────────────────────────────────────
  const reviewStats = await prisma.review.aggregate({
    _count: true,
    _avg: { rating: true },
  });

  return {
    generatedAt: now.toISOString(),
    scale: {
      totalCities,
      activeCities,
      totalServiceZones,
      totalRegisteredUsers,
      totalActiveSitters,
      totalBookingsAllTime,
    },
    economics: {
      latestMonthGbvPaise: latestGbv,
      latestMonthNetRevenuePaise: latestRevenue,
      latestMonthCm1Paise: latestCm1,
      latestMonthCm2Paise: latestCm2,
      averageCacPaise: cacCount > 0 ? Math.round(totalCac / cacCount) : 0,
      averageOrderValuePaise: aovResult._avg?.quoteAmountPaise ?? 0,
    },
    demand: {
      totalPets,
      bookingsLast30Days: bookingsLast30,
      bookingsLast90Days: bookingsLast90,
      subscriptionCount,
    },
    safety: {
      totalIncidents,
      unresolvedCritical,
      activeSuspensions,
      averageHealthScore: healthAgg._avg?.overallScore ?? 0,
    },
    retention: {
      totalReviews: reviewStats._count,
      averageRating: reviewStats._avg?.rating ?? 0,
    },
  };
}

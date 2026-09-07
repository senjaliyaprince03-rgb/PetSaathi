import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const identity = await getCurrentIdentity();
    if (!identity || (!identity.roles.includes("SUPER_ADMIN") && !identity.roles.includes("OPERATIONS_ADMIN"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalUsers,
      totalSitters,
      verifiedSitters,
      totalBookings,
      activeBookings,
      completedBookings,
      cancelledBookings,
      paymentsAggregate,
      recentIncidents,
      openSupportTickets,
      activeEmergencyIncidents
    ] = await Promise.all([
      prisma.user.count(),
      prisma.sitterProfile.count(),
      prisma.sitterProfile.count({ where: { status: "APPROVED" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "IN_PROGRESS" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
      prisma.booking.count({
        where: {
          status: { in: ["CUSTOMER_CANCELLED", "SITTER_CANCELLED"] }
        }
      }),
      prisma.payment.aggregate({
        _sum: { amountPaise: true },
        where: { status: "CAPTURED" }
      }),
      prisma.incident.count({ where: { status: "REPORTED" } }),
      prisma.supportCase.count({ where: { status: "OPEN" } }),
      prisma.incident.count({
        where: {
          severity: "CRITICAL",
          status: "REPORTED"
        }
      })
    ]);

    const totalRevenuePaise = paymentsAggregate._sum.amountPaise || 0;
    const totalRevenueRupees = totalRevenuePaise / 100;

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      kpis: {
        users: {
          total: totalUsers,
          sitters: totalSitters,
          verifiedSitters,
          verificationRate: totalSitters > 0 ? ((verifiedSitters / totalSitters) * 100).toFixed(1) + "%" : "0%"
        },
        bookings: {
          total: totalBookings,
          active: activeBookings,
          completed: completedBookings,
          cancelled: cancelledBookings,
          completionRate: totalBookings > 0 ? ((completedBookings / totalBookings) * 100).toFixed(1) + "%" : "0%"
        },
        financials: {
          totalRevenuePaise,
          totalRevenueRupees,
          formattedRevenue: "₹" + totalRevenueRupees.toLocaleString("en-IN")
        },
        operations: {
          openIncidents: recentIncidents,
          criticalAlerts: activeEmergencyIncidents,
          openSupportCases: openSupportTickets,
          systemStatus: activeEmergencyIncidents > 0 ? "ATTENTION_REQUIRED" : "NORMAL"
        }
      }
    }, {
      headers: {
        "Cache-Control": "no-store"
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error?.message || "Failed to fetch KPIs"
    }, { status: 500 });
  }
}
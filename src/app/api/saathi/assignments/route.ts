import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";

export async function GET() {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("SITTER")) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const sitter = await prisma.sitterProfile.findUnique({ where: { userId: identity.id }, select: { id: true } });
  if (!sitter) return NextResponse.json({ assignments: [] });

  const assignments = await prisma.bookingAssignment.findMany({
    where: { sitterId: sitter.id },
    orderBy: { booking: { scheduledStart: "desc" } },
    take: 50,
    select: { id: true, type: true, status: true, responseDueAt: true, payoutPaise: true, booking: { select: { id: true, reference: true, status: true, scheduledStart: true, scheduledEnd: true, pet: { select: { name: true, species: true, breed: true } }, serviceType: { select: { code: true, name: true } }, address: { select: { label: true, locality: true, city: true, line1: true, line2: true, landmark: true } } } } }
  });

  const safeAssignments = assignments.map((assignment) => {
    const exactAddressAllowed = ["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"].includes(assignment.status) && ["CONFIRMED", "SITTER_EN_ROUTE", "IN_PROGRESS", "REPORT_PENDING", "COMPLETED", "CLOSED"].includes(assignment.booking.status);
    return { ...assignment, booking: { ...assignment.booking, address: exactAddressAllowed ? assignment.booking.address : { label: assignment.booking.address.label, locality: assignment.booking.address.locality, city: assignment.booking.address.city } } };
  });
  return NextResponse.json({ assignments: safeAssignments }, { headers: { "Cache-Control": "private, no-store" } });
}

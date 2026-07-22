import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { getCurrentIdentity } from "@/modules/auth/session";
import { sitterApplicationSchema } from "@/modules/sitters/application-input";

export async function POST(request: Request) {
  const identity = await getCurrentIdentity();
  if (!identity?.roles.includes("CUSTOMER")) return NextResponse.json({ error: "sign_in_required" }, { status: 401 });
  const parsed = sitterApplicationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid_request", issues: parsed.error.flatten() }, { status: 422 });

  const existing = await prisma.sitterProfile.findUnique({ where: { userId: identity.id }, select: { id: true, status: true } });
  if (existing && !["APPLICANT", "REJECTED"].includes(existing.status)) return NextResponse.json({ error: "application_already_in_review", status: existing.status }, { status: 409 });
  const serviceTypes = await prisma.serviceType.findMany({ where: { code: { in: parsed.data.services } }, select: { id: true } });
  if (serviceTypes.length !== new Set(parsed.data.services).size) return NextResponse.json({ error: "service_catalog_incomplete" }, { status: 503 });

  const sitter = await prisma.$transaction(async (tx) => {
    const profile = await tx.sitterProfile.upsert({ where: { userId: identity.id }, update: { status: "APPLICANT", bio: parsed.data.motivation, yearsExperience: parsed.data.yearsExperience, serviceLocality: parsed.data.locality, applicationAt: new Date() }, create: { userId: identity.id, status: "APPLICANT", bio: parsed.data.motivation, yearsExperience: parsed.data.yearsExperience, serviceLocality: parsed.data.locality } });
    await tx.userRole.upsert({ where: { userId_role: { userId: identity.id, role: "SITTER" } }, update: {}, create: { userId: identity.id, role: "SITTER", grantedBy: identity.id } });
    for (const service of serviceTypes) await tx.sitterServicePermission.upsert({ where: { sitterId_serviceTypeId: { sitterId: profile.id, serviceTypeId: service.id } }, update: { status: "PENDING", reason: "Requested in caregiver application" }, create: { sitterId: profile.id, serviceTypeId: service.id, status: "PENDING", reason: "Requested in caregiver application" } });
    await tx.auditLog.create({ data: { actorId: identity.id, actorRole: "CUSTOMER", action: "sitter.application_submitted", resourceType: "sitter_profile", resourceId: profile.id, after: { status: "APPLICANT", locality: parsed.data.locality, servicesRequested: parsed.data.services, yearsExperience: parsed.data.yearsExperience } } });
    return profile;
  });
  return NextResponse.json({ application: { id: sitter.id, status: sitter.status } }, { status: 201 });
}

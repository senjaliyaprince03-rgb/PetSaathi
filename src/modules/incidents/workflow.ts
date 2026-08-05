import { randomUUID } from "node:crypto";

import { Prisma, type Role } from "@prisma/client";

import { prisma } from "@/lib/db";
import { canTransitionBooking, type BookingStatus } from "@/modules/bookings/state-machine";
import { canTransitionIncident, type IncidentStatus } from "@/modules/incidents/state-machine";

export const incidentCategories = ["INJURY", "ILLNESS", "ESCAPE", "BITE", "PROPERTY", "WELFARE", "OTHER"] as const;
export const incidentSeverities = ["LOW", "MODERATE", "HIGH", "CRITICAL"] as const;
export const incidentEventTypes = ["TRIAGE_NOTE", "OWNER_CONTACTED", "VET_CONTACTED", "TRANSPORT_UPDATE", "MONITORING_UPDATE", "REVIEW_NOTE", "CORRECTIVE_ACTION_REVIEW", "CLOSURE_NOTE", "COMMUNICATION_RECORDED", "EVIDENCE_NOTE"] as const;
export const incidentBookingResolutions = ["CONFIRMED", "IN_PROGRESS", "REPORT_PENDING", "COMPLETED", "REPLACEMENT_REQUIRED"] as const;

export type IncidentActor = { id: string; roles: Role[] };
export type IncidentReportInput = {
  category: (typeof incidentCategories)[number];
  severity: (typeof incidentSeverities)[number];
  description: string;
  observedSymptoms?: string;
  detectedAt?: Date;
};

export async function reportBookingIncident(bookingId: string, actor: IncidentActor, input: IncidentReportInput) {
  return prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        reference: true,
        status: true,
        customerId: true,
        petId: true,
        assignments: {
          where: { status: { in: ["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"] } },
          orderBy: { offeredAt: "desc" },
          select: { sitterId: true, sitter: { select: { userId: true } } }
        }
      }
    });
    if (!booking) throw new IncidentWorkflowError(404, "booking_not_found", "The booking does not exist.");
    const assignment = booking.assignments.find(({ sitter }) => sitter.userId === actor.id) ?? booking.assignments[0];
    const privileged = actor.roles.some((role) => ["OPERATIONS_ADMIN", "SAFETY_ADMIN", "SUPER_ADMIN"].includes(role));
    const authorised = booking.customerId === actor.id || booking.assignments.some(({ sitter }) => sitter.userId === actor.id) || privileged;
    if (!authorised) throw new IncidentWorkflowError(403, "forbidden", "This booking is outside your authorised scope.");

    const reference = `INC-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${randomUUID().slice(0, 6).toUpperCase()}`;
    const holdBooking = canTransitionBooking(booking.status as BookingStatus, "INCIDENT_HOLD");
    const incident = await tx.incident.create({
      data: {
        reference,
        bookingId: booking.id,
        petId: booking.petId,
        sitterId: assignment?.sitterId,
        customerId: booking.customerId,
        category: input.category,
        severity: input.severity,
        description: input.description,
        observedSymptoms: input.observedSymptoms,
        detectedAt: input.detectedAt ?? new Date(),
        events: { create: { actorId: actor.id, type: "INCIDENT_REPORTED", details: { bookingStatusBeforeHold: booking.status, sourceRoles: actor.roles } } }
      }
    });

    if (holdBooking) {
      await tx.booking.update({
        where: { id: booking.id },
        data: {
          status: "INCIDENT_HOLD",
          statusHistory: { create: { fromState: booking.status, toState: "INCIDENT_HOLD", actorId: actor.id, reason: `Incident ${reference} reported` } }
        }
      });
    }

    await tx.auditLog.create({
      data: {
        actorId: actor.id,
        actorRole: auditRole(actor),
        action: "incident.reported",
        resourceType: "incident",
        resourceId: incident.id,
        before: { bookingStatus: booking.status },
        after: { incidentStatus: incident.status, severity: incident.severity, bookingStatus: holdBooking ? "INCIDENT_HOLD" : booking.status },
        reason: input.description
      }
    });

    const recipients = new Map<string, { type: string; userId?: string }>();
    recipients.set("safety-queue", { type: "SAFETY_QUEUE" });
    recipients.set(booking.customerId, { type: "CUSTOMER", userId: booking.customerId });
    for (const row of booking.assignments) recipients.set(row.sitter.userId, { type: "SITTER", userId: row.sitter.userId });
    for (const [recipientRef, recipient] of recipients) {
      await queueIncidentNotification(tx, {
        incidentId: incident.id,
        recipientType: recipient.type,
        recipientRef,
        userId: recipient.userId,
        templateKey: "incident.reported",
        payload: { incidentId: incident.id, incidentReference: reference, bookingReference: booking.reference, severity: input.severity, bookingHeld: holdBooking },
        idempotencyKey: `incident-reported:${incident.id}:${recipientRef}`
      });
    }

    return { incident, bookingHeld: holdBooking };
  }, { maxWait: 5_000, timeout: 15_000 });
}

export async function recordIncidentEvent(incidentId: string, actor: IncidentActor, input: { type: (typeof incidentEventTypes)[number]; details: string }) {
  return prisma.$transaction(async (tx) => {
    const incident = await tx.incident.findUnique({ where: { id: incidentId }, select: { id: true, reference: true, status: true } });
    if (!incident) throw new IncidentWorkflowError(404, "incident_not_found", "The incident does not exist.");
    if (incident.status === "CLOSED") throw new IncidentWorkflowError(409, "incident_closed", "Closed incident evidence is immutable.");
    const event = await tx.incidentEvent.create({ data: { incidentId, actorId: actor.id, type: input.type, details: { note: input.details } } });
    await tx.auditLog.create({ data: { actorId: actor.id, actorRole: auditRole(actor), action: "incident.event_recorded", resourceType: "incident", resourceId: incident.id, before: { status: incident.status }, after: { eventId: event.id, eventType: event.type }, reason: input.details } });
    return event;
  });
}

export async function transitionIncident(incidentId: string, actor: IncidentActor, input: { toState: IncidentStatus; details: string; eventType: (typeof incidentEventTypes)[number]; bookingResolution?: (typeof incidentBookingResolutions)[number] }) {
  return prisma.$transaction(async (tx) => {
    const incident = await tx.incident.findUnique({
      where: { id: incidentId },
      include: {
        booking: {
          select: {
            id: true,
            reference: true,
            status: true,
            customerId: true,
            assignments: { where: { status: { in: ["CUSTOMER_APPROVED", "ACTIVE", "COMPLETED"] } }, select: { id: true, sitter: { select: { userId: true } } } }
          }
        },
        events: { select: { type: true } },
        correctiveActions: { select: { id: true, completedAt: true } }
      }
    });
    if (!incident) throw new IncidentWorkflowError(404, "incident_not_found", "The incident does not exist.");
    if (!canTransitionIncident(incident.status as IncidentStatus, input.toState)) throw new IncidentWorkflowError(409, "invalid_incident_transition", "This incident transition is not allowed.");
    if (input.bookingResolution && input.toState !== "CLOSED") throw new IncidentWorkflowError(422, "premature_booking_resolution", "Booking recovery is recorded only when the incident closes.");

    if (input.toState === "CLOSED") {
      const ownerContacted = incident.events.some(({ type }) => type === "OWNER_CONTACTED" || type === "COMMUNICATION_RECORDED");
      const reviewed = incident.events.some(({ type }) => type === "REVIEW_NOTE" || type === "CORRECTIVE_ACTION_REVIEW");
      if (!ownerContacted) throw new IncidentWorkflowError(409, "owner_communication_required", "Record owner communication before closure.");
      if (!reviewed) throw new IncidentWorkflowError(409, "incident_review_required", "Record the incident review before closure.");
      if (["HIGH", "CRITICAL"].includes(incident.severity) && incident.correctiveActions.length === 0) throw new IncidentWorkflowError(409, "corrective_action_required", "High and critical incidents require at least one corrective action.");
      if (incident.correctiveActions.some(({ completedAt }) => !completedAt)) throw new IncidentWorkflowError(409, "corrective_actions_open", "Complete every corrective action before closure.");
      if (incident.booking.status === "INCIDENT_HOLD" && !input.bookingResolution) throw new IncidentWorkflowError(409, "booking_resolution_required", "Choose the booking recovery state before closure.");
      if (incident.booking.status !== "INCIDENT_HOLD" && input.bookingResolution) throw new IncidentWorkflowError(409, "booking_not_held", "This booking does not require an incident-hold recovery state.");
      if (input.bookingResolution && !canTransitionBooking(incident.booking.status as BookingStatus, input.bookingResolution)) throw new IncidentWorkflowError(409, "invalid_booking_resolution", "The selected booking recovery is not allowed.");
    }

    const now = new Date();
    const event = await tx.incidentEvent.create({ data: { incidentId: incident.id, actorId: actor.id, type: input.eventType, details: { note: input.details, fromState: incident.status, toState: input.toState, bookingResolution: input.bookingResolution } } });
    const updated = await tx.incident.update({
      where: { id: incident.id },
      data: {
        status: input.toState,
        resolvedAt: input.toState === "IMMEDIATE_RISK_RESOLVED" ? now : undefined,
        closedAt: input.toState === "CLOSED" ? now : undefined,
        closedBy: input.toState === "CLOSED" ? actor.id : undefined
      }
    });

    if (input.toState === "CLOSED" && input.bookingResolution) {
      if (input.bookingResolution === "REPLACEMENT_REQUIRED") {
        await tx.bookingAssignment.updateMany({ where: { bookingId: incident.booking.id, status: { in: ["CUSTOMER_APPROVED", "ACTIVE"] } }, data: { status: "CANCELLED" } });
      }
      await tx.booking.update({
        where: { id: incident.booking.id },
        data: {
          status: input.bookingResolution,
          statusHistory: { create: { fromState: incident.booking.status, toState: input.bookingResolution, actorId: actor.id, reason: `Incident ${incident.reference} closed`, metadata: { incidentId: incident.id } } }
        }
      });
    }

    await tx.auditLog.create({
      data: {
        actorId: actor.id,
        actorRole: auditRole(actor),
        action: "incident.transition",
        resourceType: "incident",
        resourceId: incident.id,
        before: { status: incident.status, bookingStatus: incident.booking.status },
        after: { status: updated.status, bookingStatus: input.bookingResolution ?? incident.booking.status, eventId: event.id },
        reason: input.details
      }
    });

    if (input.toState === "CLOSED") {
      const participantIds = new Set([incident.booking.customerId, ...incident.booking.assignments.map(({ sitter }) => sitter.userId)]);
      for (const userId of participantIds) {
        await queueIncidentNotification(tx, {
          incidentId: incident.id,
          recipientType: userId === incident.booking.customerId ? "CUSTOMER" : "SITTER",
          recipientRef: userId,
          userId,
          templateKey: "incident.closed",
          payload: { incidentId: incident.id, incidentReference: incident.reference, bookingReference: incident.booking.reference, bookingStatus: input.bookingResolution ?? incident.booking.status },
          idempotencyKey: `incident-closed:${incident.id}:${userId}`
        });
      }
    }
    return { incident: updated, bookingStatus: input.bookingResolution ?? incident.booking.status };
  }, { maxWait: 5_000, timeout: 15_000 });
}

export async function createIncidentCorrectiveAction(incidentId: string, actor: IncidentActor, input: { title: string; ownerId?: string; dueAt: Date }) {
  return prisma.$transaction(async (tx) => {
    const incident = await tx.incident.findUnique({ where: { id: incidentId }, select: { id: true, status: true } });
    if (!incident) throw new IncidentWorkflowError(404, "incident_not_found", "The incident does not exist.");
    if (!(["REVIEW_PENDING", "CORRECTIVE_ACTION_OPEN"] as string[]).includes(incident.status)) throw new IncidentWorkflowError(409, "corrective_action_not_available", "Corrective actions are assigned during review.");
    const ownerId = input.ownerId ?? actor.id;
    const owner = await tx.user.findFirst({ where: { id: ownerId, status: "ACTIVE", roles: { some: { role: { in: ["OPERATIONS_ADMIN", "SAFETY_ADMIN", "SUPER_ADMIN"] } } } }, select: { id: true } });
    if (!owner) throw new IncidentWorkflowError(422, "invalid_action_owner", "The corrective-action owner must be an active authorised administrator.");
    const action = await tx.correctiveAction.create({ data: { incidentId, title: input.title, ownerId, dueAt: input.dueAt } });
    if (incident.status === "REVIEW_PENDING") {
      await tx.incident.update({ where: { id: incident.id }, data: { status: "CORRECTIVE_ACTION_OPEN" } });
      await tx.incidentEvent.create({ data: { incidentId, actorId: actor.id, type: "CORRECTIVE_ACTION_REVIEW", details: { note: "Corrective action assigned", actionId: action.id, ownerId, dueAt: input.dueAt.toISOString() } } });
    }
    await tx.auditLog.create({ data: { actorId: actor.id, actorRole: auditRole(actor), action: "incident.corrective_action_created", resourceType: "corrective_action", resourceId: action.id, after: { incidentId, ownerId, dueAt: input.dueAt.toISOString(), title: input.title }, reason: input.title } });
    return action;
  });
}

export async function completeIncidentCorrectiveAction(incidentId: string, actionId: string, actor: IncidentActor, completionNote: string) {
  return prisma.$transaction(async (tx) => {
    const action = await tx.correctiveAction.findFirst({ where: { id: actionId, incidentId }, include: { incident: { select: { status: true } } } });
    if (!action) throw new IncidentWorkflowError(404, "corrective_action_not_found", "The corrective action does not exist.");
    if (action.incident.status === "CLOSED") throw new IncidentWorkflowError(409, "incident_closed", "Closed incident records are immutable.");
    if (action.completedAt) throw new IncidentWorkflowError(409, "corrective_action_completed", "This corrective action is already complete.");
    const completedAt = new Date();
    const updated = await tx.correctiveAction.update({ where: { id: action.id }, data: { completedAt, evidence: { completionNote, completedBy: actor.id, completedAt: completedAt.toISOString() } } });
    await tx.incidentEvent.create({ data: { incidentId, actorId: actor.id, type: "CORRECTIVE_ACTION_REVIEW", details: { note: completionNote, actionId: action.id, completed: true } } });
    await tx.auditLog.create({ data: { actorId: actor.id, actorRole: auditRole(actor), action: "incident.corrective_action_completed", resourceType: "corrective_action", resourceId: action.id, before: { completedAt: null }, after: { completedAt: completedAt.toISOString() }, reason: completionNote } });
    return updated;
  });
}

export async function placeIncidentSitterHold(incidentId: string, actor: IncidentActor, input: { reason: string; expiresAt?: Date }) {
  return prisma.$transaction(async (tx) => {
    const incident = await tx.incident.findUnique({ where: { id: incidentId }, select: { id: true, reference: true, status: true, sitterId: true } });
    if (!incident) throw new IncidentWorkflowError(404, "incident_not_found", "The incident does not exist.");
    if (incident.status === "CLOSED") throw new IncidentWorkflowError(409, "incident_closed", "A hold cannot be added after closure.");
    if (!incident.sitterId) throw new IncidentWorkflowError(409, "incident_sitter_missing", "This incident is not linked to a Saathi.");
    const now = new Date();
    await tx.sitterHold.updateMany({ where: { sitterId: incident.sitterId, status: "ACTIVE", expiresAt: { lte: now } }, data: { status: "EXPIRED", releasedAt: now, releaseReason: "Automatic expiry reached" } });
    const existing = await tx.sitterHold.findFirst({ where: { sitterId: incident.sitterId, status: "ACTIVE" }, select: { id: true } });
    if (existing) throw new IncidentWorkflowError(409, "sitter_already_held", "The Saathi already has an active safety hold.");
    const hold = await tx.sitterHold.create({ data: { sitterId: incident.sitterId, incidentId, reason: input.reason, placedBy: actor.id, expiresAt: input.expiresAt } });
    await tx.incidentEvent.create({ data: { incidentId, actorId: actor.id, type: "SITTER_HOLD_PLACED", details: { holdId: hold.id, reason: input.reason, expiresAt: input.expiresAt?.toISOString() } } });
    await tx.auditLog.create({ data: { actorId: actor.id, actorRole: auditRole(actor), action: "sitter.safety_hold_placed", resourceType: "sitter_hold", resourceId: hold.id, after: { incidentId, sitterId: incident.sitterId, expiresAt: input.expiresAt?.toISOString() }, reason: input.reason } });
    const sitter = await tx.sitterProfile.findUnique({ where: { id: incident.sitterId }, select: { userId: true } });
    if (sitter) await queueIncidentNotification(tx, { incidentId, recipientType: "SITTER", recipientRef: sitter.userId, userId: sitter.userId, templateKey: "sitter.safety_hold_placed", payload: { incidentId, holdId: hold.id, reason: input.reason, expiresAt: input.expiresAt?.toISOString() ?? null }, idempotencyKey: `sitter-hold-placed:${hold.id}` });
    return hold;
  });
}

export async function releaseIncidentSitterHold(incidentId: string, actor: IncidentActor, reason: string) {
  return prisma.$transaction(async (tx) => {
    const hold = await tx.sitterHold.findFirst({ where: { incidentId, status: "ACTIVE" }, orderBy: { placedAt: "desc" } });
    if (!hold) throw new IncidentWorkflowError(404, "active_hold_not_found", "This incident has no active Saathi hold.");
    const releasedAt = new Date();
    const updated = await tx.sitterHold.update({ where: { id: hold.id }, data: { status: "RELEASED", releasedBy: actor.id, releasedAt, releaseReason: reason } });
    await tx.incidentEvent.create({ data: { incidentId, actorId: actor.id, type: "SITTER_HOLD_RELEASED", details: { holdId: hold.id, reason } } });
    await tx.auditLog.create({ data: { actorId: actor.id, actorRole: auditRole(actor), action: "sitter.safety_hold_released", resourceType: "sitter_hold", resourceId: hold.id, before: { status: hold.status }, after: { status: updated.status, releasedAt: releasedAt.toISOString() }, reason } });
    const sitter = await tx.sitterProfile.findUnique({ where: { id: hold.sitterId }, select: { userId: true } });
    if (sitter) await queueIncidentNotification(tx, { incidentId, recipientType: "SITTER", recipientRef: sitter.userId, userId: sitter.userId, templateKey: "sitter.safety_hold_released", payload: { incidentId, holdId: hold.id, reason }, idempotencyKey: `sitter-hold-released:${hold.id}` });
    return updated;
  });
}

type NotificationInput = {
  incidentId: string;
  recipientType: string;
  recipientRef: string;
  userId?: string;
  templateKey: string;
  payload: Prisma.InputJsonObject;
  idempotencyKey: string;
};

async function queueIncidentNotification(tx: Prisma.TransactionClient, input: NotificationInput) {
  const notification = await tx.notificationOutbox.create({
    data: {
      userId: input.userId,
      channel: "IN_APP",
      templateKey: input.templateKey,
      destination: input.recipientRef,
      payload: input.payload,
      idempotencyKey: input.idempotencyKey
    }
  });
  await tx.incidentNotification.create({ data: { incidentId: input.incidentId, recipientType: input.recipientType, recipientRef: input.recipientRef, channel: "IN_APP", notificationId: notification.id } });
}

function auditRole(actor: IncidentActor): Role | undefined {
  const priority: Role[] = ["SUPER_ADMIN", "SAFETY_ADMIN", "OPERATIONS_ADMIN", "SITTER", "CUSTOMER"];
  return priority.find((role) => actor.roles.includes(role)) ?? actor.roles[0];
}

export class IncidentWorkflowError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); }
}

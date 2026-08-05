import "server-only";

import { randomUUID } from "node:crypto";

import { Prisma, type PartnerOrderStatus, type Role } from "@prisma/client";

import { prisma } from "@/lib/db";
import { canTransitionPartnerOrder } from "@/modules/partners/order-state-machine";

export class PartnerOrderWorkflowError extends Error {
  constructor(public readonly status: number, public readonly code: string, message: string) { super(message); }
}

export async function createPartnerOrder(customerId: string, input: { partnerServiceId: string; petId?: string; scheduledAt?: Date; instructions?: string }) {
  return prisma.$transaction(async (tx) => {
    if (input.petId) {
      const pet = await tx.pet.findFirst({ where: { id: input.petId, ownerId: customerId, active: true }, select: { id: true } });
      if (!pet) throw new PartnerOrderWorkflowError(404, "pet_not_found", "The selected pet is not available to your account.");
    }
    const service = await tx.partnerService.findFirst({
      where: {
        id: input.partnerServiceId,
        status: "ACTIVE",
        partner: {
          status: "ACTIVE",
          verifications: {
            some: {
              status: "PASSED",
              OR: [
                { expiresAt: null },
                { expiresAt: { isSet: false } },
                { expiresAt: { gt: new Date() } },
              ],
            },
          }
        }
      },
      select: { id: true, serviceCode: true, partner: { select: { displayName: true } } }
    });
    if (!service) throw new PartnerOrderWorkflowError(409, "partner_service_unavailable", "This partner service is not available for controlled requests.");
    const reference = `PS-${new Date().toISOString().slice(2, 10).replaceAll("-", "")}-${randomUUID().slice(0, 6).toUpperCase()}`;
    const order = await tx.partnerOrder.create({
      data: {
        reference,
        partnerServiceId: service.id,
        customerId,
        petId: input.petId,
        scheduledAt: input.scheduledAt,
        instructions: input.instructions,
        metadata: { commercialStatus: "REQUEST_ONLY", paymentStatus: "NOT_COLLECTED", policyRequired: true }
      }
    });
    await tx.auditLog.create({ data: { actorId: customerId, actorRole: "CUSTOMER", action: "partner_order.requested", resourceType: "partner_order", resourceId: order.id, after: { reference, partnerServiceId: service.id, serviceCode: service.serviceCode, scheduledAt: input.scheduledAt?.toISOString() ?? null }, reason: "Controlled partner-service request" } });
    await queueCustomerNotice(tx, customerId, "partner_order.requested", { orderId: order.id, reference, partnerName: service.partner.displayName, serviceCode: service.serviceCode }, `partner-order-requested:${order.id}`);
    return order;
  }, { maxWait: 5_000, timeout: 15_000 });
}

export async function transitionPartnerOrder(orderId: string, actor: { id: string; roles: Role[] }, input: { toState: PartnerOrderStatus; note: string; scheduledAt?: Date }) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.partnerOrder.findUnique({ where: { id: orderId }, include: { partnerService: { include: { partner: { select: { displayName: true } } } } } });
    if (!order) throw new PartnerOrderWorkflowError(404, "partner_order_not_found", "The partner order does not exist.");
    if (!canTransitionPartnerOrder(order.status, input.toState)) throw new PartnerOrderWorkflowError(409, "invalid_partner_order_transition", "This partner order transition is not allowed.");
    if (input.toState === "SCHEDULED" && !input.scheduledAt && !order.scheduledAt) throw new PartnerOrderWorkflowError(422, "scheduled_time_required", "A scheduled time is required before the order can be scheduled.");
    const updated = await tx.partnerOrder.update({ where: { id: order.id }, data: { status: input.toState, scheduledAt: input.scheduledAt ?? undefined, metadata: { ...(readMetadata(order.metadata)), latestManagerNote: input.note, commercialStatus: "REQUEST_ONLY", paymentStatus: "NOT_COLLECTED", policyRequired: true } } });
    const role = actor.roles.includes("SUPER_ADMIN") ? "SUPER_ADMIN" : "PARTNER_MANAGER";
    await tx.auditLog.create({ data: { actorId: actor.id, actorRole: role, action: "partner_order.transition", resourceType: "partner_order", resourceId: order.id, before: { status: order.status, scheduledAt: order.scheduledAt?.toISOString() ?? null }, after: { status: updated.status, scheduledAt: updated.scheduledAt?.toISOString() ?? null }, reason: input.note } });
    await queueCustomerNotice(tx, order.customerId, `partner_order.${input.toState.toLowerCase()}`, { orderId: order.id, reference: order.reference, partnerName: order.partnerService.partner.displayName, status: input.toState, scheduledAt: updated.scheduledAt?.toISOString() ?? null }, `partner-order-${input.toState.toLowerCase()}:${order.id}`);
    return updated;
  }, { maxWait: 5_000, timeout: 15_000 });
}

async function queueCustomerNotice(tx: Prisma.TransactionClient, userId: string, templateKey: string, payload: Prisma.InputJsonObject, idempotencyKey: string) {
  await tx.notificationOutbox.create({ data: { userId, channel: "IN_APP", templateKey, destination: userId, payload, idempotencyKey } });
}

function readMetadata(value: Prisma.JsonValue | null): Prisma.InputJsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value) ? value as Prisma.InputJsonObject : {};
}

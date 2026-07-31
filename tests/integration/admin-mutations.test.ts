import { randomUUID } from "node:crypto";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "@/lib/db";
import { POST as MembershipsPOST } from "@/app/api/admin/community/memberships/[id]/route";
import { PATCH as LeadsPATCH } from "@/app/api/admin/leads/[id]/route";
import { POST as TestimonialsPOST } from "@/app/api/admin/testimonials/[id]/route";
import type { AppIdentity } from "@/modules/auth/session";

vi.mock("@/modules/auth/session", () => ({
  getCurrentIdentity: vi.fn(),
  hasAnyRole: vi.fn(),
}));
import { getCurrentIdentity, hasAnyRole } from "@/modules/auth/session";
type Role = "OPERATIONS_ADMIN" | "SUPER_ADMIN" | "PARTNER_MANAGER" | "CUSTOMER" | "SOCIETY_MANAGER";

describe("Admin Mutation Handlers", () => {
  const ids = {
    membership: "",
    lead: "",
    testimonial: "",
    contact: "",
    group: "",
    adminId: randomUUID()
  };

  function identity(roles: Role[]): AppIdentity {
    return {
      id: ids.adminId,
      authUserId: randomUUID(),
      displayName: "Integration Admin",
      status: "ACTIVE",
      roles
    };
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    const contact = await prisma.contact.create({
      data: { firstName: "Test", lastName: "Contact", email: "contact-@example.test" }
    });
    ids.contact = contact.id;
    const group = await prisma.communityGroup.create({
      data: { slug: "test-group-" + randomUUID(), name: "Test Group", platform: "WHATSAPP" }
    });
    ids.group = group.id;
    const membership = await prisma.communityMembership.create({
      data: { groupId: group.id, contactId: contact.id, status: "PENDING" }
    });
    ids.membership = membership.id;
    const lead = await prisma.lead.create({
      data: { name: "Test Lead", type: "PARTNER", email: "lead-@example.test", phoneE164: "+1234567890", source: "WEBSITE", status: "NEW", message: "Test message", consentToContact: true }
    });
    ids.lead = lead.id;
    const testimonial = await prisma.testimonial.create({
      data: { displayName: "Test Author", quote: "Test quote", status: "IN_REVIEW" }
    });
    ids.testimonial = testimonial.id;
  });

  afterEach(async () => {
    await prisma.auditLog.deleteMany({ where: { OR: [{ resourceType: "community_membership" }, { resourceType: "lead" }, { resourceType: "testimonial" }] } });
    if (ids.membership) await prisma.communityMembership.deleteMany({ where: { id: ids.membership } });
    if (ids.lead) await prisma.lead.deleteMany({ where: { id: ids.lead } });
    if (ids.testimonial) await prisma.testimonial.deleteMany({ where: { id: ids.testimonial } });
    if (ids.contact) await prisma.contact.deleteMany({ where: { id: ids.contact } });
    if (ids.group) await prisma.communityGroup.deleteMany({ where: { id: ids.group } });
  });

  describe("Community Memberships POST", () => {
    it("returns 401 for anonymous access", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(null);
      const req = new Request(`http://localhost/api/admin/community/memberships/`, { method: "POST", body: JSON.stringify({ action: "APPROVED" }) });
      const res = await MembershipsPOST(req, { params: Promise.resolve({ id: ids.membership }) });
      expect(res.status).toBe(401);
    });

    it("returns 403 for unauthorized role", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(identity(["CUSTOMER"]));
      vi.mocked(hasAnyRole).mockReturnValue(false);
      const req = new Request(`http://localhost/api/admin/community/memberships/`, { method: "POST", body: JSON.stringify({ action: "APPROVED" }) });
      const res = await MembershipsPOST(req, { params: Promise.resolve({ id: ids.membership }) });
      expect(res.status).toBe(403);
    });

    it("returns 422 for invalid input", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(identity(["SUPER_ADMIN"]));
      vi.mocked(hasAnyRole).mockReturnValue(true);
      const req = new Request(`http://localhost/api/admin/community/memberships/`, { method: "POST", body: JSON.stringify({ action: "INVALID_ACTION" }) });
      const res = await MembershipsPOST(req, { params: Promise.resolve({ id: ids.membership }) });
      expect(res.status).toBe(422);
    });

    it("approves membership and creates audit log when authorized", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(identity(["SOCIETY_MANAGER"]));
      vi.mocked(hasAnyRole).mockReturnValue(true);
      const req = new Request(`http://localhost/api/admin/community/memberships/`, { method: "POST", body: JSON.stringify({ action: "APPROVED", reason: "Verified docs" }) });
      const res = await MembershipsPOST(req, { params: Promise.resolve({ id: ids.membership }) });
      expect(res.status).toBe(200);
    });

    it("rejects a second decision for an already decided membership", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(identity(["SOCIETY_MANAGER"]));
      await prisma.communityMembership.update({ where: { id: ids.membership }, data: { status: "APPROVED", joinedAt: new Date() } });
      const req = new Request(`http://localhost/api/admin/community/memberships/`, { method: "POST", body: JSON.stringify({ action: "REJECTED", reason: "Second decision" }) });
      const res = await MembershipsPOST(req, { params: Promise.resolve({ id: ids.membership }) });
      expect(res.status).toBe(409);
    });
  });

  describe("Leads PATCH", () => {
    it("returns 401 for anonymous access", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(null);
      const req = new Request(`http://localhost/api/admin/leads/`, { method: "PATCH", body: JSON.stringify({ status: "CONTACTED", reason: "Initial outreach" }) });
      const res = await LeadsPATCH(req, { params: Promise.resolve({ id: ids.lead }) });
      expect(res.status).toBe(401);
    });

    it("returns 404 for missing record", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(identity(["OPERATIONS_ADMIN"]));
      vi.mocked(hasAnyRole).mockReturnValue(true);
      const fakeId = randomUUID();
      const req = new Request(`http://localhost/api/admin/leads/`, { method: "PATCH", body: JSON.stringify({ status: "CONTACTED", reason: "Initial outreach" }) });
      const res = await LeadsPATCH(req, { params: Promise.resolve({ id: fakeId }) });
      expect(res.status).toBe(404);
    });

    it("updates lead status and creates audit log", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(identity(["OPERATIONS_ADMIN"]));
      vi.mocked(hasAnyRole).mockReturnValue(true);
      const req = new Request(`http://localhost/api/admin/leads/`, { method: "PATCH", body: JSON.stringify({ status: "CONTACTED", reason: "Called user" }) });
      const res = await LeadsPATCH(req, { params: Promise.resolve({ id: ids.lead }) });
      expect(res.status).toBe(200);
    });

    it("rejects a lead transition that skips required states", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(identity(["OPERATIONS_ADMIN"]));
      vi.mocked(hasAnyRole).mockReturnValue(true);
      const req = new Request(`http://localhost/api/admin/leads/`, { method: "PATCH", body: JSON.stringify({ status: "CONVERTED", reason: "Skipped" }) });
      const res = await LeadsPATCH(req, { params: Promise.resolve({ id: ids.lead }) });
      expect(res.status).toBe(409);
    });
  });

  describe("Testimonials POST", () => {
    it("returns 401 for anonymous access", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(null);
      const req = new Request(`http://localhost/api/admin/testimonials/`, { method: "POST", body: JSON.stringify({ action: "APPROVED" }) });
      const res = await TestimonialsPOST(req, { params: Promise.resolve({ id: ids.testimonial }) });
      expect(res.status).toBe(401);
    });

    it("returns 403 for unauthorized role", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(identity(["CUSTOMER"]));
      vi.mocked(hasAnyRole).mockReturnValue(false);
      const req = new Request(`http://localhost/api/admin/testimonials/`, { method: "POST", body: JSON.stringify({ action: "APPROVED" }) });
      const res = await TestimonialsPOST(req, { params: Promise.resolve({ id: ids.testimonial }) });
      expect(res.status).toBe(403);
    });

    it("approves testimonial and creates audit log", async () => {
      vi.mocked(getCurrentIdentity).mockResolvedValue(identity(["SUPER_ADMIN"]));
      vi.mocked(hasAnyRole).mockReturnValue(true);
      const req = new Request(`http://localhost/api/admin/testimonials/`, { method: "POST", body: JSON.stringify({ action: "APPROVED", reason: "Great feedback" }) });
      const res = await TestimonialsPOST(req, { params: Promise.resolve({ id: ids.testimonial }) });
      expect(res.status).toBe(200);
    });
  });
});







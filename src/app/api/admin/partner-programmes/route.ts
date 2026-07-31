import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import {
  createProgramme,
  ProgrammeAdminError,
} from "@/modules/b2b/programme-admin";
import { listProgrammes } from "@/modules/b2b/programmes";
import { authorizeApi } from "@/modules/auth/authorization";

export const dynamic = "force-dynamic";

const allowedRoles = ["PARTNER_MANAGER", "SUPER_ADMIN"] as const;
const programmeTypes = [
  "CORPORATE_ACCESS",
  "CORPORATE_MANAGED",
  "CORPORATE_WALLET",
  "SOCIETY_LAUNCH",
  "MANAGED_SOCIETY",
  "TOWNSHIP_DESK",
  "VET_REFERRAL",
  "BRAND_CAMPAIGN",
  "RELOCATION_SUPPORT",
] as const;
const eligibilityMethods = [
  "DOMAIN_EMAIL",
  "OTP_VERIFY",
  "EMPLOYEE_ID",
  "HR_FILE",
  "INVITATION_TOKEN",
  "SOCIETY_APPROVAL",
  "OPEN_ACCESS",
] as const;
const programmeStatuses = [
  "DRAFT_PROGRAMME",
  "ACTIVE_PROGRAMME",
  "PAUSED_PROGRAMME",
  "COMPLETED_PROGRAMME",
  "CANCELLED_PROGRAMME",
] as const;
const domainSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(253)
  .regex(
    /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/,
  );
const metadataSchema = z
  .record(z.unknown())
  .refine((value) => Object.keys(value).length <= 100, {
    message: "Metadata can contain at most 100 keys.",
  });
const createSchema = z
  .object({
    organizationId: z.string().uuid(),
    contractId: z.string().uuid().optional(),
    name: z.string().trim().min(3).max(160),
    slug: z
      .string()
      .trim()
      .toLowerCase()
      .min(3)
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    programmeType: z.enum(programmeTypes),
    cityScope: z
      .array(z.string().trim().min(2).max(120))
      .min(1)
      .max(50)
      .transform((cities) => Array.from(new Set(cities))),
    eligibilityMethod: z.enum(eligibilityMethods).default("INVITATION_TOKEN"),
    eligibilityDomain: domainSchema.optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    accountManagerId: z.string().uuid().optional(),
    supportTier: z.string().trim().min(2).max(80).optional(),
    metadata: metadataSchema.optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (
      value.startDate &&
      value.endDate &&
      value.endDate <= value.startDate
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be after the start date.",
      });
    }
    if (
      value.eligibilityMethod === "DOMAIN_EMAIL" &&
      !value.eligibilityDomain
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eligibilityDomain"],
        message: "A verified domain is required for domain-email eligibility.",
      });
    }
    if (
      value.eligibilityMethod !== "DOMAIN_EMAIL" &&
      value.eligibilityDomain
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["eligibilityDomain"],
        message: "Eligibility domain is only valid for domain-email programmes.",
      });
    }
  });
const listSchema = z
  .object({
    organizationId: z.string().uuid().optional(),
    status: z.enum(programmeStatuses).optional(),
    type: z.enum(programmeTypes).optional(),
    page: z.coerce.number().int().min(1).max(10_000).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export async function GET(request: Request) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  const url = new URL(request.url);
  const parsed = listSchema.safeParse({
    organizationId: url.searchParams.get("organizationId") ?? undefined,
    status: url.searchParams.get("status") ?? undefined,
    type: url.searchParams.get("type") ?? undefined,
    page: url.searchParams.get("page") ?? undefined,
    pageSize: url.searchParams.get("pageSize") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_query", issues: parsed.error.flatten() },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const result = await listProgrammes(parsed.data);
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    logger.error(error instanceof Error ? error : "ProgrammeListError", {
      event: "admin.partner_programme.list_failed",
      actorId: authorization.identity.id,
    });
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(request: Request) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  const parsed = createSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_request", issues: parsed.error.flatten() },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const programme = await createProgramme(parsed.data, {
      ...authorization.identity,
      requestId: request.headers.get("x-request-id"),
    });
    return NextResponse.json(
      { programme },
      {
        status: 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    if (error instanceof ProgrammeAdminError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        {
          status: error.status,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
    logger.error(error instanceof Error ? error : "ProgrammeCreateError", {
      event: "admin.partner_programme.create_failed",
      actorId: authorization.identity.id,
      organizationId: parsed.data.organizationId,
    });
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

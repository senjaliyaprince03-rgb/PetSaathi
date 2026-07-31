import { NextResponse } from "next/server";
import { z } from "zod";

import { logger } from "@/lib/logger";
import { adminResourceIdSchema } from "@/modules/admin/mutation";
import { authorizeApi } from "@/modules/auth/authorization";
import {
  ProgrammeAdminError,
  updateProgramme,
} from "@/modules/b2b/programme-admin";

export const dynamic = "force-dynamic";

const allowedRoles = ["PARTNER_MANAGER", "SUPER_ADMIN"] as const;
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
const updateSchema = z
  .object({
    name: z.string().trim().min(3).max(160).optional(),
    cityScope: z
      .array(z.string().trim().min(2).max(120))
      .min(1)
      .max(50)
      .transform((cities) => Array.from(new Set(cities)))
      .optional(),
    eligibilityDomain: domainSchema.nullable().optional(),
    supportTier: z.string().trim().min(2).max(80).nullable().optional(),
    startDate: z.coerce.date().nullable().optional(),
    endDate: z.coerce.date().nullable().optional(),
    accountManagerId: z.string().uuid().nullable().optional(),
    metadata: metadataSchema.optional(),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one programme field is required.",
  })
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
  });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authorization = await authorizeApi(allowedRoles);
  if (!authorization.authorized) return authorization.response;

  const id = adminResourceIdSchema.safeParse((await params).id);
  const input = updateSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!id.success || !input.success) {
    return NextResponse.json(
      {
        error: "invalid_request",
        ...(!input.success ? { issues: input.error.flatten() } : {}),
      },
      { status: 422, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const programme = await updateProgramme(id.data, input.data, {
      ...authorization.identity,
      requestId: request.headers.get("x-request-id"),
    });
    return NextResponse.json(
      { programme },
      { headers: { "Cache-Control": "no-store" } },
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
    logger.error(error instanceof Error ? error : "ProgrammeUpdateError", {
      event: "admin.partner_programme.update_failed",
      actorId: authorization.identity.id,
      programmeId: id.data,
    });
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

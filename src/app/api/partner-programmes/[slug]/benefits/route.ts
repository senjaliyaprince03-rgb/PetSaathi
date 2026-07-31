import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { authorizeApi } from "@/modules/auth/authorization";
import {
  getCurrentProgrammeEntitlement,
  ProgrammeEntitlementError,
} from "@/modules/b2b/programme-entitlement";

export const dynamic = "force-dynamic";

const slugSchema = z
  .string()
  .trim()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  .max(120);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const authorization = await authorizeApi(["CUSTOMER"]);
  if (!authorization.authorized) return authorization.response;

  const slug = slugSchema.safeParse((await params).slug);
  if (!slug.success) {
    return NextResponse.json(
      { error: "programme_not_found" },
      { status: 404, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const entitlement = await getCurrentProgrammeEntitlement(
      slug.data,
      authorization.identity.id,
    );
    const wallet = entitlement.membership.wallet;
    const latestEntry = wallet
      ? await prisma.benefitLedgerEntry.findFirst({
          where: { walletId: wallet.id },
          orderBy: [{ createdAt: "desc" }, { id: "desc" }],
          select: { balanceAfter: true },
        })
      : null;

    return NextResponse.json(
      {
        status: entitlement.membership.verificationStatus,
        joinedAt: entitlement.membership.createdAt,
        eligibilityExpiry: entitlement.membership.eligibilityExpiry,
        wallet: wallet
          ? {
              id: wallet.id,
              status: wallet.status,
              expiresAt: wallet.expiresAt,
              balancePaise: latestEntry?.balanceAfter ?? 0,
            }
          : null,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof ProgrammeEntitlementError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        {
          status: error.status,
          headers: { "Cache-Control": "no-store" },
        },
      );
    }
    logger.error(error instanceof Error ? error : "ProgrammeBenefitsError", {
      event: "programme.benefits_lookup_failed",
      actorId: authorization.identity.id,
      programmeSlug: slug.data,
    });
    return NextResponse.json(
      { error: "internal_error" },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

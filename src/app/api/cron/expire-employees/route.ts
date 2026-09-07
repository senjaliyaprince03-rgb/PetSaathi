import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";

import { timingSafeEqual } from "node:crypto";

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!secret || !token || secret.length !== token.length || !timingSafeEqual(Buffer.from(secret), Buffer.from(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    // Find sitters (employees) pending for more than 24 hours
    const expiredProfiles = await prisma.sitterProfile.findMany({
      where: {
        status: "APPLICANT",
        applicationAt: {
          lt: twentyFourHoursAgo
        }
      },
      include: { user: true }
    });

    for (const profile of expiredProfiles) {
      await prisma.sitterProfile.update({
        where: { id: profile.id },
        data: { status: "REJECTED" } // Using REJECTED as a fallback for expired
      });

      logger.info("Employee application expired without admin review", {
        userId: profile.user.id,
        email: profile.user.email,
      });
    }

    return NextResponse.json({ success: true, processedCount: expiredProfiles.length });
  } catch (error) {
    logger.exception("cron.expire_employees_failed", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

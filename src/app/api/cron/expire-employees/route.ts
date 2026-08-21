import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  // Ensure this is called from a trusted source (e.g. cron service with a secret key)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
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

      console.log(`[EMAIL to Employee] Your employee request has expired without admin review. Please contact support. (User: ${profile.user.email})`);
    }

    return NextResponse.json({ success: true, processedCount: expiredProfiles.length });
  } catch (error) {
    console.error("[CRON ERROR]", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

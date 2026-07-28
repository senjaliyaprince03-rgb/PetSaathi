/* eslint-disable */
import type { NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { getCurrentIdentity } from "@/modules/auth/session";
import { getProgrammeBySlug } from "@/modules/b2b/programmes";
import { getBalance } from "@/modules/b2b/wallets";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const identity = await getCurrentIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await params;

  try {
    const programme = await getProgrammeBySlug(slug);
    
    const membership = await prisma.programmeMembership.findUnique({
      where: {
        programmeId_customerId: {
          programmeId: programme.id,
          customerId: identity.id,
        },
      },
      include: {
        wallet: true,
      },
    });

    if (!membership) {
      return NextResponse.json({ error: "Not enrolled" }, { status: 404 });
    }

    let walletBalance = 0;
    if (membership.wallet) {
      walletBalance = await getBalance(membership.wallet.id);
    }

    return NextResponse.json({
      status: membership.verificationStatus,
      joinedAt: membership.createdAt,
      wallet: membership.wallet ? {
        id: membership.wallet.id,
        status: membership.wallet.status,
        balancePaise: walletBalance,
      } : null,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch benefits" }, { status: 400 });
  }
}
